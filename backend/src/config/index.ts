// backend/src/config/index.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL!,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      // Only include localhost origins in development
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
        : []),
    ],
    credentials: true,
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@codingbuddy.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  },

  judge: {
    maxExecutionTime: parseInt(process.env.MAX_EXECUTION_TIME || '5000', 10),
    maxMemoryLimit: parseInt(process.env.MAX_MEMORY_LIMIT || '512', 10),
    workers: parseInt(process.env.JUDGE_WORKERS || '3', 10),
    apiUrl: process.env.JUDGE0_URL || 'http://localhost:2358',
    apiKey: process.env.JUDGE0_API_KEY,
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// ── Production safety guards ──────────────────────────────────────────────────
if (config.isProduction) {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET must be set in production');
  }
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn('⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not set — using insecure defaults');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('FATAL: DATABASE_URL must be set in production');
  }
}
