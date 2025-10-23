import { useState } from "react";
import ArenaHeader from "@/components/ArenaHeader";
import ArenaFooter from "@/components/ArenaFooter";
import { BattleArenaBackground } from "@/components/backgrounds";
import { HolographicCard } from "@/components/HolographicCard";
import { MagneticButton } from "@/components/MagneticButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Gamepad2,
  Trophy,
  Zap,
  Users,
  Star,
  Sparkles,
  Play,
  Swords,
  Target,
  Crown,
  Flame,
  Shield,
} from "lucide-react";

const games = [
  {
    id: 1,
    title: "Cosmic Battles",
    category: "Strategy",
    players: "12.5K",
    rewards: "500 LUMERIS/day",
    difficulty: "Medium",
    image: "🚀",
    status: "Live",
  },
  {
    id: 2,
    title: "NFT Arena",
    category: "PvP",
    players: "8.2K",
    rewards: "750 LUMERIS/day",
    difficulty: "Hard",
    image: "⚔️",
    status: "Live",
  },
  {
    id: 3,
    title: "Token Rush",
    category: "Arcade",
    players: "15.8K",
    rewards: "300 LUMERIS/day",
    difficulty: "Easy",
    image: "💎",
    status: "Live",
  },
  {
    id: 4,
    title: "Space Miners",
    category: "Idle",
    players: "20.1K",
    rewards: "200 LUMERIS/day",
    difficulty: "Easy",
    image: "⛏️",
    status: "Live",
  },
  {
    id: 5,
    title: "Dragon Legends",
    category: "RPG",
    players: "6.5K",
    rewards: "1000 LUMERIS/day",
    difficulty: "Expert",
    image: "🐉",
    status: "Coming Soon",
  },
  {
    id: 6,
    title: "Cyber Racing",
    category: "Racing",
    players: "9.3K",
    rewards: "600 LUMERIS/day",
    difficulty: "Medium",
    image: "🏎️",
    status: "Live",
  },
];

const leaderboard = [
  { rank: 1, player: "CryptoKing", score: 125840, rewards: "5,000 LUMERIS" },
  { rank: 2, player: "NFTMaster", score: 118920, rewards: "3,000 LUMERIS" },
  { rank: 3, player: "GameLord", score: 112450, rewards: "2,000 LUMERIS" },
  { rank: 4, player: "PixelHero", score: 98760, rewards: "1,000 LUMERIS" },
  { rank: 5, player: "MetaGamer", score: 87230, rewards: "500 LUMERIS" },
];

const achievements = [
  { title: "First Victory", progress: 100, reward: "Common NFT", icon: Trophy },
  { title: "Win Streak", progress: 75, reward: "Rare NFT", icon: Flame },
  { title: "Master Player", progress: 45, reward: "Epic NFT", icon: Crown },
  {
    title: "Legendary Status",
    progress: 20,
    reward: "Legendary NFT",
    icon: Star,
  },
];

