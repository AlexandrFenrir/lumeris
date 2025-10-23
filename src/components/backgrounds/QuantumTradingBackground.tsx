import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { usePerformance } from "@/contexts/PerformanceContext";

// 📈 LEGENDARY: Quantum Market Dimension
// Epic trading command center with holographic charts, whale alerts, bull vs bear, and market data streams

// Massive Holographic Trading Screens
function HolographicScreens() {
  const screensRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (screensRef.current) {
      screensRef.current.rotation.y += 0.001;
      screensRef.current.children.forEach((child, index) => {
        const float = Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.5;
        child.position.y = float;
      });
    }
  });

  return (
    <group ref={screensRef}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 25;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Screen Frame */}
            <mesh>
              <boxGeometry args={[10, 6, 0.3]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#06B6D4"
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>

            {/* Screen Display */}
            <mesh position={[0, 0, 0.2]}>
              <planeGeometry args={[9.5, 5.5]} />
              <meshStandardMaterial
                color="#0a0a1e"
                emissive={i % 2 === 0 ? "#10B981" : "#EF4444"}
                emissiveIntensity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Candlestick Bars on Screen */}
            {Array.from({ length: 12 }).map((_, j) => {
              const barX = -4 + j * 0.8;
              const barHeight = Math.random() * 2 + 0.5;
              const isGreen = Math.random() > 0.5;

              return (
                <mesh key={j} position={[barX, 0, 0.3]}>
                  <boxGeometry args={[0.3, barHeight, 0.1]} />
                  <meshStandardMaterial
                    color={isGreen ? "#10B981" : "#EF4444"}
                    emissive={isGreen ? "#10B981" : "#EF4444"}
                    emissiveIntensity={0.8}
                  />
                </mesh>
              );
            })}

            {/* Screen Glow */}
            <pointLight
              position={[0, 0, 1]}
              intensity={2}
              color="#06B6D4"
              distance={10}
            />
          </group>
        );
      })}
    </group>
  );
}

// AI Brain Core with Neural Pathways
function AIBrainCore() {
  const brainRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.004;
      brainRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.15 + 1;
      brainRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={brainRef} position={[0, 0, 0]}>
      {/* Central Brain Sphere - MASSIVE */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial
          color="#9333EA"
          emissive="#9333EA"
          emissiveIntensity={0.7}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>

      {/* Inner Core */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.9}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Neural Nodes - Data Points */}
      {Array.from({ length: 30 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 30);
        const theta = Math.sqrt(30 * Math.PI) * phi;
        const radius = 5;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#06B6D4"
              emissive="#06B6D4"
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}

      {/* Brain Glow */}
      <pointLight position={[0, 0, 0]} intensity={5} color="#9333EA" />
    </group>
  );
}

// Whale Alert Submarines
function WhaleAlerts() {
  const whalesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (whalesRef.current) {
      whalesRef.current.children.forEach((child, index) => {
        const speed = 0.5 + index * 0.1;
        const radius = 30;
        const angle =
          state.clock.elapsedTime * speed + (index * Math.PI * 2) / 4;
        child.position.x = Math.cos(angle) * radius;
        child.position.z = Math.sin(angle) * radius;
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 3;
        child.rotation.y = -angle;
      });
    }
  });

  return (
    <group ref={whalesRef}>
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i}>
          {/* Whale Body */}
          <mesh>
            <capsuleGeometry args={[1.5, 4, 8, 16]} />
            <meshStandardMaterial
              color="#06B6D4"
              emissive="#06B6D4"
              emissiveIntensity={0.6}
              metalness={0.8}
            />
          </mesh>

          {/* Whale Alert Beacon */}
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[0.5, 1, 8]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={1}
            />
          </mesh>

          {/* Warning Light */}
          <pointLight
            position={[0, 2, 0]}
            intensity={2}
            color="#EF4444"
            distance={8}
          />
        </group>
      ))}
    </group>
  );
}

