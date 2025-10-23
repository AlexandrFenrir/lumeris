/**
 * 🎁 TREASURE ASTEROID - DAILY GIFT
 * Features: Rotating Asteroid, Mining Laser, Crystal Veins, Epic Reward Reveal
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

interface Reward {
  type: "crypto" | "nft" | "powerup" | "multiplier";
  name: string;
  amount: string;
  icon: string;
  color: string;
  glow: string;
}

const rewards: Reward[] = [
  {
    type: "crypto",
    name: "LUM Tokens",
    amount: "500",
    icon: "💰",
    color: "#FFD700",
    glow: "#FFA500",
  },
  {
    type: "nft",
    name: "NFT Fragment",
    amount: "1x Rare",
    icon: "💎",
    color: "#9C27B0",
    glow: "#E040FB",
  },
  {
    type: "powerup",
    name: "Energy Orb",
    amount: "3x Boost",
    icon: "⚡",
    color: "#2196F3",
    glow: "#03A9F4",
  },
  {
    type: "multiplier",
    name: "Star Crystal",
    amount: "2x Multiplier",
    icon: "⭐",
    color: "#00FF00",
    glow: "#00FF88",
  },
];

export function DailyGift() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMining, setIsMining] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const [streak, setStreak] = useState(7);
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  // Calculate time until next gift
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
    let crackProgress = 0;
    let laserIntensity = 0;

    // Draw asteroid
    const drawAsteroid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Space background with stars
      for (let i = 0; i < 50; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 73) % canvas.height;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Asteroid glow
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        60,
        centerX,
        centerY,
        120
      );
      glowGradient.addColorStop(0, "rgba(139, 69, 19, 0.3)");
      glowGradient.addColorStop(0.5, "rgba(160, 82, 45, 0.2)");
      glowGradient.addColorStop(1, "transparent");
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
      ctx.fill();

      // Main asteroid body (irregular shape)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      const asteroidGradient = ctx.createRadialGradient(-20, -20, 10, 0, 0, 80);
      asteroidGradient.addColorStop(0, "#8B7355");
      asteroidGradient.addColorStop(0.5, "#654321");
      asteroidGradient.addColorStop(1, "#3E2723");
      ctx.fillStyle = asteroidGradient;

      // Draw irregular asteroid shape
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const radius = 70 + Math.sin(i * 2.5) * 15;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Crystal veins (glowing)
      const crystalColors = ["#00FFFF", "#FF00FF", "#FFFF00", "#00FF00"];
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + rotation * 0.5;
        const startRadius = 20;
        const endRadius = 70;
        const x1 = Math.cos(angle) * startRadius;
        const y1 = Math.sin(angle) * startRadius;
        const x2 = Math.cos(angle) * endRadius;
        const y2 = Math.sin(angle) * endRadius;

        const veinGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const color = crystalColors[i % crystalColors.length];
        veinGradient.addColorStop(0, color + "00");
        veinGradient.addColorStop(0.5, color + "AA");
        veinGradient.addColorStop(1, color + "00");

        ctx.strokeStyle = veinGradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Crystal glow points
        ctx.fillStyle = color + "CC";
        ctx.beginPath();
        ctx.arc(x2, y2, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Craters
      const craters = [
        { x: 30, y: -20, r: 8 },
        { x: -40, y: 15, r: 12 },
        { x: 10, y: 35, r: 6 },
        { x: -20, y: -30, r: 10 },
      ];

      craters.forEach((crater) => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.arc(crater.x, crater.y, crater.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cracks (if mining)
      if (isMining && crackProgress > 0) {
        ctx.strokeStyle = `rgba(255, 100, 0, ${crackProgress})`;
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6;
          const length = 60 * crackProgress;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
          ctx.stroke();
        }
      }

      ctx.restore();

      // Mining laser
      if (isMining) {
        laserIntensity = (laserIntensity + 0.1) % (Math.PI * 2);
        const alpha = 0.5 + Math.sin(laserIntensity) * 0.3;

        // Laser beam
        const laserGradient = ctx.createLinearGradient(
          centerX,
          centerY - 150,
          centerX,
          centerY
        );
        laserGradient.addColorStop(0, `rgba(255, 0, 0, ${alpha * 0.5})`);
        laserGradient.addColorStop(1, `rgba(255, 100, 0, ${alpha})`);

        ctx.strokeStyle = laserGradient;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 150);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();

        // Laser glow
        ctx.strokeStyle = `rgba(255, 200, 0, ${alpha * 0.3})`;
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 150);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();

        // Impact sparks
        for (let i = 0; i < 5; i++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkLength = 20 + Math.random() * 20;
          const sx = centerX + Math.cos(sparkAngle) * sparkLength;
          const sy = centerY + Math.sin(sparkAngle) * sparkLength;

          ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }

        crackProgress = Math.min(1, crackProgress + 0.02);
      }

      // Gift box (if opened)
      if (isOpening && reward) {
        ctx.save();
        ctx.translate(centerX, centerY);

        // Gift box glow
        const giftGlow = ctx.createRadialGradient(0, 0, 30, 0, 0, 80);
        giftGlow.addColorStop(0, reward.color + "80");
        giftGlow.addColorStop(0.5, reward.color + "40");
        giftGlow.addColorStop(1, "transparent");
        ctx.fillStyle = giftGlow;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.fill();

        // Gift box
        ctx.fillStyle = reward.color;
        ctx.fillRect(-40, -40, 80, 80);

        // Ribbon
        ctx.fillStyle = reward.glow;
        ctx.fillRect(-5, -40, 10, 80);
        ctx.fillRect(-40, -5, 80, 10);

        // Icon
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(reward.icon, 0, 0);

        ctx.restore();
      }

      rotation += 0.01;

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
        p.vy += 0.1; // Gravity
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
      drawAsteroid();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMining, isOpening, reward]);

  // Create explosion particles (ENHANCED - 150+ particles with crystal shards)
  const createExplosion = (reward: Reward) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const particles = particlesRef.current;

    // Main asteroid debris (80 particles)
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80;
      const speed = 3 + Math.random() * 4;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        life: 50 + Math.random() * 30,
        maxLife: 80,
        color: reward.color,
        size: 2 + Math.random() * 3,
      });
    }

    // Crystal shards (40 particles)
    const crystalColors = ["#00FFFF", "#FF00FF", "#FFFF00", "#00FF00"];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 5;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        life: 60 + Math.random() * 40,
        maxLife: 100,
        color: crystalColors[i % crystalColors.length],
        size: 3 + Math.random() * 4,
      });
    }

    // Reward sparkles (50 particles)
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 70 + Math.random() * 50,
        maxLife: 120,
        color: reward.glow,
        size: 1 + Math.random() * 2,
      });
    }
  };

  // Claim gift
  const handleClaim = async () => {
    if (claimed) return;

    // Start mining animation
    setIsMining(true);

    // Mining takes 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Select random reward
    const selectedReward = rewards[Math.floor(Math.random() * rewards.length)];
    setReward(selectedReward);

    // Stop mining, start opening
    setIsMining(false);
    setIsOpening(true);

    // Create explosion
    createExplosion(selectedReward);

    // Mark as claimed
    setClaimed(true);
    setStreak(streak + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="relative bg-black/40 backdrop-blur-xl border-cyan-500/30 p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-2">
            🎁 TREASURE ASTEROID
          </h1>
          <p className="text-gray-400">
            Mine your daily rewards from the cosmos!
          </p>
        </div>

        {/* Canvas */}
        <div className="flex justify-center mb-6">
          <canvas
            ref={canvasRef}
            className="rounded-lg"
            style={{
              background:
                "radial-gradient(circle, rgba(0,20,40,0.8) 0%, rgba(0,0,0,0.9) 100%)",
            }}
          />
        </div>

        {/* Reward Display (ENHANCED with type-specific effects) */}
        {reward && (
          <div
            className="text-center mb-6 p-8 rounded-lg animate-bounce relative overflow-hidden"
            style={{
              background: `radial-gradient(circle, ${reward.color}50 0%, ${reward.color}20 50%, transparent 100%)`,
              border: `3px solid ${reward.color}`,
              boxShadow: `0 0 40px ${reward.glow}, inset 0 0 30px ${reward.color}30`,
            }}
          >
            {/* Animated background effect */}
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${reward.color}30 0%, transparent 70%)`,
                animation: "pulse 2s infinite",
              }}
            />

            <div className="relative z-10">
              <div
                className="text-7xl mb-3 inline-block"
                style={{
                  animation: "bounce 1s infinite, spin 3s linear infinite",
                  filter: `drop-shadow(0 0 20px ${reward.glow})`,
                }}
              >
                {reward.icon}
              </div>
              <h2
                className="text-3xl font-bold mb-3 tracking-wide"
                style={{
                  color: reward.color,
                  textShadow: `0 0 30px ${reward.glow}, 0 0 15px ${reward.color}, 0 0 5px ${reward.color}`,
                  letterSpacing: "0.1em",
                }}
              >
                {reward.name}
              </h2>
              <p
                className="text-2xl font-bold text-white mb-2"
                style={{
                  textShadow: `0 0 20px ${reward.glow}`,
                }}
              >
                {reward.amount}
              </p>
              <p
                className="text-sm animate-pulse"
                style={{
                  color: reward.color,
                  textShadow: `0 0 10px ${reward.glow}`,
                }}
              >
                ✨ {reward.type.toUpperCase()} REWARD CLAIMED! ✨
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-cyan-900/30 p-4 rounded-lg border border-cyan-500/30">
            <p className="text-gray-400 text-sm">Daily Streak</p>
            <p className="text-2xl font-bold text-cyan-400">🔥 {streak} Days</p>
          </div>
          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
            <p className="text-gray-400 text-sm">Next Gift</p>
            <p className="text-2xl font-bold text-purple-400">
              {timeUntilNext}
            </p>
          </div>
        </div>

        {/* Claim Button */}
        <Button
          onClick={handleClaim}
          disabled={claimed || isMining}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          style={{
            boxShadow: isMining ? "0 0 30px rgba(0, 255, 255, 0.8)" : "none",
          }}
        >
          {isMining ? (
            <span className="animate-pulse">⚡ MINING...</span>
          ) : claimed ? (
            "✅ CLAIMED - COME BACK TOMORROW"
          ) : (
            "💎 MINE DAILY GIFT"
          )}
        </Button>

        {/* Streak Rewards */}
        <div className="mt-6">
          <h3 className="text-center text-lg font-bold text-gray-300 mb-3">
            🌟 Streak Bonuses
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[3, 7, 14, 30].map((days) => (
              <div
                key={days}
                className={`p-3 rounded-lg border text-center ${
                  streak >= days
                    ? "bg-green-900/30 border-green-500/50"
                    : "bg-gray-900/30 border-gray-500/30"
                }`}
              >
                <p className="text-xs text-gray-400">{days} Days</p>
                <p className="text-lg">{streak >= days ? "✅" : "🔒"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Possible Rewards */}
        <div className="mt-6">
          <h3 className="text-center text-sm font-bold text-gray-400 mb-3">
            Possible Rewards
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {rewards.map((r) => (
              <div
                key={r.type}
                className="p-2 rounded-lg border text-center"
                style={{
                  background: `${r.color}10`,
                  borderColor: `${r.color}40`,
                }}
              >
                <div className="text-2xl">{r.icon}</div>
                <p className="text-xs mt-1" style={{ color: r.color }}>
                  {r.type.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
