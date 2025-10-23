import { HolographicCard } from "./HolographicCard";
import { MagneticButton } from "./MagneticButton";
import {
  Zap,
  Shield,
  Coins,
  Trophy,
  Rocket,
  Users,
  TrendingUp,
  Gamepad2,
  Target,
  Sparkles,
  Brain,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: TrendingUp,
    title: "Advanced Trading",
    description:
      "Professional-grade charts with AI-powered signals and real-time market analysis",
    theme: "gold" as const,
    stats: { label: "Win Rate", value: "87%" },
    link: "/advanced-trading",
  },
  {
    icon: Gamepad2,
    title: "Epic Gaming",
    description:
      "Immersive blockchain games with play-to-earn mechanics and NFT rewards",
    theme: "silver" as const,
    stats: { label: "Active Games", value: "25+" },
    link: "/gaming",
  },
  {
    icon: Target,
    title: "Live Betting",
    description:
      "Real-time betting on crypto markets, esports, and prediction events",
    theme: "cosmic" as const,
    stats: { label: "Total Pool", value: "$2.5M" },
    link: "/defi",
  },
  {
    icon: Trophy,
    title: "NFT Achievements",
    description:
      "Unlock legendary NFTs by completing challenges and reaching milestones",
    theme: "gold" as const,
    stats: { label: "Rarities", value: "4 Tiers" },
    link: "/nft-marketplace",
  },
  {
    icon: Rocket,
    title: "Token Launchpad",
    description: "Participate in exclusive IDOs and early-stage token sales",
    theme: "silver" as const,
    stats: { label: "Success Rate", value: "94%" },
    link: "/launchpad",
  },
  {
    icon: Users,
    title: "DAO Governance",
    description: "Vote on platform decisions and shape the future of Lumeris",
    theme: "cosmic" as const,
    stats: { label: "Proposals", value: "156" },
    link: "/governance",
  },
];

const benefits = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description:
      "Advanced algorithms analyze markets 24/7 to provide you with the best trading signals",
  },
  {
    icon: Shield,
    title: "Military-Grade Security",
    description:
      "Your assets are protected by multi-layer security and smart contract audits",
  },
  {
    icon: Coins,
    title: "Passive Income",
    description:
      "Earn rewards through staking, liquidity provision, and achievement unlocks",
  },
  {
    icon: Lock,
    title: "Decentralized & Trustless",
    description:
      "Full control of your assets with non-custodial wallet integration",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-gold border border-yellow-500/30 mb-6">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-semibold text-gradient-gold">
            Platform Features
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="text-gradient-gold">Everything You Need</span>
          <br />
          <span className="text-gradient-silver">In One Platform</span>
        </h2>
        <p className="text-xl text-foreground/60 max-w-3xl mx-auto">
          Lumeris combines cutting-edge technology with intuitive design to
          deliver an unparalleled gaming and trading experience
        </p>
      </div>

      {/* Main Features Grid */}
      <div className="container mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <HolographicCard
              key={index}
              theme={feature.theme}
              className="animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` } as any}
            >
              <div className="p-8 space-y-6 h-full flex flex-col">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    feature.theme === "gold"
                      ? "gradient-gold"
                      : feature.theme === "silver"
                      ? "gradient-silver"
                      : "gradient-cosmic"
                  }`}
                >
                  <feature.icon
                    className={`w-8 h-8 ${
                      feature.theme === "cosmic" ? "text-white" : "text-black"
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className={`text-2xl font-bold mb-3 ${
                      feature.theme === "gold"
                        ? "text-gradient-gold"
                        : feature.theme === "silver"
                        ? "text-gradient-silver"
                        : "text-purple-400"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Stats & CTA */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <span className="text-sm text-foreground/60">
                      {feature.stats.label}
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        feature.theme === "gold"
                          ? "text-gradient-gold"
                          : feature.theme === "silver"
                          ? "text-gradient-silver"
                          : "text-purple-400"
                      }`}
                    >
                      {feature.stats.value}
                    </span>
                  </div>

                  <Link to={feature.link}>
                    <MagneticButton
                      className={`w-full ${
                        feature.theme === "gold" ? "btn-gold" : "btn-silver"
                      } py-3 rounded-lg flex items-center justify-center gap-2`}
                    >
                      Explore
                      <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                  </Link>
                </div>
              </div>
            </HolographicCard>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4">
        <div className="glass-card-gold p-12 rounded-3xl">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gradient-gold mb-4">
              Why Choose Lumeris?
            </h3>
            <p className="text-lg text-foreground/60">
              Built for traders and gamers who demand the best
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center space-y-4 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` } as any}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-gold flex items-center justify-center glow-gold">
                  <benefit.icon className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-xl font-bold text-gradient-gold">
                  {benefit.title}
                </h4>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 mt-24">
        <HolographicCard theme="cosmic" className="overflow-hidden">
          <div className="p-12 text-center space-y-8 relative">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 animate-pulse" />
            </div>

            <div className="relative z-10">
              <h3 className="text-5xl font-bold mb-4">
                <span className="text-gradient-gold">Ready to Start</span>
                <br />
                <span className="text-gradient-silver">Your Journey?</span>
              </h3>
              <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
                Join thousands of traders and gamers in the most advanced
                decentralized platform in the metaverse
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/advanced-trading">
                  <MagneticButton className="btn-gold px-10 py-5 text-lg font-bold rounded-xl flex items-center gap-3">
                    <Zap className="w-6 h-6" />
                    Start Trading Now
                    <ArrowRight className="w-6 h-6" />
                  </MagneticButton>
                </Link>

                <Link to="/gaming">
                  <MagneticButton className="btn-silver px-10 py-5 text-lg font-bold rounded-xl flex items-center gap-3">
                    <Gamepad2 className="w-6 h-6" />
                    Play Games
                  </MagneticButton>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
                <div>
                  <div className="text-3xl font-bold text-gradient-gold mb-2">
                    $45M+
                  </div>
                  <div className="text-sm text-foreground/60">Total Volume</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gradient-silver mb-2">
                    125K+
                  </div>
                  <div className="text-sm text-foreground/60">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    99.9%
                  </div>
                  <div className="text-sm text-foreground/60">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </HolographicCard>
      </div>
    </section>
  );
}

export default FeaturesSection;
