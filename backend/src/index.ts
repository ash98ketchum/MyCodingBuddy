// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { authLimiter, submissionLimiter, publicLimiter, defaultLimiter } from './middleware/rateLimiter';
import { config } from './config';
import prisma from './config/database';
import redis from './config/redis';
import { errorHandler, notFound } from './middleware/error';
import { initSocket } from './socket';

// Routes
import authRoutes from './routes/auth.routes';
import problemRoutes from './routes/problem.routes';
import submissionRoutes from './routes/submission.routes';
import adminRoutes from './routes/admin.routes';
import adminProgramAssignRoutes from './routes/admin-program.routes';
import discussionRoutes from './routes/discussion.routes';
import contestRoutes from './routes/contest.routes';
import eodReportsRoutes from './modules/eodReports/eodReports.routes';
import collegeDashboardRoutes from './modules/collegeDashboard/collegeDashboard.routes';
import { initEODScheduler } from './modules/eodReports/scheduler';
import { problemLoader } from './services/problemLoader.service';
import { judge0Client } from './services/judge0Client.service';
import { collegeRateLimiter } from './middleware/collegeRateLimit';

const app = express();

// Trust Proxy for Render
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

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
  res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// API Routes — tiered rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/problems', publicLimiter, problemRoutes);
app.use('/api/submissions', submissionLimiter, submissionRoutes);
app.use('/api/admin', defaultLimiter, adminRoutes);
app.use('/api/admin/program', defaultLimiter, adminProgramAssignRoutes);
app.use('/api/admin/reports/eod', defaultLimiter, eodReportsRoutes);
app.use('/api/admin/college', collegeRateLimiter, collegeDashboardRoutes);
app.use('/api', publicLimiter, discussionRoutes);
app.use('/api/contests', publicLimiter, contestRoutes);

// Initialize EOD Scheduler
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

// ── HTTP Server + WebSocket ───────────────────────────────────────────────────
const PORT = config.port;
const httpServer = createServer(app);
initSocket(httpServer, config.cors);

httpServer.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket Server initialized`);

  try {
    // 0. Problem Loader (file-based test cases)
    problemLoader.initialize();

    // 1. Database
    console.log('⏳ Connecting to database...');
    await Promise.race([
      prisma.$connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database connection timeout')), 15_000)
      ),
    ]);
    console.log('✅ Database connected');

    // 2. Judge0 Health Check — NON-FATAL: server boots even if Judge0 is down
    const judge0Url = process.env.JUDGE0_URL || config.judge.apiUrl;
    console.log(`⏳ Checking Judge0 at ${judge0Url} ...`);
    try {
      const healthy = await judge0Client.isHealthy();
      if (healthy) {
        console.log(`✅ Judge0 connected (${judge0Url})`);
      } else {
        console.warn(`⚠️  Judge0 unavailable at ${judge0Url} — submissions will fail until Judge0 is running`);
        console.warn(`   → docker compose up -d judge0-server judge0-worker judge0-postgres judge0-redis`);
      }
    } catch (j0Err: any) {
      console.warn(`⚠️  Judge0 health check error: ${j0Err?.message}`);
    }

    // 3. Worker (in-process in dev; external process in production)
    const runWorkerInProcess =
      config.isDevelopment || process.env.WORKER_IN_PROCESS === 'true';
    if (runWorkerInProcess) {
      console.log('👷 Starting submission worker in-process...');
      await import('./workers/submission.worker');
    }

    // 4. Cron Jobs
    console.log('⏰ Initializing cron jobs...');
    await import('./cron').then(m => m.initCronJobs());

    console.log('✨ Server initialization complete');
  } catch (error) {
    console.error('❌ Server partial initialization failure:', error);
    console.error('⚠️  The server is running but some background services may be unavailable.');
  }
});

export default app;
