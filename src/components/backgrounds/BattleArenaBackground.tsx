import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useMouseParallax } from "../../hooks/useMouseParallax";
import { usePerformance } from "../../contexts/PerformanceContext";

// 🎮 LEGENDARY: Interdimensional Battle Nexus
// Epic gaming arena with portals, champions, loot chests, and massive scale

// Camera Controller with Mouse Parallax
function CameraController() {
  const { camera } = useThree();
  const { getCameraOffset, isEnabled } = useMouseParallax({
    sensitivity: 0.3,
    smoothing: 0.08,
    maxOffset: 8,
  });

  useFrame(() => {
    if (isEnabled) {
      const offset = getCameraOffset();
      camera.position.x = offset.x;
      camera.position.y = 20 + offset.y;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// Massive Arena Stadium with Neon Stands
function ArenaStadium() {
  const stadiumRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (stadiumRef.current) {
      stadiumRef.current.rotation.y += 0.0005;
      const pulse = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 + 1;
      stadiumRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={stadiumRef}>
      {/* Outer Stadium Ring - MASSIVE */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <torusGeometry args={[40, 2, 16, 64]} />
        <meshStandardMaterial
          color="#9333EA"
          emissive="#9333EA"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Inner Battle Platform */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -4.5, 0]}>
        <cylinderGeometry args={[35, 35, 0.5, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#F59E0B"
          emissiveIntensity={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Spectator Stands - Glowing Sections */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * 45;
        const z = Math.sin(angle) * 45;

        return (
          <mesh key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[8, 15, 2]} />
            <meshStandardMaterial
              color={
                i % 3 === 0 ? "#9333EA" : i % 3 === 1 ? "#F59E0B" : "#06B6D4"
              }
              emissive={
                i % 3 === 0 ? "#9333EA" : i % 3 === 1 ? "#F59E0B" : "#06B6D4"
              }
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Portal Rifts to Different Game Worlds
function GamePortals() {
  const portalsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (portalsRef.current) {
      portalsRef.current.rotation.y += 0.003;
      portalsRef.current.children.forEach((child, index) => {
        const offset = index * 0.5;
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + offset) * 2;
      });
    }
  });

  const portals = [
    { color: "#9333EA", position: [25, 5, 0], name: "Fantasy" },
    { color: "#06B6D4", position: [-25, 5, 0], name: "Sci-Fi" },
    { color: "#F59E0B", position: [0, 5, 25], name: "Cyberpunk" },
    { color: "#10B981", position: [0, 5, -25], name: "Battle Royale" },
  ];

  return (
    <group ref={portalsRef}>
      {portals.map((portal, i) => (
        <group key={i} position={portal.position as [number, number, number]}>
          {/* Portal Ring */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[4, 0.3, 16, 32]} />
            <meshStandardMaterial
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={1}
              metalness={0.9}
            />
          </mesh>

          {/* Portal Energy Field */}
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[4, 32]} />
            <meshStandardMaterial
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Portal Glow */}
          <pointLight
            position={[0, 0, 0]}
            intensity={3}
            color={portal.color}
            distance={15}
          />
        </group>
      ))}
    </group>
  );
}

// Champion Holograms - Player Avatars
function ChampionHolograms() {
  const championsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (championsRef.current) {
      championsRef.current.children.forEach((child, index) => {
        child.rotation.y += 0.01;
        const float = Math.sin(state.clock.elapsedTime * 2 + index) * 0.5;
        child.position.y = 2 + float;
      });
    }
  });

  return (
    <group ref={championsRef}>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 2, z]}>
            {/* Champion Body */}
            <mesh>
              <capsuleGeometry args={[0.8, 2, 8, 16]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#06B6D4"
                emissiveIntensity={0.6}
                transparent
                opacity={0.7}
                wireframe
              />
            </mesh>

            {/* Champion Aura */}
            <mesh>
              <sphereGeometry args={[2, 16, 16]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? "#9333EA" : "#F59E0B"}
                emissive={i % 2 === 0 ? "#9333EA" : "#F59E0B"}
                emissiveIntensity={0.4}
                transparent
                opacity={0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Loot Chests Opening with Golden Light
function LootChests() {
  const chestsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (chestsRef.current) {
      chestsRef.current.children.forEach((child, index) => {
        const pulse = Math.sin(state.clock.elapsedTime * 3 + index) * 0.1 + 1;
        child.scale.set(pulse, pulse, pulse);
      });
    }
  });

  return (
    <group ref={chestsRef}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 30;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, -3, z]}>
            {/* Chest Base */}
            <mesh>
              <boxGeometry args={[2, 1.5, 1.5]} />
              <meshStandardMaterial
                color="#8B4513"
                emissive="#F59E0B"
                emissiveIntensity={0.3}
                metalness={0.4}
              />
            </mesh>

            {/* Chest Lid */}
            <mesh position={[0, 1, 0]} rotation={[-0.5, 0, 0]}>
              <boxGeometry args={[2, 0.3, 1.5]} />
              <meshStandardMaterial
                color="#8B4513"
                emissive="#F59E0B"
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Golden Light Beam */}
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.1, 0.5, 4, 8]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFD700"
                emissiveIntensity={1}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// XP Orbs Exploding with Particles
