import { Router } from 'express';
import { collegeDashboardController } from './collegeDashboard.controller';
import { authenticate, requireCollegeAdmin } from '../../middleware/auth';

const router = Router();

import { collegeDashboardV2Controller } from './collegeDashboardV2.controller';
import { collegeInvitationController } from './collegeInvitation.controller';

// --- Public Routes ---
// Must be defined before the auth middleware
router.post('/invitation/opt-out', collegeInvitationController.optOut);

// Dashboard protected by Multi-Tenant College Admin validation
router.use(authenticate, requireCollegeAdmin);

router.get('/:collegeId/overview', collegeDashboardController.getOverview);
router.get('/:collegeId/performance', collegeDashboardController.getPerformanceAnalytics);
router.get('/:collegeId/student-segmentation', collegeDashboardController.getStudentSegmentation);
router.get('/:collegeId/integrity', collegeDashboardController.getIntegrityAnalytics);
router.get('/:collegeId/problems', collegeDashboardController.getProblemAnalytics);
router.get('/:collegeId/leaderboard', collegeDashboardController.getLeaderboard);

// --- Phase 2: AI & Fast KPI Routes ---
router.get('/v2/:collegeId/dashboard', collegeDashboardV2Controller.getDashboardKPIs);
router.get('/v2/:collegeId/students', collegeDashboardV2Controller.getStudentsList);
router.get('/v2/:collegeId/student/:studentId/report', collegeDashboardV2Controller.getStudentAIReport);
router.get('/v2/:collegeId/section-performance', collegeDashboardV2Controller.getSectionPerformance);
router.get('/v2/:collegeId/at-risk', collegeDashboardV2Controller.getAtRiskStudents);

// --- Phase 2: Invitations ---
router.post('/:collegeId/invite-students', collegeInvitationController.inviteStudents);
router.get('/:collegeId/invitations', collegeInvitationController.getInvitations);

export default router;
