import { Suspense, useLayoutEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import type { Surface } from '../types/surface';
import type { Tile } from '../types/catalog';
import {
  configureTileTexture,
  createTileMaterial,
  tileTextureUrl,
} from './materials';

export interface PanelProps {
  surface: Surface;
  assignedTile: Tile | null;
  isSelected: boolean;
  onSelect: (surfaceId: string) => void;
}

function TexturedMaterial({
  tile,
  surface,
  isSelected,
}: {
  tile: Tile;
  surface: Surface;
  isSelected: boolean;
}) {
  const gl = useThree((s) => s.gl);
  const texture = useTexture(tileTextureUrl(tile));
  const { width, height } = surface.placement;

  useLayoutEffect(() => {
    configureTileTexture(
      texture,
      tile,
      width,
      height,
      'stretch',
      Math.min(8, gl.capabilities.getMaxAnisotropy()),
    );
  }, [texture, tile, width, height, gl]);

  const materialProps = createTileMaterial(tile, {
    selected: isSelected,
    panelWidth: width,
    panelHeight: height,
  });

  return <meshPhysicalMaterial {...materialProps} map={texture} />;
}

function UntiledMaterial({
  surface,
  isSelected,
}: {
  surface: Surface;
  isSelected: boolean;
}) {
  const { width, height } = surface.placement;
  const materialProps = createTileMaterial(null, {
    selected: isSelected,
    panelWidth: width,
    panelHeight: height,
  });
  // Distinct default colors by surface kind
  const color = surface.kind === 'floor' ? 0x8a8a8a : 0xd0d4dc;
  return <meshPhysicalMaterial {...materialProps} color={color} />;
}

/**
 * Inserted flat-quad panel — the only geometry that ever receives a tile texture.
 */
export function Panel({ surface, assignedTile, isSelected, onSelect }: PanelProps) {
  const { position, rotation, width, height } = surface.placement;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(surface.id);
  };

  return (
    <mesh
      position={position}
      rotation={rotation}
      renderOrder={1}
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <planeGeometry args={[width, height]} />
      {assignedTile ? (
        <Suspense fallback={<UntiledMaterial surface={surface} isSelected={isSelected} />}>
          <TexturedMaterial tile={assignedTile} surface={surface} isSelected={isSelected} />
        </Suspense>
      ) : (
        <UntiledMaterial surface={surface} isSelected={isSelected} />
      )}
    </mesh>
  );
}
