# Graph Report - .  (2026-07-12)

## Corpus Check
- 152 files · ~99,999 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 32 nodes · 53 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.82)
- Token cost: 46,620 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Catalog Extraction Script|Catalog Extraction Script]]
- [[_COMMUNITY_World-Model Pitch & FlashWorld Rationale|World-Model Pitch & FlashWorld Rationale]]
- [[_COMMUNITY_Project Docs & Build Phases|Project Docs & Build Phases]]
- [[_COMMUNITY_Splat-to-Panel Tiling Strategy|Splat-to-Panel Tiling Strategy]]
- [[_COMMUNITY_Tile Data Model & React Stack|Tile Data Model & React Stack]]
- [[_COMMUNITY_OCR Name Parsing Quirks|OCR Name Parsing Quirks]]
- [[_COMMUNITY_Kaggle Offload Config|Kaggle Offload Config]]

## God Nodes (most connected - your core abstractions)
1. `PRD - FlashWorld Tile Visualizer` - 12 edges
2. `main()` - 9 edges
3. `Tile-Visualizer Architecture & Build Guide (CLAUDE.md)` - 8 edges
4. `FlashWorld (generative world model)` - 6 edges
5. `Gaussian Splat Scene (.ply/.spz)` - 4 edges
6. `Inserted Flat-Quad Panel Tiling Strategy` - 4 edges
7. `React + react-three-fiber Web App Stack` - 4 edges
8. `ocr_name()` - 3 edges
9. `FlashWorld GPU Offload Flags` - 3 edges
10. `Tile Catalogue Data Model` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Inserted Flat-Quad Panel Tiling Strategy` --semantically_similar_to--> `Depth Anything V2 Fallback Pipeline`  [INFERRED] [semantically similar]
  CLAUDE.md → PRD.md
- `Tile-Visualizer Architecture & Build Guide (CLAUDE.md)` --references--> `Kaggle (offline GPU compute platform)`  [EXTRACTED]
  CLAUDE.md → PRD.md
- `Tile-Visualizer Architecture & Build Guide (CLAUDE.md)` --references--> `PRD - FlashWorld Tile Visualizer`  [EXTRACTED]
  CLAUDE.md → PRD.md
- `Tile-Visualizer Architecture & Build Guide (CLAUDE.md)` --references--> `Sundai "World Models" Hackathon`  [EXTRACTED]
  CLAUDE.md → PRD.md
- `Tile-Visualizer Architecture & Build Guide (CLAUDE.md)` --references--> `FlashWorld (generative world model)`  [EXTRACTED]
  CLAUDE.md → PRD.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Tile Application Pipeline (splat limitation -> panel -> catalogue -> material)** — shared_gaussian_splats, shared_panel_tiling_strategy, shared_tile_catalogue_schema, prd_finish_material_preset [INFERRED 0.85]
- **World-Model Hackathon Pitch Narrative** — shared_flashworld, prd_world_model_theme, prd_demo_pitch_framing, prd_sundai_hackathon [INFERRED 0.85]
- **H0-H4 Build Plan Implements Core Stack** — shared_build_phases, shared_react_r3f_stack, shared_panel_tiling_strategy, shared_tile_catalogue_schema [INFERRED 0.80]

## Communities (8 total, 2 thin omitted)

### Community 0 - "Catalog Extraction Script"
Cohesion: 0.36
Nodes (9): build_contact_sheet(), crop_box(), derive_family(), dominant_color(), is_product_page(), main(), ocr_line(), Extract a structured tile catalog from GLOSSY_RANDOM_VOL_1.pdf ("2ft by 4ft Cata (+1 more)

### Community 1 - "World-Model Pitch & FlashWorld Rationale"
Cohesion: 0.70
Nodes (5): Demo/Pitch Framing (Mini Digital Twin), PRD - FlashWorld Tile Visualizer, World Model Theme Fit Rationale, FlashWorld (generative world model), HunyuanWorld-1.0-lite (rejected alternative)

### Community 2 - "Project Docs & Build Phases"
Cohesion: 0.50
Nodes (4): Tile-Visualizer Architecture & Build Guide (CLAUDE.md), Planned Directory Structure, Sundai "World Models" Hackathon, H0-H4 Build Phases

### Community 3 - "Splat-to-Panel Tiling Strategy"
Cohesion: 0.67
Nodes (4): Depth Anything V2 Fallback Pipeline, Browser Gaussian-Splat Viewer (Three.js), Gaussian Splat Scene (.ply/.spz), Inserted Flat-Quad Panel Tiling Strategy

### Community 4 - "Tile Data Model & React Stack"
Cohesion: 0.50
Nodes (4): Development Commands (npm scripts), Finish-Based PBR Material Preset (Glossy/Matte), React + react-three-fiber Web App Stack, Tile Catalogue Data Model

## Knowledge Gaps
- **1 isolated node(s):** `Planned Directory Structure`
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PRD - FlashWorld Tile Visualizer` connect `World-Model Pitch & FlashWorld Rationale` to `Project Docs & Build Phases`, `Splat-to-Panel Tiling Strategy`, `Tile Data Model & React Stack`, `Kaggle Offload Config`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `Tile-Visualizer Architecture & Build Guide (CLAUDE.md)` connect `Project Docs & Build Phases` to `World-Model Pitch & FlashWorld Rationale`, `Tile Data Model & React Stack`, `Kaggle Offload Config`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `main()` connect `Catalog Extraction Script` to `OCR Name Parsing Quirks`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `Extract a structured tile catalog from GLOSSY_RANDOM_VOL_1.pdf ("2ft by 4ft Cata`, `Name crop sometimes bleeds into the tile image below it, which breaks     tesser`, `Planned Directory Structure` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._