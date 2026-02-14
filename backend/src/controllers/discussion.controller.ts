// backend/src/controllers/discussion.controller.ts
import { Request, Response } from 'express';
import prisma from '@/config/database';
import { AppError } from '@/middleware/error';

// Get all discussions with pagination and filters
export const getDiscussions = async (req: Request, res: Response) => {
    const { page = '1', limit = '20', problemId, tags, sort = 'recent' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (problemId) {
        where.problemId = problemId as string;
    }

    if (tags) {
        // Simple tag search (contains)
        where.tags = {
            contains: tags as string,
        };
    }

    let orderBy: any = { createdAt: 'desc' }; // Default: recent

    if (sort === 'popular') {
        orderBy = { viewCount: 'desc' };
    } else if (sort === 'unanswered') {
        orderBy = { createdAt: 'desc' };
        where.comments = { none: {} };
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
export const getDiscussionById = async (req: Request, res: Response) => {
    const { id } = req.params;

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
        data: discussion,
    });
};

// Create new discussion
export const createDiscussion = async (req: Request, res: Response) => {
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
export const updateDiscussion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.user!.userId;

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
export const deleteDiscussion = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

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
export const togglePin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userRole = req.user!.role;

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
export const toggleClose = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

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
