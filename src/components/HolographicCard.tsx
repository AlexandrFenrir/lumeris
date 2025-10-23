import { useRef, useState, MouseEvent, ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface HolographicCardProps {
  children: ReactNode;
  className?: string;
  theme?: "gold" | "silver" | "cosmic" | "purple";
  intensity?: number;
}

export function HolographicCard({
  children,
  className = "",
  theme = "gold",
  intensity = 15,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = ((e.clientY - centerY) / rect.height) * -intensity;
    const rotateY = ((e.clientX - centerX) / rect.width) * intensity;

    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setGlowPosition({ x: glowX, y: glowY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlowPosition({ x: 50, y: 50 });
    setIsHovered(false);
  };

  const getThemeGradient = () => {
    switch (theme) {
      case "gold":
        return "radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(255, 215, 0, 0.3), transparent 50%)";
      case "silver":
        return "radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(192, 192, 192, 0.3), transparent 50%)";
      case "cosmic":
        return "radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(138, 43, 226, 0.4), transparent 50%)";
      case "purple":
        return "radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(147, 51, 234, 0.4), transparent 50%)";
      default:
        return "radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(255, 215, 0, 0.3), transparent 50%)";
    }
  };

  const getThemeBorder = () => {
    switch (theme) {
      case "gold":
        return "1px solid rgba(255, 215, 0, 0.3)";
      case "silver":
        return "1px solid rgba(192, 192, 192, 0.3)";
      case "cosmic":
        return "1px solid rgba(138, 43, 226, 0.3)";
      case "purple":
        return "1px solid rgba(147, 51, 234, 0.3)";
      default:
        return "1px solid rgba(255, 215, 0, 0.3)";
    }
  };

  const getThemeShadow = () => {
    switch (theme) {
      case "gold":
        return "0 8px 32px rgba(255, 215, 0, 0.2), 0 0 80px rgba(255, 215, 0, 0.1)";
      case "silver":
        return "0 8px 32px rgba(192, 192, 192, 0.2), 0 0 80px rgba(192, 192, 192, 0.1)";
      case "cosmic":
        return "0 8px 32px rgba(138, 43, 226, 0.3), 0 0 80px rgba(138, 43, 226, 0.15)";
      case "purple":
        return "0 8px 32px rgba(147, 51, 234, 0.3), 0 0 80px rgba(147, 51, 234, 0.15)";
      default:
        return "0 8px 32px rgba(255, 215, 0, 0.2), 0 0 80px rgba(255, 215, 0, 0.1)";
    }
  };

  return (
    <div
      ref={cardRef}
      className={`holographic-card perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(${isHovered ? "20px" : "0px"})`,
        transition: "transform 0.15s cubic-bezier(0.23, 1, 0.32, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      <Card
        className="relative overflow-hidden backdrop-blur-xl bg-black/40"
        style={{
          border: getThemeBorder(),
          boxShadow: isHovered
            ? getThemeShadow()
            : theme === "gold"
              ? "0 8px 32px rgba(255, 215, 0, 0.2)"
              : theme === "silver"
                ? "0 8px 32px rgba(192, 192, 192, 0.2)"
                : theme === "purple"
                  ? "0 8px 32px rgba(147, 51, 234, 0.3)"
                  : "0 8px 32px rgba(138, 43, 226, 0.3)",
          transition: "box-shadow 0.3s ease-out",
        }}
      >
        {/* 3D Depth Layer (Back) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: "translateZ(-10px)",
            background: "rgba(0, 0, 0, 0.3)",
            filter: "blur(10px)",
            opacity: isHovered ? 0.8 : 0,
            transition: "opacity 0.3s ease-out",
          }}
        />

        {/* Holographic Glow Effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: getThemeGradient(),
            // @ts-ignore - CSS custom properties
            "--glow-x": `${glowPosition.x}%`,
            "--glow-y": `${glowPosition.y}%`,
            transform: "translateZ(5px)",
          }}
        />

        {/* Scanline Effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)",
            animation: "scanline 8s linear infinite",
          }}
        />

        {/* Edge Highlight (3D Effect) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${
              theme === "gold"
                ? "rgba(255, 215, 0, 0.2)"
                : theme === "purple"
                  ? "rgba(147, 51, 234, 0.2)"
                  : "rgba(138, 43, 226, 0.2)"
            } 0%, transparent 50%)`,
            transform: "translateZ(10px)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease-out",
          }}
        />

        {/* Content */}
        <div
          className="relative z-10"
          style={{
            transform: "translateZ(15px)",
          }}
        >
          {children}
        </div>
      </Card>
    </div>
  );
}

export default HolographicCard;