const Gaming = () => {
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400";
      case "Medium":
        return "text-yellow-400";
      case "Hard":
        return "text-orange-400";
      case "Expert":
        return "text-red-400";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Battle Arena Background */}
      <BattleArenaBackground />

      {/* Main Content */}
      <div className="relative z-10">
        <ArenaHeader />

        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-silver border border-gray-400/30 mb-6">
                  <Sparkles className="w-4 h-4 text-gray-300 animate-pulse" />
                  <span className="text-sm font-semibold text-gradient-silver">
                    Play & Earn Gaming Hub
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="text-gradient-silver text-glow-silver">
                    Epic Games
                  </span>
                  <br />
                  <span className="text-gradient-gold text-glow-gold">
                    Real Rewards
                  </span>
                </h1>

                <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
                  Play immersive blockchain games, compete with players
                  worldwide, and earn LUMERIS tokens and NFT rewards
                </p>

                {/* Player Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-gradient-silver" />
                      <div className="text-3xl font-bold text-gradient-silver mb-1">
                        25+
                      </div>
                      <div className="text-sm text-foreground/60">Games</div>
                    </div>
                  </HolographicCard>
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gradient-gold" />
                      <div className="text-3xl font-bold text-gradient-gold mb-1">
                        72K+
                      </div>
                      <div className="text-sm text-foreground/60">Players</div>
                    </div>
                  </HolographicCard>
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-gradient-silver" />
                      <div className="text-3xl font-bold text-gradient-silver mb-1">
                        $2.5M
                      </div>
                      <div className="text-sm text-foreground/60">
                        Rewards Paid
                      </div>
                    </div>
                  </HolographicCard>
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <Star className="w-8 h-8 mx-auto mb-2 text-gradient-gold" />
                      <div className="text-3xl font-bold text-gradient-gold mb-1">
                        8.5K
                      </div>
                      <div className="text-sm text-foreground/60">
                        NFTs Earned
                      </div>
                    </div>
                  </HolographicCard>
                </div>
              </div>
            </div>
          </section>

          {/* Games Grid */}
          <section className="px-4 mb-16">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-gradient-silver mb-8 flex items-center gap-3">
                <Gamepad2 className="w-8 h-8" />
                Available Games
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <HolographicCard
                    key={game.id}
                    theme="silver"
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setSelectedGame(game.id)}
                  >
                    <div className="p-6 space-y-4">
                      {/* Game Icon */}
                      <div className="text-6xl text-center mb-4">
                        {game.image}
                      </div>

                      {/* Game Info */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold text-gradient-silver">
                            {game.title}
                          </h3>
                          {game.status === "Live" ? (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full animate-pulse">
                              Live
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground/60">
                          {game.category}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 p-3 glass-card rounded-lg">
                        <div>
                          <div className="text-xs text-foreground/60 mb-1">
                            Players
                          </div>
                          <div className="font-bold text-gradient-gold">
                            {game.players}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-foreground/60 mb-1">
                            Difficulty
                          </div>
                          <div
                            className={`font-bold ${getDifficultyColor(
                              game.difficulty
                            )}`}
                          >
                            {game.difficulty}
                          </div>
                        </div>
                      </div>

                      {/* Rewards */}
                      <div className="p-3 glass-card-gold rounded-lg">
                        <div className="text-xs text-foreground/60 mb-1">
                          Daily Rewards
                        </div>
                        <div className="font-bold text-gradient-gold">
                          {game.rewards}
                        </div>
                      </div>

                      {/* Play Button */}
                      <MagneticButton
                        className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
                          game.status === "Live"
                            ? "btn-silver"
                            : "btn-gold opacity-50 cursor-not-allowed"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (game.status === "Live") {
                            // Handle play action
                          }
                        }}
                      >
                        <Play className="w-5 h-5" />
                        {game.status === "Live" ? "Play Now" : "Coming Soon"}
                      </MagneticButton>
                    </div>
                  </HolographicCard>
                ))}
              </div>
            </div>
          </section>

          {/* Leaderboard & Achievements */}
          <section className="px-4 mb-16">
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Leaderboard */}
                <HolographicCard theme="gold">
                  <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-gradient-gold flex items-center gap-3">
                      <Trophy className="w-6 h-6" />
                      Global Leaderboard
                    </h2>

                    <div className="space-y-3">
                      {leaderboard.map((entry) => (
                        <div
                          key={entry.rank}
                          className="flex items-center gap-4 p-4 glass-card rounded-lg hover:bg-white/5 transition-all"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              entry.rank === 1
                                ? "gradient-gold text-black"
                                : entry.rank === 2
                                  ? "gradient-silver text-black"
                                  : entry.rank === 3
                                    ? "bg-orange-500/30 text-orange-400"
                                    : "bg-white/10"
                            }`}
                          >
                            {entry.rank}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold">{entry.player}</div>
                            <div className="text-sm text-foreground/60">
                              {entry.score.toLocaleString()} points
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gradient-gold">
                              {entry.rewards}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </HolographicCard>

                {/* Achievements */}
                <HolographicCard theme="silver">
                  <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-gradient-silver flex items-center gap-3">
                      <Star className="w-6 h-6" />
                      Your Achievements
                    </h2>

                    <div className="space-y-4">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg gradient-silver flex items-center justify-center">
                                <achievement.icon className="w-5 h-5 text-black" />
                              </div>
                              <div>
                                <div className="font-bold">
                                  {achievement.title}
                                </div>
                                <div className="text-sm text-foreground/60">
                                  {achievement.reward}
                                </div>
                              </div>
                            </div>
                            <div className="text-gradient-gold font-bold">
                              {achievement.progress}%
                            </div>
                          </div>
                          <Progress
                            value={achievement.progress}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </HolographicCard>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-4">
            <div className="container mx-auto">
              <HolographicCard theme="cosmic">
                <div className="p-12 text-center space-y-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Swords className="w-8 h-8 text-purple-400 animate-pulse" />
                    <h2 className="text-4xl font-bold text-gradient-silver">
                      Ready to Dominate?
                    </h2>
                    <Shield className="w-8 h-8 text-yellow-400 animate-pulse" />
                  </div>
                  <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                    Join the arena, compete with the best, and earn legendary
                    rewards
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <MagneticButton className="btn-silver px-8 py-4 text-lg rounded-xl flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Start Playing
                    </MagneticButton>
                    <MagneticButton className="btn-gold px-8 py-4 text-lg rounded-xl flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      View Rewards
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

export default Gaming;
