/**
 * 🎰 COSMIC WHEEL OF FORTUNE - DAILY LOTTERY
 * Features: 3D Holographic Sphere, Quantum Number Generator, Epic Prize Animations
 */

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

type PrizeTier = "legendary" | "epic" | "rare" | "common";

interface Prize {
  tier: PrizeTier;
  name: string;
  amount: string;
  color: string;
  glow: string;
}

const prizes: Record<PrizeTier, Prize> = {
  legendary: {
    tier: "legendary",
    name: "LEGENDARY JACKPOT",
    amount: "10,000 LUM",
    color: "#FFD700",
    glow: "#FFA500",
  },
  epic: {
    tier: "epic",
    name: "EPIC PRIZE",
    amount: "5,000 LUM",
    color: "#9C27B0",
    glow: "#E040FB",
  },
  rare: {
    tier: "rare",
    name: "RARE REWARD",
    amount: "1,000 LUM",
    color: "#2196F3",
    glow: "#03A9F4",
  },
  common: {
    tier: "common",
    name: "COMMON PRIZE",
    amount: "100 LUM",
    color: "#C0C0C0",
    glow: "#E0E0E0",
  },
};

export function DailyLottery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");
  const [tickets, setTickets] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  // Calculate time until next lottery
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeUntilNext(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let rotation = 0;
    let sphereEnergy = 0;
    let pulsePhase = 0;

    // Draw holographic sphere
    const drawSphere = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pulsePhase += 0.05;
      const pulse = Math.sin(pulsePhase) * 0.2 + 1;

      // Outer glow
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        50,
        centerX,
        centerY,
        120 * pulse
      );
      glowGradient.addColorStop(0, "rgba(138, 43, 226, 0.3)");
      glowGradient.addColorStop(0.5, "rgba(75, 0, 130, 0.2)");
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Energy rings
      for (let i = 0; i < 3; i++) {
        const ringRotation = rotation + (i * (Math.PI * 2)) / 3;
        const ringRadius = 80 + i * 10;

        ctx.strokeStyle = `rgba(138, 43, 226, ${0.6 - i * 0.15})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          ringRadius,
          ringRadius * 0.3,
          ringRotation,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // Main sphere
      const sphereGradient = ctx.createRadialGradient(
        centerX - 20,
        centerY - 20,
        10,
        centerX,
        centerY,
        80
      );
      sphereGradient.addColorStop(0, "rgba(200, 150, 255, 0.9)");
      sphereGradient.addColorStop(0.5, "rgba(138, 43, 226, 0.7)");
      sphereGradient.addColorStop(1, "rgba(75, 0, 130, 0.5)");
      ctx.fillStyle = sphereGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Quantum grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 20) {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + lat, 80, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Vertical lines
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + rotation;
        const x1 = centerX + Math.cos(angle) * 80;
        const y1 = centerY - 80;
        const x2 = centerX + Math.cos(angle) * 80;
        const y2 = centerY + 80;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Energy particles
      if (isSpinning) {
        sphereEnergy += 0.1;
        for (let i = 0; i < 5; i++) {
          const particleAngle = rotation * 3 + (i * (Math.PI * 2)) / 5;
          const particleRadius = 80 + Math.sin(sphereEnergy + i) * 20;
          const px = centerX + Math.cos(particleAngle) * particleRadius;
          const py = centerY + Math.sin(particleAngle) * particleRadius;

          ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Winning numbers (if spinning)
      if (isSpinning) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const randomNum = Math.floor(Math.random() * 100);
        ctx.fillText(randomNum.toString(), centerX, centerY);
      }

      rotation += 0.02;

      // Update particles
      updateParticles(ctx);
    };

    // Update and draw particles
    const updateParticles = (ctx: CanvasRenderingContext2D) => {
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;
        ctx.fillStyle =
          p.color +
          Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Animation loop
    const animate = () => {
      drawSphere();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning]);

  // Create confetti explosion (ENHANCED - 150+ particles)
  const createConfetti = (prize: Prize) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const particles = particlesRef.current;

    // Main explosion burst (100 particles)
    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI * 2 * i) / 100;
      const speed = 5 + Math.random() * 5;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        life: 60 + Math.random() * 40,
        maxLife: 100,
        color: prize.color,
        size: 3 + Math.random() * 3,
      });
    }

    // Secondary sparkle burst (50 particles)
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 4;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        life: 40 + Math.random() * 30,
        maxLife: 70,
        color: prize.glow,
        size: 2 + Math.random() * 2,
      });
    }

    // Trailing stars (30 particles)
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 80 + Math.random() * 40,
        maxLife: 120,
        color: "#FFFFFF",
        size: 1 + Math.random() * 2,
      });
    }
  };

  // Spin the lottery
  const handleSpin = async () => {
    if (tickets <= 0 || isSpinning) return;

    setIsSpinning(true);
    setWonPrize(null);
    setShowConfetti(false);
    setTickets(tickets - 1);

    // Simulate spinning for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Determine prize (weighted random)
    const rand = Math.random();
    let prize: Prize;
    if (rand < 0.01) {
      prize = prizes.legendary;
    } else if (rand < 0.1) {
      prize = prizes.epic;
    } else if (rand < 0.3) {
      prize = prizes.rare;
    } else {
      prize = prizes.common;
    }

    setWonPrize(prize);
    setIsSpinning(false);
    setShowConfetti(true);
    createConfetti(prize);

    // Play sound effect (if available)
    // playSound('lottery-win');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="relative bg-black/40 backdrop-blur-xl border-purple-500/30 p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500 bg-clip-text text-transparent mb-2">
            🎰 COSMIC LOTTERY
          </h1>
          <p className="text-gray-400">Try your luck in the quantum realm!</p>
        </div>

        {/* Canvas */}
        <div className="flex justify-center mb-6">
          <canvas
            ref={canvasRef}
            className="rounded-lg"
            style={{
              background:
                "radial-gradient(circle, rgba(75,0,130,0.3) 0%, rgba(0,0,0,0.8) 100%)",
            }}
          />
        </div>

        {/* Prize Display (ENHANCED with tier-specific animations) */}
        {wonPrize && (
          <div
            className={`text-center mb-6 p-6 rounded-lg ${
              wonPrize.tier === "legendary"
                ? "animate-bounce"
                : wonPrize.tier === "epic"
                  ? "animate-pulse"
                  : "animate-pulse"
            }`}
            style={{
              background: `radial-gradient(circle, ${wonPrize.color}40 0%, transparent 70%)`,
              border: `3px solid ${wonPrize.color}`,
              boxShadow: `0 0 40px ${wonPrize.glow}, inset 0 0 20px ${wonPrize.color}40`,
              animation:
                wonPrize.tier === "legendary"
                  ? "bounce 0.5s infinite, pulse 1s infinite"
                  : wonPrize.tier === "epic"
                    ? "pulse 0.8s infinite"
                    : "pulse 1.2s infinite",
            }}
          >
            <div className="text-6xl mb-3 animate-spin-slow">
              {wonPrize.tier === "legendary"
                ? "👑"
                : wonPrize.tier === "epic"
                  ? "💜"
                  : wonPrize.tier === "rare"
                    ? "💎"
                    : "⭐"}
            </div>
            <h2
              className="text-4xl font-bold mb-3 tracking-wider"
              style={{
                color: wonPrize.color,
                textShadow: `0 0 30px ${wonPrize.glow}, 0 0 10px ${wonPrize.color}`,
                letterSpacing: "0.1em",
              }}
            >
              {wonPrize.name}
            </h2>
            <p
              className="text-3xl font-bold text-white"
              style={{
                textShadow: `0 0 20px ${wonPrize.glow}`,
              }}
            >
              {wonPrize.amount}
            </p>
            {wonPrize.tier === "legendary" && (
              <p className="text-yellow-300 text-sm mt-2 animate-pulse">
                🌟 JACKPOT! LEGENDARY WIN! 🌟
              </p>
            )}
            {wonPrize.tier === "epic" && (
              <p className="text-purple-300 text-sm mt-2 animate-pulse">
                ✨ EPIC PRIZE! ✨
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
            <p className="text-gray-400 text-sm">Tickets Remaining</p>
            <p className="text-2xl font-bold text-purple-400">{tickets}</p>
          </div>
          <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
            <p className="text-gray-400 text-sm">Next Reset</p>
            <p className="text-2xl font-bold text-blue-400">{timeUntilNext}</p>
          </div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={handleSpin}
          disabled={tickets <= 0 || isSpinning}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 hover:from-purple-700 hover:via-pink-700 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          style={{
            boxShadow: isSpinning ? "0 0 30px rgba(138, 43, 226, 0.8)" : "none",
          }}
        >
          {isSpinning ? (
            <span className="animate-pulse">🌀 SPINNING...</span>
          ) : tickets > 0 ? (
            "🎲 SPIN THE WHEEL"
          ) : (
            "🕐 COME BACK TOMORROW"
          )}
        </Button>

        {/* Prize Tiers */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {Object.values(prizes).map((prize) => (
            <div
              key={prize.tier}
              className="p-3 rounded-lg border"
              style={{
                background: `${prize.color}10`,
                borderColor: `${prize.color}40`,
              }}
            >
              <p className="text-xs text-gray-400">
                {prize.tier.toUpperCase()}
              </p>
              <p className="text-sm font-bold" style={{ color: prize.color }}>
                {prize.amount}
              </p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🎫 Get 3 free tickets daily</p>
          <p>✨ Higher tiers have lower chances</p>
          <p>🌟 Legendary: 1% | Epic: 9% | Rare: 20% | Common: 70%</p>
        </div>
      </Card>
    </div>
  );
}
