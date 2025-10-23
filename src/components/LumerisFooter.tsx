import { Button } from "@/components/ui/button";
import {
  Twitter,
  Github,
  MessageCircle,
  Mail,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GamingLogo } from "./GamingLogo";
import { useState, useEffect } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const LumerisFooter = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < 30; i++) {
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
    <footer className="relative mt-20 overflow-hidden">
      {/* Deep Space Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0A0E27 0%, #050812 100%)",
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

      {/* Top Border with Light Effect */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), rgba(0, 217, 255, 0.5), transparent)",
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
        }}
      />

      {/* Radial Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)",
          animation: "pulse 6s ease-in-out infinite",
        }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Brand Philosophy Banner */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card-gold border border-yellow-500/30 lumeris-glow-gold">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-lg font-bold lumeris-gradient-gold-cyan">
              Powered by Light. United by Web3.
            </span>
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <GamingLogo size="small" showText={true} />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The cosmic platform where blockchain, gaming, and trading
              converge. Every beam carries a new connection across the Web3
              universe.
            </p>
            {/* Social Links - Commented out for now
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-yellow-500/10 hover:text-yellow-400 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
              >
                <Github className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-yellow-500/10 hover:text-yellow-400 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-cyan-500/10 hover:text-cyan-400 transition-all"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
            */}
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4 lumeris-gradient-gold-cyan">
              Cosmic Platform
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/gaming"
                  className="hover:text-yellow-400 transition-smooth flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Gaming Galaxies
                </Link>
              </li>
              <li>
                <Link
                  to="/defi"
                  className="hover:text-cyan-400 transition-smooth flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Light-Speed Trading
                </Link>
              </li>
              <li>
                <Link
                  to="/nft-marketplace"
                  className="hover:text-yellow-400 transition-smooth flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Light Artifacts
                </Link>
              </li>
              <li>
                <Link
                  to="/launchpad"
                  className="hover:text-cyan-400 transition-smooth flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Stellar Launchpad
                </Link>
              </li>
              <li>
                <Link
                  to="/governance"
                  className="hover:text-yellow-400 transition-smooth flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Light Council
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="font-semibold mb-4 text-gradient-silver">
              Developers
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-smooth flex items-center group"
                >
                  API Documentation{" "}
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-smooth flex items-center group"
                >
                  SDK & Tools{" "}
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-smooth flex items-center group"
                >
                  Smart Contracts{" "}
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  Bug Bounty
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-smooth">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Supported Networks */}
          <div>
            <h3 className="font-semibold mb-4 lumeris-gradient-gold-cyan">
              Light Networks
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Ethereum
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Polygon
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Binance Smart Chain
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Polkadot
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                Arbitrum
              </li>
            </ul>
          </div>
        </div>

        {/* Constellation Divider */}
        <div className="relative h-12 mb-8">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 50">
            {/* Constellation pattern */}
            <circle cx="200" cy="25" r="2" fill="#FFD700" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="400" cy="25" r="2" fill="#00D9FF" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="600" cy="25" r="3" fill="#FFD700" opacity="1">
              <animate
                attributeName="r"
                values="2;4;2"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="800" cy="25" r="2" fill="#00D9FF" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="1000" cy="25" r="2" fill="#FFD700" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                begin="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <line
              x1="200"
              y1="25"
              x2="400"
              y2="25"
              stroke="rgba(255, 215, 0, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="400"
              y1="25"
              x2="600"
              y2="25"
              stroke="rgba(0, 217, 255, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="600"
              y1="25"
              x2="800"
              y2="25"
              stroke="rgba(255, 215, 0, 0.3)"
              strokeWidth="1"
            />
            <line
              x1="800"
              y1="25"
              x2="1000"
              y2="25"
              stroke="rgba(0, 217, 255, 0.3)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Bottom */}
        <div className="border-t border-yellow-500/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Lumeris Platform. All rights reserved.
            <span className="hidden md:inline text-foreground/40 mx-2">|</span>
            <span className="block md:inline text-xs italic text-foreground/50">
              Where light meets blockchain, magic happens.
            </span>
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-yellow-400 transition-smooth"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-cyan-400 transition-smooth"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-yellow-400 transition-smooth"
            >
              Security
            </a>
          </div>
        </div>

        {/* Final Cosmic Quote */}
        <div className="mt-8 text-center">
          <p className="text-xs text-foreground/40 italic">
            "In the Lumeris cosmos, every transaction is a beam of light,
            <br className="hidden md:block" />
            every connection a constellation, every user a star."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LumerisFooter;
