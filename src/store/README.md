Owner: **SHARED / FROZEN**

`useVisualizerStore.ts` is the only channel between the 3D side (`src/scene`,
`src/panels`) and the UI side (`src/catalog`, `src/ui`). Its field/setter names are
frozen (see root CLAUDE.md) — change only by agreement between both devs.
