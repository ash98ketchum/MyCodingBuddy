// backend/src/routes/submission.routes.ts
import { Router } from 'express';
import {
  submitCode,
  getSubmission,
  getUserSubmissions,
  getSubmissionStatus,
  getLeaderboard,
} from '@/controllers/submission.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { z } from 'zod';

const router = Router();

const submitCodeSchema = z.object({
  body: z.object({
    problemId: z.string(),
    code: z.string().min(1),
    language: z.enum(['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP', 'C']),
  }),
});

router.post('/', authenticate, validate(submitCodeSchema), submitCode);
router.get('/my', authenticate, getUserSubmissions);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', authenticate, getSubmission);
router.get('/:id/status', getSubmissionStatus);

export default router;
