# Classified Dossier Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Forigen app's visual design from "dark space / cosmic archive" to "classified dossier / antique archive" — warm paper tones, serif+typewriter typography, antique globe, ink-annotation nodes, and mechanical animations.

**Architecture:** Pure visual layer refactor — no data model or state management changes. CSS custom properties (`:root` variables) anchor the new design system. Each component's inline styles are updated to reference these variables. Three.js materials and shaders are retuned for the antique globe and ink-annotation aesthetic.

**Tech Stack:** React 19, React Three Fiber, Three.js 0.184, TypeScript, Vite, inline CSS (existing pattern).

**Spec reference:** `docs/superpowers/specs/2026-06-14-classified-dossier-redesign.md`

---

## Phase 1: Foundation — CSS Variables, Fonts, Global Styles

### Task 1: Update `index.html` — Fonts and Meta

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Google Fonts preconnect and stylesheet**

Replace the existing `<head>` content with font loading added. The file currently is minimal. Add the font links:

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Forigen · 思想脉络档案</title>
    <!-- Google Fonts: Playfair Display (serif display) + Noto Serif SC (Chinese serif) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Verify the page loads**

Run: `npm run dev` then open the dev URL. Check browser DevTools > Network tab — confirm `fonts.googleapis.com` CSS and font files are fetched.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Playfair Display and Noto Serif SC fonts"
```

---

### Task 2: Rewrite `src/index.css` — CSS Variables and Global Styles

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace entire contents with the new design system**

```css
/* ── Forigen · Classified Dossier Theme ── */
:root {
  /* Paper & Surface */
  --paper: #f2ede4;
  --surface: #e8e0d4;
  --surface-hover: #ddd5c8;

  /* Text */
  --text-primary: #1a1a1a;
  --text-secondary: #5a4a3a;
  --text-muted: #8b7355;

  /* Borders & Dividers */
  --border: #c0b8ac;
  --border-light: #d5cec0;

  /* Accents */
  --stamp-red: #9e2a2b;
  --stamp-red-dim: rgba(158, 42, 43, 0.15);
  --brass: #8b6f4e;
  --ink-green: #4a6a5a;

  /* Typography */
  --font-display: 'Playfair Display', 'Noto Serif SC', serif;
  --font-body: 'Georgia', 'Noto Serif SC', 'Times New Roman', serif;
  --font-mono: 'Courier New', 'FangSong', 'SimFang', monospace;
}

/* ── Reset & Base ── */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--paper);
  color: var(--text-primary);
}

body {
  font-family: var(--font-body);
  font-size: 12px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* Paper grain texture overlay */
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Vignette — darker at edges */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  box-shadow: inset 0 0 80px rgba(139, 115, 85, 0.1),
              inset 0 0 8px rgba(139, 115, 85, 0.05);
}

/* ── Scrollbar ── */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--paper);
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* ── Selection ── */
::selection {
  background: var(--stamp-red-dim);
  color: var(--text-primary);
}

