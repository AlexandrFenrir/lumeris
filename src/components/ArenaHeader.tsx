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
  Wallet,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { WalletConnect } from "./WalletConnect";
import { PortalWalletButton } from "./PortalWalletButton";
import { ArenaLogo } from "./ArenaLogo";

const ArenaHeader = () => {
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
      theme: "purple",
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
      theme: "purple",
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
      theme: "purple",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#0F0A1E]/90 border-b border-purple-500/30 shadow-lg shadow-purple-500/20"
          : "bg-transparent border-b border-white/5"
      }`}
    >
      {/* Arena Entrance Light Effect */}
      {scrolled && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(147, 51, 234, 0.6), rgba(245, 158, 11, 0.6), rgba(6, 182, 212, 0.6), transparent)",
            animation: "shimmer 3s ease-in-out infinite",
          }}
        />
      )}

      {/* Arena Glow Effect */}
      {scrolled && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[100px] opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(147, 51, 234, 0.4) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      )}

      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-10">
        {/* Logo with Arena Glow */}
        <Link to="/" className="flex items-center group relative">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(245, 158, 11, 0.3) 100%)",
            }}
          />
          <ArenaLogo size="small" showText={true} animated={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            const isPurple = item.theme === "purple";
            const isGold = item.theme === "gold";

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
                  isActive
                    ? isPurple
                      ? "text-purple-400"
                      : "text-amber-400"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {/* Hover Background */}
                <div
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isPurple
                      ? "bg-gradient-to-r from-purple-500/10 to-purple-600/10"
                      : "bg-gradient-to-r from-amber-500/10 to-amber-600/10"
                  }`}
                />

                {/* Active Indicator - Energy Beam */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] rounded-full"
                    style={{
                      background: isPurple
                        ? "linear-gradient(to right, transparent, rgba(147, 51, 234, 0.8), transparent)"
                        : "linear-gradient(to right, transparent, rgba(245, 158, 11, 0.8), transparent)",
                      boxShadow: isPurple
                        ? "0 0 10px rgba(147, 51, 234, 0.6)"
                        : "0 0 10px rgba(245, 158, 11, 0.6)",
                    }}
                  />
                )}

                <div className="relative flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  {item.highlight && (
                    <span
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
                      style={{
                        background: isGold
                          ? "rgba(245, 158, 11, 0.8)"
                          : "rgba(147, 51, 234, 0.8)",
                        boxShadow: isGold
                          ? "0 0 8px rgba(245, 158, 11, 0.8)"
                          : "0 0 8px rgba(147, 51, 234, 0.8)",
                      }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Connect Wallet Button (Desktop) - 3D Portal */}
        <div className="hidden lg:flex items-center justify-center">
          <PortalWalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden absolute top-16 left-0 right-0 backdrop-blur-xl border-b border-purple-500/20"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15, 10, 30, 0.95) 0%, rgba(7, 5, 18, 0.95) 100%)",
          }}
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              const isPurple = item.theme === "purple";

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? isPurple
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      : "text-foreground/70 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.highlight && (
                    <span
                      className="ml-auto w-2 h-2 rounded-full animate-pulse"
                      style={{
                        background: isPurple
                          ? "rgba(147, 51, 234, 0.8)"
                          : "rgba(245, 158, 11, 0.8)",
                        boxShadow: isPurple
                          ? "0 0 8px rgba(147, 51, 234, 0.8)"
                          : "0 0 8px rgba(245, 158, 11, 0.8)",
                      }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Mobile Connect Wallet Button */}
            <div className="mt-4 w-full">
              <WalletConnect />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ArenaHeader;
