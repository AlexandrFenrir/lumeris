import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Zap,
  Gamepad2,
  TrendingUp,
  Trophy,
  Rocket,
  Vote,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { WalletConnect } from "./WalletConnect";
import { GamingLogo } from "./GamingLogo";
import { PerformanceSettings } from "./PerformanceSettings";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <GamingLogo size="small" showText={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/gaming"
            className={`px-4 py-2 rounded-lg nav-link flex items-center gap-2 ${
              location.pathname === "/gaming"
                ? "glass-card-silver text-gradient-silver"
                : "text-foreground/80 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Gaming
          </Link>
          <Link
            to="/defi"
            className={`px-4 py-2 rounded-lg nav-link flex items-center gap-2 ${
              location.pathname === "/defi"
                ? "glass-card-gold text-gradient-gold"
                : "text-foreground/80 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Trading
          </Link>
          <Link
            to="/advanced-trading"
            className={`px-4 py-2 rounded-lg nav-link flex items-center gap-2 ${
              location.pathname === "/advanced-trading"
                ? "glass-card-gold text-gradient-gold animate-pulse-glow-gold"
                : "text-foreground/80 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Zap className="w-4 h-4" />
            Live Trading
          </Link>
          <Link
            to="/nft-marketplace"
            className={`px-4 py-2 rounded-lg nav-link flex items-center gap-2 ${
              location.pathname === "/nft-marketplace"
                ? "glass-card-silver text-gradient-silver"
                : "text-foreground/80 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Trophy className="w-4 h-4" />
            NFT
          </Link>
          <Link
            to="/launchpad"
            className={`px-4 py-2 rounded-lg nav-link flex items-center gap-2 ${
              location.pathname === "/launchpad"
                ? "glass-card-gold text-gradient-gold"
                : "text-foreground/80 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Rocket className="w-4 h-4" />
            Launchpad
          </Link>
          <Link
            to="/governance"
            className={`px-4 py-2 rounded-lg nav-link flex items-center gap-2 ${
              location.pathname === "/governance"
                ? "glass-card-silver text-gradient-silver"
                : "text-foreground/80 hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Vote className="w-4 h-4" />
            Governance
          </Link>
        </nav>

        {/* Connect Wallet Button & Settings */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            <PerformanceSettings />
          </div>
          <div className="hidden md:block">
            <WalletConnect />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-card border-t border-white/10 animate-slide-in-down">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/gaming"
              className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                location.pathname === "/gaming"
                  ? "glass-card-silver text-gradient-silver"
                  : "text-foreground/80 hover:bg-white/5"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Gamepad2 className="w-5 h-5" />
              Gaming
            </Link>
            <Link
              to="/defi"
              className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                location.pathname === "/defi"
                  ? "glass-card-gold text-gradient-gold"
                  : "text-foreground/80 hover:bg-white/5"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <TrendingUp className="w-5 h-5" />
              Trading
            </Link>
            <Link
              to="/advanced-trading"
              className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                location.pathname === "/advanced-trading"
                  ? "glass-card-gold text-gradient-gold"
                  : "text-foreground/80 hover:bg-white/5"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Zap className="w-5 h-5" />
              Live Trading
            </Link>
            <Link
              to="/nft-marketplace"
              className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                location.pathname === "/nft-marketplace"
                  ? "glass-card-silver text-gradient-silver"
                  : "text-foreground/80 hover:bg-white/5"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Trophy className="w-5 h-5" />
              NFT Marketplace
            </Link>
            <Link
              to="/launchpad"
              className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                location.pathname === "/launchpad"
                  ? "glass-card-gold text-gradient-gold"
                  : "text-foreground/80 hover:bg-white/5"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Rocket className="w-5 h-5" />
              Launchpad
            </Link>
            <Link
              to="/governance"
              className={`block px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                location.pathname === "/governance"
                  ? "glass-card-silver text-gradient-silver"
                  : "text-foreground/80 hover:bg-white/5"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Vote className="w-5 h-5" />
              Governance
            </Link>
            <div className="mt-4 space-y-2">
              <PerformanceSettings />
              <WalletConnect />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
