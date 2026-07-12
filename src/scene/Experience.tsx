import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { Panels } from '../panels/Panels';
import { ShowroomArchitecture } from './architecture/ShowroomArchitecture';
import { FurniturePreset } from './furniture/FurniturePreset';
import { SceneLighting } from './lighting/SceneLighting';
import { PostEffects } from './lighting/PostEffects';
import { ShowroomControls } from './ShowroomControls';
import { DesignProbe } from './DesignProbe';
import { CAMERA_DEFAULTS, TONE_MAPPING_EXPOSURE } from './sceneConfig';

export function Experience() {
  const selectSurface = useVisualizerStore((s) => s.selectSurface);

  return (
    <>
      <DesignProbe />
      <Canvas
        shadows
        camera={{
          position: CAMERA_DEFAULTS.position,
          fov: CAMERA_DEFAULTS.fov,
          near: CAMERA_DEFAULTS.near,
          far: CAMERA_DEFAULTS.far,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = TONE_MAPPING_EXPOSURE;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        onPointerMissed={() => selectSurface(null)}
      >
        <color attach="background" args={['#1a1c22']} />

        <SceneLighting />
        <ShowroomArchitecture />
        <Panels />

        <Suspense fallback={null}>
          <FurniturePreset />
        </Suspense>

        <PostEffects />
        <ShowroomControls />
      </Canvas>
    </>
  );
}
