import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ArenaHeader from "@/components/ArenaHeader";
import ArenaFooter from "@/components/ArenaFooter";
import { HolographicCard } from "@/components/HolographicCard";
import { MagneticButton } from "@/components/MagneticButton";
import { RocketLaunchBackground } from "@/components/backgrounds/RocketLaunchBackground";
import {
  Rocket,
  Clock,
  Target,
  Users,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  Crown,
  Flame,
  Trophy,
  Sparkles,
  Wallet,
  Award,
  Zap,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const projects = [
  {
    id: 1,
    name: "AstroQuest",
    type: "Gaming",
    status: "Live",
    raised: "$450K",
    target: "$500K",
    participants: "1,250",
    timeLeft: "2 days",
    progress: 90,
    image: "🚀",
  },
  {
    id: 2,
    name: "DeFiVault Pro",
    type: "DeFi",
    status: "Upcoming",
    raised: "$0",
    target: "$1.2M",
    participants: "0",
    timeLeft: "5 days",
    progress: 0,
    image: "🏛️",
  },
  {
    id: 3,
    name: "PixelRealm",
    type: "Gaming",
    status: "Completed",
    raised: "$2.1M",
    target: "$2M",
    participants: "3,450",
    timeLeft: "Ended",
    progress: 105,
    image: "🎮",
  },
  {
    id: 4,
    name: "MetaNFT Studio",
    type: "NFT",
    status: "Upcoming",
    raised: "$0",
    target: "$800K",
    participants: "0",
    timeLeft: "12 days",
    progress: 0,
    image: "🎨",
  },
];

const Launchpad = () => {
  const [userStats] = useState({
    investorLevel: 6,
    projectsBacked: 12,
    totalInvested: 45.8,
    successRate: 83.3,
    portfolioValue: 128.5,
    earlyBirdCount: 8,
    launchStreak: 5,
  });

  const handleInvest = (projectName: string, status: string) => {
    if (status === "Live") {
      toast.success(`🚀 Investment Initiated!`, {
        description: `Investing in ${projectName}`,
        duration: 5000,
      });
    } else {
      toast.info(`⏰ Project ${status}`, {
        description: `${projectName} is not available yet`,
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live":
        return "text-green-400 bg-green-500/20 border-green-400/30";
      case "Upcoming":
        return "text-blue-400 bg-blue-500/20 border-blue-400/30";
      case "Completed":
        return "text-gray-400 bg-gray-500/20 border-gray-400/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-400/30";
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* 🌌 ROCKET LAUNCH BACKGROUND */}
      <RocketLaunchBackground />

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
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-gold border border-orange-400/30 mb-6">
                    <Sparkles className="w-4 h-4 text-orange-300 animate-pulse" />
                    <span className="text-sm font-semibold text-gradient-gold">
                      Next-Gen Project Launchpad
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    <span className="text-gradient-gold text-glow-gold">
                      Rocket Launchpad
                    </span>
                    <br />
                    <span className="text-gradient-silver text-glow-silver">
                      Invest Early
                    </span>
                  </h1>

                  <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
                    Discover and invest in the next generation of gaming and
                    DeFi projects before they launch
                  </p>
                </div>

                {/* User Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                  {/* Investor Level Card */}
                  <HolographicCard theme="gold" className="col-span-2">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-yellow-500/20">
                          <Crown className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground/60">
                            Investor Level
                          </p>
                          <p className="text-2xl font-bold text-gradient-gold">
                            {userStats.investorLevel}
                          </p>
                          <p className="text-xs text-foreground/60 mt-1">
                            Elite Investor
                          </p>
                        </div>
                      </div>
                    </div>
                  </HolographicCard>

                  {/* Projects Backed Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <Rocket className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        {userStats.projectsBacked}
                      </p>
                      <p className="text-xs text-foreground/60">Projects</p>
                    </div>
                  </HolographicCard>

                  {/* Total Invested Card */}
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <DollarSign className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                      <p className="text-2xl font-bold text-gradient-gold">
                        ${userStats.totalInvested}K
                      </p>
                      <p className="text-xs text-foreground/60">Invested</p>
                    </div>
                  </HolographicCard>

                  {/* Success Rate Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <Target className="w-6 h-6 mx-auto mb-1 text-green-400" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        {userStats.successRate}%
                      </p>
                      <p className="text-xs text-foreground/60">Success</p>
                    </div>
                  </HolographicCard>

                  {/* Portfolio Value Card */}
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-1 text-green-400" />
                      <p className="text-2xl font-bold text-gradient-gold">
                        ${userStats.portfolioValue}K
                      </p>
                      <p className="text-xs text-foreground/60">Portfolio</p>
                    </div>
                  </HolographicCard>

                  {/* Early Bird Count Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <Clock className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        {userStats.earlyBirdCount}
                      </p>
                      <p className="text-xs text-foreground/60">Early Bird</p>
                    </div>
                  </HolographicCard>

                  {/* Launch Streak Card */}
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <Flame className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                      <p className="text-2xl font-bold text-gradient-gold">
                        {userStats.launchStreak}
                      </p>
                      <p className="text-xs text-foreground/60">Streak</p>
                    </div>
                  </HolographicCard>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  <MagneticButton className="btn-gold">
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </MagneticButton>
                  <MagneticButton className="btn-silver">
                    <Award className="w-5 h-5" />
                    Achievements
                  </MagneticButton>
                  <MagneticButton className="btn-gold">
                    <Trophy className="w-5 h-5" />
                    Leaderboard
                  </MagneticButton>
                  <MagneticButton className="btn-silver">
                    <Shield className="w-5 h-5" />
                    My Portfolio
                  </MagneticButton>
                </div>

                {/* Active & Upcoming Projects */}
                <h2 className="text-4xl font-bold text-center mb-12">
                  <span className="text-gradient-gold">
                    Active & Upcoming Projects
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                  {projects.map((project) => (
                    <HolographicCard
                      key={project.id}
                      theme={
                        project.status === "Live"
                          ? "gold"
                          : project.status === "Upcoming"
                            ? "silver"
                            : "purple"
                      }
                      className="hover:scale-105 transition-transform duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div className="text-5xl animate-pulse">
                              {project.image}
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold mb-1">
                                {project.name}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-foreground/60">
                                  {project.type}
                                </span>
                                <Badge
                                  className={`${getStatusColor(project.status)} border text-xs`}
                                >
                                  {project.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-foreground/60">
                              Progress
                            </div>
                            <div className="text-2xl font-bold text-gradient-gold">
                              {project.progress}%
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                          <Progress
                            value={Math.min(project.progress, 100)}
                            className="h-3"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                          <div className="text-center">
                            <div className="text-foreground/60 mb-1">
                              Raised
                            </div>
                            <div className="font-bold text-gradient-gold text-lg">
                              {project.raised}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-foreground/60 mb-1">
                              Target
                            </div>
                            <div className="font-bold text-lg">
                              {project.target}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-foreground/60 mb-1">
                              Participants
                            </div>
                            <div className="font-bold text-lg">
                              {project.participants}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-foreground/60 mb-1">
                              Time Left
                            </div>
                            <div className="font-bold text-lg">
                              {project.timeLeft}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <MagneticButton
                            className={
                              project.status === "Live"
                                ? "btn-gold flex-1"
                                : "btn-silver flex-1"
                            }
                            onClick={() =>
                              handleInvest(project.name, project.status)
                            }
                          >
                            <Rocket className="w-4 h-4" />
                            {project.status === "Live"
                              ? "Invest Now"
                              : project.status === "Upcoming"
                                ? "Coming Soon"
                                : "View Results"}
                          </MagneticButton>
                          <MagneticButton className="btn-silver flex-1">
                            <Zap className="w-4 h-4" />
                            Details
                          </MagneticButton>
                        </div>
                      </div>
                    </HolographicCard>
                  ))}
                </div>

                {/* How It Works */}
                <h2 className="text-4xl font-bold text-center mb-12">
                  <span className="text-gradient-silver">How It Works</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <HolographicCard theme="silver" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <Target className="w-8 h-8 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-silver">
                        1. Project Vetting
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        All projects undergo rigorous due diligence and
                        community review
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard theme="gold" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Users className="w-8 h-8 text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-gold">
                        2. Community Vote
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Token holders vote on which projects get featured
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard theme="silver" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <DollarSign className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-silver">
                        3. Investment
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Participate in IDOs with guaranteed allocations
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard theme="gold" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-orange-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-gold">
                        4. Launch
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Projects launch with full community support
                      </p>
                    </div>
                  </HolographicCard>
                </div>
              </div>
            </div>
          </section>
        </main>

        <ArenaFooter />
      </div>
    </div>
  );
};

export default Launchpad;
