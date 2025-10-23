import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import { usePerformance } from "@/contexts/PerformanceContext";

// Digital Art Gallery in Space Background for NFT Marketplace
// Features: Rotating NFT frames, rainbow shimmer, floating gems, auction hammer, rarity stars, spotlights

function NFTFrames() {
  const framesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (framesRef.current) {
      framesRef.current.rotation.y += 0.002;
    }
  });

  const frames = [
    { color: "#9333EA", size: 3, distance: 15 }, // Epic Purple
    { color: "#F59E0B", size: 3.5, distance: 18 }, // Legendary Gold
    { color: "#06B6D4", size: 2.5, distance: 12 }, // Rare Cyan
    { color: "#10B981", size: 2, distance: 10 }, // Uncommon Green
    { color: "#EF4444", size: 2, distance: 10 }, // Common Red
  ];

  return (
    <group ref={framesRef}>
      {frames.map((frame, index) => {
        const angle = (index / frames.length) * Math.PI * 2;
        const x = Math.cos(angle) * frame.distance;
        const z = Math.sin(angle) * frame.distance;

        return (
          <group key={index} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Frame border */}
            <mesh>
              <boxGeometry args={[frame.size + 0.3, frame.size + 0.3, 0.2]} />
              <meshStandardMaterial
                color={frame.color}
                emissive={frame.color}
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Inner display */}
            <mesh position={[0, 0, 0.15]}>
              <planeGeometry args={[frame.size, frame.size]} />
              <meshStandardMaterial
                color="#1a1a2e"
                emissive={frame.color}
                emissiveIntensity={0.2}
              />
            </mesh>
            {/* Frame glow */}
            <pointLight
              position={[0, 0, 1]}
              intensity={2}
              color={frame.color}
              distance={8}
            />
          </group>
        );
      })}
    </group>
  );
}

function RainbowShimmer() {
  const shimmerRef = useRef<THREE.Points>(null);

  const particlesGeometry = useMemo(() => {
    const count = 800;
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

      // Rainbow colors
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

  // Cleanup geometry on unmount
  useEffect(() => {
    return () => {
      if (particlesGeometry) {
        particlesGeometry.dispose();
      }
    };
  }, [particlesGeometry]);

  useFrame((state) => {
    if (shimmerRef.current) {
      shimmerRef.current.rotation.y += 0.003;
      shimmerRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <points ref={shimmerRef} geometry={particlesGeometry}>
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

function FloatingGems() {
  const gemsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gemsRef.current) {
      gemsRef.current.children.forEach((child, index) => {
        child.position.y = Math.sin(state.clock.elapsedTime + index * 0.5) * 2;
        child.rotation.y += 0.01;
        child.rotation.x += 0.005;
      });
    }
  });

  const gems = [
    { color: "#9333EA", position: [8, 5, 8] },
    { color: "#F59E0B", position: [-8, 3, 8] },
    { color: "#06B6D4", position: [8, 4, -8] },
    { color: "#10B981", position: [-8, 6, -8] },
    { color: "#EF4444", position: [0, 7, 10] },
    { color: "#EC4899", position: [0, 2, -10] },
  ];

  return (
    <group ref={gemsRef}>
      {gems.map((gem, i) => (
        <mesh key={i} position={gem.position as [number, number, number]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={gem.color}
            emissive={gem.color}
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function AuctionHammer() {
  const hammerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (hammerRef.current) {
      const strike = Math.sin(state.clock.elapsedTime * 2) * 0.3;
      hammerRef.current.rotation.z = strike;
    }
  });

  return (
    <group ref={hammerRef} position={[0, -8, 15]} rotation={[0, 0, -0.5]}>
      {/* Hammer head */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#F59E0B"
          emissiveIntensity={0.4}
          metalness={0.8}
        />
      </mesh>
      {/* Hammer handle */}
      <mesh position={[-1, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

function RarityStars() {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y -= 0.004;
      starsRef.current.children.forEach((child, index) => {
        const pulse = Math.sin(state.clock.elapsedTime * 3 + index) * 0.2 + 1;
        child.scale.set(pulse, pulse, pulse);
      });
    }
  });

  return (
    <group ref={starsRef}>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5) * 4;

        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial
              color="#FFD700"
              emissive="#FFD700"
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function GallerySpotlights() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * 15;
        const z = Math.sin(angle) * 15;

        return (
          <spotLight
            key={i}
            position={[x, 15, z]}
            angle={0.3}
            penumbra={0.5}
            intensity={2}
            color="#ffffff"
            target-position={[0, 0, 0]}
          />
        );
      })}
    </>
  );
}

function BackgroundStars() {
  const starsRef = useRef<THREE.Points>(null);
  const { settings } = usePerformance();

  const starsGeometry = useMemo(() => {
    const count = Math.min(6000, settings.particleCount * 3);
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
    sensitivity: 0.3,
    smoothing: 0.08,
    maxOffset: 8,
  });

  useFrame(() => {
    if (isEnabled) {
      const offset = getCameraOffset();
      camera.position.x = offset.x;
      camera.position.y = 5 + offset.y;
      camera.position.z = 30 + offset.z;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function NFTGalleryScene() {
  return (
    <>
      {/* Camera Controller */}
      <CameraController />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={2} color="#9333EA" />
      <GallerySpotlights />

      {/* Scene Elements */}
      <BackgroundStars />
      <NFTFrames />
      <RainbowShimmer />
      <FloatingGems />
      <AuctionHammer />
      <RarityStars />
    </>
  );
}

export function NFTGalleryBackground() {
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
        <NFTGalleryScene />
      </Canvas>
    </div>
  );
}
