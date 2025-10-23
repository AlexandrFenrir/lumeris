import { useState, useEffect } from "react";
import { HolographicCard } from "./HolographicCard";
import { MagneticButton } from "./MagneticButton";
import { ParticleSystem3D } from "./ParticleSystem3D";
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
  Brain,
  Lock,
  ArrowRight,
  Sparkles,
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
    icon: Gamepad2,
    title: "Battle Arena",
    description:
      "Compete in blockchain games with play-to-earn mechanics. Every match is a chance to prove your skills and earn rewards.",
    theme: "purple" as const,
    stats: { label: "Active Games", value: "25+" },
    link: "/gaming",
    subtitle: "Where Champions Are Born",
  },
  {
    icon: TrendingUp,
    title: "Trading Pit",
    description:
      "Execute lightning-fast trades with AI-powered signals and real-time market analysis. Dominate the DeFi markets.",
    theme: "gold" as const,
    stats: { label: "Win Rate", value: "87%" },
    link: "/advanced-trading",
    subtitle: "Master the Markets",
  },
  {
    icon: Target,
    title: "Betting Arena",
    description:
      "Predict crypto markets and cosmic events with real-time betting. Put your knowledge to the test and earn big.",
    theme: "purple" as const,
    stats: { label: "Total Pool", value: "$2.5M" },
    link: "/defi",
    subtitle: "Predict. Bet. Win.",
  },
  {
    icon: Trophy,
    title: "Trophy Hall",
    description:
      "Collect legendary NFTs that represent your achievements. Trade rare items in our marketplace.",
    theme: "purple" as const,
    stats: { label: "Rarities", value: "4 Tiers" },
    link: "/nft-marketplace",
    subtitle: "Collect Legendary Items",
  },
  {
    icon: Rocket,
    title: "Launch Bay",
    description:
      "Get early access to exclusive IDOs and token launches. Invest in the next generation of Web3 projects.",
    theme: "gold" as const,
    stats: { label: "Success Rate", value: "94%" },
    link: "/launchpad",
    subtitle: "Invest in the Future",
  },
  {
    icon: Users,
    title: "Council Chamber",
    description:
      "Shape the future of the arena through decentralized governance. Your voice matters in every decision.",
    theme: "gold" as const,
    stats: { label: "Proposals", value: "156" },
    link: "/governance",
    subtitle: "Lead the Community",
  },
];

const benefits = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description:
      "Advanced algorithms analyze markets 24/7 to give you the competitive edge",
    color: "#06B6D4",
  },
  {
    icon: Shield,
    title: "Military-Grade Security",
    description:
      "Multi-layer security protocols protect your assets at all times",
    color: "#9333EA",
  },
  {
    icon: Coins,
    title: "Passive Income Streams",
    description:
      "Earn through staking, liquidity provision, and achievement rewards",
    color: "#F59E0B",
  },
  {
    icon: Lock,
    title: "Full Asset Control",
    description:
      "Non-custodial integration means you always control your funds",
    color: "#06B6D4",
  },
];

