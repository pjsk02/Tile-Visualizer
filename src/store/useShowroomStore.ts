import { create } from 'zustand';
import type { Tile } from '../types/catalog';

export type ScenePreset = 'living' | 'bath';
export type CameraPresetId = 'corner' | 'window' | 'detail';

export interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

export const CAMERA_PRESETS: readonly CameraPreset[] = [
  {
    id: 'corner',
    label: 'Corner',
    position: [11, 8, 11],
    target: [0, 3, 0],
  },
  {
    id: 'window',
    label: 'Window',
    position: [6.5, 4.2, 2.5],
    target: [-1, 2.8, -1.5],
  },
  {
    id: 'detail',
    label: 'Detail',
    position: [3, 2.5, 5],
    target: [0, 1.5, -3],
  },
] as const;

type AppliedBySurface = Record<string, Tile>;

interface ShowroomState {
  scenePreset: ScenePreset;
  cameraPreset: CameraPresetId;
  hoveredSurfaceId: string | null;
  appliedBySurface: AppliedBySurface;
  autoRotate: boolean;
  setScenePreset: (preset: ScenePreset) => void;
  setCameraPreset: (preset: CameraPresetId) => void;
  setHoveredSurfaceId: (surfaceId: string | null) => void;
  syncAppliedBySurface: (assignments: AppliedBySurface) => void;
  setAutoRotate: (enabled: boolean) => void;
}

export const useShowroomStore = create<ShowroomState>((set) => ({
  scenePreset: 'living',
  cameraPreset: 'corner',
  hoveredSurfaceId: null,
  appliedBySurface: {},
  autoRotate: true,
  setScenePreset: (preset) => set({ scenePreset: preset, cameraPreset: 'corner' }),
  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  setHoveredSurfaceId: (surfaceId) => set({ hoveredSurfaceId: surfaceId }),
  syncAppliedBySurface: (assignments) => set({ appliedBySurface: assignments }),
  setAutoRotate: (enabled) => set({ autoRotate: enabled }),
}));

export function isDesignApplied(
  appliedBySurface: AppliedBySurface,
  designId: string,
): boolean {
  return Object.values(appliedBySurface).some((tile) => tile.id === designId);
}
