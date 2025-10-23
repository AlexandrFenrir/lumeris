import { useState, useEffect, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  z: number; // Depth
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  speedZ: number;
  opacity: number;
  pulseSpeed: number;
  glowIntensity: number;
}

interface ParticleSystem3DProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export function ParticleSystem3D({
  count = 50,
  colors = ["#9333EA", "#F59E0B", "#06B6D4"],
  className = "",
}: ParticleSystem3DProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Initialize particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 100, // 0-100 depth
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.05,
        speedY: (Math.random() - 0.5) * 0.05,
        speedZ: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 3 + 2,
        glowIntensity: Math.random() * 20 + 10,
      });
    }
    setParticles(newParticles);
  }, [count, colors]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animate particles
  useEffect(() => {
    const animate = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;
          let newZ = particle.z + particle.speedZ;

          // Wrap around edges
          if (newX < -5) newX = 105;
          if (newX > 105) newX = -5;
          if (newY < -5) newY = 105;
          if (newY > 105) newY = -5;
          if (newZ < 0) newZ = 100;
          if (newZ > 100) newZ = 0;

          return {
            ...particle,
            x: newX,
            y: newY,
            z: newZ,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles.map((particle) => {
        // Calculate scale based on Z depth (closer = bigger)
        const scale = 0.3 + (particle.z / 100) * 0.7;
        const calculatedSize = particle.size * scale;

        // Calculate opacity based on depth (closer = more visible)
        const depthOpacity = 0.3 + (particle.z / 100) * 0.7;
        const finalOpacity = particle.opacity * depthOpacity;

        // Parallax effect based on mouse position
        const parallaxX = (mousePosition.x - 50) * (particle.z / 100) * 0.5;
        const parallaxY = (mousePosition.y - 50) * (particle.z / 100) * 0.5;

        return (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `calc(${particle.x}% + ${parallaxX}px)`,
              top: `calc(${particle.y}% + ${parallaxY}px)`,
              width: `${calculatedSize}px`,
              height: `${calculatedSize}px`,
              backgroundColor: particle.color,
              opacity: finalOpacity,
              boxShadow: `0 0 ${particle.glowIntensity * scale}px ${particle.color}`,
              animation: `pulse ${particle.pulseSpeed}s ease-in-out infinite`,
              transform: `translateZ(${particle.z}px) scale(${scale})`,
              transition: "left 0.3s ease-out, top 0.3s ease-out",
              filter: `blur(${1 - scale}px)`, // Blur distant particles
            }}
          />
        );
      })}
    </div>
  );
}

export default ParticleSystem3D;
