const cacheManager = require('../utils/cache.js');

/**
 * Cache middleware for Express routes
 * Caches responses based on request URL and query parameters
 */

/**
 * Creates a cache middleware with configurable TTL
 * @param {number} ttl - Time to live in seconds (default: 300)
 * @param {Function} keyGenerator - Optional custom key generator function
 * @returns {Function} Express middleware function
 */
const cache = (ttl = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    try {
      // Generate cache key
      const cacheKey = keyGenerator
        ? keyGenerator(req)
        : generateCacheKey(req);

      // Try to get cached response
      const cachedResponse = await cacheManager.get(cacheKey);

      if (cachedResponse) {
        // Cache hit - return cached response
        return res.json({
          ...cachedResponse,
          cached: true,
          cacheTimestamp: cachedResponse.timestamp
        });
      }

      // Cache miss - store the original json method
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = function(data) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const dataToCache = {
            ...data,
            timestamp: new Date().toISOString()
          };

          // Cache asynchronously (don't wait)
          cacheManager.set(cacheKey, dataToCache, ttl).catch(err => {
            console.error('Failed to cache response:', err);
          });
        }

        // Call original json method
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Generate cache key from request
 * @param {Object} req - Express request object
 * @returns {string} Cache key
 */
function generateCacheKey(req) {
  const baseUrl = req.baseUrl || '';
  const path = req.path || '';
  const query = JSON.stringify(req.query);
  const userId = req.params.userId || req.query.userId || 'anonymous';

  return `cache:${baseUrl}${path}:${userId}:${query}`;
}

/**
 * Cache invalidation middleware
 * Invalidates cache based on patterns or specific keys
 */
const invalidateCache = (patterns) => {
  return async (req, res, next) => {
    try {
      if (Array.isArray(patterns)) {
        for (const pattern of patterns) {
          const key = typeof pattern === 'function' ? pattern(req) : pattern;
          await cacheManager.del(key);
        }
      } else if (typeof patterns === 'function') {
        const key = patterns(req);
        await cacheManager.del(key);
      } else {
        await cacheManager.del(patterns);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
    next();
  };
};

/**
 * Clear all cache
 */
const clearCache = async (req, res, next) => {
  try {
    await cacheManager.clear();
    console.log('Cache cleared successfully');
  } catch (error) {
    console.error('Cache clear error:', error);
  }
  next();
};

module.exports = {
  cache,
  invalidateCache,
  clearCache,
  generateCacheKey
};
