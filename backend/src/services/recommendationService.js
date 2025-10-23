/**
 * Recommendation Service
 * Generates personalized recommendations based on user activity
 * Separated from DashboardService for better maintainability and testability
 */

const { RECOMMENDATIONS } = require('../config/constants');

class RecommendationService {
  /**
   * Generate personalized recommendations for a user
   * @param {Object} gamingStats - User's gaming statistics
   * @param {Object} defiPortfolio - User's DeFi portfolio
   * @returns {Array} Array of recommendation objects
   */
  generateRecommendations(gamingStats, defiPortfolio) {
    const recommendations = [];

    // Add gaming recommendations
    recommendations.push(...this.getGamingRecommendations(gamingStats));

    // Add DeFi recommendations
    recommendations.push(...this.getDefiRecommendations(defiPortfolio));

    // Add cross-platform recommendations
    recommendations.push(...this.getCrossPlatformRecommendations(gamingStats, defiPortfolio));

    // Prioritize and limit recommendations
    return this.prioritizeRecommendations(recommendations);
  }

  /**
   * Get gaming-specific recommendations
   * @private
   */
  getGamingRecommendations(gamingStats) {
    const recommendations = [];

    if (!gamingStats) {
      return recommendations;
    }

    // New player bonus
    if (gamingStats.totalGamesPlayed < RECOMMENDATIONS.NEW_PLAYER_GAMES) {
      recommendations.push({
        category: 'gaming',
        title: 'New Player Bonus',
        description: `Play ${RECOMMENDATIONS.NEW_PLAYER_GAMES} games to unlock bonus rewards!`,
        action: 'Play Now',
        priority: 'high',
      });
    }

    // Tournament qualification
    if (gamingStats.winRate > RECOMMENDATIONS.HIGH_WINRATE) {
      recommendations.push({
        category: 'gaming',
        title: 'Tournament Ready',
        description: 'Your high win rate qualifies you for premium tournaments!',
        action: 'Join Tournament',
        priority: 'medium',
      });
    }

    // Hot streak notification
    if (gamingStats.currentStreak >= RECOMMENDATIONS.HOT_STREAK_MIN) {
      recommendations.push({
        category: 'gaming',
        title: 'Hot Streak!',
        description: `You're on a ${gamingStats.currentStreak} game winning streak!`,
        action: 'Keep Playing',
        priority: 'high',
      });
    }

    return recommendations;
  }

  /**
   * Get DeFi-specific recommendations
   * @private
   */
  getDefiRecommendations(defiPortfolio) {
    const recommendations = [];

    if (!defiPortfolio) {
      return recommendations;
    }

    const activePositions = (defiPortfolio.positions || []).filter(p => p.status === 'active');

    // Portfolio diversification
    if (activePositions.length < RECOMMENDATIONS.MIN_PORTFOLIO_DIVERSITY && defiPortfolio.totalValue > 0) {
      recommendations.push({
        category: 'defi',
        title: 'Diversify Portfolio',
        description: 'Consider adding more pools to diversify your DeFi portfolio',
        action: 'Browse Pools',
        priority: 'medium',
      });
    }

    // Low yield warning
    if (activePositions.length > 0) {
      const avgAPY = activePositions.reduce((sum, p) => sum + (p.apy || 0), 0) / activePositions.length;
      if (avgAPY < RECOMMENDATIONS.MIN_APY_THRESHOLD) {
        recommendations.push({
          category: 'defi',
          title: 'High Yield Opportunities',
          description: `Check out pools with higher APY rates (${RECOMMENDATIONS.MIN_APY_THRESHOLD}%+)`,
          action: 'Explore Yields',
          priority: 'low',
        });
      }
    }

    // Portfolio alert for losses
    if (defiPortfolio.totalPnLPercentage < RECOMMENDATIONS.PORTFOLIO_ALERT_THRESHOLD) {
      recommendations.push({
        category: 'defi',
        title: 'Portfolio Alert',
        description: 'Your portfolio is down. Consider reviewing your positions.',
        action: 'Review Portfolio',
        priority: 'high',
      });
    }

    return recommendations;
  }

  /**
   * Get cross-platform recommendations
   * @private
   */
  getCrossPlatformRecommendations(gamingStats, defiPortfolio) {
    const recommendations = [];

    // Power user benefits
    const hasGamingActivity = gamingStats && gamingStats.totalGamesPlayed > 0;
    const hasDefiActivity = defiPortfolio && defiPortfolio.totalValue > 0;

    if (hasGamingActivity && hasDefiActivity) {
      recommendations.push({
        category: 'cross-platform',
        title: 'Power User Benefits',
        description: "You're active on both Gaming and DeFi! Unlock special rewards.",
        action: 'View Rewards',
        priority: 'high',
      });
    }

    return recommendations;
  }

  /**
   * Prioritize and limit recommendations
   * @private
   */
  prioritizeRecommendations(recommendations) {
    const priorityMap = {
      high: 3,
      medium: 2,
      low: 1
    };

    return recommendations
      .sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority])
      .slice(0, RECOMMENDATIONS.MAX_RECOMMENDATIONS);
  }
}

module.exports = new RecommendationService();
