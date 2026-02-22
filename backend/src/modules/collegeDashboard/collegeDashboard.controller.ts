import { Request, Response } from 'express';
import { CollegeDashboardService } from './collegeDashboard.service';

export const collegeDashboardController = {
    getOverview: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;
            const data = await CollegeDashboardService.getOverview(collegeId);
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Overview Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch overview data' });
        }
    },

    getPerformanceAnalytics: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;
            const data = await CollegeDashboardService.getPerformanceAnalytics(collegeId);
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Performance Analytics Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch performance analytics' });
        }
    },

    getStudentSegmentation: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;
            const data = await CollegeDashboardService.getStudentSegmentation(collegeId);
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Student Segmentation Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch student segmentation' });
        }
    },

    getIntegrityAnalytics: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;
            const data = await CollegeDashboardService.getIntegrityAnalytics(collegeId);
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Integrity Analytics Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch integrity analytics' });
        }
    },

    getProblemAnalytics: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;
            const data = await CollegeDashboardService.getProblemAnalytics(collegeId);
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Problem Analytics Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch problem analytics' });
        }
    },

    getLeaderboard: async (req: Request, res: Response) => {
        try {
            const collegeId = req.params.collegeId as string;
            const data = await CollegeDashboardService.getLeaderboard(collegeId);
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Leaderboard Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch college leaderboard' });
        }
    }
};
