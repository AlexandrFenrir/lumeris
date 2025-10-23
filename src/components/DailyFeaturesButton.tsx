import React, { useState, useEffect } from "react";
import { Sparkles, Gift, Dices, Bot, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DailyLottery } from "./DailyLottery";
import { DailyGift } from "./DailyGift";
import { AIChatInterface } from "./AIChatInterface";

type FeatureType = "lottery" | "gift" | "ai" | null;

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const DailyFeaturesButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureType>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Particle burst effect when opening
  useEffect(() => {
    if (isOpen && !isAnimating) {
      setIsAnimating(true);
      createParticleBurst();

      // Reset animation flag after animation completes
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // Gravity
            life: p.life - 0.02,
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles]);

  const createParticleBurst = () => {
    const newParticles: Particle[] = [];
    const colors = ["#ffffff", "#e5e5e5", "#d4d4d4", "#a3a3a3"];

    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const speed = 2 + Math.random() * 3;

      newParticles.push({
        id: Date.now() + i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Upward bias
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
      });
    }

    setParticles(newParticles);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const openFeature = (feature: FeatureType) => {
    setActiveFeature(feature);
    setIsOpen(false);
  };

  const closeModal = () => {
    setActiveFeature(null);
  };

  const features = [
    {
      id: "lottery" as FeatureType,
      icon: Dices,
      label: "Daily Lottery",
      description: "Spin for rewards",
      color: "hover:text-purple-400",
      delay: 0,
    },
    {
      id: "gift" as FeatureType,
      icon: Gift,
      label: "Daily Gift",
      description: "Claim your reward",
      color: "hover:text-amber-400",
      delay: 100,
    },
    {
      id: "ai" as FeatureType,
      icon: Bot,
      label: "AI Assistant",
      description: "Chat with ARIA",
      color: "hover:text-cyan-400",
      delay: 200,
    },
  ];

  return (
    <>
      {/* Floating Button Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Feature Buttons (appear above main button) */}
        {isOpen && (
          <div className="flex flex-col gap-2 mb-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => openFeature(feature.id)}
                  className={`
                    group relative overflow-hidden
                    backdrop-blur-xl bg-white/10 
                    border border-white/20
                    rounded-2xl p-4 pr-6
                    shadow-lg hover:shadow-2xl
                    transition-all duration-300
                    hover:scale-105 hover:bg-white/20
                    ${feature.color}
                    animate-glow-burst
                  `}
                  style={{
                    animationDelay: `${feature.delay}ms`,
                    minWidth: "200px",
                  }}
                >
                  {/* Glassmorphism shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-white">
                        {feature.label}
                      </div>
                      <div className="text-xs text-white/60">
                        {feature.description}
                      </div>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-white/10" />
                </button>
              );
            })}
          </div>
        )}

        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              bottom: "50%",
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              borderRadius: "50%",
              opacity: particle.life,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}

        {/* Main Floating Button */}
        <button
          onClick={toggleMenu}
          className={`
            group relative
            w-16 h-16 rounded-full
            backdrop-blur-xl bg-white/10
            border-2 border-white/30
            shadow-2xl hover:shadow-white/20
            transition-all duration-300
            hover:scale-110 hover:bg-white/20
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
        >
          {/* Rotating gradient background */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-white/10 animate-spin-slow opacity-50" />

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            {isOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <Sparkles className="w-7 h-7 text-white animate-pulse" />
            )}
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Sparkle decorations */}
          {!isOpen && (
            <>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-75" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      <Dialog open={activeFeature === "lottery"} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-zoom-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Dices className="w-6 h-6 text-purple-400" />
              Daily Lottery
            </DialogTitle>
          </DialogHeader>
          <DailyLottery />
        </DialogContent>
      </Dialog>

      <Dialog open={activeFeature === "gift"} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-zoom-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Gift className="w-6 h-6 text-amber-400" />
              Daily Gift
            </DialogTitle>
          </DialogHeader>
          <DailyGift />
        </DialogContent>
      </Dialog>

      <Dialog open={activeFeature === "ai"} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-zoom-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Bot className="w-6 h-6 text-cyan-400" />
              AI Assistant - ARIA
            </DialogTitle>
          </DialogHeader>
          <AIChatInterface />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DailyFeaturesButton;
