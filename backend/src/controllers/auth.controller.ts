// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import prisma from '@/config/database';
import { hashPassword, comparePassword } from '@/utils/password';
import { generateToken } from '@/utils/jwt';
import { AppError } from '@/middleware/error';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new AppError('User with this email or username already exists', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        rating: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          rating: user.rating,
          isPremium: user.isPremium,
        },
        token,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        planType: true,
        rating: true,
        streak: true,
        avatar: true,
        bio: true,
        country: true,
        organization: true,
        isPremium: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { fullName, bio, country, organization, githubUrl, linkedinUrl, websiteUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName,
        bio,
        country,
        organization,
        githubUrl,
        linkedinUrl,
        websiteUrl,
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        bio: true,
        country: true,
        organization: true,
        githubUrl: true,
        linkedinUrl: true,
        websiteUrl: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    throw error;
  }
};
