/**
 * Application Constants
 * Centralized configuration for magic numbers and thresholds
 */

module.exports = {
  // Cache Time-To-Live (in seconds)
  // Multi-layer caching: Service layer (shorter) + Route layer (longer)
  CACHE_TTL: {
    LEADERBOARD: 60,           // 1 minute (route-level)
    DASHBOARD: 120,            // 2 minutes (route-level)
    DASHBOARD_SERVICE: 30,     // 30 seconds (service-level for fresher data)
    POOLS: 300,                // 5 minutes
    MARKET_DATA: 30,           // 30 seconds
    USER_PROFILE: 180,         // 3 minutes
    ANALYTICS_OVERVIEW: 60     // 1 minute
  },

  // Pagination Settings
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
    TRANSACTIONS_LIMIT: 100,
    ACTIVITIES_LIMIT: 10,
    SESSIONS_LIMIT: 5
  },

  // Data Retention
  RETENTION: {
    ACTIVITY_DAYS: 90,         // User activities TTL
    SESSION_DAYS: 30,          // Gaming sessions history
    TRANSACTION_DAYS: 90       // Transaction history
  },

  // Recommendation Thresholds
  RECOMMENDATIONS: {
    NEW_PLAYER_GAMES: 10,      // Games before "new player" recommendations stop
    HIGH_WINRATE: 60,          // Win rate % to qualify for tournaments
    HOT_STREAK_MIN: 5,         // Minimum streak to show "hot streak" message
    MIN_PORTFOLIO_DIVERSITY: 3, // Min positions for diversification recommendation
    MIN_APY_THRESHOLD: 100,    // APY threshold for "low yield" warning
    PORTFOLIO_ALERT_THRESHOLD: -10, // PnL % threshold for portfolio alert
    MAX_RECOMMENDATIONS: 5     // Maximum recommendations to show
  },

  // Database Configuration
  DATABASE: {
    MAX_POOL_SIZE: 50,
    MIN_POOL_SIZE: 10,
    SOCKET_TIMEOUT_MS: 45000,
    SERVER_SELECTION_TIMEOUT_MS: 5000,
    WAIT_QUEUE_TIMEOUT_MS: 5000,
    MAX_IDLE_TIME_MS: 10000
  },

  // Request Timeouts (in milliseconds)
  TIMEOUTS: {
    DEFAULT_REQUEST: 10000,    // 10 seconds
    DASHBOARD_QUERY: 5000,     // 5 seconds
    HEAVY_QUERY: 15000,        // 15 seconds for complex aggregations
    EXTERNAL_API: 8000         // 8 seconds for external API calls
  },

  // Rate Limiting
  RATE_LIMITS: {
    GLOBAL: {
      WINDOW_MS: 15 * 60 * 1000, // 15 minutes
      MAX_REQUESTS: 100
    },
    USER_DASHBOARD: {
      WINDOW_MS: 60 * 1000,      // 1 minute
      MAX_REQUESTS: 30
    },
    GAMING_API: {
      WINDOW_MS: 60 * 1000,      // 1 minute
      MAX_REQUESTS: 50
    },
    DEFI_TRANSACTIONS: {
      WINDOW_MS: 60 * 1000,      // 1 minute
      MAX_REQUESTS: 20
    }
  },

  // Validation Rules
  VALIDATION: {
    USER_ID_MIN_LENGTH: 1,
    USER_ID_MAX_LENGTH: 100,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
    BIO_MAX_LENGTH: 500,
    PASSWORD_MIN_LENGTH: 8,
    ETHEREUM_ADDRESS_PATTERN: /^0x[a-fA-F0-9]{40}$/,
    ALLOWED_TOKENS: [
      'Lumeris', 'ETH', 'BTC', 'USDC', 'USDT', 'DAI',
      'WETH', 'WBTC', 'MATIC', 'AVAX', 'BNB', 'SOL',
      'LINK', 'UNI'
    ]
  },

  // Gaming Constants
  GAMING: {
    MIN_LEVEL: 1,
    MAX_LEVEL: 100,
    RANKS: ['Unranked', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'],
    ACHIEVEMENT_RARITIES: ['common', 'rare', 'epic', 'legendary'],
    SESSION_TYPES: ['win', 'loss', 'draw'],
    TOURNAMENT_STATUS: ['active', 'completed', 'abandoned']
  },

  // DeFi Constants
  DEFI: {
    POSITION_STATUS: ['active', 'closed'],
    STAKING_STATUS: ['active', 'completed', 'unstaked'],
    TRANSACTION_TYPES: ['swap', 'add_liquidity', 'remove_liquidity', 'stake', 'unstake', 'claim_rewards'],
    TRANSACTION_STATUS: ['pending', 'success', 'failed'],
    MIN_SLIPPAGE: 0.1,
    MAX_SLIPPAGE: 50,
    DEFAULT_SLIPPAGE: 1
  },

  // Activity Types
  ACTIVITY: {
    TYPES: [
      'gaming', 'game_start', 'game_end', 'tournament_join', 'achievement_unlock',
      'defi', 'swap', 'add_liquidity', 'remove_liquidity', 'stake', 'unstake', 'claim_rewards',
      'nft', 'nft_mint', 'nft_buy', 'nft_sell', 'nft_list',
      'governance', 'proposal_create', 'proposal_vote',
      'social', 'follow', 'comment',
      'profile_update', 'level_up'
    ],
    CATEGORIES: ['gaming', 'defi', 'nft', 'governance', 'social', 'system'],
    STATUS: ['success', 'pending', 'failed']
  },

  // Portfolio Health Thresholds
  PORTFOLIO_HEALTH: {
    EXCELLENT: 20,             // PnL > 20%
    GOOD: 10,                  // PnL > 10%
    MODERATE: 0,               // PnL > 0%
    FAIR: -10,                 // PnL > -10%
    POOR: -Infinity            // PnL <= -10%
  },

  // Error Messages
  ERRORS: {
    USER_NOT_FOUND: 'User not found',
    INVALID_USER_ID: 'Invalid user ID',
    VALIDATION_ERROR: 'Validation Error',
    DATABASE_ERROR: 'Database operation failed',
    TIMEOUT_ERROR: 'Request timeout',
    RATE_LIMIT_ERROR: 'Too many requests',
    AUTHENTICATION_ERROR: 'Authentication failed',
    AUTHORIZATION_ERROR: 'Insufficient permissions'
  },

  // Success Messages
  MESSAGES: {
    DASHBOARD_SUCCESS: 'User dashboard successfully retrieved',
    GAME_STATS_UPDATED: 'Gaming stats updated successfully',
    DEFI_PORTFOLIO_UPDATED: 'DeFi portfolio updated successfully',
    ACTIVITY_LOGGED: 'Activity logged successfully',
    CACHE_HIT: 'Data retrieved from cache',
    CACHE_MISS: 'Data fetched from database'
  },

  // Feature Flags (for toggling features)
  FEATURES: {
    ENABLE_CACHING: true,
    ENABLE_RATE_LIMITING: true,
    ENABLE_ANALYTICS: true,
    ENABLE_RECOMMENDATIONS: true,
    ENABLE_WEBSOCKETS: true,
    ENABLE_ACTIVITY_LOGGING: true
  }
};
