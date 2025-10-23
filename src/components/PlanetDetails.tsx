/**
 * 🪐 PLANET DETAILS PANEL
 * Interactive panel showing planet information on click
 */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface PlanetInfo {
  name: string;
  emoji: string;
  description: string;
  stats: {
    size: string;
    distance: string;
    temperature: string;
    moons: number;
  };
  color: string;
}

interface PlanetDetailsProps {
  planet: PlanetInfo | null;
  onClose: () => void;
}

export function PlanetDetails({ planet, onClose }: PlanetDetailsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (planet) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [planet]);

  if (!planet) return null;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-96 z-50 transition-transform duration-500 ${
        isVisible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <Card
        className="h-full rounded-none md:rounded-l-2xl border-l-4 overflow-y-auto"
        style={{
          background: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(20px)",
          borderLeftColor: planet.color,
          boxShadow: `0 0 40px ${planet.color}40`,
        }}
      >
        {/* Header */}
        <div
          className="p-6 border-b relative"
          style={{
            borderBottomColor: planet.color + "40",
            background: `linear-gradient(135deg, ${planet.color}20 0%, transparent 100%)`,
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="text-6xl mb-4">{planet.emoji}</div>
          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: planet.color }}
          >
            {planet.name}
          </h2>
          <p className="text-gray-400 text-sm italic">{planet.description}</p>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">
            📊 Planet Statistics
          </h3>

          <div className="space-y-3">
            <StatRow
              label="Diameter"
              value={planet.stats.size}
              color={planet.color}
            />
            <StatRow
              label="Distance from Sun"
              value={planet.stats.distance}
              color={planet.color}
            />
            <StatRow
              label="Temperature"
              value={planet.stats.temperature}
              color={planet.color}
            />
            <StatRow
              label="Known Moons"
              value={planet.stats.moons.toString()}
              color={planet.color}
            />
          </div>
        </div>

        {/* Mystical Runes Section */}
        <div
          className="p-6 border-t"
          style={{ borderTopColor: planet.color + "40" }}
        >
          <h3 className="text-xl font-bold text-white mb-4">
            ✨ Cosmic Signature
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {["◈", "◉", "◊", "◎", "◐", "◑", "◒", "◓"].map((rune, i) => (
              <div
                key={i}
                className="aspect-square flex items-center justify-center text-2xl rounded-lg border animate-pulse"
                style={{
                  borderColor: planet.color,
                  background: `${planet.color}10`,
                  color: planet.color,
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {rune}
              </div>
            ))}
          </div>
        </div>

        {/* Enter Realm Button */}
        <div className="p-6">
          <Button
            className="w-full py-6 text-lg font-bold relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${planet.color} 0%, ${planet.color}80 100%)`,
              border: `2px solid ${planet.color}`,
            }}
          >
            <span className="relative z-10">🚀 Enter {planet.name} Realm</span>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${planet.color}40 0%, transparent 100%)`,
              }}
            />
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">
            Coming soon in future updates
          </p>
        </div>

        {/* Holographic Effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${planet.color}20 2px,
              ${planet.color}20 4px
            )`,
          }}
        />
      </Card>
    </div>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="flex justify-between items-center p-3 rounded-lg border"
      style={{
        background: `${color}05`,
        borderColor: `${color}30`,
      }}
    >
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}
