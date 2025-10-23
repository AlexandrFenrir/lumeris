import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { usePerformance } from "@/contexts/PerformanceContext";

// 💰 LEGENDARY: Treasure Dimension Vault
// Epic DeFi vault with money printers, liquid gold pools, yield farms, and massive treasure

// Liquid Gold Pools Flowing in Zero Gravity
function LiquidGoldPools() {
  const poolsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (poolsRef.current) {
      poolsRef.current.rotation.y += 0.002;
      poolsRef.current.children.forEach((child, index) => {
        const wave = Math.sin(state.clock.elapsedTime * 2 + index) * 0.5;
        child.position.y = wave;
        child.rotation.x = Math.sin(state.clock.elapsedTime + index) * 0.3;
      });
    }
  });

  return (
    <group ref={poolsRef}>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const isGold = i % 2 === 0;

        return (
          <group key={i} position={[x, 0, z]}>
            {/* Pool Container */}
            <mesh>
              <torusGeometry args={[3, 1, 16, 32]} />
              <meshStandardMaterial
                color={isGold ? "#F59E0B" : "#C0C0C0"}
                emissive={isGold ? "#F59E0B" : "#C0C0C0"}
                emissiveIntensity={0.7}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Liquid Surface */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[3, 32]} />
              <meshStandardMaterial
                color={isGold ? "#FFD700" : "#E8E8E8"}
                emissive={isGold ? "#FFD700" : "#E8E8E8"}
                emissiveIntensity={0.6}
                metalness={1}
                roughness={0}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Liquid Particles Rising */}
            {Array.from({ length: 20 }).map((_, j) => {
              const particleAngle = (j / 20) * Math.PI * 2;
              const particleRadius = Math.random() * 2;
              const px = Math.cos(particleAngle) * particleRadius;
              const pz = Math.sin(particleAngle) * particleRadius;
              const py = Math.random() * 5;

              return (
                <mesh key={j} position={[px, py, pz]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshStandardMaterial
                    color={isGold ? "#FFD700" : "#E8E8E8"}
                    emissive={isGold ? "#FFD700" : "#E8E8E8"}
                    emissiveIntensity={1}
                  />
                </mesh>
              );
            })}

            {/* Pool Glow */}
            <pointLight
              position={[0, 0, 0]}
              intensity={3}
              color={isGold ? "#FFD700" : "#E8E8E8"}
              distance={10}
            />
          </group>
        );
      })}
    </group>
  );
}

// Money Printer Machines
function MoneyPrinters() {
  const printersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (printersRef.current) {
      printersRef.current.children.forEach((child, index) => {
        const pulse = Math.sin(state.clock.elapsedTime * 3 + index) * 0.1 + 1;
        child.scale.set(pulse, pulse, pulse);
      });
    }
  });

  return (
    <group ref={printersRef}>
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 30;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, -5, z]} rotation={[0, -angle, 0]}>
            {/* Printer Body */}
            <mesh>
              <boxGeometry args={[4, 3, 3]} />
              <meshStandardMaterial
                color="#1a1a2e"
                emissive="#10B981"
                emissiveIntensity={0.4}
                metalness={0.8}
              />
            </mesh>

            {/* Printer Screen */}
            <mesh position={[0, 1, 1.6]}>
              <planeGeometry args={[2, 1]} />
              <meshStandardMaterial
                color="#10B981"
                emissive="#10B981"
                emissiveIntensity={0.8}
              />
            </mesh>

            {/* Money Bills Coming Out */}
            {Array.from({ length: 8 }).map((_, j) => (
              <mesh
                key={j}
                position={[0, 2 + j * 0.5, 2]}
                rotation={[0.2, 0, 0]}
              >
                <planeGeometry args={[1.5, 0.7]} />
                <meshStandardMaterial
                  color="#10B981"
                  emissive="#10B981"
                  emissiveIntensity={0.6}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}

            {/* Printer Glow */}
            <pointLight
              position={[0, 2, 2]}
              intensity={2}
              color="#10B981"
              distance={8}
            />
          </group>
        );
      })}
    </group>
  );
}

