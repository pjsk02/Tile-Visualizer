Drop the FlashWorld-generated `.ply` (and `.spz`/preview `.mp4` if kept) here once
Kaggle generation is done. `*.ply`/`*.spz`/`*.mp4` are gitignored — this directory
stays empty in version control until an artifact is placed locally.

The viewer loads **`/scene/room.ply`** by default (`src/scene/sceneConfig.ts` →
`SCENE_PLY_PATH`). To use a differently named file, change that one constant.
