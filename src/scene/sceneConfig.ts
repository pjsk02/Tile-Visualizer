/** One-line swap when FlashWorld .ply lands in public/scene/. */
export const SCENE_PLY_PATH = '/scene/room.ply' as const;

export const SCENE_LOAD_OPTIONS = {
  splatAlphaRemovalThreshold: 5,
  showLoadingUI: false,
  // COOP/COEP not configured in vite — disable shared memory until headers land.
  sharedMemoryForWorkers: false,
  gpuAcceleratedSort: false,
} as const;

export const ORBIT_TARGET: [number, number, number] = [0, 3, 0];

export const CAMERA_DEFAULTS = {
  position: [11, 8, 11] as [number, number, number],
  fov: 45,
  near: 0.1,
  far: 200,
};

export const ORBIT_LIMITS = {
  minDistance: 3,
  maxDistance: 50,
  maxPolarAngle: Math.PI / 2 - 0.05,
};
