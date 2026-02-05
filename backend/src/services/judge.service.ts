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

export const submissionQueue = new Queue<SubmissionJob>('code-submissions', {
  redis: config.redis.url,
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