export function ArenaFeaturesSection() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 40; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
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
            "radial-gradient(ellipse at top, #1A1333 0%, #0F0A1E 50%, #070512 100%)",
        }}
      />

      {/* Starfield Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${Math.random() * 4 + 3}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* 3D Particle System */}
      <ParticleSystem3D count={40} colors={["#9333EA", "#F59E0B", "#06B6D4"]} />

      {/* Arena Zones Glow */}
      <div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "pulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-6 border animate-float-cosmic"
            style={{
              background:
                "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
              borderColor: "rgba(147, 51, 234, 0.3)",
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">
              Explore the Arena
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span
              style={{
                background: "linear-gradient(135deg, #9333EA 0%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Choose Your Arena
            </span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Multiple zones, infinite possibilities. Gaming, trading, and
            more—all in one platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isPurple = feature.theme === "purple";

            return (
              <Link key={index} to={feature.link}>
                <div className="relative h-full group cursor-pointer">
                  {/* Hexagonal Corner Accents */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <polygon
                        points="50,5 90,30 90,70 50,95 10,70 10,30"
                        fill={
                          isPurple
                            ? "rgba(147, 51, 234, 0.3)"
                            : "rgba(245, 158, 11, 0.3)"
                        }
                        stroke={isPurple ? "#9333EA" : "#F59E0B"}
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <polygon
                        points="50,5 90,30 90,70 50,95 10,70 10,30"
                        fill={
                          isPurple
                            ? "rgba(147, 51, 234, 0.3)"
                            : "rgba(245, 158, 11, 0.3)"
                        }
                        stroke={isPurple ? "#9333EA" : "#F59E0B"}
                        strokeWidth="3"
                      />
                    </svg>
                  </div>

                  <HolographicCard
                    theme={feature.theme}
                    className="h-full p-0 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                  >
                    {/* Top Bar with Icon */}
                    <div
                      className="relative p-6 pb-4"
                      style={{
                        background: isPurple
                          ? "linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)"
                          : "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)",
                        borderBottom: `1px solid ${isPurple ? "rgba(147, 51, 234, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                      }}
                    >
                      {/* Icon with Hexagonal Background */}
                      <div className="relative mb-4 inline-block">
                        {/* Glow Effect */}
                        <div
                          className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"
                          style={{
                            background: isPurple
                              ? "rgba(147, 51, 234, 0.8)"
                              : "rgba(245, 158, 11, 0.8)",
                          }}
                        />

                        {/* Hexagonal Container */}
                        <div className="relative w-16 h-16">
                          <svg
                            viewBox="0 0 100 100"
                            className="absolute inset-0 w-full h-full"
                          >
                            <polygon
                              points="50,5 90,30 90,70 50,95 10,70 10,30"
                              fill={
                                isPurple
                                  ? "rgba(147, 51, 234, 0.2)"
                                  : "rgba(245, 158, 11, 0.2)"
                              }
                              stroke={isPurple ? "#9333EA" : "#F59E0B"}
                              strokeWidth="2"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon
                              className={`w-8 h-8 ${
                                isPurple ? "text-purple-400" : "text-amber-400"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-2xl font-bold mb-1 ${
                          isPurple ? "text-purple-300" : "text-amber-300"
                        }`}
                        style={{
                          textShadow: isPurple
                            ? "0 0 20px rgba(147, 51, 234, 0.5)"
                            : "0 0 20px rgba(245, 158, 11, 0.5)",
                        }}
                      >
                        {feature.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-xs text-foreground/50 uppercase tracking-wider font-semibold">
                        {feature.subtitle}
                      </p>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 pt-4">
                      {/* Description */}
                      <p className="text-foreground/70 mb-6 leading-relaxed text-sm">
                        {feature.description}
                      </p>

                      {/* Stats Badge */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${
                            isPurple
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          }`}
                          style={{
                            boxShadow: isPurple
                              ? "0 0 15px rgba(147, 51, 234, 0.3)"
                              : "0 0 15px rgba(245, 158, 11, 0.3)",
                          }}
                        >
                          <span className="text-xs opacity-70">
                            {feature.stats.label}:
                          </span>
                          <span className="text-base">
                            {feature.stats.value}
                          </span>
                        </div>

                        {/* Hover Arrow */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                              isPurple ? "text-purple-400" : "text-amber-400"
                            }`}
                          >
                            Enter
                          </span>
                          <ArrowRight
                            className={`w-5 h-5 ${
                              isPurple ? "text-purple-400" : "text-amber-400"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Energy Border Effect */}
                    <div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: isPurple
                          ? "0 0 40px rgba(147, 51, 234, 0.6), inset 0 0 40px rgba(147, 51, 234, 0.1)"
                          : "0 0 40px rgba(245, 158, 11, 0.6), inset 0 0 40px rgba(245, 158, 11, 0.1)",
                      }}
                    />

                    {/* Animated Corner Lines */}
                    <div
                      className="absolute top-0 left-0 w-12 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: isPurple ? "#9333EA" : "#F59E0B" }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-12 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: isPurple ? "#9333EA" : "#F59E0B" }}
                    />
                  </HolographicCard>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Energy Conduits (Connecting Lines) */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20"
          style={{ maxWidth: "1200px" }}
        >
          {/* Horizontal connections */}
          <line
            x1="20%"
            y1="40%"
            x2="50%"
            y2="40%"
            stroke="url(#purpleGradient)"
            strokeWidth="1"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
          <line
            x1="50%"
            y1="40%"
            x2="80%"
            y2="40%"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeDasharray="5,5"
            className="animate-pulse"
          />

          {/* Vertical connections */}
          <line
            x1="35%"
            y1="30%"
            x2="35%"
            y2="70%"
            stroke="url(#purpleGradient)"
            strokeWidth="1"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
          <line
            x1="65%"
            y1="30%"
            x2="65%"
            y2="70%"
            stroke="url(#goldGradient)"
            strokeWidth="1"
            strokeDasharray="5,5"
            className="animate-pulse"
          />

          <defs>
            <linearGradient
              id="purpleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.6)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.6)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Benefits Section */}
        <div className="mt-32">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #06B6D4 0%, #9333EA 50%, #F59E0B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Why Champions Choose Us
              </span>
            </h3>
            <p className="text-lg text-foreground/70">
              Built for gamers, traders, and visionaries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `${benefit.color}20`,
                      boxShadow: `0 0 20px ${benefit.color}40`,
                    }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: benefit.color }}
                    />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-foreground">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-foreground/60">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div
            className="inline-block p-12 rounded-2xl backdrop-blur-sm border relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
              borderColor: "rgba(147, 51, 234, 0.3)",
            }}
          >
            {/* Animated Background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.2) 0%, transparent 70%)",
                animation: "pulse 4s ease-in-out infinite",
              }}
            />

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #9333EA 0%, #F59E0B 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Ready to Dominate?
                </span>
              </h3>
              <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
                Join thousands of players and traders in the ultimate Web3 arena
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/gaming">
                  <MagneticButton
                    className="px-8 py-4 rounded-lg font-bold text-white relative overflow-hidden group border-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #9333EA 0%, #C084FC 100%)",
                      borderColor: "rgba(147, 51, 234, 0.8)",
                      boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)",
                    }}
                  >
                    <Gamepad2 className="w-5 h-5 inline mr-2" />
                    Start Gaming
                    <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>
                </Link>

                <Link to="/defi">
                  <MagneticButton
                    className="px-8 py-4 rounded-lg font-bold text-white relative overflow-hidden group border-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
                      borderColor: "rgba(245, 158, 11, 0.8)",
                      boxShadow: "0 0 30px rgba(245, 158, 11, 0.5)",
                    }}
                  >
                    <TrendingUp className="w-5 h-5 inline mr-2" />
                    Start Trading
                    <ArrowRight className="w-5 h-5 inline ml-2 group-hover:translate-x-1 transition-transform" />
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
