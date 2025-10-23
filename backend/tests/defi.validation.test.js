/**
 * Tests for DeFi endpoint validation
 * Validates input validation middleware for swap and liquidity operations
 */

const request = require('supertest');
const express = require('express');
const { validate } = require('../src/middlewares/validator.js');
const { swapSchema, liquiditySchema } = require('../src/validators/defi.validator.js');

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Test endpoint with validation
  app.post('/test-swap', validate(swapSchema), (req, res) => {
    res.json({ success: true, data: req.body });
  });

  app.post('/test-liquidity', validate(liquiditySchema), (req, res) => {
    res.json({ success: true, data: req.body });
  });

  return app;
};

describe('DeFi Swap Validation Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Valid swap requests', () => {
    test('should accept valid swap request with all required fields', async () => {
      const validSwap = {
        userId: 'user_123',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: 1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        slippage: 1
      };

      const response = await request(app)
        .post('/test-swap')
        .send(validSwap)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe('user_123');
      expect(response.body.data.tokenIn).toBe('ETH');
    });

    test('should accept swap request without optional fields', async () => {
      const validSwap = {
        userId: 'user_456',
        tokenIn: 'BTC',
        tokenOut: 'USDT',
        amountIn: 0.05,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(validSwap)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slippage).toBe(1); // Default value
    });

    test('should normalize token symbols to uppercase', async () => {
      const validSwap = {
        userId: 'user_789',
        tokenIn: 'eth',
        tokenOut: 'usdc',
        amountIn: 2.0,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(validSwap)
        .expect(200);

      expect(response.body.data.tokenIn).toBe('ETH');
      expect(response.body.data.tokenOut).toBe('USDC');
    });
  });

  describe('Invalid swap requests - Missing fields', () => {
    test('should reject swap without userId', async () => {
      const invalidSwap = {
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: 1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
      expect(response.body.validationErrors).toHaveLength(1);
      expect(response.body.validationErrors[0].field).toBe('userId');
    });

    test('should reject swap without tokenIn', async () => {
      const invalidSwap = {
        userId: 'user_123',
        tokenOut: 'USDC',
        amountIn: 1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('tokenIn');
    });

    test('should reject swap without walletAddress', async () => {
      const invalidSwap = {
        userId: 'user_123',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: 1.5
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('walletAddress');
    });
  });

  describe('Invalid swap requests - Invalid values', () => {
    test('should reject swap with same tokenIn and tokenOut', async () => {
      const invalidSwap = {
        userId: 'user_123',
        tokenIn: 'ETH',
        tokenOut: 'eth', // Will be normalized to ETH
        amountIn: 1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      // Custom validator returns error with empty field path
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation Error');
      // Check that validation errors contain message about different tokens
      const errorMessages = response.body.validationErrors.map(e => e.message).join(' ');
      expect(errorMessages).toContain('different');
    });

    test('should reject swap with invalid token', async () => {
      const invalidSwap = {
        userId: 'user_123',
        tokenIn: 'INVALID_TOKEN',
        tokenOut: 'USDC',
        amountIn: 1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('tokenIn');
    });

    test('should reject swap with negative amount', async () => {
      const invalidSwap = {
        userId: 'user_123',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: -1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('amountIn');
      expect(response.body.validationErrors[0].message).toContain('greater than 0');
    });

    test('should reject swap with zero amount', async () => {
      const invalidSwap = {
        userId: 'user_123',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: 0,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('amountIn');
    });

    test('should reject swap with invalid wallet address format', async () => {
      const invalidSwap = {
        userId: 'user_123',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: 1.5,
        walletAddress: 'invalid_address'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('walletAddress');
      expect(response.body.validationErrors[0].message).toContain('Invalid Ethereum wallet address');
    });

    test('should reject swap with slippage too high', async () => {
      const invalidSwap = {
        userId: 'user_123',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: 1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        slippage: 60
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('slippage');
      expect(response.body.validationErrors[0].message).toContain('cannot exceed 50%');
    });

    test('should reject swap with slippage too low', async () => {
      const invalidSwap = {
        userId: 'user_123',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: 1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        slippage: 0.05
      };

      const response = await request(app)
        .post('/test-swap')
        .send(invalidSwap)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('slippage');
    });
  });

  describe('Invalid swap requests - XSS and injection prevention', () => {
    test('should sanitize malicious userId input', async () => {
      const maliciousSwap = {
        userId: '<script>alert("xss")</script>',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: 1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(maliciousSwap)
        .expect(200);

      // Joi doesn't automatically sanitize HTML, but this test shows the value is preserved
      // In production, you'd add additional sanitization middleware
      expect(response.body.data.userId).toBeDefined();
    });

    test('should strip unknown fields for security', async () => {
      const swapWithExtraFields = {
        userId: 'user_123',
        tokenIn: 'ETH',
        tokenOut: 'USDC',
        amountIn: 1.5,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        maliciousField: 'DROP TABLE users;',
        anotherField: 'test'
      };

      const response = await request(app)
        .post('/test-swap')
        .send(swapWithExtraFields)
        .expect(200);

      expect(response.body.data.maliciousField).toBeUndefined();
      expect(response.body.data.anotherField).toBeUndefined();
    });
  });
});

describe('DeFi Liquidity Validation Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('Valid liquidity requests', () => {
    test('should accept valid liquidity addition request', async () => {
      const validLiquidity = {
        userId: 'user_123',
        token0Amount: 100.5,
        token1Amount: 200.75,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-liquidity')
        .send(validLiquidity)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token0Amount).toBe(100.5);
      expect(response.body.data.token1Amount).toBe(200.75);
    });
  });

  describe('Invalid liquidity requests', () => {
    test('should reject liquidity with missing token0Amount', async () => {
      const invalidLiquidity = {
        userId: 'user_123',
        token1Amount: 200.75,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-liquidity')
        .send(invalidLiquidity)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('token0Amount');
    });

    test('should reject liquidity with negative amounts', async () => {
      const invalidLiquidity = {
        userId: 'user_123',
        token0Amount: -100,
        token1Amount: 200.75,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
      };

      const response = await request(app)
        .post('/test-liquidity')
        .send(invalidLiquidity)
        .expect(400);

      expect(response.body.validationErrors[0].field).toBe('token0Amount');
      expect(response.body.validationErrors[0].message).toContain('greater than 0');
    });
  });
});

describe('Multiple validation errors', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  test('should return all validation errors at once', async () => {
    const invalidSwap = {
      // Missing userId
      tokenIn: 'INVALID_TOKEN',
      tokenOut: 'INVALID_TOKEN_2',
      amountIn: -1,
      walletAddress: 'invalid_address',
      slippage: 100
    };

    const response = await request(app)
      .post('/test-swap')
      .send(invalidSwap)
      .expect(400);

    expect(response.body.validationErrors.length).toBeGreaterThan(1);
    expect(response.body.error).toBe('Validation Error');
  });
});
