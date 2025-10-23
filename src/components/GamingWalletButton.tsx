/**
 * Stellar Gateway Wallet Button
 * Space-themed button with gold/silver gradient
 * Design: Solar reflection on metallic space station docking port
 */

import { useState } from "react";
import { Wallet, Sparkles } from "lucide-react";

interface GamingWalletButtonProps {
  onClick: () => void;
  isConnected: boolean;
  displayText: string;
  className?: string;
}

export function GamingWalletButton({
  onClick,
  isConnected,
  displayText,
  className = "",
}: GamingWalletButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`relative w-full h-full cursor-pointer transition-all duration-300 ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background:
          "linear-gradient(135deg, #FFD700 0%, #C0C0C0 50%, #FFD700 100%)",
        border: `2px solid ${isHovered ? "#FFD700" : "#C0C0C0"}`,
        borderRadius: "8px",
        padding: "12px 24px",
        minHeight: "48px",
        boxShadow: isHovered
          ? "0 6px 30px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)"
          : "0 4px 20px rgba(255, 215, 0, 0.3)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Subtle pulse animation on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-lg animate-pulse"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255, 215, 0, 0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      <div className="relative flex items-center justify-center gap-2 text-white font-bold text-sm drop-shadow-lg">
        {!isConnected ? (
          <>
            <Wallet className="w-4 h-4" />
            <span>{displayText}</span>
            <Sparkles className="w-3 h-3 opacity-70" />
          </>
        ) : (
          <span>{displayText}</span>
        )}
      </div>
    </button>
  );
}
