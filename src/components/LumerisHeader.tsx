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
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { WalletConnect } from "./WalletConnect";
import { GamingLogo } from "./GamingLogo";

const LumerisHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      to: "/gaming",
      icon: Gamepad2,
      label: "Gaming",
      theme: "silver",
    },
    {
      to: "/defi",
      icon: TrendingUp,
      label: "Trading",
      theme: "gold",
    },
    {
      to: "/advanced-trading",
      icon: Zap,
      label: "Live Trading",
      theme: "gold",
      highlight: true,
    },
    {
      to: "/nft-marketplace",
      icon: Trophy,
      label: "NFT",
      theme: "silver",
    },
    {
      to: "/launchpad",
      icon: Rocket,
      label: "Launchpad",
      theme: "gold",
    },
    {
      to: "/governance",
      icon: Vote,
      label: "Governance",
      theme: "silver",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-card border-b border-yellow-500/20 shadow-lg shadow-yellow-500/10"
          : "bg-transparent border-b border-white/5"
      }`}
    >
      {/* Light Trail Effect on Scroll */}
      {scrolled && (
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), rgba(0, 217, 255, 0.5), transparent)",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />
      )}

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo with Glow */}
        <Link to="/" className="flex items-center group relative">
          <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <GamingLogo size="small" showText={true} />
          <div className="ml-3 hidden md:block">
            <div className="text-xs text-foreground/60 italic">
              Powered by Light
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  px-4 py-2 rounded-lg nav-link flex items-center gap-2 relative
                  transition-all duration-300 group
                  ${
                    isActive
                      ? item.theme === "gold"
                        ? "glass-card-gold lumeris-gradient-gold-cyan border border-yellow-500/30"
                        : "glass-card-silver text-gradient-silver border border-gray-400/30"
                      : "text-foreground/80 hover:text-foreground hover:bg-white/5"
                  }
                  ${item.highlight ? "animate-pulse-glow-gold" : ""}
                `}
              >
                {/* Light Trail on Hover */}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        item.theme === "gold"
                          ? "linear-gradient(135deg, rgba(255, 215, 0, 0.1), transparent)"
                          : "linear-gradient(135deg, rgba(192, 192, 192, 0.1), transparent)",
                    }}
                  />
                )}

                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{item.label}</span>

                {/* Active Indicator */}
                {isActive && (
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[2px] rounded-full"
                    style={{
                      background:
                        item.theme === "gold"
                          ? "linear-gradient(to right, #FFD700, #00D9FF)"
                          : "linear-gradient(to right, #C0C0C0, #FFFFFF)",
                      boxShadow:
                        item.theme === "gold"
                          ? "0 0 8px rgba(255, 215, 0, 0.6)"
                          : "0 0 8px rgba(192, 192, 192, 0.6)",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Connect Wallet Button with Glow */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <WalletConnect />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:bg-white/10 relative group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="absolute inset-0 bg-yellow-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isMenuOpen ? (
              <X className="relative z-10" />
            ) : (
              <Menu className="relative z-10" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-card border-t border-yellow-500/20 animate-slide-in-down">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`
                    block px-4 py-3 rounded-lg transition-all flex items-center gap-3
                    ${
                      isActive
                        ? item.theme === "gold"
                          ? "glass-card-gold lumeris-gradient-gold-cyan border border-yellow-500/30"
                          : "glass-card-silver text-gradient-silver border border-gray-400/30"
                        : "text-foreground/80 hover:bg-white/5"
                    }
                  `}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {isActive && (
                    <Sparkles className="w-4 h-4 ml-auto animate-pulse" />
                  )}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t border-white/10">
              <WalletConnect />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LumerisHeader;
