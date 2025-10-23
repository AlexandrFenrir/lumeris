import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MagneticButton } from "./MagneticButton";
import { HolographicCard } from "./HolographicCard";
import {
  Zap,
  Rocket,
  Trophy,
  TrendingUp,
  Gamepad2,
  Sparkles,
  ArrowRight,
  Play,
} from "lucide-react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({
    users: 125000,
    volume: 45000000,
    trades: 2500000,
    rewards: 15000000,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animate stats
    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(Math.random() * 10),
        volume: prev.volume + Math.floor(Math.random() * 10000),
        trades: prev.trades + Math.floor(Math.random() * 100),
        rewards: prev.rewards + Math.floor(Math.random() * 5000),
      }));
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const parallaxOffset = {
    x: (mousePosition.x - window.innerWidth / 2) * 0.02,
    y: (mousePosition.y - window.innerHeight / 2) * 0.02,
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float-cosmic"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)",
            top: "10%",
            left: "10%",
            transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float-cosmic"
          style={{
            background:
              "radial-gradient(circle, rgba(192, 192, 192, 0.4) 0%, transparent 70%)",
            bottom: "10%",
            right: "10%",
            transform: `translate(${-parallaxOffset.x}px, ${-parallaxOffset.y}px)`,
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-15 animate-float-cosmic"
          style={{
            background:
              "radial-gradient(circle, rgba(138, 43, 226, 0.5) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) translate(${
              parallaxOffset.x * 2
            }px, ${parallaxOffset.y * 2}px)`,
            animationDelay: "4s",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8 animate-slide-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-gold border border-yellow-500/30">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-sm font-semibold text-gradient-gold">
                The Future of Gaming & Trading
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="text-gradient-gold text-glow-gold">
                  LUMERIS
                </span>
                <br />
                <span className="text-gradient-silver text-glow-silver">
                  PLATFORM
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl">
                Experience the next generation of{" "}
                <span className="text-gradient-gold font-semibold">
                  decentralized trading
                </span>
                ,{" "}
                <span className="text-gradient-silver font-semibold">
                  epic gaming
                </span>
                , and{" "}
                <span className="text-purple-400 font-semibold">
                  live betting
                </span>{" "}
                in a futuristic metaverse.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/advanced-trading">
                <MagneticButton className="btn-gold px-8 py-4 text-lg font-bold rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl">
                  <Zap className="w-5 h-5" />
                  Start Trading
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
              </Link>

              <Link to="/gaming">
                <MagneticButton className="btn-silver px-8 py-4 text-lg font-bold rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl">
                  <Gamepad2 className="w-5 h-5" />
                  Play Games
                  <Play className="w-5 h-5" />
                </MagneticButton>
              </Link>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-gold animate-pulse">
                  {(stats.users / 1000).toFixed(1)}K+
                </div>
                <div className="text-sm text-foreground/60">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-silver animate-pulse">
                  ${(stats.volume / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-foreground/60">Trading Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-gold animate-pulse">
                  {(stats.trades / 1000000).toFixed(2)}M
                </div>
                <div className="text-sm text-foreground/60">Total Trades</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient-silver animate-pulse">
                  ${(stats.rewards / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-foreground/60">Rewards Paid</div>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid grid-cols-2 gap-6 animate-slide-in-down">
            {/* Trading Card */}
            <HolographicCard theme="gold" className="col-span-2">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gradient-gold">
                      Live Trading
                    </h3>
                    <p className="text-sm text-foreground/60">
                      AI-Powered Signals
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">BTC/USD</span>
                    <span className="text-green-400 font-bold">+5.2%</span>
                  </div>
                  <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-gold animate-shimmer"
                      style={{ width: "75%" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-foreground/40">
                    <span>$42,150</span>
                    <span>$45,890</span>
                  </div>
                </div>
              </div>
            </HolographicCard>

            {/* Gaming Card */}
            <HolographicCard theme="silver">
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg gradient-silver flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-lg font-bold text-gradient-silver">
                  Epic Games
                </h3>
                <p className="text-sm text-foreground/60">
                  Play & Earn Rewards
                </p>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gradient-silver">
                    1,250+
                  </div>
                  <div className="text-xs text-foreground/40">
                    Active Players
                  </div>
                </div>
              </div>
            </HolographicCard>

            {/* NFT Card */}
            <HolographicCard theme="cosmic">
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg gradient-cosmic flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-400">
                  NFT Rewards
                </h3>
                <p className="text-sm text-foreground/60">
                  Legendary Achievements
                </p>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-purple-400">
                    8,500+
                  </div>
                  <div className="text-xs text-foreground/40">NFTs Minted</div>
                </div>
              </div>
            </HolographicCard>

            {/* Launchpad Card */}
            <HolographicCard theme="gold" className="col-span-2">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gradient-gold">
                      Token Launchpad
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Next IDO in 2h 45m
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 glass-card p-3 rounded-lg">
                    <div className="text-xs text-foreground/60">Raised</div>
                    <div className="text-lg font-bold text-gradient-gold">
                      $2.5M
                    </div>
                  </div>
                  <div className="flex-1 glass-card p-3 rounded-lg">
                    <div className="text-xs text-foreground/60">
                      Participants
                    </div>
                    <div className="text-lg font-bold text-gradient-silver">
                      1,234
                    </div>
                  </div>
                </div>
              </div>
            </HolographicCard>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-gradient-gold rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