/* ── Focus ── */
:focus-visible {
  outline: 1px solid var(--stamp-red);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Verify the app loads with new styles**

Run: `npm run dev`. Confirm:
- Background is warm paper color `#f2ede4`
- Text is dark `#1a1a1a`
- Paper grain is visible (very subtle)

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: classified dossier CSS variables and global paper theme"
```

---

### Task 3: Update School Colors — Desaturated Ink Palette

**Files:**
- Modify: `src/data/schools.ts`

- [ ] **Step 1: Replace `SCHOOL_COLORS` with desaturated earth-tone palette**

The current 57 colors span vibrant full-spectrum. Replace with muted, ink-on-paper earth tones organized by historical period:

```typescript
export const SCHOOL_COLORS: Record<string, string> = {
  // ── Ancient Greek / Aegean (warm ochres) ──
  'milesian': '#b89560',
  'eleaticism': '#c4a878',
  'pythagoreanism': '#a08850',
  'ionian': '#c8b080',
  'atomism': '#b09068',
  'ephesian': '#c09870',
  'pluralism': '#a88860',
  'sophism': '#b8a070',

  // ── Hellenistic / Roman (muted ambers & purples) ──
  'academic-skepticism': '#9a8a78',
  'epicureanism': '#a89070',
  'stoicism': '#8a7a90',
  'cynicism': '#9a8068',
  'neoplatonism': '#8878a0',
  'peripatetic': '#a89878',

  // ── Medieval / Scholastic (faded browns & muted blues) ──
  'augustinianism': '#908070',
  'thomism': '#8a7a6a',
  'scholasticism': '#8a8070',
  'via-antiqua': '#8090a0',
  'nominalism': '#788898',
  'averroism': '#988870',
  'illuminationism': '#b09868',
  'sufi': '#a09068',

  // ── Renaissance / Early Modern (muted blues, rusts, golds) ──
  'humanism': '#8a7060',
  'natural-philosophy': '#7090a0',
  'rationalism': '#6078a0',
  'empiricism': '#6888a0',
  'mechanical-philosophy': '#788890',
  'enlightenment': '#b89850',

  // ── German Idealism / 19th Century (muted blues & greens) ──
  'transcendental-idealism': '#5088b0',
  'absolute-idealism': '#4890a8',
  'german-idealism': '#4888a8',
  'neo-kantianism': '#6090a8',
  'hegelianism': '#3880a0',
  'young-hegelian': '#5898b0',

  // ── Marxist traditions (muted crimsons, rusts, olives) ──
  'historical-materialism': '#a04030',
  'marxism': '#9a3028',
  'leninism': '#a83030',
  'trotskyism': '#a84030',
  'maoism': '#a03528',
  'western-marxism': '#903830',
  'frankfurt-school': '#5a7060',
  'critical-theory': '#4a6860',
  'structural-marxism': '#6a5058',
  'analytical-marxism': '#884840',
  'austro-marxism': '#984838',
  'luxemburgism': '#a03830',

  // ── Phenomenology / Existentialism (muted blue-greys) ──
  'phenomenology': '#607090',
  'existentialism': '#586878',
  'hermeneutics': '#687888',
  'deconstruction': '#586888',

  // ── Analytic / Pragmatism (muted slate) ──
  'analytic-philosophy': '#587088',
  'logical-positivism': '#5070a0',
  'pragmatism': '#707860',
  'philosophy-of-language': '#6078a0',

  // ── Contemporary (subdued tones) ──
  'structuralism': '#706888',
  'post-structuralism': '#685878',
  'postmodernism': '#786088',
  'feminist-philosophy': '#885868',
  'postcolonial': '#806848',
  'psychoanalysis': '#607088',
  'process-philosophy': '#688870',
  'ecology': '#587860',
};
```

- [ ] **Step 2: Update `AUTO_PALETTE` to use warm, muted colors**

```typescript
export const AUTO_PALETTE: string[] = [
  '#a04030', '#8a6a50', '#5a7060', '#6078a0', '#887050',
  '#607090', '#986840', '#688870', '#786888', '#4a6860',
  '#b09050', '#6878a0', '#884838', '#587860', '#706888',
  '#a88850', '#587088', '#8a7060', '#607060', '#886878',
];
```

- [ ] **Step 3: Verify school colors display correctly**

Run: `npm run dev`. Open the SchoolPanel — confirm all school color dots show the new muted palette.

- [ ] **Step 4: Commit**

```bash
git add src/data/schools.ts
git commit -m "feat: desaturated ink-palette school colors for dossier theme"
```

---

## Phase 2: 3D Globe — Antique Map Transformation

### Task 4: Rewrite `EarthSphere.tsx` — Antique Globe Texture and Grid

**Files:**
- Modify: `src/components/Globe/EarthSphere.tsx`

- [ ] **Step 1: Replace the earth texture approach**

Replace the current satellite texture with a warm parchment-colored material. Since we can't generate a new texture file easily, we'll use a `meshBasicMaterial` with a warm parchment color and the existing texture heavily tinted, OR we can use a procedural approach with a canvas-generated texture.

Replace the file content:

```tsx
import { useRef, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const GLOBE_RADIUS = 2.0;

export function EarthSphere() {
  const earthTexture = useTexture(import.meta.env.BASE_URL + 'textures/earth.jpg');
  const gridRef = useRef<THREE.Mesh>(null);

  // Warm-tinted earth — apply a sepia tone to the satellite texture
  // We keep the existing texture for geographical accuracy but tint it warm
  const tintedTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const img = earthTexture.image as HTMLImageElement;
    canvas.width = img?.width || 2048;
    canvas.height = img?.height || 1024;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    // Sepia overlay
    ctx.fillStyle = 'rgba(180, 140, 100, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Warm brown overlay for oceans
    ctx.fillStyle = 'rgba(200, 170, 130, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [earthTexture]);

  return (
    <group>
      {/* Main globe — flat shaded, no specular for paper feel */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={tintedTexture}
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>

      {/* Antique cartographic grid — latitude / longitude lines */}
      <mesh ref={gridRef}>
        <sphereGeometry args={[GLOBE_RADIUS * 1.003, 48, 24]} />
        <meshBasicMaterial
          color="#8b6f4e"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Inner warm shadow — replaces the old dark tint sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.995, 32, 32]} />
        <meshBasicMaterial
          color="#c8b898"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Verify the globe renders with warm tones**

Run: `npm run dev`. The globe should show:
- Warm sepia-tinted continents
- Parchment-colored oceans
- Faint brown wireframe grid (not bright blue `#1a3a5c`)
- No inner dark tint

- [ ] **Step 3: Commit**

```bash
git add src/components/Globe/EarthSphere.tsx
git commit -m "feat: antique globe — sepia texture, brass grid, warm shadow"
```

---

### Task 5: Rewrite `Atmosphere.tsx` — Warm Sepia Glow

**Files:**
- Modify: `src/components/Globe/Atmosphere.tsx`

- [ ] **Step 1: Replace the cyan Fresnel glow with warm sepia**

Replace the fragment shader's color and add `useFrame` for a subtle shimmer. Replace file content:

```tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GLOBE_RADIUS = 2.0;

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = 1.0 - abs(dot(viewDir, vNormal));
    float intensity = pow(fresnel, 2.5);
    // Warm sepia/brass atmosphere — replaces cyan 0.31,0.76,0.97
    vec3 glowColor = vec3(0.71, 0.55, 0.38);
    // Subtle time variation for parchment shimmer
    float shimmer = 1.0 + sin(fresnel * 6.0 + uTime * 0.3) * 0.08;
    gl_FragColor = vec4(glowColor, intensity * 0.18 * shimmer);
  }
`;

export function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1.08, 1.08, 1.08]}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Verify the atmosphere glow**

Run: `npm run dev`. The globe should have a subtle warm sepia rim glow instead of a bright cyan one.

- [ ] **Step 3: Commit**

```bash
git add src/components/Globe/Atmosphere.tsx
git commit -m "feat: warm sepia atmosphere glow replacing cyan Fresnel"
```

---

### Task 6: Update `CountryBorders.tsx` — Ink-Brown Borders

**Files:**
- Modify: `src/components/Globe/CountryBorders.tsx`

- [ ] **Step 1: Change border color to warm brown ink**

Find and replace the `LineBasicMaterial` color:

Old (approximately line 80-90, the material definition):
```tsx
const material = new THREE.LineBasicMaterial({
  color: '#2a5078',
  transparent: true,
  opacity: 0.45,
});
```

Replace with:
```tsx
const material = new THREE.LineBasicMaterial({
  color: '#8b6f4e',
  transparent: true,
  opacity: 0.3,
});
```

- [ ] **Step 2: Verify borders**

Run: `npm run dev`. Country borders should appear as faint brown ink lines, blending with the antique globe.

- [ ] **Step 3: Commit**

```bash
git add src/components/Globe/CountryBorders.tsx
git commit -m "feat: warm brown ink country borders"
```

---

### Task 7: Update `GlobeScene.tsx` — Lighting, Remove Stars

**Files:**
- Modify: `src/components/Globe/GlobeScene.tsx`

- [ ] **Step 1: Remove Stars, adjust lighting**

The `<Stars>` import and component must be removed. Adjust lights for warm desk-lamp feel.

Remove the import:
```tsx
// Remove: import { Stars, ... } from '@react-three/drei';
```

Remove the `<Stars>` element (find `{/* Stars */}` or `<Stars radius=...` block and delete it).

Change ambient light from cool to warm:
```tsx
// Old: <ambientLight intensity={0.6} />
// New:
<ambientLight intensity={0.45} color="#ffeedd" />
```

Change directional lights for warm tone:
```tsx
// Old: two <directionalLight> with default white
// New:
<directionalLight
  position={[5, 3, 5]}
  intensity={0.8}
  color="#fff5e8"
/>
<directionalLight
  position={[-3, -1, -2]}
  intensity={0.25}
  color="#ffe8d0"
/>
```

- [ ] **Step 2: Verify the scene**

Run: `npm run dev`. The globe should have:
- No starfield background
- Warm-toned lighting
- The globe should feel like a desk artifact under a lamp

- [ ] **Step 3: Commit**

```bash
git add src/components/Globe/GlobeScene.tsx
git commit -m "feat: remove stars, warm desk-lamp lighting for antique globe"
```

---

## Phase 3: Thinker Nodes — Ink Annotations

### Task 8: Rewrite `ThinkerNode.tsx` — Ink-Dot Markers

**Files:**
- Modify: `src/components/Globe/ThinkerNode.tsx`

- [ ] **Step 1: Replace glow-orb nodes with ink-dot markers**

The current node uses 3 concentric `meshBasicMaterial` spheres with glow opacity. Replace with an ink-dot style: a solid colored core + ink-bleed diffusion ring + handwritten-style label.

Replace the file content:

```tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Thinker } from '../../types';
import { getSchoolColor } from '../../data/schools';

const GLOBE_RADIUS = 2.0;
const REF_DISTANCE = 4.0;
const NODE_MIN = 0.15;
const NODE_MAX = 1.8;

interface ThinkerNodeProps {
  thinker: Thinker;
  isDeceased: boolean;
  hasNotes: boolean;
  onClick: () => void;
  highlighted?: boolean;
  dimmed?: boolean;
}

export function ThinkerNode({
  thinker,
  isDeceased,
  hasNotes,
  onClick,
  highlighted,
  dimmed,
}: ThinkerNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const color = getSchoolColor(thinker.school);
  const coreRadius = 0.025 + (thinker.influenced?.length || 0) * 0.003;

  // Convert lat/lng to 3D position
  const position = useMemo(() => {
    const lat = THREE.MathUtils.degToRad(thinker.latitude);
    const lng = THREE.MathUtils.degToRad(thinker.longitude);
    const r = GLOBE_RADIUS * 1.01;
    return new THREE.Vector3(
      r * Math.cos(lat) * Math.cos(lng),
      r * Math.sin(lat),
      -r * Math.cos(lat) * Math.sin(lng),
    );
  }, [thinker.latitude, thinker.longitude]);

  // Scale based on camera distance
  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    const dist = camera.position.length();
    const scale = THREE.MathUtils.clamp(
      REF_DISTANCE / dist,
      NODE_MIN,
      NODE_MAX,
    );
    groupRef.current.scale.setScalar(scale);
  });

  const baseOpacity = isDeceased ? 0.55 : 0.85;
  const dimOpacity = 0.08;
  const highlightScale = highlighted ? 1.5 : 1;
  const finalOpacity = dimmed ? dimOpacity : baseOpacity;
  const inkBleedOpacity = dimmed ? 0.02 : highlighted ? 0.22 : 0.1;

  return (
    <group ref={groupRef} position={position}>
      {/* ── Ink bleed / diffusion layer (largest) ── */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[coreRadius * 3.5 * highlightScale, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={inkBleedOpacity}
          depthWrite={false}
        />
      </mesh>

      {/* ── Ink spread layer (medium) ── */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[coreRadius * 2.2 * highlightScale, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={inkBleedOpacity * 1.8}
          depthWrite={false}
        />
      </mesh>

      {/* ── Ink core (solid dot) ── */}
      <mesh onClick={onClick}>
        <sphereGeometry args={[coreRadius * highlightScale, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={finalOpacity}
          depthWrite={false}
        />
      </mesh>

      {/* ── Note indicator: small red stamp dot ── */}
      {hasNotes && (
        <mesh>
          <ringGeometry args={[coreRadius * 2.5, coreRadius * 3.0, 32]} />
          <meshBasicMaterial
            color="#9e2a2b"
            transparent
            opacity={dimmed ? 0.05 : 0.55}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── Selected ring (dashed-line feel via dotted ring) ── */}
      {highlighted && (
        <mesh>
          <ringGeometry args={[coreRadius * 4.0, coreRadius * 4.3, 48]} />
          <meshBasicMaterial
            color="#1a1a1a"
            transparent
            opacity={0.5}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── Handwritten-style label (Georgia italic) ── */}
      <Html
        center
        position={[0, coreRadius * 3.5 * highlightScale + 0.06, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            fontFamily: "'Georgia', 'Noto Serif SC', serif",
            fontSize: '9px',
            fontStyle: 'italic',
            color: highlighted ? '#9e2a2b' : '#5a4a3a',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            background: highlighted
              ? 'rgba(242, 237, 228, 0.9)'
              : 'transparent',
            padding: highlighted ? '1px 6px' : '0',
            borderRadius: '2px',
            borderBottom: highlighted ? '1px solid #9e2a2b' : 'none',
            opacity: dimmed ? 0.15 : 1,
            transition: 'all 0.1s',
          }}
        >
          {thinker.name_zh || thinker.name}
        </div>
      </Html>
    </group>
  );
}
```

- [ ] **Step 2: Verify nodes**

Run: `npm run dev`. Thinker nodes should appear as:
- Colored ink dots with diffusion halos (not glowing orbs)
- Labels in italic Georgia, not white system font
- Note indicators as red rings
- Selected nodes get a dark ring + red underline label

- [ ] **Step 3: Commit**

```bash
git add src/components/Globe/ThinkerNode.tsx
git commit -m "feat: ink-dot thinker markers with diffusion halos and handwritten labels"
```

---

## Phase 4: Connection Lines — Ink Arcs

### Task 9: Rewrite `ConnectionLines.tsx` — Ink-Drawn Arcs

**Files:**
- Modify: `src/components/Globe/ConnectionLines.tsx`

- [ ] **Step 1: Replace glowing colored arcs with warm brown ink arcs**

Change the color from school-specific to a uniform warm brown, reduce visual weight.

The key changes:
- Solid arcs: color from `getSchoolColor()` → `'#8b7355'` (uniform warm brown ink)
- Line width: keep but reduce opacity
- Flow segment: color also to `'#8b7355'`
- Fade parameters: adjust for the brighter background

Find the `SolidArc` component's `<Line>` and change:
```tsx
// Old: const color = getSchoolColor(connection.school);
// New: keep color but with reduced saturation — or use uniform #8b7355

// In the Line component:
<Line
  points={curvePoints}
  color="#8b7355"
  lineWidth={0.9}
  transparent
  opacity={opacity * 0.4}
  // ...
/>
```

Find the `FlowSegment`'s material:
```tsx
// Old: color={color} (school color)
// New:
<lineBasicMaterial
  color="#8b7355"
  transparent
  opacity={opacity * 0.7}
  // ...
/>
```

- [ ] **Step 2: Verify connection arcs**

Run: `npm run dev`. Connections should be faint brown ink arcs, much subtler than the current bright colored lines.

- [ ] **Step 3: Commit**

```bash
git add src/components/Globe/ConnectionLines.tsx
git commit -m "feat: ink-brown connection arcs replacing colored glow lines"
```

---

## Phase 5: UI Panels — Archive Dossier Style

### Task 10: Update `DetailPanel/HeaderSection.tsx` — Dossier Header

**Files:**
- Modify: `src/components/UI/DetailPanel/HeaderSection.tsx`

- [ ] **Step 1: Rewrite all inline styles from dark-space to warm-paper**

Key style replacements (apply throughout the component's inline style objects):

```tsx
// Circle avatar
const avatarStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: color,
  opacity: 0.85,
  // Remove: boxShadow: `0 0 20px ${color}55`
};

// Thinker name (Chinese)
const nameZhStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 20,
  fontWeight: 700,
  color: 'var(--text-primary)',
  letterSpacing: '0.02em',
};

// Thinker name (English)
const nameEnStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 13,
  fontStyle: 'italic',
  color: 'var(--text-secondary)',
};

// Dates
const datesStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  color: 'var(--text-muted)',
  letterSpacing: '0.05em',
};

// Tags / badges
const tagStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  color: 'var(--text-secondary)',
  background: 'rgba(139, 115, 85, 0.08)',
  border: '1px solid rgba(139, 115, 85, 0.2)',
  padding: '2px 8px',
  borderRadius: 2,
  letterSpacing: '0.04em',
};

// Metadata labels
const metaLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  color: 'var(--text-muted)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
};

// Metadata values
const metaValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  color: 'var(--text-secondary)',
};

// School badge
const schoolBadgeStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  fontWeight: 600,
  color: color,
  borderBottom: `1px solid ${color}44`,
  paddingBottom: 2,
  letterSpacing: '0.04em',
};
```

- [ ] **Step 2: Verify the detail panel header**

Run: `npm run dev`. Click a thinker node. The header should show serif names, typewriter metadata, warm colors.

- [ ] **Step 3: Commit**

```bash
git add src/components/UI/DetailPanel/HeaderSection.tsx
git commit -m "feat: dossier-style detail panel header with serif+typewriter fonts"
```

---

### Task 11: Update `Timeline.tsx` — Archive Chronology Register

**Files:**
- Modify: `src/components/UI/Timeline.tsx`

- [ ] **Step 1: Replace all colors and fonts in the inline styles and embedded `<style>` tag**

All color changes follow the same pattern. Key replacements:

Container:
```tsx
// Old: background: 'rgba(13, 26, 45, 0.92)', border: '1px solid #1a3a5c'
// New:
background: 'rgba(242, 237, 228, 0.92)',
border: '1px solid var(--border)',
```

Slider track:
```tsx
// Old: background: '#1a3a5c', filled: '#4fc3f7'
// New:
background: '#d5cec0',
// filled portion: var(--stamp-red)
```

Slider thumb (in the `<style>` tag):
```css
/* Old: background: '#4fc3f7', border: 2px solid '#0a0a1a' */
/* New: */
background: var(--stamp-red);
border: 2px solid var(--paper);
```

Year display:
```tsx
// Old: color: '#fff'
// New:
color: 'var(--text-primary)',
fontFamily: 'var(--font-display)',
```

Tick marks:
```tsx
// Old: major color: near ? '#4fc3f7' : '#556677', minor: '#334455'
// New:
major: near ? 'var(--stamp-red)' : 'var(--text-muted)',
minor: 'var(--border)',
```

Play button:
```tsx
// Old: background: isPlaying ? '#ff7043' : '#1a3a5c'
// New:
background: isPlaying ? 'var(--stamp-red)' : 'var(--surface-hover)',
color: isPlaying ? 'var(--paper)' : 'var(--text-secondary)',
```

Jump input:
```tsx
// Old: background: '#111d2d', border: '1px solid #4fc3f7', color: '#fff'
// New:
background: 'var(--paper)',
border: '1px solid var(--stamp-red)',
color: 'var(--text-primary)',
fontFamily: 'var(--font-mono)',
```

- [ ] **Step 2: Verify the timeline**

Run: `npm run dev`. Timeline should show warm paper background, red accent slider, serif year display.

- [ ] **Step 3: Commit**

```bash
git add src/components/UI/Timeline.tsx
git commit -m "feat: archive chronology register — warm timeline with red accent"
```

---

### Task 12: Update `EraTimeline.tsx` — Warm Era Bar

**Files:**
- Modify: `src/components/UI/EraTimeline.tsx`

- [ ] **Step 1: Replace all colors and fonts**

Key replacements:
- Outer container font: `color: 'var(--text-muted)'`, `fontFamily: 'var(--font-mono)'`
- Era bar border: `'1px solid var(--border)'`
- Era segment hover: `background: 'var(--surface-hover)'`
- Era labels: `color: isActive ? era.color : 'var(--text-secondary)'`
- Era dates: `color: 'var(--text-muted)'`
- Milestones: `color: 'var(--text-muted)'`, hover `color: 'var(--text-primary)'`
- Top accent bar: keep using `era.color` (already warm from Task 3)

For the era colors themselves (hardcoded in the ERAS array), adjust to match the new desaturated palette:

```tsx
// Old example era colors: '#c0a060', '#b0a0c0', '#8a9ab0', '#5c9bd5', '#42a5f5', '#ff7043', '#ef5350', '#66bb6a', '#ab47bc', '#26c6da'
// Replace with warm equivalents:
'#b89560', '#9a8a78', '#8a8070', '#6888a0', '#5088b0',
'#a04030', '#9a3028', '#5a7060', '#786888', '#688870'
```

- [ ] **Step 2: Verify the era timeline**

Run: `npm run dev`. The era bar at the bottom should show warm, muted era colors on a paper background.

- [ ] **Step 3: Commit**

```bash
git add src/components/UI/EraTimeline.tsx
git commit -m "feat: warm era timeline with desaturated period colors"
```

---

### Task 13: Update `SearchBar.tsx` — Archive Index Search

**Files:**
- Modify: `src/components/UI/SearchBar.tsx`

- [ ] **Step 1: Replace all colors, fonts, and placeholder text**

Input:
```tsx
// Old: background: 'rgba(13, 26, 45, 0.92)', border: '1px solid #1a3a5c', color: '#fff'
// New:
background: 'rgba(242, 237, 228, 0.95)',
border: '1px solid var(--border)',
color: 'var(--text-primary)',
fontFamily: 'var(--font-mono)',
fontSize: 13,
```

Placeholder:
```tsx
// Old: placeholder="搜索思想家 / Search thinker..."
// New:
placeholder="> SEARCH THINKER... _"
```

Dropdown:
```tsx
// Old: background: '#0d1a2d', border: '1px solid #1a3a5c'
// New:
background: 'var(--paper)',
border: '1px solid var(--border)',
```

Result items:
```tsx
// Old: borderBottom: '1px solid #1a3a5c', hover background: '#1a2a3d'
// New:
borderBottom: '1px solid var(--border-light)',
// hover: background: 'var(--surface-hover)'
```

Result text:
```tsx
// Old: name color: '#fff', detail color: '#667788', school color: '#556677'
// New:
name: color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontWeight: 600
detail: color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10
school: color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 10
```

- [ ] **Step 2: Verify search**

Run: `npm run dev`. Search bar should show typewriter-style input with `> SEARCH THINKER... _` placeholder.

- [ ] **Step 3: Commit**

```bash
git add src/components/UI/SearchBar.tsx
git commit -m "feat: archive index search — typewriter input with paper dropdown"
```

---

### Task 14: Update `TopicPanel.tsx` — Subject Index Panel

**Files:**
- Modify: `src/components/UI/TopicPanel.tsx`

- [ ] **Step 1: Replace colors, fonts, and TOPIC_COLORS array**

Replace `TOPIC_COLORS` (local constant array near top of file):
```tsx
// Old:
const TOPIC_COLORS = ['#4fc3f7', '#ffb74d', '#81c784', '#e57373', '#ba68c8', '#64b5f6', '#ffd54f', '#4db6ac'];
// New:
const TOPIC_COLORS = [
  '#a04030', '#8a6a50', '#5a7060', '#6078a0',
  '#887050', '#607090', '#986840', '#688870',
];
```

Trigger button (open state):
```tsx
// Old: background: open ? '#142434' : '#0d1a2d', border: open ? '#3a5a7c' : '#1a3a5c'
// New:
background: open ? 'var(--surface-hover)' : 'var(--surface)',
border: `1px solid ${open ? 'var(--text-muted)' : 'var(--border)'}`,
color: open ? 'var(--text-primary)' : 'var(--text-secondary)',
fontFamily: 'var(--font-mono)',
```

Dropdown:
```tsx
// Old: background: '#0d1a2d', border: '1px solid #1a3a5c', boxShadow: '0 4px 24px rgba(0,0,0,0.5)'
// New:
background: 'var(--paper)',
border: '1px solid var(--border)',
boxShadow: '0 4px 24px rgba(139, 115, 85, 0.2)',
```

Topic items:
```tsx
// Old: active background: '#142434', hover background: '#101f30'
// New:
active: background: 'var(--surface-hover)',
hover: background: 'var(--surface-hover)',
```

Topic text:
```tsx
// Old: active color: tc, inactive: '#aaccdd'
// New:
active: color: tc,
inactive: color: 'var(--text-secondary)',
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UI/TopicPanel.tsx
git commit -m "feat: subject index panel — warm paper topic filter"
```

---

### Task 15: Update `SchoolPanel.tsx` — School Archive Panel

**Files:**
- Modify: `src/components/UI/SchoolPanel.tsx`

- [ ] **Step 1: Apply the same color/font replacements as TopicPanel**

Same pattern — replace all dark background colors with warm paper equivalents, system fonts with var(--font-*), light text with dark brown text.

Key additional change — the definition card:
```tsx
// Old: background: '#0d1a2d', border: `1px solid ${selected.color}44`, borderLeft: `3px solid ${selected.color}`
// New:
background: 'var(--paper)',
border: `1px solid var(--border)`,
borderLeft: `3px solid ${selected.color}`,
```

Card header color:
```tsx
// Keep: color: selected.color
// Description: color: 'var(--text-secondary)'
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UI/SchoolPanel.tsx
git commit -m "feat: school archive panel — warm paper with colored accents"
```

---

### Task 16: Update `DataToolbar.tsx` — Dossier Import/Export

**Files:**
- Modify: `src/components/UI/DataToolbar.tsx`

- [ ] **Step 1: Replace text colors and font**

```tsx
// Old: color: '#556677' / '#334455', fontFamily: system
// New:
color: 'var(--text-muted)',
fontFamily: 'var(--font-mono)',
fontSize: 10,
letterSpacing: '0.04em',
```

Importing state:
```tsx
// Old: color: importing ? '#334455' : '#556677'
// New:
color: importing ? 'var(--text-muted)' : 'var(--text-secondary)',
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UI/DataToolbar.tsx
git commit -m "feat: typewriter-style data toolbar links"
```

---

### Task 17: Update `DetailPanel/index.tsx` — Panel Container

**Files:**
- Modify: `src/components/UI/DetailPanel.tsx`

- [ ] **Step 1: Replace the panel container style**

The DetailPanel is the right-side slide-in panel. Change its container background and border:

```tsx
// Old: background: 'rgba(13, 26, 45, 0.92)', border: '1px solid #1a3a5c'
// New:
const panelStyle: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  top: 0,
  width: 360,
  height: '100%',
  background: 'var(--paper)',
  borderLeft: '1px solid var(--border)',
  boxShadow: '-2px 0 16px rgba(139, 115, 85, 0.12)',
  overflowY: 'auto',
  zIndex: 20,
};
```

Also add a decorative top bar (dossier header strip):
```tsx
// Inside the panel, at the very top:
<div style={{
  fontFamily: 'var(--font-mono)',
  fontSize: 8,
  color: 'var(--text-muted)',
  letterSpacing: '0.08em',
  padding: '8px 16px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--surface)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}}>
  <span>DOSSIER · CLASSIFIED</span>
  <span style={{ color: 'var(--stamp-red)', opacity: 0.5, transform: 'rotate(-12deg)' }}>
    TOP SECRET
  </span>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UI/DetailPanel.tsx
git commit -m "feat: dossier panel container with classified header strip"
```

---

## Phase 6: Animations — Mechanical Feel

### Task 18: Replace Animation Keyframes — Mechanical Over Organic

**Files:**
- Modify: `src/components/UI/DetailPanel.tsx` (slideIn keyframes)
- Modify: `src/components/UI/TopicPanel.tsx` (popIn keyframes)
- Modify: `src/components/UI/SchoolPanel.tsx` (popIn/slideIn keyframes)

- [ ] **Step 1: Replace all `@keyframes slideIn` with mechanical version**

In `DetailPanel.tsx`, replace the embedded `<style>` tag's `slideIn` keyframes:

```css
/* Old: ease-out elastic slide */
@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* New: mechanical hard slide */
@keyframes fileSlideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
```

And update the animation property on the panel:
```css
/* Old: animation: slideIn 0.3s ease-out; */
/* New: */
animation: fileSlideIn 0.25s cubic-bezier(0.3, 0, 1, 1);
```

- [ ] **Step 2: Replace `@keyframes popIn` in TopicPanel and SchoolPanel**

```css
/* Old: */
@keyframes popIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* New: */
@keyframes stampDown {
  from { opacity: 0; transform: translateY(-2px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

Duration: `0.12s cubic-bezier(0.3, 0, 1, 1)`.

- [ ] **Step 3: Add stamp-press animation for thinker selection**

In `ThinkerNode.tsx`, add a `<style>` tag with:
```css
@keyframes stampPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.92); }
  75% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
