// backend/src/middleware/collegeRateLimit.ts
import rateLimit from 'express-rate-limit';
import { AuthRequest } from './auth';

export const collegeRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200, // Limit each college to 200 requests per window
    message: 'Too many requests from this college, please try again later.',
    keyGenerator: (req: any) => {
        const authReq = req as AuthRequest;
        // Use the collegeId from the JWT payload if present, else fallback to IP
        return authReq.user?.collegeId ? `college:${authReq.user.collegeId}` : `ip:${req.ip}`;
    },
});
