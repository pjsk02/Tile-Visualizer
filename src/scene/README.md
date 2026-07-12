Owner: **Dev A**

3D scene: FlashWorld `.ply` splat loading (`SplatScene` + `sceneConfig.SCENE_PLY_PATH`),
camera/orbit controls, and non-interactive placeholder room until the splat lands.

| File | Role |
|------|------|
| `Experience.tsx` | Canvas, lights, Environment, OrbitControls, composition |
| `SplatScene.tsx` | DropInViewer .ply loader with placeholder fallback |
| `sceneConfig.ts` | **One-line** `SCENE_PLY_PATH` swap when real .ply arrives |
| `PlaceholderRoom.tsx` | Wireframe room volume (not retextured) |
| `DesignProbe.tsx` | Keyboard 1/2/3 + G/M finish override for Dev A verification |

Reads/writes `useVisualizerStore` for surface selection only — never touches `src/catalog`
or `src/ui` directly. Tile application lives in `src/panels/`.
