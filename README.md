# Simul8 — Interactive Architecture Diagram

A polished, pannable, zoomable explainer for **Simul8**, a calibrated decision-intelligence
platform. It renders the full top-to-bottom data flow — industries → geography-scoped input
data → orchestrator → prediction & simulation engines → fusion → output → the Vault — as an
interactive, FigJam-style canvas. **The connectors are the point:** the five-arrow *calibration
loop* is a first-class, animated interaction.

Built with **Vite + React + TypeScript**, plain **CSS Modules** (no UI framework), hand-rolled
**SVG** connectors, and `react-zoom-pan-pinch` for pan/zoom + native touch gestures.

---

## Highlights

- **Pan & zoom like FigJam** — click-drag to pan, scroll/pinch to zoom, with zoom ±, fit-to-screen,
  and a one-finger-drag / pinch experience on touch devices. Opens fit-to-screen by default.
- **Dark & light themes** — dark by default, sun/moon toggle in the header, persisted to
  `localStorage`. Every colour (including the six category tints and the arrows) is themed via
  CSS variables, with WCAG-AA text contrast in both themes.
- **Click any node** → its connectors light up, everything else dims, and a detail panel opens
  with the node's **full description** (a bottom sheet on mobile).
- **“Show calibration loop”** — the hero button. Highlights and animates the five calibration
  arrows — routed around the engine block — so the learning loop is unmistakable.
- **ESC** returns to the default view: clears selection, turns off the calibration highlight,
  removes dimming and closes the panel.
- **Data-driven** — every node and arrow lives in [`src/data/diagram.ts`](src/data/diagram.ts).
  Edit that one file to change the diagram; the views are dumb renderers.
- **Mobile-first** — tested at 375px; fully explorable by drag/pinch.

---

## Run locally

Requires Node 18+.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-light production build -> dist/
npm run preview    # serve the built dist/ locally
npm run typecheck  # full TypeScript check (tsc --noEmit)
```

### Browser QA (optional)

A Playwright harness drives the live app and saves annotated screenshots to `.qa/`
(themes, node detail, the calibration loop, ESC, and 375px mobile):

```bash
npm install                       # installs playwright (devDependency)
npx playwright install chromium   # one-time browser download
npm run dev                       # in one terminal
node scripts/qa.mjs               # in another — writes .qa/*.png
node scripts/qa-zoom.mjs          # near-1:1 close-ups for tracing arrows
```

---

## Deploy to Vercel

This is a zero-config static Vite build (`vite build` → `dist/`).

**Option A — Dashboard**

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel, **Add New… → Project** and import the repo.
3. Vercel auto-detects Vite. Leave the defaults (Build Command `npm run build`,
   Output Directory `dist`) and **Deploy**. The included [`vercel.json`](vercel.json) pins these.

**Option B — CLI**

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

No environment variables, no backend — it's fully static.

---

## Project structure

```
src/
  data/diagram.ts      ← ALL node content + arrow definitions + canvas size (edit me)
  types.ts             ← DiagramNode / DiagramArrow model
  geometry.ts          ← anchor points + cubic-bézier arrow path resolver
  components/
    Canvas.tsx         ← pan/zoom wrapper, fit-to-screen, mounts layers
    Node.tsx           ← renders a node by variant (title/industry/panel/source/bar/box/engine/vault)
    ArrowLayer.tsx     ← SVG connectors (base layer behind nodes + overlay above for lit arrows)
    DetailPanel.tsx    ← detail card / mobile bottom sheet + calibration-loop explainer
    Controls.tsx       ← zoom ± / fit + “Show calibration loop” toggle
    Header.tsx         ← brand + interaction hint
    Legend.tsx         ← flow vs calibration key + colour legend
  App.tsx              ← state: selection + calibration mode, computes lit nodes/arrows
```

### How to edit the diagram

Open `src/data/diagram.ts`:

- **Add/move a node** — add a `DiagramNode` with `id`, `variant`, `position`, `size`, `color`,
  `title`, and optional `subtitle` / `items` / `tag` / `badge` / `detail`.
- **Add an arrow** — add a `DiagramArrow` with `from`, `to`, and `type: 'flow' | 'calibration'`.
  Optional `fromSide` / `toSide` (`top|bottom|left|right`), `fromOffset` / `toOffset` (0–1 along
  that side), `curve` (bézier handle multiplier), and `label`.
- Arrows automatically track node geometry, so you only ever edit data — never the SVG.

---

## Design notes

- **Type**: *Fraunces* (display) + *Hanken Grotesk* (body) — two weights, editorial but technical.
- **Surface**: warm paper with a faint dot-grid to reinforce the canvas metaphor; flat, rounded,
  hairline borders, no gradients.
- **Colour logic** matches the layers: blue *External*, green *Category / Accumulated*, amber
  *Product / Orchestrator*, purple *Linking / Vault*, pink *Engines*, blue *Fusion*, yellow *Output*.
- **Connectors**: neutral solid for data flow; **purple, dashed, animated** for the calibration loop.
```
