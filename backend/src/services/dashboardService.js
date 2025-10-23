/**
 * Dashboard Service
 * Handles complex database queries for user dashboard data
 */

const User = require('../models/User');
const GamingStats = require('../models/GamingStats');
const DeFiPortfolio = require('../models/DeFiPortfolio');
const UserActivity = require('../models/UserActivity');
const TransactionHistory = require('../models/TransactionHistory');
const recommendationService = require('./recommendationService');
const cacheManager = require('../utils/cache');
const { PAGINATION, CACHE_TTL } = require('../config/constants');

class DashboardService {
  /**
   * Get comprehensive dashboard data for a user
   * Implements multi-layer caching:
   * - Service layer: 30 seconds (for fresher data)
   * - Route layer: 120 seconds (handled by cache middleware)
   *
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Dashboard data
   */
  async getUserDashboard(userId) {
    try {
      // Try service-level cache first (30 seconds TTL)
      const serviceCacheKey = `dashboard:service:${userId}`;
      const cachedData = await cacheManager.get(serviceCacheKey);

      if (cachedData) {
        return cachedData;
      }

      // Cache miss - fetch from database
      // Fetch all user data in parallel for performance
      // Using field projection to reduce data transfer by ~40%
      // Transactions are now fetched separately from TransactionHistory collection
      const [user, gamingStats, defiPortfolio, recentTransactions, recentActivity] = await Promise.all([
        User.findOne({userId})
            .select('userId username email walletAddress level rank avatar achievements')
            .lean(),
        GamingStats.findOne({userId})
            .select('userId totalGamesPlayed totalWins totalLosses totalDraws winRate totalEarnings highestScore averageScore currentStreak longestStreak totalPlaytime recentSessions gameHistory tournaments statistics')
            .lean(),
        DeFiPortfolio.findOne({userId})
            .select('userId totalValue totalPnL totalPnLPercentage positions staking statistics')
            .lean(),
        TransactionHistory.getRecentTransactions(userId, {limit: PAGINATION.ACTIVITIES_LIMIT}),
        UserActivity.getRecentActivities(userId, {limit: 10, days: 7})
      ]);

      // If user doesn't exist, return null
      if (!user) {
        return null;
      }

      // Calculate gaming statistics
      const gamingData = this._prepareGamingData(gamingStats, userId);

      // Calculate DeFi portfolio data
      const defiData = this._prepareDeFiData(defiPortfolio, recentTransactions, userId);

      // Calculate overview metrics
      const overview = {
        totalGamingEarnings: gamingData.totalEarnings,
        totalDeFiValue: defiData.totalValue,
        combinedValue: gamingData.totalEarnings + defiData.totalValue,
        defiPnL: defiData.totalPnL,
        defiPnLPercentage: defiData.totalPnLPercentage,
      };

      // Prepare activity feed
      const activity = {
        last7Days: {
          gamesPlayed: gamingData.gamesPlayed,
          defiTransactions: defiData.recentTransactions.length,
          totalTransactions: gamingData.gamesPlayed + defiData.recentTransactions.length,
        },
        recentActivity: this._combineRecentActivity(gamingStats, recentTransactions, recentActivity),
      };

      // Generate recommendations using the recommendation service
      const recommendations = recommendationService.generateRecommendations(gamingStats, defiPortfolio);

      const dashboardData = {
        userId,
        user: {
          username: user.username,
          email: user.email,
          walletAddress: user.walletAddress,
          level: user.level,
          rank: user.rank,
          avatar: user.avatar,
          achievements: user.achievements || [],
        },
        overview,
        gaming: gamingData,
        defi: defiData,
        activity,
        recommendations,
      };

      // Store in service-level cache
      await cacheManager.set(serviceCacheKey, dashboardData, CACHE_TTL.DASHBOARD_SERVICE);

      return dashboardData;
    } catch (error) {
      console.error('Error fetching user dashboard:', error);
      throw error;
    }
  }

