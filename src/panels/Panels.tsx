import { useEffect, useState } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';
import type { Tile } from '../types/catalog';
import { Panel } from './Panel';
import { SCENE_SURFACES } from './surfaces';

type SurfaceAssignments = Record<string, Tile>;

/**
 * Local per-surface design persistence.
 * Store only tracks one selectedDesign — this map keeps independent assignments
 * (CLAUDE.md known simplification).
 */
function useSurfaceAssignments(): (surfaceId: string) => Tile | null {
  const selectedSurfaceId = useVisualizerStore((s) => s.selectedSurfaceId);
  const selectedDesign = useVisualizerStore((s) => s.selectedDesign);
  const [assignments, setAssignments] = useState<SurfaceAssignments>({});

  useEffect(() => {
    if (selectedSurfaceId == null || selectedDesign == null) return;
    setAssignments((prev) => {
      if (prev[selectedSurfaceId]?.id === selectedDesign.id &&
          prev[selectedSurfaceId]?.finish === selectedDesign.finish) {
        return prev;
      }
      return { ...prev, [selectedSurfaceId]: selectedDesign };
    });
  }, [selectedSurfaceId, selectedDesign]);

  return (surfaceId: string) => assignments[surfaceId] ?? null;
}

export function Panels() {
  const selectedSurfaceId = useVisualizerStore((s) => s.selectedSurfaceId);
  const selectSurface = useVisualizerStore((s) => s.selectSurface);
  const getAssignedTile = useSurfaceAssignments();

  return (
    <>
      {SCENE_SURFACES.map((surface) => (
        <Panel
          key={surface.id}
          surface={surface}
          assignedTile={getAssignedTile(surface.id)}
          isSelected={selectedSurfaceId === surface.id}
          onSelect={selectSurface}
        />
      ))}
    </>
  );
}
