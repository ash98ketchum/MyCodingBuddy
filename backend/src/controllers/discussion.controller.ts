// backend/src/controllers/discussion.controller.ts
import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import prisma from '@/config/database';
import { AppError } from '@/middleware/error';

// Get all discussions with pagination and filters
export const getDiscussions = async (req: AuthRequest, res: Response) => {
    const { page = '1', limit = '20', problemId, tags, sort = 'recent' } = req.query;

    // Validate sort parameter
    const VALID_SORT_VALUES = ['recent', 'popular', 'unanswered'] as const;
    if (sort && !VALID_SORT_VALUES.includes(sort as any)) {
        return res.status(400).json({
            success: false,
            message: `Invalid sort parameter. Must be one of: ${VALID_SORT_VALUES.join(', ')}`,
            errorCode: 'INVALID_SORT_PARAM'
        });
    }

    // Validate and parse pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
            success: false,
            message: 'Invalid page number. Must be a positive integer.',
            errorCode: 'INVALID_PAGE'
        });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return res.status(400).json({
            success: false,
            message: 'Invalid limit. Must be between 1 and 100.',
            errorCode: 'INVALID_LIMIT'
        });
    }

    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (problemId && typeof problemId === 'string') {
        where.problemId = problemId;
    }

    if (tags && typeof tags === 'string') {
        // Simple tag search (contains)
        where.tags = {
            contains: tags,
        };
    }

    // Safe orderBy construction with switch
    let orderBy: any;
    switch (sort) {
        case 'popular':
            orderBy = { viewCount: 'desc' };
            break;
        case 'unanswered':
            orderBy = { createdAt: 'desc' };
            where.comments = { none: {} };
            break;
        case 'recent':
        default:
            orderBy = { createdAt: 'desc' };
            break;
    }

    const [discussions, total] = await Promise.all([
        prisma.discussion.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                        rating: true,
                    },
                },
                problem: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        difficulty: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        reactions: true,
                    },
                },
            },
            orderBy,
            skip,
            take: limitNum,
        }),
        prisma.discussion.count({ where }),
    ]);

    res.json({
        success: true,
        data: {
            discussions,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            },
        },
    });
};

// Get single discussion by ID
export const getDiscussionById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
        throw new AppError('Discussion ID is required', 400);
    }

    const discussion = await prisma.discussion.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    fullName: true,
                    avatar: true,
                    rating: true,
                },
            },
            problem: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    difficulty: true,
                },
            },
            comments: {
                where: { parentId: null }, // Only top-level comments
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            rating: true,
                        },
                    },
                    replies: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatar: true,
                                    rating: true,
                                },
                            },
                            reactions: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            username: true,
                                        },
                                    },
                                },
                            },
                            votes: true,
                        },
                    },
                    reactions: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                },
                            },
                        },
                    },
                    votes: true,
                },
                orderBy: [
                    { isAccepted: 'desc' },
                    { upvotes: 'desc' },
                    { createdAt: 'asc' },
                ],
            },
            reactions: {
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            },
            votes: true,
        },
    });

    if (!discussion) {
        throw new AppError('Discussion not found', 404);
    }

    // Increment view count
    await prisma.discussion.update({
        where: { id },
        data: {
            viewCount: { increment: 1 },
        },
    });

    res.json({
        success: true,
        data: {
            discussion,
        },
    });
};

// Create new discussion
export const createDiscussion = async (req: AuthRequest, res: Response) => {
    const { title, content, problemId, tags } = req.body;
    const userId = req.user!.userId;

    const discussion = await prisma.discussion.create({
        data: {
            title,
            content,
            userId,
            problemId: problemId || null,
            tags: tags || '',
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    rating: true,
                },
            },
            problem: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
    });

    res.status(201).json({
        success: true,
        data: discussion,
    });
};

// Update discussion
export const updateDiscussion = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.user!.userId;

    if (!id || typeof id !== 'string') {
        throw new AppError('Discussion ID is required', 400);
    }

    const discussion = await prisma.discussion.findUnique({
        where: { id },
    });

    if (!discussion) {
        throw new AppError('Discussion not found', 404);
    }

    if (discussion.userId !== userId) {
        throw new AppError('You can only update your own discussions', 403);
    }

    const updated = await prisma.discussion.update({
        where: { id },
        data: {
            title,
            content,
            tags,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
        },
    });

    res.json({
        success: true,
        data: updated,
    });
};

// Delete discussion
export const deleteDiscussion = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    if (!id || typeof id !== 'string') {
        throw new AppError('Discussion ID is required', 400);
    }

    const discussion = await prisma.discussion.findUnique({
        where: { id },
    });

    if (!discussion) {
        throw new AppError('Discussion not found', 404);
    }

    // Only owner or admin can delete
    if (discussion.userId !== userId && userRole !== 'ADMIN') {
        throw new AppError('You can only delete your own discussions', 403);
    }

    await prisma.discussion.delete({
        where: { id },
    });

    res.json({
        success: true,
        message: 'Discussion deleted successfully',
    });
};

// Toggle pin (admin only)
export const togglePin = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userRole = req.user!.role;

    if (!id || typeof id !== 'string') {
        throw new AppError('Discussion ID is required', 400);
    }

    if (userRole !== 'ADMIN') {
        throw new AppError('Only admins can pin discussions', 403);
    }

    const discussion = await prisma.discussion.findUnique({
        where: { id },
    });

    if (!discussion) {
        throw new AppError('Discussion not found', 404);
    }

    const updated = await prisma.discussion.update({
        where: { id },
        data: {
            isPinned: !discussion.isPinned,
        },
    });

    res.json({
        success: true,
        data: updated,
    });
};

// Toggle close
export const toggleClose = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    if (!id || typeof id !== 'string') {
        throw new AppError('Discussion ID is required', 400);
    }

    const discussion = await prisma.discussion.findUnique({
        where: { id },
    });

    if (!discussion) {
        throw new AppError('Discussion not found', 404);
    }

    // Only owner or admin can close
    if (discussion.userId !== userId && userRole !== 'ADMIN') {
        throw new AppError('You can only close your own discussions', 403);
    }

    const updated = await prisma.discussion.update({
        where: { id },
        data: {
            isClosed: !discussion.isClosed,
        },
    });

    res.json({
        success: true,
        data: updated,
    });
};