  /**
   * Prepare gaming data for dashboard
   * @private
   */
  _prepareGamingData(gamingStats, userId) {
    if (!gamingStats) {
      return {
        userId,
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
      };
    }

    return {
      userId: gamingStats.userId,
      gamesPlayed: gamingStats.totalGamesPlayed || 0,
      totalWins: gamingStats.totalWins || 0,
      totalLosses: gamingStats.totalLosses || 0,
      totalDraws: gamingStats.totalDraws || 0,
      winRate: gamingStats.winRate || 0,
      totalEarnings: gamingStats.totalEarnings || 0,
      highestScore: gamingStats.highestScore || 0,
      averageScore: gamingStats.averageScore || 0,
      currentStreak: gamingStats.currentStreak || 0,
      longestStreak: gamingStats.longestStreak || 0,
      totalPlaytime: gamingStats.totalPlaytime || 0,
      recentSessions: (gamingStats.recentSessions || []).slice(0, PAGINATION.SESSIONS_LIMIT),
      gameHistory: gamingStats.gameHistory || [],
      tournaments: gamingStats.tournaments || [],
      statistics: gamingStats.statistics || {},
    };
  }

  /**
   * Prepare DeFi portfolio data for dashboard
   * @private
   * @param {Object} defiPortfolio - Portfolio document
   * @param {Array} recentTransactions - Recent transactions from TransactionHistory collection
   * @param {string} userId - User ID
   */
  _prepareDeFiData(defiPortfolio, recentTransactions, userId) {
    if (!defiPortfolio) {
      return {
        userId,
        totalValue: 0,
        totalPnL: 0,
        totalPnLPercentage: 0,
        positions: [],
        staking: [],
        recentTransactions: recentTransactions || [],
        statistics: {},
      };
    }

    // Get active positions only
    const activePositions = (defiPortfolio.positions || []).filter(p => p.status === 'active');
    const activeStaking = (defiPortfolio.staking || []).filter(s => s.status === 'active');

    return {
      userId: defiPortfolio.userId,
      totalValue: defiPortfolio.totalValue || 0,
      totalPnL: defiPortfolio.totalPnL || 0,
      totalPnLPercentage: defiPortfolio.totalPnLPercentage || 0,
      positions: activePositions,
      staking: activeStaking,
      recentTransactions: recentTransactions || [],
      statistics: defiPortfolio.statistics || {},
    };
  }

  /**
   * Combine recent activity from all sources
   * @private
   * @param {Object} gamingStats - Gaming statistics
   * @param {Array} recentTransactions - Recent transactions from TransactionHistory
   * @param {Array} userActivities - Recent user activities
   */
  _combineRecentActivity(gamingStats, recentTransactions, userActivities) {
    const activities = [];

    // Add gaming activities from recent sessions
    if (gamingStats && gamingStats.recentSessions) {
      gamingStats.recentSessions.slice(0, 3).forEach(session => {
        activities.push({
          type: 'gaming',
          action: session.result === 'win' ? 'Won Game' : 'Played Game',
          description: `${session.gameName} - Score: ${session.score}`,
          timestamp: session.endTime,
          value: session.earnings || 0,
        });
      });
    }

    // Add DeFi activities from recent transactions (now from separate collection)
    if (recentTransactions && recentTransactions.length > 0) {
      recentTransactions.slice(0, 3).forEach(tx => {
        activities.push({
          type: 'defi',
          action: this._formatTransactionType(tx.type),
          description: this._formatTransactionDescription(tx),
          timestamp: tx.timestamp,
          value: tx.amount || tx.amountOut || 0,
        });
      });
    }

    // Add general user activities
    if (userActivities) {
      userActivities.slice(0, 3).forEach(activity => {
        activities.push({
          type: activity.category,
          action: activity.action,
          description: activity.description,
          timestamp: activity.createdAt,
          value: activity.value || 0,
        });
      });
    }

    // Sort by timestamp descending and limit to 5
    return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
  }

  /**
   * Format transaction type for display
   * @private
   */
  _formatTransactionType(type) {
    const typeMap = {
      swap: 'Token Swap',
      add_liquidity: 'Added Liquidity',
      remove_liquidity: 'Removed Liquidity',
      stake: 'Staked Tokens',
      unstake: 'Unstaked Tokens',
      claim_rewards: 'Claimed Rewards',
    };
    return typeMap[type] || type;
  }

  /**
   * Format transaction description
   * @private
   */
  _formatTransactionDescription(tx) {
    if (tx.type === 'swap') {
      return `${tx.amountIn} ${tx.tokenIn} → ${tx.amountOut} ${tx.tokenOut}`;
    }
    if (tx.type === 'add_liquidity' || tx.type === 'remove_liquidity') {
      return `${tx.poolId} - $${tx.amount}`;
    }
    if (tx.type === 'stake' || tx.type === 'unstake') {
      return `${tx.yieldId} - $${tx.amount}`;
    }
    return `Transaction ${tx.transactionId}`;
  }
}

module.exports = new DashboardService();
