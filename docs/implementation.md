# Forigen — Implementation Documentation

**Last updated**: 2026-06-14
**Project**: 3D Marxist Thought Globe (forigen)

## Overview

A single-page web application rendering an interactive 3D Earth globe for visualizing Western Marxist philosophical genealogy. Thinkers appear as colored nodes at their geographic locations, connected by influence arcs. Includes timeline filtering, bilingual detail cards, inline note-taking, and Markdown import/export.

**Tech stack**: React 18 + TypeScript + Vite + react-three-fiber + @react-three/drei + three.js + JSZip

---

## File Structure

```
forigen/
├── public/
│   ├── textures/earth.jpg          # 4K NASA Blue Marble texture
│   └── data/countries.geojson      # Natural Earth 110m country borders (839KB)
├── src/
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global dark theme reset
│   ├── App.tsx                     # Root assembly — wires Globe, UI panels, context
│   ├── types.ts                    # Thinker, Connection, KeyWork interfaces
│   ├── context/
│   │   └── AppContext.tsx          # Global state: timeline, selection, search, notes, custom thinkers
│   ├── data/
│   │   ├── thinkers.ts             # 10 seed thinkers (Hegel through Adorno + Adam Smith)
│   │   ├── schools.ts              # School color map + bilingual labels
│   │   └── labels.ts               # Region & core ideas bilingual mappings
│   ├── hooks/
│   │   └── useData.ts              # Merges seed + custom thinkers, builds connections, filters by year
│   ├── utils/
│   │   ├── geo.ts                  # lat/lng → 3D vector on sphere (with arc midpoint helper)
│   │   ├── graph.ts                # Connection builder + year filter
│   │   └── markdownIO.ts           # Markdown ↔ Thinker conversion, zip export/import
│   └── components/
│       ├── Globe/
│       │   ├── GlobeScene.tsx       # R3F Canvas container — stars, lights, orbit controls
│       │   ├── EarthSphere.tsx      # Textured sphere + grid overlay + dark tint
│       │   ├── Atmosphere.tsx       # Edge glow shader (BackSide sphere with Fresnel)
│       │   ├── CountryBorders.tsx   # GeoJSON → vector border lines on sphere surface
│       │   ├── ThinkerNode.tsx      # Glowing node sphere + hover label + inverse-zoom scaling
│       │   └── ConnectionLines.tsx  # Quadratic Bezier arcs between related thinkers
│       └── UI/
│           ├── SearchBar.tsx        # Left-aligned search with dropdown (CN/EN/ideas)
│           ├── Timeline.tsx         # Bottom timeline slider + play + speed + thinker count
│           ├── DetailPanel.tsx      # Right slide-in bilingual thinker card + inline note editor
│           └── DataToolbar.tsx      # Bottom-left: download/upload Markdown data
├── package.json
└── vite.config.ts
```

---

## Data Model

### Thinker
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique slug (e.g. `"marx"`) |
| `name` / `name_zh` | string | English / Chinese display name |
| `born` / `died` | number | Birth/death year (`died: 0` = living) |
| `latitude` / `longitude` | number | Geographic coordinates (degrees) |
| `region` | string | Region slug (e.g. `"germany"`) |
| `school` | string | School slug (e.g. `"historical-materialism"`) |
| `keyWorks` | KeyWork[] | Array of { title, title_zh, year } |
| `influencedBy` | string[] | Upstream thinker IDs |
| `influenced` | string[] | Downstream thinker IDs |
| `coreIdeas` | string[] | Idea slugs (e.g. `"surplus-value"`) |
| `hasNotes` | boolean | Deprecated in favor of AppContext check |

### Connection
Auto-generated from thinker `influenced` arrays via `buildConnections()`. Each connection contains from/to IDs and lat/lng for arc rendering.

---

## Key Behaviors

