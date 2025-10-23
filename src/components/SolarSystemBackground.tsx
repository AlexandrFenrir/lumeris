/**
 * 🌌 LEGENDARY CRYPTO-GAMING SOLAR SYSTEM
 * Three.js powered solar system with crypto themes
 * Bitcoin Sun + 8 Gaming/Crypto Planets
 */

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sphere, Ring, Text } from "@react-three/drei";
import * as THREE from "three";

// Planet configuration with crypto-gaming themes
interface PlanetConfig {
  name: string;
  size: number;
  distance: number;
  speed: number;
  color: string;
  emissive: string;
  crypto: string;
  feature: string;
  hasRings?: boolean;
  ringColor?: string;
  moons?: number;
  moonData?: string[];
  special?:
    | "trading"
    | "nft"
    | "arena"
    | "battle"
    | "whale"
    | "staking"
    | "defi"
    | "mystery";
}

const PLANETS: PlanetConfig[] = [
  {
    name: "Mercury",
    size: 0.4,
    distance: 5,
    speed: 0.047,
    color: "#C0C0C0",
    emissive: "#E8E8E8",
    crypto: "USDT",
    feature: "Speed Trading",
    special: "trading",
    moons: 2,
    moonData: ["$1.00", "24h"],
  },
  {
    name: "Venus",
    size: 0.6,
    distance: 7,
    speed: 0.035,
    color: "#FF1493",
    emissive: "#FF69B4",
    crypto: "NFT",
    feature: "NFT Gallery",
    special: "nft",
    moons: 3,
    moonData: ["Art", "Rare", "Epic"],
  },
  {
    name: "Earth",
    size: 0.7,
    distance: 9,
    speed: 0.029,
    color: "#9333EA",
    emissive: "#F59E0B",
    crypto: "LUMERIS",
    feature: "Arena Core",
    special: "arena",
    moons: 1,
    moonData: ["Lumeris"],
  },
  {
    name: "Mars",
    size: 0.5,
    distance: 11,
    speed: 0.024,
    color: "#EF4444",
    emissive: "#FF0000",
    crypto: "WAR",
    feature: "Battle Zone",
    special: "battle",
    moons: 2,
    moonData: ["⚔️", "💥"],
  },
  {
    name: "Jupiter",
    size: 1.4,
    distance: 15,
    speed: 0.013,
    color: "#F59E0B",
    emissive: "#FFD700",
    crypto: "BTC",
    feature: "Whale Wallet",
    special: "whale",
    hasRings: true,
    ringColor: "#FFD700",
    moons: 4,
    moonData: ["₿", "💰", "🐋", "💎"],
  },
  {
    name: "Saturn",
    size: 1.1,
    distance: 19,
    speed: 0.009,
    color: "#9333EA",
    emissive: "#A855F7",
    crypto: "STAKE",
    feature: "Staking Rings",
    special: "staking",
    hasRings: true,
    ringColor: "#F59E0B",
    moons: 3,
    moonData: ["12%", "APY", "🔒"],
  },
  {
    name: "Uranus",
    size: 0.9,
    distance: 23,
    speed: 0.007,
    color: "#06B6D4",
    emissive: "#22D3EE",
    crypto: "DeFi",
    feature: "DeFi Protocol",
    special: "defi",
    hasRings: true,
    ringColor: "#06B6D4",
    moons: 2,
    moonData: ["LP", "SWAP"],
  },
  {
    name: "Neptune",
    size: 0.85,
    distance: 27,
    speed: 0.005,
    color: "#1E40AF",
    emissive: "#3B82F6",
    crypto: "MYSTERY",
    feature: "Mystery Rewards",
    special: "mystery",
    moons: 3,
    moonData: ["?", "🎁", "✨"],
  },
];

