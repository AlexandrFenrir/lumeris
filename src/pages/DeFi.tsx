import { useState } from "react";
import ArenaHeader from "@/components/ArenaHeader";
import ArenaFooter from "@/components/ArenaFooter";
import { HolographicCard } from "@/components/HolographicCard";
import { MagneticButton } from "@/components/MagneticButton";
import { TreasureDimensionBackground } from "@/components/backgrounds/TreasureDimensionBackground";
import { LiveBettingSystem } from "@/components/LiveBettingSystem";
import TradingChart from "@/components/TradingChart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Droplets,
  PiggyBank,
  Target,
  Zap,
  Sparkles,
  ArrowRight,
  Flame,
  Trophy,
  DollarSign,
  Brain,
  Wallet,
  Crown,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const liquidityPools = [
  {
    pair: "LUMERIS/ETH",
    tvl: "$5.2M",
    apy: "245.8%",
    volume24h: "$1.2M",
    type: "Gold Pool",
    multiplier: "3.5x",
  },
  {
    pair: "USDC/LUMERIS",
    tvl: "$3.8M",
    apy: "156.3%",
    volume24h: "$890K",
    type: "Stable Pool",
    multiplier: "2.2x",
  },
  {
    pair: "BTC/ETH",
    tvl: "$12.5M",
    apy: "89.7%",
    volume24h: "$3.4M",
    type: "Blue Chip",
    multiplier: "1.8x",
  },
  {
    pair: "GAME/LUMERIS",
    tvl: "$2.1M",
    apy: "389.2%",
    volume24h: "$456K",
    type: "Gaming Pool",
    multiplier: "5.0x",
  },
];

const stakingOptions = [
  {
    token: "LUMERIS",
    apy: "125%",
    locked: "30 Days",
    rewards: "LUMERIS + NFTs",
    totalStaked: "$8.5M",
  },
  {
    token: "LP-LUMERIS/ETH",
    apy: "245%",
    locked: "90 Days",
    rewards: "LUMERIS + Bonus",
    totalStaked: "$4.2M",
  },
  {
    token: "GAME",
    apy: "189%",
    locked: "60 Days",
    rewards: "GAME + XP",
    totalStaked: "$2.8M",
  },
];

