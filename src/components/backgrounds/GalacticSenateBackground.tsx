import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// 🏛️ GALACTIC SENATE CHAMBER - Governance Background
// Epic Features: Circular senate floor, floating voter orbs, proposal holograms, voting beam streams, gavel of justice, democracy pillars

// Circular Senate Floor
function SenateChamberFloor() {
  const floorRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (floorRef.current) {
      floorRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <group ref={floorRef} position={[0, -10, 0]}>
      {/* Main senate floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[30, 30, 1, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#9333EA"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Concentric rings */}
      {[15, 20, 25].map((radius, index) => (
        <mesh
          key={index}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.6, 0]}
        >
          <ringGeometry args={[radius - 0.5, radius, 64]} />
          <meshStandardMaterial
            color="#9333EA"
            emissive="#9333EA"
            emissiveIntensity={0.8}
            metalness={1.0}
            roughness={0.0}
          />
        </mesh>
      ))}

      {/* Central podium */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[3, 4, 3, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.8}
          metalness={1.0}
          roughness={0.1}
        />
      </mesh>

      {/* Podium hologram projector */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2.0}
          metalness={1.0}
        />
      </mesh>

      {/* Floor lights */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x = Math.cos(angle) * 28;
        const z = Math.sin(angle) * 28;
        return (
          <pointLight
            key={i}
            position={[x, 1, z]}
            intensity={1.5}
            color={
              i % 3 === 0 ? "#9333EA" : i % 3 === 1 ? "#06B6D4" : "#FFD700"
            }
            distance={8}
          />
        );
      })}
    </group>
  );
}

