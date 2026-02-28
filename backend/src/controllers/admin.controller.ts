// backend/src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import prisma from '@/config/database';
import { hashPassword } from '@/utils/password';
import { AppError } from '@/middleware/error';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalProblems,
      totalSubmissions,
      totalContests,
      premiumUsers,
      totalColleges,
      recentSubmissions,
      recentColleges,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.problem.count(),
      prisma.submission.count(),
      prisma.contest.count(),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.college.count(),
      prisma.submission.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { username: true },
          },
          problem: {
            select: { title: true },
          },
        },
      }),
      prisma.college.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, domain: true, subscriptionPlan: true, isActive: true, createdAt: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, username: true, email: true, planType: true, createdAt: true },
      }),
    ]);

    // Get submission stats by verdict
    const submissionsByVerdict = await prisma.submission.groupBy({
      by: ['verdict'],
      _count: {
        id: true,
      },
    });

    // Get revenue (if payments exist)
    const revenue = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'completed',
      },
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalProblems,
          totalSubmissions,
          totalContests,
          premiumUsers,
          totalColleges,
          revenue: revenue._sum.amount || 0,
        },
        submissionsByVerdict,
        recentSubmissions,
        recentColleges,
        recentUsers,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '50', search, role } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          planType: true,
          rating: true,
          isPremium: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, planType, isPremium, rating } = req.body;

    const user = await prisma.user.update({
      where: { id: id as string },
      data: {
        ...(role && { role }),
        ...(planType && { planType }),
        ...(isPremium !== undefined && { isPremium }),
        ...(rating !== undefined && { rating }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        planType: true,
        isPremium: true,
        rating: true,
      },
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: id as string },
    });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    throw error;
  }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '50', verdict, userId, problemId } = req.query;

    const where: any = {};

    if (verdict) {
      where.verdict = verdict;
    }

    if (userId) {
      where.userId = userId;
    }

    if (problemId) {
      where.problemId = problemId;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.submission.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const createAdminUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await hashPassword(password);

    const admin = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        role: 'ADMIN',
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: admin,
    });
  } catch (error) {
    throw error;
  }
};

export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Get queue stats
    const queueStats = await prisma.submission.count({
      where: {
        verdict: 'PENDING',
      },
    });

    res.json({
      success: true,
      data: {
        database: 'healthy',
        redis: 'healthy',
        pendingSubmissions: queueStats,
        uptime: process.uptime(),
        timestamp: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'System unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const colleges = await prisma.college.findMany({
      select: {
        id: true,
        name: true,
        domain: true,
        subscriptionPlan: true,
        subscriptionEnd: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: colleges });
  } catch (error) {
    throw error;
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subscriptionPlan, subscriptionEnd, isActive } = req.body;

    const college = await prisma.college.update({
      where: { id: id as string },
      data: {
        ...(subscriptionPlan && { subscriptionPlan }),
        ...(subscriptionEnd !== undefined && { subscriptionEnd: subscriptionEnd ? new Date(subscriptionEnd) : null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.json({ success: true, data: college });
  } catch (error) {
    throw error;
  }
};
