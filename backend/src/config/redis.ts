// backend/src/config/redis.ts
import Redis from 'ioredis';
import { config } from './index';

const redisUrl = config.redis.url;
const isTls = redisUrl.startsWith('rediss://');

const redisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  connectTimeout: 10000, // 10s timeout
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  ...(isTls ? {
    tls: {
      rejectUnauthorized: false,
    },
  } : {}),
};

const redis = new Redis(redisUrl, redisOptions);

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export default redis;
