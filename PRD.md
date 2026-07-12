# PRD – FlashWorld Tile Visualizer

**Final v1** · Sundai "World Models" hackathon · Last updated 12 Jul 2026

---

## 1. Summary

Generate an explorable 3D room from a single photo using a world model, then let anyone
walk through it and redesign the walls and floor with a real ceramic-tile catalogue –
picking designs by thumbnail and seeing them applied live.

The project doubles as a real tool for a family ceramic-tile business: it moves a
physical tile catalogue into an interactive space that answers the customer's actual
question – *"what will this look like in a room?"*

## 2. Why this is a "world model" project (theme fit)

- The hackathon defines a world model as a system that **generates or predicts a world**
  (renderer / simulator / planner). A hand-built 3D scene is neither – it's graphics you
  author by hand, with no generation.
- Here, a **generative world model (FlashWorld)** produces the explorable 3D room from a
  photo or text prompt. That generation is the world model doing the core work.
- This is exactly the deck's **"Mini Digital Twin"** idea: turn a room photo into an
  explorable 3D space.
- **Pitch line for judges:** *"A world model turns one photo into a navigable room; our
  layer lets you redesign that room's surfaces with a real product catalogue and see the
  result in 3D."*

## 3. Users & context

- **Primary user:** anyone operating the tool – shop staff demoing to a customer, or the
  customer themselves. No technical skill assumed. **No login / no accounts.**
- **Context:** a laptop or tablet in the showroom, or a shared web link.
- The world model runs **offline, ahead of time**; end users only ever touch the
  finished, lightweight web app.

## 4. Goals & success criteria

**Goal:** a live demo where a real room photo becomes an explorable 3D scene, and a
viewer selects a surface, picks a catalogue design by thumbnail, and sees the tile
applied while navigating.

**Success signals:**
- A first-time user goes *look around → pick a surface → pick a design → see it applied*
  with no instructions.
- A generative world model is visibly the engine that created the space (on-theme).
- Designs are data-driven (adding one is a catalogue entry, not a code change).

## 5. The world model: FlashWorld

- **What:** FlashWorld (Xiamen University × Tencent, ICLR 2026 Oral). Generates a 3D
  scene from a **single image or text prompt in seconds**. Open source, with a Hugging
  Face demo and a CLI.
- **Why this one:** it fits free Kaggle compute. With its offload flags
  (`--offload_t5`, `--offload_transformer_during_vae`, and especially `--offload_vae`)
  GPU memory drops **below 10 GB** – comfortably inside a 16 GB Kaggle T4/P100. Slower,
  but fine for pre-generating a room offline.
- **Why not HunyuanWorld:** the quantized HunyuanWorld-1.0-lite targets ~24 GB (a 4090)
  and will likely OOM on a 16 GB Kaggle card.
- **Output format:** 3D Gaussian splats (`.ply` / `.spz`) plus a preview video – **not**
  a clean textured mesh.
- **Key limitation (drives the architecture):** Gaussian splats look great to explore
  but have no tidy surfaces to retexture, so you cannot "paint" a tile directly onto the
  generated wall. Solution in §6.

## 6. Architecture

**Offline generation (once, on Kaggle):**
1. Take/choose a room photo with large, flat walls.
2. Run FlashWorld's CLI headless on Kaggle with the memory-offload flags.
3. Export the scene (`.ply` splats) + preview video; download them.

**Local web app (runs on any machine, incl. the RTX 3050):**
- Load and render the generated scene with a **browser Gaussian-splat viewer** (a
  Three.js splat library that loads `.ply`). This is the explorable environment.
- **Tiling via inserted panels:** for each redesignable surface, drop a **flat quad**
  aligned to a wall or the floor, inside the splat scene. Tile *that* quad with the
  chosen catalogue design. It's geometry you control – so it renders cleanly and even
  keeps the option of precise 2 ft × 4 ft grout layout later.
- **Design application:** swap the panel's material to the selected design's texture,
  using a finish-based PBR preset (Glossy = reflective/low-roughness, Matte =
  high-roughness).

This split keeps the theme story clean: **FlashWorld generates the world; the inserted
panels are where the catalogue tiles live.**

