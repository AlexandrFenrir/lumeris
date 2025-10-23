import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ArenaHeader from "@/components/ArenaHeader";
import ArenaFooter from "@/components/ArenaFooter";
import { HolographicCard } from "@/components/HolographicCard";
import { MagneticButton } from "@/components/MagneticButton";
import { CouncilChamberBackground } from "@/components/backgrounds/CouncilChamberBackground";
import {
  Vote,
  Users,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  MessageSquare,
  Shield,
  Crown,
  Star,
  Flame,
  Trophy,
  Sparkles,
  Wallet,
  Award,
  Zap,
  Target,
} from "lucide-react";
import { toast } from "sonner";

const proposals = [
  {
    id: 1,
    title: "Increase Gaming Rewards Pool",
    description:
      "Proposal to increase the daily gaming rewards pool from 1M to 1.5M Lumeris tokens",
    status: "Active",
    votesFor: "12.5M",
    votesAgainst: "2.1M",
    timeLeft: "3 days",
    quorum: "15M",
    type: "Treasury",
  },
  {
    id: 2,
    title: "Add Solana Chain Support",
    description:
      "Technical proposal to integrate Solana blockchain for faster gaming transactions",
    status: "Pending",
    votesFor: "0",
    votesAgainst: "0",
    timeLeft: "7 days",
    quorum: "10M",
    type: "Technical",
  },
  {
    id: 3,
    title: "New NFT Royalty Structure",
    description:
      "Proposal to reduce marketplace fees from 2.5% to 2% and increase creator royalties",
    status: "Passed",
    votesFor: "18.2M",
    votesAgainst: "4.8M",
    timeLeft: "Ended",
    quorum: "15M",
    type: "Governance",
  },
  {
    id: 4,
    title: "Launch Gaming Tournament",
    description:
      "Proposal to fund a $500K gaming tournament across all platform games",
    status: "Active",
    votesFor: "8.9M",
    votesAgainst: "1.2M",
    timeLeft: "5 days",
    quorum: "12M",
    type: "Community",
  },
];

