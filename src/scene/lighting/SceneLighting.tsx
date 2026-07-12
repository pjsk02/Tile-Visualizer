import { Suspense } from 'react';
import { Environment } from '@react-three/drei';
import { ContactShadows } from '@react-three/drei';
import { HDRI_PATH } from '../sceneConfig';

function HdriEnvironment() {
  return (
    <Environment
      files={HDRI_PATH}
      background={false}
      environmentIntensity={0.9}
    />
  );
}

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.18} color="#f4f0ea" />
      <directionalLight
        castShadow
        position={[6, 10, 4]}
        intensity={1.05}
        color="#fff8ee"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* Window key light from +X */}
      <directionalLight
        castShadow
        position={[12, 6, -2]}
        intensity={0.55}
        color="#e8f2ff"
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0003}
      />
      <pointLight position={[0, 6, 0]} intensity={0.15} color="#ffd9a8" distance={14} />
      <Suspense fallback={null}>
        <HdriEnvironment />
      </Suspense>
      <ContactShadows
        position={[0, 0.021, 0]}
        opacity={0.55}
        scale={12}
        blur={2.2}
        far={4.5}
        resolution={512}
        color="#0a0a0c"
      />
    </>
  );
}
