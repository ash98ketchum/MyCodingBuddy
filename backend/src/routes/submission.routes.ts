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
import { publicLimiter } from '@/middleware/rateLimiter';
import { z } from 'zod';

const router = Router();

const submitCodeSchema = z.object({
  body: z.object({
    problemId: z.string(),
    code: z.string().min(1),
    language: z.enum(['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP', 'C']),
    sampleOnly: z.boolean().optional(),
  }),
});

router.post('/', authenticate, validate(submitCodeSchema), submitCode);
router.get('/my', authenticate, getUserSubmissions);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', authenticate, getSubmission);
// Status endpoint uses relaxed publicLimiter (500/15min) — NOT the strict submissionLimiter (30/15min)
// This prevents 429 errors during result polling
router.get('/:id/status', publicLimiter, getSubmissionStatus);

export default router;
