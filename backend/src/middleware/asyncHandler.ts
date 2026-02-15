// backend/src/middleware/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Promise.resolve(fn(req, res, next));
        } catch (error: any) {
            // Production-grade error logging
            console.error('[API Error]', {
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.path,
                query: req.query,
                userId: (req as any).user?.userId || 'anonymous',
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });

            // Structured error response
            const statusCode = error.statusCode || error.status || 500;
            const message = error.message || 'Internal server error';
            const errorCode = error.code || 'INTERNAL_ERROR';

            res.status(statusCode).json({
                success: false,
                message,
                errorCode,
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            });
        }
    };
};
