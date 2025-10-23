const mongoose = require('mongoose');

/**
 * Gaming Stats Schema - User gaming performance and history
 */
const gamingStatsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    ref: 'User'
  },
  totalGamesPlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  totalWins: {
    type: Number,
    default: 0,
    min: 0
  },
  totalLosses: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDraws: {
    type: Number,
    default: 0,
    min: 0
  },
  winRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPlaytime: {
    type: Number, // in minutes
    default: 0,
    min: 0
  },
  highestScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  gameHistory: [{
    gameId: String,
    gameName: String,
    gamesPlayed: {
      type: Number,
      default: 0
    },
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    },
    earnings: {
      type: Number,
      default: 0
    },
    highScore: {
      type: Number,
      default: 0
    },
    lastPlayed: Date,
    totalPlaytime: {
      type: Number,
      default: 0
    }
  }],
  recentSessions: [{
    sessionId: String,
    gameId: String,
    gameName: String,
    score: Number,
    result: {
      type: String,
      enum: ['win', 'loss', 'draw']
    },
    earnings: Number,
    duration: Number, // in minutes
    startTime: Date,
    endTime: Date
  }],
  tournaments: [{
    tournamentId: String,
    tournamentName: String,
    joinedAt: Date,
    placement: Number,
    totalParticipants: Number,
    earnings: Number,
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned']
    }
  }],
  statistics: {
    favoriteGame: String,
    mostPlayedCategory: String,
    averageSessionDuration: Number,
    totalRewardsClaimed: Number,
    perfectGames: Number // games with maximum score
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
gamingStatsSchema.index({ userId: 1 });
gamingStatsSchema.index({ totalEarnings: -1 });
gamingStatsSchema.index({ 'recentSessions.endTime': -1 });

// Compound indexes for common query patterns
gamingStatsSchema.index({ userId: 1, totalGamesPlayed: -1 }); // For user stats queries
gamingStatsSchema.index({ userId: 1, totalEarnings: -1 }); // For earnings leaderboard
gamingStatsSchema.index({ userId: 1, winRate: -1 }); // For win rate queries
gamingStatsSchema.index({ userId: 1, 'recentSessions.endTime': -1 }); // For recent activity

// Virtual for performance metrics
gamingStatsSchema.virtual('performanceRating').get(function() {
  const winWeight = 0.4;
  const earningsWeight = 0.3;
  const playtimeWeight = 0.2;
  const streakWeight = 0.1;

  return (
    (this.winRate * winWeight) +
    (Math.min(this.totalEarnings / 10000, 100) * earningsWeight) +
    (Math.min(this.totalPlaytime / 1000, 100) * playtimeWeight) +
    (Math.min(this.longestStreak * 10, 100) * streakWeight)
  );
});

// Method to calculate win rate
gamingStatsSchema.methods.calculateWinRate = function() {
  if (this.totalGamesPlayed === 0) return 0;
  return ((this.totalWins / this.totalGamesPlayed) * 100).toFixed(2);
};

// Method to update stats after a game
gamingStatsSchema.methods.updateAfterGame = function(gameResult) {
  this.totalGamesPlayed += 1;

  if (gameResult.result === 'win') this.totalWins += 1;
  else if (gameResult.result === 'loss') this.totalLosses += 1;
  else this.totalDraws += 1;

  this.totalEarnings += gameResult.earnings || 0;
  this.totalPlaytime += gameResult.duration || 0;

  if (gameResult.score > this.highestScore) {
    this.highestScore = gameResult.score;
  }

  this.winRate = this.calculateWinRate();

  // Update streak
  if (gameResult.result === 'win') {
    this.currentStreak += 1;
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
  } else {
    this.currentStreak = 0;
  }

  return this.save();
};

module.exports = mongoose.model('GamingStats', gamingStatsSchema);
