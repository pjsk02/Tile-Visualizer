import { useMemo } from 'react';
import * as THREE from 'three';
import { ROOM, WINDOW, DOOR } from '../sceneConfig';

const wallPaint = '#ddd8cf';
const trimPaint = '#ece7de';
const ceilingPaint = '#e8e3da';
const framePaint = '#b8b0a4';

function Baseboard({
  position,
  rotation,
  length,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[length, ROOM.baseboardHeight, ROOM.baseboardDepth]} />
      <meshStandardMaterial color={trimPaint} roughness={0.65} metalness={0} />
    </mesh>
  );
}

function Crown({
  position,
  rotation,
  length,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[length, ROOM.crownHeight, ROOM.crownDepth]} />
      <meshStandardMaterial color={trimPaint} roughness={0.55} metalness={0} />
    </mesh>
  );
}

function WindowAssembly() {
  const { width, height, sillY, centerZ } = WINDOW;
  const x = ROOM.halfW - ROOM.wallThickness / 2;
  const centerY = sillY + height / 2;

  return (
    <group position={[x, 0, centerZ]}>
      {/* Glass */}
      <mesh position={[0, centerY, 0]} castShadow>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#b8d4e8"
          transmission={0.55}
          opacity={0.75}
          transparent
          roughness={0.08}
          metalness={0}
          ior={1.45}
          thickness={0.02}
        />
      </mesh>
      {/* Soft exterior fill — low emissive to avoid blowout */}
      <mesh position={[0.08, centerY, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[width * 1.1, height * 1.1]} />
        <meshBasicMaterial color="#fff0d8" toneMapped />
      </mesh>
      {/* Frame top/bottom */}
      <mesh position={[0, centerY + height / 2 + 0.04, 0]} castShadow>
        <boxGeometry args={[0.06, 0.08, width + 0.12]} />
        <meshStandardMaterial color={framePaint} roughness={0.7} />
      </mesh>
      <mesh position={[0, centerY - height / 2 - 0.04, 0]} castShadow>
        <boxGeometry args={[0.06, 0.08, width + 0.12]} />
        <meshStandardMaterial color={framePaint} roughness={0.7} />
      </mesh>
      {/* Frame sides */}
      <mesh position={[0, centerY, -width / 2 - 0.04]} castShadow>
        <boxGeometry args={[0.06, height, 0.08]} />
        <meshStandardMaterial color={framePaint} roughness={0.7} />
      </mesh>
      <mesh position={[0, centerY, width / 2 + 0.04]} castShadow>
        <boxGeometry args={[0.06, height, 0.08]} />
        <meshStandardMaterial color={framePaint} roughness={0.7} />
      </mesh>
      {/* Sill */}
      <mesh position={[0.04, sillY - 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.14, 0.06, width + 0.2]} />
        <meshStandardMaterial color={trimPaint} roughness={0.6} />
      </mesh>
      {/* Curtains */}
      <mesh position={[-0.02, centerY, -width / 2 - 0.15]} castShadow>
        <planeGeometry args={[0.5, height + 0.4]} />
        <meshStandardMaterial color="#c8bfb2" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.02, centerY, width / 2 + 0.15]} castShadow>
        <planeGeometry args={[0.5, height + 0.4]} />
        <meshStandardMaterial color="#c8bfb2" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DoorFrame() {
  const { width, height, centerX } = DOOR;
  const z = -ROOM.halfD + 0.02;

  return (
    <group position={[centerX, 0, z]}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width + 0.16, 0.08, DOOR.frameDepth]} />
        <meshStandardMaterial color={framePaint} roughness={0.65} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * (width / 2 + 0.04), height / 2, 0]}
          castShadow
        >
          <boxGeometry args={[0.08, height, DOOR.frameDepth]} />
          <meshStandardMaterial color={framePaint} roughness={0.65} />
        </mesh>
      ))}
      <mesh position={[0, height / 2, -0.01]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#ddd8cf" roughness={0.9} />
      </mesh>
    </group>
  );
}

function WallFrames() {
  const frames = useMemo(
    () => [
      { pos: [-4.85, 5.2, -2.5] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: 1.1, h: 0.85, art: '#8a9aab' },
      { pos: [-4.85, 4.0, 0.5] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number], w: 0.75, h: 0.95, art: '#a8927a' },
      { pos: [0, 5.5, -4.85] as [number, number, number], rot: [0, 0, 0] as [number, number, number], w: 0.9, h: 0.7, art: '#7a8a72' },
    ],
    [],
  );

  return (
    <>
      {frames.map((f, i) => (
        <group key={i} position={f.pos} rotation={f.rot}>
          <mesh castShadow>
            <boxGeometry args={[f.w + 0.1, f.h + 0.1, 0.04]} />
            <meshStandardMaterial color={framePaint} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[f.w, f.h]} />
            <meshStandardMaterial color={f.art} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function PendantLight() {
  return (
    <group position={[1.5, ROOM.height - 0.3, 1]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.5, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#f5efe4" emissive="#ffd8a0" emissiveIntensity={0.2} roughness={0.4} />
      </mesh>
      <pointLight position={[0, -0.55, 0]} intensity={0.28} color="#ffe8c8" distance={6} castShadow />
    </group>
  );
}

export function ShowroomArchitecture() {
  const { halfW, halfD, height, width, depth } = ROOM;

  return (
    <group>
      <mesh position={[0, height, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={ceilingPaint} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[halfW, height / 2, 0]} receiveShadow>
        <boxGeometry args={[ROOM.wallThickness, height, depth]} />
        <meshStandardMaterial color={wallPaint} roughness={0.88} />
      </mesh>

      <WindowAssembly />
      <DoorFrame />
      <WallFrames />
      <PendantLight />

      <Baseboard position={[0, ROOM.baseboardHeight / 2, -halfD + ROOM.baseboardDepth / 2]} rotation={[0, 0, 0]} length={width} />
      <Baseboard position={[-halfW + ROOM.baseboardDepth / 2, ROOM.baseboardHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} length={depth} />
      <Baseboard position={[halfW - ROOM.baseboardDepth / 2, ROOM.baseboardHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} length={depth} />

      <Crown position={[0, height - ROOM.crownHeight / 2, -halfD + ROOM.crownDepth / 2]} rotation={[0, 0, 0]} length={width} />
      <Crown position={[-halfW + ROOM.crownDepth / 2, height - ROOM.crownHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} length={depth} />
      <Crown position={[halfW - ROOM.crownDepth / 2, height - ROOM.crownHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} length={depth} />
    </group>
  );
}
