import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// 🚀 SPACE ELEVATOR LAUNCH STATION - Launchpad Background
// Epic Features: Space station platform, rockets in different stages, countdown timers, token satellites, launch pads, fuel tanks

// Massive Space Station Platform
function SpaceStationPlatform() {
  const platformRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (platformRef.current) {
      platformRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group ref={platformRef} position={[0, -15, 0]}>
      {/* Main platform base */}
      <mesh>
        <cylinderGeometry args={[25, 25, 2, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#06B6D4"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Platform grid pattern */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 20, 1.5, Math.sin(angle) * 20]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[2, 1, 40]} />
            <meshStandardMaterial
              color="#9333EA"
              emissive="#9333EA"
              emissiveIntensity={0.5}
              metalness={0.8}
            />
          </mesh>
        );
      })}

      {/* Central control tower */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[3, 4, 8, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#FFD700"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Control tower top */}
      <mesh position={[0, 10, 0]}>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.0}
          metalness={1.0}
          roughness={0.0}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Platform lights */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x = Math.cos(angle) * 24;
        const z = Math.sin(angle) * 24;
        return (
          <pointLight
            key={i}
            position={[x, 1, z]}
            intensity={2}
            color={i % 2 === 0 ? "#06B6D4" : "#9333EA"}
            distance={10}
          />
        );
      })}
    </group>
  );
}

// Rockets in Different Launch Stages
function LaunchRockets() {
  const rocketsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rocketsRef.current) {
      rocketsRef.current.children.forEach((child, index) => {
        const rocket = child as THREE.Group;

        // Different launch stages
        if (index === 0) {
          // Launching rocket
          rocket.position.y += 0.08;
          if (rocket.position.y > 50) rocket.position.y = -10;
        } else if (index === 1) {
          // Preparing rocket (pulsing)
          rocket.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        } else if (index === 2) {
          // Fueling rocket (slight movement)
          rocket.position.y = -10 + Math.sin(state.clock.elapsedTime) * 0.3;
        }
      });
    }
  });

  const rockets = [
    { x: -15, z: 10, color: "#FFD700", stage: "launching" },
    { x: 0, z: 15, color: "#9333EA", stage: "preparing" },
    { x: 15, z: 10, color: "#06B6D4", stage: "fueling" },
  ];

  return (
    <group ref={rocketsRef}>
      {rockets.map((rocket, i) => (
        <group key={i} position={[rocket.x, -10, rocket.z]}>
          {/* Rocket body */}
          <mesh>
            <cylinderGeometry args={[1.5, 1.5, 12, 32]} />
            <meshStandardMaterial
              color={rocket.color}
              emissive={rocket.color}
              emissiveIntensity={0.6}
              metalness={1.0}
              roughness={0.1}
            />
          </mesh>

          {/* Rocket nose cone */}
          <mesh position={[0, 7.5, 0]}>
            <coneGeometry args={[1.5, 3, 32]} />
            <meshStandardMaterial
              color={rocket.color}
              emissive={rocket.color}
              emissiveIntensity={0.8}
              metalness={1.0}
              roughness={0.0}
            />
          </mesh>

          {/* Rocket fins */}
          {[0, 90, 180, 270].map((angle, finIndex) => {
            const radian = (angle * Math.PI) / 180;
            return (
              <mesh
                key={finIndex}
                position={[Math.cos(radian) * 1.5, -5, Math.sin(radian) * 1.5]}
                rotation={[0, radian, 0]}
              >
                <boxGeometry args={[0.3, 3, 2]} />
                <meshStandardMaterial
                  color={rocket.color}
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            );
          })}

          {/* Rocket windows */}
          {[2, 0, -2].map((y, windowIndex) => (
            <mesh key={windowIndex} position={[0, y, 1.51]}>
              <circleGeometry args={[0.4, 16]} />
              <meshStandardMaterial
                color="#00ffff"
                emissive="#00ffff"
                emissiveIntensity={1.5}
              />
            </mesh>
          ))}

          {/* Engine fire (for launching rocket) */}
          {i === 0 && (
            <>
              <mesh position={[0, -7, 0]}>
                <coneGeometry args={[1.5, 4, 32]} />
                <meshStandardMaterial
                  color="#ff6600"
                  emissive="#ff6600"
                  emissiveIntensity={2.0}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              <pointLight
                position={[0, -8, 0]}
                intensity={10}
                color="#ff6600"
                distance={20}
              />
            </>
          )}

          {/* Rocket spotlight */}
          <spotLight
            position={[0, 0, 5]}
            angle={0.3}
            penumbra={0.5}
            intensity={5}
            color={rocket.color}
            distance={20}
          />
        </group>
      ))}
    </group>
  );
}

