import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { usePerformance } from "@/contexts/PerformanceContext";

// Diamond Nexus Earth Background for Landing Page
// Features: Diamond-faceted Earth, gold continents, silver oceans, orbiting treasures, wealth particles

// Central Earth Globe with diamond facets and metallic continents
function DiamondEarth() {
  const earthRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }

    // Pulsing core
    if (coreRef.current) {
      const pulse = Math.sin(time * 2) * 0.05 + 1;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={earthRef} position={[0, 0, 0]}>
      {/* Glowing Core - Visible through transparency */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color="#F59E0B"
          emissive="#9333EA"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Main Earth - Diamond Faceted with Gold Continents */}
      <mesh>
        <icosahedronGeometry args={[4, 2]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#F59E0B"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Silver Ocean Layer */}
      <mesh>
        <sphereGeometry args={[4.1, 64, 64]} />
        <meshStandardMaterial
          color="#C0C0C0"
          emissive="#E8E8E8"
          emissiveIntensity={0.3}
          metalness={0.95}
          roughness={0.1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Diamond Crystal Overlay */}
      <mesh>
        <icosahedronGeometry args={[4.2, 1]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#06B6D4"
          emissiveIntensity={0.4}
          metalness={1}
          roughness={0}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Atmospheric Glow - Purple/Gold */}
      <mesh>
        <sphereGeometry args={[4.8, 32, 32]} />
        <meshBasicMaterial
          color="#9333EA"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Atmosphere - Gold */}
      <mesh>
        <sphereGeometry args={[5.2, 32, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Inner Ring - Fast rotating gold coins
function GoldCoinRing() {
  const ringRef = useRef<THREE.Group>(null);
  const { settings } = usePerformance();

  const coins = useMemo(() => {
    const count = settings.particleCount > 1000 ? 24 : 12;
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      offset: Math.random() * 0.5,
    }));
  }, [settings.particleCount]);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.015;
      ringRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={ringRef}>
      {coins.map((coin, i) => {
        const radius = 7;
        const x = Math.cos(coin.angle) * radius;
        const z = Math.sin(coin.angle) * radius;

        return (
          <mesh
            key={i}
            position={[x, coin.offset, z]}
            rotation={[0, coin.angle, 0]}
          >
            <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#F59E0B"
              emissiveIntensity={0.8}
              metalness={1}
              roughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Middle Ring - Medium speed diamonds and gems
function DiamondGemRing() {
  const ringRef = useRef<THREE.Group>(null);
  const { settings } = usePerformance();

  const gems = useMemo(() => {
    const count = settings.particleCount > 1000 ? 18 : 9;
    const colors = ["#FFFFFF", "#FF1493", "#06B6D4", "#10B981", "#F59E0B"];
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      offset: (Math.random() - 0.5) * 2,
      color: colors[i % colors.length],
      size: 0.3 + Math.random() * 0.2,
    }));
  }, [settings.particleCount]);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y -= 0.01;
      ringRef.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <group ref={ringRef}>
      {gems.map((gem, i) => {
        const radius = 10;
        const x = Math.cos(gem.angle) * radius;
        const z = Math.sin(gem.angle) * radius;

        return (
          <mesh
            key={i}
            position={[x, gem.offset, z]}
            rotation={[0, gem.angle, Math.PI / 4]}
          >
            <octahedronGeometry args={[gem.size, 0]} />
            <meshStandardMaterial
              color={gem.color}
              emissive={gem.color}
              emissiveIntensity={1}
              metalness={1}
              roughness={0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Outer Ring - Slow rotating silver bars and treasure chests
function TreasureRing() {
  const ringRef = useRef<THREE.Group>(null);
  const { settings } = usePerformance();

  const treasures = useMemo(() => {
    const count = settings.particleCount > 1000 ? 12 : 6;
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      offset: (Math.random() - 0.5) * 3,
      type: i % 2 === 0 ? "bar" : "chest",
    }));
  }, [settings.particleCount]);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.005;
      ringRef.current.rotation.x =
        Math.cos(state.clock.elapsedTime * 0.4) * 0.12;
    }
  });

  return (
    <group ref={ringRef}>
      {treasures.map((treasure, i) => {
        const radius = 13;
        const x = Math.cos(treasure.angle) * radius;
        const z = Math.sin(treasure.angle) * radius;

        if (treasure.type === "bar") {
          // Silver Bar
          return (
            <mesh
              key={i}
              position={[x, treasure.offset, z]}
              rotation={[0, treasure.angle, 0]}
            >
              <boxGeometry args={[0.8, 0.3, 0.4]} />
              <meshStandardMaterial
                color="#C0C0C0"
                emissive="#E8E8E8"
                emissiveIntensity={0.6}
                metalness={1}
                roughness={0.1}
              />
            </mesh>
          );
        } else {
          // Treasure Chest
          return (
            <group
              key={i}
              position={[x, treasure.offset, z]}
              rotation={[0, treasure.angle, 0]}
            >
              {/* Chest Base */}
              <mesh>
                <boxGeometry args={[0.6, 0.4, 0.5]} />
                <meshStandardMaterial
                  color="#F59E0B"
                  emissive="#FFD700"
                  emissiveIntensity={0.5}
                  metalness={0.8}
                />
              </mesh>
              {/* Chest Lid */}
              <mesh position={[0, 0.3, 0]} rotation={[-0.3, 0, 0]}>
                <boxGeometry args={[0.6, 0.2, 0.5]} />
                <meshStandardMaterial
                  color="#9333EA"
                  emissive="#A855F7"
                  emissiveIntensity={0.6}
                  metalness={0.7}
                />
              </mesh>
            </group>
          );
        }
      })}
    </group>
  );
}

// Floating wealth particles - gold dust, diamonds, crypto symbols
function WealthParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const { settings } = usePerformance();

  const particleData = useMemo(() => {
    const count = Math.min(3000, settings.particleCount * 1.5);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 15 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Color variety: gold, silver, diamond white, purple
      const colorType = Math.random();
      if (colorType < 0.4) {
        // Gold
        colors[i3] = 1;
        colors[i3 + 1] = 0.84;
        colors[i3 + 2] = 0;
      } else if (colorType < 0.6) {
        // Silver
        colors[i3] = 0.75;
        colors[i3 + 1] = 0.75;
        colors[i3 + 2] = 0.75;
      } else if (colorType < 0.8) {
        // Diamond white
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else {
        // Purple
        colors[i3] = 0.58;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.92;
      }

      sizes[i] = Math.random() * 0.15 + 0.05;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    return geometry;
  }, [settings.particleCount]);

  // Cleanup geometry on unmount or when particleCount changes
  useEffect(() => {
    return () => {
      if (particleData) {
        particleData.dispose();
      }
    };
  }, [particleData]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0002;

      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} geometry={particleData}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Energy waves pulsing from Earth
function EnergyWaves() {
  const wave1Ref = useRef<THREE.Mesh>(null);
  const wave2Ref = useRef<THREE.Mesh>(null);
  const wave3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (wave1Ref.current) {
      const scale = (Math.sin(time * 1.5) * 0.5 + 1.5) * 1.5;
      wave1Ref.current.scale.setScalar(scale);
      wave1Ref.current.material.opacity = 0.3 - (scale - 1.5) * 0.2;
    }

    if (wave2Ref.current) {
      const scale = (Math.sin(time * 1.5 + Math.PI * 0.66) * 0.5 + 1.5) * 1.5;
      wave2Ref.current.scale.setScalar(scale);
      wave2Ref.current.material.opacity = 0.3 - (scale - 1.5) * 0.2;
    }

    if (wave3Ref.current) {
      const scale = (Math.sin(time * 1.5 + Math.PI * 1.33) * 0.5 + 1.5) * 1.5;
      wave3Ref.current.scale.setScalar(scale);
      wave3Ref.current.material.opacity = 0.3 - (scale - 1.5) * 0.2;
    }
  });

  return (
    <group>
      <mesh ref={wave1Ref}>
        <torusGeometry args={[5, 0.1, 16, 100]} />
        <meshBasicMaterial
          color="#9333EA"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wave2Ref}>
        <torusGeometry args={[5, 0.1, 16, 100]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wave3Ref}>
        <torusGeometry args={[5, 0.1, 16, 100]} />
        <meshBasicMaterial
          color="#06B6D4"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Background stars
function BackgroundStars() {
  const starsRef = useRef<THREE.Points>(null);
  const { settings } = usePerformance();

  const starsGeometry = useMemo(() => {
    const count = Math.min(8000, settings.particleCount * 4);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
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
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Camera controller with mouse parallax
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
      camera.position.y = offset.y;
      camera.position.z = 25 + offset.z;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// Main scene
function DiamondNexusScene() {
  const { settings } = usePerformance();

  return (
    <>
      <CameraController />
      {settings.enableFog && <fog attach="fog" args={["#0A0118", 30, 100]} />}

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#F59E0B" />
      <pointLight position={[20, 10, 20]} intensity={2} color="#9333EA" />
      <pointLight position={[-20, -10, -20]} intensity={2} color="#06B6D4" />
      <pointLight position={[0, 20, 0]} intensity={1.5} color="#FFD700" />

      {/* Scene Elements */}
      <BackgroundStars />
      <DiamondEarth />
      <GoldCoinRing />
      <DiamondGemRing />
      <TreasureRing />
      <WealthParticles />
      <EnergyWaves />
    </>
  );
}

export function DiamondNexusEarthBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0A0118 0%, #1A0B2E 50%, #0F0A1E 100%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 25], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <DiamondNexusScene />
      </Canvas>
    </div>
  );
}
