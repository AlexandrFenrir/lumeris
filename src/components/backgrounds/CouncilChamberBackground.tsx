import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { usePerformance } from "@/contexts/PerformanceContext";

// Council Chamber Background for Governance Page
// Features: Voting ballot boxes, proposal documents, vote spheres, gavel, council seats, democratic scales

function VotingBallotBoxes() {
  const boxesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (boxesRef.current) {
      boxesRef.current.rotation.y += 0.003;
      boxesRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index) * 1;
      });
    }
  });

  return (
    <group ref={boxesRef}>
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Ballot box */}
            <mesh>
              <boxGeometry args={[2, 2.5, 2]} />
              <meshStandardMaterial
                color="#9333EA"
                emissive="#9333EA"
                emissiveIntensity={0.3}
                metalness={0.6}
              />
            </mesh>
            {/* Slot on top */}
            <mesh position={[0, 1.3, 0]}>
              <boxGeometry args={[1.5, 0.1, 0.3]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            {/* Glow */}
            <pointLight
              position={[0, 0, 0]}
              intensity={1.5}
              color="#9333EA"
              distance={8}
            />
          </group>
        );
      })}
    </group>
  );
}

function ProposalDocuments() {
  const docsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (docsRef.current) {
      docsRef.current.children.forEach((child, index) => {
        child.rotation.y += 0.005;
        child.position.y =
          5 + Math.sin(state.clock.elapsedTime * 0.5 + index) * 2;
      });
    }
  });

  return (
    <group ref={docsRef}>
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 10;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={i} position={[x, 5, z]}>
            <planeGeometry args={[2, 3]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={0.3}
              side={THREE.DoubleSide}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function VoteSpheres() {
  const spheresRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (spheresRef.current) {
      spheresRef.current.rotation.y -= 0.004;
    }
  });

  return (
    <group ref={spheresRef}>
      {/* YES votes (Green) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={`yes-${i}`} position={[x, 3, z]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#10B981"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}

      {/* NO votes (Red) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <mesh key={`no-${i}`} position={[x, -3, z]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Gavel() {
  const gavelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gavelRef.current) {
      const strike = Math.sin(state.clock.elapsedTime * 1.5) * 0.5;
      gavelRef.current.rotation.z = -0.3 + strike;
    }
  });

  return (
    <group ref={gavelRef} position={[0, 8, 0]} rotation={[0, 0, -0.3]}>
      {/* Gavel head */}
      <mesh position={[2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 2, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.4}
          metalness={0.8}
        />
      </mesh>
      {/* Gavel handle */}
      <mesh position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 5, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Glow */}
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color="#F59E0B"
        distance={10}
      />
    </group>
  );
}

function CouncilSeats() {
  const seatsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (seatsRef.current) {
      seatsRef.current.children.forEach((child, index) => {
        const pulse = Math.sin(state.clock.elapsedTime + index * 0.5) * 0.1 + 1;
        child.scale.set(pulse, pulse, pulse);
      });
    }
  });

  return (
    <group ref={seatsRef} position={[0, -5, 0]}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 25;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Seat base */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 0.3, 2]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#06B6D4"
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Seat back */}
            <mesh position={[0, 1.5, -0.8]}>
              <boxGeometry args={[2, 3, 0.3]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#06B6D4"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function DemocraticScales() {
  const scalesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (scalesRef.current) {
      const tilt = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
      scalesRef.current.rotation.z = tilt;
    }
  });

  return (
    <group ref={scalesRef} position={[0, 0, 0]}>
      {/* Central pillar */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 8, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Horizontal beam */}
      <mesh position={[0, 4, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[12, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Left scale pan */}
      <mesh position={[-5, 2, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#10B981"
          emissiveIntensity={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Right scale pan */}
      <mesh position={[5, 2, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial
          color="#EF4444"
          emissive="#EF4444"
          emissiveIntensity={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* Chains */}
      <mesh position={[-5, 3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.9} />
      </mesh>
      <mesh position={[5, 3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.9} />
      </mesh>
    </group>
  );
}

function VotingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particlesGeometry = useMemo(() => {
    const count = 600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 60;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i3] = 0.58;
        colors[i3 + 1] = 0.2;
        colors[i3 + 2] = 0.92; // Purple
      } else if (colorChoice < 0.66) {
        colors[i3] = 0.06;
        colors[i3 + 1] = 0.71;
        colors[i3 + 2] = 0.83; // Cyan
      } else {
        colors[i3] = 0.96;
        colors[i3 + 1] = 0.62;
        colors[i3 + 2] = 0.04; // Gold
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  const { settings } = usePerformance();

  const starsGeometry = useMemo(() => {
    const count = Math.min(5000, settings.particleCount * 2.5);
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
      camera.position.y = 8 + offset.y;
      camera.position.z = 30 + offset.z;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function CouncilChamberScene() {
  const { settings } = usePerformance();

  return (
    <>
      <CameraController />
      {settings.enableFog && <fog attach="fog" args={["#070512", 25, 90]} />}

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 15, 0]} intensity={3} color="#9333EA" />
      <pointLight position={[15, 5, 15]} intensity={2} color="#F59E0B" />
      <pointLight position={[-15, 5, -15]} intensity={2} color="#06B6D4" />

      {/* Scene Elements */}
      <Stars />
      <VotingParticles />
      <DemocraticScales />
      <VotingBallotBoxes />
      <ProposalDocuments />
      <VoteSpheres />
      <Gavel />
      <CouncilSeats />
    </>
  );
}

export function CouncilChamberBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0F0A1E 0%, #070512 100%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 10, 35], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <CouncilChamberScene />
      </Canvas>
    </div>
  );
}
