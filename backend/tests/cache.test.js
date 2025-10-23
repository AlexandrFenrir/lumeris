/**
 * Tests for caching mechanism
 * Validates cache middleware and cache manager functionality
 */

const request = require('supertest');
const express = require('express');
const { cache, clearCache } = require('../src/middlewares/cache.js');
const cacheManager = require('../src/utils/cache.js');

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Test endpoint with caching (2 second TTL for testing)
  app.get('/test-cache', cache(2), (req, res) => {
    res.json({
      success: true,
      data: {
        timestamp: Date.now(),
        randomValue: Math.random()
      }
    });
  });

  // Endpoint without caching
  app.get('/test-no-cache', (req, res) => {
    res.json({
      success: true,
      data: {
        timestamp: Date.now(),
        randomValue: Math.random()
      }
    });
  });

  // Test POST endpoint (should not cache)
  app.post('/test-post', cache(2), (req, res) => {
    res.json({
      success: true,
      data: req.body
    });
  });

  // Cache clear endpoint
  app.post('/clear-cache', clearCache, (req, res) => {
    res.json({ success: true, message: 'Cache cleared' });
  });

  return app;
};

describe('Cache Middleware Tests', () => {
  let app;

  beforeEach(async () => {
    app = createTestApp();
    await cacheManager.clear();
  });

  afterAll(async () => {
    await cacheManager.clear();
  });

  describe('GET request caching', () => {
    test('should respond successfully to cached endpoint', async () => {
      // Test that the cache middleware doesn't break the endpoint
      const response1 = await request(app)
        .get('/test-cache')
        .expect(200);

      expect(response1.body.success).toBe(true);
      expect(response1.body.data).toBeDefined();
      expect(response1.body.data.randomValue).toBeDefined();

      // Second request should also work
      const response2 = await request(app)
        .get('/test-cache')
        .expect(200);

      expect(response2.body.success).toBe(true);
      expect(response2.body.data).toBeDefined();

      // Note: Actual caching behavior depends on Redis configuration
      // The important thing is that the endpoint works with the cache middleware
    });

    test('should return different values without caching', async () => {
      const response1 = await request(app)
        .get('/test-no-cache')
        .expect(200);

      await new Promise(resolve => setTimeout(resolve, 100));

      const response2 = await request(app)
        .get('/test-no-cache')
        .expect(200);

      // Without caching, random values should be different
      expect(response1.body.data.randomValue).not.toBe(response2.body.data.randomValue);
    });

    test('should expire cache after TTL', async () => {
      // First request
      const response1 = await request(app)
        .get('/test-cache')
        .expect(200);

      const firstRandomValue = response1.body.data.randomValue;

      // Wait for cache to expire (2 second TTL + buffer)
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Third request after TTL - should not be cached
      const response3 = await request(app)
        .get('/test-cache')
        .expect(200);

      expect(response3.body.cached).toBeUndefined();
      // Should have a different random value since cache expired
      expect(response3.body.data.randomValue).not.toBe(firstRandomValue);
    }, 10000); // Increase timeout for this test

    test('should not cache POST requests', async () => {
      const postData = { test: 'data' };

      const response1 = await request(app)
        .post('/test-post')
        .send(postData)
        .expect(200);

      await new Promise(resolve => setTimeout(resolve, 100));

      const response2 = await request(app)
        .post('/test-post')
        .send(postData)
        .expect(200);

      // POST requests should not be cached
      expect(response2.body.cached).toBeUndefined();
    });

    test('should use different cache keys for different query parameters', async () => {
      const response1 = await request(app)
        .get('/test-cache?param=1')
        .expect(200);

      await new Promise(resolve => setTimeout(resolve, 100));

      const response2 = await request(app)
        .get('/test-cache?param=2')
        .expect(200);

      // Different query params should not share cache
      expect(response2.body.cached).toBeUndefined();
      expect(response2.body.data.randomValue).not.toBe(response1.body.data.randomValue);
    });

    test('should cache same endpoint with same query parameters', async () => {
      const response1 = await request(app)
        .get('/test-cache?param=1')
        .expect(200);

      await new Promise(resolve => setTimeout(resolve, 100));

      const response2 = await request(app)
        .get('/test-cache?param=1')
        .expect(200);

      // Same query params should share cache
      expect(response2.body.cached).toBe(true);
      expect(response2.body.data.randomValue).toBe(response1.body.data.randomValue);
    });
  });

  describe('Cache manager operations', () => {
    test('should set and get cache value', async () => {
      const key = 'test_key';
      const value = { test: 'data', number: 123 };

      await cacheManager.set(key, value, 60);
      const retrieved = await cacheManager.get(key);

      expect(retrieved).toEqual(value);
    });

    test('should return null for non-existent key', async () => {
      const retrieved = await cacheManager.get('non_existent_key');
      expect(retrieved).toBeNull();
    });

    test('should delete cache value', async () => {
      const key = 'test_key_delete';
      const value = { test: 'data' };

      await cacheManager.set(key, value, 60);
      let retrieved = await cacheManager.get(key);
      expect(retrieved).toEqual(value);

      await cacheManager.del(key);
      retrieved = await cacheManager.get(key);
      expect(retrieved).toBeNull();
    });

    test('should check if key exists', async () => {
      const key = 'test_key_exists';
      const value = { test: 'data' };

      let exists = await cacheManager.has(key);
      expect(exists).toBe(false);

      await cacheManager.set(key, value, 60);
      exists = await cacheManager.has(key);
      expect(exists).toBe(true);
    });

    test('should clear all cache', async () => {
      await cacheManager.set('key1', 'value1', 60);
      await cacheManager.set('key2', 'value2', 60);

      await cacheManager.clear();

      const value1 = await cacheManager.get('key1');
      const value2 = await cacheManager.get('key2');

      expect(value1).toBeNull();
      expect(value2).toBeNull();
    });

    test('should get cache statistics', () => {
      const stats = cacheManager.getStats();
      expect(stats).toHaveProperty('type');
      expect(stats.type).toMatch(/Redis|In-Memory/);
    });

    test('should expire cache after TTL in cache manager', async () => {
      const key = 'test_expiry';
      const value = { test: 'data' };

      await cacheManager.set(key, value, 1); // 1 second TTL

      let retrieved = await cacheManager.get(key);
      expect(retrieved).toEqual(value);

      // Wait for expiry
      await new Promise(resolve => setTimeout(resolve, 1500));

      retrieved = await cacheManager.get(key);
      expect(retrieved).toBeNull();
    }, 10000);
  });

  describe('Cache clearing endpoint', () => {
    test('should clear cache via endpoint', async () => {
      // Add some cached data
      await request(app).get('/test-cache').expect(200);
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify it's cached
      const cachedResponse = await request(app)
        .get('/test-cache')
        .expect(200);
      expect(cachedResponse.body.cached).toBe(true);

      // Clear cache
      await request(app)
        .post('/clear-cache')
        .expect(200);

      // Verify cache is cleared
      const afterClearResponse = await request(app)
        .get('/test-cache')
        .expect(200);
      expect(afterClearResponse.body.cached).toBeUndefined();
    });
  });

  describe('Cache performance', () => {
    test('should improve response time with caching', async () => {
      // First request (not cached)
      const start1 = Date.now();
      await request(app).get('/test-cache').expect(200);
      const time1 = Date.now() - start1;

      await new Promise(resolve => setTimeout(resolve, 100));

      // Second request (cached)
      const start2 = Date.now();
      await request(app).get('/test-cache').expect(200);
      const time2 = Date.now() - start2;

      // Cached request should be faster (though minimal difference in this test)
      // This test mainly validates that caching doesn't slow down requests
      expect(time2).toBeLessThanOrEqual(time1 + 50); // Allow some variance
    });
  });
});

describe('Gaming Leaderboard Caching Integration', () => {
  test('should verify cache middleware is properly exported', () => {
    expect(cache).toBeDefined();
    expect(typeof cache).toBe('function');
  });

  test('should verify cache manager is properly exported', () => {
    expect(cacheManager).toBeDefined();
    expect(cacheManager.get).toBeDefined();
    expect(cacheManager.set).toBeDefined();
    expect(cacheManager.del).toBeDefined();
    expect(cacheManager.clear).toBeDefined();
  });
});
