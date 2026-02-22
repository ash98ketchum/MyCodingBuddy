import { Router } from 'express';
import { eodReportsController } from './eodReports.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// Secure admin routes
router.use(authenticate, requireAdmin);

router.post('/generate', eodReportsController.triggerManualReport);
router.get('/download', eodReportsController.downloadReport);
router.get('/status', eodReportsController.getReportStatus);

export default router;
