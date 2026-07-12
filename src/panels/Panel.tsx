import { Suspense, useLayoutEffect, useMemo } from 'react';
import { Outlines, useTexture } from '@react-three/drei';
import { useThree, type ThreeEvent } from '@react-three/fiber';
import type { Surface } from '../types/surface';
import type { Tile } from '../types/catalog';
import { useShowroomStore } from '../store/useShowroomStore';
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
  isHovered,
}: {
  tile: Tile;
  surface: Surface;
  isSelected: boolean;
  isHovered: boolean;
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
      'realscale',
      Math.min(8, gl.capabilities.getMaxAnisotropy()),
    );
  }, [texture, tile, width, height, gl]);

  const { groutMap } = useMemo(
    () =>
      configureTileTexture(
        texture,
        tile,
        width,
        height,
        'realscale',
        Math.min(8, gl.capabilities.getMaxAnisotropy()),
      ),
    [texture, tile, width, height, gl],
  );

  const materialProps = createTileMaterial(tile, {
    selected: isSelected,
    hovered: isHovered,
    panelWidth: width,
    panelHeight: height,
  });

  return (
    <meshPhysicalMaterial
      {...materialProps}
      map={texture}
      roughnessMap={groutMap ?? undefined}
      roughness={groutMap ? Math.max(0.08, (materialProps.roughness as number) ?? 0.5) : materialProps.roughness}
    />
  );
}

function UntiledMaterial({
  surface,
  isSelected,
  isHovered,
}: {
  surface: Surface;
  isSelected: boolean;
  isHovered: boolean;
}) {
  const { width, height } = surface.placement;
  const materialProps = createTileMaterial(null, {
    selected: isSelected,
    hovered: isHovered,
    panelWidth: width,
    panelHeight: height,
  });
  const color = surface.kind === 'floor' ? 0x8a8a8a : 0xd0d4dc;
  return <meshPhysicalMaterial {...materialProps} color={color} />;
}

/**
 * Inserted flat-quad panel — the only geometry that ever receives a tile texture.
 */
export function Panel({ surface, assignedTile, isSelected, onSelect }: PanelProps) {
  const { position, rotation, width, height } = surface.placement;
  const hoveredSurfaceId = useShowroomStore((s) => s.hoveredSurfaceId);
  const setHoveredSurfaceId = useShowroomStore((s) => s.setHoveredSurfaceId);
  const isHovered = hoveredSurfaceId === surface.id;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(surface.id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredSurfaceId(surface.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredSurfaceId(null);
    document.body.style.cursor = 'default';
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh
        renderOrder={1}
        castShadow
        receiveShadow
        onClick={handleClick}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[width, height]} />
        {assignedTile ? (
          <Suspense fallback={<UntiledMaterial surface={surface} isSelected={isSelected} isHovered={isHovered} />}>
            <TexturedMaterial
              tile={assignedTile}
              surface={surface}
              isSelected={isSelected}
              isHovered={isHovered}
            />
          </Suspense>
        ) : (
          <UntiledMaterial surface={surface} isSelected={isSelected} isHovered={isHovered} />
        )}
        {(isSelected || isHovered) && (
          <Outlines
            thickness={isSelected ? 0.015 : 0.008}
            color={isSelected ? '#6ea8ff' : '#9aa8bc'}
            screenspace
            opacity={isSelected ? 1 : 0.65}
          />
        )}
      </mesh>

      {surface.kind === 'wall' && (
        <mesh
          position={[0, 0, -0.01]}
          rotation={[0, Math.PI, 0]}
          raycast={() => null}
          renderOrder={0}
        >
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color="#0a0b0e" />
        </mesh>
      )}
    </group>
  );
}