// Floating Voter Orbs - Representing Delegates
function VoterOrbs() {
  const orbsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbsRef.current) {
      orbsRef.current.rotation.y += 0.002;
      orbsRef.current.children.forEach((child, index) => {
        child.position.y +=
          Math.sin(state.clock.elapsedTime * 2 + index) * 0.01;
        child.rotation.y += 0.01;
      });
    }
  });

  const orbs = Array.from({ length: 20 }).map((_, i) => {
    const tier = Math.floor(i / 8);
    const angle = (i / 8) * Math.PI * 2;
    const radius = 25 + tier * 5;
    const height = 5 + tier * 8;
    const voteType = i % 3; // 0: For, 1: Against, 2: Abstain
    const color =
      voteType === 0 ? "#00ff00" : voteType === 1 ? "#ff0000" : "#ffff00";

    return {
      x: Math.cos(angle) * radius,
      y: height,
      z: Math.sin(angle) * radius,
      color,
      size: 1 + Math.random() * 0.5,
    };
  });

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, index) => (
        <group key={index} position={[orb.x, orb.y, orb.z]}>
          {/* Voter orb */}
          <mesh>
            <sphereGeometry args={[orb.size, 32, 32]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={1.2}
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Orb wireframe */}
          <mesh>
            <sphereGeometry args={[orb.size + 0.1, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.8}
              wireframe={true}
              transparent
              opacity={0.5}
            />
          </mesh>

          {/* Orb glow */}
          <pointLight
            position={[0, 0, 0]}
            intensity={3}
            color={orb.color}
            distance={8}
          />

          {/* Voting beam to center */}
          <mesh
            position={[0, -orb.y / 2, 0]}
            rotation={[0, 0, Math.atan2(orb.z, orb.x)]}
          >
            <cylinderGeometry args={[0.05, 0.05, orb.y, 8]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={1.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Proposal Holograms - Floating Documents
function ProposalHolograms() {
  const proposalsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (proposalsRef.current) {
      proposalsRef.current.children.forEach((child, index) => {
        child.rotation.y += 0.005;
        child.position.y = 10 + Math.sin(state.clock.elapsedTime + index) * 2;
      });
    }
  });

  const proposals = [
    { x: -20, z: 0, color: "#00ff00", status: "Approved" },
    { x: 20, z: 0, color: "#ffff00", status: "Pending" },
    { x: 0, z: -20, color: "#ff0000", status: "Rejected" },
    { x: 0, z: 20, color: "#00ffff", status: "Active" },
  ];

  return (
    <group ref={proposalsRef}>
      {proposals.map((proposal, index) => (
        <group key={index} position={[proposal.x, 10, proposal.z]}>
          {/* Proposal document */}
          <mesh>
            <planeGeometry args={[5, 7]} />
            <meshStandardMaterial
              color={proposal.color}
              emissive={proposal.color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Document frame */}
          <mesh>
            <boxGeometry args={[5.2, 7.2, 0.2]} />
            <meshStandardMaterial
              color={proposal.color}
              emissive={proposal.color}
              emissiveIntensity={1.0}
              wireframe={true}
            />
          </mesh>

          {/* Text lines simulation */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} position={[0, 2.5 - i * 0.6, 0.15]}>
              <planeGeometry args={[4, 0.3]} />
              <meshStandardMaterial
                color="#000000"
                emissive={proposal.color}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}

          {/* Proposal glow */}
          <pointLight
            position={[0, 0, 2]}
            intensity={3}
            color={proposal.color}
            distance={12}
          />
        </group>
      ))}
    </group>
  );
}

// Voting Beam Streams - Energy Flows
function VotingBeamStreams() {
  const beamsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (beamsRef.current) {
      beamsRef.current.rotation.y += 0.001;
      beamsRef.current.children.forEach((child, index) => {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.2;
        child.scale.set(1, scale, 1);
      });
    }
  });

  const beams = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 20;
    const color = i % 3 === 0 ? "#00ff00" : i % 3 === 1 ? "#ff0000" : "#0066ff";

    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      color,
    };
  });

  return (
    <group ref={beamsRef}>
      {beams.map((beam, index) => (
        <group key={index} position={[beam.x, 0, beam.z]}>
          {/* Vertical beam */}
          <mesh position={[0, 10, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 20, 16]} />
            <meshStandardMaterial
              color={beam.color}
              emissive={beam.color}
              emissiveIntensity={1.5}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Beam base */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1, 1.5, 1, 32]} />
            <meshStandardMaterial
              color={beam.color}
              emissive={beam.color}
              emissiveIntensity={1.0}
              metalness={1.0}
              roughness={0.0}
            />
          </mesh>

          {/* Beam top */}
          <mesh position={[0, 20, 0]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial
              color={beam.color}
              emissive={beam.color}
              emissiveIntensity={2.0}
              metalness={1.0}
            />
          </mesh>

          {/* Beam light */}
          <pointLight
            position={[0, 10, 0]}
            intensity={2}
            color={beam.color}
            distance={10}
          />
        </group>
      ))}
    </group>
  );
}

