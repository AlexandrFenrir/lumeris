/**
 * Cache Manager with in-memory fallback
 * Supports both Redis (if available) and in-memory caching
 * Optimized for performance with TTL support
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
    this.redisClient = null;
    this.useRedis = false;
  }

  /**
   * Initialize Redis connection (optional)
   * Falls back to in-memory cache if Redis is unavailable
   */
  async initRedis() {
    try {
      const redis = require('redis');
      this.redisClient = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379
        }
      });

      this.redisClient.on('error', (err) => {
        console.log('Redis Client Error - falling back to in-memory cache:', err.message);
        this.useRedis = false;
      });

      await this.redisClient.connect();
      this.useRedis = true;
      console.log('✓ Redis cache connected successfully');
    } catch (error) {
      console.log('Redis not available - using in-memory cache:', error.message);
      this.useRedis = false;
    }
  }

  /**
   * Get cached value by key
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} Cached value or null
   */
  async get(key) {
    try {
      if (this.useRedis && this.redisClient) {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        return this.cache.get(key) || null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set cache value with optional TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default: 300)
   * @returns {Promise<boolean>} Success status
   */
  async set(key, value, ttl = 300) {
    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.setEx(key, ttl, JSON.stringify(value));
      } else {
        // In-memory cache with TTL
        this.cache.set(key, value);

        // Clear existing timer if any
        if (this.timers.has(key)) {
          clearTimeout(this.timers.get(key));
        }

        // Set expiration timer
        const timer = setTimeout(() => {
          this.cache.delete(key);
          this.timers.delete(key);
        }, ttl * 1000);

        this.timers.set(key, timer);
      }
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  /**
   * Delete cache value by key
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} Success status
   */
  async del(key) {
    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.del(key);
      } else {
        if (this.timers.has(key)) {
          clearTimeout(this.timers.get(key));
          this.timers.delete(key);
        }
        this.cache.delete(key);
      }
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Clear all cached values
   * @returns {Promise<boolean>} Success status
   */
  async clear() {
    try {
      if (this.useRedis && this.redisClient) {
        await this.redisClient.flushAll();
      } else {
        // Clear all timers
        for (const timer of this.timers.values()) {
          clearTimeout(timer);
        }
        this.timers.clear();
        this.cache.clear();
      }
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} Existence status
   */
  async has(key) {
    try {
      if (this.useRedis && this.redisClient) {
        const exists = await this.redisClient.exists(key);
        return exists === 1;
      } else {
        return this.cache.has(key);
      }
    } catch (error) {
      console.error('Cache has error:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    return {
      type: this.useRedis ? 'Redis' : 'In-Memory',
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Close Redis connection
   */
  async close() {
    if (this.useRedis && this.redisClient) {
      await this.redisClient.quit();
    }
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

// Initialize Redis on module load (non-blocking)
cacheManager.initRedis().catch(() => {
  console.log('Starting with in-memory cache');
});

module.exports = cacheManager;
