import React, { useEffect, useRef } from "react";
import { useElementalCycle, ElementType } from "@/hooks/useElementalCycle";

interface ElementalLogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
  hue: number;
}

const ELEMENT_COLORS = {
  fire: {
    primary: "#FF6B35",
    secondary: "#E63946",
    accent: "#FFD700",
    particles: [15, 0, 45], // Hue values for orange, red, gold
  },
  water: {
    primary: "#00D9FF",
    secondary: "#0077B6",
    accent: "#00F5FF",
    particles: [190, 200, 185], // Hue values for cyan, blue, aqua
  },
  lightning: {
    primary: "#00FFFF",
    secondary: "#FFFF00",
    accent: "#FFFFFF",
    particles: [180, 60, 0], // Hue values for cyan, yellow, white
  },
  cosmic: {
    primary: "#9D4EDD",
    secondary: "#FF006E",
    accent: "#FFD700",
    particles: [270, 330, 45], // Hue values for purple, pink, gold
  },
};

const SIZE_CONFIG = {
  small: { width: 40, height: 40, fontSize: "1rem", particles: 20 },
  medium: { width: 60, height: 60, fontSize: "1.5rem", particles: 40 },
  large: { width: 200, height: 200, fontSize: "5rem", particles: 80 },
};

export const ElementalLogo: React.FC<ElementalLogoProps> = ({
  size = "medium",
  showText = true,
  className = "",
}) => {
  const { currentElement, progress, isTransitioning } = useElementalCycle();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  const config = SIZE_CONFIG[size];
  const colors = ELEMENT_COLORS[currentElement];

  // Initialize and update particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height, particles: maxParticles } = config;
    canvas.width = width;
    canvas.height = height;

    // Create particles based on element type
    const createParticle = (): Particle => {
      const centerX = width / 2;
      const centerY = height / 2;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (width / 4);

      let particle: Particle = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        life: 1,
        maxLife: 1,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        hue: colors.particles[
          Math.floor(Math.random() * colors.particles.length)
        ],
      };

      // Element-specific particle behavior
      switch (currentElement) {
        case "fire":
          particle.vy = -(Math.random() * 2 + 1); // Rise upward
          particle.vx = (Math.random() - 0.5) * 1; // Slight horizontal drift
          particle.maxLife = Math.random() * 60 + 40;
          break;
        case "water":
          particle.vy = Math.sin(Date.now() * 0.001) * 0.5; // Wave motion
          particle.vx = Math.cos(Date.now() * 0.001) * 0.5;
          particle.maxLife = Math.random() * 80 + 60;
          break;
        case "lightning":
          particle.vx = (Math.random() - 0.5) * 4; // Fast erratic movement
          particle.vy = (Math.random() - 0.5) * 4;
          particle.maxLife = Math.random() * 30 + 20;
          break;
        case "cosmic":
          const orbitRadius = Math.random() * (width / 3);
          const orbitSpeed = Math.random() * 0.02 + 0.01;
          particle.vx = orbitSpeed;
          particle.vy = orbitRadius;
          particle.maxLife = Math.random() * 100 + 80;
          break;
      }

      return particle;
    };

    // Initialize particles
    particlesRef.current = Array.from({ length: maxParticles }, createParticle);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current = particlesRef.current
        .map((particle) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Element-specific updates
          if (currentElement === "water") {
            particle.vy = Math.sin(Date.now() * 0.002 + particle.x * 0.1) * 0.5;
          } else if (currentElement === "cosmic") {
            const centerX = width / 2;
            const centerY = height / 2;
            const angle = Math.atan2(
              particle.y - centerY,
              particle.x - centerX
            );
            const newAngle = angle + particle.vx;
            const radius = particle.vy;
            particle.x = centerX + Math.cos(newAngle) * radius;
            particle.y = centerY + Math.sin(newAngle) * radius;
          }

          // Update life
          particle.life -= 1 / particle.maxLife;

          // Draw particle
          if (particle.life > 0) {
            ctx.save();
            ctx.globalAlpha =
              particle.opacity * particle.life * (isTransitioning ? 0.5 : 1);

            // Lightning effect - draw connecting lines
            if (currentElement === "lightning" && Math.random() > 0.95) {
              ctx.strokeStyle = `hsl(${particle.hue}, 100%, 70%)`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(width / 2, height / 2);
              ctx.stroke();
            }

            // Draw particle glow
            const gradient = ctx.createRadialGradient(
              particle.x,
              particle.y,
              0,
              particle.x,
              particle.y,
              particle.size * 2
            );
            gradient.addColorStop(0, `hsl(${particle.hue}, 100%, 70%)`);
            gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }

          return particle;
        })
        .filter((p) => p.life > 0);

      // Add new particles to maintain count
      while (particlesRef.current.length < maxParticles) {
        particlesRef.current.push(createParticle());
      }

      // Draw the "L" shape with element styling
      ctx.save();
      ctx.globalAlpha = isTransitioning ? 0.7 : 1;

      // Create gradient for the L
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.accent);

      ctx.fillStyle = gradient;
      ctx.font = `bold ${config.fontSize} Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Add glow effect
      ctx.shadowColor = colors.primary;
      ctx.shadowBlur = 20;
      ctx.fillText("L", width / 2, height / 2);

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentElement, isTransitioning, config, colors]);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative"
        style={{ width: config.width, height: config.height }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ width: config.width, height: config.height }}
        />
      </div>
      {showText && (
        <span
          className={`font-bold tracking-wider transition-all duration-1000 ${
            size === "small"
              ? "text-lg"
              : size === "medium"
                ? "text-2xl"
                : "text-5xl"
          }`}
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: isTransitioning ? "blur(1px)" : "none",
          }}
        >
          LUMERIS
        </span>
      )}
    </div>
  );
};
