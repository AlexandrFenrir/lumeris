import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Bitcoin,
  TrendingUp,
  TrendingDown,
  Trophy,
  Zap,
  Shield,
  Star,
} from "lucide-react";

interface BitcoinMountainScoreProps {
  onPrediction?: (correct: boolean) => void;
}

interface ScoreState {
  altitude: number; // 0-100%
  score: number;
  streak: number;
  level: number;
  multiplier: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: "coin" | "star" | "sparkle";
}

const TIERS = [
  { name: "Base Camp", min: 0, max: 20, color: "#8B7355", multiplier: 1 },
  { name: "Forest Trail", min: 20, max: 40, color: "#2D5016", multiplier: 1.5 },
  { name: "Rocky Path", min: 40, max: 60, color: "#696969", multiplier: 2 },
  { name: "Snow Line", min: 60, max: 80, color: "#B0E0E6", multiplier: 3 },
  { name: "Summit Push", min: 80, max: 95, color: "#4169E1", multiplier: 5 },
  { name: "Bitcoin Peak", min: 95, max: 100, color: "#FFD700", multiplier: 10 },
];

export const BitcoinMountainScore = ({
  onPrediction,
}: BitcoinMountainScoreProps) => {
  const [score, setScore] = useState<ScoreState>({
    altitude: 0,
    score: 0,
    streak: 0,
    level: 1,
    multiplier: 1,
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const getCurrentTier = () => {
    return (
      TIERS.find((t) => score.altitude >= t.min && score.altitude < t.max) ||
      TIERS[0]
    );
  };

  const createParticles = (
    count: number,
    x: number,
    y: number,
    type: "coin" | "star" | "sparkle"
  ) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 3;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 60 + Math.random() * 40,
        color:
          type === "coin" ? "#FFD700" : type === "star" ? "#FFA500" : "#FFFFFF",
        size: type === "coin" ? 6 : 4,
        type,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const handlePrediction = (correct: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    if (correct) {
      // Correct prediction - climb up!
      const boost = 5 * (1 + score.streak * 0.1);
      const newAltitude = Math.min(100, score.altitude + boost);
      const tier = getCurrentTier();
      const scoreGain = Math.floor(boost * 100 * tier.multiplier);

      setScore((prev) => ({
        ...prev,
        altitude: newAltitude,
        score: prev.score + scoreGain,
        streak: prev.streak + 1,
        multiplier: tier.multiplier,
      }));

      // Create celebration particles
      createParticles(20, centerX, centerY, "coin");
      createParticles(15, centerX, centerY, "star");

      // Check for summit
      if (newAltitude >= 95 && score.altitude < 95) {
        setShowCelebration(true);
        createParticles(100, centerX, centerY, "sparkle");
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } else {
      // Wrong prediction - fall down
      const fall = 3;
      const newAltitude = Math.max(0, score.altitude - fall);

      setScore((prev) => ({
        ...prev,
        altitude: newAltitude,
        streak: 0,
      }));

      // Small particle effect
      createParticles(5, centerX, centerY, "sparkle");
    }

    if (onPrediction) {
      onPrediction(correct);
    }
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Bitcoin mountain
      drawMountain(ctx, canvas.width, canvas.height);

      // Update and draw particles
      setParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // gravity
            life: p.life - 1 / p.maxLife,
          }))
          .filter((p) => p.life > 0);

        updated.forEach((p) => {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.globalAlpha = 1;
        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [score.altitude]);

  const drawMountain = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const baseY = height - 20;
    const peakY = 40;
    const tier = getCurrentTier();

    // Mountain shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.moveTo(centerX - 120, baseY);
    ctx.lineTo(centerX, peakY + 10);
    ctx.lineTo(centerX + 120, baseY);
    ctx.closePath();
    ctx.fill();

    // Main mountain with gradient
    const gradient = ctx.createLinearGradient(centerX, baseY, centerX, peakY);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(0.3, "#2d2d44");
    gradient.addColorStop(0.6, tier.color + "60");
    gradient.addColorStop(1, tier.color);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, baseY);
    ctx.lineTo(centerX, peakY);
    ctx.lineTo(centerX + 100, baseY);
    ctx.closePath();
    ctx.fill();

    // Bitcoin at peak
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("₿", centerX, peakY - 10);

    // Climber position (Bitcoin icon)
    const climberY = baseY - (score.altitude / 100) * (baseY - peakY);
    ctx.save();
    ctx.shadowColor = tier.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = tier.color;
    ctx.font = "bold 20px Arial";
    ctx.fillText("₿", centerX, climberY);
    ctx.restore();

    // Altitude markers
    for (let i = 0; i <= 100; i += 20) {
      const markerY = baseY - (i / 100) * (baseY - peakY);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - 110, markerY);
      ctx.lineTo(centerX + 110, markerY);
      ctx.stroke();

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "10px Arial";
      ctx.textAlign = "right";
      ctx.fillText(`${i}%`, centerX - 115, markerY + 3);
    }
  };

  return (
    <div className="relative">
      {/* Summit Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 rounded-lg animate-fade-in">
          <div className="text-center space-y-4 animate-summit-celebration">
            <Trophy className="w-20 h-20 mx-auto text-yellow-400" />
            <h2 className="text-4xl font-bold gradient-gold bg-clip-text text-transparent">
              SUMMIT REACHED!
            </h2>
            <p className="text-2xl text-white">
              Score: {score.score.toLocaleString()}
            </p>
            <p className="text-lg text-yellow-400">10x Multiplier Unlocked!</p>
          </div>
        </div>
      )}

      <Card className="glass-card border-yellow-500/30 relative overflow-hidden">
        <CardContent className="p-4">
          {/* Header Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center">
              <div className="text-xs text-foreground/60">Altitude</div>
              <div
                className="text-lg font-bold"
                style={{ color: getCurrentTier().color }}
              >
                {score.altitude.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-foreground/60">Score</div>
              <div className="text-lg font-bold text-yellow-400">
                {score.score.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-foreground/60">Streak</div>
              <div className="text-lg font-bold text-orange-400">
                {score.streak}🔥
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-foreground/60">Multiplier</div>
              <div className="text-lg font-bold text-purple-400">
                {getCurrentTier().multiplier}x
              </div>
            </div>
          </div>

          {/* Mountain Canvas */}
          <div className="relative bg-gradient-to-b from-blue-900/20 to-purple-900/20 rounded-lg border border-white/10 mb-4">
            <canvas
              ref={canvasRef}
              width={400}
              height={250}
              className="w-full h-auto"
            />
          </div>

          {/* Current Tier */}
          <div className="mb-4 p-3 rounded-lg glass-card border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-foreground/60">Current Tier</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: getCurrentTier().color }}
                >
                  {getCurrentTier().name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-foreground/60">Next Tier</div>
                <div className="text-sm font-medium text-foreground/80">
                  {score.altitude < 100
                    ? `${(TIERS.find((t) => t.min > score.altitude)?.min || 100) - score.altitude.toFixed(0)}% to go`
                    : "MAX LEVEL"}
                </div>
              </div>
            </div>
            <Progress value={score.altitude} className="h-2 mt-2" />
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => handlePrediction(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Correct Prediction
            </Button>
            <Button
              onClick={() => handlePrediction(false)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Wrong Prediction
            </Button>
          </div>

          {/* Info */}
          <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-start gap-2">
              <Bitcoin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-foreground/80">
                <strong>How to Play:</strong> Make correct trading predictions
                to climb the Bitcoin Mountain! Each correct prediction moves you
                up {getCurrentTier().multiplier}x faster. Reach the summit for
                maximum rewards!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
