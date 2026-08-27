"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";

const RADIUS = 2.2;
const HUB_ISO = "PT";
const LINE_COLOR = "#059669";

const NODES: { iso: string; lat: number; lon: number }[] = [
  { iso: "PT", lat: 38.7, lon: -9.1 },
  { iso: "BR", lat: -15.8, lon: -47.9 },
  { iso: "AO", lat: -8.8, lon: 13.2 },
  { iso: "MZ", lat: -25.9, lon: 32.6 },
  { iso: "CV", lat: 14.9, lon: -23.5 },
  { iso: "GW", lat: 11.9, lon: -15.6 },
  { iso: "ST", lat: 0.33, lon: 6.73 },
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

/** Pontos de um círculo de latitude (paralelo) num dado ângulo polar. */
function latitudeCircle(phiDeg: number, radius: number, segments = 64) {
  const phi = (phiDeg * Math.PI) / 180;
  const r = radius * Math.sin(phi);
  const y = radius * Math.cos(phi);
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push([r * Math.cos(theta), y, r * Math.sin(theta)]);
  }
  return points;
}

/** Pontos de um círculo de longitude (meridiano), rodado em torno do eixo Y. */
function longitudeCircle(thetaDeg: number, radius: number, segments = 64) {
  const theta = (thetaDeg * Math.PI) / 180;
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const phi = (i / segments) * Math.PI * 2;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    points.push([x, y, z]);
  }
  return points;
}

function GlobeWireframe() {
  const latitudes = useMemo(
    () => [-60, -30, 0, 30, 60].map((deg) => latitudeCircle(90 - deg, RADIUS)),
    []
  );
  const longitudes = useMemo(
    () => [0, 30, 60, 90, 120, 150].map((deg) => longitudeCircle(deg, RADIUS)),
    []
  );

  return (
    <>
      {latitudes.map((pts, i) => (
        <Line key={`lat-${i}`} points={pts} color={LINE_COLOR} transparent opacity={0.22} lineWidth={1} />
      ))}
      {longitudes.map((pts, i) => (
        <Line key={`lon-${i}`} points={pts} color={LINE_COLOR} transparent opacity={0.22} lineWidth={1} />
      ))}
    </>
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
    if (group.current) group.current.rotation.y += delta * 0.06;
  });

  return (
    <group ref={group} rotation={[0.25, 0.5, 0]}>
      <GlobeWireframe />

      {points.map((p) => (
        <mesh key={p.iso} position={p.position}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color="#059669" />
        </mesh>
      ))}

      {points
        .filter((p) => p.iso !== HUB_ISO)
        .map((p) => {
          const mid = hub.position
            .clone()
            .add(p.position)
            .normalize()
            .multiplyScalar(RADIUS * 1.3);
          return (
            <QuadraticBezierLine
              key={p.iso}
              start={hub.position.toArray()}
              end={p.position.toArray()}
              mid={mid.toArray()}
              color={LINE_COLOR}
              lineWidth={1.25}
              transparent
              opacity={0.5}
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
      camera={{ position: [0, 0, 5.6], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <Scene />
    </Canvas>
  );
}
