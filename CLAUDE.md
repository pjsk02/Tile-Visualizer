# Tile-Visualizer: Architecture & Build Guide

**See [PRD.md](./PRD.md) for full product specification (users, goals, scope, risks, demo framing).**

## Project Overview
A two-part system for rendering 3D Gaussian-splat scenes with customizable tile designs on flat panels. Built for the Sundai "World Models" hackathon using FlashWorld generative 3D + React tile-design UI.

## Architecture: Two-Part System

### Part 1: OFFLINE Generation (FlashWorld → Kaggle)
**Purpose:** Generate base 3D scene and preview
- **Tool:** FlashWorld (headless, runs on Kaggle)
- **GPU Flags:** Offload configuration for Kaggle hardware
- **Outputs:**
  - `.ply` file (Gaussian-splat scene data)
  - `.mp4` preview video
  - `.spz` splat format (optional)
- **Deployment:** One-time or periodic; artifacts stored externally (Kaggle datasets or cloud storage)

### Part 2: LOCAL WEB APP (React + react-three-fiber)
**Purpose:** Interactive browser-based scene viewer with tile design insertion
- **Stack:**
  - **Frontend:** React + TypeScript
  - **3D Rendering:** react-three-fiber (Three.js wrapper)
  - **Splat Viewer:** Browser-compatible Gaussian-splat renderer
  - **UI:** Tile catalogue browser + panel design system
- **Inputs:**
  - `.ply` file (loaded from storage)
  - Tile catalogue JSON
- **Interaction:**
  - Pan/rotate 3D scene
  - Select flat-quad panels (inserted geometry, not splat surfaces)
  - Apply tiles to panels from catalogue

## Key Constraint: Surfaces & Tiling Strategy
⚠️ **CRITICAL:** Splats are NOT retextured directly.
- Gaussian splats have no clean, continuous surfaces to paint on
- **All tiling happens via inserted flat-quad panels**
  - Panels are 3D geometry overlaid on the scene (not paint on splats)
  - Tiles are applied to these panels only
  - Panels can be scaled, positioned, and rotated per scene

## Tile Catalogue Data Model

### Schema
```json
{
  "id": "uuid",
  "code": "TILE_CODE",
  "name": "Display Name",
  "category": "category_string",
  "finish": "matte|glossy|textured|...",
  "thumbnail_url": "https://...",
  "texture_url": "https://...",
  "width_ft": 2.0,
  "height_ft": 2.0,
  "tags": ["tag1", "tag2"],
  "colorway": "colorway_name",
  "price_per_sqft": 12.50
}
```

### Storage & Access
- **Format:** JSON array (static data) or database endpoint
- **Usage:** Populate UI catalogue; apply texture_url to panels on selection

## Build Phases (H0–H4 per PRD)

| Phase | Status | Goals |
|-------|--------|-------|
| **H0** | ❓ | Project bootstrap, architecture decisions, repo setup |
| **H1** | ❓ | React + react-three-fiber setup; .ply loader; basic 3D scene |
| **H2** | ❓ | Tile catalogue data model & UI; flat-quad panel insertion |
| **H3** | ❓ | Tile application to panels; interactive design system |
| **H4** | ❓ | Polish, optimization, deployment readiness |

*Update these as implementation progresses.*

## Commands

### Development
```bash
npm install      # Install dependencies
npm start        # Start dev server (React)
npm run build    # Production build
npm run lint     # Linting
npm test         # Run tests (if implemented)
```

### Offline Generation (Kaggle)
- Refer to FlashWorld repo/documentation for GPU-offload setup
- Output: `.ply`, `.mp4`, `.spz` to shared storage (e.g., Kaggle dataset, Google Drive, S3)

## Directory Structure (Planned)

```
Tile-Visualizer/
├── public/              # Static assets (index.html, favicon, etc.)
├── src/
│   ├── components/      # React components (Scene, TileCatalogue, Panel, etc.)
│   ├── models/          # Data types, schemas (Tile, Scene, etc.)
│   ├── hooks/           # Custom React hooks (useThreeScene, usePLYLoader, etc.)
│   ├── utils/           # Helpers (file I/O, 3D math, texture management)
│   ├── assets/          # Images, icons, default tile previews
│   └── App.tsx          # Root component
├── .claudeignore        # Exclude binaries from Claude context
├── CLAUDE.md            # This file
├── package.json
├── tsconfig.json
├── vite.config.ts       # (if using Vite) or next.config.js (if Next.js)
└── README.md
```

## File Loading & Asset Management
- **PLY Files:** Loaded via fetch or file input; parsed by splat renderer
- **Textures:** Tile catalogue provides texture_url; loaded on panel selection
- **Previews:** Thumbnail images cached locally or streamed from catalogue
- **Large Binaries:** Downloaded separately, not stored in repo (see .claudeignore)

## Development Notes
- Use TypeScript for type safety on scene graph and tile data
- Consider reusable panel geometry (scale/position via props)
- Keep tile selection UI separate from 3D scene logic (loose coupling)
- Test splat rendering across browsers (Safari, Chrome, Firefox)

---
**Last Updated:** 2026-07-12  
**Architecture Version:** 1.0 (Greenfield)
