# Tile-Visualizer: Architecture & Build Guide

**See [PRD.md](./PRD.md) for full product specification (users, goals, scope, risks, demo framing).**

## Project Overview
A two-part system for rendering 3D Gaussian-splat scenes with customizable tile designs on flat panels. Built for the Sundai "World Models" hackathon using FlashWorld generative 3D + React tile-design UI.

## Architecture: Two-Part System

### Part 1: OFFLINE Generation (FlashWorld → Kaggle)
**Purpose:** Generate base 3D scene and preview
- **Tool:** FlashWorld (headless, runs on Kaggle)
- **GPU Flags:** `--offload_t5`, `--offload_transformer_during_vae`, `--offload_vae`
- **Outputs:**
  - `.ply` file (Gaussian-splat scene data)
  - `.mp4` preview video
  - `.spz` splat format (optional)
- **Deployment:** One-time or periodic; artifacts stored externally (Kaggle datasets or cloud storage), then dropped into `public/scene/` locally (gitignored — see `public/scene/README.md`)

### Part 2: LOCAL WEB APP (React + react-three-fiber)
**Purpose:** Interactive browser-based scene viewer with tile design insertion
- **Stack:**
  - **Frontend:** React 19 + TypeScript + Vite
  - **3D Rendering:** `@react-three/fiber` + `@react-three/drei` (Three.js wrapper)
  - **Splat Viewer:** `@mkkellogg/gaussian-splats-3d` (see decision below)
  - **State:** Zustand (`src/store/useVisualizerStore.ts`)
  - **UI:** Tile catalogue browser + panel design system
- **Inputs:**
  - `.ply` file (loaded from `public/scene/`)
  - Tile catalogue JSON (`src/data/catalog.json`)
- **Interaction:**
  - Pan/rotate 3D scene
  - Select flat-quad panels (inserted geometry, not splat surfaces)
  - Apply tiles to panels from catalogue

### Splat loader decision: `@mkkellogg/gaussian-splats-3d`, not drei's `<Splat>`
drei's `<Splat>` wraps the `antimatter15/splat` format only — FlashWorld outputs `.ply`
directly, which would need an extra conversion step before every scene could load. `@mkkellogg/gaussian-splats-3d`
loads `.ply` (and `.splat`/`.ksplat`) natively, ships LOD + sorting-worker support for
performance, and integrates into an r3f scene as a `primitive`/imperative Three.js object.
It needs a small custom r3f wrapper component since it isn't an r3f-native library — that
tradeoff is worth it to avoid a conversion step and get the performance features. Owned by
Dev A in `src/scene/`.

## Key Constraint: Surfaces & Tiling Strategy
⚠️ **CRITICAL:** Splats are NOT retextured directly.
- Gaussian splats have no clean, continuous surfaces to paint on
- **All tiling happens via inserted flat-quad panels**
  - Panels are 3D geometry overlaid on the scene (not paint on splats)
  - Tiles are applied to these panels only
  - Panels can be scaled, positioned, and rotated per scene

## Tile Catalogue Data Model

### Schema (frozen — `src/types/catalog.ts`, matches `src/data/catalog.json` exactly)
The real extracted catalogue (`scripts/extract_catalog.py`, 49 glossy tiles) uses these
field names — not the placeholder schema in an earlier PRD draft (no `code`, `thumbnail_url`,
`texture_url` fields; use `id`/`slug`, `thumbnail_path`/`texture_path` instead):
```ts
interface Tile {
  id: string;              // slug-style catalogue id, shown to user in place of a "code"
  slug: string;
  name: string;
  finish: 'glossy' | 'matte' | 'random';
  collection: string;
  width_ft: number;        // 2 for the current catalogue
  height_ft: number;       // 4 for the current catalogue
  size_mm: string;
  texture_path: string;    // relative to /public — prefix with "/" for a URL
  thumbnail_path: string;  // relative to /public
  lifestyle_path: string;  // relative to /public
  random_faces: number | null;
  source_page: number;
  family: string;
  dominant_color: [number, number, number];
}
```

### Storage & Access
- **Format:** static JSON, copied into `src/data/catalog.json` (source of truth is the
  root-level `catalog.json`/`catalog.csv` produced by `scripts/extract_catalog.py` — do not
  hand-edit either copy or re-run the script from inside `src/data`)
- **Usage:** `useVisualizerStore` loads all 49 designs at store-creation time; the catalogue
  UI reads `designs`/`finishFilter` from the store, the panel/scene layer reads
  `selectedDesign`/`selectedSurfaceId`

## The store is the frozen contract

`src/store/useVisualizerStore.ts` is the **only** channel between the 3D side
(`src/scene`, `src/panels` — Dev A) and the UI side (`src/catalog`, `src/ui` — Dev B).
Frozen shape:

```ts
{
  designs: Tile[];
  selectedSurfaceId: string | null;
  selectedDesign: Tile | null;
  finishFilter: Finish | 'all';
  selectSurface: (surfaceId: string | null) => void;
  selectDesign: (design: Tile | null) => void;
  setFinishFilter: (filter: Finish | 'all') => void;
}
```

