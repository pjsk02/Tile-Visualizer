import { useEffect, useRef } from 'react';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  AUTO_ROTATE_DELAY_MS,
  AUTO_ROTATE_SPEED,
  ORBIT_LIMITS,
  ORBIT_TARGET,
} from './sceneConfig';
import {
  CAMERA_PRESETS,
  useShowroomStore,
} from '../store/useShowroomStore';

export function ShowroomControls() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const autoRotate = useShowroomStore((s) => s.autoRotate);
  const setAutoRotate = useShowroomStore((s) => s.setAutoRotate);
  const cameraPreset = useShowroomStore((s) => s.cameraPreset);
  const idleSince = useRef(Date.now());
  const animating = useRef(false);
  const animFrom = useRef(new THREE.Vector3());
  const animTo = useRef(new THREE.Vector3());
  const targetFrom = useRef(new THREE.Vector3());
  const targetTo = useRef(new THREE.Vector3());
  const animStart = useRef(0);

  useEffect(() => {
    const preset = CAMERA_PRESETS.find((p) => p.id === cameraPreset);
    if (!preset || !controlsRef.current) return;

    animFrom.current.copy(camera.position);
    animTo.current.set(preset.position[0], preset.position[1], preset.position[2]);
    targetFrom.current.copy(controlsRef.current.target);
    targetTo.current.set(preset.target[0], preset.target[1], preset.target[2]);
    animStart.current = performance.now();
    animating.current = true;
    setAutoRotate(false);
    idleSince.current = Date.now();
  }, [cameraPreset, camera, setAutoRotate]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (animating.current) {
      const t = Math.min((performance.now() - animStart.current) / 900, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(animFrom.current, animTo.current, eased);
      controls.target.lerpVectors(targetFrom.current, targetTo.current, eased);
      controls.update();
      if (t >= 1) animating.current = false;
      return;
    }

    const idle = Date.now() - idleSince.current > AUTO_ROTATE_DELAY_MS;
    controls.autoRotate = autoRotate && idle;
    controls.autoRotateSpeed = AUTO_ROTATE_SPEED;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={ORBIT_TARGET}
      enablePan
      enableDamping
      dampingFactor={0.06}
      minDistance={ORBIT_LIMITS.minDistance}
      maxDistance={ORBIT_LIMITS.maxDistance}
      minPolarAngle={ORBIT_LIMITS.minPolarAngle}
      maxPolarAngle={ORBIT_LIMITS.maxPolarAngle}
      screenSpacePanning
      onStart={() => {
        idleSince.current = Date.now();
        setAutoRotate(false);
      }}
      onEnd={() => {
        idleSince.current = Date.now();
      }}
    />
  );
}
