// backend/src/controllers/submission.controller.ts
import { Request, Response } from 'express';
import prisma from '@/config/database';
import { AppError } from '@/middleware/error';
import { addSubmissionToQueue } from '@/services/judge.service';

export const submitCode = async (req: any, res: Response) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user.userId;

    // Check if problem exists
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        testCases: true,
      },
    });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        code,
        language,
        verdict: 'PENDING',
        totalTestCases: problem.testCases.length,
      },
    });

    // Add to judge queue
    await addSubmissionToQueue({
      submissionId: submission.id,
      problemId: problem.id,
      code,
      language,
      testCases: problem.testCases,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
    });

    res.status(201).json({
      success: true,
      message: 'Code submitted successfully',
      data: {
        submissionId: submission.id,
        status: 'PENDING',
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getSubmission = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    // Check if user owns the submission or is admin
    if (submission.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      throw new AppError('Unauthorized access', 403);
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    throw error;
  }
};

export const getUserSubmissions = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { page = '1', limit = '20', problemId, verdict } = req.query;

    const where: any = { userId };

    if (problemId) {
      where.problemId = problemId;
    }

    if (verdict) {
      where.verdict = verdict;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
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

export const getSubmissionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        verdict: true,
        executionTime: true,
        memoryUsed: true,
        testCasesPassed: true,
        totalTestCases: true,
        errorMessage: true,
        score: true,
        testResults: true,
      },
    });

    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    throw error;
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { limit = '50' } = req.query;

    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        rating: true,
        country: true,
        avatar: true,
        _count: {
          select: {
            submissions: {
              where: {
                verdict: 'ACCEPTED',
              },
            },
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
      take: parseInt(limit as string),
    });

    res.json({
      success: true,
      data: users.map((user, index) => ({
        rank: index + 1,
        ...user,
        problemsSolved: user._count.submissions,
      })),
    });
  } catch (error) {
    throw error;
  }
};
