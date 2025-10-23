const mongoose = require('mongoose');

/**
 * User Schema - Core user profile and basic information
 */
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    match: /^0x[a-fA-F0-9]{40}$/
  },
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  rank: {
    type: String,
    enum: ['Unranked', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'],
    default: 'Unranked'
  },
  achievements: [{
    achievementId: String,
    name: String,
    description: String,
    icon: String,
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    }
  }],
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  socialLinks: {
    twitter: String,
    discord: String,
    telegram: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ createdAt: -1 });

// Compound indexes for common query patterns
userSchema.index({ userId: 1, level: -1 }); // For leaderboard queries
userSchema.index({ isActive: 1, lastLogin: -1 }); // For active user queries
userSchema.index({ rank: 1, level: -1 }); // For ranking queries

// Virtual for full profile
userSchema.virtual('profileUrl').get(function() {
  return `/profile/${this.userId}`;
});

module.exports = mongoose.model('User', userSchema);
