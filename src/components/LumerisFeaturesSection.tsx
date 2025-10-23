import { useState, useEffect } from "react";
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

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const features = [
  {
    icon: TrendingUp,
    title: "Light-Speed Trading",
    description:
      "Trade at the speed of light with AI-powered signals and real-time cosmic market analysis",
    theme: "gold" as const,
    stats: { label: "Win Rate", value: "87%" },
    link: "/advanced-trading",
    cosmicTitle: "Where Assets Move as Freely as Photons",
  },
  {
    icon: Gamepad2,
    title: "Cosmic Gaming",
    description:
      "Discover new galaxies of gameplay with blockchain games and play-to-earn mechanics",
    theme: "silver" as const,
    stats: { label: "Active Games", value: "25+" },
    link: "/gaming",
    cosmicTitle: "Every Game is a New Universe",
  },
  {
    icon: Target,
    title: "Stellar Predictions",
    description:
      "Illuminate the future with real-time betting on crypto markets and cosmic events",
    theme: "cosmic" as const,
    stats: { label: "Total Pool", value: "$2.5M" },
    link: "/defi",
    cosmicTitle: "Predict the Stars, Earn the Light",
  },
  {
    icon: Trophy,
    title: "Light Artifacts",
    description:
      "Collect legendary NFTs that shine across the blockchain, each a unique beacon of achievement",
    theme: "gold" as const,
    stats: { label: "Rarities", value: "4 Tiers" },
    link: "/nft-marketplace",
    cosmicTitle: "Where Creativity Meets Cosmic Commerce",
  },
  {
    icon: Rocket,
    title: "Stellar Launchpad",
    description:
      "Launch into the future with exclusive IDOs and early-stage token opportunities",
    theme: "silver" as const,
    stats: { label: "Success Rate", value: "94%" },
    link: "/launchpad",
    cosmicTitle: "Ignite New Stars in the Web3 Cosmos",
  },
  {
    icon: Users,
    title: "Light Council",
    description:
      "Shape the constellation of Lumeris through decentralized governance and voting",
    theme: "cosmic" as const,
    stats: { label: "Proposals", value: "156" },
    link: "/governance",
    cosmicTitle: "United by Light, Governed by Community",
  },
];

const benefits = [
  {
    icon: Brain,
    title: "Cosmic Intelligence",
    description:
      "AI algorithms powered by light analyze markets 24/7 across the blockchain universe",
  },
  {
    icon: Shield,
    title: "Photon-Grade Security",
    description:
      "Your assets protected by multi-layer security as strong as the speed of light itself",
  },
  {
    icon: Coins,
    title: "Luminous Rewards",
    description:
      "Earn passive income through staking, liquidity provision, and achievement unlocks",
  },
  {
    icon: Lock,
    title: "Decentralized Light",
    description:
      "Full control of your assets with non-custodial integration across the Web3 cosmos",
  },
];