// Crystal Vaults Opening with Treasure
function CrystalVaults() {
  const vaultsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (vaultsRef.current) {
      vaultsRef.current.children.forEach((child, index) => {
        const door = child.children[1] as THREE.Mesh;
        if (door) {
          const openAngle = Math.sin(state.clock.elapsedTime + index) * 0.5;
          door.rotation.y = openAngle;
        }
      });
    }
  });

  return (
    <group ref={vaultsRef}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 35;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, -8, z]} rotation={[0, -angle, 0]}>
            {/* Vault Body */}
            <mesh>
              <boxGeometry args={[5, 8, 3]} />
              <meshStandardMaterial
                color="#9333EA"
                emissive="#9333EA"
                emissiveIntensity={0.5}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>

            {/* Vault Door */}
            <mesh position={[0, 0, 1.6]}>
              <boxGeometry args={[4, 7, 0.5]} />
              <meshStandardMaterial
                color="#F59E0B"
                emissive="#F59E0B"
                emissiveIntensity={0.6}
                metalness={1}
              />
            </mesh>

            {/* Treasure Inside - Gold Coins */}
            {Array.from({ length: 15 }).map((_, j) => {
              const tx = (Math.random() - 0.5) * 3;
              const ty = (Math.random() - 0.5) * 5;
              const tz = Math.random() * 2;

              return (
                <mesh key={j} position={[tx, ty, tz]}>
                  <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                  <meshStandardMaterial
                    color="#FFD700"
                    emissive="#FFD700"
                    emissiveIntensity={0.8}
                    metalness={1}
                  />
                </mesh>
              );
            })}

            {/* Vault Spotlight */}
            <spotLight
              position={[0, 10, 5]}
              angle={0.3}
              penumbra={0.5}
              intensity={2}
              color="#F59E0B"
            />
          </group>
        );
      })}
    </group>
  );
}

// Yield Farm - Growing Money Trees
function YieldFarms() {
  const farmsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (farmsRef.current) {
      farmsRef.current.children.forEach((child, index) => {
        const grow = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2 + 1;
        child.scale.y = grow;
      });
    }
  });

  return (
    <group ref={farmsRef}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 25;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, -10, z]}>
            {/* Tree Trunk */}
            <mesh>
              <cylinderGeometry args={[0.5, 0.7, 6, 16]} />
              <meshStandardMaterial
                color="#8B4513"
                emissive="#10B981"
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Tree Crown - Money Leaves */}
            <mesh position={[0, 4, 0]}>
              <sphereGeometry args={[2, 16, 16]} />
              <meshStandardMaterial
                color="#10B981"
                emissive="#10B981"
                emissiveIntensity={0.6}
                transparent
                opacity={0.8}
              />
            </mesh>

            {/* Money Fruits */}
            {Array.from({ length: 8 }).map((_, j) => {
              const fruitAngle = (j / 8) * Math.PI * 2;
              const fx = Math.cos(fruitAngle) * 1.5;
              const fz = Math.sin(fruitAngle) * 1.5;

              return (
                <mesh key={j} position={[fx, 4, fz]}>
                  <sphereGeometry args={[0.3, 16, 16]} />
                  <meshStandardMaterial
                    color="#FFD700"
                    emissive="#FFD700"
                    emissiveIntensity={1}
                    metalness={1}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

// Giant Rotating Coins (BTC, ETH, USDC)
function GiantCoins() {
  const coinsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (coinsRef.current) {
      coinsRef.current.children.forEach((child, index) => {
        child.rotation.y += 0.02;
        child.position.y = Math.sin(state.clock.elapsedTime + index * 2) * 3;
      });
    }
  });

  const coins = [
    { color: "#F59E0B", position: [-15, 10, 0], label: "BTC" },
    { color: "#9333EA", position: [0, 10, 0], label: "ETH" },
    { color: "#10B981", position: [15, 10, 0], label: "USDC" },
  ];

  return (
    <group ref={coinsRef}>
      {coins.map((coin, i) => (
        <group key={i} position={coin.position as [number, number, number]}>
          {/* Coin Body */}
          <mesh>
            <cylinderGeometry args={[4, 4, 0.8, 32]} />
            <meshStandardMaterial
              color={coin.color}
              emissive={coin.color}
              emissiveIntensity={0.7}
              metalness={1}
              roughness={0.1}
            />
          </mesh>

          {/* Coin Symbol */}
          <mesh position={[0, 0, 0.5]}>
            <circleGeometry args={[2, 32]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.9}
            />
          </mesh>

          {/* Coin Glow */}
          <pointLight
            position={[0, 0, 0]}
            intensity={4}
            color={coin.color}
            distance={15}
          />
        </group>
      ))}
    </group>
  );
}

// Staking Pillars with Energy Beams
function StakingPillars() {
  const pillarsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pillarsRef.current) {
      pillarsRef.current.children.forEach((child, index) => {
        const beam = child.children[1] as THREE.Mesh;
        if (beam) {
          const intensity =
            Math.sin(state.clock.elapsedTime * 3 + index) * 0.3 + 0.7;
          beam.scale.y = intensity;
          (beam.material as THREE.MeshStandardMaterial).emissiveIntensity =
            intensity;
        }
      });
    }
  });

  return (
    <group ref={pillarsRef}>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, -15, z]}>
            {/* Pillar Base */}
            <mesh>
              <cylinderGeometry args={[1, 1.5, 10, 16]} />
              <meshStandardMaterial
                color="#9333EA"
                emissive="#9333EA"
                emissiveIntensity={0.5}
                metalness={0.8}
              />
            </mesh>

            {/* Energy Beam Shooting Up */}
            <mesh position={[0, 15, 0]}>
              <cylinderGeometry args={[0.3, 0.5, 20, 16]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#06B6D4"
                emissiveIntensity={0.9}
                transparent
                opacity={0.7}
              />
            </mesh>

            {/* Staked Token on Top */}
            <mesh position={[0, 6, 0]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFD700"
                emissiveIntensity={1}
                metalness={1}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// APY Percentage Displays - Holographic Billboards
function APYBillboards() {
  const billboardsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (billboardsRef.current) {
      billboardsRef.current.rotation.y += 0.001;
    }
  });

  const apyValues = ["245%", "156%", "89%", "312%"];

  return (
    <group ref={billboardsRef}>
      {apyValues.map((apy, i) => {
        const angle = (i / apyValues.length) * Math.PI * 2;
        const radius = 40;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 5, z]} rotation={[0, -angle, 0]}>
            {/* Billboard Frame */}
            <mesh>
              <boxGeometry args={[8, 4, 0.3]} />
              <meshStandardMaterial
                color="#1a1a2e"
                emissive="#10B981"
                emissiveIntensity={0.4}
                metalness={0.7}
              />
            </mesh>

            {/* APY Display */}
            <mesh position={[0, 0, 0.2]}>
              <planeGeometry args={[7, 3]} />
              <meshStandardMaterial
                color="#10B981"
                emissive="#10B981"
                emissiveIntensity={0.8}
              />
            </mesh>

            {/* Billboard Glow */}
            <pointLight
              position={[0, 0, 1]}
              intensity={2}
              color="#10B981"
              distance={10}
            />
          </group>
        );
      })}
    </group>
  );
}

