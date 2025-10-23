import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  Star,
  Award,
  Target,
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  Coins,
  Shield,
  Flame,
  Lock,
  CheckCircle2,
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "trading" | "defi" | "gaming" | "social";
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  nftReward?: NFTReward;
  xpReward: number;
  tokenReward: number;
  unlockedAt?: string;
}

interface NFTReward {
  id: string;
  name: string;
  image: string;
  rarity: string;
  attributes: {
    trait: string;
    value: string;
  }[];
}

interface AchievementSystemProps {
  userLevel?: number;
  userXP?: number;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

const AchievementSystem = ({
  userLevel = 1,
  userXP = 0,
  onAchievementUnlock,
}: AchievementSystemProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Initialize achievements
  useEffect(() => {
    const initialAchievements: Achievement[] = [
      {
        id: "first-trade",
        title: "First Steps",
        description: "Complete your first trade",
        category: "trading",
        rarity: "common",
        icon: "🎯",
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        xpReward: 100,
        tokenReward: 10,
        unlockedAt: new Date().toISOString(),
        nftReward: {
          id: "nft-001",
          name: "Trader Initiate Badge",
          image: "🏅",
          rarity: "Common",
          attributes: [
            { trait: "Type", value: "Achievement Badge" },
            { trait: "Category", value: "Trading" },
            { trait: "Rarity", value: "Common" },
          ],
        },
      },
      {
        id: "volume-trader",
        title: "Volume Trader",
        description: "Trade $10,000 in total volume",
        category: "trading",
        rarity: "rare",
        icon: "💰",
        progress: 3500,
        maxProgress: 10000,
        unlocked: false,
        xpReward: 500,
        tokenReward: 50,
        nftReward: {
          id: "nft-002",
          name: "Volume Master NFT",
          image: "💎",
          rarity: "Rare",
          attributes: [
            { trait: "Type", value: "Achievement NFT" },
            { trait: "Category", value: "Trading" },
            { trait: "Rarity", value: "Rare" },
            { trait: "Power", value: "+5% Trading Bonus" },
          ],
        },
      },
      {
        id: "profit-master",
        title: "Profit Master",
        description: "Achieve 100% profit on a single trade",
        category: "trading",
        rarity: "epic",
        icon: "🚀",
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        xpReward: 1000,
        tokenReward: 100,
        nftReward: {
          id: "nft-003",
          name: "Profit King Crown",
          image: "👑",
          rarity: "Epic",
          attributes: [
            { trait: "Type", value: "Legendary Item" },
            { trait: "Category", value: "Trading" },
            { trait: "Rarity", value: "Epic" },
            { trait: "Power", value: "+10% Profit Boost" },
          ],
        },
      },
      {
        id: "liquidity-provider",
        title: "Liquidity Provider",
        description: "Provide liquidity to 5 different pools",
        category: "defi",
        rarity: "rare",
        icon: "💧",
        progress: 2,
        maxProgress: 5,
        unlocked: false,
        xpReward: 750,
        tokenReward: 75,
        nftReward: {
          id: "nft-004",
          name: "DeFi Pioneer Badge",
          image: "🌊",
          rarity: "Rare",
          attributes: [
            { trait: "Type", value: "Achievement Badge" },
            { trait: "Category", value: "DeFi" },
            { trait: "Rarity", value: "Rare" },
            { trait: "Power", value: "+3% APY Boost" },
          ],
        },
      },
      {
        id: "whale-status",
        title: "Whale Status",
        description: "Hold over $100,000 in assets",
        category: "trading",
        rarity: "legendary",
        icon: "🐋",
        progress: 0,
        maxProgress: 100000,
        unlocked: false,
        xpReward: 5000,
        tokenReward: 500,
        nftReward: {
          id: "nft-005",
          name: "Crypto Whale NFT",
          image: "🌟",
          rarity: "Legendary",
          attributes: [
            { trait: "Type", value: "Legendary NFT" },
            { trait: "Category", value: "Status" },
            { trait: "Rarity", value: "Legendary" },
            { trait: "Power", value: "+20% All Rewards" },
            { trait: "Prestige", value: "VIP Access" },
          ],
        },
      },
      {
        id: "gaming-champion",
        title: "Gaming Champion",
        description: "Win 50 games",
        category: "gaming",
        rarity: "epic",
        icon: "🏆",
        progress: 23,
        maxProgress: 50,
        unlocked: false,
        xpReward: 2000,
        tokenReward: 200,
        nftReward: {
          id: "nft-006",
          name: "Champion's Trophy",
          image: "🎮",
          rarity: "Epic",
          attributes: [
            { trait: "Type", value: "Trophy NFT" },
            { trait: "Category", value: "Gaming" },
            { trait: "Rarity", value: "Epic" },
            { trait: "Power", value: "+15% Game Rewards" },
          ],
        },
      },
      {
        id: "streak-master",
        title: "Streak Master",
        description: "Maintain a 7-day trading streak",
        category: "trading",
        rarity: "rare",
        icon: "🔥",
        progress: 4,
        maxProgress: 7,
        unlocked: false,
        xpReward: 600,
        tokenReward: 60,
        nftReward: {
          id: "nft-007",
          name: "Flame Streak Badge",
          image: "🔥",
          rarity: "Rare",
          attributes: [
            { trait: "Type", value: "Achievement Badge" },
            { trait: "Category", value: "Consistency" },
            { trait: "Rarity", value: "Rare" },
            { trait: "Power", value: "+5% Daily Bonus" },
          ],
        },
      },
      {
        id: "social-butterfly",
        title: "Social Butterfly",
        description: "Refer 10 friends to the platform",
        category: "social",
        rarity: "rare",
        icon: "🦋",
        progress: 3,
        maxProgress: 10,
        unlocked: false,
        xpReward: 800,
        tokenReward: 80,
        nftReward: {
          id: "nft-008",
          name: "Community Leader Badge",
          image: "🌐",
          rarity: "Rare",
          attributes: [
            { trait: "Type", value: "Social Badge" },
            { trait: "Category", value: "Community" },
            { trait: "Rarity", value: "Rare" },
            { trait: "Power", value: "+10% Referral Bonus" },
          ],
        },
      },
    ];

    setAchievements(initialAchievements);
  }, []);

  // Simulate achievement progress
  useEffect(() => {
    const interval = setInterval(() => {
      setAchievements((prev) => {
        const updated = prev.map((achievement) => {
          if (
            !achievement.unlocked &&
            achievement.progress < achievement.maxProgress
          ) {
            const newProgress = Math.min(
              achievement.progress + Math.random() * 100,
              achievement.maxProgress
            );

            const wasLocked = achievement.progress < achievement.maxProgress;
            const isNowUnlocked = newProgress >= achievement.maxProgress;

            if (wasLocked && isNowUnlocked) {
              const unlockedAchievement = {
                ...achievement,
                progress: newProgress,
                unlocked: true,
                unlockedAt: new Date().toISOString(),
              };

              // Show unlock notification
              setSelectedAchievement(unlockedAchievement);
              setShowUnlockDialog(true);

              if (onAchievementUnlock) {
                onAchievementUnlock(unlockedAchievement);
              }

              return unlockedAchievement;
            }

            return { ...achievement, progress: newProgress };
          }
          return achievement;
        });
        return updated;
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "shadow-gray-500/50";
      case "rare":
        return "shadow-blue-500/50";
      case "epic":
        return "shadow-purple-500/50";
      case "legendary":
        return "shadow-yellow-500/50 animate-pulse";
      default:
        return "";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "trading":
        return <TrendingUp className="w-4 h-4" />;
      case "defi":
        return <Coins className="w-4 h-4" />;
      case "gaming":
        return <Trophy className="w-4 h-4" />;
      case "social":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const filteredAchievements = achievements.filter((achievement) => {
    const statusMatch =
      filter === "all" ||
      (filter === "unlocked" && achievement.unlocked) ||
      (filter === "locked" && !achievement.unlocked);

    const categoryMatch =
      categoryFilter === "all" || achievement.category === categoryFilter;

    return statusMatch && categoryMatch;
  });

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter((a) => a.unlocked).length,
    totalXP: achievements
      .filter((a) => a.unlocked)
      .reduce((sum, a) => sum + a.xpReward, 0),
    totalTokens: achievements
      .filter((a) => a.unlocked)
      .reduce((sum, a) => sum + a.tokenReward, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gradient-card">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">
              {stats.unlocked}/{stats.total}
            </p>
            <p className="text-sm text-muted-foreground">Unlocked</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">{stats.totalXP}</p>
            <p className="text-sm text-muted-foreground">Total XP</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4 text-center">
            <Coins className="w-8 h-8 mx-auto mb-2 text-gaming" />
            <p className="text-2xl font-bold">{stats.totalTokens}</p>
            <p className="text-sm text-muted-foreground">Lumeris Earned</p>
          </CardContent>
        </Card>
        <Card className="gradient-card">
          <CardContent className="p-4 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2 text-defi" />
            <p className="text-2xl font-bold">Level {userLevel}</p>
            <p className="text-sm text-muted-foreground">Current Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="gradient-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "unlocked" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unlocked")}
              >
                Unlocked
              </Button>
              <Button
                variant={filter === "locked" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("locked")}
              >
                Locked
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant={categoryFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("all")}
              >
                All Categories
              </Button>
              <Button
                variant={categoryFilter === "trading" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("trading")}
              >
                Trading
              </Button>
              <Button
                variant={categoryFilter === "defi" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("defi")}
              >
                DeFi
              </Button>
              <Button
                variant={categoryFilter === "gaming" ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter("gaming")}
              >
                Gaming
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`gradient-card border-border/50 cursor-pointer transition-all hover:scale-105 ${
              achievement.unlocked
                ? getRarityGlow(achievement.rarity)
                : "opacity-75"
            }`}
            onClick={() => setSelectedAchievement(achievement)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="text-4xl mb-2 relative">
                  {achievement.icon}
                  {achievement.unlocked && (
                    <CheckCircle2 className="w-6 h-6 text-accent absolute -top-1 -right-1" />
                  )}
                  {!achievement.unlocked && (
                    <Lock className="w-6 h-6 text-muted-foreground absolute -top-1 -right-1" />
                  )}
                </div>
                <Badge className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
              </div>
              <CardTitle className="text-lg flex items-center gap-2">
                {achievement.title}
                {getCategoryIcon(achievement.category)}
              </CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {achievement.progress.toFixed(0)}/
                      {achievement.maxProgress}
                    </span>
                  </div>
                  <Progress
                    value={
                      (achievement.progress / achievement.maxProgress) * 100
                    }
                    className="h-2"
                  />
                </div>

                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent" />
                    <span>{achievement.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-gaming" />
                    <span>{achievement.tokenReward} Lumeris</span>
                  </div>
                </div>

                {achievement.nftReward && (
                  <div className="flex items-center gap-2 text-sm text-nft">
                    <Sparkles className="w-4 h-4" />
                    <span>NFT Reward Available</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Detail Dialog */}
      <Dialog
        open={!!selectedAchievement && !showUnlockDialog}
        onOpenChange={() => setSelectedAchievement(null)}
      >
        <DialogContent className="max-w-md">
          {selectedAchievement && (
            <>
              <DialogHeader>
                <div className="text-6xl text-center mb-4">
                  {selectedAchievement.icon}
                </div>
                <DialogTitle className="text-2xl text-center">
                  {selectedAchievement.title}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {selectedAchievement.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <Badge
                    className={`${getRarityColor(
                      selectedAchievement.rarity
                    )} text-lg px-4 py-1`}
                  >
                    {selectedAchievement.rarity.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <Star className="w-6 h-6 mx-auto mb-1 text-accent" />
                    <p className="text-xl font-bold">
                      {selectedAchievement.xpReward}
                    </p>
                    <p className="text-xs text-muted-foreground">XP Reward</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded-lg">
                    <Coins className="w-6 h-6 mx-auto mb-1 text-gaming" />
                    <p className="text-xl font-bold">
                      {selectedAchievement.tokenReward}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lumeris Reward
                    </p>
                  </div>
                </div>

                {selectedAchievement.nftReward && (
                  <div className="p-4 bg-gradient-to-br from-nft/20 to-transparent rounded-lg border border-nft/30">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-nft" />
                      NFT Reward
                    </h4>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {selectedAchievement.nftReward.name}
                      </p>
                      <div className="text-sm space-y-1">
                        {selectedAchievement.nftReward.attributes.map(
                          (attr, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-muted-foreground">
                                {attr.trait}:
                              </span>
                              <span className="font-medium">{attr.value}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">
                      {selectedAchievement.progress.toFixed(0)}/
                      {selectedAchievement.maxProgress}
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedAchievement.progress /
                        selectedAchievement.maxProgress) *
                      100
                    }
                    className="h-3"
                  />
                </div>

                {selectedAchievement.unlocked &&
                  selectedAchievement.unlockedAt && (
                    <p className="text-sm text-center text-muted-foreground">
                      Unlocked on{" "}
                      {new Date(
                        selectedAchievement.unlockedAt
                      ).toLocaleDateString()}
                    </p>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Achievement Unlock Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent className="max-w-md">
          {selectedAchievement && (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="text-8xl animate-bounce">
                  {selectedAchievement.icon}
                </div>
                <Sparkles className="w-12 h-12 text-nft absolute top-0 right-1/4 animate-pulse" />
                <Sparkles className="w-8 h-8 text-accent absolute bottom-0 left-1/4 animate-pulse" />
              </div>

              <div>
                <h2 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                  Achievement Unlocked!
                </h2>
                <h3 className="text-2xl font-semibold mb-2">
                  {selectedAchievement.title}
                </h3>
                <p className="text-muted-foreground">
                  {selectedAchievement.description}
                </p>
              </div>

              <div className="flex justify-center">
                <Badge
                  className={`${getRarityColor(
                    selectedAchievement.rarity
                  )} text-lg px-6 py-2`}
                >
                  {selectedAchievement.rarity.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-accent/20 rounded-lg">
                  <Star className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">
                    +{selectedAchievement.xpReward}
                  </p>
                  <p className="text-sm text-muted-foreground">XP</p>
                </div>
                <div className="p-4 bg-gaming/20 rounded-lg">
                  <Coins className="w-8 h-8 mx-auto mb-2 text-gaming" />
                  <p className="text-2xl font-bold">
                    +{selectedAchievement.tokenReward}
                  </p>
                  <p className="text-sm text-muted-foreground">Lumeris</p>
                </div>
              </div>

              {selectedAchievement.nftReward && (
                <div className="p-4 bg-gradient-to-br from-nft/30 to-transparent rounded-lg border-2 border-nft/50 animate-pulse">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-nft" />
                  <p className="font-semibold text-lg mb-1">
                    NFT Reward Unlocked!
                  </p>
                  <p className="text-nft font-medium">
                    {selectedAchievement.nftReward.name}
                  </p>
                </div>
              )}

              <Button
                onClick={() => setShowUnlockDialog(false)}
                className="w-full"
                size="lg"
              >
                Claim Rewards
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchievementSystem;