## 7. Tile catalogue & data model

For the hackathon a small **JSON** file is enough; a single Supabase table works the
same way if preferred. Either way, **one list with a `finish` field** – not a separate
table per finish.

```
design:
  code           # catalogue code, shown to user
  name           # shown to user
  finish         # 'glossy' | 'matte' | 'random'
  thumbnail_url  # for the selection grid
  texture_url    # tileable image applied to the panel
  width_ft = 2   # future-proof; MVP tiles are 2x4
  height_ft = 4
```

## 8. Scope

### In scope
- One pre-generated explorable room (from a real photo, via FlashWorld).
- In-browser navigation of that room.
- Catalogue panel: thumbnails with **code + name**, filterable by finish.
- Select a surface, drop/align a tile panel, apply the chosen design as a material.
- Finish-driven material look (glossy vs matte).
- Live design swapping while navigating.

### Out of scope
- **Live** world generation during the demo (pre-generate instead).
- Exact 2×4 grout precision as a hard requirement (available on the inserted panel as a
  stretch; not required for the MVP).
- More than one room; free-walk physics.
- A real backend/auth (JSON catalogue is fine).

## 9. User flow (demo)

1. App opens into the pre-generated explorable room.
2. User looks around.
3. User selects a surface (a wall or the floor).
4. User picks a design from the thumbnail panel (code + name shown), optionally filtered
   by finish.
5. The surface panel re-renders with that design; user keeps navigating and swaps freely.

## 10. Tech stack

- **Generation:** FlashWorld on **Kaggle** (16 GB T4/P100, ~30 GPU-hrs/week; torch &
  diffusers preinstalled), run headless via CLI with offload flags.
- **App:** **React + react-three-fiber / drei** *(assumption – swap to plain JS +
  Three.js if preferred)*, with a Gaussian-splat loader for `.ply`.
- **Catalogue data:** JSON (or Supabase if trivial).
- **Local dev/hosting:** the RTX 3050 laptop is enough – the app needs no AI inference at
  runtime. Deploy on Vercel/Netlify if a shareable link is wanted.

## 11. Build plan (timeboxed)

- **H0 – Generate (highest risk, do first):** install FlashWorld on Kaggle; run it with
  offload flags on a room photo; export a `.ply` that loads in a web viewer.
- **H1 – Explore:** React + splat viewer loads the scene; add navigation controls.
- **H2 – Catalogue:** thumbnail panel with code/name + finish filter, from JSON.
- **H3 – Apply:** insert a surface panel, select it, swap its material to a design.
- **H4 – Polish & pitch:** finish-driven materials, clean UI, rehearse the world-model
  framing.

## 12. Stretch goals (only if ahead)

- Precise 2×4 ft grout tiling on the inserted panel.
- A second room, or a **text-prompted** room ("a modern bathroom").
- Live generation from a photo uploaded during the demo.
- Auto-detect wall planes so panels align without manual placement.

## 13. Risks & mitigations

- **Generation fails / Kaggle GPU busy** – pre-generate rooms early; the demo never
  depends on live inference. Kaggle sessions support background execution.
- **Splat scene won't retexture** – expected; that's why tiles live on inserted panels,
  not the splats.
- **Splats heavy in the browser** – keep to one room; downsample if needed.
- **Everything cloud-side breaks** – fallback pipeline: Depth Anything V2 on the laptop
  turns the photo into a depth-displaced mesh you can tile directly (weaker theme story,
  but fully local and never blocked).

## 14. Assumptions & open items

- Front end is **React + react-three-fiber** unless decided otherwise.
- Room is **pre-generated offline**; live generation is a stretch goal.
- Catalogue is a small JSON for the demo.
- Exact tile dimensions/grout are optional polish, not a gate.
- Model access/tooling changes often – verify the FlashWorld repo/HF demo before the
  event.

## 15. Demo / pitch framing

Open on the explorable room and say a world model built it from one photo. Walk through
it, select a wall, and swap a couple of real catalogue designs live – closing on the
dual value: *a genuine world-model application, and a working sales tool for a real tile
business.*