function XPOrbs() {
  const orbsRef = useRef<THREE.Points>(null);

  const orbsGeometry = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 10 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 5;
      positions[i3 + 2] = radius * Math.cos(phi);

      // XP colors: Purple, Gold, Cyan
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i3] = 0.58;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.92; // Purple
      } else if (colorChoice < 0.66) {
        colors[i3] = 0.96;
        colors[i3 + 1] = 0.62;
        colors[i3 + 2] = 0.04; // Gold
      } else {
        colors[i3] = 0.02;
        colors[i3 + 1] = 0.71;
        colors[i3 + 2] = 0.83; // Cyan
      }

      sizes[i] = Math.random() * 0.3 + 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return geometry;
  }, []);

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y += 0.002;
      const positions = orbsRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      }

      orbsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={orbsRef} geometry={orbsGeometry}>
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

// Trophy Towers - Giant Leaderboard
function TrophyTowers() {
  const towersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (towersRef.current) {
      towersRef.current.children.forEach((child, index) => {
        const pulse =
          Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.1 + 1;
        child.scale.y = pulse;
      });
    }
  });

  return (
    <group ref={towersRef}>
      {[1, 2, 3].map((rank) => {
        const x = (rank - 2) * 15;
        const height = rank === 1 ? 12 : rank === 2 ? 10 : 8;
        const color =
          rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : "#CD7F32";

        return (
          <group key={rank} position={[x, -10, -30]}>
            {/* Tower Pedestal */}
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[4, height, 4]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.6}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Trophy on Top */}
            <mesh position={[0, height + 2, 0]}>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                metalness={1}
              />
            </mesh>

            {/* Spotlight */}
            <spotLight
              position={[0, height + 10, 0]}
              angle={0.3}
              penumbra={0.5}
              intensity={3}
              color={color}
            />
          </group>
        );
      })}
    </group>
  );
}

// Energy Weapons Orbiting
function EnergyWeapons() {
  const weaponsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (weaponsRef.current) {
      weaponsRef.current.rotation.y += 0.004;
    }
  });

  return (
    <group ref={weaponsRef}>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 35;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.3) * 5;

        const weaponType = i % 3;
        const color =
          weaponType === 0
            ? "#9333EA"
            : weaponType === 1
              ? "#F59E0B"
              : "#06B6D4";

        return (
          <group
            key={i}
            position={[x, y, z]}
            rotation={[0, -angle, Math.PI / 4]}
          >
            {/* Sword/Weapon */}
            <mesh>
              <boxGeometry args={[0.3, 4, 0.3]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                metalness={0.9}
              />
            </mesh>

            {/* Weapon Glow Trail */}
            <mesh position={[0, 2, 0]}>
              <coneGeometry args={[0.5, 2, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.6}
                transparent
                opacity={0.4}
              />
            </mesh>
          </group>
        );
      })}
    </group>
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

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={starsRef} geometry={starsGeometry}>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function BattleArenaScene() {
  const { settings } = usePerformance();

  return (
    <>
      {/* Camera Controller with Mouse Parallax */}
      <CameraController />

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 20, 0]} intensity={4} color="#9333EA" />
      <pointLight position={[30, 10, 30]} intensity={3} color="#F59E0B" />
      <pointLight position={[-30, 10, -30]} intensity={3} color="#06B6D4" />
      <pointLight position={[0, -10, 0]} intensity={2} color="#10B981" />

      {/* Fog for Depth (Performance-aware) */}
      {settings.enableFog && <fog attach="fog" args={["#070512", 50, 150]} />}

      {/* Scene Elements - Layered for Depth */}
      <Stars />
      <ArenaStadium />
      <GamePortals />
      <ChampionHolograms />
      <LootChests />
      <XPOrbs />
      <TrophyTowers />
      <EnergyWeapons />
    </>
  );
}

export function BattleArenaBackground() {
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
        camera={{ position: [0, 20, 50], fov: 70 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <BattleArenaScene />
      </Canvas>
    </div>
  );
}
