// FROZEN CONTRACT — shape must match src/data/catalog.json exactly.
// Changes here ripple to both src/catalog (Dev B) and src/panels (Dev A);
// only change by agreement between both devs.

export type Finish = 'glossy' | 'matte' | 'random';

export interface Tile {
  id: string;
  slug: string;
  name: string;
  finish: Finish;
  collection: string;
  width_ft: number;
  height_ft: number;
  size_mm: string;
  /** relative to /public, e.g. "images/veranata-aqua_texture.png" — prefix with "/" to use as a URL */
  texture_path: string;
  /** relative to /public — prefix with "/" to use as a URL */
  thumbnail_path: string;
  /** relative to /public — prefix with "/" to use as a URL */
  lifestyle_path: string;
  random_faces: number | null;
  source_page: number;
  family: string;
  dominant_color: [number, number, number];
}

/** Alias for readability where the domain language is "design" rather than "tile". */
export type Design = Tile;
