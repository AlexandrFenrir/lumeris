/**
 * Database Seeder
 * Populates MongoDB with realistic test data for development and testing
 */

const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/database');
const User = require('../models/User');
const GamingStats = require('../models/GamingStats');
const DeFiPortfolio = require('../models/DeFiPortfolio');
const UserActivity = require('../models/UserActivity');

// Helper to generate random numbers
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max, decimals = 2) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Helper to generate past dates
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Seed Users
 */
const seedUsers = async () => {
  console.log('🌱 Seeding users...');

  const users = [
    {
      userId: 'user-001',
      username: 'CryptoWarrior',
      email: 'warrior@lumeris.io',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      bio: 'DeFi enthusiast and gaming champion. Building wealth through play-to-earn.',
      level: 15,
      experience: 15420,
      rank: 'Diamond',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoWarrior',
      achievements: [
        {
          achievementId: 'ach-001',
          name: 'First Blood',
          description: 'Win your first game',
          icon: '🏆',
          unlockedAt: daysAgo(30),
          rarity: 'common'
        },
        {
          achievementId: 'ach-010',
          name: 'Whale Status',
          description: 'Reach $100k in DeFi portfolio value',
          icon: '🐋',
          unlockedAt: daysAgo(5),
          rarity: 'legendary'
        },
        {
          achievementId: 'ach-015',
          name: 'Win Streak Master',
          description: 'Achieve a 10-game win streak',
          icon: '🔥',
          unlockedAt: daysAgo(12),
          rarity: 'epic'
        }
      ],
      preferences: {
        notifications: true,
        theme: 'dark',
        language: 'en'
      },
      socialLinks: {
        twitter: '@cryptowarrior',
        discord: 'CryptoWarrior#1234'
      },
      lastLogin: new Date()
    },
    {
      userId: 'user-002',
      username: 'DeFiMaster',
      email: 'master@lumeris.io',
      walletAddress: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      bio: 'Yield farming expert with a passion for high APY pools.',
      level: 22,
      experience: 28900,
      rank: 'Master',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiMaster',
      achievements: [
        {
          achievementId: 'ach-002',
          name: 'Pool Pioneer',
          description: 'Add liquidity to your first pool',
          icon: '💧',
          unlockedAt: daysAgo(45),
          rarity: 'common'
        },
        {
          achievementId: 'ach-020',
          name: 'APY Hunter',
          description: 'Stake in a pool with 200%+ APY',
          icon: '🎯',
          unlockedAt: daysAgo(20),
          rarity: 'rare'
        }
      ],
      preferences: {
        notifications: true,
        theme: 'dark',
        language: 'en'
      },
      lastLogin: daysAgo(1)
    },
    {
      userId: 'user-003',
      username: 'GamingPro',
      email: 'pro@lumeris.io',
      walletAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      bio: 'Professional gamer. Top 10 on global leaderboards.',
      level: 18,
      experience: 19500,
      rank: 'Platinum',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GamingPro',
      achievements: [
        {
          achievementId: 'ach-001',
          name: 'First Blood',
          description: 'Win your first game',
          icon: '🏆',
          unlockedAt: daysAgo(60),
          rarity: 'common'
        },
        {
          achievementId: 'ach-005',
          name: 'Tournament Victor',
          description: 'Win a tournament',
          icon: '👑',
          unlockedAt: daysAgo(10),
          rarity: 'epic'
        }
      ],
      preferences: {
        notifications: true,
        theme: 'dark',
        language: 'en'
      },
      socialLinks: {
        twitter: '@gamingpro_',
        discord: 'GamingPro#5678',
        telegram: '@gamingpro'
      },
      lastLogin: new Date()
    }
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log(`✅ Created ${users.length} users`);
};

/**
 * Seed Gaming Stats
 */
const seedGamingStats = async () => {
  console.log('🌱 Seeding gaming stats...');

  const gamingStats = [
    {
      userId: 'user-001',
      totalGamesPlayed: 156,
      totalWins: 98,
      totalLosses: 52,
      totalDraws: 6,
      winRate: 62.82,
      totalEarnings: 45680,
      totalPlaytime: 2340, // minutes
      highestScore: 9850,
      averageScore: 6420,
      currentStreak: 5,
      longestStreak: 12,
      gameHistory: [
        {
          gameId: 'game-1',
          gameName: 'Crypto Warriors',
          gamesPlayed: 45,
          wins: 30,
          losses: 15,
          earnings: 15200,
          highScore: 9850,
          lastPlayed: daysAgo(1),
          totalPlaytime: 780
        },
        {
          gameId: 'game-2',
          gameName: 'DeFi Quest',
          gamesPlayed: 60,
          wins: 38,
          losses: 22,
          earnings: 18900,
          highScore: 8760,
          lastPlayed: daysAgo(2),
          totalPlaytime: 920
        },
        {
          gameId: 'game-4',
          gameName: 'Battle Royale X',
          gamesPlayed: 51,
          wins: 30,
          losses: 15,
          earnings: 11580,
          highScore: 7200,
          lastPlayed: daysAgo(3),
          totalPlaytime: 640
        }
      ],
      recentSessions: [
        {
          sessionId: `session_${Date.now()}_1`,
          gameId: 'game-1',
          gameName: 'Crypto Warriors',
          score: 8950,
          result: 'win',
          earnings: 450,
          duration: 25,
          startTime: daysAgo(1),
          endTime: daysAgo(1)
        },
        {
          sessionId: `session_${Date.now()}_2`,
          gameId: 'game-2',
          gameName: 'DeFi Quest',
          score: 7850,
          result: 'win',
          earnings: 380,
          duration: 22,
          startTime: daysAgo(2),
          endTime: daysAgo(2)
        },
        {
          sessionId: `session_${Date.now()}_3`,
          gameId: 'game-4',
          gameName: 'Battle Royale X',
          score: 6200,
          result: 'win',
          earnings: 320,
          duration: 18,
          startTime: daysAgo(2),
          endTime: daysAgo(2)
        }
      ],
      tournaments: [
        {
          tournamentId: 'tournament_1',
          tournamentName: 'Weekly Gaming Championship',
          joinedAt: daysAgo(15),
          placement: 3,
          totalParticipants: 156,
          earnings: 2500,
          status: 'completed'
        }
      ],
      statistics: {
        favoriteGame: 'DeFi Quest',
        mostPlayedCategory: 'Action',
        averageSessionDuration: 23,
        totalRewardsClaimed: 45680,
        perfectGames: 12
      }
    },
    {
      userId: 'user-002',
      totalGamesPlayed: 45,
      totalWins: 20,
      totalLosses: 22,
      totalDraws: 3,
      winRate: 44.44,
      totalEarnings: 12400,
      totalPlaytime: 890,
      highestScore: 6500,
      averageScore: 4200,
      currentStreak: 0,
      longestStreak: 4,
      gameHistory: [
        {
          gameId: 'game-2',
          gameName: 'DeFi Quest',
          gamesPlayed: 30,
          wins: 15,
          losses: 15,
          earnings: 8900,
          highScore: 6500,
          lastPlayed: daysAgo(5),
          totalPlaytime: 600
        }
      ],
      recentSessions: [
        {
          sessionId: `session_${Date.now()}_4`,
          gameId: 'game-2',
          gameName: 'DeFi Quest',
          score: 5100,
          result: 'loss',
          earnings: 100,
          duration: 20,
          startTime: daysAgo(5),
          endTime: daysAgo(5)
        }
      ],
      tournaments: [],
      statistics: {
        favoriteGame: 'DeFi Quest',
        mostPlayedCategory: 'Strategy',
        averageSessionDuration: 20,
        totalRewardsClaimed: 12400,
        perfectGames: 2
      }
    },
    {
      userId: 'user-003',
      totalGamesPlayed: 234,
      totalWins: 189,
      totalLosses: 40,
      totalDraws: 5,
      winRate: 80.77,
      totalEarnings: 78920,
      totalPlaytime: 3890,
      highestScore: 12500,
      averageScore: 8900,
      currentStreak: 15,
      longestStreak: 25,
      gameHistory: [
        {
          gameId: 'game-1',
          gameName: 'Crypto Warriors',
          gamesPlayed: 120,
          wins: 100,
          losses: 18,
          earnings: 42000,
          highScore: 12500,
          lastPlayed: new Date(),
          totalPlaytime: 2100
        },
        {
          gameId: 'game-4',
          gameName: 'Battle Royale X',
          gamesPlayed: 114,
          wins: 89,
          losses: 22,
          earnings: 36920,
          highScore: 11200,
          lastPlayed: daysAgo(1),
          totalPlaytime: 1790
        }
      ],
      recentSessions: [
        {
          sessionId: `session_${Date.now()}_5`,
          gameId: 'game-1',
          gameName: 'Crypto Warriors',
          score: 12100,
          result: 'win',
          earnings: 650,
          duration: 28,
          startTime: new Date(),
          endTime: new Date()
        },
        {
          sessionId: `session_${Date.now()}_6`,
          gameId: 'game-4',
          gameName: 'Battle Royale X',
          score: 10800,
          result: 'win',
          earnings: 580,
          duration: 26,
          startTime: daysAgo(1),
          endTime: daysAgo(1)
        }
      ],
      tournaments: [
        {
          tournamentId: 'tournament_1',
          tournamentName: 'Weekly Gaming Championship',
          joinedAt: daysAgo(15),
          placement: 1,
          totalParticipants: 156,
          earnings: 5000,
          status: 'completed'
        },
        {
          tournamentId: 'tournament_2',
          tournamentName: 'Monthly DeFi Gaming League',
          joinedAt: daysAgo(5),
          placement: 2,
          totalParticipants: 89,
          earnings: 3500,
          status: 'completed'
        }
      ],
      statistics: {
        favoriteGame: 'Crypto Warriors',
        mostPlayedCategory: 'Action',
        averageSessionDuration: 27,
        totalRewardsClaimed: 78920,
        perfectGames: 45
      }
    }
  ];

  await GamingStats.deleteMany({});
  await GamingStats.insertMany(gamingStats);
  console.log(`✅ Created gaming stats for ${gamingStats.length} users`);
};

/**
 * Seed DeFi Portfolios
 */
const seedDeFiPortfolios = async () => {
  console.log('🌱 Seeding DeFi portfolios...');

  const portfolios = [
    {
      userId: 'user-001',
      totalValue: 125000,
      totalPnL: 25000,
      totalPnLPercentage: 25.00,
      positions: [
        {
          poolId: 'pool_001',
          poolName: 'Lumeris/ETH',
          pair: 'Lumeris/ETH',
          blockchain: 'Ethereum',
          liquidity: 50000,
          lpTokens: 48500,
          token0Amount: 25000,
          token1Amount: 25000,
          initialValue: 45000,
          currentValue: 50000,
          pnl: 5000,
          pnlPercentage: 11.11,
          apy: 145.2,
          rewards: 2500,
          feesEarned: 1200,
          addedAt: daysAgo(30),
          lastUpdated: new Date(),
          status: 'active'
        },
        {
          poolId: 'pool_002',
          poolName: 'USDC/Lumeris',
          pair: 'USDC/Lumeris',
          blockchain: 'Polygon',
          liquidity: 30000,
          lpTokens: 29100,
          token0Amount: 15000,
          token1Amount: 15000,
          initialValue: 27000,
          currentValue: 30000,
          pnl: 3000,
          pnlPercentage: 11.11,
          apy: 89.5,
          rewards: 1500,
          feesEarned: 800,
          addedAt: daysAgo(20),
          lastUpdated: new Date(),
          status: 'active'
        },
        {
          poolId: 'pool_003',
          poolName: 'BTC/USDT',
          pair: 'BTC/USDT',
          blockchain: 'Ethereum',
          liquidity: 45000,
          lpTokens: 43200,
          token0Amount: 22500,
          token1Amount: 22500,
          initialValue: 40000,
          currentValue: 45000,
          pnl: 5000,
          pnlPercentage: 12.50,
          apy: 67.8,
          rewards: 1800,
          feesEarned: 950,
          addedAt: daysAgo(45),
          lastUpdated: new Date(),
          status: 'active'
        }
      ],
      staking: [
        {
          yieldId: 'yield_001',
          name: 'Lumeris-ETH LP Staking',
          poolName: 'Lumeris/ETH',
          staked: 25000,
          rewards: 1800,
          apy: 145.2,
          lockPeriod: '30 days',
          startTime: daysAgo(25),
          endTime: daysAgo(-5),
          claimedRewards: 1200,
          status: 'active'
        }
      ],
      transactions: [
        {
          transactionId: `tx_${Date.now()}_1`,
          type: 'add_liquidity',
          poolId: 'pool_001',
          amount: 50000,
          fee: 150,
          gasUsed: '0.002',
          gasPrice: '25',
          hash: '0xabc123...',
          status: 'success',
          timestamp: daysAgo(30)
        },
        {
          transactionId: `tx_${Date.now()}_2`,
          type: 'swap',
          tokenIn: 'ETH',
          tokenOut: 'USDC',
          amountIn: 2.5,
          amountOut: 8750,
          fee: 26.25,
          gasUsed: '0.005',
          gasPrice: '25',
          hash: '0xdef456...',
          status: 'success',
          timestamp: daysAgo(15)
        },
        {
          transactionId: `tx_${Date.now()}_3`,
          type: 'stake',
          yieldId: 'yield_001',
          amount: 25000,
          fee: 75,
          gasUsed: '0.004',
          gasPrice: '25',
          hash: '0xghi789...',
          status: 'success',
          timestamp: daysAgo(25)
        }
      ],
      statistics: {
        totalSwaps: 15,
        totalLiquidityAdded: 125000,
        totalRewardsClaimed: 3500,
        totalFeesEarned: 2950,
        averageAPY: 100.83,
        activePositionsCount: 3,
        highestSingleEarning: 2500
      }
    },
    {
      userId: 'user-002',
      totalValue: 185000,
      totalPnL: 35000,
      totalPnLPercentage: 23.33,
      positions: [
        {
          poolId: 'pool_001',
          poolName: 'Lumeris/ETH',
          pair: 'Lumeris/ETH',
          blockchain: 'Ethereum',
          liquidity: 75000,
          lpTokens: 72750,
          token0Amount: 37500,
          token1Amount: 37500,
          initialValue: 68000,
          currentValue: 75000,
          pnl: 7000,
          pnlPercentage: 10.29,
          apy: 145.2,
          rewards: 3800,
          feesEarned: 1800,
          addedAt: daysAgo(40),
          lastUpdated: new Date(),
          status: 'active'
        },
        {
          poolId: 'pool_004',
          poolName: 'GAME/Lumeris',
          pair: 'GAME/Lumeris',
          blockchain: 'Polygon',
          liquidity: 60000,
          lpTokens: 57600,
          token0Amount: 30000,
          token1Amount: 30000,
          initialValue: 52000,
          currentValue: 60000,
          pnl: 8000,
          pnlPercentage: 15.38,
          apy: 234.7,
          rewards: 5200,
          feesEarned: 2100,
          addedAt: daysAgo(35),
          lastUpdated: new Date(),
          status: 'active'
        }
      ],
      staking: [
        {
          yieldId: 'yield_002',
          name: 'USDC-Lumeris LP Staking',
          poolName: 'USDC/Lumeris',
          staked: 50000,
          rewards: 3200,
          apy: 89.5,
          lockPeriod: '7 days',
          startTime: daysAgo(20),
          endTime: daysAgo(-10),
          claimedRewards: 2100,
          status: 'active'
        }
      ],
      transactions: [
        {
          transactionId: `tx_${Date.now()}_4`,
          type: 'add_liquidity',
          poolId: 'pool_001',
          amount: 75000,
          fee: 225,
          gasUsed: '0.002',
          gasPrice: '25',
          hash: '0xjkl012...',
          status: 'success',
          timestamp: daysAgo(40)
        },
        {
          transactionId: `tx_${Date.now()}_5`,
          type: 'add_liquidity',
          poolId: 'pool_004',
          amount: 60000,
          fee: 180,
          gasUsed: '0.002',
          gasPrice: '25',
          hash: '0xmno345...',
          status: 'success',
          timestamp: daysAgo(35)
        }
      ],
      statistics: {
        totalSwaps: 8,
        totalLiquidityAdded: 135000,
        totalRewardsClaimed: 5300,
        totalFeesEarned: 3900,
        averageAPY: 189.95,
        activePositionsCount: 2,
        highestSingleEarning: 5200
      }
    },
    {
      userId: 'user-003',
      totalValue: 15000,
      totalPnL: 1500,
      totalPnLPercentage: 11.11,
      positions: [
        {
          poolId: 'pool_002',
          poolName: 'USDC/Lumeris',
          pair: 'USDC/Lumeris',
          blockchain: 'Polygon',
          liquidity: 15000,
          lpTokens: 14550,
          token0Amount: 7500,
          token1Amount: 7500,
          initialValue: 13500,
          currentValue: 15000,
          pnl: 1500,
          pnlPercentage: 11.11,
          apy: 89.5,
          rewards: 800,
          feesEarned: 400,
          addedAt: daysAgo(15),
          lastUpdated: new Date(),
          status: 'active'
        }
      ],
      staking: [],
      transactions: [
        {
          transactionId: `tx_${Date.now()}_6`,
          type: 'add_liquidity',
          poolId: 'pool_002',
          amount: 15000,
          fee: 45,
          gasUsed: '0.002',
          gasPrice: '25',
          hash: '0xpqr678...',
          status: 'success',
          timestamp: daysAgo(15)
        },
        {
          transactionId: `tx_${Date.now()}_7`,
          type: 'swap',
          tokenIn: 'USDC',
          tokenOut: 'Lumeris',
          amountIn: 1000,
          amountOut: 1176,
          fee: 3,
          gasUsed: '0.005',
          gasPrice: '25',
          hash: '0xstu901...',
          status: 'success',
          timestamp: daysAgo(10)
        }
      ],
      statistics: {
        totalSwaps: 3,
        totalLiquidityAdded: 15000,
        totalRewardsClaimed: 800,
        totalFeesEarned: 400,
        averageAPY: 89.5,
        activePositionsCount: 1,
        highestSingleEarning: 800
      }
    }
  ];

  await DeFiPortfolio.deleteMany({});
  await DeFiPortfolio.insertMany(portfolios);
  console.log(`✅ Created DeFi portfolios for ${portfolios.length} users`);
};

/**
 * Seed User Activities
 */
const seedUserActivities = async () => {
  console.log('🌱 Seeding user activities...');

  const activities = [];

  // Generate activities for each user
  const userIds = ['user-001', 'user-002', 'user-003'];

  for (const userId of userIds) {
    // Gaming activities
    for (let i = 0; i < 10; i++) {
      activities.push({
        userId,
        type: 'game_end',
        action: random(0, 1) ? 'Won Game' : 'Played Game',
        description: `Crypto Warriors - Score: ${random(5000, 10000)}`,
        category: 'gaming',
        value: random(200, 500),
        status: 'success',
        createdAt: daysAgo(random(1, 30))
      });
    }

    // DeFi activities
    for (let i = 0; i < 8; i++) {
      const types = ['swap', 'add_liquidity', 'stake'];
      const type = types[random(0, types.length - 1)];
      activities.push({
        userId,
        type,
        action: type === 'swap' ? 'Token Swap' : type === 'add_liquidity' ? 'Added Liquidity' : 'Staked Tokens',
        description: `${type} - $${random(1000, 10000)}`,
        category: 'defi',
        value: random(1000, 10000),
        status: 'success',
        createdAt: daysAgo(random(1, 30))
      });
    }

    // Achievement unlocks
    activities.push({
      userId,
      type: 'achievement_unlock',
      action: 'Achievement Unlocked',
      description: 'First Blood - Win your first game',
      category: 'gaming',
      value: 0,
      status: 'success',
      createdAt: daysAgo(random(15, 45))
    });
  }

  await UserActivity.deleteMany({});
  await UserActivity.insertMany(activities);
  console.log(`✅ Created ${activities.length} user activities`);
};

/**
 * Main Seed Function
 */
const seedDatabase = async () => {
  try {
    console.log('\n🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await connectDB();

    // Seed all data
    await seedUsers();
    await seedGamingStats();
    await seedDeFiPortfolios();
    await seedUserActivities();

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📊 Test users created:');
    console.log('  - user-001 (CryptoWarrior) - High gaming & DeFi activity');
    console.log('  - user-002 (DeFiMaster) - DeFi focused with some gaming');
    console.log('  - user-003 (GamingPro) - Gaming focused with minimal DeFi');
    console.log('\n💡 You can now test the dashboard API with these user IDs\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
