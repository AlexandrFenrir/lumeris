import { useState, useEffect, useRef } from "react";
import { usePerformance } from "../contexts/PerformanceContext";

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

export interface ParallaxConfig {
  enabled?: boolean;
  sensitivity?: number; // 0 to 1
  smoothing?: number; // 0 to 1 (higher = smoother)
  maxOffset?: number; // Maximum camera offset
}

const defaultConfig: ParallaxConfig = {
  enabled: true,
  sensitivity: 0.5,
  smoothing: 0.1,
  maxOffset: 10,
};

export const useMouseParallax = (config: ParallaxConfig = {}) => {
  const { settings } = usePerformance();
  const finalConfig = { ...defaultConfig, ...config };

  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const [smoothPosition, setSmoothPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const targetPosition = useRef<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  // Track mouse movement
  useEffect(() => {
    if (!finalConfig.enabled || !settings.enableMouseParallax) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const normalizedX = (x / window.innerWidth) * 2 - 1; // -1 to 1
      const normalizedY = -((y / window.innerHeight) * 2 - 1); // -1 to 1 (inverted)

      const newPosition = { x, y, normalizedX, normalizedY };
      setMousePosition(newPosition);
      targetPosition.current = newPosition;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [finalConfig.enabled, settings.enableMouseParallax]);

  // Smooth interpolation
  useEffect(() => {
    if (!finalConfig.enabled || !settings.enableMouseParallax) {
      return;
    }

    let animationFrameId: number;

    const smoothUpdate = () => {
      setSmoothPosition((prev) => {
        const smoothing = finalConfig.smoothing || 0.1;

        return {
          x: prev.x + (targetPosition.current.x - prev.x) * smoothing,
          y: prev.y + (targetPosition.current.y - prev.y) * smoothing,
          normalizedX:
            prev.normalizedX +
            (targetPosition.current.normalizedX - prev.normalizedX) * smoothing,
          normalizedY:
            prev.normalizedY +
            (targetPosition.current.normalizedY - prev.normalizedY) * smoothing,
        };
      });

      animationFrameId = requestAnimationFrame(smoothUpdate);
    };

    animationFrameId = requestAnimationFrame(smoothUpdate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    finalConfig.enabled,
    finalConfig.smoothing,
    settings.enableMouseParallax,
  ]);

  // Calculate camera offset based on mouse position
  const getCameraOffset = () => {
    if (!finalConfig.enabled || !settings.enableMouseParallax) {
      return { x: 0, y: 0, z: 0 };
    }

    const sensitivity = finalConfig.sensitivity || 0.5;
    const maxOffset = finalConfig.maxOffset || 10;

    return {
      x: smoothPosition.normalizedX * maxOffset * sensitivity,
      y: smoothPosition.normalizedY * maxOffset * sensitivity,
      z: 0,
    };
  };

  // Calculate object offset (inverse of camera for parallax effect)
  const getObjectOffset = (depth: number = 1) => {
    if (!finalConfig.enabled || !settings.enableMouseParallax) {
      return { x: 0, y: 0, z: 0 };
    }

    const sensitivity = finalConfig.sensitivity || 0.5;
    const maxOffset = finalConfig.maxOffset || 10;

    return {
      x: -smoothPosition.normalizedX * maxOffset * sensitivity * depth * 0.1,
      y: -smoothPosition.normalizedY * maxOffset * sensitivity * depth * 0.1,
      z: 0,
    };
  };

  return {
    mousePosition,
    smoothPosition,
    getCameraOffset,
    getObjectOffset,
    isEnabled: finalConfig.enabled && settings.enableMouseParallax,
  };
};
