import { MeshReflectorMaterial } from '@react-three/drei';
import { useShowroomStore } from '../../store/useShowroomStore';

function LivingRoomSet() {
  return (
    <group position={[2.5, 0, 2]}>
      {/* Sofa */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.5, 0.95]} />
          <meshStandardMaterial color="#5c5348" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0.65, -0.38]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.55, 0.18]} />
          <meshStandardMaterial color="#5c5348" roughness={0.88} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 1.15, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.45, 0.95]} />
            <meshStandardMaterial color="#4a433a" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Coffee table */}
      <mesh position={[-0.8, 0.22, 1.2]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.08, 0.65]} />
        <meshStandardMaterial color="#8b7355" roughness={0.55} metalness={0.05} />
      </mesh>
      {[
        [-0.45, 0.11, 1.45],
        [0.45, 0.11, 1.45],
        [-0.45, 0.11, 0.95],
        [0.45, 0.11, 0.95],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x - 0.8, y, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.22, 8]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}

      {/* Area rug — floor tile visible around edges */}
      <mesh position={[-0.3, 0.025, 0.8]} rotation={[-Math.PI / 2, 0, 0.15]} receiveShadow>
        <planeGeometry args={[2.6, 1.8]} />
        <meshStandardMaterial color="#6b5d52" roughness={0.98} />
      </mesh>

      {/* Floor lamp */}
      <group position={[2.2, 0, -0.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.05, 1.6, 12]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.75} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <coneGeometry args={[0.28, 0.35, 16, 1, true]} />
          <meshStandardMaterial color="#f0e8dc" emissive="#ffe0b0" emissiveIntensity={0.2} roughness={0.7} side={2} />
        </mesh>
        <pointLight position={[0, 0.7, 0]} intensity={0.25} color="#ffe8c0" distance={4} />
      </group>

      {/* Potted plant */}
      <group position={[-2.2, 0, -1.8]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.35, 12]} />
          <meshStandardMaterial color="#8a7a6a" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow>
          <sphereGeometry args={[0.35, 8, 8]} />
          <meshStandardMaterial color="#3d6b42" roughness={0.9} />
        </mesh>
      </group>

      {/* Leaning mirror — showcase glossy tile reflections */}
      <group position={[-1.5, 0, -3.8]} rotation={[0, 0.08, -0.12]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.06, 2.2, 1.1]} />
          <meshStandardMaterial color="#2a2826" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0.04, 1.1, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.95, 2.0]} />
          <MeshReflectorMaterial
            blur={[256, 256]}
            resolution={512}
            mixBlur={0.8}
            mixStrength={1.2}
            roughness={0.15}
            depthScale={0.6}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#c8c8c8"
            metalness={0.4}
            mirror={0.75}
          />
        </mesh>
      </group>
    </group>
  );
}

function BathroomSet() {
  return (
    <group position={[1.5, 0, 1]}>
      {/* Vanity */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.9, 0.55]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.92, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.35, 0.06, 0.5]} />
        <meshStandardMaterial color="#d8d2c8" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Basin */}
      <mesh position={[0, 0.98, 0.05]} castShadow>
        <cylinderGeometry args={[0.25, 0.22, 0.12, 24]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.15} metalness={0.1} />
      </mesh>
      {/* Wall mirror */}
      <mesh position={[0, 1.8, -0.22]}>
        <planeGeometry args={[1.0, 1.2]} />
        <MeshReflectorMaterial
          blur={[128, 128]}
          resolution={256}
          mixBlur={0.6}
          mixStrength={1}
          roughness={0.1}
          color="#d0d0d0"
          mirror={0.8}
        />
      </mesh>
      {/* Towel rail */}
      <group position={[1.1, 1.2, 0.2]}>
        <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.85} roughness={0.25} />
        </mesh>
        {[-0.32, 0.32].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.15, 8]} />
            <meshStandardMaterial color="#b0b0b0" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}
        <mesh position={[0, -0.15, 0.08]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.02, 0.35]} />
          <meshStandardMaterial color="#e8e4dc" roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}

export function FurniturePreset() {
  const scenePreset = useShowroomStore((s) => s.scenePreset);
  return scenePreset === 'bath' ? <BathroomSet /> : <LivingRoomSet />;
}
