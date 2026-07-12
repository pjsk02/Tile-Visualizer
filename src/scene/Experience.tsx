import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { Panels } from '../panels/Panels';
import { CAMERA_DEFAULTS, ORBIT_LIMITS, ORBIT_TARGET } from './sceneConfig';
import { SplatScene } from './SplatScene';
import { PlaceholderRoom } from './PlaceholderRoom';
import { DesignProbe } from './DesignProbe';

export function Experience() {
  const selectSurface = useVisualizerStore((s) => s.selectSurface);

  return (
    <>
      <DesignProbe />
      <Canvas
        camera={{
          position: CAMERA_DEFAULTS.position,
          fov: CAMERA_DEFAULTS.fov,
          near: CAMERA_DEFAULTS.near,
          far: CAMERA_DEFAULTS.far,
        }}
        gl={{ antialias: true }}
        onPointerMissed={() => selectSurface(null)}
      >
        <color attach="background" args={['#111318']} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 8, 5]} intensity={0.85} />
        <Suspense fallback={null}>
          <Environment preset="apartment" environmentIntensity={0.65} />
        </Suspense>

        <SplatScene>
          <PlaceholderRoom />
        </SplatScene>

        {/* Inserted flat quads — only layer that receives tile textures */}
        <Panels />

        <OrbitControls
          makeDefault
          target={ORBIT_TARGET}
          enablePan
          enableDamping
          dampingFactor={0.08}
          minDistance={ORBIT_LIMITS.minDistance}
          maxDistance={ORBIT_LIMITS.maxDistance}
          maxPolarAngle={ORBIT_LIMITS.maxPolarAngle}
          screenSpacePanning
        />
      </Canvas>
    </>
  );
}