```

Applied to the node's outer group on click via a CSS class.

- [ ] **Step 4: Remove all `transition: all ...` and replace with explicit properties**

Search all modified files for `transition: 'all 0.2s'` or `transition: 'all 0.15s'` and replace with targeted transitions:
```tsx
// Old: transition: 'all 0.2s'
// New:
transition: 'background 0.1s, color 0.1s, border-color 0.1s',
```

This prevents unwanted property animations that feel organic/AI-like.

- [ ] **Step 5: Commit**

```bash
git add src/components/UI/DetailPanel.tsx src/components/UI/TopicPanel.tsx src/components/UI/SchoolPanel.tsx src/components/Globe/ThinkerNode.tsx
git commit -m "feat: mechanical animations — hard cuts, stamp press, no organic easing"
```

---

## Phase 7: Final Polish — Textures, Edge Cases

### Task 19: Add Paper Texture and Vignette Overlay Component

**Files:**
- Create: `src/components/UI/PaperOverlay.tsx`

- [ ] **Step 1: Create a dedicated paper texture overlay component**

This provides a React-level alternative to the CSS `body::before` approach for the canvas area:

```tsx
// PaperOverlay.tsx — ensures paper texture renders over the 3D canvas too
import { useEffect, useRef } from 'react';

export function PaperOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Subtle noise via canvas for areas the CSS pseudo-elements can't cover
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(256, 256);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = Math.random() * 12;
      imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = noise;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9997,
        pointerEvents: 'none',
        opacity: 0.03,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
