// backend/src/controllers/vote.controller.ts
import { Request, Response } from 'express';
import prisma from '@/config/database';
import { AppError } from '@/middleware/error';

// Vote on discussion or comment
export const vote = async (req: Request, res: Response) => {
    const { type, discussionId, commentId } = req.body;
    const userId = req.user!.userId;

    if (!['UP', 'DOWN'].includes(type)) {
        throw new AppError('Vote type must be UP or DOWN', 400);
    }

    if (!discussionId && !commentId) {
        throw new AppError('Either discussionId or commentId is required', 400);
    }

    // Check existing vote
    const existingVote = await prisma.vote.findFirst({
        where: {
            userId,
            ...(discussionId && { discussionId }),
            ...(commentId && { commentId }),
        },
    });

    if (existingVote) {
        if (existingVote.type === type) {
            // Same vote - remove it
            await prisma.vote.delete({
                where: { id: existingVote.id },
            });

            // Decrement count
            if (discussionId) {
                await prisma.discussion.update({
                    where: { id: discussionId },
                    data: {
                        [type === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
                    },
                });
            } else if (commentId) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: {
                        [type === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
                    },
                });
            }

            res.json({
                success: true,
                message: 'Vote removed',
                action: 'removed',
            });
        } else {
            // Different vote - change it
            await prisma.vote.update({
                where: { id: existingVote.id },
                data: { type },
            });

            // Update counts (decrement old, increment new)
            if (discussionId) {
                await prisma.discussion.update({
                    where: { id: discussionId },
                    data: {
                        [existingVote.type === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
                        [type === 'UP' ? 'upvotes' : 'downvotes']: { increment: 1 },
                    },
                });
            } else if (commentId) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: {
                        [existingVote.type === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
                        [type === 'UP' ? 'upvotes' : 'downvotes']: { increment: 1 },
                    },
                });
            }

            res.json({
                success: true,
                message: 'Vote updated',
                action: 'updated',
            });
        }
    } else {
        // New vote
        await prisma.vote.create({
            data: {
                type,
                userId,
                discussionId: discussionId || null,
                commentId: commentId || null,
            },
        });

        // Increment count
        if (discussionId) {
            await prisma.discussion.update({
                where: { id: discussionId },
                data: {
                    [type === 'UP' ? 'upvotes' : 'downvotes']: { increment: 1 },
                },
            });
        } else if (commentId) {
            await prisma.comment.update({
                where: { id: commentId },
                data: {
                    [type === 'UP' ? 'upvotes' : 'downvotes']: { increment: 1 },
                },
            });
        }

        res.status(201).json({
            success: true,
            message: 'Vote recorded',
            action: 'added',
        });
    }
};

// Remove vote
export const removeVote = async (req: Request, res: Response) => {
    const { discussionId, commentId } = req.body;
    const userId = req.user!.userId;

    const vote = await prisma.vote.findFirst({
        where: {
            userId,
            ...(discussionId && { discussionId }),
            ...(commentId && { commentId }),
        },
    });

    if (!vote) {
        throw new AppError('Vote not found', 404);
    }

    await prisma.vote.delete({
        where: { id: vote.id },
    });

    // Decrement count
    if (discussionId) {
        await prisma.discussion.update({
            where: { id: discussionId },
            data: {
                [vote.type === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
            },
        });
    } else if (commentId) {
        await prisma.comment.update({
            where: { id: commentId },
            data: {
                [vote.type === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
            },
        });
    }

    res.json({
        success: true,
        message: 'Vote removed',
    });
};
