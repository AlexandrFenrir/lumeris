const mongoose = require('mongoose');

/**
 * User Activity Schema - Tracks all user actions across the platform
 */
const userActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: [
      // Gaming
      'gaming',
      'game_start',
      'game_end',
      'tournament_join',
      'achievement_unlock',
      // DeFi
      'defi',
      'swap',
      'add_liquidity',
      'remove_liquidity',
      'stake',
      'unstake',
      'claim_rewards',
      // NFT
      'nft',
      'nft_mint',
      'nft_buy',
      'nft_sell',
      'nft_list',
      // Governance
      'governance',
      'proposal_create',
      'proposal_vote',
      // Social
      'social',
      'follow',
      'comment',
      // Profile
      'profile_update',
      'level_up'
    ]
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  category: {
    type: String,
    enum: ['gaming', 'defi', 'nft', 'governance', 'social', 'system'],
    required: true
  },
  value: {
    // For tracking monetary values or scores
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['success', 'pending', 'failed'],
    default: 'success'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ type: 1, createdAt: -1 });
userActivitySchema.index({ category: 1, createdAt: -1 });
userActivitySchema.index({ createdAt: -1 });

// Compound indexes for common query patterns (used in getRecentActivities)
userActivitySchema.index({ userId: 1, category: 1, createdAt: -1 }); // For filtered user activities
userActivitySchema.index({ userId: 1, type: 1, createdAt: -1 }); // For specific activity types
userActivitySchema.index({ userId: 1, status: 1, createdAt: -1 }); // For filtering by status

// TTL index - automatically delete activities older than 90 days
userActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Virtual for formatted timestamp
userActivitySchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return this.createdAt.toLocaleDateString();
});

// Static method to log activity
userActivitySchema.statics.logActivity = async function(activityData) {
  try {
    const activity = new this(activityData);
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};

// Static method to get recent activities
userActivitySchema.statics.getRecentActivities = async function(userId, options = {}) {
  const {
    limit = 20,
    category = null,
    type = null,
    days = 7
  } = options;

  const query = { userId };

  if (category) {
    query.category = category;
  }

  if (type) {
    query.type = type;
  }

  // Filter by time range
  if (days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    query.createdAt = { $gte: cutoffDate };
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Static method to get activity summary
userActivitySchema.statics.getActivitySummary = async function(userId, days = 7) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const summary = await this.aggregate([
    {
      $match: {
        userId,
        createdAt: { $gte: cutoffDate }
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' }
      }
    }
  ]);

  return summary.reduce((acc, item) => {
    acc[item._id] = {
      count: item.count,
      totalValue: item.totalValue
    };
    return acc;
  }, {});
};

module.exports = mongoose.model('UserActivity', userActivitySchema);
