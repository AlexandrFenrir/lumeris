import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// 🖼️ COSMIC ART MUSEUM - NFT Marketplace Background
// Epic Features: Rotating gallery, auction podium, rarity portals, 3D NFT sculptures, collector avatars, art beams

// Rotating Gallery with Massive NFT Frames
function RotatingGallery() {
  const galleryRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (galleryRef.current) {
      galleryRef.current.rotation.y += 0.002;
    }
  });

  const frames = [
    { color: "#FFD700", size: 8, distance: 30, rarity: "Legendary", glow: 2.0 },
    { color: "#9333EA", size: 7, distance: 28, rarity: "Epic", glow: 1.5 },
    { color: "#06B6D4", size: 6, distance: 26, rarity: "Rare", glow: 1.2 },
    { color: "#10B981", size: 5, distance: 24, rarity: "Uncommon", glow: 1.0 },
    { color: "#F59E0B", size: 8, distance: 30, rarity: "Legendary", glow: 2.0 },
    { color: "#9333EA", size: 7, distance: 28, rarity: "Epic", glow: 1.5 },
    { color: "#06B6D4", size: 6, distance: 26, rarity: "Rare", glow: 1.2 },
    { color: "#EF4444", size: 5, distance: 24, rarity: "Common", glow: 0.8 },
  ];

  return (
    <group ref={galleryRef}>
      {frames.map((frame, index) => {
        const angle = (index / frames.length) * Math.PI * 2;
        const x = Math.cos(angle) * frame.distance;
        const z = Math.sin(angle) * frame.distance;

        return (
          <group key={index} position={[x, 5, z]} rotation={[0, -angle, 0]}>
            {/* Outer frame border */}
            <mesh>
              <boxGeometry args={[frame.size + 0.8, frame.size + 0.8, 0.4]} />
              <meshStandardMaterial
                color={frame.color}
                emissive={frame.color}
                emissiveIntensity={frame.glow}
                metalness={1.0}
                roughness={0.1}
              />
            </mesh>

            {/* Inner art display */}
            <mesh position={[0, 0, 0.3]}>
              <planeGeometry args={[frame.size, frame.size]} />
              <meshStandardMaterial
                color="#0a0a0a"
                emissive={frame.color}
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Holographic shimmer effect */}
            <mesh position={[0, 0, 0.4]}>
              <planeGeometry args={[frame.size - 0.5, frame.size - 0.5]} />
              <meshStandardMaterial
                color={frame.color}
                transparent
                opacity={0.2}
                emissive={frame.color}
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* Frame spotlight */}
            <spotLight
              position={[0, 0, 5]}
              angle={0.3}
              penumbra={0.5}
              intensity={frame.glow * 3}
              color={frame.color}
              distance={15}
            />

            {/* Corner decorations */}
            {[
              [-frame.size / 2, frame.size / 2],
              [frame.size / 2, frame.size / 2],
              [-frame.size / 2, -frame.size / 2],
              [frame.size / 2, -frame.size / 2],
            ].map(([cx, cy], i) => (
              <mesh key={i} position={[cx, cy, 0.5]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                  color={frame.color}
                  emissive={frame.color}
                  emissiveIntensity={1.5}
                  metalness={1.0}
                />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

// Central Auction Podium with Rotating NFT
function AuctionPodium() {
  const podiumRef = useRef<THREE.Group>(null);
  const nftRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (nftRef.current) {
      nftRef.current.rotation.y += 0.01;
      nftRef.current.position.y =
        8 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group ref={podiumRef} position={[0, -5, 0]}>
      {/* Podium base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[5, 6, 2, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#9333EA"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Podium middle tier */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[4, 5, 2, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#06B6D4"
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Podium top tier */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[3, 4, 2, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Featured NFT sculpture */}
      <mesh ref={nftRef} position={[0, 8, 0]}>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={1.5}
          metalness={1.0}
          roughness={0.0}
        />
      </mesh>

      {/* Holographic price display */}
      <mesh position={[0, 10, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[4, 1]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={1.0}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Auction spotlight from above */}
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={10}
        color="#FFD700"
        distance={25}
        target={nftRef.current || undefined}
      />

      {/* Energy beam shooting upward */}
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 8, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={2.0}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

// Rarity Portals - Gateways to Different NFT Collections
function RarityPortals() {
  const portalsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (portalsRef.current) {
      portalsRef.current.children.forEach((child, index) => {
        child.rotation.z += 0.005 * (index % 2 === 0 ? 1 : -1);
      });
    }
  });

  const portals = [
    { x: -20, y: 10, z: -15, color: "#FFD700", name: "Legendary" },
    { x: 20, y: 10, z: -15, color: "#9333EA", name: "Epic" },
    { x: -20, y: 10, z: 15, color: "#06B6D4", name: "Rare" },
    { x: 20, y: 10, z: 15, color: "#10B981", name: "Uncommon" },
  ];

  return (
    <group ref={portalsRef}>
      {portals.map((portal, index) => (
        <group key={index} position={[portal.x, portal.y, portal.z]}>
          {/* Portal outer ring */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[3, 0.3, 16, 32]} />
            <meshStandardMaterial
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={1.5}
              metalness={1.0}
              roughness={0.0}
            />
          </mesh>

          {/* Portal inner ring */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[2.5, 0.2, 16, 32]} />
            <meshStandardMaterial
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={2.0}
              metalness={1.0}
              roughness={0.0}
            />
          </mesh>

          {/* Portal energy field */}
          <mesh>
            <circleGeometry args={[2.5, 32]} />
            <meshStandardMaterial
              color={portal.color}
              emissive={portal.color}
              emissiveIntensity={0.8}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Portal light */}
          <pointLight
            position={[0, 0, 0]}
            intensity={5}
            color={portal.color}
            distance={15}
          />
        </group>
      ))}
    </group>
  );
}

// 3D NFT Sculptures Floating Around
function NFTSculptures() {
  const sculpturesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sculpturesRef.current) {
      sculpturesRef.current.children.forEach((child, index) => {
        child.rotation.x += 0.003;
        child.rotation.y += 0.005;
        child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.02;
      });
    }
  });

  const sculptures = [
    { x: -15, y: 0, z: 0, color: "#FFD700", shape: "dodecahedron" },
    { x: 15, y: 5, z: 0, color: "#9333EA", shape: "icosahedron" },
    { x: 0, y: 10, z: -20, color: "#06B6D4", shape: "octahedron" },
    { x: -10, y: -5, z: 10, color: "#F59E0B", shape: "tetrahedron" },
    { x: 10, y: -5, z: -10, color: "#10B981", shape: "dodecahedron" },
    { x: 0, y: 15, z: 10, color: "#EF4444", shape: "icosahedron" },
  ];

  return (
    <group ref={sculpturesRef}>
      {sculptures.map((sculpture, index) => {
        let geometry;
        switch (sculpture.shape) {
          case "dodecahedron":
            geometry = <dodecahedronGeometry args={[2, 0]} />;
            break;
          case "icosahedron":
            geometry = <icosahedronGeometry args={[2, 0]} />;
            break;
          case "octahedron":
            geometry = <octahedronGeometry args={[2, 0]} />;
            break;
          case "tetrahedron":
            geometry = <tetrahedronGeometry args={[2, 0]} />;
            break;
          default:
            geometry = <boxGeometry args={[2, 2, 2]} />;
        }

        return (
          <group key={index} position={[sculpture.x, sculpture.y, sculpture.z]}>
            <mesh>
              {geometry}
              <meshStandardMaterial
                color={sculpture.color}
                emissive={sculpture.color}
                emissiveIntensity={1.0}
                metalness={0.9}
                roughness={0.1}
                wireframe={false}
              />
            </mesh>

            {/* Wireframe overlay */}
            <mesh>
              {geometry}
              <meshStandardMaterial
                color={sculpture.color}
                emissive={sculpture.color}
                emissiveIntensity={0.5}
                wireframe={true}
                transparent
                opacity={0.3}
              />
            </mesh>

            {/* Sculpture glow */}
            <pointLight
              position={[0, 0, 0]}
              intensity={3}
              color={sculpture.color}
              distance={10}
            />
          </group>
        );
      })}
    </group>
  );
}

// Collector Avatars - Holographic Buyers
function CollectorAvatars() {
  const avatarsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (avatarsRef.current) {
      avatarsRef.current.rotation.y += 0.001;
    }
  });

  const avatars = [
    { angle: 0, color: "#00ff00", distance: 35 },
    { angle: 60, color: "#00ffff", distance: 35 },
    { angle: 120, color: "#ff00ff", distance: 35 },
    { angle: 180, color: "#ffff00", distance: 35 },
    { angle: 240, color: "#ff6600", distance: 35 },
    { angle: 300, color: "#6600ff", distance: 35 },
  ];

  return (
    <group ref={avatarsRef}>
      {avatars.map((avatar, index) => {
        const radian = (avatar.angle * Math.PI) / 180;
        const x = Math.cos(radian) * avatar.distance;
        const z = Math.sin(radian) * avatar.distance;

        return (
          <group key={index} position={[x, 0, z]} rotation={[0, -radian, 0]}>
            {/* Avatar body */}
            <mesh position={[0, 0, 0]}>
              <capsuleGeometry args={[0.5, 2, 8, 16]} />
              <meshStandardMaterial
                color={avatar.color}
                emissive={avatar.color}
                emissiveIntensity={0.8}
                transparent
                opacity={0.6}
                wireframe={true}
              />
            </mesh>

            {/* Avatar head */}
            <mesh position={[0, 2, 0]}>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial
                color={avatar.color}
                emissive={avatar.color}
                emissiveIntensity={1.0}
                transparent
                opacity={0.5}
                wireframe={true}
              />
            </mesh>

            {/* Avatar glow */}
            <pointLight
              position={[0, 1, 0]}
              intensity={2}
              color={avatar.color}
              distance={8}
            />
          </group>
        );
      })}
    </group>
  );
}

// Art Beam Particles - Rainbow shimmer
function ArtBeamParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#FFD700"),
      new THREE.Color("#9333EA"),
      new THREE.Color("#06B6D4"),
      new THREE.Color("#10B981"),
      new THREE.Color("#F59E0B"),
      new THREE.Color("#EF4444"),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 10 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = (Math.random() - 0.5) * 40;
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
      particlesRef.current.rotation.y += 0.0005;
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
        size={0.15}
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
    const count = 10000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;
    }

    return positions;
  }, []);

  useFrame((state) => {
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
function CosmicArtMuseumScene() {
  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 30, 100]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 20, 0]} intensity={2} color="#FFD700" />
      <pointLight position={[-30, 10, 0]} intensity={1.5} color="#9333EA" />
      <pointLight position={[30, 10, 0]} intensity={1.5} color="#06B6D4" />
      <pointLight position={[0, -10, 30]} intensity={1.5} color="#10B981" />

      {/* Scene Elements */}
      <RotatingGallery />
      <AuctionPodium />
      <RarityPortals />
      <NFTSculptures />
      <CollectorAvatars />
      <ArtBeamParticles />
      <BackgroundStars />
    </>
  );
}

// Export Component
export function CosmicArtMuseumBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 15, 50], fov: 70 }}
        gl={{ powerPreference: "high-performance" }}
      >
        <CosmicArtMuseumScene />
      </Canvas>
    </div>
  );
}

// Keep old export for compatibility
export { CosmicArtMuseumBackground as NFTGalleryBackground };