// Bitcoin Sun with liquid gold shader and plasma corona
function BitcoinSun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create corona particles
  const coronaParticles = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Purple-gold gradient
      const t = Math.random();
      colors[i3] = t > 0.5 ? 1 : 0.58; // R
      colors[i3 + 1] = t > 0.5 ? 0.84 : 0.2; // G
      colors[i3 + 2] = t > 0.5 ? 0 : 0.92; // B
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate sun
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }

    // Pulse corona
    if (coronaRef.current) {
      const pulse = Math.sin(time * 1.5) * 0.15 + 1;
      coronaRef.current.scale.setScalar(pulse);
    }

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <group>
      {/* Core Sun - Liquid Gold */}
      <Sphere ref={sunRef} args={[2.5, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FF8C00"
          emissiveIntensity={3}
          metalness={0.9}
          roughness={0.1}
          toneMapped={false}
        />
      </Sphere>

      {/* Inner Glow Layer 1 - Bright Orange */}
      <Sphere args={[2.8, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#FF8C00"
          transparent
          opacity={0.7}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Inner Glow Layer 2 - Gold */}
      <Sphere args={[3.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.5}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Middle Corona - Purple */}
      <Sphere ref={coronaRef} args={[3.8, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#9333EA"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer Corona - Purple Plasma */}
      <Sphere args={[4.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#A855F7"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Corona Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={coronaParticles.positions.length / 3}
            array={coronaParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={coronaParticles.colors.length / 3}
            array={coronaParticles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Bitcoin Symbol */}
      <Text
        position={[0, 0, 2.6]}
        fontSize={1}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#FF8C00"
      >
        ₿
      </Text>

      {/* Main Light Source */}
      <pointLight
        position={[0, 0, 0]}
        intensity={4}
        distance={150}
        color="#FFD700"
        castShadow
      />

      {/* Additional Warm Light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={80}
        color="#FF8C00"
      />
    </group>
  );
}

// Enhanced Planet with special effects
function Planet({ config, index }: { config: PlanetConfig; index: number }) {
  const planetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (planetRef.current) {
      // Orbit around sun
      const angle =
        time * config.speed + (index * Math.PI * 2) / PLANETS.length;
      planetRef.current.position.x = Math.cos(angle) * config.distance;
      planetRef.current.position.z = Math.sin(angle) * config.distance;
      planetRef.current.position.y = Math.sin(angle * 0.5) * 0.5; // Slight vertical movement
    }

    if (meshRef.current) {
      // Rotate planet
      meshRef.current.rotation.y += 0.005;
    }

    if (glowRef.current) {
      // Pulse glow
      const pulse = Math.sin(time * 2 + index) * 0.1 + 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={planetRef}>
      {/* Planet Sphere */}
      <Sphere ref={meshRef} args={[config.size, 32, 32]}>
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={1.5}
          metalness={0.7}
          roughness={0.4}
          toneMapped={false}
        />
      </Sphere>

      {/* Inner Glow Effect */}
      <Sphere args={[config.size * 1.15, 16, 16]}>
        <meshBasicMaterial
          color={config.emissive}
          transparent
          opacity={0.6}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer Glow Effect */}
      <Sphere ref={glowRef} args={[config.size * 1.4, 16, 16]}>
        <meshBasicMaterial
          color={config.emissive}
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Point Light from planet */}
      <pointLight
        color={config.emissive}
        intensity={1.5}
        distance={config.size * 8}
      />

      {/* Special Effects based on planet type */}
      {config.special === "arena" && (
        <Text
          position={[0, 0, config.size + 0.1]}
          fontSize={0.3}
          color="#F59E0B"
          anchorX="center"
          anchorY="middle"
        >
          Lumeris
        </Text>
      )}

      {config.special === "battle" && (
        <>
          {/* Battle explosions */}
          <Sphere
            args={[config.size * 0.4, 8, 8]}
            position={[config.size * 0.9, 0, 0]}
          >
            <meshBasicMaterial color="#FF0000" transparent opacity={0.8} />
          </Sphere>
          <Sphere
            args={[config.size * 0.35, 8, 8]}
            position={[-config.size * 0.8, config.size * 0.3, 0]}
          >
            <meshBasicMaterial color="#FF4500" transparent opacity={0.7} />
          </Sphere>
          <Sphere
            args={[config.size * 0.3, 8, 8]}
            position={[0, -config.size * 0.7, config.size * 0.6]}
          >
            <meshBasicMaterial color="#FF6600" transparent opacity={0.6} />
          </Sphere>
          <pointLight
            position={[config.size * 0.9, 0, 0]}
            color="#FF0000"
            intensity={2}
            distance={5}
          />
        </>
      )}

      {config.special === "nft" && (
        <>
          {/* Rainbow shimmer layers */}
          <Sphere args={[config.size * 1.25, 16, 16]}>
            <meshBasicMaterial
              color="#FF00FF"
              transparent
              opacity={0.5}
              side={THREE.BackSide}
            />
          </Sphere>
          <Sphere args={[config.size * 1.35, 16, 16]}>
            <meshBasicMaterial
              color="#00FFFF"
              transparent
              opacity={0.4}
              side={THREE.BackSide}
            />
          </Sphere>
          <Sphere args={[config.size * 1.45, 16, 16]}>
            <meshBasicMaterial
              color="#FFFF00"
              transparent
              opacity={0.3}
              side={THREE.BackSide}
            />
          </Sphere>
        </>
      )}

      {/* Rings (Jupiter, Saturn, Uranus) */}
      {config.hasRings && (
        <group rotation={[Math.PI / 2.5, 0, 0]}>
          {/* Main Ring */}
          <Ring args={[config.size * 1.6, config.size * 2.4, 64]}>
            <meshStandardMaterial
              color={config.ringColor || config.color}
              emissive={config.ringColor || config.emissive}
              emissiveIntensity={1.2}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </Ring>
          {/* Middle Ring */}
          <Ring args={[config.size * 1.3, config.size * 1.55, 64]}>
            <meshStandardMaterial
              color={config.ringColor || config.color}
              emissive={config.ringColor || config.emissive}
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </Ring>
          {/* Inner Ring Glow */}
          <Ring args={[config.size * 2.5, config.size * 2.8, 64]}>
            <meshBasicMaterial
              color={config.ringColor || config.emissive}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </Ring>
        </group>
      )}

      {/* Whale Planet Special: Floating Coins */}
      {config.special === "whale" && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = config.size * 2;
            return (
              <Sphere
                key={i}
                args={[0.15, 16, 16]}
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle * 2) * 0.3,
                  Math.sin(angle) * radius,
                ]}
              >
                <meshStandardMaterial
                  color="#FFD700"
                  emissive="#FFD700"
                  emissiveIntensity={1.5}
                  metalness={1}
                  roughness={0.1}
                  toneMapped={false}
                />
              </Sphere>
            );
          })}
        </>
      )}

      {/* Staking Planet Special: Lock Symbols */}
      {config.special === "staking" && (
        <>
          <Text
            position={[0, config.size * 1.2, 0]}
            fontSize={0.4}
            color="#F59E0B"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            🔒
          </Text>
        </>
      )}

      {/* DeFi Planet Special: Wireframe Effect */}
      {config.special === "defi" && (
        <>
          <Sphere args={[config.size * 1.3, 16, 16]}>
            <meshBasicMaterial
              color="#06B6D4"
              wireframe
              transparent
              opacity={0.6}
            />
          </Sphere>
        </>
      )}

      {/* Mystery Planet Special: Question Marks */}
      {config.special === "mystery" && (
        <>
          <Text
            position={[0, config.size * 1.1, 0]}
            fontSize={0.5}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#1E40AF"
          >
            ?
          </Text>
        </>
      )}

      {/* Trading Planet Special: Fast Moving Particles */}
      {config.special === "trading" && (
        <>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = config.size * 1.5;
            return (
              <Sphere
                key={i}
                args={[0.08, 8, 8]}
                position={[
                  Math.cos(angle) * radius,
                  0,
                  Math.sin(angle) * radius,
                ]}
              >
                <meshBasicMaterial color="#C0C0C0" transparent opacity={0.8} />
              </Sphere>
            );
          })}
        </>
      )}

      {/* Moons with crypto prices */}
      {config.moons &&
        config.moonData &&
        Array.from({ length: config.moons }).map((_, i) => (
          <CryptoMoon
            key={i}
            planetSize={config.size}
            moonIndex={i}
            totalMoons={config.moons!}
            label={config.moonData![i] || ""}
            color={config.emissive}
          />
        ))}

      {/* Orbit Path */}
      <OrbitPath distance={config.distance} color={config.emissive} />
    </group>
  );
}

