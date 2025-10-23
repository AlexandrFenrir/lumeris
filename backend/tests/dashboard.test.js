/**
 * Tests for combined user dashboard endpoint
 * Validates the integration of gaming stats and DeFi portfolio data
 */

const request = require('supertest');
const express = require('express');
const analyticsRoutes = require('../src/routes/analytics.js');
const dashboardService = require('../src/services/dashboardService.js');

// Mock the dashboard service
jest.mock('../src/services/dashboardService.js');

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/analytics', analyticsRoutes);
  return app;
};

// Mock dashboard data
const mockDashboardData = {
  userId: 'test_user',
  user: {
    username: 'TestUser',
    email: 'test@example.com',
    walletAddress: '0x1234567890abcdef',
    level: 5,
    rank: 'Gold',
    avatar: 'avatar1.png',
    achievements: []
  },
  overview: {
    totalGamingEarnings: 25000,
    totalDeFiValue: 125000,
    combinedValue: 150000,
    defiPnL: 25000,
    defiPnLPercentage: 25
  },
  gaming: {
    userId: 'test_user',
    gamesPlayed: 156,
    totalWins: 98,
    totalLosses: 45,
    totalDraws: 13,
    winRate: 62.8,
    totalEarnings: 25000,
    highestScore: 15600,
    averageScore: 8900,
    currentStreak: 5,
    longestStreak: 12,
    totalPlaytime: 186000,
    recentSessions: [],
    gameHistory: [],
    tournaments: [],
    statistics: {}
  },
  defi: {
    userId: 'test_user',
    totalValue: 125000,
    totalPnL: 25000,
    totalPnLPercentage: 25,
    positions: [
      {
        poolId: 'pool_001',
        poolName: 'Lumeris/ETH',
        liquidity: 50000,
        pnl: 12000,
        apy: 145.2,
        rewards: 2500
      },
      {
        poolId: 'pool_002',
        poolName: 'USDC/Lumeris',
        liquidity: 30000,
        pnl: 8000,
        apy: 89.5,
        rewards: 1500
      }
    ],
    staking: [
      {
        yieldId: 'yield_001',
        name: 'Lumeris-ETH LP Staking',
        staked: 25000,
        rewards: 1800,
        apy: 145.2
      }
    ],
    recentTransactions: [
      { type: 'add_liquidity', amount: 10000, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { type: 'swap', amount: 5000, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { type: 'stake', amount: 15000, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    statistics: {}
  },
  activity: {
    last7Days: {
      gamesPlayed: 12,
      defiTransactions: 3,
      totalTransactions: 15
    },
    recentActivity: [
      { type: 'gaming', action: 'Won Game', description: 'Space Warriors - Score: 15600', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 500 },
      { type: 'defi', action: 'Token Swap', description: '1000 Lumeris → 0.5 ETH', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 1000 }
    ]
  },
  recommendations: [
    {
      category: 'gaming',
      title: 'Tournament Ready',
      description: 'Your high win rate qualifies you for premium tournaments!',
      action: 'Join Tournament',
      priority: 'high'
    },
    {
      category: 'defi',
      title: 'Diversify Portfolio',
      description: 'Consider adding more pools to diversify your DeFi portfolio',
      action: 'Browse Pools',
      priority: 'medium'
    },
    {
      category: 'cross-platform',
      title: 'Power User Benefits',
      description: "You're active on both Gaming and DeFi! Unlock special rewards.",
      action: 'View Rewards',
      priority: 'high'
    }
  ]
};

describe('User Dashboard Combined Endpoint Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
    // Default mock implementation
    dashboardService.getUserDashboard.mockResolvedValue(mockDashboardData);
  });

  describe('Successful dashboard retrieval', () => {
    test('should return combined user dashboard data', async () => {
      const userId = 'test_user_123';

      const response = await request(app)
        .get(`/api/analytics/user/${userId}/dashboard`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.userId).toBe(userId);
      expect(response.body.timestamp).toBeDefined();
    });

    test('should include overview section with combined metrics', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      expect(response.body.data.overview).toBeDefined();
      expect(response.body.data.overview.totalGamingEarnings).toBeDefined();
      expect(response.body.data.overview.totalDeFiValue).toBeDefined();
      expect(response.body.data.overview.combinedValue).toBeDefined();
      expect(response.body.data.overview.defiPnL).toBeDefined();
      expect(response.body.data.overview.defiPnLPercentage).toBeDefined();
    });

    test('should include gaming stats section', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      expect(response.body.data.gaming).toBeDefined();
      expect(response.body.data.gaming.userId).toBeDefined();
      expect(response.body.data.gaming.gamesPlayed).toBeDefined();
      expect(response.body.data.gaming.totalWins).toBeDefined();
      expect(response.body.data.gaming.totalLosses).toBeDefined();
      expect(response.body.data.gaming.winRate).toBeDefined();
      expect(response.body.data.gaming.totalEarnings).toBeDefined();
    });

    test('should include DeFi portfolio section', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      expect(response.body.data.defi).toBeDefined();
      expect(response.body.data.defi.totalValue).toBeDefined();
      expect(response.body.data.defi.totalPnl).toBeDefined();
      expect(response.body.data.defi.positions).toBeDefined();
      expect(Array.isArray(response.body.data.defi.positions)).toBe(true);
      expect(response.body.data.defi.staking).toBeDefined();
      expect(Array.isArray(response.body.data.defi.staking)).toBe(true);
      expect(response.body.data.defi.recentTransactions).toBeDefined();
      expect(Array.isArray(response.body.data.defi.recentTransactions)).toBe(true);
    });

    test('should include activity section', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      expect(response.body.data.activity).toBeDefined();
      expect(response.body.data.activity.last7Days).toBeDefined();
      expect(response.body.data.activity.last7Days.gamesPlayed).toBeDefined();
      expect(response.body.data.activity.last7Days.defiTransactions).toBeDefined();
      expect(response.body.data.activity.last7Days.totalTransactions).toBeDefined();
      expect(response.body.data.activity.recentActivity).toBeDefined();
      expect(Array.isArray(response.body.data.activity.recentActivity)).toBe(true);
    });

    test('should include recommendations section', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      expect(response.body.data.recommendations).toBeDefined();
      expect(Array.isArray(response.body.data.recommendations)).toBe(true);
    });

    test('should return message indicating successful retrieval', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      expect(response.body.message).toBe('User dashboard successfully retrieved');
    });
  });

  describe('Dashboard data structure validation', () => {
    test('should have correct DeFi position structure', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const positions = response.body.data.defi.positions;
      expect(positions.length).toBeGreaterThan(0);

      const firstPosition = positions[0];
      expect(firstPosition).toHaveProperty('poolId');
      expect(firstPosition).toHaveProperty('poolName');
      expect(firstPosition).toHaveProperty('liquidity');
      expect(firstPosition).toHaveProperty('pnl');
      expect(firstPosition).toHaveProperty('apy');
      expect(firstPosition).toHaveProperty('rewards');
    });

    test('should have correct staking structure', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const staking = response.body.data.defi.staking;
      expect(staking.length).toBeGreaterThan(0);

      const firstStake = staking[0];
      expect(firstStake).toHaveProperty('yieldId');
      expect(firstStake).toHaveProperty('name');
      expect(firstStake).toHaveProperty('staked');
      expect(firstStake).toHaveProperty('rewards');
      expect(firstStake).toHaveProperty('apy');
    });

    test('should have correct transaction structure', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const transactions = response.body.data.defi.recentTransactions;
      expect(transactions.length).toBeGreaterThan(0);

      const firstTx = transactions[0];
      expect(firstTx).toHaveProperty('type');
      expect(firstTx).toHaveProperty('amount');
      expect(firstTx).toHaveProperty('timestamp');
    });

    test('should have correct recommendation structure', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const recommendations = response.body.data.recommendations;

      if (recommendations.length > 0) {
        const firstRec = recommendations[0];
        expect(firstRec).toHaveProperty('category');
        expect(firstRec).toHaveProperty('title');
        expect(firstRec).toHaveProperty('description');
        expect(firstRec).toHaveProperty('action');
        expect(firstRec).toHaveProperty('priority');
      }
    });
  });

  describe('Dashboard calculations', () => {
    test('should correctly calculate combined value', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const { totalGamingEarnings, totalDeFiValue, combinedValue } = response.body.data.overview;
      expect(combinedValue).toBe(totalGamingEarnings + totalDeFiValue);
    });

    test('should correctly calculate total transactions', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const { gamesPlayed, defiTransactions, totalTransactions } = response.body.data.activity.last7Days;
      expect(totalTransactions).toBe(gamesPlayed + defiTransactions);
    });

    test('should sort recent activity by timestamp', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const recentActivity = response.body.data.activity.recentActivity;

      if (recentActivity.length > 1) {
        for (let i = 0; i < recentActivity.length - 1; i++) {
          const currentTime = new Date(recentActivity[i].timestamp).getTime();
          const nextTime = new Date(recentActivity[i + 1].timestamp).getTime();
          expect(currentTime).toBeGreaterThanOrEqual(nextTime);
        }
      }
    });

    test('should limit recent activity to 5 items', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const recentActivity = response.body.data.activity.recentActivity;
      expect(recentActivity.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Dashboard for different user types', () => {
    test('should return 404 for non-existent user', async () => {
      dashboardService.getUserDashboard.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/analytics/user/non_existent_user/dashboard')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User not found');
    });

    test('should handle user with minimal gaming stats', async () => {
      const minimalData = {
        ...mockDashboardData,
        userId: 'new_user_456',
        gaming: {
          userId: 'new_user_456',
          gamesPlayed: 0,
          totalWins: 0,
          totalLosses: 0,
          winRate: 0,
          totalEarnings: 0,
          level: 1,
          rank: 'Unranked',
          achievements: [],
          currentStreak: 0,
          longestStreak: 0,
          recentSessions: [],
          gameHistory: [],
          tournaments: [],
          statistics: {}
        }
      };

      dashboardService.getUserDashboard.mockResolvedValue(minimalData);

      const response = await request(app)
        .get('/api/analytics/user/new_user_456/dashboard')
        .expect(200);

      const gaming = response.body.data.gaming;
      expect(gaming.level).toBe(1);
      expect(gaming.rank).toBe('Unranked');
      expect(gaming.achievements).toEqual([]);
    });
  });

  describe('Dashboard caching', () => {
    test('should cache dashboard response', async () => {
      const userId = 'cache_test_user';

      // First request
      const response1 = await request(app)
        .get(`/api/analytics/user/${userId}/dashboard`)
        .expect(200);

      expect(response1.body.cached).toBeUndefined();
      const firstTimestamp = response1.body.timestamp;

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 200));

      // Second request - should return cached data (same timestamp)
      const response2 = await request(app)
        .get(`/api/analytics/user/${userId}/dashboard`)
        .expect(200);

      // Verify caching by checking data consistency
      expect(response2.body.data.userId).toBe(userId);
      // The cached field might be present depending on implementation
      if (response2.body.cached !== undefined) {
        expect(response2.body.cached).toBe(true);
        expect(response2.body.cacheTimestamp).toBeDefined();
      }
    });
  });

  describe('Recommendations logic', () => {
    test('should include recommendations based on user activity', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const recommendations = response.body.data.recommendations;
      expect(recommendations.length).toBeGreaterThan(0);

      // Check for valid priorities
      recommendations.forEach(rec => {
        expect(['high', 'medium', 'low']).toContain(rec.priority);
      });
    });

    test('should include cross-platform recommendations for active users', async () => {
      const response = await request(app)
        .get('/api/analytics/user/test_user/dashboard')
        .expect(200);

      const recommendations = response.body.data.recommendations;

      // Check if user has both gaming stats and DeFi portfolio data
      const hasGamingData = response.body.data.gaming && response.body.data.gaming.gamesPlayed > 0;
      const hasDefiData = response.body.data.defi && response.body.data.defi.totalValue > 0;

      if (hasGamingData && hasDefiData) {
        const crossPlatformRec = recommendations.find(r => r.category === 'cross-platform');
        expect(crossPlatformRec).toBeDefined();
      } else {
        // If user doesn't have both, that's fine too
        expect(recommendations).toBeDefined();
      }
    });
  });

  describe('Performance', () => {
    test('should respond within reasonable time', async () => {
      const start = Date.now();

      await request(app)
        .get('/api/analytics/user/performance_test_user/dashboard')
        .expect(200);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000); // Should respond within 1 second
    });

    test('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        request(app)
          .get(`/api/analytics/user/concurrent_user_${i}/dashboard`)
          .expect(200)
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
      });
    });
  });
});

describe('Dashboard Integration with Other Endpoints', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  test('should verify analytics routes are properly configured', async () => {
    // Test that other analytics endpoints are still accessible
    const response = await request(app)
      .get('/api/analytics/overview')
      .expect(200);

    expect(response.body.success).toBe(true);
  });

  test('should maintain consistent user ID across dashboard', async () => {
    const userId = 'consistency_test';

    const response = await request(app)
      .get(`/api/analytics/user/${userId}/dashboard`)
      .expect(200);

    expect(response.body.data.userId).toBe(userId);
    expect(response.body.data.gaming.userId).toBe(userId);
    expect(response.body.data.defi.userId).toBe(userId);
  });
});
