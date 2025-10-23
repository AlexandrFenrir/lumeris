import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MagneticButton } from "./MagneticButton";
import { HolographicCard } from "./HolographicCard";
import { ParticleSystem3D } from "./ParticleSystem3D";
import {
  Zap,
  Trophy,
  TrendingUp,
  Gamepad2,
  Users,
  DollarSign,
  Target,
  Award,
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

interface ArenaLight {
  id: number;
  x: number;
  y: number;
  color: string;
  intensity: number;
  pulseSpeed: number;
}

interface EnergyBeam {
  id: number;
  angle: number;
  color: string;
  opacity: number;
  delay: number;
}

export function ArenaHeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Star[]>([]);
  const [arenaLights, setArenaLights] = useState<ArenaLight[]>([]);
  const [energyBeams, setEnergyBeams] = useState<EnergyBeam[]>([]);
  const [stats, setStats] = useState({
    players: 125000,
    volume: 45000000,
    tournaments: 2500,
    rewards: 15000000,
  });

  // Initialize stars (fewer, more subtle)
  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 60; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        twinkleSpeed: Math.random() * 4 + 3,
      });
    }
    setStars(newStars);

    // Initialize arena lights (stadium-style)
    const lights: ArenaLight[] = [];
    const lightPositions = [
      { x: 10, y: 20 },
      { x: 30, y: 15 },
      { x: 50, y: 10 },
      { x: 70, y: 15 },
      { x: 90, y: 20 },
    ];

    lightPositions.forEach((pos, i) => {
      lights.push({
        id: i,
        x: pos.x,
        y: pos.y,
        color: i % 2 === 0 ? "#9333EA" : "#F59E0B",
        intensity: Math.random() * 0.3 + 0.5,
        pulseSpeed: Math.random() * 2 + 2,
      });
    });
    setArenaLights(lights);

    // Initialize energy beams (connecting platforms)
    const beams: EnergyBeam[] = [];
    const beamColors = ["#9333EA", "#F59E0B", "#06B6D4"];
    for (let i = 0; i < 6; i++) {
      beams.push({
        id: i,
        angle: (360 / 6) * i,
        color: beamColors[i % 3],
        opacity: Math.random() * 0.2 + 0.1,
        delay: i * 0.3,
      });
    }
    setEnergyBeams(beams);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animate stats
    const interval = setInterval(() => {
      setStats((prev) => ({
        players: prev.players + Math.floor(Math.random() * 10),
        volume: prev.volume + Math.floor(Math.random() * 10000),
        tournaments: prev.tournaments + Math.floor(Math.random() * 5),
        rewards: prev.rewards + Math.floor(Math.random() * 5000),
      }));
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Semi-transparent overlay - allows solar system to show through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26, 19, 51, 0.3) 0%, rgba(15, 10, 30, 0.5) 50%, rgba(7, 5, 18, 0.7) 100%)",
        }}
      />

      {/* Starfield Background (Subtle) */}
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
              backgroundColor: "#FFFFFF",
              opacity: star.opacity,
              animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
              transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.01}px, ${(mousePosition.y - window.innerHeight / 2) * 0.01}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}
      </div>

      {/* 3D Particle System */}
      <ParticleSystem3D count={50} colors={["#9333EA", "#F59E0B", "#06B6D4"]} />

      {/* Arena Lights (Stadium Style) */}
      <div className="absolute inset-0 overflow-hidden">
        {arenaLights.map((light) => (
          <div
            key={light.id}
            className="absolute"
            style={{
              left: `${light.x}%`,
              top: `${light.y}%`,
              width: "200px",
              height: "400px",
              background: `radial-gradient(ellipse, ${light.color}40 0%, transparent 70%)`,
              opacity: light.intensity,
              animation: `pulse ${light.pulseSpeed}s ease-in-out infinite`,
              filter: "blur(60px)",
              transform: "rotate(-15deg)",
            }}
          />
        ))}
      </div>

      {/* Central Arena Platform */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
        {/* Platform Base */}
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(245, 158, 11, 0.2) 50%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />

        {/* Energy Beams */}
        {energyBeams.map((beam) => (
          <div
            key={beam.id}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: "300px",
              height: "2px",
              background: `linear-gradient(to right, ${beam.color}, transparent)`,
              opacity: beam.opacity,
              transform: `rotate(${beam.angle}deg)`,
              boxShadow: `0 0 10px ${beam.color}`,
              animation: `shimmer 3s ease-in-out infinite ${beam.delay}s`,
            }}
          />
        ))}

        {/* Central Energy Core */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, rgba(245, 158, 11, 0.4) 50%, transparent 70%)",
            boxShadow:
              "0 0 60px rgba(147, 51, 234, 0.6), 0 0 120px rgba(245, 158, 11, 0.4)",
            animation: "pulse 3s ease-in-out infinite",
          }}
        />

        {/* Rotating Ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-2 opacity-30"
          style={{
            borderColor: "#9333EA",
            animation: "spin 20s linear infinite",
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 opacity-20"
          style={{
            borderColor: "#F59E0B",
            animation: "spin 30s linear infinite reverse",
            boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-6 border animate-float-cosmic"
            style={{
              background:
                "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
              borderColor: "rgba(147, 51, 234, 0.3)",
              boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)",
            }}
          >
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">
              Welcome to the Arena
            </span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(135deg, #9333EA 0%, #F59E0B 50%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 40px rgba(147, 51, 234, 0.3)",
              }}
            >
              Arena of Champions
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-foreground/80 mb-4 max-w-3xl mx-auto">
            Compete in the ultimate{" "}
            <span className="text-purple-400 font-semibold">gaming arena</span>{" "}
            and dominate{" "}
            <span className="text-amber-400 font-semibold">DeFi markets</span>{" "}
            in one cosmic platform
          </p>

          {/* Tagline */}
          <div
            className="inline-block px-6 py-3 rounded-full backdrop-blur-sm mb-12 border"
            style={{
              background:
                "linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)",
              borderColor: "rgba(245, 158, 11, 0.3)",
              boxShadow: "0 0 30px rgba(245, 158, 11, 0.2)",
            }}
          >
            <p
              className="text-lg font-semibold"
              style={{
                background: "linear-gradient(90deg, #9333EA 0%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              🎮 Play. Trade. Conquer. Earn. 💰
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/gaming">
              <MagneticButton
                className="px-8 py-6 text-lg font-bold text-white relative overflow-hidden group rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #9333EA 0%, #C084FC 100%)",
                  boxShadow:
                    "0 0 30px rgba(147, 51, 234, 0.5), 0 0 60px rgba(147, 51, 234, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Gamepad2 className="w-5 h-5 mr-2 relative z-10 inline" />
                <span className="relative z-10">Enter Arena</span>
                <ArrowRight className="w-5 h-5 ml-2 relative z-10 inline group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
            </Link>

            <Link to="/defi">
              <MagneticButton
                className="px-8 py-6 text-lg font-bold text-white relative overflow-hidden group rounded-lg border-2"
                style={{
                  borderColor: "rgba(245, 158, 11, 0.8)",
                  background:
                    "linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)",
                  boxShadow:
                    "0 0 30px rgba(245, 158, 11, 0.5), 0 0 60px rgba(245, 158, 11, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/50 to-amber-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <TrendingUp className="w-5 h-5 mr-2 relative z-10 inline" />
                <span className="relative z-10">Start Trading</span>
                <ArrowRight className="w-5 h-5 ml-2 relative z-10 inline group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {/* Active Players - Purple */}
            <HolographicCard theme="purple" className="p-6">
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-purple-400 mb-2" />
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {formatNumber(stats.players)}
                </div>
                <div className="text-sm text-foreground/60">Active Players</div>
              </div>
            </HolographicCard>

            {/* Trading Volume - Gold */}
            <HolographicCard theme="gold" className="p-6">
              <div className="flex flex-col items-center">
                <DollarSign className="w-8 h-8 text-amber-400 mb-2" />
                <div className="text-3xl font-bold text-amber-400 mb-1">
                  {formatNumber(stats.volume)}
                </div>
                <div className="text-sm text-foreground/60">Trading Volume</div>
              </div>
            </HolographicCard>

            {/* Tournaments - Purple */}
            <HolographicCard theme="purple" className="p-6">
              <div className="flex flex-col items-center">
                <Trophy className="w-8 h-8 text-purple-400 mb-2" />
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {formatNumber(stats.tournaments)}
                </div>
                <div className="text-sm text-foreground/60">Tournaments</div>
              </div>
            </HolographicCard>

            {/* Rewards Pool - Gold */}
            <HolographicCard theme="gold" className="p-6">
              <div className="flex flex-col items-center">
                <Award className="w-8 h-8 text-amber-400 mb-2" />
                <div className="text-3xl font-bold text-amber-400 mb-1">
                  {formatNumber(stats.rewards)}
                </div>
                <div className="text-sm text-foreground/60">Rewards Pool</div>
              </div>
            </HolographicCard>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(7, 5, 18, 1))",
        }}
      />
    </section>
  );
}
