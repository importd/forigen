# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build / Dev Commands

```bash
npm run dev          # Start Vite dev server (base path: /forigen/)
npm run build        # tsc --noEmit + vite build
npm run preview      # Preview production build
npm run lint         # ESLint
```

The app is deployed to GitHub Pages at `/forigen/`. `vite.config.ts` sets `base: '/forigen/'`, and all asset paths use `import.meta.env.BASE_URL`.

## Architecture Overview

**Forigen** is a 3D interactive globe visualizing Western philosophical genealogy — thinkers positioned on Earth, connected by influence arcs, filtered through time and topic.

**Tech:** React 19 + TypeScript + Vite + React Three Fiber (@react-three/fiber + drei) + Three.js 0.184.

### Data Flow

```
Markdown files (public/thinkers/*.md + index.json)
    ↓ loadSeedThinkers() — fetch + parse YAML frontmatter
    ↓ metadataToThinker() → Thinker objects
    ↓ extractLabels() → IdeaDetail + TheoryModule records
    ↓ buildConnections() → Connection[] (from→to arcs)
    ↓
AppContext (React context) + customThinkers (localStorage)
    ↓
useData(timelineYear) → allThinkers, connections, filteredThinkers
    ↓
App.tsx — further filters by selectedEra, selectedThinker, selectedTopic
    ↓
GlobeScene (3D canvas) + UI panels (HTML overlays)
```

### Key Modules

- **`src/utils/geo.ts`** — `latLngToVector3(lat, lng, radius)`, `midPoint()`, `GLOBE_RADIUS` (1.5). All globe components import `GLOBE_RADIUS` from here.
- **`src/utils/graph.ts`** — `buildConnections(thinkers)` builds `Connection[]` from `influencedBy`/`influenced` arrays. `filterThinkersByYear()` filters by mid-career year ≤ timelineYear.
- **`src/utils/markdownIO.ts`** — Parses YAML frontmatter + markdown body from thinker `.md` files. `markdownToData()`, `metadataToThinker()`, `extractLabels()`.
- **`src/context/AppContext.tsx`** — Global state: `timelineYear`, `selectedThinker`, `searchQuery`, `notes` (localStorage-backed), `customThinkers`, `selectedTopic`, label/idea/school-theory merging.
- **`src/data/schools.ts`** — `SCHOOL_COLORS` (97 school→color mappings, desaturated earth tones), `AUTO_PALETTE` (20 fallback colors), `getSchoolColor(school)` merges hardcoded + custom labels from localStorage.
- **`src/data/loadThinkers.ts`** — Fetches `public/thinkers/index.json` for the ID list, then fetches each `{id}.md`, parses, and returns aggregated `SeedData`.

### Component Structure

**3D Globe (R3F Canvas):**
- `GlobeScene.tsx` — Canvas setup, warm-toned lighting (ambient `#f5e6d3`, two directional), OrbitControls (damping 0.1, minDist 0.9, maxDist 8)
- `EarthSphere.tsx` — Loads `map.png` texture onto a sphere (`GLOBE_RADIUS`), wireframe grid overlay, warm back-shadow sphere
- `Atmosphere.tsx` — Custom GLSL shader (warm sepia Fresnel glow, animated `uTime`)
- `ThinkerNode.tsx` — Map-pin style markers: thin cylinder stem + colored sphere head, quaternion-aligned to surface normal, Html labels (Georgia italic, school-colored), distance-based scaling
- `ConnectionLines.tsx` — Arc curves between related thinkers. Solid lines muted brown, animated flow segments in source school color for direction
- `CountryBorders.tsx` — GeoJSON border lines in warm brown `#8b6f4e`

**UI Overlays (HTML positioned absolutely over canvas):**
- `DetailPanel.tsx` — Right-side slide-in dossier panel with "DOSSIER · CLASSIFIED" header strip. Sub-sections: HeaderSection, CoreIdeasSection, KeyWorksSection, InfluenceSection, BranchTheories, MarxConnectionSection, NoteEditor
- `TopicPanel.tsx` — Topic filter dropdown (top-left)
- `SchoolPanel.tsx` — School filter dropdown (bottom-left)
- `SearchBar.tsx` — Typewriter-style input (`> SEARCH THINKER... _`), top-left
- `Timeline.tsx` — Year slider (bottom), red stamp accent, serif year display
- `EraTimeline.tsx` — 10-era macro bar (bottom), click-to-select filters thinkers, red text on active
- `DataToolbar.tsx` — Import/export links (bottom-left)
- `PaperOverlay.tsx` — Fixed full-screen noise grain overlay (z-index 9997), subtle paper texture

### Design System (CSS Variables in `index.css`)

Current theme is **"Classified Dossier"** — warm paper, serif+typewriter typography, red stamp accents:

- `--paper: #f2ede4`, `--surface: #e8e0d4`, `--surface-hover: #ddd5c8`
- `--text-primary: #1a1a1a`, `--text-secondary: #5a4a3a`, `--text-muted: #8b7355`
- `--border: #c0b8ac`, `--stamp-red: #9e2a2b`
- `--font-display: 'Playfair Display', 'Noto Serif SC', serif`
- `--font-body: 'Georgia', 'Noto Serif SC', serif`
- `--font-mono: 'Courier New', 'FangSong', monospace`

Fonts loaded via Google Fonts: Playfair Display (400/600/700/900 + italic) + Noto Serif SC (400/600/700).

### Thinker Data Format

Thinkers are stored as `.md` files in `public/thinkers/` with YAML frontmatter:

```yaml
---
id: "marx"
name: "Karl Marx"
name_zh: "卡尔·马克思"
born: 1818
died: 1883
latitude: 51.3397
longitude: 7.1609
school: "historical-materialism"
influenced_by: ["hegel", "feuerbach"]
influenced: ["lenin", "lukacs", "gramsci"]
core_ideas:
  - slug: "historical-materialism"
    label: "历史唯物主义"
    label_en: "Historical Materialism"
    definition: "..."
    origin: "..."
    evolution: "..."
    misconception: "..."
key_works:
  - title: "Das Kapital"
    title_zh: "资本论"
    year: 1867
---
```

### Era Interaction

Eras filter thinkers on click (not hover). Click an era segment → globe shows only thinkers from that era. Click same era again → deselect, shows all thinkers up to current timeline year. State managed in `App.tsx` as `selectedEra`.

### Notes on the Globe Interaction

- Three.js canvas is transparent — page background (`var(--paper)`) shows through
- OrbitControls: zoom via scroll, rotate via drag, no pan. Damping factor 0.1
- ThinkerNode labels use `Html` from drei — rendered as DOM elements overlaid on 3D positions
- Label collision avoidance: screen-space bounding boxes tracked per frame in ThinkerNode
- `noRaycast` callback pattern used for decorative meshes (stem, halo) — only the pin head sphere is clickable
