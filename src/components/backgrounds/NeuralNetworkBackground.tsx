import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

// Neural Network Brain Background for AI Chat Page
// Features: Pulsing AI brain, chat bubbles, data streams, holographic assistant, knowledge nodes, thinking particles

function AIBrain() {
  const brainRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y += 0.002;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 1;
      brainRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={brainRef} position={[0, 0, 0]}>
      {/* Main brain sphere - wireframe */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial
          color="#9333EA"
          emissive="#9333EA"
          emissiveIntensity={0.6}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.5}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Neural nodes on surface */}
      {Array.from({ length: 40 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 40);
        const theta = Math.sqrt(40 * Math.PI) * phi;
        const x = 5 * Math.cos(theta) * Math.sin(phi);
        const y = 5 * Math.sin(theta) * Math.sin(phi);
        const z = 5 * Math.cos(phi);

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color="#06B6D4"
              emissive="#06B6D4"
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}

      {/* Central glow */}
      <pointLight
        position={[0, 0, 0]}
        intensity={4}
        color="#9333EA"
        distance={20}
      />
    </group>
  );
}

function ChatBubbles() {
  const bubblesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index * 0.5) * 3;
        child.rotation.y += 0.01;
      });
    }
  });

  const bubbles = [
    { x: -12, z: 8, color: "#9333EA", size: 2 },
    { x: 12, z: 8, color: "#06B6D4", size: 2.5 },
    { x: -10, z: -8, color: "#F59E0B", size: 2.2 },
    { x: 10, z: -8, color: "#10B981", size: 1.8 },
  ];

  return (
    <group ref={bubblesRef}>
      {bubbles.map((bubble, i) => (
        <group key={i} position={[bubble.x, 5, bubble.z]}>
          {/* Main bubble */}
          <mesh>
            <sphereGeometry args={[bubble.size, 32, 32]} />
            <meshStandardMaterial
              color={bubble.color}
              emissive={bubble.color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </mesh>
          {/* Bubble tail */}
          <mesh position={[0, -bubble.size * 0.8, 0]}>
            <coneGeometry args={[bubble.size * 0.3, bubble.size * 0.5, 4]} />
            <meshStandardMaterial
              color={bubble.color}
              emissive={bubble.color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DataStreams() {
  const streamsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (streamsRef.current) {
      streamsRef.current.children.forEach((child, index) => {
        child.position.y += 0.05;
        if (child.position.y > 30) {
          child.position.y = -30;
        }
      });
    }
  });

  return (
    <group ref={streamsRef}>
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const radius = 15 + Math.random() * 10;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const colors = ["#9333EA", "#F59E0B", "#06B6D4"];
        const color = colors[i % colors.length];

        return (
          <mesh key={i} position={[x, Math.random() * 60 - 30, z]}>
            <boxGeometry args={[0.1, 1.5, 0.1]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
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

function HolographicAssistant() {
  const assistantRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (assistantRef.current) {
      assistantRef.current.rotation.y += 0.005;
      assistantRef.current.position.y = Math.sin(state.clock.elapsedTime) * 1;
    }
  });

  return (
    <group ref={assistantRef} position={[0, 10, 0]}>
      {/* Head */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={0.5}
          transparent
          opacity={0.5}
          wireframe
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1.5, 3, 32]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#06B6D4"
          emissiveIntensity={0.4}
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.5, 2.3, 1.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[0.5, 2.3, 1.2]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Hologram rings */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0, -2 + i * 0.5, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[2 + i * 0.3, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#06B6D4"
            emissive="#06B6D4"
            emissiveIntensity={0.6}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function KnowledgeNodes() {
  const nodesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.rotation.y -= 0.003;
    }
  });

  return (
    <group ref={nodesRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5) * 5;

        return (
          <group key={i} position={[x, y, z]}>
            {/* Node sphere */}
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial
                color="#F59E0B"
                emissive="#F59E0B"
                emissiveIntensity={0.6}
              />
            </mesh>
            {/* Connection lines to center */}
            <mesh
              position={[-x / 2, -y / 2, -z / 2]}
              rotation={[0, angle, Math.atan2(y, radius)]}
            >
              <cylinderGeometry
                args={[0.02, 0.02, Math.sqrt(x * x + y * y + z * z), 8]}
              />
              <meshStandardMaterial
                color="#9333EA"
                emissive="#9333EA"
                emissiveIntensity={0.4}
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

function ThinkingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const particlesGeometry = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 8 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

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
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  // Cleanup geometry on unmount
  useEffect(() => {
    return () => {
      if (particlesGeometry) {
        particlesGeometry.dispose();
      }
    };
  }, [particlesGeometry]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
      particlesRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;

      // Swirling effect
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        const angle = Math.atan2(z, x) + 0.01;
        const radius = Math.sqrt(x * x + z * z);
        positions[i] = Math.cos(angle) * radius;
        positions[i + 2] = Math.sin(angle) * radius;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
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

function NeuralNetworkScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#9333EA" />
      <pointLight position={[15, 10, 15]} intensity={2} color="#F59E0B" />
      <pointLight position={[-15, 10, -15]} intensity={2} color="#06B6D4" />

      {/* Scene Elements */}
      <Stars />
      <AIBrain />
      <ThinkingParticles />
      <ChatBubbles />
      <DataStreams />
      <HolographicAssistant />
      <KnowledgeNodes />
    </>
  );
}

export function NeuralNetworkBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0F0A1E 0%, #070512 100%)",
        }}
      />
      <Canvas
        camera={{ position: [0, 5, 30], fov: 65 }}
        gl={{ alpha: true, antialias: true }}
      >
        <NeuralNetworkScene />
      </Canvas>
    </div>
  );
}
