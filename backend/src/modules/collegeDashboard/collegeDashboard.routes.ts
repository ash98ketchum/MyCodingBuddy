import { Router } from 'express';
import { collegeDashboardController } from './collegeDashboard.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// Dashboard strictly protected for overall Admins or potentially future College Admins.
router.use(authenticate, requireAdmin);

router.get('/:collegeId/overview', collegeDashboardController.getOverview);
router.get('/:collegeId/performance', collegeDashboardController.getPerformanceAnalytics);
router.get('/:collegeId/student-segmentation', collegeDashboardController.getStudentSegmentation);
router.get('/:collegeId/integrity', collegeDashboardController.getIntegrityAnalytics);
router.get('/:collegeId/problems', collegeDashboardController.getProblemAnalytics);
router.get('/:collegeId/leaderboard', collegeDashboardController.getLeaderboard);

export default router;
