// backend/src/controllers/comment.controller.ts
import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import prisma from '@/config/database';
import { AppError } from '@/middleware/error';

// Create comment
export const createComment = async (req: AuthRequest, res: Response) => {
    const { discussionId, content, parentId } = req.body;
    const userId = req.user!.userId;

    // Check if discussion exists
    const discussion = await prisma.discussion.findUnique({
        where: { id: discussionId },
    });

    if (!discussion) {
        throw new AppError('Discussion not found', 404);
    }

    if (discussion.isClosed) {
        throw new AppError('Cannot comment on closed discussion', 403);
    }

    // If parentId provided, check if parent comment exists
    if (parentId) {
        const parentComment = await prisma.comment.findUnique({
            where: { id: parentId },
        });

        if (!parentComment) {
            throw new AppError('Parent comment not found', 404);
        }

        if (parentComment.discussionId !== discussionId) {
            throw new AppError('Parent comment belongs to different discussion', 400);
        }
    }

    const comment = await prisma.comment.create({
        data: {
            content,
            userId,
            discussionId,
            parentId: parentId || null,
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
        },
    });

    res.status(201).json({
        success: true,
        data: comment,
    });
};

// Update comment
export const updateComment = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.userId;

    if (!id || typeof id !== 'string') {
        throw new AppError('Comment ID is required', 400);
    }

    const comment = await prisma.comment.findUnique({
        where: { id },
    });

    if (!comment) {
        throw new AppError('Comment not found', 404);
    }

    if (comment.userId !== userId) {
        throw new AppError('You can only update your own comments', 403);
    }

    const updated = await prisma.comment.update({
        where: { id },
        data: { content },
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

// Delete comment
export const deleteComment = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const userRole = req.user!.role;

    if (!id || typeof id !== 'string') {
        throw new AppError('Comment ID is required', 400);
    }

    const comment = await prisma.comment.findUnique({
        where: { id },
    });

    if (!comment) {
        throw new AppError('Comment not found', 404);
    }

    // Only owner or admin can delete
    if (comment.userId !== userId && userRole !== 'ADMIN') {
        throw new AppError('You can only delete your own comments', 403);
    }

    await prisma.comment.delete({
        where: { id },
    });

    res.json({
        success: true,
        message: 'Comment deleted successfully',
    });
};

// Mark comment as accepted solution
export const markAsAccepted = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;

    if (!id || typeof id !== 'string') {
        throw new AppError('Comment ID is required', 400);
    }

    const comment = await prisma.comment.findUnique({
        where: { id },
        include: {
            discussion: true,
        },
    });

    if (!comment) {
        throw new AppError('Comment not found', 404);
    }

    // Only discussion author can mark as accepted
    if (comment.discussion!.userId !== userId) {
        throw new AppError('Only discussion author can mark answer as accepted', 403);
    }

    // Unmark previously accepted answer in this discussion
    await prisma.comment.updateMany({
        where: {
            discussionId: comment.discussionId,
            isAccepted: true,
        },
        data: {
            isAccepted: false,
        },
    });

    // Mark this comment as accepted
    const updated = await prisma.comment.update({
        where: { id },
        data: { isAccepted: true },
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
