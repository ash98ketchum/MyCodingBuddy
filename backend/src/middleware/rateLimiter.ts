// backend/src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

const makeRateLimiter = (windowMs: number, max: number, message: string, skip?: (req: Request) => boolean) =>
    rateLimit({
        windowMs,
        max,
        message,
        standardHeaders: true,
        legacyHeaders: false,
        validate: { xForwardedForHeader: false },
        skip: (req) => {
            if (req.method === 'OPTIONS') return true;
            if (skip?.(req)) return true;
            return false;
        },
    });

/** Strict limiter for auth routes: 20 req / 15 min */
export const authLimiter = makeRateLimiter(
    15 * 60 * 1000,
    20,
    'Too many auth attempts. Please try again in 15 minutes.'
);

/**
 * Submission limiter: 60 req / 15 min for POST.
 * Status polling (GET /:id/status) is explicitly skipped — it can fire several
 * times per second while a submission is being evaluated and must never 429.
 */
export const submissionLimiter = makeRateLimiter(
    15 * 60 * 1000,
    60,
    'Submission rate limit reached. Please wait before submitting again.',
    // Skip rate limiting for status/result polling endpoints
    (req) => req.method === 'GET' && /\/[^/]+\/(status|result)$/.test(req.path)
);

/** Relaxed limiter for public read routes: 500 req / 15 min */
export const publicLimiter = makeRateLimiter(
    15 * 60 * 1000,
    500,
    'Too many requests. Please slow down.'
);

/** Default fallback limiter: 200 req / 15 min */
export const defaultLimiter = makeRateLimiter(
    15 * 60 * 1000,
    200,
    'Too many requests from this IP, please try again later.'
);
