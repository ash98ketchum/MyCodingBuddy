// backend/src/services/judge.service.ts
import Queue from 'bull';
import redis from '@/config/redis';
import { config } from '@/config';

interface SubmissionJob {
  submissionId: string;
  problemId: string;
  code: string;
  language: string;
  testCases: any[];
  timeLimit: number;
  memoryLimit: number;
  sampleOnly?: boolean;
}

// Mock Queue for local development without Redis
class MockQueue {
  private handler: ((job: any) => Promise<any>) | null = null;
  private listeners: Record<string, Function> = {};

  constructor(public name: string, public opts: any) {
    console.log(`⚠️  Using In-Memory MockQueue for ${name}`);
  }

  async add(data: SubmissionJob, opts: any) {
    const job = { id: Math.random().toString(36).substring(7), data };

    // Simulate async processing
    if (this.handler) {
      setTimeout(async () => {
        try {
          await this.handler!(job);
          this.emit('completed', job, {});
        } catch (err: any) {
          this.emit('failed', job, err);
        }
      }, 500);
    }
    return job;
  }

  process(concurrency: number, handler: (job: any) => Promise<any>) {
    this.handler = handler;
  }

  on(event: string, callback: Function) {
    this.listeners[event] = callback;
    return this;
  }

  emit(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event](...args);
    }
  }
}

// MockQueue is ONLY used when Redis is explicitly disabled.
// Real Redis-backed queue is used in all other cases (including local dev with REDIS_URL=redis://localhost:6379).
const shouldUseMock = process.env.REDIS_DISABLED === 'true';

const bullRedisOpts = config.redis.url.startsWith('rediss://')
  ? { url: config.redis.url, tls: { rejectUnauthorized: false } }
  : config.redis.url; // ioredis parses host/port/db from the URL string

export const submissionQueue = shouldUseMock
  ? (new MockQueue('code-submissions', {}) as any)
  : new Queue<SubmissionJob>('code-submissions', {
    redis: bullRedisOpts as any,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

export const addSubmissionToQueue = async (jobData: SubmissionJob) => {
  try {
    const job = await submissionQueue.add(jobData, {
      priority: 1,
    });
    return job.id;
  } catch (error) {
    console.error('Failed to add submission to queue:', error);
    throw error;
  }
};

// Monitor queue events
submissionQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

submissionQueue.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

submissionQueue.on('stalled', (job) => {
  console.warn(`⚠️  Job ${job.id} stalled`);
});

export interface ResultCheckJob {
  submissionId: string;
  tokens: string[];
  originalJobData: SubmissionJob;
  startTime: number;
}

export const resultCheckQueue = shouldUseMock
  ? (new MockQueue('result-check', {}) as any)
  : new Queue<ResultCheckJob>('result-check', {
    redis: bullRedisOpts as any,
    defaultJobOptions: {
      attempts: 20, // Check up to 20 times
      backoff: {
        type: 'fixed',
        delay: 1500, // 1.5s between checks
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });

