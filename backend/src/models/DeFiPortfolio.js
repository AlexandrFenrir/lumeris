const mongoose = require('mongoose');

/**
 * DeFi Portfolio Schema - User's DeFi positions and staking
 * Note: Transactions are now stored in a separate TransactionHistory collection for better performance
 */
const defiPortfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    ref: 'User'
  },
  totalValue: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPnL: {
    type: Number,
    default: 0
  },
  totalPnLPercentage: {
    type: Number,
    default: 0
  },
  positions: [{
    poolId: {
      type: String,
      required: true
    },
    poolName: String,
    pair: String, // e.g., "ETH/USDC"
    blockchain: String,
    liquidity: {
      type: Number,
      default: 0,
      min: 0
    },
    lpTokens: {
      type: Number,
      default: 0,
      min: 0
    },
    token0Amount: Number,
    token1Amount: Number,
    initialValue: Number,
    currentValue: Number,
    pnl: {
      type: Number,
      default: 0
    },
    pnlPercentage: {
      type: Number,
      default: 0
    },
    apy: {
      type: Number,
      default: 0
    },
    rewards: {
      type: Number,
      default: 0
    },
    feesEarned: {
      type: Number,
      default: 0
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  }],
  staking: [{
    yieldId: {
      type: String,
      required: true
    },
    name: String,
    poolName: String,
    staked: {
      type: Number,
      default: 0,
      min: 0
    },
    rewards: {
      type: Number,
      default: 0,
      min: 0
    },
    apy: {
      type: Number,
      default: 0
    },
    lockPeriod: String, // e.g., "30 days"
    startTime: Date,
    endTime: Date,
    claimedRewards: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'unstaked'],
      default: 'active'
    }
  }],
  statistics: {
    totalSwaps: {
      type: Number,
      default: 0
    },
    totalLiquidityAdded: {
      type: Number,
      default: 0
    },
    totalRewardsClaimed: {
      type: Number,
      default: 0
    },
    totalFeesEarned: {
      type: Number,
      default: 0
    },
    averageAPY: {
      type: Number,
      default: 0
    },
    activePositionsCount: {
      type: Number,
      default: 0
    },
    highestSingleEarning: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
defiPortfolioSchema.index({ userId: 1 });
defiPortfolioSchema.index({ totalValue: -1 });

// Compound indexes for common query patterns
defiPortfolioSchema.index({ userId: 1, totalValue: -1 }); // For user portfolio queries
defiPortfolioSchema.index({ userId: 1, 'positions.status': 1 }); // For active positions
defiPortfolioSchema.index({ userId: 1, 'staking.status': 1 }); // For active staking
defiPortfolioSchema.index({ userId: 1, totalPnLPercentage: -1 }); // For portfolio performance

// Virtual for portfolio health
defiPortfolioSchema.virtual('portfolioHealth').get(function() {
  if (this.totalValue === 0) return 'inactive';
  if (this.totalPnLPercentage > 20) return 'excellent';
  if (this.totalPnLPercentage > 10) return 'good';
  if (this.totalPnLPercentage > 0) return 'moderate';
  if (this.totalPnLPercentage > -10) return 'fair';
  return 'poor';
});

// Virtual for active positions
defiPortfolioSchema.virtual('activePositions').get(function() {
  return this.positions.filter(p => p.status === 'active');
});

// Method to calculate portfolio metrics
defiPortfolioSchema.methods.calculateMetrics = function() {
  // Calculate total value from active positions
  this.totalValue = this.positions
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.currentValue || p.liquidity), 0);

  // Add staking values
  this.totalValue += this.staking
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.staked, 0);

  // Calculate total PnL
  this.totalPnL = this.positions
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.pnl || 0), 0);

  // Calculate PnL percentage
  const totalInitialValue = this.positions
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + (p.initialValue || p.liquidity), 0);

  if (totalInitialValue > 0) {
    this.totalPnLPercentage = ((this.totalPnL / totalInitialValue) * 100).toFixed(2);
  }

  // Update statistics
  this.statistics.activePositionsCount = this.activePositions.length;
  // Note: totalSwaps is now calculated from TransactionHistory collection
  this.statistics.totalRewardsClaimed = this.staking.reduce((sum, s) => sum + (s.claimedRewards || 0), 0);
  this.statistics.totalFeesEarned = this.positions.reduce((sum, p) => sum + (p.feesEarned || 0), 0);

  return this;
};

/**
 * Method to add a transaction
 * NOTE: Transactions are now stored in the TransactionHistory collection
 * This method is kept for backwards compatibility and delegates to TransactionHistory
 * @deprecated Use TransactionHistory.logTransaction() directly instead
 */
defiPortfolioSchema.methods.addTransaction = async function(txData) {
  const TransactionHistory = require('./TransactionHistory');

  // Add portfolioId to transaction data
  const transactionData = {
    ...txData,
    userId: this.userId,
    portfolioId: this._id,
    timestamp: txData.timestamp || new Date()
  };

  // Save to TransactionHistory collection
  await TransactionHistory.logTransaction(transactionData);

  // Update portfolio statistics
  if (txData.type === 'swap') {
    this.statistics.totalSwaps = (this.statistics.totalSwaps || 0) + 1;
  }
  if (txData.type === 'add_liquidity') {
    this.statistics.totalLiquidityAdded = (this.statistics.totalLiquidityAdded || 0) + (txData.amount || 0);
  }
  if (txData.type === 'claim_rewards') {
    this.statistics.totalRewardsClaimed = (this.statistics.totalRewardsClaimed || 0) + (txData.amount || 0);
  }

  return this.save();
};

/**
 * Method to get recent transactions
 * NOTE: Transactions are now queried from the TransactionHistory collection
 * @deprecated Use TransactionHistory.getRecentTransactions() directly instead
 */
defiPortfolioSchema.methods.getRecentTransactions = async function(limit = 10) {
  const TransactionHistory = require('./TransactionHistory');
  return TransactionHistory.getRecentTransactions(this.userId, { limit });
};

module.exports = mongoose.model('DeFiPortfolio', defiPortfolioSchema);
