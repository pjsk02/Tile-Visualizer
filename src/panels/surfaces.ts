import type { Surface } from '../types/surface';

/**
 * Redesignable flat-quad panels aligned to the current scene.
 * Reposition when the real FlashWorld .ply lands; keep ids stable.
 */
export const SCENE_SURFACES: readonly Surface[] = [
  {
    id: 'floor',
    kind: 'floor',
    placement: {
      position: [0, 0.02, 0],
      rotation: [-Math.PI / 2, 0, 0],
      width: 10,
      height: 10,
    },
  },
  {
    id: 'wall-back',
    kind: 'wall',
    placement: {
      position: [0, 4, -4.98],
      rotation: [0, 0, 0],
      width: 10,
      height: 8,
    },
  },
  {
    id: 'wall-left',
    kind: 'wall',
    placement: {
      position: [-4.98, 4, 0],
      rotation: [0, Math.PI / 2, 0],
      width: 10,
      height: 8,
    },
  },
];

export function getSurfaceById(id: string): Surface | undefined {
  return SCENE_SURFACES.find((s) => s.id === id);
}