// Bull vs Bear Statues
function BullVsBear() {
  const statuesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (statuesRef.current) {
      const energy = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
      // Energy beam between them
      const beam = statuesRef.current.children[2] as THREE.Mesh;
      if (beam) {
        beam.scale.x = energy;
        (beam.material as THREE.MeshStandardMaterial).emissiveIntensity =
          energy;
      }
    }
  });

  return (
    <group ref={statuesRef}>
      {/* Bull Statue - Left */}
      <group position={[-15, -5, -20]}>
        <mesh>
          <boxGeometry args={[3, 5, 3]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={0.7}
            metalness={0.9}
          />
        </mesh>
        {/* Bull Horns */}
        <mesh position={[-1, 3, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.3, 2, 8]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[1, 3, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.3, 2, 8]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={0.8}
          />
        </mesh>
        <spotLight
          position={[0, 8, 0]}
          angle={0.3}
          intensity={3}
          color="#10B981"
        />
      </group>

      {/* Bear Statue - Right */}
      <group position={[15, -5, -20]}>
        <mesh>
          <boxGeometry args={[3, 5, 3]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={0.7}
            metalness={0.9}
          />
        </mesh>
        {/* Bear Claws */}
        <mesh position={[-1.5, 0, 1.5]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[1.5, 0, 1.5]}>
          <boxGeometry args={[0.3, 1.5, 0.3]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={0.8}
          />
        </mesh>
        <spotLight
          position={[0, 8, 0]}
          angle={0.3}
          intensity={3}
          color="#EF4444"
        />
      </group>

      {/* Energy Beam Between Them */}
      <mesh position={[0, -5, -20]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 30, 16]} />
        <meshStandardMaterial
          color="#9333EA"
          emissive="#9333EA"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// Order Book Towers - Buy/Sell Stacks
function OrderBookTowers() {
  const towersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (towersRef.current) {
      towersRef.current.children.forEach((child, index) => {
        const wave = Math.sin(state.clock.elapsedTime * 2 + index * 0.3) * 0.5;
        child.position.y = wave;
      });
    }
  });

  return (
    <group ref={towersRef}>
      {/* Buy Orders - Green Towers */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = -20 + i * 2;
        const height = Math.random() * 8 + 2;

        return (
          <mesh key={`buy-${i}`} position={[x, height / 2 - 10, 15]}>
            <boxGeometry args={[1.5, height, 1.5]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#10B981"
              emissiveIntensity={0.6}
              metalness={0.7}
            />
          </mesh>
        );
      })}

      {/* Sell Orders - Red Towers */}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = -20 + i * 2;
        const height = Math.random() * 8 + 2;

        return (
          <mesh key={`sell-${i}`} position={[x, height / 2 - 10, -15]}>
            <boxGeometry args={[1.5, height, 1.5]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={0.6}
              metalness={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Price Ticker Ribbons - Matrix Style
function PriceTickerRibbons() {
  const ribbonsRef = useRef<THREE.Points>(null);

  const ribbonsGeometry = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      const isGreen = Math.random() > 0.5;
      colors[i3] = isGreen ? 0.06 : 0.94;
      colors[i3 + 1] = isGreen ? 0.73 : 0.27;
      colors[i3 + 2] = isGreen ? 0.51 : 0.27;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  // Cleanup geometry on unmount
  useEffect(() => {
    return () => {
      if (ribbonsGeometry) {
        ribbonsGeometry.dispose();
      }
    };
  }, [ribbonsGeometry]);

  useFrame((state) => {
    if (ribbonsRef.current) {
      const positions = ribbonsRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.1;
        if (positions[i + 1] < -50) {
          positions[i + 1] = 50;
        }
      }

      ribbonsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ribbonsRef} geometry={ribbonsGeometry}>
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

// Fibonacci Spirals
function FibonacciSpirals() {
  const spiralsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (spiralsRef.current) {
      spiralsRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={spiralsRef} position={[0, 0, -30]}>
      {Array.from({ length: 3 }).map((_, spiralIndex) => {
        const points = [];
        const goldenRatio = 1.618;

        for (let i = 0; i < 100; i++) {
          const angle = i * 0.1;
          const radius = Math.pow(goldenRatio, angle / (Math.PI * 2)) * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          points.push(new THREE.Vector3(x, y, spiralIndex * 2));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);

        return (
          <mesh key={spiralIndex} geometry={tubeGeometry}>
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Grid Floor with Moving Lines
function GridFloor() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 3) % 4;
    }
  });

  return (
    <group ref={gridRef} position={[0, -20, 0]}>
      <gridHelper args={[150, 75, "#9333EA", "#9333EA"]} />
    </group>
  );
}

// Background Stars
function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  const { settings } = usePerformance();

  const starsGeometry = useMemo(() => {
    const count = Math.min(10000, settings.particleCount * 5);
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
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
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Camera Controller for Mouse Parallax
function CameraController() {
  const { camera } = useThree();
  const { getCameraOffset, isEnabled } = useMouseParallax({
    sensitivity: 0.35,
    smoothing: 0.08,
    maxOffset: 9,
  });

  useFrame(() => {
    if (isEnabled) {
      const offset = getCameraOffset();
      camera.position.x = offset.x;
      camera.position.y = 15 + offset.y;
      camera.position.z = 45 + offset.z;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function QuantumTradingScene() {
  const { settings } = usePerformance();

  return (
    <>
      {/* Camera Controller */}
      <CameraController />

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={5} color="#9333EA" />
      <pointLight position={[30, 20, 30]} intensity={3} color="#10B981" />
      <pointLight position={[-30, 20, -30]} intensity={3} color="#EF4444" />
      <pointLight position={[0, 30, 0]} intensity={2} color="#F59E0B" />

      {/* Fog for Depth */}
      {settings.enableFog && <fog attach="fog" args={["#070512", 60, 200]} />}

      {/* Scene Elements - Layered */}
      <Stars />
      <GridFloor />
      <HolographicScreens />
      <AIBrainCore />
      <WhaleAlerts />
      <BullVsBear />
      <OrderBookTowers />
      <PriceTickerRibbons />
      <FibonacciSpirals />
    </>
  );
}

export function QuantumTradingBackground() {
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
        camera={{ position: [0, 15, 45], fov: 75 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <QuantumTradingScene />
      </Canvas>
    </div>
  );
}
