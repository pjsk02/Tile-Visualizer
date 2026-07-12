declare module '@mkkellogg/gaussian-splats-3d' {
  import type { Group } from 'three';

  export const SceneFormat: {
    Splat: number;
    KSplat: number;
    Ply: number;
    Spz: number;
  };

  export const SceneRevealMode: {
    Default: number;
    Gradual: number;
    Instant: number;
  };

  export const LogLevel: {
    None: number;
    Error: number;
    Warning: number;
    Info: number;
    Debug: number;
  };

  export class DropInViewer extends Group {
    constructor(options?: Record<string, unknown>);
    addSplatScene(
      path: string,
      options?: Record<string, unknown>,
    ): Promise<void> & { abort?: (reason?: unknown) => void };
    dispose(): Promise<void>;
  }
}