```

- [ ] **Step 2: Add PaperOverlay to App.tsx**

In `src/App.tsx`, import and render `<PaperOverlay />` inside `AppContent`, at the top level:

```tsx
import { PaperOverlay } from './components/UI/PaperOverlay';

// In the return, as the first child of the outer div:
<PaperOverlay />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/UI/PaperOverlay.tsx src/App.tsx
git commit -m "feat: paper grain overlay component for full coverage"
```

---

### Task 20: Final Verification — Full Visual Audit

**Files:**
- None (manual verification)

- [ ] **Step 1: Launch the app and verify every component**

Run: `npm run dev`

Checklist:
- [ ] Background is warm paper `#f2ede4` (not black/dark blue)
- [ ] Paper grain texture is visible (very subtle)
- [ ] Globe is sepia-toned (not blue/green satellite)
- [ ] Atmosphere is warm sepia glow (not cyan)
- [ ] Country borders are faint brown (not dark blue)
- [ ] No starfield
- [ ] Thinker nodes are ink dots with diffusion halos (not glowing orbs)
- [ ] Node labels are italic serif (not white system sans-serif)
- [ ] Connection lines are faint brown (not bright colored)
- [ ] Detail panel has dossier header strip with "TOP SECRET" stamp
- [ ] Detail panel names in Playfair Display / Noto Serif SC
- [ ] Search bar shows `> SEARCH THINKER... _` in Courier
- [ ] Timeline slider is red accent, year in serif
- [ ] Era bar uses warm muted colors
- [ ] Topic/School panels have warm paper dropdowns
- [ ] Animations are hard/mechanical (not bouncy/elastic)
- [ ] Text is readable (sufficient contrast on paper background)
- [ ] Chinese characters render correctly in serif fonts

- [ ] **Step 2: Fix any visual regressions found**

If fonts don't load: verify the Google Fonts URLs in `index.html`.
If a component still shows dark colors: find remaining hardcoded dark hex values.
If readability is poor: increase font size or contrast on specific elements.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: visual audit adjustments for dossier theme"
```

---

## Summary

**Files modified:** 18  
**Files created:** 1 (`PaperOverlay.tsx`)  
**Total tasks:** 20  
**Phases:** 7

**Implementation order is sequential within each phase, but phases are designed to produce incremental visual results:**
1. Foundation (CSS, fonts, colors) → visible paper background
2. Globe (texture, atmosphere, borders, lighting) → visible antique globe
3. Nodes → visible ink annotations
4. Connections → visible ink arcs
5. UI Panels → fully themed interface
6. Animations → mechanical feel
7. Polish → texture overlay + audit
