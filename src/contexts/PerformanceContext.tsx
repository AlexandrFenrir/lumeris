import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

// Quality presets
export type QualityLevel = "low" | "medium" | "high" | "ultra";

export interface PerformanceSettings {
  quality: QualityLevel;
  particleCount: number;
  enableShadows: boolean;
  enableFog: boolean;
  enablePostProcessing: boolean;
  enableMouseParallax: boolean;
  targetFPS: number;
  pixelRatio: number;
}

interface PerformanceContextType {
  settings: PerformanceSettings;
  setQuality: (quality: QualityLevel) => void;
  updateSettings: (settings: Partial<PerformanceSettings>) => void;
  currentFPS: number;
  deviceCapability: "low" | "medium" | "high";
  autoOptimize: boolean;
  setAutoOptimize: (value: boolean) => void;
}

const defaultSettings: Record<QualityLevel, PerformanceSettings> = {
  low: {
    quality: "low",
    particleCount: 500,
    enableShadows: false,
    enableFog: true,
    enablePostProcessing: false,
    enableMouseParallax: false,
    targetFPS: 30,
    pixelRatio: 1,
  },
  medium: {
    quality: "medium",
    particleCount: 1000,
    enableShadows: false,
    enableFog: true,
    enablePostProcessing: false,
    enableMouseParallax: true,
    targetFPS: 45,
    pixelRatio: 1.5,
  },
  high: {
    quality: "high",
    particleCount: 1500,
    enableShadows: true,
    enableFog: true,
    enablePostProcessing: false,
    enableMouseParallax: true,
    targetFPS: 60,
    pixelRatio: 2,
  },
  ultra: {
    quality: "ultra",
    particleCount: 2000,
    enableShadows: true,
    enableFog: true,
    enablePostProcessing: true,
    enableMouseParallax: true,
    targetFPS: 60,
    pixelRatio: window.devicePixelRatio || 2,
  },
};

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

// Device capability detection
const detectDeviceCapability = (): "low" | "medium" | "high" => {
  // Check for mobile devices
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (isMobile) {
    return "low";
  }

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;

  // Check memory (if available)
  const memory = (navigator as any).deviceMemory || 4;

  // Check GPU (basic detection via canvas)
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  if (!gl) {
    return "low";
  }

  const debugInfo = (gl as any).getExtension("WEBGL_debug_renderer_info");
  const renderer = debugInfo
    ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    : "";

  // High-end GPU detection (NVIDIA RTX, AMD RX, etc.)
  const isHighEndGPU = /RTX|RX 6|RX 7|GTX 1080|GTX 1070|Radeon Pro/i.test(
    renderer
  );

  // Scoring system
  let score = 0;

  if (cores >= 8) score += 3;
  else if (cores >= 4) score += 2;
  else score += 1;

  if (memory >= 8) score += 3;
  else if (memory >= 4) score += 2;
  else score += 1;

  if (isHighEndGPU) score += 3;
  else if (renderer) score += 2;
  else score += 1;

  // Determine capability
  if (score >= 8) return "high";
  if (score >= 5) return "medium";
  return "low";
};

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [deviceCapability] = useState<"low" | "medium" | "high">(
    detectDeviceCapability
  );
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [currentFPS, setCurrentFPS] = useState(60);

  // Initialize with device-appropriate quality
  const initialQuality: QualityLevel =
    deviceCapability === "high"
      ? "ultra"
      : deviceCapability === "medium"
        ? "high"
        : "medium";

  const [settings, setSettings] = useState<PerformanceSettings>(
    defaultSettings[initialQuality]
  );

  // Define callback functions BEFORE they are used in useEffect
  const setQuality = useCallback((quality: QualityLevel) => {
    setSettings(defaultSettings[quality]);
    // Save to localStorage
    localStorage.setItem("performance-quality", quality);
  }, []);

  const updateSettings = useCallback(
    (newSettings: Partial<PerformanceSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  // FPS monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        setCurrentFPS(fps);
        frameCount = 0;
        lastTime = currentTime;

        // Auto-optimize if enabled
        if (autoOptimize) {
          if (fps < 30 && settings.quality !== "low") {
            // Downgrade quality
            const qualityLevels: QualityLevel[] = [
              "low",
              "medium",
              "high",
              "ultra",
            ];
            const currentIndex = qualityLevels.indexOf(settings.quality);
            if (currentIndex > 0) {
              setQuality(qualityLevels[currentIndex - 1]);
            }
          } else if (
            fps > 55 &&
            settings.quality !== "ultra" &&
            deviceCapability === "high"
          ) {
            // Upgrade quality (only if device is capable)
            const qualityLevels: QualityLevel[] = [
              "low",
              "medium",
              "high",
              "ultra",
            ];
            const currentIndex = qualityLevels.indexOf(settings.quality);
            if (currentIndex < qualityLevels.length - 1) {
              setQuality(qualityLevels[currentIndex + 1]);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [autoOptimize, settings.quality, deviceCapability, setQuality]);

  // Load saved quality on mount
  useEffect(() => {
    const savedQuality = localStorage.getItem(
      "performance-quality"
    ) as QualityLevel;
    if (savedQuality && defaultSettings[savedQuality]) {
      setQuality(savedQuality);
    }
  }, [setQuality]);

  const contextValue = useMemo(
    () => ({
      settings,
      setQuality,
      updateSettings,
      currentFPS,
      deviceCapability,
      autoOptimize,
      setAutoOptimize,
    }),
    [
      settings,
      setQuality,
      updateSettings,
      currentFPS,
      deviceCapability,
      autoOptimize,
    ]
  );

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};
