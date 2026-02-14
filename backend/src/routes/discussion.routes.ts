// backend/src/routes/discussion.routes.ts
import { Router } from 'express';
import {
    getDiscussions,
    getDiscussionById,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    togglePin,
    toggleClose,
} from '@/controllers/discussion.controller';
import {
    createComment,
    updateComment,
    deleteComment,
    markAsAccepted,
} from '@/controllers/comment.controller';
import {
    toggleReaction,
    getReactions,
} from '@/controllers/reaction.controller';
import {
    vote,
    removeVote,
} from '@/controllers/vote.controller';
import { authenticate } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/asyncHandler';

const router = Router();

// Discussion routes
router.get('/discussions', asyncHandler(getDiscussions));
router.get('/discussions/:id', asyncHandler(getDiscussionById));
router.post('/discussions', authenticate, asyncHandler(createDiscussion));
router.put('/discussions/:id', authenticate, asyncHandler(updateDiscussion));
router.delete('/discussions/:id', authenticate, asyncHandler(deleteDiscussion));
router.post('/discussions/:id/pin', authenticate, asyncHandler(togglePin));
router.post('/discussions/:id/close', authenticate, asyncHandler(toggleClose));

// Comment routes
router.post('/discussions/:discussionId/comments', authenticate, asyncHandler(createComment));
router.put('/comments/:id', authenticate, asyncHandler(updateComment));
router.delete('/comments/:id', authenticate, asyncHandler(deleteComment));
router.post('/comments/:id/accept', authenticate, asyncHandler(markAsAccepted));

// Reaction routes
router.post('/reactions', authenticate, asyncHandler(toggleReaction));
router.get('/reactions', asyncHandler(getReactions));

// Vote routes
router.post('/vote', authenticate, asyncHandler(vote));
router.delete('/vote', authenticate, asyncHandler(removeVote));

export default router;
