import { Gamepad2, Hexagon } from "lucide-react";

interface ArenaLogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  animated?: boolean;
}

export function ArenaLogo({
  size = "medium",
  showText = true,
  animated = true,
}: ArenaLogoProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const textSizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl",
  };

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className="relative">
        {/* Outer Hexagon (Blockchain) - Gold */}
        <div
          className={`${sizeClasses[size]} relative ${
            animated ? "arena-logo-rotate" : ""
          }`}
        >
          <Hexagon
            className="w-full h-full text-amber-500"
            strokeWidth={2}
            style={{
              filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))",
            }}
          />
        </div>

        {/* Inner Gaming Controller - Purple */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            animated ? "arena-logo-pulse" : ""
          }`}
        >
          <Gamepad2
            className={`${
              size === "small"
                ? "w-4 h-4"
                : size === "medium"
                  ? "w-6 h-6"
                  : "w-8 h-8"
            } text-purple-500`}
            strokeWidth={2.5}
            style={{
              filter: "drop-shadow(0 0 6px rgba(147, 51, 234, 0.8))",
            }}
          />
        </div>

        {/* Energy Glow Effect */}
        {animated && (
          <>
            <div
              className="absolute inset-0 rounded-full opacity-30 animate-ping"
              style={{
                background:
                  "radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)",
                animationDuration: "3s",
              }}
            />
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)",
                animation: "pulse 4s ease-in-out infinite",
              }}
            />
          </>
        )}
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <div
            className={`${textSizeClasses[size]} font-bold tracking-wider`}
            style={{
              background:
                "linear-gradient(135deg, #9333EA 0%, #F59E0B 50%, #06B6D4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
            }}
          >
            LUMERIS
          </div>
          {size !== "small" && (
            <div
              className="text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "linear-gradient(90deg, #9333EA 0%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Arena of Champions
            </div>
          )}
        </div>
      )}
    </div>
  );
}