export function LumerisFeaturesSection() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 50; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    setStars(newStars);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Deep Space Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, #1A1F3A 0%, #0A0E27 100%)",
        }}
      />

      {/* Starfield Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.id % 2 === 0 ? "#FFD700" : "#00D9FF",
              opacity: star.opacity,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              boxShadow:
                star.id % 2 === 0
                  ? "0 0 4px rgba(255, 215, 0, 0.8)"
                  : "0 0 4px rgba(0, 217, 255, 0.8)",
            }}
          />
        ))}
      </div>

      {/* Radial Glow Effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(0, 217, 255, 0.2) 50%, transparent 70%)",
          animation: "pulse 6s ease-in-out infinite",
        }}
      />

      {/* Section Header */}
      <div className="container mx-auto px-4 mb-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-gold border border-yellow-500/30 mb-6 lumeris-glow-gold">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-sm font-semibold lumeris-gradient-gold-cyan">
            Cosmic Platform Features
          </span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="lumeris-gradient-gold-cyan">
            Everything You Need
          </span>
          <br />
          <span className="text-gradient-silver">In One Constellation</span>
        </h2>
        <p className="text-xl text-foreground/60 max-w-3xl mx-auto">
          Lumeris unites cutting-edge blockchain technology with cosmic design,
          delivering an experience powered by light and united by Web3
        </p>
      </div>

      {/* Main Features Grid with Constellation Lines */}
      <div className="container mx-auto px-4 mb-24 relative z-10">
        {/* Constellation Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          style={{ zIndex: 0 }}
        >
          {/* Horizontal connections */}
          <line
            x1="16%"
            y1="25%"
            x2="50%"
            y2="25%"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="50%"
            y1="25%"
            x2="84%"
            y2="25%"
            stroke="url(#cyanGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="16%"
            y1="75%"
            x2="50%"
            y2="75%"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="50%"
            y1="75%"
            x2="84%"
            y2="75%"
            stroke="url(#cyanGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          {/* Vertical connections */}
          <line
            x1="16%"
            y1="25%"
            x2="16%"
            y2="75%"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="50%"
            y1="25%"
            x2="50%"
            y2="75%"
            stroke="url(#cyanGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="84%"
            y1="25%"
            x2="84%"
            y2="75%"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 215, 0, 0.5)" />
              <stop offset="100%" stopColor="rgba(255, 165, 0, 0.5)" />
            </linearGradient>
            <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(0, 217, 255, 0.5)" />
              <stop offset="100%" stopColor="rgba(0, 150, 255, 0.5)" />
            </linearGradient>
          </defs>
        </svg>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {features.map((feature, index) => (
            <HolographicCard
              key={index}
              theme={feature.theme}
              className="animate-slide-in-up hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` } as any}
            >
              <div className="p-8 space-y-6 h-full flex flex-col relative">
                {/* Constellation Node */}
                <div
                  className="absolute -top-2 -left-2 w-4 h-4 rounded-full"
                  style={{
                    background:
                      feature.theme === "gold"
                        ? "radial-gradient(circle, #FFD700 0%, transparent 70%)"
                        : feature.theme === "silver"
                          ? "radial-gradient(circle, #C0C0C0 0%, transparent 70%)"
                          : "radial-gradient(circle, #00D9FF 0%, transparent 70%)",
                    boxShadow:
                      feature.theme === "gold"
                        ? "0 0 12px rgba(255, 215, 0, 0.8)"
                        : feature.theme === "silver"
                          ? "0 0 12px rgba(192, 192, 192, 0.8)"
                          : "0 0 12px rgba(0, 217, 255, 0.8)",
                  }}
                />

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    feature.theme === "gold"
                      ? "gradient-gold lumeris-glow-gold"
                      : feature.theme === "silver"
                        ? "gradient-silver"
                        : "gradient-cosmic lumeris-glow-cyan"
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
                    className={`text-2xl font-bold mb-2 ${
                      feature.theme === "gold"
                        ? "lumeris-gradient-gold-cyan"
                        : feature.theme === "silver"
                          ? "text-gradient-silver"
                          : "text-cyan-400"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs text-foreground/50 italic mb-3">
                    {feature.cosmicTitle}
                  </p>
                  <p className="text-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Stats & CTA */}
                <div className="space-y-4">
                  <div
                    className={`flex items-center justify-between p-4 glass-card rounded-lg border ${
                      feature.theme === "gold"
                        ? "border-yellow-500/20"
                        : feature.theme === "silver"
                          ? "border-gray-400/20"
                          : "border-cyan-500/20"
                    }`}
                  >
                    <span className="text-sm text-foreground/60">
                      {feature.stats.label}
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        feature.theme === "gold"
                          ? "lumeris-gradient-gold-cyan"
                          : feature.theme === "silver"
                            ? "text-gradient-silver"
                            : "text-cyan-400"
                      }`}
                    >
                      {feature.stats.value}
                    </span>
                  </div>

                  <Link to={feature.link}>
                    <MagneticButton
                      className={`w-full ${
                        feature.theme === "gold"
                          ? "btn-gold lumeris-glow-gold"
                          : "btn-silver"
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

      {/* Benefits Section - Cosmic Theme */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card-gold p-12 rounded-3xl border border-yellow-500/20 relative overflow-hidden">
          {/* Background Glow */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%)",
            }}
          />

          <div className="text-center mb-12 relative z-10">
            <h3 className="text-4xl font-bold lumeris-gradient-gold-cyan mb-4">
              Why Choose Lumeris?
            </h3>
            <p className="text-lg text-foreground/60">
              Built for those who seek the light in Web3
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center space-y-4 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` } as any}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-gold flex items-center justify-center lumeris-glow-gold">
                  <benefit.icon className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-xl font-bold lumeris-gradient-gold-cyan">
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

      {/* CTA Section - Cosmic Portal Theme */}
      <div className="container mx-auto px-4 mt-24 relative z-10">
        <HolographicCard theme="cosmic" className="overflow-hidden">
          <div className="p-12 text-center space-y-8 relative">
            {/* Animated Cosmic Background */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255, 215, 0, 0.4) 0%, rgba(0, 217, 255, 0.3) 50%, transparent 70%)",
                  animation: "pulse 4s ease-in-out infinite",
                }}
              />
            </div>

            <div className="relative z-10">
              <h3 className="text-5xl font-bold mb-4">
                <span className="lumeris-gradient-gold-cyan">
                  Ready to Enter
                </span>
                <br />
                <span className="text-gradient-silver">
                  The Lumeris Cosmos?
                </span>
              </h3>
              <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
                Join thousands of light bearers in the most advanced
                decentralized platform, powered by light and united by Web3
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/advanced-trading">
                  <MagneticButton className="btn-gold px-10 py-5 text-lg font-bold rounded-xl flex items-center gap-3 lumeris-glow-gold">
                    <Zap className="w-6 h-6" />
                    Start Trading Now
                    <ArrowRight className="w-6 h-6" />
                  </MagneticButton>
                </Link>

                <Link to="/gaming">
                  <MagneticButton className="btn-silver px-10 py-5 text-lg font-bold rounded-xl flex items-center gap-3">
                    <Gamepad2 className="w-6 h-6" />
                    Explore Galaxies
                  </MagneticButton>
                </Link>
              </div>

              {/* Trust Indicators - Cosmic Theme */}
              <div className="grid grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
                <div className="glass-card p-4 rounded-lg border border-yellow-500/20">
                  <div className="text-3xl font-bold lumeris-gradient-gold-cyan mb-2">
                    $45M+
                  </div>
                  <div className="text-sm text-foreground/60">
                    Cosmic Volume
                  </div>
                </div>
                <div className="glass-card p-4 rounded-lg border border-cyan-500/20">
                  <div className="text-3xl font-bold text-gradient-silver mb-2">
                    125K+
                  </div>
                  <div className="text-sm text-foreground/60">
                    Light Bearers
                  </div>
                </div>
                <div className="glass-card p-4 rounded-lg border border-yellow-500/20">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">
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

export default LumerisFeaturesSection;
