/**
 * 🌀 PORTAL WALLET BUTTON
 * Stargate-style 3D portal for wallet connection
 * Features: Rotating golden rings, purple energy, particle effects
 */

import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EnhancedWalletModal } from "./EnhancedWalletModal";

// Rotating Ring Component
function RotatingRing({
  radius,
  speed,
  color,
  runeCount,
}: {
  radius: number;
  speed: number;
  color: string;
  runeCount: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const runesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += speed;
    }
    if (runesRef.current) {
      runesRef.current.rotation.z += speed;
    }
  });

  // Create runes (small glowing symbols on the ring)
  const runes = useMemo(() => {
    const runePositions = [];
    for (let i = 0; i < runeCount; i++) {
      const angle = (i / runeCount) * Math.PI * 2;
      runePositions.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotation: angle,
      });
    }
    return runePositions;
  }, [runeCount, radius]);

  return (
    <group>
      {/* Main Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.08, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Runes on Ring */}
      <group ref={runesRef}>
        {runes.map((rune, i) => (
          <mesh
            key={i}
            position={[rune.x, rune.y, 0]}
            rotation={[0, 0, rune.rotation]}
          >
            <boxGeometry args={[0.1, 0.15, 0.05]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={1}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Energy Swirl Component
function EnergySwirlParticles({
  isHovered,
  isClicked,
}: {
  isHovered: boolean;
  isClicked: boolean;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 2 + 0.5;
      const height = (Math.random() - 0.5) * 0.5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = height;

      velocities.push({
        angle: angle,
        radius: radius,
        speed: Math.random() * 0.02 + 0.01,
      });
    }

    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const speedMultiplier = isClicked ? 5 : isHovered ? 2 : 1;

      particles.velocities.forEach((vel, i) => {
        // Spiral inward effect
        vel.angle += vel.speed * speedMultiplier;
        vel.radius -= 0.01 * speedMultiplier;

        // Reset if too close to center
        if (vel.radius < 0.2) {
          vel.radius = 2.5;
          vel.angle = Math.random() * Math.PI * 2;
        }

        positions[i * 3] = Math.cos(vel.angle) * vel.radius;
        positions[i * 3 + 1] = Math.sin(vel.angle) * vel.radius;
      });

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#9333EA"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Energy Core Component (with wallet icon in center)
function EnergyCore({
  isHovered,
  isClicked,
}: {
  isHovered: boolean;
  isClicked: boolean;
}) {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      const scale = isClicked ? 2 : isHovered ? 1.3 : 1;
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1;
      coreRef.current.scale.setScalar(scale * pulse);
    }
  });

  return (
    <mesh ref={coreRef}>
      <circleGeometry args={[0.8, 32]} />
      <meshStandardMaterial
        color="#9333EA"
        emissive="#9333EA"
        emissiveIntensity={isClicked ? 2 : isHovered ? 1.5 : 1}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

// Portal Scene Component
function PortalScene({
  isHovered,
  isClicked,
}: {
  isHovered: boolean;
  isClicked: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Camera zoom effect on click
      if (isClicked) {
        groupRef.current.scale.setScalar(1.5);
      } else if (isHovered) {
        groupRef.current.scale.setScalar(1.1);
      } else {
        groupRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#9333EA" />

      {/* Energy Core */}
      <EnergyCore isHovered={isHovered} isClicked={isClicked} />

      {/* Rotating Golden Rings with Runes */}
      <RotatingRing radius={1.5} speed={0.01} color="#F59E0B" runeCount={12} />
      <RotatingRing
        radius={1.8}
        speed={-0.015}
        color="#FFD700"
        runeCount={16}
      />
      <RotatingRing radius={2.1} speed={0.008} color="#F59E0B" runeCount={20} />

      {/* Energy Swirl Particles */}
      <EnergySwirlParticles isHovered={isHovered} isClicked={isClicked} />
    </group>
  );
}

// Main Portal Wallet Button Component
export function PortalWalletButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    // Show modal immediately
    setShowWalletModal(true);
    // Reset click animation
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  const handleModalClose = () => {
    setShowWalletModal(false);
  };

  return (
    <div className="relative">
      {/* Portal Button Container */}
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{
          width: "200px",
          height: "200px",
          transition: "transform 0.3s ease",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        {/* 3D Portal Canvas */}
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent",
          }}
        >
          <PortalScene isHovered={isHovered} isClicked={isClicked} />
        </Canvas>

        {/* Futuristic Wallet Icon in Center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`,
            transition: "transform 0.3s ease",
          }}
        >
          {/* Hexagonal Container */}
          <div className="relative w-10 h-10">
            {/* Outer Hex Glow */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{
                filter: "drop-shadow(0 0 12px rgba(147, 51, 234, 0.9))",
              }}
            >
              <polygon
                points="50,5 90,30 90,70 50,95 10,70 10,30"
                fill="rgba(147, 51, 234, 0.15)"
                stroke="rgba(147, 51, 234, 0.8)"
                strokeWidth="2"
              />
            </svg>

            {/* Inner Hex */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{
                filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))",
              }}
            >
              <polygon
                points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5"
                fill="rgba(245, 158, 11, 0.1)"
                stroke="rgba(245, 158, 11, 0.6)"
                strokeWidth="1.5"
              />
            </svg>

            {/* Wallet Icon (W) */}
            <div
              className="absolute inset-0 flex items-center justify-center font-bold"
              style={{
                fontSize: "20px",
                background: "linear-gradient(135deg, #9333EA 0%, #F59E0B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 20px rgba(147, 51, 234, 0.8)",
                fontFamily: "monospace",
                letterSpacing: "-2px",
              }}
            >
              W
            </div>

            {/* Rotating Energy Ring */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{
                animation: "spin 4s linear infinite",
              }}
            >
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="rgba(147, 51, 234, 0.4)"
                strokeWidth="1"
                strokeDasharray="10 5"
              />
            </svg>
          </div>
        </div>

        {/* Glowing Text Overlay */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 whitespace-nowrap pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            className="text-sm font-bold tracking-wider"
            style={{
              background:
                "linear-gradient(90deg, #F59E0B 0%, #FFD700 50%, #F59E0B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 20px rgba(245, 158, 11, 0.8)",
              filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))",
            }}
          >
            CONNECT WALLET
          </div>
        </div>

        {/* Outer Glow Effect */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)",
            filter: "blur(30px)",
            opacity: isHovered ? 1 : 0.5,
            transition: "opacity 0.3s ease",
            transform: "scale(1.2)",
          }}
        />

        {/* Magnetic Pull Effect Ring */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-full border-2 pointer-events-none"
            style={{
              borderColor: "#F59E0B",
              animation: "pulse 1.5s ease-in-out infinite",
              boxShadow: "0 0 30px rgba(245, 158, 11, 0.6)",
            }}
          />
        )}

        {/* Epic Particle Explosion on Click */}
        {isClicked && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(245, 158, 11, 0.8) 0%, transparent 60%)",
              animation: "explosion 0.8s ease-out forwards",
            }}
          />
        )}
      </div>

      {/* Enhanced Wallet Modal */}
      <EnhancedWalletModal
        isOpen={showWalletModal}
        onClose={handleModalClose}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
        }

        @keyframes explosion {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        @keyframes portalZoom {
          0% {
            transform: scale(0.1);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