### 3D Globe
- **Texture**: 4K NASA Blue Marble + dark tint (#0a1020 at 15% opacity)
- **Grid**: 48×24 wireframe at 12% opacity
- **Borders**: Vector GeoJSON lines at radius × 1.006, crisp at any zoom
- **Atmosphere**: Fresnel edge glow shader (#4fc3f7, 35% peak)
- **Controls**: Orbit (damping 0.1), zoom range 1.6–8, no pan

### Node Scaling (Inverse Zoom)
```
nodeScale  = clamp(distance / 4.0,  0.35, 2.2)
labelScale = clamp(distance / 4.0,  0.6,  2.2)
```
- Far (dist 8): nodes 2×, labels 2× → visible from global view
- Near (dist 1.6): nodes 0.35×, labels 0.6× → distinguishable in dense Europe

### Click Targeting
Glow meshes have `raycast = () => {}` — only the core sphere receives pointer events, so clicks never get blocked by glow rings.

### Timeline
- Cumulative mode: year X shows thinkers with `born ≤ X`
- Deceased thinkers rendered at 35% opacity
- Play button auto-advances; speed cycles 1×–5× on click

### Notes (localStorage)
- Key: `forigen-notes` (JSON: `{ thinkerId: markdownContent }`)
- Auto-save on 500ms debounce
- Note indicator: golden glow ring on thinker nodes
- Each note editor has per-note `.md` export

### Custom Thinkers (localStorage)
- Key: `forigen-custom-thinkers` (JSON: `Thinker[]`)
- Uploaded `.md` files with frontmatter become new thinker nodes
- Merged with seed data in `useData` hook
- Connections auto-generated from `influenced_by` / `influenced` references

### Markdown Export/Import
- **Export**: All thinkers → YAML frontmatter + notes body → `.zip` of `.md` files
- **Import**: `.zip` or single `.md` → parsed → notes restored + new thinkers added
- No notes = empty body (no placeholder)
- Supported labels for bilingual export: regions (7), schools (10), ideas (29)

---

## State Architecture

```
AppProvider (React Context)
├── timelineYear: number          → default 1850
├── selectedThinker: Thinker|null → null
├── searchQuery: string           → ''
├── notes: Record<id, string>     → loaded from localStorage
├── customThinkers: Thinker[]     → loaded from localStorage
│
useData(timelineYear)
├── allThinkers = SEED + custom   → memoized
├── connections = buildConnections(allThinkers)
└── filteredThinkers = filterByYear(allThinkers, year)
```

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19 | UI framework |
| three | ^0.184 | 3D engine |
| @react-three/fiber | ^9.6 | React renderer for Three.js |
| @react-three/drei | ^10.7 | Helper components (OrbitControls, Stars, Html) |
| jszip | latest | Zip archive generation/parsing |
| vite | ^8.0 | Dev server + bundler |
| typescript | ~6.0 | Type checking |

---

## Seed Thinkers

| ID | Name | Born–Died | School | Region |
|----|------|-----------|--------|--------|
| adam-smith | Adam Smith | 1723–1790 | political-economy | britain |
| hegel | G.W.F. Hegel | 1770–1831 | german-idealism | germany |
| feuerbach | Ludwig Feuerbach | 1804–1872 | german-idealism | germany |
| marx | Karl Marx | 1818–1883 | historical-materialism | germany |
| engels | Friedrich Engels | 1820–1895 | historical-materialism | germany |
| lenin | Vladimir Lenin | 1870–1924 | leninism | russia |
| luxemburg | Rosa Luxemburg | 1871–1919 | historical-materialism | poland |
| lukacs | György Lukács | 1885–1971 | frankfurt-school | hungary |
| gramsci | Antonio Gramsci | 1891–1937 | historical-materialism | italy |
| adorno | Theodor W. Adorno | 1903–1969 | frankfurt-school | germany |

---

## Adding New Thinkers

Create a `.md` file with YAML frontmatter:

```yaml
---
id: "foucault"
name: "Michel Foucault"
name_zh: "米歇尔·福柯"
born: 1926
died: 1984
latitude: 46.58
longitude: 0.34
region: "france"
school: "structural-marxism"
key_works:
  - title: "Discipline and Punish"
    title_zh: "规训与惩罚"
    year: 1975
influenced_by: ["marx"]
influenced: []
core_ideas:
  - slug: "power-knowledge"
    label: "权力-知识"
    label_en: "Power-Knowledge"
---

## 笔记 · Notes

Your optional Markdown notes here...
```

Click **⬆ 上传** in the bottom-left corner and select the file.

To add to the permanent seed data, add the thinker object to `src/data/thinkers.ts` and rebuild.
