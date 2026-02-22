// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import prisma from './config/database';
import redis from './config/redis';
import { errorHandler, notFound } from './middleware/error';

// Routes
import authRoutes from './routes/auth.routes';
import problemRoutes from './routes/problem.routes';
import submissionRoutes from './routes/submission.routes';
import adminRoutes from './routes/admin.routes';
import programRoutes from './routes/admin.program.routes';
import adminProgramAssignRoutes from './routes/admin-program.routes';
import discussionRoutes from './routes/discussion.routes';
import eodReportsRoutes from './modules/eodReports/eodReports.routes';
import { initEODScheduler } from './modules/eodReports/scheduler';

const app = express();

// Trust Proxy for Render
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
if (config.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

import collegeDashboardRoutes from './modules/collegeDashboard/collegeDashboard.routes';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/programs', programRoutes);
app.use('/api/admin/program', adminProgramAssignRoutes);
app.use('/api/admin/reports/eod', eodReportsRoutes);
app.use('/api/admin/college', collegeDashboardRoutes); // NEW ROUTE
app.use('/api', discussionRoutes); // Discussion routes

// Initialize EOD Schedulers
initEODScheduler();

// Error handling
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  redis.disconnect();
  process.exit(0);
});

const PORT = config.port;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);

  // Test database connection
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    // Start worker in the same process for local development (Mock Queue support)
    // This allows testing code execution without a separate Redis/Worker process
    if (!process.env.REDIS_URL || process.env.REDIS_URL.includes('localhost')) {
      console.log('👷 Starting worker in the same process for local development...');
      await import('./worker/index');
    }

    // Initialize Cron Jobs
    await import('./cron').then(m => m.initCronJobs());

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
});

export default app;
