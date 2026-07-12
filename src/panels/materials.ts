import * as THREE from 'three';
import type { MeshPhysicalMaterialParameters, Texture } from 'three';
import type { Finish, Tile } from '../types/catalog';

export type TileTextureFit = 'stretch' | 'contain' | 'cover' | 'realscale';

export type TileMaterialOpts = {
  selected?: boolean;
  hovered?: boolean;
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

const FT_TO_M = 0.3048;
const GROUT_FRACTION = 0.025;

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

const groutCache = new Map<string, THREE.CanvasTexture>();

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

export function tileSizeMeters(tile: Tile): { widthM: number; heightM: number } {
  return {
    widthM: tile.width_ft * FT_TO_M,
    heightM: tile.height_ft * FT_TO_M,
  };
}

export function computeTileRepeats(
  tile: Tile,
  panelWidth: number,
  panelHeight: number,
): { repeatU: number; repeatV: number } {
  const { widthM, heightM } = tileSizeMeters(tile);
  return {
    repeatU: panelWidth / widthM,
    repeatV: panelHeight / heightM,
  };
}

/** Procedural grout grid as roughness map — darker grout reads as recessed lines. */
export function getGroutRoughnessMap(repeatU: number, repeatV: number): THREE.CanvasTexture {
  const key = `${repeatU.toFixed(2)}_${repeatV.toFixed(2)}`;
  const cached = groutCache.get(key);
  if (cached) return cached;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  const cols = Math.max(1, Math.round(repeatU));
  const rows = Math.max(1, Math.round(repeatV));
  const cellW = size / cols;
  const cellH = size / rows;
  const groutW = Math.max(2, cellW * GROUT_FRACTION);
  const groutH = Math.max(2, cellH * GROUT_FRACTION);

  ctx.fillStyle = '#707070';
  for (let c = 0; c <= cols; c++) {
    const x = c * cellW;
    ctx.fillRect(x - groutW / 2, 0, groutW, size);
  }
  for (let r = 0; r <= rows; r++) {
    const y = r * cellH;
    ctx.fillRect(0, y - groutH / 2, size, groutH);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatU, repeatV);
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  groutCache.set(key, tex);
  return tex;
}

/**
 * Real-world tile repeat at catalogue dimensions (2×4 ft default) with grout roughness.
 */
export function configureTileTexture(
  texture: Texture,
  tile: Tile,
  panelWidth: number,
  panelHeight: number,
  fit: TileTextureFit = 'realscale',
  anisotropy = 8,
): { texture: Texture; groutMap: THREE.CanvasTexture | null; repeats: { repeatU: number; repeatV: number } } {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = true;
  texture.anisotropy = anisotropy;

  if (fit === 'realscale') {
    const { repeatU, repeatV } = computeTileRepeats(tile, panelWidth, panelHeight);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatU, repeatV);
    texture.offset.set(0, 0);
    const groutMap = getGroutRoughnessMap(repeatU, repeatV);
    texture.needsUpdate = true;
    return { texture, groutMap, repeats: { repeatU, repeatV } };
  }

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

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
  return { texture, groutMap: null, repeats: { repeatU: 1, repeatV: 1 } };
}

/** Spreadable params for <meshPhysicalMaterial /> — map assigned by caller. */
export function createTileMaterial(
  tile: Tile | null,
  opts: TileMaterialOpts = {},
): MeshPhysicalMaterialParameters {
  const selected = opts.selected ?? false;
  const hovered = opts.hovered ?? false;

  const emissive = selected
    ? new THREE.Color(0x4f8cff)
    : hovered
      ? new THREE.Color(0x6a7a90)
      : new THREE.Color(0x000000);
  const emissiveIntensity = selected ? 0.18 : hovered ? 0.08 : 0;

  if (!tile) {
    return {
      color: opts.panelWidth && opts.panelHeight ? 0xb0b4bc : 0x8a8a8a,
      roughness: 0.85,
      metalness: 0,
      clearcoat: 0,
      envMapIntensity: 0.35,
      side: THREE.FrontSide,
      emissive,
      emissiveIntensity,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    };
  }

  const preset = getFinishPreset(tile.finish);
  return {
    ...preset,
    color: 0xffffff,
    side: THREE.FrontSide,
    emissive,
    emissiveIntensity,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  };
}
