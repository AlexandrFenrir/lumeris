import { useState, useEffect, useRef } from "react";

export type ElementType = "fire" | "water" | "lightning" | "cosmic";

export interface ElementalState {
  currentElement: ElementType;
  progress: number; // 0-100 percentage through current element
  isTransitioning: boolean;
}

const ELEMENT_DURATION = 20000; // 20 seconds per element
const TRANSITION_DURATION = 2000; // 2 seconds transition
const ELEMENTS: ElementType[] = ["fire", "water", "lightning", "cosmic"];

/**
 * Custom hook to manage the 80-second elemental cycle
 * Fire (0-20s) → Water (20-40s) → Lightning (40-60s) → Cosmic (60-80s) → Loop
 */
export const useElementalCycle = () => {
  const [state, setState] = useState<ElementalState>({
    currentElement: "fire",
    progress: 0,
    isTransitioning: false,
  });

  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const updateCycle = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const totalCycleDuration = ELEMENT_DURATION * ELEMENTS.length;
      const cyclePosition = elapsed % totalCycleDuration;

      // Determine current element index
      const elementIndex = Math.floor(cyclePosition / ELEMENT_DURATION);
      const currentElement = ELEMENTS[elementIndex];

      // Calculate progress within current element (0-100)
      const elementProgress = cyclePosition % ELEMENT_DURATION;
      const progress = (elementProgress / ELEMENT_DURATION) * 100;

      // Check if we're in transition phase (last 2 seconds of element)
      const isTransitioning =
        elementProgress >= ELEMENT_DURATION - TRANSITION_DURATION;

      setState({
        currentElement,
        progress,
        isTransitioning,
      });

      animationFrameRef.current = requestAnimationFrame(updateCycle);
    };

    animationFrameRef.current = requestAnimationFrame(updateCycle);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return state;
};