// Countdown Timer Holograms
function CountdownTimers() {
  const timersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (timersRef.current) {
      timersRef.current.children.forEach((child, index) => {
        child.rotation.y += 0.01;
        child.position.y = 15 + Math.sin(state.clock.elapsedTime + index) * 0.5;
      });
    }
  });

  const timers = [
    { x: -15, z: 10, color: "#00ff00", time: "03:45" },
    { x: 0, z: 15, color: "#ffff00", time: "10:20" },
    { x: 15, z: 10, color: "#ff6600", time: "24:15" },
  ];

  return (
    <group ref={timersRef}>
      {timers.map((timer, index) => (
        <group key={index} position={[timer.x, 15, timer.z]}>
          {/* Timer display screen */}
          <mesh>
            <planeGeometry args={[4, 2]} />
            <meshStandardMaterial
              color={timer.color}
              emissive={timer.color}
              emissiveIntensity={1.5}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Timer frame */}
          <mesh>
            <boxGeometry args={[4.2, 2.2, 0.2]} />
            <meshStandardMaterial
              color={timer.color}
              emissive={timer.color}
              emissiveIntensity={0.8}
              metalness={1.0}
              roughness={0.0}
              wireframe={true}
            />
          </mesh>

          {/* Timer glow */}
          <pointLight
            position={[0, 0, 1]}
            intensity={3}
            color={timer.color}
            distance={10}
          />
        </group>
      ))}
    </group>
  );
}

// Token Distribution Satellites
function TokenSatellites() {
  const satellitesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (satellitesRef.current) {
      satellitesRef.current.rotation.y += 0.003;
      satellitesRef.current.children.forEach((child, index) => {
        child.rotation.x += 0.005;
        child.rotation.z += 0.003;
      });
    }
  });

  const satellites = [
    { angle: 0, distance: 35, color: "#FFD700" },
    { angle: 60, distance: 35, color: "#9333EA" },
    { angle: 120, distance: 35, color: "#06B6D4" },
    { angle: 180, distance: 35, color: "#10B981" },
    { angle: 240, distance: 35, color: "#F59E0B" },
    { angle: 300, distance: 35, color: "#EF4444" },
  ];

  return (
    <group ref={satellitesRef}>
      {satellites.map((satellite, index) => {
        const radian = (satellite.angle * Math.PI) / 180;
        const x = Math.cos(radian) * satellite.distance;
        const z = Math.sin(radian) * satellite.distance;

        return (
          <group key={index} position={[x, 10, z]}>
            {/* Satellite body */}
            <mesh>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial
                color={satellite.color}
                emissive={satellite.color}
                emissiveIntensity={0.8}
                metalness={1.0}
                roughness={0.1}
              />
            </mesh>

            {/* Solar panels */}
            {[-1, 1].map((side, i) => (
              <mesh key={i} position={[side * 3, 0, 0]}>
                <boxGeometry args={[2, 3, 0.1]} />
                <meshStandardMaterial
                  color="#0066ff"
                  emissive="#0066ff"
                  emissiveIntensity={0.5}
                  metalness={0.8}
                />
              </mesh>
            ))}

            {/* Antenna */}
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
              <meshStandardMaterial
                color={satellite.color}
                emissive={satellite.color}
                emissiveIntensity={1.0}
              />
            </mesh>

            {/* Satellite beacon */}
            <mesh position={[0, 3, 0]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color={satellite.color}
                emissive={satellite.color}
                emissiveIntensity={2.0}
              />
            </mesh>

            {/* Satellite light */}
            <pointLight
              position={[0, 0, 0]}
              intensity={3}
              color={satellite.color}
              distance={12}
            />
          </group>
        );
      })}
    </group>
  );
}

