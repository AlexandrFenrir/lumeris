/**
 * 🌀 LEGENDARY PORTAL BUTTON
 * 3D Portal for wallet connection with Three.js
 */

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WalletConnect } from "./WalletConnect";

// Portal Ring Component
function PortalRing({
  radius,
  speed,
  color,
  delay,
}: {
  radius: number;
  speed: number;
  color: string;
  delay: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed + delay;
      const pulse = Math.sin(state.clock.elapsedTime * 2 + delay) * 0.1 + 1;
      ringRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.05, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        metalness={0.8}
        roughness={0.2}
        toneMapped={false}
      />
    </mesh>
  );
}

// Portal Energy Component
function PortalEnergy({ isHovered }: { isHovered: boolean }) {
  const energyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (energyRef.current) {
      energyRef.current.rotation.z = state.clock.elapsedTime * 0.5;
      const intensity = isHovered ? 1.5 : 1;
      const scale =
        (Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1) * intensity;
      energyRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={energyRef}>
      <circleGeometry args={[1.5, 64]} />
      <meshBasicMaterial
        color="#9333EA"
        transparent
        opacity={isHovered ? 0.6 : 0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Particle System
function PortalParticles({ isHovered }: { isHovered: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useRef(
    Array.from({ length: 100 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.05 + 0.02
      ),
    }))
  ).current;

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      particles.forEach((particle, i) => {
        // Update position
        particle.position.add(particle.velocity);

        // Reset if too far
        if (particle.position.z > 2) {
          particle.position.z = -2;
          particle.position.x = (Math.random() - 0.5) * 4;
          particle.position.y = (Math.random() - 0.5) * 4;
        }

        // Spiral effect when hovered
        if (isHovered) {
          const angle = Math.atan2(particle.position.y, particle.position.x);
          const radius = Math.sqrt(
            particle.position.x ** 2 + particle.position.y ** 2
          );
          particle.position.x = Math.cos(angle + 0.05) * radius * 0.98;
          particle.position.y = Math.sin(angle + 0.05) * radius * 0.98;
        }

        positions[i * 3] = particle.position.x;
        positions[i * 3 + 1] = particle.position.y;
        positions[i * 3 + 2] = particle.position.z;
      });

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const positions = new Float32Array(
    particles.flatMap((p) => [p.position.x, p.position.y, p.position.z])
  );

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#F59E0B"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Portal Scene
function PortalScene({ isHovered }: { isHovered: boolean }) {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 2]} intensity={1} color="#9333EA" />

      {/* Portal Energy */}
      <PortalEnergy isHovered={isHovered} />

      {/* Portal Rings */}
      <PortalRing radius={1.8} speed={1} color="#9333EA" delay={0} />
      <PortalRing
        radius={2.0}
        speed={-0.8}
        color="#F59E0B"
        delay={Math.PI / 3}
      />
      <PortalRing
        radius={2.2}
        speed={0.6}
        color="#06B6D4"
        delay={Math.PI / 1.5}
      />

      {/* Particles */}
      <PortalParticles isHovered={isHovered} />
    </>
  );
}

// Main Component
export function LegendaryPortalButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowWallet(true)}
    >
      {/* 3D Portal Canvas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          width: "200px",
          height: "200px",
          transform: "translate(-50px, -70px)",
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <PortalScene isHovered={isHovered} />
        </Canvas>
      </div>

      {/* Wallet Connect Component */}
      <div
        className={`relative z-10 transition-all duration-300 ${
          isHovered ? "scale-110" : "scale-100"
        }`}
      >
        <WalletConnect />
      </div>

      {/* Glow Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 -z-10 blur-2xl opacity-50 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, transparent 70%)",
            transform: "scale(1.5)",
          }}
        />
      )}

      {/* Text Label */}
      <div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div
          className="text-sm font-bold tracking-wider"
          style={{
            background: "linear-gradient(to right, #9333EA, #F59E0B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 20px rgba(147, 51, 234, 0.5)",
          }}
        >
          ENTER THE ARENA
        </div>
      </div>
    </div>
  );
}
