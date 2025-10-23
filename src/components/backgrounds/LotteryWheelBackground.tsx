import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Cosmic Lottery Wheel Background for Daily Lottery Page
// Features: Giant spinning wheel, falling coins, lucky numbers, prize boxes, confetti, jackpot counter

function GiantLotteryWheel() {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z += 0.01;
    }
  });

  const segments = 12;
  const colors = [
    "#9333EA",
    "#F59E0B",
    "#06B6D4",
    "#10B981",
    "#EF4444",
    "#EC4899",
  ];

  return (
    <group ref={wheelRef} position={[0, 0, -5]}>
      {/* Wheel segments */}
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i / segments) * Math.PI * 2;
        const nextAngle = ((i + 1) / segments) * Math.PI * 2;
        const color = colors[i % colors.length];

        return (
          <mesh key={i} rotation={[0, 0, angle]}>
            <boxGeometry args={[12, 1, 0.5]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.4}
              metalness={0.6}
            />
          </mesh>
        );
      })}

      {/* Wheel center */}
      <mesh>
        <cylinderGeometry args={[2, 2, 0.8, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.6}
          metalness={0.8}
        />
      </mesh>

      {/* Wheel rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[12, 0.5, 16, 100]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.9}
        />
      </mesh>

      {/* Glow */}
      <pointLight
        position={[0, 0, 2]}
        intensity={4}
        color="#F59E0B"
        distance={20}
      />
    </group>
  );
}

function FallingCoins() {
  const coinsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (coinsRef.current) {
      coinsRef.current.children.forEach((child, index) => {
        child.position.y -= 0.08;
        child.rotation.y += 0.05;
        child.rotation.x += 0.03;

        if (child.position.y < -30) {
          child.position.y = 30;
          child.position.x = (Math.random() - 0.5) * 40;
          child.position.z = (Math.random() - 0.5) * 40;
        }
      });
    }
  });

  return (
    <group ref={coinsRef}>
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 40,
            Math.random() * 60 - 30,
            (Math.random() - 0.5) * 40,
          ]}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function LuckyNumbers() {
  const numbersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (numbersRef.current) {
      numbersRef.current.rotation.y += 0.004;
      numbersRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index * 0.5) * 2;
      });
    }
  });

  return (
    <group ref={numbersRef}>
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        const radius = 18;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color="#9333EA"
              emissive="#9333EA"
              emissiveIntensity={0.6}
              metalness={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function PrizeBoxes() {
  const boxesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (boxesRef.current) {
      boxesRef.current.children.forEach((child, index) => {
        child.rotation.y += 0.01;
        const bounce = Math.sin(state.clock.elapsedTime * 2 + index) * 0.5;
        child.position.y = 8 + bounce;
      });
    }
  });

  const prizes = [
    { x: -12, z: 8, color: "#9333EA" },
    { x: 12, z: 8, color: "#F59E0B" },
    { x: -12, z: -8, color: "#06B6D4" },
    { x: 12, z: -8, color: "#10B981" },
  ];

  return (
    <group ref={boxesRef}>
      {prizes.map((prize, i) => (
        <group key={i} position={[prize.x, 8, prize.z]}>
          {/* Box body */}
          <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
              color={prize.color}
              emissive={prize.color}
              emissiveIntensity={0.4}
              metalness={0.6}
            />
          </mesh>
          {/* Ribbon */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.2, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[2.2, 0.3, 0.3]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} />
          </mesh>
          {/* Bow on top */}
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#FFD700" metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Confetti() {
  const confettiRef = useRef<THREE.Points>(null);

  const confettiGeometry = useMemo(() => {
    const count = 1000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = Math.random() * 60 - 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 1, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (confettiRef.current) {
      const positions = confettiRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.05;
        if (positions[i + 1] < -30) {
          positions[i + 1] = 30;
        }
      }
      confettiRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={confettiRef} geometry={confettiGeometry}>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function JackpotCounter() {
  const counterRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (counterRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1;
      counterRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={counterRef} position={[0, 15, 0]}>
      {/* Counter display */}
      <mesh>
        <boxGeometry args={[8, 3, 0.5]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#F59E0B"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[8.5, 3.5, 0.3]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Glow */}
      <pointLight
        position={[0, 0, 2]}
        intensity={3}
        color="#F59E0B"
        distance={15}
      />
    </group>
  );
}

function SpinningArrow() {
  const arrowRef = useRef<THREE.Group>(null);

  return (
    <group ref={arrowRef} position={[0, 12, 0]}>
      <mesh rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.8, 2, 3]} />
        <meshStandardMaterial
          color="#EF4444"
          emissive="#EF4444"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const starsGeometry = useMemo(() => {
    const count = 6000;
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

function LotteryWheelScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 10]} intensity={3} color="#F59E0B" />
      <pointLight position={[20, 10, 10]} intensity={2} color="#9333EA" />
      <pointLight position={[-20, 10, 10]} intensity={2} color="#06B6D4" />

      {/* Scene Elements */}
      <Stars />
      <GiantLotteryWheel />
      <SpinningArrow />
      <FallingCoins />
      <LuckyNumbers />
      <PrizeBoxes />
      <Confetti />
      <JackpotCounter />
    </>
  );
}

export function LotteryWheelBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0F0A1E 0%, #070512 100%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 30], fov: 65 }}
        gl={{ alpha: true, antialias: true }}
      >
        <LotteryWheelScene />
      </Canvas>
    </div>
  );
}