// Launch Pad Structures
function LaunchPads() {
  const padsRef = useRef<THREE.Group>(null);

  const pads = [
    { x: -15, z: 10, color: "#FFD700" },
    { x: 0, z: 15, color: "#9333EA" },
    { x: 15, z: 10, color: "#06B6D4" },
  ];

  return (
    <group ref={padsRef}>
      {pads.map((pad, index) => (
        <group key={index} position={[pad.x, -13, pad.z]}>
          {/* Pad base */}
          <mesh>
            <cylinderGeometry args={[4, 5, 1, 32]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive={pad.color}
              emissiveIntensity={0.4}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Support pillars */}
          {[0, 90, 180, 270].map((angle, i) => {
            const radian = (angle * Math.PI) / 180;
            return (
              <mesh
                key={i}
                position={[Math.cos(radian) * 3, 2, Math.sin(radian) * 3]}
              >
                <cylinderGeometry args={[0.3, 0.3, 4, 16]} />
                <meshStandardMaterial
                  color={pad.color}
                  emissive={pad.color}
                  emissiveIntensity={0.6}
                  metalness={0.9}
                />
              </mesh>
            );
          })}

          {/* Pad lights */}
          <pointLight
            position={[0, 2, 0]}
            intensity={5}
            color={pad.color}
            distance={15}
          />
        </group>
      ))}
    </group>
  );
}

// Fuel Tank Structures
function FuelTanks() {
  const tanksRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (tanksRef.current) {
      tanksRef.current.children.forEach((child, index) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.02;
        child.scale.set(1, scale, 1);
      });
    }
  });

  const tanks = [
    { x: -25, z: -10, color: "#00ff00" },
    { x: -20, z: -10, color: "#00ffff" },
    { x: 20, z: -10, color: "#ff00ff" },
    { x: 25, z: -10, color: "#ffff00" },
  ];

  return (
    <group ref={tanksRef}>
      {tanks.map((tank, index) => (
        <group key={index} position={[tank.x, -5, tank.z]}>
          {/* Tank body */}
          <mesh>
            <cylinderGeometry args={[2, 2, 10, 32]} />
            <meshStandardMaterial
              color={tank.color}
              emissive={tank.color}
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Tank top */}
          <mesh position={[0, 5.5, 0]}>
            <sphereGeometry
              args={[2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial
              color={tank.color}
              emissive={tank.color}
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Tank bottom */}
          <mesh position={[0, -5.5, 0]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry
              args={[2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial
              color={tank.color}
              emissive={tank.color}
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Fuel level indicator */}
          <mesh position={[0, 0, 2.1]}>
            <planeGeometry args={[0.5, 8]} />
            <meshStandardMaterial
              color={tank.color}
              emissive={tank.color}
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Tank glow */}
          <pointLight
            position={[0, 0, 0]}
            intensity={2}
            color={tank.color}
            distance={10}
          />
        </group>
      ))}
    </group>
  );
}

// Launch Particles - Exhaust and Energy
function LaunchParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#ff6600"),
      new THREE.Color("#ffff00"),
      new THREE.Color("#ff0000"),
      new THREE.Color("#ffffff"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = Math.random() * 30 - 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.1;
        if (positions[i + 1] < -20) {
          positions[i + 1] = 10;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Background Stars
function BackgroundStars() {
  const starsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;
    }

    return positions;
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Main Scene
function SpaceElevatorScene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 30, 100]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 30, 0]} intensity={3} color="#FFD700" />
      <pointLight position={[-30, 10, 0]} intensity={2} color="#9333EA" />
      <pointLight position={[30, 10, 0]} intensity={2} color="#06B6D4" />
      <pointLight position={[0, -10, 30]} intensity={2} color="#ff6600" />

      {/* Scene Elements */}
      <SpaceStationPlatform />
      <LaunchRockets />
      <CountdownTimers />
      <TokenSatellites />
      <LaunchPads />
      <FuelTanks />
      <LaunchParticles />
      <BackgroundStars />
    </>
  );
}

// Export Component
export function SpaceElevatorBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 10, 55], fov: 70 }}
        gl={{ powerPreference: "high-performance" }}
      >
        <SpaceElevatorScene />
      </Canvas>
    </div>
  );
}

// Keep old export for compatibility
export { SpaceElevatorBackground as RocketLaunchBackground };