Neither side should import from the other's directory. Changes to this shape, or to
`src/types/catalog.ts` / `src/types/surface.ts`, require agreement between both devs.

**Known simplification (intentional, not a bug):** the store tracks one active
`selectedDesign`, not a map of every surface's assigned design. If the demo needs multiple
surfaces to retain independent designs simultaneously, that persistence lives in the scene
layer (Dev A) — e.g. a local `Record<surfaceId, Tile>` in `src/scene`/`src/panels` that
listens for `selectedSurfaceId`/`selectedDesign` changes and updates itself. Revisit only by
agreement — it changes the frozen contract.

## Directory ownership

| Path | Owner | Notes |
|---|---|---|
| `src/scene/` | **Dev A** | Canvas, camera, splat loading, placeholder room |
| `src/panels/` | **Dev A** | Inserted flat-quad panels, material/texture swap |
| `src/catalog/` | **Dev B** | Thumbnail grid, finish filter, code/name display |
| `src/ui/` | **Dev B** | App chrome around the 3D view |
| `src/store/` | **SHARED / FROZEN** | `useVisualizerStore.ts` — see above |
| `src/types/` | **SHARED / FROZEN** | `catalog.ts`, `surface.ts` |
| `src/data/` | **SHARED / FROZEN** | `catalog.json` copy |

Each of these has its own `README.md` restating ownership. Don't edit across the
Dev A / Dev B boundary without the other dev's sign-off; shared/frozen paths need
agreement from both.

## Build Phases (H0–H4 per PRD)

| Phase | Status | Goals |
|-------|--------|-------|
| **H0** | ✅ done | Project bootstrap: Vite + React + r3f/drei + Zustand scaffolded, catalogue wired (49 designs), placeholder room renders, `feat/scene`/`feat/catalog` branches cut |
| **H1** | ⏳ next | Real FlashWorld `.ply` loaded via `@mkkellogg/gaussian-splats-3d` into `public/scene/`, replacing the placeholder `Room` |
| **H2** | ⏳ | Full tile catalogue UI (thumbnail grid + finish filter) replacing the `DesignCount` stub; flat-quad panel insertion |
| **H3** | ⏳ | Tile application to panels; interactive design system end-to-end |
| **H4** | ⏳ | Polish, optimization, deployment readiness |

## Commands

```bash
npm install      # Install dependencies (all deps are already pinned — don't add more without updating this doc, to avoid lockfile conflicts between the two branches)
npm run dev      # Start Vite dev server
npm run build    # Typecheck (tsc -b) + production build
npm run lint     # oxlint
npm run preview  # Preview a production build
```

### Offline Generation (Kaggle)
- Refer to the FlashWorld repo/documentation for GPU-offload setup
- Output `.ply` (required), `.mp4`/`.spz` (optional) to shared storage, then copy the `.ply`
  into `public/scene/` locally (gitignored, see `public/scene/README.md`)

## Directory Structure (current)

```
Tile-Visualizer/
├── public/
│   ├── scene/            # drop the real .ply here (gitignored); README explains
│   └── images/           # copy of root images/ — tile textures/thumbnails/lifestyle shots
├── src/
│   ├── scene/            # DEV A — Canvas, camera, splat loading, placeholder Room
│   ├── panels/           # DEV A — inserted flat-quad panels
│   ├── catalog/          # DEV B — tile catalogue UI (DesignCount is a wiring-proof stub)
│   ├── ui/               # DEV B — app chrome
│   ├── store/            # SHARED/FROZEN — useVisualizerStore.ts
│   ├── types/            # SHARED/FROZEN — catalog.ts, surface.ts
│   ├── data/             # SHARED/FROZEN — catalog.json copy
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── scripts/extract_catalog.py   # do not modify — catalogue is already extracted
├── catalog.json / catalog.csv   # source of truth for src/data/catalog.json
├── images/                      # source of truth for public/images/
├── .claudeignore
├── CLAUDE.md            # this file
├── PRD.md
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## File Loading & Asset Management
- **PLY Files:** loaded from `public/scene/` via `@mkkellogg/gaussian-splats-3d`
- **Textures:** tile catalogue provides `texture_path` (prefix `/` to get a URL under
  `public/images/`); applied to a panel's material on selection
- **Previews:** `thumbnail_path`/`lifestyle_path`, same convention
- **Large Binaries:** `.ply`/`.spz`/`.mp4` are gitignored — never commit them

## Development Notes
- TypeScript throughout; the shared contract (`src/types`, `src/store`) is the only
  compile-time coupling between the two devs' halves of the app
- Keep tile selection UI (Dev B) and 3D scene logic (Dev A) decoupled — only talk through
  `useVisualizerStore`
- Test splat rendering across browsers (Safari, Chrome, Firefox) once the real `.ply` lands

## Starting work (for each dev)

```bash
git checkout feat/scene     # Dev A
git checkout feat/catalog   # Dev B
npm install
npm run dev
```

---
**Last Updated:** 2026-07-12
**Architecture Version:** 2.0 (H0 scaffold complete)
