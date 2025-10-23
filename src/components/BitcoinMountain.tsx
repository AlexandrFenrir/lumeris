import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Mountain,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Rocket,
  Eye,
  Star,
  Trophy,
  Crown,
  Sparkles,
  CloudSnow,
  CloudRain,
  Sun,
  CloudLightning,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

interface ClimberState {
  altitude: number; // 0-100%
  position: { x: number; y: number };
  velocity: number;
  streak: number;
  score: number;
  level: number;
}

interface MountainParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: "snow" | "rock" | "coin" | "star" | "lightning" | "sparkle" | "trail";
  rotation?: number;
  rotationSpeed?: number;
}

interface PowerUp {
  id: string;
  name: string;
  icon: string;
  description: string;
  duration: number;
  active: boolean;
  cooldown: number;
}

type WeatherType = "sunny" | "cloudy" | "storm" | "blizzard";

interface RewardTier {
  name: string;
  minAltitude: number;
  maxAltitude: number;
  color: string;
  icon: string;
  reward: string;
  multiplier: number;
}

interface LeaderboardEntry {
  rank: number;
  player: string;
  altitude: number;
  score: number;
  badge: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const REWARD_TIERS: RewardTier[] = [
  {
    name: "Base Camp",
    minAltitude: 0,
    maxAltitude: 20,
    color: "#8B4513",
    icon: "🏕️",
    reward: "10 LUMERIS/day",
    multiplier: 1,
  },
  {
    name: "Rocky Path",
    minAltitude: 20,
    maxAltitude: 40,
    color: "#696969",
    icon: "⛰️",
    reward: "50 LUMERIS/day",
    multiplier: 1.5,
  },
  {
    name: "Golden Veins",
    minAltitude: 40,
    maxAltitude: 60,
    color: "#FFD700",
    icon: "✨",
    reward: "150 LUMERIS + Common NFT",
    multiplier: 2,
  },
  {
    name: "Crystal Zone",
    minAltitude: 60,
    maxAltitude: 80,
    color: "#00CED1",
    icon: "💎",
    reward: "500 LUMERIS + Rare NFT",
    multiplier: 3,
  },
  {
    name: "Aurora Peak",
    minAltitude: 80,
    maxAltitude: 95,
    color: "#9370DB",
    icon: "🌌",
    reward: "1,500 LUMERIS + Epic NFT",
    multiplier: 5,
  },
  {
    name: "Bitcoin Summit",
    minAltitude: 95,
    maxAltitude: 100,
    color: "#FF6B35",
    icon: "👑",
    reward: "5,000 LUMERIS + Legendary NFT",
    multiplier: 10,
  },
];

const INITIAL_POWERUPS: PowerUp[] = [
  {
    id: "rocket",
    name: "Rocket Boost",
    icon: "🚀",
    description: "Jump +20% altitude instantly",
    duration: 0,
    active: false,
    cooldown: 0,
  },
  {
    id: "shield",
    name: "Safety Net",
    icon: "🛡️",
    description: "Prevent next fall",
    duration: 30000,
    active: false,
    cooldown: 0,
  },
  {
    id: "oracle",
    name: "Oracle Vision",
    icon: "🔮",
    description: "Reveal next signal early",
    duration: 15000,
    active: false,
    cooldown: 0,
  },
  {
    id: "lightning",
    name: "Lightning Speed",
    icon: "⚡",
    description: "2x climb speed for 5 min",
    duration: 300000,
    active: false,
    cooldown: 0,
  },
];

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    player: "CryptoKing",
    altitude: 98.5,
    score: 125840,
    badge: "🏔️ Summit Master",
  },
  {
    rank: 2,
    player: "NFTMaster",
    altitude: 95.2,
    score: 118920,
    badge: "👑 Peak Conqueror",
  },
  {
    rank: 3,
    player: "GameLord",
    altitude: 87.8,
    score: 112450,
    badge: "🌟 Aurora Climber",
  },
  {
    rank: 4,
    player: "PixelHero",
    altitude: 76.3,
    score: 98760,
    badge: "💎 Crystal Explorer",
  },
  {
    rank: 5,
    player: "MetaGamer",
    altitude: 65.1,
    score: 87230,
    badge: "✨ Gold Seeker",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const BitcoinMountain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // State
  const [climber, setClimber] = useState<ClimberState>({
    altitude: 0,
    position: { x: 400, y: 500 },
    velocity: 0,
    streak: 0,
    score: 0,
    level: 1,
  });

  const [weather, setWeather] = useState<WeatherType>("sunny");
  const [particles, setParticles] = useState<MountainParticle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>(INITIAL_POWERUPS);
  const [showCelebration, setShowCelebration] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isClimbing, setIsClimbing] = useState(false);

  // Get current tier
  const getCurrentTier = (): RewardTier => {
    return (
      REWARD_TIERS.find(
        (tier) =>
          climber.altitude >= tier.minAltitude &&
          climber.altitude <= tier.maxAltitude
      ) || REWARD_TIERS[0]
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PARTICLE SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  const createParticles = (
    type: MountainParticle["type"],
    count: number,
    x: number,
    y: number
  ) => {
    const newParticles: MountainParticle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed =
        type === "coin" ? 3 + Math.random() * 4 : 2 + Math.random() * 3;

      let color = "#FFFFFF";
      let size = 3;

      switch (type) {
        case "snow":
          color = "#FFFFFF";
          size = 2 + Math.random() * 3;
          break;
        case "rock":
          color = "#8B7355";
          size = 4 + Math.random() * 6;
          break;
        case "coin":
          color = "#FFD700";
          size = 6 + Math.random() * 4;
          break;
        case "star":
          color = "#FFD700";
          size = 4 + Math.random() * 4;
          break;
        case "lightning":
          color = "#00FFFF";
          size = 3 + Math.random() * 5;
          break;
        case "sparkle":
          color = `hsl(${Math.random() * 360}, 100%, 70%)`;
          size = 2 + Math.random() * 3;
          break;
        case "trail":
          color = "#FFD700";
          size = 3;
          break;
      }

      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === "coin" ? 5 : 2),
        life: 1,
        maxLife: type === "trail" ? 0.5 : 1,
        size,
        color,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const createWeatherParticles = (canvas: HTMLCanvasElement) => {
    const particleCount =
      weather === "blizzard" ? 150 : weather === "storm" ? 100 : 50;

    for (let i = 0; i < 5; i++) {
      // Add particles gradually
      const x = Math.random() * canvas.width;
      const y = -10;

      let type: MountainParticle["type"] = "snow";
      let color = "#FFFFFF";
      let size = 2 + Math.random() * 3;
      let vx = (Math.random() - 0.5) * 2;
      let vy = 2 + Math.random() * 3;

      if (weather === "storm" && Math.random() < 0.1) {
        type = "lightning";
        color = "#00FFFF";
        size = 3 + Math.random() * 5;
        vy = 10 + Math.random() * 10;
      } else if (weather === "cloudy") {
        color = "#CCCCCC";
        vy = 1 + Math.random() * 2;
      } else if (weather === "blizzard") {
        vx = (Math.random() - 0.5) * 6;
        vy = 4 + Math.random() * 4;
      }

      setParticles((prev) => [
        ...prev.slice(-particleCount),
        {
          x,
          y,
          vx,
          vy,
          life: 1,
          maxLife: 1,
          size,
          color,
          type,
          rotation: 0,
          rotationSpeed: 0,
        },
      ]);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CLIMBING MECHANICS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleClimb = (success: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsClimbing(true);

    if (success) {
      // Successful climb
      const boost =
        5 * (powerUps.find((p) => p.id === "lightning")?.active ? 2 : 1);
      const newAltitude = Math.min(100, climber.altitude + boost);
      const scoreGain = Math.floor(boost * 100 * getCurrentTier().multiplier);

      setClimber((prev) => ({
        ...prev,
        altitude: newAltitude,
        streak: prev.streak + 1,
        score: prev.score + scoreGain,
      }));

      // Create success particles
      createParticles("coin", 30, climber.position.x, climber.position.y);
      createParticles("star", 20, climber.position.x, climber.position.y);
      createParticles("sparkle", 40, climber.position.x, climber.position.y);

      // Check for summit
      if (newAltitude >= 95 && climber.altitude < 95) {
        triggerSummitCelebration();
      }
    } else {
      // Failed climb - check for shield
      const hasShield = powerUps.find((p) => p.id === "shield")?.active;

      if (hasShield) {
        // Shield absorbs the fall
        setPowerUps((prev) =>
          prev.map((p) => (p.id === "shield" ? { ...p, active: false } : p))
        );
        createParticles("sparkle", 30, climber.position.x, climber.position.y);
      } else {
        // Fall down
        const fall = 3;
        const newAltitude = Math.max(0, climber.altitude - fall);

        setClimber((prev) => ({
          ...prev,
          altitude: newAltitude,
          streak: 0,
        }));

        // Create fall particles
        createParticles("rock", 40, climber.position.x, climber.position.y);
      }
    }

    setTimeout(() => setIsClimbing(false), 1000);
  };

  const usePowerUp = (powerUpId: string) => {
    const powerUp = powerUps.find((p) => p.id === powerUpId);
    if (!powerUp || powerUp.active || powerUp.cooldown > 0) return;

    if (powerUpId === "rocket") {
      // Instant altitude boost
      const boost = 20;
      const newAltitude = Math.min(100, climber.altitude + boost);

      setClimber((prev) => ({
        ...prev,
        altitude: newAltitude,
      }));

      createParticles("sparkle", 80, climber.position.x, climber.position.y);
      createParticles("star", 40, climber.position.x, climber.position.y);

      // Set cooldown
      setPowerUps((prev) =>
        prev.map((p) => (p.id === powerUpId ? { ...p, cooldown: 60000 } : p))
      );
    } else {
      // Activate timed power-up
      setPowerUps((prev) =>
        prev.map((p) => (p.id === powerUpId ? { ...p, active: true } : p))
      );

      // Deactivate after duration
      setTimeout(() => {
        setPowerUps((prev) =>
          prev.map((p) =>
            p.id === powerUpId
              ? { ...p, active: false, cooldown: p.duration }
              : p
          )
        );
      }, powerUp.duration);
    }
  };

  const triggerSummitCelebration = () => {
    setShowCelebration(true);

    // Create massive particle explosion
    const canvas = canvasRef.current;
    if (canvas) {
      createParticles("coin", 100, canvas.width / 2, canvas.height / 2);
      createParticles("star", 80, canvas.width / 2, canvas.height / 2);
      createParticles("sparkle", 120, canvas.width / 2, canvas.height / 2);
    }

    setTimeout(() => setShowCelebration(false), 5000);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CANVAS RENDERING
  // ═══════════════════════════════════════════════════════════════════════════

  const drawMountain = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const baseY = height - 50;
    const peakY = 50;
    const baseWidth = 400;

    // Mountain rotation effect
    const rotationOffset = Math.sin(rotation) * 20;

    // Draw mountain layers with altitude-based colors
    const tier = getCurrentTier();

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.moveTo(centerX - baseWidth / 2 + rotationOffset, baseY);
    ctx.lineTo(centerX + rotationOffset, peakY);
    ctx.lineTo(centerX + baseWidth / 2 + rotationOffset, baseY);
    ctx.closePath();
    ctx.fill();

    // Main mountain with gradient based on tier
    const gradient = ctx.createLinearGradient(centerX, baseY, centerX, peakY);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(0.2, "#2d2d44");
    gradient.addColorStop(0.4, tier.color + "40");
    gradient.addColorStop(0.6, tier.color + "60");
    gradient.addColorStop(0.8, tier.color + "80");
    gradient.addColorStop(1, tier.color);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX - baseWidth / 2, baseY);
    ctx.lineTo(centerX, peakY);
    ctx.lineTo(centerX + baseWidth / 2, baseY);
    ctx.closePath();
    ctx.fill();

    // Draw altitude markers
    for (let i = 0; i <= 100; i += 20) {
      const y = baseY - ((baseY - peakY) * i) / 100;
      const markerTier = REWARD_TIERS.find(
        (t) => i >= t.minAltitude && i <= t.maxAltitude
      );

      if (markerTier) {
        // Marker line
        ctx.strokeStyle = markerTier.color + "80";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 50, y);
        ctx.lineTo(centerX + 50, y);
        ctx.stroke();

        // Marker label
        ctx.fillStyle = markerTier.color;
        ctx.font = "12px monospace";
        ctx.textAlign = "right";
        ctx.fillText(`${i}%`, centerX - 60, y + 4);

        // Tier icon
        ctx.font = "16px monospace";
        ctx.textAlign = "left";
        ctx.fillText(markerTier.icon, centerX + 60, y + 4);
      }
    }

    // Draw Bitcoin symbol at peak
    if (climber.altitude >= 95) {
      ctx.save();
      ctx.translate(centerX, peakY - 30);
      ctx.rotate(rotation * 2);

      // Glowing effect
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 30;

      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FFD700";
      ctx.fillText("₿", 0, 0);

      ctx.restore();
    }
  };

  const drawClimber = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const centerX = width / 2;
    const baseY = height - 50;
    const peakY = 50;

    // Calculate climber position based on altitude
    const y = baseY - ((baseY - peakY) * climber.altitude) / 100;
    const x = centerX + Math.sin(rotation) * 10;

    // Update climber position
    setClimber((prev) => ({ ...prev, position: { x, y } }));

    // Draw trail
    if (isClimbing) {
      createParticles("trail", 3, x, y);
    }

    // Draw climber glow
    ctx.shadowColor = getCurrentTier().color;
    ctx.shadowBlur = 20;

    // Draw climber
    ctx.fillStyle = getCurrentTier().color;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw climber outline
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw power-up effects
    powerUps.forEach((powerUp) => {
      if (powerUp.active) {
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.fillText(powerUp.icon, x, y - 20);
      }
    });
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particles.forEach((particle) => {
      ctx.save();

      // Set particle style
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;

      if (particle.type === "star") {
        // Draw star
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation || 0);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x = Math.cos(angle) * particle.size;
          const y = Math.sin(angle) * particle.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else if (particle.type === "lightning") {
        // Draw lightning bolt
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + Math.random() * 10 - 5, particle.y + 20);
        ctx.lineTo(particle.x + Math.random() * 10 - 5, particle.y + 40);
        ctx.stroke();
      } else {
        // Draw circle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  };

  const updateParticles = (canvas: HTMLCanvasElement) => {
    setParticles((prev) =>
      prev
        .map((particle) => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.2, // Gravity
          life: particle.life - 0.01 / particle.maxLife,
          rotation: (particle.rotation || 0) + (particle.rotationSpeed || 0),
        }))
        .filter(
          (particle) =>
            particle.life > 0 &&
            particle.y < canvas.height + 50 &&
            particle.x > -50 &&
            particle.x < canvas.width + 50
        )
    );
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, "#0a0a1a");
    bgGradient.addColorStop(0.5, "#1a1a2e");
    bgGradient.addColorStop(1, "#2d2d44");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw mountain
    drawMountain(ctx, canvas.width, canvas.height);

    // Draw particles
    drawParticles(ctx);

    // Draw climber
    drawClimber(ctx, canvas.width, canvas.height);

    // Update particles
    updateParticles(canvas);

    // Create weather particles
    if (weather !== "sunny") {
      createWeatherParticles(canvas);
    }

    // Update rotation
    setRotation((prev) => prev + 0.01);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 600;

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [weather, climber.altitude, isClimbing]);

  // Update power-up cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerUps((prev) =>
        prev.map((p) => ({
          ...p,
          cooldown: Math.max(0, p.cooldown - 1000),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Random weather changes
  useEffect(() => {
    const interval = setInterval(() => {
      const weathers: WeatherType[] = ["sunny", "cloudy", "storm", "blizzard"];
      const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
      setWeather(newWeather);
    }, 30000); // Change every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  const currentTier = getCurrentTier();

  const getWeatherIcon = () => {
    switch (weather) {
      case "sunny":
        return <Sun className="w-5 h-5 text-yellow-400" />;
      case "cloudy":
        return <CloudRain className="w-5 h-5 text-gray-400" />;
      case "storm":
        return <CloudLightning className="w-5 h-5 text-cyan-400" />;
      case "blizzard":
        return <CloudSnow className="w-5 h-5 text-blue-400" />;
    }
  };

  const getWeatherMultiplier = () => {
    switch (weather) {
      case "sunny":
        return 1;
      case "cloudy":
        return 1.2;
      case "storm":
        return 2;
      case "blizzard":
        return 3;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summit Celebration */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Card className="glass-card-gold border-4 border-yellow-400 max-w-2xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="text-8xl animate-bounce">👑</div>
              <h2 className="text-5xl font-bold text-gradient-gold text-glow-gold">
                SUMMIT CONQUERED!
              </h2>
              <p className="text-2xl text-foreground/80">
                You've reached the Bitcoin Summit!
              </p>
              <div className="text-6xl font-bold text-gradient-gold">
                {climber.score.toLocaleString()} Points
              </div>
              <div className="text-xl text-foreground/60">
                {currentTier.reward}
              </div>
              <Button
                onClick={() => setShowCelebration(false)}
                className="btn-gold text-xl px-8 py-6"
              >
                Continue Climbing
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <Mountain className="w-6 h-6 mx-auto mb-2 text-gradient-silver" />
            <div className="text-2xl font-bold text-gradient-silver">
              {climber.altitude.toFixed(1)}%
            </div>
            <div className="text-sm text-foreground/60">Altitude</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-gradient-gold" />
            <div className="text-2xl font-bold text-gradient-gold">
              {climber.score.toLocaleString()}
            </div>
            <div className="text-sm text-foreground/60">Score</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-yellow-400">
              {climber.streak}
            </div>
            <div className="text-sm text-foreground/60">Streak</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardContent className="p-4 text-center">
            {getWeatherIcon()}
            <div
              className="text-2xl font-bold"
              style={{ color: currentTier.color }}
            >
              {getWeatherMultiplier()}x
            </div>
            <div className="text-sm text-foreground/60 capitalize">
              {weather}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Game Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mountain Canvas */}
        <div className="lg:col-span-2">
          <Card className="glass-card border-border/50">
            <CardContent className="p-6 space-y-4">
              {/* Current Tier Display */}
              <div
                className="p-4 rounded-lg text-center"
                style={{
                  background: `linear-gradient(135deg, ${currentTier.color}20, transparent)`,
                  border: `2px solid ${currentTier.color}40`,
                }}
              >
                <div className="text-4xl mb-2">{currentTier.icon}</div>
                <h3
                  className="text-2xl font-bold mb-1"
                  style={{ color: currentTier.color }}
                >
                  {currentTier.name}
                </h3>
                <p className="text-sm text-foreground/60">
                  {currentTier.reward}
                </p>
                <div
                  className="text-lg font-bold mt-2"
                  style={{ color: currentTier.color }}
                >
                  {currentTier.multiplier}x Multiplier
                </div>
              </div>

              {/* Canvas */}
              <div className="relative rounded-lg overflow-hidden border-2 border-border/50">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto"
                  style={{ maxHeight: "600px" }}
                />
              </div>

              {/* Altitude Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">Progress to Summit</span>
                  <span
                    className="font-bold"
                    style={{ color: currentTier.color }}
                  >
                    {climber.altitude.toFixed(1)}%
                  </span>
                </div>
                <Progress value={climber.altitude} className="h-3" />
              </div>

              {/* Climbing Controls */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleClimb(true)}
                  disabled={isClimbing}
                  className="btn-silver flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Climb Up
                </Button>
                <Button
                  onClick={() => handleClimb(false)}
                  disabled={isClimbing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <TrendingDown className="w-4 h-4" />
                  Test Fall
                </Button>
                <Button
                  onClick={() =>
                    setWeather(weather === "sunny" ? "storm" : "sunny")
                  }
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {getWeatherIcon()}
                  Weather
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Power-Ups */}
          <Card className="glass-card-gold border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-gradient-gold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Power-Ups
              </h3>

              <div className="space-y-3">
                {powerUps.map((powerUp) => (
                  <Button
                    key={powerUp.id}
                    onClick={() => usePowerUp(powerUp.id)}
                    disabled={powerUp.active || powerUp.cooldown > 0}
                    className={`w-full justify-start text-left p-4 h-auto ${
                      powerUp.active
                        ? "btn-gold animate-pulse"
                        : "btn-silver opacity-80"
                    }`}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="text-2xl">{powerUp.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm">{powerUp.name}</div>
                        <div className="text-xs text-foreground/60 line-clamp-2">
                          {powerUp.description}
                        </div>
                        {powerUp.cooldown > 0 && (
                          <div className="text-xs text-yellow-400 mt-1">
                            Cooldown: {Math.ceil(powerUp.cooldown / 1000)}s
                          </div>
                        )}
                        {powerUp.active && (
                          <div className="text-xs text-green-400 mt-1">
                            ✓ Active
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="glass-card border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-gradient-silver flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Leaderboard
              </h3>

              <div className="space-y-2">
                {LEADERBOARD_DATA.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      entry.rank <= 3 ? "glass-card-gold" : "glass-card"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        entry.rank === 1
                          ? "gradient-gold text-black"
                          : entry.rank === 2
                            ? "gradient-silver text-black"
                            : entry.rank === 3
                              ? "bg-orange-500/30 text-orange-400"
                              : "bg-white/10"
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">
                        {entry.player}
                      </div>
                      <div className="text-xs text-foreground/60">
                        {entry.altitude.toFixed(1)}% •{" "}
                        {entry.score.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center gap-3 p-3 glass-card rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm">
                    ?
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">You</div>
                    <div className="text-xs text-foreground/60">
                      {climber.altitude.toFixed(1)}% •{" "}
                      {climber.score.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reward Tiers Reference */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gradient-silver mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Reward Tiers
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {REWARD_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`p-4 rounded-lg text-center transition-all ${
                  climber.altitude >= tier.minAltitude &&
                  climber.altitude <= tier.maxAltitude
                    ? "ring-2 ring-offset-2 ring-offset-background scale-105"
                    : "opacity-60"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${tier.color}20, transparent)`,
                  border: `2px solid ${tier.color}40`,
                  ringColor: tier.color,
                }}
              >
                <div className="text-3xl mb-2">{tier.icon}</div>
                <div
                  className="font-bold text-sm mb-1"
                  style={{ color: tier.color }}
                >
                  {tier.name}
                </div>
                <div className="text-xs text-foreground/60 mb-2">
                  {tier.minAltitude}-{tier.maxAltitude}%
                </div>
                <div
                  className="text-xs font-bold"
                  style={{ color: tier.color }}
                >
                  {tier.multiplier}x
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BitcoinMountain;
