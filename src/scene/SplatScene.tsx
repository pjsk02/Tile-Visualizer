import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DropInViewer,
  LogLevel,
  SceneFormat,
  SceneRevealMode,
} from '@mkkellogg/gaussian-splats-3d';
import { SCENE_LOAD_OPTIONS, SCENE_PLY_PATH } from './sceneConfig';

type LoadStatus = 'checking' | 'loading' | 'ready' | 'fallback';

type SplatSceneProps = {
  /** Shown when the .ply is missing or fails to load. */
  children?: ReactNode;
  path?: string;
};

/**
 * Loads a Gaussian-splat .ply via DropInViewer.
 * Until public/scene has a real file, falls back to children (placeholder room).
 * Swap the asset by changing SCENE_PLY_PATH in sceneConfig.ts.
 */
export function SplatScene({ children, path = SCENE_PLY_PATH }: SplatSceneProps) {
  const [status, setStatus] = useState<LoadStatus>('checking');

  const viewer = useMemo(
    () =>
      new DropInViewer({
        sharedMemoryForWorkers: SCENE_LOAD_OPTIONS.sharedMemoryForWorkers,
        gpuAcceleratedSort: SCENE_LOAD_OPTIONS.gpuAcceleratedSort,
        sceneRevealMode: SceneRevealMode.Instant,
        logLevel: LogLevel.None,
      }),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Vite SPA fallback returns 200 text/html for missing public files —
      // require a non-HTML content-type before attempting splat parse.
      try {
        const probe = await fetch(path, {
          method: 'GET',
          headers: { Range: 'bytes=0-15' },
        });
        const ctype = probe.headers.get('content-type') ?? '';
        if ((!probe.ok && probe.status !== 206) || ctype.includes('text/html')) {
          throw new Error(`missing ply (${probe.status}, ${ctype || 'no-type'})`);
        }
      } catch (err) {
        console.info('[SplatScene] no .ply yet — using placeholder', err);
        if (!cancelled) setStatus('fallback');
        return;
      }

      if (cancelled) return;
      setStatus('loading');

      try {
        await viewer.addSplatScene(path, {
          format: SceneFormat.Ply,
          showLoadingUI: SCENE_LOAD_OPTIONS.showLoadingUI,
          splatAlphaRemovalThreshold: SCENE_LOAD_OPTIONS.splatAlphaRemovalThreshold,
        });
        if (!cancelled) setStatus('ready');
      } catch (err) {
        console.warn('[SplatScene] failed to load', path, err);
        if (!cancelled) setStatus('fallback');
      }
    }

    void load();

    return () => {
      cancelled = true;
      void viewer.dispose();
    };
  }, [viewer, path]);

  if (status === 'ready') {
    return <primitive object={viewer} />;
  }

  // checking / loading / fallback → show placeholder (panels stay separate)
  return <>{children}</>;
}
