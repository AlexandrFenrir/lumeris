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

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface LightBeam {
  id: number;
  angle: number;
  length: number;
  opacity: number;
  delay: number;
}

export function LumerisHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [lightBeams, setLightBeams] = useState<LightBeam[]>([]);
  const [stats, setStats] = useState({
    users: 125000,
    volume: 45000000,
    trades: 2500000,
    rewards: 15000000,
  });

  // Initialize stars
  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 3 + 2,
      });
    }
    setStars(newStars);

    // Initialize light beams
    const beams: LightBeam[] = [];
    for (let i = 0; i < 8; i++) {
      beams.push({
        id: i,
        angle: (360 / 8) * i,
        length: Math.random() * 200 + 300,
        opacity: Math.random() * 0.3 + 0.1,
        delay: i * 0.5,
      });
    }
    setLightBeams(beams);
  }, []);

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
      {/* Deep Space Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, #1A1F3A 0%, #0A0E27 100%)",
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full lumeris-glow-gold"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: "#FFD700",
              opacity: star.opacity,
              animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
              boxShadow: "0 0 4px rgba(255, 215, 0, 0.8)",
            }}
          />
        ))}
      </div>

      {/* Central Light Portal */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {/* Radial Glow */}
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(0, 217, 255, 0.2) 50%, transparent 70%)",
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() / 2000) * 0.1})`,
            animation: "pulse 4s ease-in-out infinite",
          }}
        />

        {/* Light Beams */}
        {lightBeams.map((beam) => (
          <div
            key={beam.id}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: `${beam.length}px`,
              height: "2px",
              background: `linear-gradient(to right, rgba(255, 215, 0, ${beam.opacity}), transparent)`,
              transform: `rotate(${beam.angle}deg)`,
              animation: `shimmer 3s ease-in-out infinite`,
              animationDelay: `${beam.delay}s`,
            }}
          />
        ))}

        {/* Central Core */}
        <div
          className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 165, 0, 0.3) 50%, transparent 70%)",
            boxShadow:
              "0 0 60px rgba(255, 215, 0, 0.6), 0 0 120px rgba(255, 215, 0, 0.3)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Floating Light Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: "0 0 8px rgba(0, 217, 255, 0.8)",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8 animate-slide-in-up">
            {/* Cosmic Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-gold border border-yellow-500/30 lumeris-glow-gold">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-sm font-semibold lumeris-gradient-gold-cyan">
                Where Light Meets Web3
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="lumeris-gradient-gold-cyan text-glow-gold">
                  LUMERIS
                </span>
              </h1>

              {/* Brand Tagline - Prominent */}
              <div className="relative">
                <p className="text-2xl md:text-3xl font-semibold text-white/90 leading-relaxed">
                  <span className="lumeris-gradient-gold-cyan">
                    Powered by Light.
                  </span>
                  <br />
                  <span className="text-gradient-silver">United by Web3.</span>
                </p>
                <div
                  className="absolute -inset-2 bg-gradient-to-r from-yellow-500/20 via-cyan-500/20 to-transparent rounded-lg blur-xl -z-10"
                  style={{ animation: "pulse 3s ease-in-out infinite" }}
                />
              </div>

              <p className="text-lg md:text-xl text-foreground/80 max-w-2xl pt-4">
                Experience the cosmic convergence of{" "}
                <span className="lumeris-gradient-gold-cyan font-semibold">
                  blockchain gaming
                </span>
                ,{" "}
                <span className="text-gradient-silver font-semibold">
                  decentralized trading
                </span>
                , and{" "}
                <span className="text-cyan-400 font-semibold">
                  NFT innovation
                </span>{" "}
                in a universe powered by light.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/advanced-trading">
                <MagneticButton className="btn-gold px-8 py-4 text-lg font-bold rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl lumeris-glow-gold">
                  <Zap className="w-5 h-5" />
                  Enter the Cosmos
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
              </Link>

              <Link to="/gaming">
                <MagneticButton className="btn-silver px-8 py-4 text-lg font-bold rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl">
                  <Gamepad2 className="w-5 h-5" />
                  Explore Galaxies
                  <Play className="w-5 h-5" />
                </MagneticButton>
              </Link>
            </div>

            {/* Live Stats with Cosmic Theme */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <div className="text-center glass-card p-4 rounded-lg border border-yellow-500/20">
                <div className="text-3xl font-bold lumeris-gradient-gold-cyan animate-pulse">
                  {(stats.users / 1000).toFixed(1)}K+
                </div>
                <div className="text-sm text-foreground/60">Light Bearers</div>
              </div>
              <div className="text-center glass-card p-4 rounded-lg border border-cyan-500/20">
                <div className="text-3xl font-bold text-gradient-silver animate-pulse">
                  ${(stats.volume / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-foreground/60">Cosmic Volume</div>
              </div>
              <div className="text-center glass-card p-4 rounded-lg border border-yellow-500/20">
                <div className="text-3xl font-bold lumeris-gradient-gold-cyan animate-pulse">
                  {(stats.trades / 1000000).toFixed(2)}M
                </div>
                <div className="text-sm text-foreground/60">Transactions</div>
              </div>
              <div className="text-center glass-card p-4 rounded-lg border border-cyan-500/20">
                <div className="text-3xl font-bold text-gradient-silver animate-pulse">
                  ${(stats.rewards / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-foreground/60">Light Rewards</div>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards with Constellation Theme */}
          <div className="grid grid-cols-2 gap-6 animate-slide-in-down relative">
            {/* Constellation Lines Connecting Cards */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            >
              <line
                x1="50%"
                y1="25%"
                x2="50%"
                y2="75%"
                stroke="rgba(255, 215, 0, 0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <line
                x1="25%"
                y1="50%"
                x2="75%"
                y2="50%"
                stroke="rgba(0, 217, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Trading Card */}
            <HolographicCard theme="gold" className="col-span-2 relative z-10">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center lumeris-glow-gold">
                    <TrendingUp className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold lumeris-gradient-gold-cyan">
                      Light-Speed Trading
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Powered by Cosmic AI
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
                      className="h-full lumeris-gradient-gold-cyan animate-shimmer"
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
            <HolographicCard theme="silver" className="relative z-10">
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg gradient-silver flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-black" />
                </div>
                <h3 className="text-lg font-bold text-gradient-silver">
                  Cosmic Gaming
                </h3>
                <p className="text-sm text-foreground/60">
                  Explore New Galaxies
                </p>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-gradient-silver">
                    1,250+
                  </div>
                  <div className="text-xs text-foreground/40">
                    Active Explorers
                  </div>
                </div>
              </div>
            </HolographicCard>

            {/* NFT Card */}
            <HolographicCard theme="cosmic" className="relative z-10">
              <div className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg gradient-cosmic flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-cyan-400">
                  Light Artifacts
                </h3>
                <p className="text-sm text-foreground/60">Legendary NFTs</p>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-cyan-400">8,500+</div>
                  <div className="text-xs text-foreground/40">Minted</div>
                </div>
              </div>
            </HolographicCard>

            {/* Launchpad Card */}
            <HolographicCard theme="gold" className="col-span-2 relative z-10">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center lumeris-glow-gold">
                    <Rocket className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold lumeris-gradient-gold-cyan">
                      Stellar Launchpad
                    </h3>
                    <p className="text-sm text-foreground/60">
                      Next Launch in 2h 45m
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 glass-card p-3 rounded-lg border border-yellow-500/20">
                    <div className="text-xs text-foreground/60">Raised</div>
                    <div className="text-lg font-bold lumeris-gradient-gold-cyan">
                      $2.5M
                    </div>
                  </div>
                  <div className="flex-1 glass-card p-3 rounded-lg border border-cyan-500/20">
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

      {/* Scroll Indicator with Light Theme */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-yellow-500/50 rounded-full flex items-start justify-center p-2 lumeris-glow-gold">
          <div className="w-1 h-3 lumeris-gradient-gold-cyan rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default LumerisHeroSection;
