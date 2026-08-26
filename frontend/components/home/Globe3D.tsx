"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GREEN = "#3CB65E";
const GREEN_BRIGHT = "#8BE04D";

/** Uma pequena particula de "sinal" a subir em direcao ao ecra do telemovel, em loop. */
function SignalParticle({ offset, radius }: { offset: number; radius: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * 0.35 + offset) % 1;
    const angle = offset * Math.PI * 2;
    const spiralRadius = radius * (1 - t) + 0.15;
    ref.current.position.set(
      Math.cos(angle + t * 4) * spiralRadius,
      t * 2.6 - 1.1,
      Math.sin(angle + t * 4) * spiralRadius
    );
    const scale = Math.sin(t * Math.PI);
    ref.current.scale.setScalar(0.4 + scale * 0.9);
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.15 + scale * 0.85;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color={GREEN_BRIGHT} transparent opacity={0.8} />
    </mesh>
  );
}

function PhoneMockup() {
  const group = useRef<THREE.Group>(null);
  const screenMaterial = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.7) * 0.12;
      group.current.rotation.y = Math.sin(t * 0.25) * 0.35;
      group.current.rotation.x = Math.cos(t * 0.2) * 0.05;
    }
    if (screenMaterial.current) {
      screenMaterial.current.emissiveIntensity = 0.7 + Math.sin(t * 1.6) * 0.25;
    }
  });

  return (
    <group ref={group} rotation={[0.05, -0.4, 0]}>
      {/* Corpo do telemovel */}
      <mesh>
        <boxGeometry args={[1.15, 2.3, 0.12]} />
        <meshStandardMaterial color="#0B1B14" roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Ecra */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[0.98, 2.05]} />
        <meshStandardMaterial
          ref={screenMaterial}
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={0.7}
          roughness={0.5}
        />
      </mesh>
      {/* Marca de saldo no ecra */}
      <mesh position={[0, 0.05, 0.075]}>
        <ringGeometry args={[0.22, 0.3, 32]} />
        <meshBasicMaterial color="#F5FBF7" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Scene() {
  const particles = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ offset: i / 12, radius: 0.55 + (i % 3) * 0.2 })),
    []
  );

  return (
    <group scale={0.72}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-2, -1, 2]} intensity={0.6} color={GREEN_BRIGHT} />

      <PhoneMockup />

      {particles.map((p, i) => (
        <SignalParticle key={i} offset={p.offset} radius={p.radius} />
      ))}
    </group>
  );
}

export function Globe3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <Scene />
    </Canvas>
  );
}
