// backend/src/controllers/contest.controller.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as contestService from '../services/contest.service';

// GET /api/contests
export const listContests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { status, type, page, limit } = req.query;
        const result = await contestService.listContests({
            status: status as any,
            type: type as any,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
        });
        res.json({ success: true, data: result.contests, pagination: result.pagination });
    } catch (err) {
        next(err);
    }
};

// GET /api/contests/:slug
export const getContest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        const contest = await contestService.getContestBySlug((req.params.slug as string), userId);
        if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });
        res.json({ success: true, data: contest });
    } catch (err) {
        next(err);
    }
};

// POST /api/contests (Admin)
export const createContest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const contest = await contestService.createContest(req.body);
        res.status(201).json({ success: true, data: contest });
    } catch (err) {
        next(err);
    }
};

// PUT /api/contests/:id (Admin)
export const updateContest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const contest = await contestService.updateContest((req.params.id as string), req.body);
        res.json({ success: true, data: contest });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/contests/:id (Admin)
export const deleteContest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await contestService.deleteContest((req.params.id as string));
        res.json({ success: true, message: 'Contest deleted' });
    } catch (err) {
        next(err);
    }
};

// POST /api/contests/:id/register
export const registerForContest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const participant = await contestService.registerForContest((req.params.id as string), userId);
        res.status(201).json({ success: true, data: participant });
    } catch (err: any) {
        if (err.message === 'Already registered') {
            return res.status(409).json({ success: false, message: err.message });
        }
        next(err);
    }
};

// DELETE /api/contests/:id/register
export const unregisterFromContest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        await contestService.unregisterFromContest((req.params.id as string), userId);
        res.json({ success: true, message: 'Unregistered from contest' });
    } catch (err: any) {
        if (err.message === 'Cannot unregister from an active contest') {
            return res.status(400).json({ success: false, message: err.message });
        }
        next(err);
    }
};

// GET /api/contests/:id/leaderboard
export const getLeaderboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const leaderboard = await contestService.getContestLeaderboard((req.params.id as string));
        res.json({ success: true, data: leaderboard });
    } catch (err) {
        next(err);
    }
};

// GET /api/contests/:id/my-status
export const getMyStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const status = await contestService.getUserContestStatus((req.params.id as string), userId);
        res.json({ success: true, data: status });
    } catch (err) {
        next(err);
    }
};

// ─── Admin Endpoints ──────────────────────────────────────────────────────────

// POST /api/contests/:id/announcements
export const sendAnnouncement = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { title, message } = req.body;
        if (!title || !message) return res.status(400).json({ success: false, message: 'Title and message are required' });
        const announcement = await contestService.sendAnnouncement((req.params.id as string), title, message);
        res.status(201).json({ success: true, data: announcement });
    } catch (err) {
        next(err);
    }
};

// GET /api/contests/:id/announcements
export const getAnnouncements = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const announcements = await contestService.getAnnouncements((req.params.id as string));
        res.json({ success: true, data: announcements });
    } catch (err) {
        next(err);
    }
};

// GET /api/contests/:id/participants
export const getContestParticipants = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const participants = await contestService.getContestParticipants((req.params.id as string));
        res.json({ success: true, data: participants });
    } catch (err) {
        next(err);
    }
};

// POST /api/contests/:id/participants/:userId/ban
export const banParticipant = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { reason } = req.body;
        const result = await contestService.banParticipant((req.params.id as string), (req.params.userId as string), reason);
        res.json({ success: true, data: result, message: 'Participant banned' });
    } catch (err: any) {
        if (err.message === 'Participant not found') return res.status(404).json({ success: false, message: err.message });
        next(err);
    }
};

// DELETE /api/contests/:id/participants/:userId/ban
export const unbanParticipant = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await contestService.unbanParticipant((req.params.id as string), (req.params.userId as string));
        res.json({ success: true, data: result, message: 'Participant unbanned' });
    } catch (err: any) {
        if (err.message === 'Participant not found') return res.status(404).json({ success: false, message: err.message });
        next(err);
    }
};

// GET /api/contests/:id/participants/:userId/solutions
export const getParticipantSolutions = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const result = await contestService.getParticipantSolutions((req.params.id as string), (req.params.userId as string));
        res.json({ success: true, data: result });
    } catch (err: any) {
        if (err.message === 'Participant not found') return res.status(404).json({ success: false, message: err.message });
        next(err);
    }
};
