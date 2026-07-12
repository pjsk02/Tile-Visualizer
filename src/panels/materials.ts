import * as THREE from 'three';
import type { MeshPhysicalMaterialParameters, Texture } from 'three';
import type { Finish, Tile } from '../types/catalog';

export type TileTextureFit = 'stretch' | 'contain' | 'cover';

export type TileMaterialOpts = {
  selected?: boolean;
  panelWidth?: number;
  panelHeight?: number;
  fit?: TileTextureFit;
  anisotropy?: number;
};

export type FinishPreset = Pick<
  MeshPhysicalMaterialParameters,
  | 'roughness'
  | 'metalness'
  | 'envMapIntensity'
  | 'clearcoat'
  | 'clearcoatRoughness'
  | 'reflectivity'
  | 'ior'
>;

/** Dielectric ceramic presets — reflections from roughness + env, not metalness. */
export const FINISH_PRESETS: Record<'glossy' | 'matte', FinishPreset> = {
  glossy: {
    roughness: 0.12,
    metalness: 0.0,
    envMapIntensity: 1.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 0.5,
    ior: 1.5,
  },
  matte: {
    roughness: 0.92,
    metalness: 0.0,
    envMapIntensity: 0.3,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    reflectivity: 0.12,
    ior: 1.5,
  },
};

/** Catalogue "random" is Glossy Random Vol — treat as glossy. */
export function resolveFinish(finish: Finish): 'glossy' | 'matte' {
  return finish === 'matte' ? 'matte' : 'glossy';
}

export function getFinishPreset(finish: Finish): FinishPreset {
  return FINISH_PRESETS[resolveFinish(finish)];
}

export function tileTextureUrl(tile: Tile): string {
  return `/${tile.texture_path}`;
}

/**
 * One non-seamless tile image per panel face — never repeat>1.
 * Default stretch covers the whole quad once (PRD §6).
 */
export function configureTileTexture(
  texture: Texture,
  tile: Tile,
  panelWidth: number,
  panelHeight: number,
  fit: TileTextureFit = 'stretch',
  anisotropy = 8,
): Texture {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.flipY = true;
  texture.anisotropy = anisotropy;

  const tileAspect = tile.width_ft / tile.height_ft;
  const panelAspect = panelWidth / panelHeight;

  if (fit === 'stretch') {
    texture.repeat.set(1, 1);
    texture.offset.set(0, 0);
  } else if (fit === 'contain') {
    if (panelAspect > tileAspect) {
      const rx = tileAspect / panelAspect;
      texture.repeat.set(rx, 1);
      texture.offset.set((1 - rx) / 2, 0);
    } else {
      const ry = panelAspect / tileAspect;
      texture.repeat.set(1, ry);
      texture.offset.set(0, (1 - ry) / 2);
    }
  } else {
    // cover
    if (panelAspect > tileAspect) {
      const ry = panelAspect / tileAspect;
      texture.repeat.set(1, ry);
      texture.offset.set(0, (1 - ry) / 2);
    } else {
      const rx = tileAspect / panelAspect;
      texture.repeat.set(rx, 1);
      texture.offset.set((1 - rx) / 2, 0);
    }
  }

  texture.needsUpdate = true;
  return texture;
}

/** Spreadable params for <meshPhysicalMaterial /> — map assigned by caller. */
export function createTileMaterial(
  tile: Tile | null,
  opts: TileMaterialOpts = {},
): MeshPhysicalMaterialParameters {
  const selected = opts.selected ?? false;

  if (!tile) {
    return {
      color: opts.panelWidth && opts.panelHeight ? 0xb0b4bc : 0x8a8a8a,
      roughness: 0.85,
      metalness: 0,
      clearcoat: 0,
      envMapIntensity: 0.35,
      side: THREE.DoubleSide,
      emissive: selected ? new THREE.Color(0x4f8cff) : new THREE.Color(0x000000),
      emissiveIntensity: selected ? 0.35 : 0,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    };
  }

  const preset = getFinishPreset(tile.finish);
  return {
    ...preset,
    color: 0xffffff,
    side: THREE.DoubleSide,
    emissive: selected ? new THREE.Color(0x4f8cff) : new THREE.Color(0x000000),
    emissiveIntensity: selected ? 0.18 : 0,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  };
}
