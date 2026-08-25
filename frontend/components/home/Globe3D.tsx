"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";

const RADIUS = 2.2;
const HUB_ISO = "PT";

const NODES: { iso: string; lat: number; lon: number }[] = [
  { iso: "PT", lat: 38.7, lon: -9.1 },
  { iso: "BR", lat: -15.8, lon: -47.9 },
  { iso: "AO", lat: -8.8, lon: 13.2 },
  { iso: "MZ", lat: -25.9, lon: 32.6 },
  { iso: "CV", lat: 14.9, lon: -23.5 },
  { iso: "GW", lat: 11.9, lon: -15.6 },
  { iso: "GQ", lat: 3.75, lon: 8.78 },
  { iso: "ST", lat: 0.33, lon: 6.73 },
  { iso: "TL", lat: -8.55, lon: 125.56 },
];

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);

  const points = useMemo(
    () => NODES.map((n) => ({ ...n, position: latLonToVector3(n.lat, n.lon, RADIUS) })),
    []
  );
  const hub = points.find((p) => p.iso === HUB_ISO)!;

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={group} rotation={[0.3, 0.6, 0]}>
      <mesh>
        <sphereGeometry args={[RADIUS, 32, 32]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.12} />
      </mesh>

      {points.map((p) => (
        <mesh key={p.iso} position={p.position}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#6ee7b7" />
        </mesh>
      ))}

      {points
        .filter((p) => p.iso !== HUB_ISO)
        .map((p) => {
          const mid = hub.position
            .clone()
            .add(p.position)
            .normalize()
            .multiplyScalar(RADIUS * 1.35);
          return (
            <QuadraticBezierLine
              key={p.iso}
              start={hub.position.toArray()}
              end={p.position.toArray()}
              mid={mid.toArray()}
              color="#34d399"
              lineWidth={1}
              transparent
              opacity={0.35}
            />
          );
        })}
    </group>
  );
}

export function Globe3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <Scene />
    </Canvas>
  );
}
