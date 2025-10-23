import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ArenaHeader from "@/components/ArenaHeader";
import ArenaFooter from "@/components/ArenaFooter";
import TradingChart from "@/components/TradingChart";
import AchievementSystem from "@/components/AchievementSystem";
import { HolographicCard } from "@/components/HolographicCard";
import { MagneticButton } from "@/components/MagneticButton";
import { QuantumTradingBackground } from "@/components/backgrounds/QuantumTradingBackground";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Trophy,
  Star,
  Coins,
  Target,
  Activity,
  BarChart3,
  Sparkles,
  Crown,
  Flame,
  Award,
  Rocket,
  Brain,
  Shield,
  Swords,
  Wallet,
  LineChart,
} from "lucide-react";
import { toast } from "sonner";

interface TradingSignal {
  type: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reason: string;
  timestamp: string;
}

interface UserStats {
  level: number;
  xp: number;
  nextLevelXP: number;
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  streak: number;
  rank: number;
}

const AdvancedTrading = () => {
  const [activeSignal, setActiveSignal] = useState<TradingSignal | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 12,
    xp: 8450,
    nextLevelXP: 10000,
    totalTrades: 156,
    winRate: 68.5,
    totalProfit: 12450.5,
    streak: 4,
    rank: 247,
  });
  const [recentSignals, setRecentSignals] = useState<TradingSignal[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);

  // Handle new trading signals
  const handleSignalGenerated = (signal: TradingSignal) => {
    setActiveSignal(signal);
    setRecentSignals((prev) => [signal, ...prev.slice(0, 9)]);

    // Show toast notification with sound effect
    if (signal.type === "BUY") {
      toast.success("🚀 BUY Signal Detected!", {
        description: `Confidence: ${signal.confidence}% - ${signal.reason}`,
        duration: 5000,
      });
    } else if (signal.type === "SELL") {
      toast.error("📉 SELL Signal Detected!", {
        description: `Confidence: ${signal.confidence}% - ${signal.reason}`,
        duration: 5000,
      });
    }
  };

  // Handle achievement unlocks
  const handleAchievementUnlock = (achievement: any) => {
    toast.success("🏆 Achievement Unlocked!", {
      description: `${achievement.title} - +${achievement.xpReward} XP, +${achievement.tokenReward} LUM`,
      duration: 7000,
    });

    // Update user stats
    setUserStats((prev) => ({
      ...prev,
      xp: prev.xp + achievement.xpReward,
    }));

    // Play celebration animation
    playAchievementAnimation();
  };

  const playAchievementAnimation = () => {
    // Trigger confetti or celebration effect
    console.log("🎉 Achievement unlocked animation!");
  };

  // Simulate trading activity
  const executeTrade = (type: "BUY" | "SELL") => {
    const isWin = Math.random() > 0.3;
    const profit = isWin ? Math.random() * 500 : -Math.random() * 200;

    setUserStats((prev) => ({
      ...prev,
      totalTrades: prev.totalTrades + 1,
      totalProfit: prev.totalProfit + profit,
      winRate:
        (prev.winRate * prev.totalTrades + (isWin ? 100 : 0)) /
        (prev.totalTrades + 1),
      streak: isWin ? prev.streak + 1 : 0,
      xp: prev.xp + (isWin ? 50 : 10),
    }));

    if (isWin) {
      toast.success(`✅ Trade Successful! +$${profit.toFixed(2)}`, {
        description: `+50 XP | Streak: ${userStats.streak + 1} 🔥`,
      });
    } else {
      toast.error(`❌ Trade Loss: -$${Math.abs(profit).toFixed(2)}`, {
        description: `+10 XP | Streak Reset`,
      });
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case "BUY":
        return "text-green-400";
      case "SELL":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getLevelProgress = () => {
    return (userStats.xp / userStats.nextLevelXP) * 100;
  };

  return (
    <div className="min-h-screen relative">
      {/* 🌌 QUANTUM TRADING BACKGROUND */}
      <QuantumTradingBackground />

      {/* Main Content */}
      <div className="relative z-10">
        <ArenaHeader />

        <main className="pt-24 pb-16">
          {/* Hero Section with Stats */}
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="max-w-7xl mx-auto">
                {/* Title */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-gold border border-yellow-400/30 mb-6">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                    <span className="text-sm font-semibold text-gradient-gold">
                      AI-Powered Quantum Trading
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    <span className="text-gradient-gold text-glow-gold">
                      Trading Arena
                    </span>
                    <br />
                    <span className="text-gradient-silver text-glow-silver">
                      Cosmic Profits
                    </span>
                  </h1>

                  <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
                    Trade with AI signals, earn XP & NFT rewards, compete on the
                    leaderboard
                  </p>
                </div>

                {/* User Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                  {/* Level Card */}
                  <HolographicCard theme="gold" className="col-span-2">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-yellow-500/20">
                          <Crown className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground/60">Level</p>
                          <p className="text-2xl font-bold text-gradient-gold">
                            {userStats.level}
                          </p>
                          <div className="mt-1">
                            <Progress
                              value={getLevelProgress()}
                              className="h-1.5"
                            />
                            <p className="text-xs text-foreground/60 mt-1">
                              {userStats.xp}/{userStats.nextLevelXP} XP
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HolographicCard>

                  {/* Streak Card */}
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <Flame className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                      <p className="text-2xl font-bold text-gradient-gold">
                        {userStats.streak}
                      </p>
                      <p className="text-xs text-foreground/60">Day Streak</p>
                    </div>
                  </HolographicCard>

                  {/* Win Rate Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <Target className="w-6 h-6 mx-auto mb-1 text-green-400" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        {userStats.winRate.toFixed(1)}%
                      </p>
                      <p className="text-xs text-foreground/60">Win Rate</p>
                    </div>
                  </HolographicCard>

                  {/* Total Trades Card */}
                  <HolographicCard theme="purple">
                    <div className="p-4 text-center">
                      <Activity className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        {userStats.totalTrades}
                      </p>
                      <p className="text-xs text-foreground/60">Trades</p>
                    </div>
                  </HolographicCard>

                  {/* Profit Card */}
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <Coins className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                      <p className="text-2xl font-bold text-gradient-gold">
                        ${(userStats.totalProfit / 1000).toFixed(1)}K
                      </p>
                      <p className="text-xs text-foreground/60">Profit</p>
                    </div>
                  </HolographicCard>

                  {/* Rank Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <Trophy className="w-6 h-6 mx-auto mb-1 text-gray-300" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        #{userStats.rank}
                      </p>
                      <p className="text-xs text-foreground/60">Rank</p>
                    </div>
                  </HolographicCard>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <MagneticButton
                    className="btn-gold px-6 py-3 rounded-lg flex items-center gap-2"
                    onClick={() => setShowAchievements(!showAchievements)}
                  >
                    <Trophy className="w-5 h-5" />
                    Achievements
                  </MagneticButton>
                  <MagneticButton className="btn-silver px-6 py-3 rounded-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Leaderboard
                  </MagneticButton>
                  <MagneticButton className="btn-gold px-6 py-3 rounded-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    My NFTs
                  </MagneticButton>
                  <MagneticButton className="btn-silver px-6 py-3 rounded-lg flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </MagneticButton>
                </div>
              </div>
            </div>
          </section>

          {/* Main Trading Interface */}
          <section className="px-4 pb-16">
            <div className="container mx-auto">
              <Tabs defaultValue="trading" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 glass-card-gold border border-yellow-400/30">
                  <TabsTrigger value="trading">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trading
                  </TabsTrigger>
                  <TabsTrigger value="achievements">
                    <Trophy className="w-4 h-4 mr-2" />
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger value="signals">
                    <Zap className="w-4 h-4 mr-2" />
                    Signal History
                  </TabsTrigger>
                </TabsList>

                {/* Trading Tab */}
                <TabsContent value="trading" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart - Takes 2 columns */}
                    <div className="lg:col-span-2">
                      <TradingChart
                        pair="Lumeris/ETH"
                        onSignalGenerated={handleSignalGenerated}
                      />
                    </div>

                    {/* Trading Panel */}
                    <div className="space-y-4">
                      {/* Quick Trade Card */}
                      <HolographicCard theme="gold">
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Rocket className="w-5 h-5 text-yellow-400" />
                            <h3 className="text-lg font-bold text-gradient-gold">
                              Quick Trade
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <MagneticButton
                              className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-400 py-3 rounded-lg flex items-center justify-center gap-2"
                              onClick={() => executeTrade("BUY")}
                            >
                              <TrendingUp className="w-5 h-5" />
                              BUY
                            </MagneticButton>
                            <MagneticButton
                              className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-400 py-3 rounded-lg flex items-center justify-center gap-2"
                              onClick={() => executeTrade("SELL")}
                            >
                              <TrendingDown className="w-5 h-5" />
                              SELL
                            </MagneticButton>
                          </div>

                          {activeSignal && (
                            <div
                              className={`p-4 rounded-lg border ${
                                activeSignal.type === "BUY"
                                  ? "bg-green-500/10 border-green-400/30"
                                  : activeSignal.type === "SELL"
                                    ? "bg-red-500/10 border-red-400/30"
                                    : "bg-gray-500/10 border-gray-400/30"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Brain className="w-4 h-4 text-purple-400" />
                                  <span className="text-sm font-semibold">
                                    AI Signal
                                  </span>
                                </div>
                                <Badge
                                  className={
                                    activeSignal.type === "BUY"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-red-500/20 text-red-400"
                                  }
                                >
                                  {activeSignal.type}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-foreground/60">
                                    Confidence:
                                  </span>
                                  <span className="font-bold">
                                    {activeSignal.confidence}%
                                  </span>
                                </div>
                                <p className="text-xs text-foreground/60 mt-2">
                                  {activeSignal.reason}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </HolographicCard>

                      {/* Market Stats */}
                      <HolographicCard theme="silver">
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <LineChart className="w-5 h-5 text-gray-300" />
                            <h3 className="text-lg font-bold text-gradient-silver">
                              Market Overview
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/60">
                                24h Volume:
                              </span>
                              <span className="font-semibold text-gradient-gold">
                                $2.4M
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/60">
                                24h Change:
                              </span>
                              <span className="font-semibold text-green-400">
                                +12.5%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/60">
                                Market Cap:
                              </span>
                              <span className="font-semibold text-gradient-silver">
                                $45.2M
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground/60">
                                Liquidity:
                              </span>
                              <span className="font-semibold text-gradient-gold">
                                $8.9M
                              </span>
                            </div>
                          </div>
                        </div>
                      </HolographicCard>

                      {/* Daily Challenge */}
                      <HolographicCard theme="purple">
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-bold text-gradient-silver">
                              Daily Challenge
                            </h3>
                          </div>

                          <p className="text-sm mb-3">
                            Complete 5 profitable trades
                          </p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress:</span>
                              <span className="font-semibold">2/5</span>
                            </div>
                            <Progress value={40} className="h-2" />
                            <div className="flex items-center gap-2 text-sm text-purple-400">
                              <Award className="w-4 h-4" />
                              <span>Reward: 500 XP + 50 Lumeris</span>
                            </div>
                          </div>
                        </div>
                      </HolographicCard>
                    </div>
                  </div>
                </TabsContent>

                {/* Achievements Tab */}
                <TabsContent value="achievements">
                  <HolographicCard theme="gold">
                    <div className="p-6">
                      <AchievementSystem
                        userLevel={userStats.level}
                        userXP={userStats.xp}
                        onAchievementUnlock={handleAchievementUnlock}
                      />
                    </div>
                  </HolographicCard>
                </TabsContent>

                {/* Signal History Tab */}
                <TabsContent value="signals">
                  <HolographicCard theme="silver">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-2xl font-bold text-gradient-silver">
                          Recent Trading Signals
                        </h2>
                      </div>
                      <p className="text-foreground/60">
                        AI-generated signals from the last 24 hours
                      </p>

                      <div className="space-y-3 mt-6">
                        {recentSignals.length === 0 ? (
                          <div className="text-center py-12">
                            <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
                            <p className="text-foreground/60">
                              No signals yet. Start trading to see AI
                              predictions!
                            </p>
                          </div>
                        ) : (
                          recentSignals.map((signal, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 rounded-lg glass-card border border-gray-400/20 hover:border-gray-400/40 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-full ${
                                    signal.type === "BUY"
                                      ? "bg-green-500/20"
                                      : signal.type === "SELL"
                                        ? "bg-red-500/20"
                                        : "bg-gray-500/20"
                                  }`}
                                >
                                  {signal.type === "BUY" ? (
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                  ) : signal.type === "SELL" ? (
                                    <TrendingDown className="w-5 h-5 text-red-400" />
                                  ) : (
                                    <Activity className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p
                                    className={`font-semibold ${getSignalColor(
                                      signal.type
                                    )}`}
                                  >
                                    {signal.type}
                                  </p>
                                  <p className="text-sm text-foreground/60">
                                    {signal.reason}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gradient-gold">
                                  {signal.confidence}%
                                </p>
                                <p className="text-xs text-foreground/60">
                                  {new Date(
                                    signal.timestamp
                                  ).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </HolographicCard>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>

        <ArenaFooter />
      </div>
    </div>
  );
};

export default AdvancedTrading;
