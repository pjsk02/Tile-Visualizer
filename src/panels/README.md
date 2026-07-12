Owner: **Dev A**

Inserted flat-quad panels (the only things ever retextured — splats are never retextured
directly, see root CLAUDE.md).

| File | Role |
|------|------|
| `surfaces.ts` | Scene-aligned wall/floor Surface definitions |
| `Panel.tsx` | One raycastable flat quad + highlight + texture |
| `Panels.tsx` | Maps surfaces; local `Record<surfaceId, Tile>` persistence |
| `materials.ts` | Finish-driven PBR presets (glossy / matte) + UV fit |

Reads `selectedDesign` / `selectedSurfaceId` from `useVisualizerStore`. Writes selection via
`selectSurface`. Never imports from `src/catalog` or `src/ui`.
