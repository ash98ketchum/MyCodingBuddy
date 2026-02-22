// backend/src/controllers/vote.controller.ts
import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth';
import prisma from '@/config/database';
import { AppError } from '@/middleware/error';

// Vote on discussion or comment
export const vote = async (req: AuthRequest, res: Response) => {
    const { type, discussionId, commentId } = req.body;
    const userId = req.user!.userId;

    if (!['UP', 'DOWN'].includes(type)) {
        throw new AppError('Vote type must be UP or DOWN', 400);
    }

    if (!discussionId && !commentId) {
        throw new AppError('Either discussionId or commentId is required', 400);
    }

    const voteValue = type === 'UP' ? 1 : -1;

    // Check existing vote
    const existingVote: any = await (prisma as any).vote.findFirst({
        where: {
            userId,
            ...(discussionId && { discussionId }),
            ...(commentId && { commentId }),
        },
    });

    if (existingVote) {
        if (existingVote.value === voteValue || existingVote.type === type) {
            // Same vote - remove it
            await (prisma as any).vote.delete({
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
            await (prisma as any).vote.update({
                where: { id: existingVote.id },
                data: { value: voteValue, type: type }, // Using `any` helps bypass missing strict typings
            });

            // Update counts (decrement old, increment new)
            const oldType = existingVote.value === 1 || existingVote.type === 'UP' ? 'UP' : 'DOWN';
            if (discussionId) {
                await prisma.discussion.update({
                    where: { id: discussionId },
                    data: {
                        [oldType === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
                        [type === 'UP' ? 'upvotes' : 'downvotes']: { increment: 1 },
                    },
                });
            } else if (commentId) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: {
                        [oldType === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
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
        await (prisma as any).vote.create({
            data: {
                value: voteValue,
                type: type, // Adding fallback string `type` so older DBs or dynamic JSON fields don't skip logic
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
export const removeVote = async (req: AuthRequest, res: Response) => {
    const { discussionId, commentId } = req.body;
    const userId = req.user!.userId;

    const vote: any = await (prisma as any).vote.findFirst({
        where: {
            userId,
            ...(discussionId && { discussionId }),
            ...(commentId && { commentId }),
        },
    });

    if (!vote) {
        throw new AppError('Vote not found', 404);
    }

    await (prisma as any).vote.delete({
        where: { id: vote.id },
    });

    // Decrement count
    const voteType = vote.value === 1 || vote.type === 'UP' ? 'UP' : 'DOWN';
    if (discussionId) {
        await prisma.discussion.update({
            where: { id: discussionId },
            data: {
                [voteType === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
            },
        });
    } else if (commentId) {
        await prisma.comment.update({
            where: { id: commentId },
            data: {
                [voteType === 'UP' ? 'upvotes' : 'downvotes']: { decrement: 1 },
            },
        });
    }

    res.json({
        success: true,
        message: 'Vote removed',
    });
};
