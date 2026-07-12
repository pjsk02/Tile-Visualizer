# Showroom Asset Credits

All assets verified CC0 or procedurally generated in-repo fallbacks.

## HDRI

| Asset | License | Source |
| --- | --- | --- |
| studio_small_09 (1k HDR) | CC0 | [Poly Haven](https://polyhaven.com/a/studio_small_09) |

Local path: `public/showroom/hdri/studio_small_09_1k.hdr`

## 3D Furniture & Props

Procedural geometry authored in `src/scene/furniture/FurniturePreset.tsx` and `src/scene/architecture/ShowroomArchitecture.tsx` — no external GLB dependencies. This avoids dead URLs and keeps the RTX 3050 budget predictable.

Planned CC0 sources (not loaded at runtime; procedural fallbacks used instead):

| Intended asset | License | Source | Fallback |
| --- | --- | --- | --- |
| Living room furniture pack | CC0 | [Kenney Furniture Kit](https://kenney.nl/assets/furniture-kit) | Box-model sofa, table, lamp, plant |
| Bathroom vanity | CC0 | [Quaternius Ultimate Home Pack](https://quaternius.com/) | Box-model vanity + towel rail |
| Leaning mirror | — | drei `MeshReflectorMaterial` | Frame + reflector plane |

## Tile Catalogue Textures

49 tile textures from project catalogue (`public/images/*`) — proprietary catalogue assets, not redistributed under CC0.

## Procedural Effects

- Grout roughness maps: canvas-generated in `src/panels/materials.ts`
- Post-processing: `@react-three/postprocessing` (MIT)
