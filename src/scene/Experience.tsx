import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Room } from './Room';

// TODO(Dev A): swap Room for the real FlashWorld .ply scene (public/scene/*.ply),
// loaded via @mkkellogg/gaussian-splats-3d — see CLAUDE.md for the loader rationale.
export function Experience() {
  return (
    <Canvas camera={{ position: [11, 8, 11], fov: 45 }}>
      <color attach="background" args={['#111318']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <Room />
      <OrbitControls target={[0, 3, 0]} />
    </Canvas>
  );
}
