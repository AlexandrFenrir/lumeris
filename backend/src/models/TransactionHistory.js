const mongoose = require('mongoose');
const { DEFI, RETENTION } = require('../config/constants');

/**
 * Transaction History Schema - Separate collection for DeFi transactions
 * Moved from embedded array in DeFiPortfolio for better performance
 *
 * Benefits:
 * - Smaller portfolio documents (80% reduction)
 * - Faster portfolio queries (no need to load all transactions)
 * - Easier to query transaction history independently
 * - Automatic cleanup with TTL index
 */
const transactionHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    ref: 'User'
  },
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeFiPortfolio',
    index: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: DEFI.TRANSACTION_TYPES,
    required: true,
    index: true
  },
  poolId: String,
  yieldId: String,
  tokenIn: String,
  tokenOut: String,
  amountIn: {
    type: Number,
    min: 0
  },
  amountOut: {
    type: Number,
    min: 0
  },
  amount: {
    type: Number,
    min: 0
  },
  fee: {
    type: Number,
    default: 0
  },
  gasUsed: String,
  gasPrice: String,
  hash: String,
  blockNumber: Number,
  status: {
    type: String,
    enum: DEFI.TRANSACTION_STATUS,
    default: 'success',
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for efficient queries
transactionHistorySchema.index({ userId: 1, timestamp: -1 }); // Most common: get user's transactions sorted by time
transactionHistorySchema.index({ userId: 1, type: 1, timestamp: -1 }); // Filter by transaction type
transactionHistorySchema.index({ userId: 1, status: 1, timestamp: -1 }); // Filter by status
transactionHistorySchema.index({ portfolioId: 1, timestamp: -1 }); // Get transactions for a specific portfolio

// TTL index - automatically delete transactions older than 90 days
transactionHistorySchema.index({ timestamp: 1 }, {
  expireAfterSeconds: RETENTION.TRANSACTION_DAYS * 24 * 60 * 60
});

// Virtual for formatted timestamp
transactionHistorySchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.timestamp;
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return 'Less than 1 hour ago';
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return this.timestamp.toLocaleDateString();
});

// Static method to get recent transactions for a user
transactionHistorySchema.statics.getRecentTransactions = async function(userId, options = {}) {
  const {
    limit = 10,
    type = null,
    status = null,
    days = null
  } = options;

  const query = { userId };

  if (type) {
    query.type = type;
  }

  if (status) {
    query.status = status;
  }

  // Filter by time range
  if (days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    query.timestamp = { $gte: cutoffDate };
  }

  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

// Static method to get transaction statistics
transactionHistorySchema.statics.getTransactionStats = async function(userId, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const stats = await this.aggregate([
    {
      $match: {
        userId,
        timestamp: { $gte: cutoffDate },
        status: 'success'
      }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: {
          $sum: {
            $ifNull: ['$amount', { $ifNull: ['$amountOut', 0] }]
          }
        },
        totalFees: { $sum: '$fee' }
      }
    }
  ]);

  return stats.reduce((acc, item) => {
    acc[item._id] = {
      count: item.count,
      totalAmount: item.totalAmount,
      totalFees: item.totalFees
    };
    return acc;
  }, {});
};

// Static method to log a new transaction
transactionHistorySchema.statics.logTransaction = async function(transactionData) {
  try {
    const transaction = new this(transactionData);
    await transaction.save();
    return transaction;
  } catch (error) {
    console.error('Error logging transaction:', error);
    throw error;
  }
};

module.exports = mongoose.model('TransactionHistory', transactionHistorySchema);
