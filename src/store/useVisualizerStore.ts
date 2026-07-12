// FROZEN CONTRACT — the ONLY channel between the 3D side (src/scene, src/panels)
// and the UI side (src/catalog, src/ui). Only change by agreement between both devs.

import { create } from 'zustand';
import catalogData from '../data/catalog.json';
import type { Tile, Finish } from '../types/catalog';

const designs = catalogData as Tile[];

export type FinishFilter = Finish | 'all';

interface VisualizerState {
  designs: Tile[];
  selectedSurfaceId: string | null;
  selectedDesign: Tile | null;
  finishFilter: FinishFilter;
  selectSurface: (surfaceId: string | null) => void;
  selectDesign: (design: Tile | null) => void;
  setFinishFilter: (filter: FinishFilter) => void;
}

export const useVisualizerStore = create<VisualizerState>((set) => ({
  designs,
  selectedSurfaceId: null,
  selectedDesign: null,
  finishFilter: 'all',
  selectSurface: (surfaceId) => set({ selectedSurfaceId: surfaceId }),
  selectDesign: (design) => set({ selectedDesign: design }),
  setFinishFilter: (filter) => set({ finishFilter: filter }),
}));