const Governance = () => {
  const [userStats] = useState({
    votingPower: 25000,
    proposalsCreated: 8,
    votesCast: 42,
    votingStreak: 12,
    governanceRank: "Senator",
    participationRate: 87.5,
    influenceScore: 8450,
  });

  const handleVote = (proposalTitle: string, status: string) => {
    if (status === "Active") {
      toast.success(`🗳️ Vote Submitted!`, {
        description: `Voted on: ${proposalTitle}`,
        duration: 5000,
      });
    } else {
      toast.info(`⏰ Proposal ${status}`, {
        description: `${proposalTitle} is not active`,
        duration: 3000,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-400 bg-green-500/20 border-green-400/30";
      case "Pending":
        return "text-blue-400 bg-blue-500/20 border-blue-400/30";
      case "Passed":
        return "text-purple-400 bg-purple-500/20 border-purple-400/30";
      case "Rejected":
        return "text-red-400 bg-red-500/20 border-red-400/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-400/30";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Treasury":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-400/30";
      case "Technical":
        return "text-cyan-400 bg-cyan-500/20 border-cyan-400/30";
      case "Governance":
        return "text-purple-400 bg-purple-500/20 border-purple-400/30";
      case "Community":
        return "text-pink-400 bg-pink-500/20 border-pink-400/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-400/30";
    }
  };

  const calculateVotePercentage = (votesFor: string, votesAgainst: string) => {
    const forVotes = parseFloat(votesFor.replace("M", ""));
    const againstVotes = parseFloat(votesAgainst.replace("M", ""));
    const total = forVotes + againstVotes;
    if (total === 0) return 50;
    return (forVotes / total) * 100;
  };

  return (
    <div className="min-h-screen relative">
      {/* 🌌 COUNCIL CHAMBER BACKGROUND */}
      <CouncilChamberBackground />

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
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-purple border border-purple-400/30 mb-6">
                    <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                    <span className="text-sm font-semibold text-gradient-purple">
                      Decentralized Governance
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    <span className="text-gradient-purple text-glow-purple">
                      DAO Governance
                    </span>
                    <br />
                    <span className="text-gradient-gold text-glow-gold">
                      Shape the Future
                    </span>
                  </h1>

                  <p className="text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
                    Shape the future of Lumeris Solutions through decentralized
                    governance and community voting
                  </p>
                </div>

                {/* User Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                  {/* Voting Power Card */}
                  <HolographicCard theme="purple" className="col-span-2">
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-purple-500/20">
                          <Crown className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground/60">
                            Voting Power
                          </p>
                          <p className="text-2xl font-bold text-gradient-purple">
                            {userStats.votingPower.toLocaleString()}
                          </p>
                          <p className="text-xs text-foreground/60 mt-1">
                            Lumeris Tokens
                          </p>
                        </div>
                      </div>
                    </div>
                  </HolographicCard>

                  {/* Proposals Created Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <FileText className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        {userStats.proposalsCreated}
                      </p>
                      <p className="text-xs text-foreground/60">Proposals</p>
                    </div>
                  </HolographicCard>

                  {/* Votes Cast Card */}
                  <HolographicCard theme="purple">
                    <div className="p-4 text-center">
                      <Vote className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                      <p className="text-2xl font-bold text-gradient-purple">
                        {userStats.votesCast}
                      </p>
                      <p className="text-xs text-foreground/60">Votes Cast</p>
                    </div>
                  </HolographicCard>

                  {/* Voting Streak Card */}
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <Flame className="w-6 h-6 mx-auto mb-1 text-orange-400" />
                      <p className="text-2xl font-bold text-gradient-gold">
                        {userStats.votingStreak}
                      </p>
                      <p className="text-xs text-foreground/60">Streak</p>
                    </div>
                  </HolographicCard>

                  {/* Governance Rank Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <Shield className="w-6 h-6 mx-auto mb-1 text-cyan-400" />
                      <p className="text-lg font-bold text-gradient-silver">
                        {userStats.governanceRank}
                      </p>
                      <p className="text-xs text-foreground/60">Rank</p>
                    </div>
                  </HolographicCard>

                  {/* Participation Rate Card */}
                  <HolographicCard theme="silver">
                    <div className="p-4 text-center">
                      <TrendingUp className="w-6 h-6 mx-auto mb-1 text-green-400" />
                      <p className="text-2xl font-bold text-gradient-silver">
                        {userStats.participationRate}%
                      </p>
                      <p className="text-xs text-foreground/60">
                        Participation
                      </p>
                    </div>
                  </HolographicCard>

                  {/* Influence Score Card */}
                  <HolographicCard theme="gold">
                    <div className="p-4 text-center">
                      <Star className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                      <p className="text-2xl font-bold text-gradient-gold">
                        {userStats.influenceScore}
                      </p>
                      <p className="text-xs text-foreground/60">Influence</p>
                    </div>
                  </HolographicCard>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  <MagneticButton className="btn-purple">
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </MagneticButton>
                  <MagneticButton className="btn-gold">
                    <Award className="w-5 h-5" />
                    Achievements
                  </MagneticButton>
                  <MagneticButton className="btn-purple">
                    <Trophy className="w-5 h-5" />
                    Leaderboard
                  </MagneticButton>
                  <MagneticButton className="btn-gold">
                    <FileText className="w-5 h-5" />
                    Create Proposal
                  </MagneticButton>
                </div>

                {/* Active Proposals */}
                <h2 className="text-4xl font-bold text-center mb-12">
                  <span className="text-gradient-purple">Active Proposals</span>
                </h2>
                <div className="space-y-6 mb-16">
                  {proposals.map((proposal) => (
                    <HolographicCard
                      key={proposal.id}
                      theme={
                        proposal.status === "Active"
                          ? "purple"
                          : proposal.status === "Passed"
                            ? "gold"
                            : "silver"
                      }
                      className="hover:scale-[1.02] transition-transform duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-3">
                              <h3 className="text-2xl font-bold">
                                {proposal.title}
                              </h3>
                              <Badge
                                className={`${getStatusColor(proposal.status)} border text-xs`}
                              >
                                {proposal.status}
                              </Badge>
                              <Badge
                                className={`${getTypeColor(proposal.type)} border text-xs`}
                              >
                                {proposal.type}
                              </Badge>
                            </div>
                            <p className="text-foreground/60 mb-4">
                              {proposal.description}
                            </p>
                          </div>
                        </div>

                        {/* Voting Progress */}
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-400">
                              For: {proposal.votesFor} Lumeris
                            </span>
                            <span className="text-red-400">
                              Against: {proposal.votesAgainst} Lumeris
                            </span>
                          </div>

                          {proposal.status !== "Pending" && (
                            <div className="relative">
                              <Progress
                                value={calculateVotePercentage(
                                  proposal.votesFor,
                                  proposal.votesAgainst
                                )}
                                className="h-3"
                              />
                            </div>
                          )}

                          <div className="flex justify-between text-sm text-foreground/60">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              <span>Quorum: {proposal.quorum} Lumeris</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Time left: {proposal.timeLeft}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <MagneticButton
                            className={
                              proposal.status === "Active"
                                ? "btn-purple flex-1"
                                : "btn-silver flex-1"
                            }
                            onClick={() =>
                              handleVote(proposal.title, proposal.status)
                            }
                          >
                            <Vote className="w-4 h-4" />
                            {proposal.status === "Active"
                              ? "Vote Now"
                              : proposal.status === "Pending"
                                ? "Not Started"
                                : "View Results"}
                          </MagneticButton>
                          <MagneticButton className="btn-gold flex-1">
                            <MessageSquare className="w-4 h-4" />
                            Discuss
                          </MagneticButton>
                        </div>
                      </div>
                    </HolographicCard>
                  ))}
                </div>

                {/* How Governance Works */}
                <h2 className="text-4xl font-bold text-center mb-12">
                  <span className="text-gradient-gold">
                    How Governance Works
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <HolographicCard theme="purple" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-purple">
                        1. Propose
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Token holders submit proposals for platform improvements
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard theme="gold" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <MessageSquare className="w-8 h-8 text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-gold">
                        2. Discuss
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Community debates and refines proposals before voting
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard theme="purple" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Vote className="w-8 h-8 text-purple-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-purple">
                        3. Vote
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Token holders vote with their Lumeris tokens as voting
                        power
                      </p>
                    </div>
                  </HolographicCard>

                  <HolographicCard theme="gold" className="text-center">
                    <div className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-gold">
                        4. Execute
                      </h3>
                      <p className="text-foreground/60 text-sm">
                        Approved proposals are automatically implemented
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

export default Governance;
