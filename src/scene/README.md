Owner: **Dev A**

3D scene: loading the FlashWorld `.ply` splat scene (from `public/scene/`), camera/controls,
and the placeholder room this replaces. Reads/writes `useVisualizerStore` for surface
selection only — never touches `src/catalog` or `src/ui` directly.
