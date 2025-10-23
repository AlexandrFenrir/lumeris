import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { usePerformance } from "@/contexts/PerformanceContext";

// Rocket Launch Station Background for Launchpad Page
// Features: Rockets launching, fire trails, countdown hologram, token minting, launch pads, satellites

function LaunchingRockets() {
  const rocketsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rocketsRef.current) {
      rocketsRef.current.children.forEach((child, index) => {
        // Rockets launch upward
        child.position.y += 0.05;
        if (child.position.y > 40) {
          child.position.y = -10;
        }
        child.rotation.z = Math.sin(state.clock.elapsedTime + index) * 0.1;
      });
    }
  });

  const rockets = [
    { x: -15, z: 10, color: "#9333EA" },
    { x: 0, z: 15, color: "#F59E0B" },
    { x: 15, z: 10, color: "#06B6D4" },
  ];

  return (
    <group ref={rocketsRef}>
      {rockets.map((rocket, i) => (
        <group key={i} position={[rocket.x, -10 + i * 5, rocket.z]}>
          {/* Rocket body */}
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 4, 16]} />
            <meshStandardMaterial
              color={rocket.color}
              emissive={rocket.color}
              emissiveIntensity={0.4}
              metalness={0.8}
            />
          </mesh>
          {/* Rocket nose cone */}
          <mesh position={[0, 2.5, 0]}>
            <coneGeometry args={[0.5, 1.5, 16]} />
            <meshStandardMaterial
              color={rocket.color}
              emissive={rocket.color}
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Rocket fins */}
          {[0, 90, 180, 270].map((angle, finIndex) => {
            const radian = (angle * Math.PI) / 180;
            return (
              <mesh
                key={finIndex}
                position={[
                  Math.cos(radian) * 0.5,
                  -1.5,
                  Math.sin(radian) * 0.5,
                ]}
                rotation={[0, radian, 0]}
              >
                <boxGeometry args={[0.1, 1, 0.8]} />
                <meshStandardMaterial color={rocket.color} />
              </mesh>
            );
          })}
          {/* Rocket light */}
          <pointLight
            position={[0, 0, 0]}
            intensity={3}
            color={rocket.color}
            distance={15}
          />
        </group>
      ))}
    </group>
  );
}

function FireTrails() {
  const trailsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (trailsRef.current) {
      trailsRef.current.children.forEach((child, index) => {
        child.position.y += 0.05;
        if (child.position.y > 40) {
          child.position.y = -10;
        }
        const pulse = Math.sin(state.clock.elapsedTime * 5 + index) * 0.3 + 0.7;
        child.scale.set(pulse, 1, pulse);
      });
    }
  });

  const trails = [
    { x: -15, z: 10 },
    { x: 0, z: 15 },
    { x: 15, z: 10 },
  ];

  return (
    <group ref={trailsRef}>
      {trails.map((trail, i) => (
        <group key={i}>
          {Array.from({ length: 8 }).map((_, j) => (
            <mesh key={j} position={[trail.x, -10 + i * 5 - j * 1.5, trail.z]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color={j % 2 === 0 ? "#FF6B00" : "#FFD700"}
                emissive={j % 2 === 0 ? "#FF6B00" : "#FFD700"}
                emissiveIntensity={0.8}
                transparent
                opacity={1 - j * 0.12}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function CountdownHologram() {
  const countdownRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (countdownRef.current) {
      countdownRef.current.rotation.y += 0.01;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      countdownRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={countdownRef} position={[0, 10, 0]}>
      {/* Hologram ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.2, 16, 100]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function TokenMinting() {
  const tokensRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (tokensRef.current) {
      tokensRef.current.children.forEach((child, index) => {
        child.position.y += 0.03;
        child.rotation.y += 0.05;
        if (child.position.y > 30) {
          child.position.y = -5;
        }
      });
    }
  });

  return (
    <group ref={tokensRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 8 + Math.random() * 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, Math.random() * 20 - 5, z]}>
            <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function LaunchPads() {
  const padsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (padsRef.current) {
      padsRef.current.children.forEach((child, index) => {
        const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.1 + 1;
        child.scale.set(1, pulse, 1);
      });
    }
  });

  const pads = [
    { x: -15, z: 10, color: "#9333EA" },
    { x: 0, z: 15, color: "#F59E0B" },
    { x: 15, z: 10, color: "#06B6D4" },
  ];

  return (
    <group ref={padsRef} position={[0, -15, 0]}>
      {pads.map((pad, i) => (
        <group key={i} position={[pad.x, 0, pad.z]}>
          {/* Launch pad platform */}
          <mesh>
            <cylinderGeometry args={[3, 3, 0.5, 32]} />
            <meshStandardMaterial
              color={pad.color}
              emissive={pad.color}
              emissiveIntensity={0.3}
              metalness={0.7}
            />
          </mesh>
          {/* Energy beam */}
          <mesh position={[0, 5, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 10, 16]} />
            <meshStandardMaterial
              color={pad.color}
              emissive={pad.color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function OrbitingSatellites() {
  const satellitesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (satellitesRef.current) {
      satellitesRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={satellitesRef}>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 25;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.8) * 5;

        return (
          <group key={i} position={[x, y, z]}>
            {/* Satellite body */}
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#06B6D4"
                emissiveIntensity={0.4}
                metalness={0.8}
              />
            </mesh>
            {/* Solar panels */}
            <mesh position={[-1.5, 0, 0]}>
              <boxGeometry args={[2, 0.1, 1.5]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
            </mesh>
            <mesh position={[1.5, 0, 0]}>
              <boxGeometry args={[2, 0.1, 1.5]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  const { settings } = usePerformance();

  const starsGeometry = useMemo(() => {
    const count = Math.min(7000, settings.particleCount * 3.5);
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
      camera.position.y = 5 + offset.y;
      camera.position.z = 35 + offset.z;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function RocketLaunchScene() {
  const { settings } = usePerformance();

  return (
    <>
      <CameraController />
      {settings.enableFog && <fog attach="fog" args={["#070512", 30, 100]} />}

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 20, 0]} intensity={3} color="#F59E0B" />
      <pointLight position={[20, 0, 20]} intensity={2} color="#9333EA" />
      <pointLight position={[-20, 0, -20]} intensity={2} color="#06B6D4" />

      {/* Scene Elements */}
      <Stars />
      <LaunchPads />
      <LaunchingRockets />
      <FireTrails />
      <CountdownHologram />
      <TokenMinting />
      <OrbitingSatellites />
    </>
  );
}

export function RocketLaunchBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0F0A1E 0%, #070512 100%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 5, 35], fov: 65 }}
        gl={{ alpha: true, antialias: true }}
      >
        <RocketLaunchScene />
      </Canvas>
    </div>
  );
}
