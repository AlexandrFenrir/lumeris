import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  speed: number;
  size: number;
}

interface LumerisLoadingScreenProps {
  onLoadingComplete?: () => void;
  minimumLoadTime?: number;
}

const LumerisLoadingScreen = ({
  onLoadingComplete,
  minimumLoadTime = 4000,
}: LumerisLoadingScreenProps) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState(
    "Gathering photons of possibility..."
  );
  const [rotation, setRotation] = useState(0);

  // Initialize stars (background constellation)
  useEffect(() => {
    const initialStars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      initialStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 3 + 2,
      });
    }
    setStars(initialStars);
  }, []);

  // Initialize particles (flowing into portal)
  useEffect(() => {
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      initialParticles.push({
        id: i,
        angle: (Math.PI * 2 * i) / 40,
        distance: Math.random() * 200 + 150,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 3 + 2,
      });
    }
    setParticles(initialParticles);
  }, []);

  // Animate particles (flowing inward)
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let newDistance = particle.distance - particle.speed;
          if (newDistance <= 0) {
            newDistance = Math.random() * 200 + 150;
          }
          return { ...particle, distance: newDistance };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Rotate portal ring
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Progress animation with legendary messages
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minimumLoadTime) * 100, 100);
      setProgress(newProgress);

      // Update loading text based on progress
      if (newProgress < 25) {
        setLoadingText("Gathering photons of possibility...");
      } else if (newProgress < 50) {
        setLoadingText("Synchronizing with the light network...");
      } else if (newProgress < 75) {
        setLoadingText("Bridging worlds at the speed of light...");
      } else if (newProgress < 100) {
        setLoadingText("Welcome to Lumeris...");
      }

      if (newProgress >= 100) {
        clearInterval(interval);
        // Fade out after completion
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 800);
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [minimumLoadTime, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-800 ${
        progress >= 100 ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(ellipse at center, #1A1F3A 0%, #0A0E27 100%)",
      }}
    >
      {/* Animated starfield background */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${star.twinkleSpeed}s ease-in-out infinite`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
            }}
          />
        ))}
      </div>

      {/* Radial glow effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Center portal container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Portal ring with progress */}
        <div className="relative w-64 h-64 mb-8">
          {/* Outer glow */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-50"
            style={{
              background: `conic-gradient(from 0deg, #FFD700, #00D9FF, #FFD700)`,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />

          {/* Portal ring background */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            {/* Progress ring with gradient */}
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="url(#portalGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 110}`}
              strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress / 100)}`}
              style={{
                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))",
                transition: "stroke-dashoffset 0.3s ease-out",
              }}
            />
            <defs>
              <linearGradient
                id="portalGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#00D9FF" />
              </linearGradient>
            </defs>
          </svg>

          {/* Rotating ring decoration */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 0.03s linear",
            }}
          >
            {[0, 90, 180, 270].map((angle) => (
              <div
                key={angle}
                className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-cyan-400"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${angle}deg) translateY(-110px) translateX(-50%)`,
                  boxShadow: "0 0 15px rgba(255, 215, 0, 0.8)",
                }}
              />
            ))}
          </div>

          {/* Flowing particles */}
          {particles.map((particle) => {
            const x = Math.cos(particle.angle) * particle.distance;
            const y = Math.sin(particle.angle) * particle.distance;
            const opacity = 1 - particle.distance / 350;

            return (
              <div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  transform: `translate(${x}px, ${y}px)`,
                  background: `radial-gradient(circle, rgba(255, 215, 0, ${opacity}) 0%, rgba(0, 217, 255, ${opacity * 0.5}) 100%)`,
                  boxShadow: `0 0 ${particle.size * 3}px rgba(255, 215, 0, ${opacity})`,
                }}
              />
            );
          })}

          {/* Center logo/symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Pulsing core */}
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 animate-pulse"
                style={{
                  boxShadow:
                    "0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.5)",
                }}
              />
              {/* Inner glow */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-yellow-200 to-transparent opacity-60"
                style={{
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              {/* Lumeris "L" symbol */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-4xl font-bold text-white"
                  style={{
                    textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    letterSpacing: "-0.05em",
                  }}
                >
                  L
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="mb-4">
          <h1
            className="text-5xl font-bold tracking-wider"
            style={{
              background:
                "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #00D9FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 40px rgba(255, 215, 0, 0.3)",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            LUMERIS
          </h1>
        </div>

        {/* Tagline */}
        <div className="mb-8 text-center">
          <p className="text-sm text-gray-300 tracking-widest font-light">
            Powered by Light. United by Web3.
          </p>
        </div>

        {/* Loading text */}
        <div className="mb-6 h-6 flex items-center justify-center">
          <p
            className="text-amber-400/90 text-sm tracking-wide font-light animate-pulse text-center px-4"
            style={{
              textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
            }}
          >
            {loadingText}
          </p>
        </div>

        {/* Progress percentage */}
        <div className="text-center">
          <span
            className="text-2xl font-mono font-bold text-cyan-400"
            style={{
              textShadow: "0 0 20px rgba(0, 217, 255, 0.6)",
            }}
          >
            {Math.floor(progress)}%
          </span>
        </div>

        {/* Bottom decorative text */}
        <div className="mt-8 flex items-center space-x-3 text-amber-500/40 text-xs">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-mono tracking-widest">INITIALIZING COSMOS</span>
          <div
            className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"
            style={{ animationDelay: "0.5s" }}
          />
        </div>
      </div>

      {/* Corner decorations (constellation style) */}
      <div className="absolute top-8 left-8 w-20 h-20">
        <div
          className="absolute top-0 left-0 w-2 h-2 rounded-full bg-amber-400"
          style={{ boxShadow: "0 0 10px rgba(255, 215, 0, 0.8)" }}
        />
        <div
          className="absolute top-4 left-6 w-1.5 h-1.5 rounded-full bg-amber-300"
          style={{ boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)" }}
        />
        <div
          className="absolute top-8 left-2 w-1 h-1 rounded-full bg-amber-200"
          style={{ boxShadow: "0 0 6px rgba(255, 215, 0, 0.4)" }}
        />
        <svg className="absolute inset-0 w-full h-full">
          <line
            x1="4"
            y1="4"
            x2="28"
            y2="20"
            stroke="rgba(255, 215, 0, 0.2)"
            strokeWidth="1"
          />
          <line
            x1="28"
            y1="20"
            x2="12"
            y2="36"
            stroke="rgba(255, 215, 0, 0.2)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="absolute top-8 right-8 w-20 h-20">
        <div
          className="absolute top-0 right-0 w-2 h-2 rounded-full bg-cyan-400"
          style={{ boxShadow: "0 0 10px rgba(0, 217, 255, 0.8)" }}
        />
        <div
          className="absolute top-4 right-6 w-1.5 h-1.5 rounded-full bg-cyan-300"
          style={{ boxShadow: "0 0 8px rgba(0, 217, 255, 0.6)" }}
        />
        <div
          className="absolute top-8 right-2 w-1 h-1 rounded-full bg-cyan-200"
          style={{ boxShadow: "0 0 6px rgba(0, 217, 255, 0.4)" }}
        />
        <svg className="absolute inset-0 w-full h-full">
          <line
            x1="76"
            y1="4"
            x2="52"
            y2="20"
            stroke="rgba(0, 217, 255, 0.2)"
            strokeWidth="1"
          />
          <line
            x1="52"
            y1="20"
            x2="68"
            y2="36"
            stroke="rgba(0, 217, 255, 0.2)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="absolute bottom-8 left-8 w-20 h-20">
        <div
          className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-amber-400"
          style={{ boxShadow: "0 0 10px rgba(255, 215, 0, 0.8)" }}
        />
        <div
          className="absolute bottom-4 left-6 w-1.5 h-1.5 rounded-full bg-amber-300"
          style={{ boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)" }}
        />
        <div
          className="absolute bottom-8 left-2 w-1 h-1 rounded-full bg-amber-200"
          style={{ boxShadow: "0 0 6px rgba(255, 215, 0, 0.4)" }}
        />
        <svg className="absolute inset-0 w-full h-full">
          <line
            x1="4"
            y1="76"
            x2="28"
            y2="60"
            stroke="rgba(255, 215, 0, 0.2)"
            strokeWidth="1"
          />
          <line
            x1="28"
            y1="60"
            x2="12"
            y2="44"
            stroke="rgba(255, 215, 0, 0.2)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="absolute bottom-8 right-8 w-20 h-20">
        <div
          className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-cyan-400"
          style={{ boxShadow: "0 0 10px rgba(0, 217, 255, 0.8)" }}
        />
        <div
          className="absolute bottom-4 right-6 w-1.5 h-1.5 rounded-full bg-cyan-300"
          style={{ boxShadow: "0 0 8px rgba(0, 217, 255, 0.6)" }}
        />
        <div
          className="absolute bottom-8 right-2 w-1 h-1 rounded-full bg-cyan-200"
          style={{ boxShadow: "0 0 6px rgba(0, 217, 255, 0.4)" }}
        />
        <svg className="absolute inset-0 w-full h-full">
          <line
            x1="76"
            y1="76"
            x2="52"
            y2="60"
            stroke="rgba(0, 217, 255, 0.2)"
            strokeWidth="1"
          />
          <line
            x1="52"
            y1="60"
            x2="68"
            y2="44"
            stroke="rgba(0, 217, 255, 0.2)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default LumerisLoadingScreen;
