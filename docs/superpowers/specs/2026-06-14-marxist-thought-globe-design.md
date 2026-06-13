# Design Spec: 3D Marxist Thought Globe (Forigen)

**Date**: 2026-06-14
**Status**: Draft — pending review
**User**: Marxist philosophy graduate student, personal learning & note-taking tool

## 1. Overview

A 3D interactive Earth globe web application for visualizing the full genealogy of Western Marxist thought — from German Idealism precursors through classical Marxism to contemporary schools (Frankfurt School, structuralism, analytical Marxism, eco-Marxism, etc.). The user writes Markdown notes about thinkers, and the app renders them as nodes on a glowing dark-themed globe with relationship arcs, a historical timeline, and geographic analysis.

The app is a **personal learning companion**: as the user reads philosophy books (e.g., Deng Xiaomang's *History of Western Philosophy*), they add Markdown files. Each new thinker and relationship appears on the globe, gradually building a comprehensive map of Marxist intellectual history.

## 2. Core Features

### 2.1 3D Globe Visualization
- Dark academic visual style: deep space background, semi-transparent blue Earth, glowing nodes, luminous arc connections
- Node style: glowing spheres with floating name labels (visible on hover/zoom)
- Connection style: arc curves flying above the Earth surface with flow animation showing influence direction
- Atmosphere glow effect around the globe edge
- Orbit controls: rotate, zoom, tilt with mouse/touch

### 2.2 Thinker Nodes
- Each node represents a thinker
- **Color**: by school of thought (e.g., historical materialism = orange, German Idealism = blue, Frankfurt School = green)
- **Size**: proportional to influence/importance
- **Halo glow**: indicates the user has written notes for this thinker (encourages content creation)
- Floating label: name + birth-death years, visible at sufficient zoom level
- Click → detail panel slides in from right; Earth auto-rotates to center on the node

### 2.3 Connection Lines
- Arc curves flying above the globe surface
- **Color**: inherits from source node's school color (toggleable to uniform gray)
- **Thickness**: represents influence strength
- Animated flow particles travel from influencer → influenced
- Visible based on current filter and timeline state

### 2.4 Detail Panel (Right Slide-in)
Content when a thinker node is clicked:
- Colored avatar dot (school color)
- Chinese + English name, birth-death years
- Geographic location + school tag
- Core ideas tags (clickable → search/filter by idea)
- Key works list with years
- "Influenced by" list (clickable → Earth flies to that thinker)
- "Influenced" list (clickable → Earth flies to that thinker)
- Link to open the Markdown note file for editing

### 2.5 Timeline (Bottom)
- Cumulative display mode: slider at year X shows all thinkers who appeared up to year X
- Deceased thinkers rendered semi-transparent
- Play button: auto-advances the timeline year by year
- Speed control: scroll wheel adjusts playback speed (1×, 2×, 5×, 10×)
- Year labels: 1800, 1850, 1900, 1950, 2000
- Default position: ~1850 (Marx's active period)
- State persisted to localStorage

### 2.6 Search & Filter (Top Bar)
- **Search**: type to match thinker name (CN/EN), work title, or core idea tag. Selecting a result flies Earth to that node.
- **School filter**: multi-select dropdown, only selected schools shown (others fade out)
- **Region filter**: multi-select dropdown by geographic region
- **Time range**: quick-jump presets ("19th Century" = 1800–1899)
- All filters combine with AND logic
- Active filter count badge

### 2.7 Legend (Toggleable Overlay)
- School color swatches with labels
- Collapsible, positioned bottom-left

## 3. Data Model

### 3.1 Markdown File Format
One file per thinker in `content/thinkers/`. Frontmatter (YAML) defines structured data; body is free-form notes.

```yaml
---
name: "Karl Marx"
name_zh: "卡尔·马克思"
born: 1818
died: 1883
latitude: 50.5873
longitude: 7.5272
region: "germany"
school: "historical-materialism"
key_works:
  - title: "Das Kapital"
    title_zh: "资本论"
    year: 1867
  - title: "The Communist Manifesto"
    title_zh: "共产党宣言"
    year: 1848
influenced_by: ["hegel", "feuerbach", "adam-smith"]
influenced: ["engels", "lenin", "lukacs"]
core_ideas: ["historical-materialism", "surplus-value", "class-struggle", "alienation"]
---
# 卡尔·马克思 (Karl Marx)
... free-form Markdown notes ...
```

- Filename slug = unique ID (e.g., `karl-marx`)
- All text fields have Chinese + English versions
- `influenced_by` / `influenced` reference other file slugs → auto-resolved to bidirectional connections
- `core_ideas` enable cross-school tagging (multiple thinkers sharing the same idea tag)

### 3.2 Build Pipeline
```
content/thinkers/*.md → scripts/build-data.ts → public/data/thinkers.json
```
- Uses `gray-matter` to parse YAML frontmatter
- Resolves slug references to build a complete graph
- Validates required fields, warns on broken references
- Run manually: `npm run build-data`
- The JSON is loaded at app startup via `useData` hook

## 4. Technical Architecture

### 4.1 Stack
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18 + TypeScript + Vite | App shell, fast dev server |
| 3D | @react-three/fiber + @react-three/drei + three | 3D globe rendering |
| Data parsing | gray-matter | Parse Markdown frontmatter |
| File glob | fast-glob | Find Markdown files |
| Geo | d3-geo (spherical projection only) | Lat/lng → 3D coordinates |

### 4.2 Project Structure
```
forigen/
├── content/thinkers/           # User-edited Markdown notes
├── scripts/build-data.ts       # Markdown → JSON build
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── types.ts
│   ├── components/
│   │   ├── Globe/
│   │   │   ├── GlobeScene.tsx       # R3F Canvas
│   │   │   ├── EarthSphere.tsx      # Dark Earth sphere
│   │   │   ├── ThinkerNode.tsx       # Glowing node sphere
│   │   │   ├── ConnectionLines.tsx   # Arc curves
│   │   │   └── Atmosphere.tsx        # Edge glow
│   │   └── UI/
│   │       ├── SearchBar.tsx
│   │       ├── Timeline.tsx
│   │       ├── DetailPanel.tsx
│   │       └── Legend.tsx
│   ├── hooks/
│   │   ├── useData.ts
│   │   ├── useTimeline.ts
│   │   └── useCamera.ts
│   └── utils/
│       ├── geo.ts              # Lat/lng → sphere 3D position
│       └── graph.ts            # Build relationship graph
├── public/textures/            # Earth texture
├── package.json
└── vite.config.ts
```

### 4.3 Component Tree
```
App
├── <Canvas>                     ← React Three Fiber
│   ├── <EarthSphere />
│   ├── <Atmosphere />
│   ├── {thinkers.map(t => <ThinkerNode />)}
│   └── {connections.map(c => <ConnectionLine />)}
├── <SearchBar />                ← HTML overlay
├── <Timeline />                 ← HTML overlay
├── <DetailPanel />              ← HTML overlay
└── <Legend />                   ← HTML overlay
```

### 4.4 Data Flow
```
Markdown files → build-data.ts → thinkers.json
                                     ↓
                               useData hook ← React Context (filters, timeline, selection)
                                     ↓
                    ┌────────────────┼────────────────┐
                    ↓                ↓                ↓
              GlobeScene        SearchBar         Timeline
              ThinkerNode       DetailPanel       Legend
```

### 4.5 Key State (React Context)
- `allThinkers: Thinker[]` — full dataset
- `connections: Connection[]` — resolved relationships
- `filteredThinkers: Thinker[]` — after applying school/region/time filters
- `selectedThinker: Thinker | null` — currently selected node
- `timelineYear: number` — current year on the slider
- `schoolFilter: string[]` — active school filters
- `regionFilter: string[]` — active region filters
- `searchQuery: string`

## 5. Interaction Design

### 5.1 Navigation
- **Rotate**: left-click drag
- **Zoom**: scroll wheel (min distance: shows full globe; max distance: shows continent-level detail)
- **Tilt**: right-click drag or Ctrl+drag
- **Fly-to**: animated camera transition when clicking a thinker or search result (~800ms ease-in-out)

### 5.2 Node Interaction
- **Hover**: floating label appears, connecting arcs highlight, other nodes dim slightly
- **Click**: detail panel slides in, Earth rotates to center the node, related nodes pulse
- **Double-click**: zoom in to node

### 5.3 Timeline Interaction
- **Drag slider**: real-time update of visible nodes
- **Click play**: auto-advance at configured speed
- **Scroll on speed indicator**: adjust playback speed

### 5.4 Initial Load
- Camera centers on Europe, slight tilt
- Timeline defaults to ~1850
- First visit: subtle auto-rotate for 5 seconds to show it's interactive

## 6. Visual Design

### 6.1 Color Palette
- Background: #0a0a1a (deep space blue-black)
- Earth: semi-transparent blue (#0d2847 base) with subtle grid lines
- Node glow: school-color with 0.3 opacity outer ring
- Connections: school-color with 0.5–0.8 opacity
- UI panels: #0d1a2d background, #1a3a5c borders

### 6.2 School Colors
| School | Color |
|--------|-------|
| German Idealism | #42a5f5 (blue) |
| Historical Materialism | #ff7043 (orange) |
| Frankfurt School | #66bb6a (green) |
| Structural Marxism | #ab47bc (purple) |
| Existentialist Marxism | #ffa726 (amber) |
| Analytical Marxism | #26c6da (cyan) |
| Leninism | #ef5350 (red) |
| Eco-Marxism | #9ccc65 (light green) |
| ... extensible via config | |

### 6.3 Typography
- Titles/names: system sans-serif, white (#fff)
- Secondary text: #aaccdd
- Tertiary/labels: #667788
- Chinese text: system default CJK font

## 7. Non-Functional Requirements

- **Performance**: 150+ nodes at 60fps (use instanced meshes if needed)
- **Responsive**: desktop-first; minimum viewport 1024×768
- **Persistence**: last camera position, timeline year, and filters saved to localStorage
- **Build time**: Markdown → JSON under 2 seconds
- **No backend**: purely static, deployable to GitHub Pages

## 8. Scope

### Milestone 1 (MVP)
- 3D globe with dark theme + atmosphere
- Thinker nodes (glowing spheres) from JSON data
- Arc connection lines
- Detail panel (slide-in)
- Timeline slider (cumulative mode)
- Search bar
- 5–10 seed thinkers as sample data

### Milestone 2
- School color legend
- School and region filter dropdowns
- Camera fly-to animation
- Play button on timeline
- Node halo for "has notes"
- Markdown build script

### Milestone 3
- Responsive layout improvements
- localStorage persistence
- Performance optimization (instanced rendering)
- Floating labels on hover
- Connection flow animation

### Out of Scope (for now)
- User accounts / authentication
- Backend API / database
- Collaborative editing
- Mobile support
- VR/AR

## 9. Verification

- `npm run build-data` produces valid JSON from sample Markdown files
- App loads without errors, globe renders with all seed thinker nodes
- Clicking a node opens detail panel with correct data
- Timeline slider filters nodes correctly by year
- Search finds thinkers by name (CN and EN)
- Camera fly-to animation targets the correct geographic position
- All filters combine correctly (AND logic)
- No console errors or 404s
