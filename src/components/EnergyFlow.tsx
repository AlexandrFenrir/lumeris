import { useEffect, useRef } from "react";

interface EnergyFlowProps {
  theme?: "gold" | "silver";
  intensity?: number;
}

export function EnergyFlow({ theme = "gold", intensity = 1 }: EnergyFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }> = [];

    const colors =
      theme === "gold"
        ? ["rgba(255, 215, 0, ", "rgba(255, 165, 0, ", "rgba(255, 237, 78, "]
        : [
            "rgba(192, 192, 192, ",
            "rgba(232, 232, 232, ",
            "rgba(168, 168, 168, ",
          ];

    // Create energy streams
    const createEnergyStream = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;

      switch (side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = 0;
          vx = (Math.random() - 0.5) * 2;
          vy = Math.random() * 2 + 1;
          break;
        case 1: // Right
          x = canvas.width;
          y = Math.random() * canvas.height;
          vx = -(Math.random() * 2 + 1);
          vy = (Math.random() - 0.5) * 2;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height;
          vx = (Math.random() - 0.5) * 2;
          vy = -(Math.random() * 2 + 1);
          break;
        default: // Left
          x = 0;
          y = Math.random() * canvas.height;
          vx = Math.random() * 2 + 1;
          vy = (Math.random() - 0.5) * 2;
      }

      particles.push({
        x,
        y,
        vx: vx * intensity,
        vy: vy * intensity,
        life: 1,
        maxLife: 1,
        size: Math.random() * 3 + 1,
      });
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new particles
      if (Math.random() < 0.1 * intensity) {
        createEnergyStream();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;

        // Remove dead particles
        if (
          p.life <= 0 ||
          p.x < 0 ||
          p.x > canvas.width ||
          p.y < 0 ||
          p.y > canvas.height
        ) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle with trail
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.size * 3
        );
        const colorBase = colors[Math.floor(Math.random() * colors.length)];
        gradient.addColorStop(0, colorBase + p.life * 0.8 + ")");
        gradient.addColorStop(0.5, colorBase + p.life * 0.4 + ")");
        gradient.addColorStop(1, colorBase + "0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw energy trail
        ctx.strokeStyle = colorBase + p.life * 0.3 + ")";
        ctx.lineWidth = p.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
        ctx.stroke();
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [theme, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}

export default EnergyFlow;
