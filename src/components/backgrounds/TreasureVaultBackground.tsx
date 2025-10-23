import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

// Treasure Vault Background for Daily Gift Page
// Features: Opening treasure chests, floating gift boxes, reward coins, daily streak calendar, magical sparkles, vault door

function TreasureChests() {
  const chestsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (chestsRef.current) {
      chestsRef.current.children.forEach((child, index) => {
        const bounce = Math.sin(state.clock.elapsedTime * 2 + index) * 0.3;
        child.position.y = bounce;
      });
    }
  });

  const chests = [
    { x: -10, z: 5, color: "#9333EA", open: true },
    { x: 0, z: 8, color: "#F59E0B", open: true },
    { x: 10, z: 5, color: "#06B6D4", open: false },
  ];

  return (
    <group ref={chestsRef}>
      {chests.map((chest, i) => (
        <group key={i} position={[chest.x, 0, chest.z]}>
          {/* Chest bottom */}
          <mesh>
            <boxGeometry args={[3, 2, 2.5]} />
            <meshStandardMaterial
              color={chest.color}
              emissive={chest.color}
              emissiveIntensity={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* Chest lid */}
          <mesh
            position={[0, chest.open ? 2.5 : 1, chest.open ? -1 : 0]}
            rotation={[chest.open ? -Math.PI / 3 : 0, 0, 0]}
          >
            <boxGeometry args={[3, 0.5, 2.5]} />
            <meshStandardMaterial
              color={chest.color}
              emissive={chest.color}
              emissiveIntensity={0.4}
              metalness={0.7}
            />
          </mesh>

          {/* Lock */}
          <mesh position={[0, 0.5, 1.3]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} />
          </mesh>

          {/* Light beam from open chests */}
          {chest.open && (
            <>
              <mesh position={[0, 5, 0]}>
                <cylinderGeometry args={[0.1, 1.5, 8, 16]} />
                <meshStandardMaterial
                  color={chest.color}
                  emissive={chest.color}
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.6}
                />
              </mesh>
              <pointLight
                position={[0, 3, 0]}
                intensity={3}
                color={chest.color}
                distance={15}
              />
            </>
          )}
        </group>
      ))}
    </group>
  );
}

function FloatingGiftBoxes() {
  const giftsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (giftsRef.current) {
      giftsRef.current.rotation.y += 0.003;
      giftsRef.current.children.forEach((child, index) => {
        child.rotation.y += 0.02;
        child.position.y =
          5 + Math.sin(state.clock.elapsedTime + index * 0.8) * 2;
      });
    }
  });

  return (
    <group ref={giftsRef}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const colors = ["#9333EA", "#F59E0B", "#06B6D4", "#10B981"];
        const color = colors[i % colors.length];

        return (
          <group key={i} position={[x, 5, z]}>
            {/* Gift box */}
            <mesh>
              <boxGeometry args={[1.5, 1.5, 1.5]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
                metalness={0.5}
              />
            </mesh>
            {/* Ribbon horizontal */}
            <mesh>
              <boxGeometry args={[1.7, 0.2, 0.2]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} />
            </mesh>
            {/* Ribbon vertical */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[1.7, 0.2, 0.2]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} />
            </mesh>
            {/* Bow */}
            <mesh position={[0, 0.9, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function RewardCoins() {
  const coinsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (coinsRef.current) {
      coinsRef.current.children.forEach((child, index) => {
        child.position.y += 0.04;
        child.rotation.y += 0.05;

        if (child.position.y > 25) {
          child.position.y = -5;
        }
      });
    }
  });

  return (
    <group ref={coinsRef}>
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 30,
            Math.random() * 30 - 5,
            (Math.random() - 0.5) * 30,
          ]}
        >
          <cylinderGeometry args={[0.4, 0.4, 0.15, 32]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function DailyStreakCalendar() {
  const calendarRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (calendarRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      calendarRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={calendarRef} position={[0, 10, -10]}>
      {/* Calendar board */}
      <mesh>
        <boxGeometry args={[12, 8, 0.5]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#9333EA"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Calendar days (7 days) */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = -4.5 + i * 1.5;
        const isCompleted = i < 4; // First 4 days completed

        return (
          <mesh key={i} position={[x, 0, 0.3]}>
            <boxGeometry args={[1.2, 1.2, 0.2]} />
            <meshStandardMaterial
              color={isCompleted ? "#10B981" : "#4B5563"}
              emissive={isCompleted ? "#10B981" : "#4B5563"}
              emissiveIntensity={isCompleted ? 0.5 : 0.1}
            />
          </mesh>
        );
      })}

      {/* Frame */}
      <mesh>
        <boxGeometry args={[12.5, 8.5, 0.3]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.4}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

function MagicalSparkles() {
  const sparklesRef = useRef<THREE.Points>(null);

  const sparklesGeometry = useMemo(() => {
    const count = 800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Magical colors
      const colorChoice = Math.random();
      if (colorChoice < 0.25) {
        colors[i3] = 1;
        colors[i3 + 1] = 0.84;
        colors[i3 + 2] = 0; // Gold
      } else if (colorChoice < 0.5) {
        colors[i3] = 0.58;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.92; // Purple
      } else if (colorChoice < 0.75) {
        colors[i3] = 0.06;
        colors[i3 + 1] = 0.71;
        colors[i3 + 2] = 0.83; // Cyan
      } else {
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1; // White
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
      if (sparklesGeometry) {
        sparklesGeometry.dispose();
      }
    };
  }, [sparklesGeometry]);

  useFrame((state) => {
    if (sparklesRef.current) {
      sparklesRef.current.rotation.y += 0.002;
      sparklesRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <points ref={sparklesRef} geometry={sparklesGeometry}>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function VaultDoor() {
  const doorRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (doorRef.current) {
      // Slowly opening
      const opening = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 + 0.3;
      doorRef.current.children[0].position.x = -opening * 5;
      doorRef.current.children[1].position.x = opening * 5;
    }
  });

  return (
    <group ref={doorRef} position={[0, 0, -15]}>
      {/* Left door */}
      <mesh position={[-2.5, 0, 0]}>
        <boxGeometry args={[5, 12, 1]} />
        <meshStandardMaterial
          color="#4B5563"
          emissive="#9333EA"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Right door */}
      <mesh position={[2.5, 0, 0]}>
        <boxGeometry args={[5, 12, 1]} />
        <meshStandardMaterial
          color="#4B5563"
          emissive="#9333EA"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Door handles */}
      <mesh position={[-1, 0, 0.6]}>
        <torusGeometry args={[0.5, 0.1, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} />
      </mesh>
      <mesh position={[1, 0, 0.6]}>
        <torusGeometry args={[0.5, 0.1, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} />
      </mesh>
    </group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const starsGeometry = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Cleanup geometry on unmount
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
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function TreasureVaultScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={3} color="#F59E0B" />
      <pointLight position={[15, 5, 10]} intensity={2} color="#9333EA" />
      <pointLight position={[-15, 5, 10]} intensity={2} color="#06B6D4" />

      {/* Scene Elements */}
      <Stars />
      <VaultDoor />
      <TreasureChests />
      <FloatingGiftBoxes />
      <RewardCoins />
      <DailyStreakCalendar />
      <MagicalSparkles />
    </>
  );
}

export function TreasureVaultBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0F0A1E 0%, #070512 100%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 5, 25], fov: 65 }}
        gl={{ alpha: true, antialias: true }}
      >
        <TreasureVaultScene />
      </Canvas>
    </div>
  );
}
