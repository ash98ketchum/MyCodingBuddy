// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '@/controllers/auth.controller';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { asyncHandler } from '@/middleware/asyncHandler';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    bio: z.string().optional(),
    country: z.string().optional(),
    organization: z.string().optional(),
    githubUrl: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
    websiteUrl: z.string().url().optional(),
  }),
});

import passport from 'passport';
import { generateToken } from '@/utils/jwt';

// Helper to handle OAuth success and send token to frontend
const handleOAuthCallback = (req: any, res: any) => {
  const token = generateToken({
    userId: req.user.id,
    email: req.user.email,
    role: req.user.role,
  });
  
  // Redirect to frontend with token
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
};

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.get('/profile', authenticate, asyncHandler(getProfile));
router.put('/profile', authenticate, validate(updateProfileSchema), asyncHandler(updateProfile));

// OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  handleOAuthCallback
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  handleOAuthCallback
);

export default router;