// Gavel of Justice - Massive Ceremonial Hammer
function GavelOfJustice() {
  const gavelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gavelRef.current) {
      gavelRef.current.rotation.y += 0.002;
      gavelRef.current.position.y = 25 + Math.sin(state.clock.elapsedTime) * 1;
    }
  });

  return (
    <group ref={gavelRef} position={[0, 25, 0]}>
      {/* Gavel head */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 5, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.0}
          metalness={1.0}
          roughness={0.0}
        />
      </mesh>

      {/* Gavel handle */}
      <mesh position={[0, -4, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 6, 32]} />
        <meshStandardMaterial
          color="#8B4513"
          emissive="#FFD700"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Gavel rings */}
      {[-1, 0, 1].map((offset, i) => (
        <mesh
          key={i}
          position={[0, offset * 1.5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[2, 0.2, 16, 32]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={1.5}
            metalness={1.0}
            roughness={0.0}
          />
        </mesh>
      ))}

      {/* Gavel glow */}
      <pointLight
        position={[0, 0, 0]}
        intensity={5}
        color="#FFD700"
        distance={20}
      />

      {/* Justice scales below */}
      <group position={[0, -10, 0]}>
        {/* Scale beam */}
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 8, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.8}
            metalness={1.0}
          />
        </mesh>

        {/* Scale plates */}
        {[-3, 3].map((x, i) => (
          <group key={i} position={[x, 0, 0]}>
            <mesh position={[0, -1, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFD700"
                emissiveIntensity={0.8}
                metalness={1.0}
                roughness={0.1}
              />
            </mesh>
            {/* Chain */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
              <meshStandardMaterial color="#FFD700" metalness={1.0} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

// Democracy Pillars - Ancient Columns
function DemocracyPillars() {
  const pillarsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pillarsRef.current) {
      pillarsRef.current.children.forEach((child, index) => {
        const glow = 0.5 + Math.sin(state.clock.elapsedTime + index) * 0.3;
        const material = (child.children[0] as THREE.Mesh)
          .material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = glow;
      });
    }
  });

  const pillars = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 35;
    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      angle,
    };
  });

  return (
    <group ref={pillarsRef}>
      {pillars.map((pillar, index) => (
        <group
          key={index}
          position={[pillar.x, 0, pillar.z]}
          rotation={[0, -pillar.angle, 0]}
        >
          {/* Pillar base */}
          <mesh position={[0, -8, 0]}>
            <cylinderGeometry args={[2.5, 3, 2, 32]} />
            <meshStandardMaterial
              color="#9333EA"
              emissive="#9333EA"
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Pillar column */}
          <mesh position={[0, 5, 0]}>
            <cylinderGeometry args={[2, 2, 24, 32]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#9333EA"
              emissiveIntensity={0.4}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* Pillar rings */}
          {[0, 8, 16].map((y, i) => (
            <mesh key={i} position={[0, y - 7, 0]}>
              <torusGeometry args={[2.2, 0.3, 16, 32]} />
              <meshStandardMaterial
                color="#9333EA"
                emissive="#9333EA"
                emissiveIntensity={0.8}
                metalness={1.0}
              />
            </mesh>
          ))}

          {/* Pillar capital */}
          <mesh position={[0, 17, 0]}>
            <cylinderGeometry args={[3, 2, 2, 32]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.8}
              metalness={1.0}
              roughness={0.1}
            />
          </mesh>

          {/* Pillar light */}
          <spotLight
            position={[0, 18, 0]}
            angle={0.3}
            penumbra={0.5}
            intensity={3}
            color="#9333EA"
            distance={30}
          />
        </group>
      ))}
    </group>
  );
}

// Senate Particles - Democratic Energy
function SenateParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#9333EA"),
      new THREE.Color("#FFD700"),
      new THREE.Color("#06B6D4"),
      new THREE.Color("#00ff00"),
      new THREE.Color("#ff0000"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 10 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

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
      particlesRef.current.rotation.y += 0.0003;
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
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
        size={0.2}
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
function GalacticSenateScene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 30, 100]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 30, 0]} intensity={3} color="#FFD700" />
      <pointLight position={[-30, 15, 0]} intensity={2} color="#9333EA" />
      <pointLight position={[30, 15, 0]} intensity={2} color="#06B6D4" />
      <pointLight position={[0, 0, 30]} intensity={2} color="#00ff00" />
      <pointLight position={[0, 0, -30]} intensity={2} color="#ff0000" />

      {/* Scene Elements */}
      <SenateChamberFloor />
      <VoterOrbs />
      <ProposalHolograms />
      <VotingBeamStreams />
      <GavelOfJustice />
      <DemocracyPillars />
      <SenateParticles />
      <BackgroundStars />
    </>
  );
}

// Export Component
export function GalacticSenateBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 20, 50], fov: 70 }}
        gl={{ powerPreference: "high-performance" }}
      >
        <GalacticSenateScene />
      </Canvas>
    </div>
  );
}

// Keep old export for compatibility
export { GalacticSenateBackground as CouncilChamberBackground };
