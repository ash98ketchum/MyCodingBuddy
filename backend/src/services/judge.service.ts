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

const shouldUseMock = process.env.Node_ENV !== 'production' && (process.env.USE_MOCK_QUEUE === 'true' || !process.env.REDIS_URL || process.env.REDIS_URL.includes('localhost'));

export const submissionQueue = shouldUseMock
  ? (new MockQueue('code-submissions', {}) as any)
  : new Queue<SubmissionJob>('code-submissions', {
    redis: {
      port: config.redis.url.includes('localhost') ? 6379 : undefined,
      ...((config.redis.url.startsWith('rediss://') ? {
        url: config.redis.url,
        tls: {
          rejectUnauthorized: false
        }
      } : {
        url: config.redis.url
      }))
    },
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
