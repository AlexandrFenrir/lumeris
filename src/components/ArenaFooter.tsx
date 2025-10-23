import { Button } from "@/components/ui/button";
import {
  Twitter,
  Github,
  MessageCircle,
  Mail,
  ExternalLink,
  Gamepad2,
  TrendingUp,
  Trophy,
  Rocket,
  Users,
  Zap,
  Shield,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ArenaLogo } from "./ArenaLogo";
import { useState, useEffect } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const ArenaFooter = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [liveStats, setLiveStats] = useState({
    activePlayers: 12547,
    tradingVolume: 45234567,
    tournamentsLive: 23,
  });

  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 25; i++) {
      newStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    setStars(newStars);

    // Update live stats
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        activePlayers: prev.activePlayers + Math.floor(Math.random() * 10 - 5),
        tradingVolume: prev.tradingVolume + Math.floor(Math.random() * 10000),
        tournamentsLive:
          prev.tournamentsLive + Math.floor(Math.random() * 3 - 1),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Deep Space Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0F0A1E 0%, #070512 100%)",
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

      {/* Top Border with Energy Effect */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(147, 51, 234, 0.6), rgba(245, 158, 11, 0.6), transparent)",
          boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)",
        }}
      />

      {/* Arena Floor Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(147, 51, 234, 0.5) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Live Stats Banner */}
        <div
          className="mb-12 p-6 rounded-xl backdrop-blur-sm border"
          style={{
            background:
              "linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
            borderColor: "rgba(147, 51, 234, 0.3)",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-400 animate-pulse" />
            <span className="text-lg font-bold text-green-400">
              Live Arena Status
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {formatNumber(liveStats.activePlayers)}
              </div>
              <div className="text-sm text-foreground/60">
                Players Online Now
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-400 mb-1">
                {formatNumber(liveStats.tradingVolume)}
              </div>
              <div className="text-sm text-foreground/60">
                24h Trading Volume
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400 mb-1">
                {liveStats.tournamentsLive}
              </div>
              <div className="text-sm text-foreground/60">Live Tournaments</div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <ArenaLogo size="medium" showText={true} animated={true} />
            <p className="text-foreground/60 mt-4 leading-relaxed">
              The ultimate arena where gaming meets DeFi. Compete, trade, and
              conquer in the Web3 revolution.
            </p>

            {/* Network Status */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: "#9333EA",
                    boxShadow: "0 0 8px rgba(147, 51, 234, 0.8)",
                  }}
                />
                <span className="text-sm text-foreground/60">
                  Gaming Network:{" "}
                  <span className="text-purple-400 font-semibold">Online</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: "#F59E0B",
                    boxShadow: "0 0 8px rgba(245, 158, 11, 0.8)",
                  }}
                />
                <span className="text-sm text-foreground/60">
                  Trading Network:{" "}
                  <span className="text-amber-400 font-semibold">Online</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{
                    background: "#06B6D4",
                    boxShadow: "0 0 8px rgba(6, 182, 212, 0.8)",
                  }}
                />
                <span className="text-sm text-foreground/60">
                  Blockchain:{" "}
                  <span className="text-cyan-400 font-semibold">Synced</span>
                </span>
              </div>
            </div>
          </div>

          {/* Gaming Arena Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300">Gaming Arena</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/gaming"
                  className="text-foreground/60 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Battle Arena
                </Link>
              </li>
              <li>
                <Link
                  to="/gaming"
                  className="text-foreground/60 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Tournaments
                </Link>
              </li>
              <li>
                <Link
                  to="/nft-marketplace"
                  className="text-foreground/60 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Trophy Hall (NFTs)
                </Link>
              </li>
              <li>
                <Link
                  to="/gaming"
                  className="text-foreground/60 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Leaderboards
                </Link>
              </li>
              <li>
                <Link
                  to="/defi"
                  className="text-foreground/60 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Betting Arena
                </Link>
              </li>
            </ul>
          </div>

          {/* Trading Pit Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300">Trading Pit</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/defi"
                  className="text-foreground/60 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Spot Trading
                </Link>
              </li>
              <li>
                <Link
                  to="/advanced-trading"
                  className="text-foreground/60 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Live Trading
                </Link>
              </li>
              <li>
                <Link
                  to="/defi"
                  className="text-foreground/60 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Liquidity Pools
                </Link>
              </li>
              <li>
                <Link
                  to="/launchpad"
                  className="text-foreground/60 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Launch Bay (IDO)
                </Link>
              </li>
              <li>
                <Link
                  to="/governance"
                  className="text-foreground/60 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Council Chamber
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300">Resources</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Security Audits
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-foreground/60 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms & Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-[1px] mb-8"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(147, 51, 234, 0.3), rgba(245, 158, 11, 0.3), transparent)",
          }}
        />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-foreground/60 text-sm">
            © 2025 Lumeris Arena. All rights reserved.
            <span className="mx-2">•</span>
            <span className="text-foreground/40">Built for Champions</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-lg backdrop-blur-sm border border-white/10 hover:border-purple-500/50 flex items-center justify-center transition-all duration-300 group"
              style={{
                background: "rgba(147, 51, 234, 0.05)",
              }}
            >
              <Twitter className="w-5 h-5 text-foreground/60 group-hover:text-purple-400 transition-colors" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg backdrop-blur-sm border border-white/10 hover:border-amber-500/50 flex items-center justify-center transition-all duration-300 group"
              style={{
                background: "rgba(245, 158, 11, 0.05)",
              }}
            >
              <MessageCircle className="w-5 h-5 text-foreground/60 group-hover:text-amber-400 transition-colors" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg backdrop-blur-sm border border-white/10 hover:border-cyan-500/50 flex items-center justify-center transition-all duration-300 group"
              style={{
                background: "rgba(6, 182, 212, 0.05)",
              }}
            >
              <Github className="w-5 h-5 text-foreground/60 group-hover:text-cyan-400 transition-colors" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-lg backdrop-blur-sm border border-white/10 hover:border-purple-500/50 flex items-center justify-center transition-all duration-300 group"
              style={{
                background: "rgba(147, 51, 234, 0.05)",
              }}
            >
              <Mail className="w-5 h-5 text-foreground/60 group-hover:text-purple-400 transition-colors" />
            </a>
          </div>
        </div>

        {/* Final Tagline */}
        <div className="mt-8 text-center">
          <p className="text-sm text-foreground/40 italic">
            "In the arena, every player is a champion. Every trade is a victory.
            Every moment is legendary."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ArenaFooter;
