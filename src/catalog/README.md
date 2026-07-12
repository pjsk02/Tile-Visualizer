Owner: **Dev B**

Tile catalogue UI. Reads `designs` / `finishFilter` / `selectedDesign` / `selectedSurfaceId`
from `useVisualizerStore`; writes via `selectDesign` / `setFinishFilter` only.

| File | Role |
|------|------|
| `CatalogPanel.tsx` | Compose filter + hint + grid |
| `DesignGrid.tsx` / `DesignCard.tsx` | Lazy thumbnail grid (id + name) |
| `FinishFilter.tsx` | all / glossy / matte / random |
| `filterDesigns.ts` | Pure finish filter helper |

Never imports from `src/scene` or `src/panels`.
