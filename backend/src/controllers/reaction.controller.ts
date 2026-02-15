// backend/src/controllers/reaction.controller.ts
import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import prisma from '@/config/database';
import { AppError } from '@/middleware/error';

// Toggle reaction (add or remove)
export const toggleReaction = async (req: AuthRequest, res: Response) => {
    const { emoji, discussionId, commentId } = req.body;
    const userId = req.user!.userId;

    if (!emoji) {
        throw new AppError('Emoji is required', 400);
    }

    if (!discussionId && !commentId) {
        throw new AppError('Either discussionId or commentId is required', 400);
    }

    // Check if entity exists
    if (discussionId) {
        const discussion = await prisma.discussion.findUnique({
            where: { id: discussionId },
        });
        if (!discussion) {
            throw new AppError('Discussion not found', 404);
        }
    }

    if (commentId) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw new AppError('Comment not found', 404);
        }
    }

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findFirst({
        where: {
            emoji,
            userId,
            ...(discussionId && { discussionId }),
            ...(commentId && { commentId }),
        },
    });

    if (existingReaction) {
        // Remove reaction
        await prisma.reaction.delete({
            where: { id: existingReaction.id },
        });

        res.json({
            success: true,
            message: 'Reaction removed',
            action: 'removed',
        });
    } else {
        // Add reaction
        const reaction = await prisma.reaction.create({
            data: {
                emoji,
                userId,
                discussionId: discussionId || null,
                commentId: commentId || null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            data: reaction,
            action: 'added',
        });
    }
};

// Get reactions for discussion or comment
export const getReactions = async (req: AuthRequest, res: Response) => {
    const { discussionId, commentId } = req.query;

    if (!discussionId && !commentId) {
        throw new AppError('Either discussionId or commentId is required', 400);
    }

    const reactions = await prisma.reaction.findMany({
        where: {
            ...(discussionId && { discussionId: discussionId as string }),
            ...(commentId && { commentId: commentId as string }),
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                },
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
    });

    // Group by emoji
    const grouped = reactions.reduce((acc: any, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = {
                emoji: reaction.emoji,
                count: 0,
                users: [],
            };
        }
        acc[reaction.emoji].count++;
        acc[reaction.emoji].users.push({
            id: reaction.user.id,
            username: reaction.user.username,
        });
        return acc;
    }, {});

    res.json({
        success: true,
        data: Object.values(grouped),
    });
};
