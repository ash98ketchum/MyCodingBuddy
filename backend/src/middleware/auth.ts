// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '@/utils/jwt';
import prisma from '@/config/database';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required',
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }

  next();
};

export const requireCollegeAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Super admin can access anything
  if (req.user.role === 'ADMIN') {
    return next();
  }

  // Extract collegeId from standard locations
  const collegeId = req.params.collegeId || req.query.collegeId || req.body.collegeId;

  if (!collegeId) {
    return res.status(400).json({
      success: false,
      message: 'collegeId is required for this operation',
    });
  }

  try {
    const isAdmin = await (prisma as any).collegeAdmin.findFirst({
      where: {
        userId: req.user.userId,
        collegeId: collegeId as string
      }
    });

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not an admin for this college',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying college admin privileges',
    });
  }
};
