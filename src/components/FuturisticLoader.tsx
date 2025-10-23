import { useEffect, useState } from "react";
import { GamingLogo } from "./GamingLogo";

interface Star {
  id: number;
  x: number;
  y: number;
  z: number;
  speed: number;
}

interface FuturisticLoaderProps {
  onLoadingComplete?: () => void;
  minimumLoadTime?: number;
}

const FuturisticLoader = ({
  onLoadingComplete,
  minimumLoadTime = 3500,
}: FuturisticLoaderProps) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState("INITIALIZING");

  // Initialize stars
  useEffect(() => {
    const initialStars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      initialStars.push({
        id: i,
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        speed: Math.random() * 2 + 1,
      });
    }
    setStars(initialStars);
  }, []);

  // Animate stars (warp effect)
  useEffect(() => {
    const interval = setInterval(() => {
      setStars((prevStars) =>
        prevStars.map((star) => {
          let newZ = star.z - star.speed * 20;
          if (newZ <= 0) {
            newZ = 2000;
          }
          return { ...star, z: newZ };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Progress animation
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minimumLoadTime) * 100, 100);
      setProgress(newProgress);

      // Update loading text based on progress
      if (newProgress < 30) {
        setLoadingText("INITIALIZING");
      } else if (newProgress < 60) {
        setLoadingText("LOADING SYSTEMS");
      } else if (newProgress < 90) {
        setLoadingText("PREPARING INTERFACE");
      } else {
        setLoadingText("ALMOST READY");
      }

      if (newProgress >= 100) {
        clearInterval(interval);
        // Fade out after completion
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 500);
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [minimumLoadTime, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        progress >= 100 ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Starfield */}
      <div className="absolute inset-0">
        {stars.map((star) => {
          const scale = (2000 - star.z) / 2000;
          const x = star.x * scale + window.innerWidth / 2;
          const y = star.y * scale + window.innerHeight / 2;
          const size = scale * 3;
          const opacity = scale * 0.8;
          const length = scale * 80; // Trail length

          return (
            <div
              key={star.id}
              className="absolute"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${length}px`,
                height: `${size}px`,
                background: `linear-gradient(to right, transparent, rgba(255, 215, 0, ${opacity}))`,
                transform: `translateX(-${length}px)`,
                borderRadius: "50%",
              }}
            />
          );
        })}
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Gaming Logo */}
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-amber-500/50 via-yellow-500/50 to-amber-500/50 animate-pulse" />
          <GamingLogo size="large" showText={false} />
        </div>

        {/* Brand name with gaming styling */}
        <GamingLogo size="medium" showText={true} className="scale-150" />

        {/* Loading text */}
        <div className="text-amber-400/80 text-sm tracking-[0.3em] font-light animate-pulse">
          {loadingText}
          <span className="inline-block animate-ellipsis">...</span>
        </div>

        {/* Progress bar */}
        <div className="w-80 max-w-[90vw]">
          {/* Progress bar container */}
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-amber-500/20">
            {/* Glow effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent blur-sm"
              style={{
                width: `${progress}%`,
                transition: "width 0.3s ease-out",
              }}
            />
            {/* Progress fill */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 shadow-lg shadow-amber-500/50"
              style={{
                width: `${progress}%`,
                transition: "width 0.3s ease-out",
              }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-fast"
              style={{
                width: `${progress}%`,
                transition: "width 0.3s ease-out",
              }}
            />
          </div>

          {/* Percentage */}
          <div className="mt-3 text-center text-amber-400/60 text-xs font-mono tracking-wider">
            {Math.floor(progress)}%
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex items-center space-x-2 text-amber-500/30 text-xs">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="font-mono tracking-wider">SYSTEM ONLINE</span>
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping animation-delay-300" />
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-amber-500/30 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-amber-500/30 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-amber-500/30 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-amber-500/30 rounded-br-lg" />
    </div>
  );
};

export default FuturisticLoader;
