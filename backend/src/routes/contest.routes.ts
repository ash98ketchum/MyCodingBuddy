// backend/src/routes/contest.routes.ts
import { Router } from 'express';
import * as contestController from '../controllers/contest.controller';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes (optionalAuth to detect logged-in user)
router.get('/', contestController.listContests);
router.get('/:slug', optionalAuth, contestController.getContest);
router.get('/:id/leaderboard', contestController.getLeaderboard);

// Authenticated user routes
router.post('/:id/register', authenticate, contestController.registerForContest);
router.delete('/:id/register', authenticate, contestController.unregisterFromContest);
router.get('/:id/my-status', authenticate, contestController.getMyStatus);

// Admin routes — CRUD
router.post('/', authenticate, contestController.createContest);
router.put('/:id', authenticate, contestController.updateContest);
router.delete('/:id', authenticate, contestController.deleteContest);

// Admin routes — Announcements
router.post('/:id/announcements', authenticate, contestController.sendAnnouncement);
router.get('/:id/announcements', authenticate, contestController.getAnnouncements);

// Admin routes — Participants management
router.get('/:id/participants', authenticate, contestController.getContestParticipants);
router.post('/:id/participants/:userId/ban', authenticate, contestController.banParticipant);
router.delete('/:id/participants/:userId/ban', authenticate, contestController.unbanParticipant);
router.get('/:id/participants/:userId/solutions', authenticate, contestController.getParticipantSolutions);

export default router;
