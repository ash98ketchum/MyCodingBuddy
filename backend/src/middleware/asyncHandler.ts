// backend/src/middleware/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wraps an async controller so unhandled promise rejections are forwarded
 * to Express's next(err) instead of crashing the process.
 */
export const asyncHandler = (fn: AsyncController) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