const DeFi = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trading");

  return (
    <div className="min-h-screen relative">
      {/* 3D Treasure Dimension Background */}
      <TreasureDimensionBackground />

      <div className="relative z-10">
        <ArenaHeader />

        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-gold border border-yellow-500/30 mb-6">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="text-sm font-semibold text-gradient-gold">
                    Trading & DeFi Hub
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="text-gradient-gold text-glow-gold">
                    Trade
                  </span>
                  <span className="text-foreground"> & </span>
                  <span className="text-gradient-silver text-glow-silver">
                    Earn
                  </span>
                </h1>

                <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
                  Advanced trading tools, high-yield liquidity pools, and live
                  betting all in one futuristic platform
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <div className="text-3xl font-bold text-gradient-gold mb-1">
                        $45M+
                      </div>
                      <div className="text-sm text-foreground/60">
                        Total Volume
                      </div>
                    </div>
                  </HolographicCard>
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <div className="text-3xl font-bold text-gradient-silver mb-1">
                        $28M
                      </div>
                      <div className="text-sm text-foreground/60">TVL</div>
                    </div>
                  </HolographicCard>
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <div className="text-3xl font-bold text-gradient-gold mb-1">
                        245%
                      </div>
                      <div className="text-sm text-foreground/60">Max APY</div>
                    </div>
                  </HolographicCard>
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <div className="text-3xl font-bold text-gradient-silver mb-1">
                        12.5K
                      </div>
                      <div className="text-sm text-foreground/60">Traders</div>
                    </div>
                  </HolographicCard>
                </div>

                {/* User Stats & Quick Actions */}
                <div className="mt-12 space-y-6">
                  {/* User Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-6xl mx-auto">
                    <HolographicCard theme="gold">
                      <div className="p-4 text-center">
                        <Crown className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                        <p className="text-2xl font-bold text-gradient-gold">
                          12
                        </p>
                        <p className="text-xs text-foreground/60">Level</p>
                      </div>
                    </HolographicCard>
                    <HolographicCard theme="gold">
                      <div className="p-4 text-center">
                        <Flame className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                        <p className="text-2xl font-bold text-gradient-gold">
                          4
                        </p>
                        <p className="text-xs text-foreground/60">Day Streak</p>
                      </div>
                    </HolographicCard>
                    <HolographicCard theme="silver">
                      <div className="p-4 text-center">
                        <Trophy className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                        <p className="text-2xl font-bold text-gradient-silver">
                          68.5%
                        </p>
                        <p className="text-xs text-foreground/60">Win Rate</p>
                      </div>
                    </HolographicCard>
                    <HolographicCard theme="silver">
                      <div className="p-4 text-center">
                        <BarChart3 className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                        <p className="text-2xl font-bold text-gradient-silver">
                          156
                        </p>
                        <p className="text-xs text-foreground/60">Trades</p>
                      </div>
                    </HolographicCard>
                    <HolographicCard theme="gold">
                      <div className="p-4 text-center">
                        <TrendingUp className="w-6 h-6 mx-auto mb-1 text-green-400" />
                        <p className="text-2xl font-bold text-gradient-gold">
                          $12.4K
                        </p>
                        <p className="text-xs text-foreground/60">Profit</p>
                      </div>
                    </HolographicCard>
                    <HolographicCard theme="silver">
                      <div className="p-4 text-center">
                        <Crown className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                        <p className="text-2xl font-bold text-gradient-silver">
                          #247
                        </p>
                        <p className="text-xs text-foreground/60">Rank</p>
                      </div>
                    </HolographicCard>
                    <HolographicCard theme="purple">
                      <div className="p-4 text-center">
                        <Brain className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                        <p className="text-2xl font-bold text-purple-400">AI</p>
                        <p className="text-xs text-foreground/60">Active</p>
                      </div>
                    </HolographicCard>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <MagneticButton className="btn-gold px-6 py-3 rounded-lg flex items-center gap-2">
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
            </div>
          </section>

          {/* Main Content Tabs */}
          <section className="px-4">
            <div className="container mx-auto">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-8"
              >
                <TabsList className="glass-card-silver p-2 w-full max-w-2xl mx-auto grid grid-cols-4 border border-silver/30">
                  <TabsTrigger
                    value="trading"
                    className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400 data-[state=active]:border data-[state=active]:border-yellow-400/30 rounded-lg transition-all"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Trading
                  </TabsTrigger>
                  <TabsTrigger
                    value="liquidity"
                    className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border data-[state=active]:border-blue-400/30 rounded-lg transition-all"
                  >
                    <Droplets className="w-4 h-4 mr-2" />
                    Liquidity
                  </TabsTrigger>
                  <TabsTrigger
                    value="staking"
                    className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 data-[state=active]:border data-[state=active]:border-purple-400/30 rounded-lg transition-all"
                  >
                    <PiggyBank className="w-4 h-4 mr-2" />
                    Staking
                  </TabsTrigger>
                  <TabsTrigger
                    value="betting"
                    className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:border data-[state=active]:border-green-400/30 rounded-lg transition-all"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Betting
                  </TabsTrigger>
                </TabsList>

                {/* Trading Tab */}
                <TabsContent value="trading" className="space-y-6">
                  <HolographicCard theme="gold">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gradient-gold">
                          Live Trading Chart
                        </h2>
                        <MagneticButton
                          className="btn-gold px-6 py-3 rounded-lg flex items-center gap-2"
                          onClick={() => navigate("/advanced-trading")}
                        >
                          <Zap className="w-4 h-4" />
                          Advanced Trading
                          <ArrowRight className="w-4 h-4" />
                        </MagneticButton>
                      </div>
                      <TradingChart />
                    </div>
                  </HolographicCard>
                </TabsContent>

                {/* Liquidity Tab */}
                <TabsContent value="liquidity" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {liquidityPools.map((pool, index) => (
                      <HolographicCard key={index} theme="gold">
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-gradient-gold">
                                {pool.pair}
                              </h3>
                              <p className="text-sm text-foreground/60">
                                {pool.type}
                              </p>
                            </div>
                            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                              {pool.multiplier}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 p-4 glass-card rounded-lg">
                            <div>
                              <div className="text-xs text-foreground/60 mb-1">
                                TVL
                              </div>
                              <div className="font-bold text-gradient-gold">
                                {pool.tvl}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-foreground/60 mb-1">
                                APY
                              </div>
                              <div className="font-bold text-green-400">
                                {pool.apy}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-foreground/60 mb-1">
                                24h Vol
                              </div>
                              <div className="font-bold text-gradient-silver">
                                {pool.volume24h}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <MagneticButton className="flex-1 btn-gold py-3 rounded-lg">
                              Add Liquidity
                            </MagneticButton>
                            <Button variant="outline" className="flex-1">
                              Details
                            </Button>
                          </div>
                        </div>
                      </HolographicCard>
                    ))}
                  </div>
                </TabsContent>

                {/* Staking Tab */}
                <TabsContent value="staking" className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {stakingOptions.map((option, index) => (
                      <HolographicCard key={index} theme="silver">
                        <div className="p-6 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl gradient-silver flex items-center justify-center">
                              <PiggyBank className="w-6 h-6 text-black" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gradient-silver">
                                {option.token}
                              </h3>
                              <p className="text-sm text-foreground/60">
                                {option.locked}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-foreground/60">
                                APY
                              </span>
                              <span className="text-xl font-bold text-green-400">
                                {option.apy}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-foreground/60">
                                Rewards
                              </span>
                              <span className="text-sm font-semibold text-gradient-gold">
                                {option.rewards}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-foreground/60">
                                Total Staked
                              </span>
                              <span className="text-sm font-semibold">
                                {option.totalStaked}
                              </span>
                            </div>
                          </div>

                          <MagneticButton className="w-full btn-silver py-3 rounded-lg">
                            Stake Now
                          </MagneticButton>
                        </div>
                      </HolographicCard>
                    ))}
                  </div>
                </TabsContent>

                {/* Betting Tab */}
                <TabsContent value="betting">
                  <LiveBettingSystem />
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 mt-16">
            <div className="container mx-auto">
              <HolographicCard theme="cosmic">
                <div className="p-12 text-center space-y-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Flame className="w-8 h-8 text-yellow-400 animate-pulse" />
                    <h2 className="text-4xl font-bold text-gradient-gold">
                      Start Earning Today
                    </h2>
                    <Trophy className="w-8 h-8 text-purple-400 animate-pulse" />
                  </div>
                  <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                    Join thousands of traders earning passive income through our
                    advanced DeFi protocols and trading systems
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <MagneticButton
                      className="btn-gold px-8 py-4 text-lg rounded-xl flex items-center gap-2"
                      onClick={() => navigate("/advanced-trading")}
                    >
                      <Zap className="w-5 h-5" />
                      Start Trading
                    </MagneticButton>
                    <MagneticButton className="btn-silver px-8 py-4 text-lg rounded-xl flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Add Liquidity
                    </MagneticButton>
                  </div>
                </div>
              </HolographicCard>
            </div>
          </section>
        </main>

        <ArenaFooter />
      </div>
    </div>
  );
};

export default DeFi;
