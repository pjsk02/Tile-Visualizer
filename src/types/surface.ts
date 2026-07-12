// FROZEN CONTRACT — only change by agreement between both devs.

export type SurfaceKind = 'wall' | 'floor';

export interface SurfacePlacement {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
}

export interface Surface {
  id: string;
  kind: SurfaceKind;
  placement: SurfacePlacement;
}
