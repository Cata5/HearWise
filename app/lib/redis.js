// lib/redis.js
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  // Other configuration options if needed
});

export default redis;