// Crypto Moon with price labels
function CryptoMoon({
  planetSize,
  moonIndex,
  totalMoons,
  label,
  color,
}: {
  planetSize: number;
  moonIndex: number;
  totalMoons: number;
  label: string;
  color: string;
}) {
  const moonRef = useRef<THREE.Group>(null);
  const moonMeshRef = useRef<THREE.Mesh>(null);
  const moonDistance = planetSize * 2.5;

  useFrame((state) => {
    if (moonRef.current) {
      // Orbit around planet
      const angle =
        state.clock.elapsedTime * 1.5 + (moonIndex * Math.PI * 2) / totalMoons;
      moonRef.current.position.x = Math.cos(angle) * moonDistance;
      moonRef.current.position.z = Math.sin(angle) * moonDistance;
      moonRef.current.position.y = Math.sin(angle * 2) * 0.3;
    }

    if (moonMeshRef.current) {
      // Rotate moon on its own axis
      moonMeshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={moonRef}>
      {/* Moon Sphere */}
      <Sphere ref={moonMeshRef} args={[planetSize * 0.3, 16, 16]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          metalness={0.6}
          roughness={0.3}
          toneMapped={false}
        />
      </Sphere>

      {/* Moon Glow */}
      <Sphere args={[planetSize * 0.4, 16, 16]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Price/Label Text */}
      <Text
        position={[0, planetSize * 0.5, 0]}
        fontSize={0.2}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* Moon Light */}
      <pointLight color={color} intensity={0.8} distance={3} />
    </group>
  );
}

// Orbit Path with color
function OrbitPath({ distance, color }: { distance: number; color: string }) {
  const points = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0,
      0,
      distance,
      distance,
      0,
      2 * Math.PI,
      false,
      0
    );
    const pts = curve.getPoints(100);
    return pts.map((p) => new THREE.Vector3(p.x, 0, p.y));
  }, [distance]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </line>
  );
}

// Main Scene
function SolarSystemScene() {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />

      {/* Hemisphere Light for better visibility */}
      <hemisphereLight color="#9333EA" groundColor="#F59E0B" intensity={0.5} />

      {/* Stars Background */}
      <Stars
        radius={300}
        depth={80}
        count={10000}
        factor={10}
        saturation={0.2}
        fade
        speed={2}
      />

      {/* Bitcoin Sun */}
      <BitcoinSun />

      {/* Planets */}
      {PLANETS.map((planet, index) => (
        <Planet key={planet.name} config={planet} index={index} />
      ))}

      {/* Camera Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={60}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
}

// Main Component
export function SolarSystemBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 20, 30], fov: 65 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: "transparent" }}
      >
        <SolarSystemScene />
      </Canvas>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(15, 10, 30, 0.4) 70%, rgba(15, 10, 30, 0.7) 100%)",
        }}
      />
    </div>
  );
}
