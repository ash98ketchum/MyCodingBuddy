// backend/src/controllers/problem.controller.ts
import { Request, Response } from 'express';
import prisma from '@/config/database';
import { AppError } from '@/middleware/error';

export const getProblems = async (req: Request, res: Response) => {
  try {
    const { difficulty, tags, search, page = '1', limit = '20' } = req.query;

    const where: any = {};

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (tags) {
      const tagArray = (tags as string).split(',');
      where.tags = {
        hasSome: tagArray,
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          rating: true,
          tags: true,
          acceptedCount: true,
          submissionCount: true,
          isFree: true,
          isPremium: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.problem.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        problems,
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

export const getProblem = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const problem = await prisma.problem.findUnique({
      where: { slug: slug as string },
      include: {
        testCases: {
          where: { isSample: true },
          select: {
            id: true,
            input: true,
            expectedOutput: true,
            isSample: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!problem) {
      throw new AppError('Problem not found', 404);
    }

    res.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    throw error;
  }
};

export const createProblem = async (req: any, res: Response) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      sampleInput,
      sampleOutput,
      explanation,
      constraints,
      timeLimit,
      memoryLimit,
      testCases,
    } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug exists
    const existingProblem = await prisma.problem.findUnique({
      where: { slug },
    });

    if (existingProblem) {
      throw new AppError('Problem with this title already exists', 400);
    }

    const problem = await prisma.problem.create({
      data: {
        title,
        slug,
        description,
        difficulty,
        tags,
        sampleInput,
        sampleOutput,
        explanation,
        constraints,
        timeLimit: timeLimit || 2000,
        memoryLimit: memoryLimit || 256,
        createdById: req.user.userId,
        testCases: {
          create: testCases?.map((tc: any) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden || false,
            isSample: tc.isSample || false,
            points: tc.points || 10,
          })),
        },
      },
      include: {
        testCases: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: problem,
    });
  } catch (error) {
    throw error;
  }
};

export const updateProblem = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const problem = await prisma.problem.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Problem updated successfully',
      data: problem,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteProblem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.problem.delete({
      where: { id: id as string },
    });

    res.json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    throw error;
  }
};

export const getProblemStats = async (req: Request, res: Response) => {
  try {
    const stats = await prisma.problem.groupBy({
      by: ['difficulty'],
      _count: {
        id: true,
      },
    });

    const total = await prisma.problem.count();

    res.json({
      success: true,
      data: {
        total,
        byDifficulty: stats,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getGlobalStats = async (req: Request, res: Response) => {
  try {
    const [
      totalProblems,
      totalUsers,
      totalSubmissions,
      totalContests
    ] = await Promise.all([
      prisma.problem.count(),
      prisma.user.count({ where: { role: 'USER' } }), // Only count regular users
      prisma.submission.count(),
      prisma.contest.count()
    ]);

    res.json({
      success: true,
      data: {
        totalProblems,
        totalUsers,
        totalSubmissions,
        totalContests
      }
    });
  } catch (error) {
    throw error;
  }
};
