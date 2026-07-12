import { useMemo } from 'react';
import type { Surface } from '../types/surface';
import { useVisualizerStore } from '../store/useVisualizerStore';

// TODO(Dev A): replace with the real FlashWorld .ply loaded from public/scene/.
// Placeholder surfaces stand in for the wall/floor panels until the splat scene lands.
const PLACEHOLDER_SURFACES: Surface[] = [
  {
    id: 'floor',
    kind: 'floor',
    placement: { position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0], width: 10, height: 10 },
  },
  {
    id: 'wall-back',
    kind: 'wall',
    placement: { position: [0, 4, -5], rotation: [0, 0, 0], width: 10, height: 8 },
  },
  {
    id: 'wall-left',
    kind: 'wall',
    placement: { position: [-5, 4, 0], rotation: [0, Math.PI / 2, 0], width: 10, height: 8 },
  },
];

function SurfaceMesh({ surface }: { surface: Surface }) {
  const selectedSurfaceId = useVisualizerStore((s) => s.selectedSurfaceId);
  const selectSurface = useVisualizerStore((s) => s.selectSurface);
  const isSelected = selectedSurfaceId === surface.id;
  const { position, rotation, width, height } = surface.placement;

  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        selectSurface(surface.id);
      }}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        color={isSelected ? '#4f8cff' : surface.kind === 'floor' ? '#8a8a8a' : '#d6d6d6'}
        side={2}
      />
    </mesh>
  );
}

export function Room() {
  const surfaces = useMemo(() => PLACEHOLDER_SURFACES, []);
  return (
    <>
      {surfaces.map((surface) => (
        <SurfaceMesh key={surface.id} surface={surface} />
      ))}
    </>
  );
}