// Treasure Particles - Floating Gems and Coins
function TreasureParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particlesGeometry = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Gold, Silver, Purple colors
      const colorChoice = Math.random();
      if (colorChoice < 0.5) {
        colors[i3] = 1;
        colors[i3 + 1] = 0.84;
        colors[i3 + 2] = 0; // Gold
      } else if (colorChoice < 0.75) {
        colors[i3] = 0.75;
        colors[i3 + 1] = 0.75;
        colors[i3 + 2] = 0.75; // Silver
      } else {
        colors[i3] = 0.58;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.92; // Purple
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  // Cleanup geometry on unmount
  useEffect(() => {
    return () => {
      if (particlesGeometry) {
        particlesGeometry.dispose();
      }
    };
  }, [particlesGeometry]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.005;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Background Stars
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  const { settings } = usePerformance();

  const starsGeometry = useMemo(() => {
    const count = Math.min(8000, settings.particleCount * 4);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [settings.particleCount]);

  // Cleanup geometry on unmount or when particleCount changes
  useEffect(() => {
    return () => {
      if (starsGeometry) {
        starsGeometry.dispose();
      }
    };
  }, [starsGeometry]);

  return (
    <points ref={starsRef} geometry={starsGeometry}>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

// Camera Controller for Mouse Parallax
function CameraController() {
  const { camera } = useThree();
  const { getCameraOffset, isEnabled } = useMouseParallax({
    sensitivity: 0.4,
    smoothing: 0.08,
    maxOffset: 10,
  });

  useFrame(() => {
    if (isEnabled) {
      const offset = getCameraOffset();
      camera.position.x = offset.x;
      camera.position.y = 15 + offset.y;
      camera.position.z = 50 + offset.z;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function TreasureDimensionScene() {
  const { settings } = usePerformance();

  return (
    <>
      {/* Camera Controller */}
      <CameraController />

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 20, 0]} intensity={4} color="#FFD700" />
      <pointLight position={[30, 10, 30]} intensity={3} color="#10B981" />
      <pointLight position={[-30, 10, -30]} intensity={3} color="#9333EA" />
      <pointLight position={[0, -10, 0]} intensity={2} color="#F59E0B" />

      {/* Fog for Depth */}
      {settings.enableFog && <fog attach="fog" args={["#070512", 50, 180]} />}

      {/* Scene Elements - Layered */}
      <Stars />
      <LiquidGoldPools />
      <MoneyPrinters />
      <CrystalVaults />
      <YieldFarms />
      <GiantCoins />
      <StakingPillars />
      <APYBillboards />
      <TreasureParticles />
    </>
  );
}

export function TreasureDimensionBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #1a0b2e 0%, #0a0515 50%, #050208 100%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 15, 50], fov: 70 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <TreasureDimensionScene />
      </Canvas>
    </div>
  );
}
