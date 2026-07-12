Owner: **Dev B**

Tile catalogue: thumbnail grid, finish filter, code/name display. Reads `designs` and
`finishFilter` from `useVisualizerStore`; calls `selectDesign`/`setFinishFilter`. Never
touches `src/scene` or `src/panels` directly.

`DesignCount.tsx` is a temporary wiring-proof stub — replace with the real grid.
