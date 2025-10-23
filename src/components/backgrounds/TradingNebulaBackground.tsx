import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

// Crypto Trading Nebula Background for DeFi/Trading Page
// Features: Data streams, rotating coins, candlestick charts, price arrows, liquidity pools

function DataStreams() {
  const streamsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (streamsRef.current) {
      streamsRef.current.children.forEach((child, index) => {
        child.position.y -= 0.05;
        if (child.position.y < -30) {
          child.position.y = 30;
        }
      });
    }
  });

  const streams = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      x: (Math.random() - 0.5) * 60,
      y: Math.random() * 60 - 30,
      z: (Math.random() - 0.5) * 60,
      color: Math.random() > 0.5 ? "#F59E0B" : "#06B6D4",
    }));
  }, []);

  return (
    <group ref={streamsRef}>
      {streams.map((stream, i) => (
        <mesh key={i} position={[stream.x, stream.y, stream.z]}>
          <boxGeometry args={[0.1, 2, 0.1]} />
          <meshStandardMaterial
            color={stream.color}
            emissive={stream.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function RotatingCoins() {
  const coinsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (coinsRef.current) {
      coinsRef.current.rotation.y += 0.005;
    }
  });

  const coins = [
    { radius: 15, color: "#F7931A", name: "BTC" }, // Bitcoin orange
    { radius: 18, color: "#627EEA", name: "ETH" }, // Ethereum blue
    { radius: 21, color: "#26A17B", name: "USDT" }, // Tether green
  ];

  return (
    <group ref={coinsRef}>
      {coins.map((coin, index) => {
        const angle = (index / coins.length) * Math.PI * 2;
        const x = Math.cos(angle) * coin.radius;
        const z = Math.sin(angle) * coin.radius;

        return (
          <group key={index} position={[x, 0, z]}>
            <mesh rotation={[0, angle, 0]}>
              <cylinderGeometry args={[2, 2, 0.5, 32]} />
              <meshStandardMaterial
                color={coin.color}
                emissive={coin.color}
                emissiveIntensity={0.4}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Coin glow */}
            <pointLight
              position={[0, 0, 0]}
              intensity={1.5}
              color={coin.color}
              distance={10}
            />
          </group>
        );
      })}
    </group>
  );
}

function CandlestickCharts() {
  const chartsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (chartsRef.current) {
      chartsRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  const candlesticks = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      height: Math.random() * 3 + 1,
      isGreen: Math.random() > 0.5,
      x: (i - 10) * 1.5,
    }));
  }, []);

  return (
    <group ref={chartsRef} position={[0, -5, -20]}>
      {candlesticks.map((candle, i) => (
        <mesh key={i} position={[candle.x, candle.height / 2, 0]}>
          <boxGeometry args={[0.8, candle.height, 0.8]} />
          <meshStandardMaterial
            color={candle.isGreen ? "#10B981" : "#EF4444"}
            emissive={candle.isGreen ? "#10B981" : "#EF4444"}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function PriceArrows() {
  const arrowsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (arrowsRef.current) {
      arrowsRef.current.children.forEach((child, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        child.position.x += direction * 0.1;
        if (Math.abs(child.position.x) > 40) {
          child.position.x = -direction * 40;
        }
      });
    }
  });

  return (
    <group ref={arrowsRef}>
      {Array.from({ length: 8 }).map((_, i) => {
        const isUp = i % 2 === 0;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 40;

        return (
          <mesh
            key={i}
            position={[(Math.random() - 0.5) * 80, y, z]}
            rotation={[0, 0, isUp ? 0 : Math.PI]}
          >
            <coneGeometry args={[0.5, 2, 3]} />
            <meshStandardMaterial
              color={isUp ? "#10B981" : "#EF4444"}
              emissive={isUp ? "#10B981" : "#EF4444"}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function LiquidityPools() {
  const poolsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (poolsRef.current) {
      poolsRef.current.children.forEach((child, index) => {
        const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.2 + 1;
        child.scale.set(pulse, pulse, pulse);
      });
    }
  });

  return (
    <group ref={poolsRef}>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 25;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[1.5, 32, 32]} />
            <meshStandardMaterial
              color="#06B6D4"
              emissive="#06B6D4"
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const starsGeometry = useMemo(() => {
    const count = 8000;
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

function TradingNebulaScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#F59E0B" />
      <pointLight position={[20, 10, 10]} intensity={1.5} color="#06B6D4" />
      <pointLight position={[-20, -10, -10]} intensity={1.5} color="#10B981" />

      {/* Scene Elements */}
      <Stars />
      <DataStreams />
      <RotatingCoins />
      <CandlestickCharts />
      <PriceArrows />
      <LiquidityPools />
    </>
  );
}

export function TradingNebulaBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0F0A1E 0%, #070512 100%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 10, 30], fov: 65 }}
        gl={{ alpha: true, antialias: true }}
      >
        <TradingNebulaScene />
      </Canvas>
    </div>
  );
}
