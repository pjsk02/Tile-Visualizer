/** Hand-built showroom room constants (meters). */
export const ROOM = {
  width: 10,
  depth: 10,
  height: 8,
  halfW: 5,
  halfD: 5,
  wallThickness: 0.12,
  baseboardHeight: 0.12,
  baseboardDepth: 0.04,
  crownHeight: 0.08,
  crownDepth: 0.05,
} as const;

export const ORBIT_TARGET: [number, number, number] = [0, 3, 0];

export const CAMERA_DEFAULTS = {
  position: [11, 8, 11] as [number, number, number],
  fov: 45,
  near: 0.1,
  far: 200,
};

export const ORBIT_LIMITS = {
  minDistance: 4,
  maxDistance: 22,
  minPolarAngle: 0.35,
  maxPolarAngle: Math.PI / 2 - 0.08,
};

export const TONE_MAPPING_EXPOSURE = 0.92;

export const HDRI_PATH = '/showroom/hdri/studio_small_09_1k.hdr' as const;

export const AUTO_ROTATE_DELAY_MS = 8000;
export const AUTO_ROTATE_SPEED = 0.35;

/** Window on right wall (+X). */
export const WINDOW = {
  width: 2.8,
  height: 2.2,
  sillY: 2.4,
  centerZ: -1.5,
} as const;

export const DOOR = {
  width: 1.0,
  height: 2.1,
  frameDepth: 0.08,
  /** Back wall, toward +X from corner. */
  centerX: 3.2,
} as const;
