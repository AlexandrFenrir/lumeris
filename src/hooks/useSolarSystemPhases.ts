/**
 * 🌌 SOLAR SYSTEM PHASE PROGRESSION HOOK
 * Manages time-based activation of features over 90+ seconds
 */

import { useState, useEffect, useRef } from "react";

export type SystemPhase =
  | "awakening"
  | "activation"
  | "exploration"
  | "immersion";

export interface PhaseState {
  phase: SystemPhase;
  progress: number; // 0-100 within current phase
  totalProgress: number; // 0-100 overall
  features: {
    orbitalAnimation: boolean;
    hoverEffects: boolean;
    clickInteraction: boolean;
    cameraRotation: boolean;
    particleTrails: boolean;
    parallaxScroll: boolean;
  };
}

const PHASE_DURATIONS = {
  awakening: 30000, // 0-30s
  activation: 30000, // 30-60s
  exploration: 30000, // 60-90s
  immersion: Infinity, // 90s+
};

/**
 * Custom hook to manage solar system phase progression
 * Features unlock progressively over time
 */
export function useSolarSystemPhases(): PhaseState {
  const [phase, setPhase] = useState<SystemPhase>("awakening");
  const [progress, setProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const animationRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;

      // Calculate total progress (0-100)
      const totalDuration = 90000; // 90 seconds to full immersion
      const totalProg = Math.min((elapsed / totalDuration) * 100, 100);
      setTotalProgress(totalProg);

      // Determine current phase and progress within phase
      if (elapsed < PHASE_DURATIONS.awakening) {
        setPhase("awakening");
        setProgress((elapsed / PHASE_DURATIONS.awakening) * 100);
      } else if (
        elapsed <
        PHASE_DURATIONS.awakening + PHASE_DURATIONS.activation
      ) {
        setPhase("activation");
        const phaseElapsed = elapsed - PHASE_DURATIONS.awakening;
        setProgress((phaseElapsed / PHASE_DURATIONS.activation) * 100);
      } else if (
        elapsed <
        PHASE_DURATIONS.awakening +
          PHASE_DURATIONS.activation +
          PHASE_DURATIONS.exploration
      ) {
        setPhase("exploration");
        const phaseElapsed =
          elapsed - PHASE_DURATIONS.awakening - PHASE_DURATIONS.activation;
        setProgress((phaseElapsed / PHASE_DURATIONS.exploration) * 100);
      } else {
        setPhase("immersion");
        setProgress(100);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Feature flags based on current phase
  const features = {
    orbitalAnimation: true, // Always active
    hoverEffects: phase !== "awakening",
    clickInteraction: phase === "exploration" || phase === "immersion",
    cameraRotation: phase === "immersion",
    particleTrails:
      phase === "activation" ||
      phase === "exploration" ||
      phase === "immersion",
    parallaxScroll: phase === "immersion",
  };

  return {
    phase,
    progress,
    totalProgress,
    features,
  };
}
