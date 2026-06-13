# Forigen MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working 3D Marxist Thought Globe with dark theme, thinker nodes, arc connections, detail panel, timeline slider, search bar, and 5-10 seed thinkers.

**Architecture:** React 18 + TypeScript + Vite SPA. 3D rendering via react-three-fiber + @react-three/drei. Data loaded from static JSON (generated from Markdown files). HTML overlay UI components (search, timeline, detail panel) positioned over the WebGL canvas. React Context manages global state (selection, timeline year, filters).

**Tech Stack:** React 18, TypeScript, Vite, react-three-fiber, @react-three/drei, three

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

- [ ] **Step 1: Initialize project with Vite**

Run: `npm create vite@latest . -- --template react-ts` from `d:\code\forigen`

Expected: Vite scaffolds a React + TypeScript project. Answer "yes" to overwrite prompts since the directory is empty (ignore the docs folder).

- [ ] **Step 2: Install core dependencies**

Run:
```bash
npm install three @react-three/fiber @react-three/drei
```

Expected: Packages install without errors.

- [ ] **Step 3: Install dev dependencies**

Run:
```bash
npm install -D @types/three
```

Expected: Type definitions install without errors.

- [ ] **Step 4: Verify scaffold works**

Run: `npm run dev`

Expected: Vite dev server starts. Open http://localhost:5173 in browser, see the default Vite + React page.

- [ ] **Step 5: Clean up scaffold files**

Remove the default Vite boilerplate from `src/App.tsx` and `src/index.css`. Replace with minimal content:

`src/index.css`:
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #root { width: 100%; height: 100%; overflow: hidden; }
body { background: #0a0a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
```

`src/App.tsx`:
```tsx
function App() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Globe will go here */}
    </div>
  );
}

export default App;
```

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Vite + React + TypeScript + R3F project"
```

---

### Task 2: Types & Seed Data

**Files:**
- Create: `src/types.ts`
- Create: `src/data/thinkers.ts`
- Create: `src/data/schools.ts`

- [ ] **Step 1: Define TypeScript types**

Write `src/types.ts`:
```typescript
export interface KeyWork {
  title: string;
  title_zh: string;
  year: number;
}

export interface Thinker {
  id: string;
  name: string;
  name_zh: string;
  born: number;
  died: number;
  latitude: number;
  longitude: number;
  region: string;
  school: string;
  keyWorks: KeyWork[];
  influencedBy: string[];
  influenced: string[];
  coreIdeas: string[];
  hasNotes: boolean;
}

export interface Connection {
  id: string;
  from: string;   // thinker id
  to: string;     // thinker id
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  school: string; // from node's school color
}

export interface SchoolColors {
  [schoolId: string]: string;
}

export interface AppState {
  allThinkers: Thinker[];
  connections: Connection[];
  selectedThinker: Thinker | null;
  timelineYear: number;
  searchQuery: string;
}
```

- [ ] **Step 2: Define school colors**

Write `src/data/schools.ts`:
```typescript
import { SchoolColors } from '../types';

export const SCHOOL_COLORS: SchoolColors = {
  'german-idealism': '#42a5f5',
  'historical-materialism': '#ff7043',
  'frankfurt-school': '#66bb6a',
  'structural-marxism': '#ab47bc',
  'existentialist-marxism': '#ffa726',
  'analytical-marxism': '#26c6da',
  'leninism': '#ef5350',
  'eco-marxism': '#9ccc65',
  'political-economy': '#78909c',
  'utopian-socialism': '#ffca28',
};

export const SCHOOL_LABELS: Record<string, { en: string; zh: string }> = {
  'german-idealism': { en: 'German Idealism', zh: '德国观念论' },
  'historical-materialism': { en: 'Historical Materialism', zh: '历史唯物主义' },
  'frankfurt-school': { en: 'Frankfurt School', zh: '法兰克福学派' },
  'structural-marxism': { en: 'Structural Marxism', zh: '结构主义马克思主义' },
  'existentialist-marxism': { en: 'Existentialist Marxism', zh: '存在主义马克思主义' },
  'analytical-marxism': { en: 'Analytical Marxism', zh: '分析马克思主义' },
  'leninism': { en: 'Leninism', zh: '列宁主义' },
  'eco-marxism': { en: 'Eco-Marxism', zh: '生态马克思主义' },
  'political-economy': { en: 'Political Economy', zh: '政治经济学' },
  'utopian-socialism': { en: 'Utopian Socialism', zh: '空想社会主义' },
};
```

- [ ] **Step 3: Write seed thinker data**

Write `src/data/thinkers.ts`:
```typescript
import { Thinker } from '../types';

export const SEED_THINKERS: Thinker[] = [
  {
    id: 'hegel',
    name: 'G.W.F. Hegel',
    name_zh: '黑格尔',
    born: 1770, died: 1831,
    latitude: 48.7758, longitude: 9.1829,
    region: 'germany',
    school: 'german-idealism',
    keyWorks: [
      { title: 'Phenomenology of Spirit', title_zh: '精神现象学', year: 1807 },
      { title: 'Science of Logic', title_zh: '逻辑学', year: 1816 },
    ],
    influencedBy: ['kant', 'fichte', 'schelling'],
    influenced: ['feuerbach', 'marx'],
    coreIdeas: ['dialectic', 'absolute-idealism', 'master-slave'],
    hasNotes: true,
  },
  {
    id: 'feuerbach',
    name: 'Ludwig Feuerbach',
    name_zh: '费尔巴哈',
    born: 1804, died: 1872,
    latitude: 49.4538, longitude: 11.0775,
    region: 'germany',
    school: 'german-idealism',
    keyWorks: [
      { title: 'The Essence of Christianity', title_zh: '基督教的本质', year: 1841 },
    ],
    influencedBy: ['hegel'],
    influenced: ['marx', 'engels'],
    coreIdeas: ['materialism', 'alienation-religion', 'anthropology'],
    hasNotes: true,
  },
  {
    id: 'marx',
    name: 'Karl Marx',
    name_zh: '卡尔·马克思',
    born: 1818, died: 1883,
    latitude: 49.7539, longitude: 6.6403,
    region: 'germany',
    school: 'historical-materialism',
    keyWorks: [
      { title: 'The Communist Manifesto', title_zh: '共产党宣言', year: 1848 },
      { title: 'Das Kapital', title_zh: '资本论', year: 1867 },
    ],
    influencedBy: ['hegel', 'feuerbach', 'adam-smith', 'ricardo'],
    influenced: ['engels', 'lenin', 'lukacs', 'gramsci'],
    coreIdeas: ['historical-materialism', 'surplus-value', 'class-struggle', 'alienation'],
    hasNotes: true,
  },
  {
    id: 'engels',
    name: 'Friedrich Engels',
    name_zh: '恩格斯',
    born: 1820, died: 1895,
    latitude: 51.2562, longitude: 7.1508,
    region: 'germany',
    school: 'historical-materialism',
    keyWorks: [
      { title: 'The Condition of the Working Class in England', title_zh: '英国工人阶级状况', year: 1845 },
      { title: 'Anti-Dühring', title_zh: '反杜林论', year: 1878 },
    ],
    influencedBy: ['marx', 'feuerbach'],
    influenced: ['lenin', 'luxemburg'],
    coreIdeas: ['dialectical-materialism', 'scientific-socialism'],
    hasNotes: true,
  },
  {
    id: 'lenin',
    name: 'Vladimir Lenin',
    name_zh: '列宁',
    born: 1870, died: 1924,
    latitude: 54.1518, longitude: 46.1898,
    region: 'russia',
    school: 'leninism',
    keyWorks: [
      { title: 'Imperialism, the Highest Stage of Capitalism', title_zh: '帝国主义是资本主义的最高阶段', year: 1917 },
      { title: 'The State and Revolution', title_zh: '国家与革命', year: 1917 },
    ],
    influencedBy: ['marx', 'engels'],
    influenced: ['gramsci', 'lukacs'],
    coreIdeas: ['vanguard-party', 'imperialism', 'democratic-centralism'],
    hasNotes: false,
  },
  {
    id: 'luxemburg',
    name: 'Rosa Luxemburg',
    name_zh: '罗莎·卢森堡',
    born: 1871, died: 1919,
    latitude: 50.2649, longitude: 23.5472,
    region: 'poland',
    school: 'historical-materialism',
    keyWorks: [
      { title: 'The Accumulation of Capital', title_zh: '资本积累论', year: 1913 },
    ],
    influencedBy: ['marx', 'engels'],
    influenced: ['lukacs'],
    coreIdeas: ['spontaneous-revolution', 'imperialism', 'reform-or-revolution'],
    hasNotes: false,
  },
  {
    id: 'lukacs',
    name: 'György Lukács',
    name_zh: '卢卡奇',
    born: 1885, died: 1971,
    latitude: 47.4979, longitude: 19.0402,
    region: 'hungary',
    school: 'frankfurt-school',
    keyWorks: [
      { title: 'History and Class Consciousness', title_zh: '历史与阶级意识', year: 1923 },
    ],
    influencedBy: ['marx', 'hegel', 'lenin', 'luxemburg'],
    influenced: ['adorno', 'marcuse'],
    coreIdeas: ['reification', 'class-consciousness', 'totality'],
    hasNotes: false,
  },
  {
    id: 'gramsci',
    name: 'Antonio Gramsci',
    name_zh: '葛兰西',
    born: 1891, died: 1937,
    latitude: 40.1209, longitude: 9.0129,
    region: 'italy',
    school: 'historical-materialism',
    keyWorks: [
      { title: 'Prison Notebooks', title_zh: '狱中札记', year: 1948 },
    ],
    influencedBy: ['marx', 'lenin'],
    influenced: ['althusser'],
    coreIdeas: ['hegemony', 'organic-intellectual', 'civil-society'],
    hasNotes: false,
  },
  {
    id: 'adorno',
    name: 'Theodor W. Adorno',
    name_zh: '阿多诺',
    born: 1903, died: 1969,
    latitude: 50.1109, longitude: 8.6821,
    region: 'germany',
    school: 'frankfurt-school',
    keyWorks: [
      { title: 'Dialectic of Enlightenment', title_zh: '启蒙辩证法', year: 1947 },
      { title: 'Negative Dialectics', title_zh: '否定的辩证法', year: 1966 },
    ],
    influencedBy: ['marx', 'hegel', 'lukacs'],
    influenced: ['marcuse', 'habermas'],
    coreIdeas: ['culture-industry', 'negative-dialectics', 'identity-thinking'],
    hasNotes: false,
  },
  {
    id: 'adam-smith',
    name: 'Adam Smith',
    name_zh: '亚当·斯密',
    born: 1723, died: 1790,
    latitude: 56.1165, longitude: -3.3146,
    region: 'britain',
    school: 'political-economy',
    keyWorks: [
      { title: 'The Wealth of Nations', title_zh: '国富论', year: 1776 },
    ],
    influencedBy: [],
    influenced: ['marx', 'ricardo'],
    coreIdeas: ['division-of-labour', 'invisible-hand', 'labour-theory-of-value'],
    hasNotes: false,
  },
];
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add types, school colors, and seed thinker data"
```

---

### Task 3: Geo Utility

**Files:**
- Create: `src/utils/geo.ts`

- [ ] **Step 1: Write latitude/longitude to 3D coordinate converter**

Write `src/utils/geo.ts`:
```typescript
import * as THREE from 'three';

/**
 * Convert latitude/longitude (degrees) to a 3D position on a sphere of given radius.
 * Y-axis is up (north pole), XZ-plane is equatorial.
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = 1
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180); // polar angle: 0 at north pole, PI at south
  const theta = (lng + 180) * (Math.PI / 180); // azimuth: 0 at -180° lng

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Calculate the midpoint for an arc that rises above the sphere surface.
 * Takes two surface points and returns a control point at altitude > 1.
 */
export function midPoint(
  a: THREE.Vector3,
  b: THREE.Vector3,
  altitude: number = 0.3
): THREE.Vector3 {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(1 + altitude);
  return mid;
}

export const GLOBE_RADIUS = 1.5;
```

- [ ] **Step 2: Verify the math**

Run a quick Node.js check:
```bash
node -e "
const phi = (90-48.8)*(Math.PI/180);
const theta = (-180+9.2)*(Math.PI/180);
const x = -1.5*Math.sin(phi)*Math.cos(theta);
const y = 1.5*Math.cos(phi);
const z = 1.5*Math.sin(phi)*Math.sin(theta);
console.log({x,y,z,mag:Math.sqrt(x*x+y*y+z*z)});
"
```

Expected: `{ x: ..., y: ..., z: ..., mag: 1.5 }` (point lies on sphere of radius 1.5).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add lat/lng to 3D coordinate converter utility"
```

---

### Task 4: Graph Utility & Data Loading

**Files:**
- Create: `src/utils/graph.ts`
- Create: `src/hooks/useData.ts`

- [ ] **Step 1: Write connection builder**

Write `src/utils/graph.ts`:
```typescript
import { Thinker, Connection } from '../types';

export function buildConnections(thinkers: Thinker[]): Connection[] {
  const thinkerMap = new Map(thinkers.map(t => [t.id, t]));
  const connections: Connection[] = [];
  const seen = new Set<string>();

  for (const thinker of thinkers) {
    for (const targetId of thinker.influenced) {
      const target = thinkerMap.get(targetId);
      if (!target) {
        console.warn(`Unknown thinker slug "${targetId}" referenced by "${thinker.id}"`);
        continue;
      }
      const pairKey = [thinker.id, targetId].sort().join('->');
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);

      connections.push({
        id: `${thinker.id}->${targetId}`,
        from: thinker.id,
        to: targetId,
        fromLat: thinker.latitude,
        fromLng: thinker.longitude,
        toLat: target.latitude,
        toLng: target.longitude,
        school: thinker.school,
      });
    }
  }

  return connections;
}

export function filterThinkersByYear(
  thinkers: Thinker[],
  year: number
): Thinker[] {
  return thinkers.filter(t => t.born <= year);
}
```

- [ ] **Step 2: Write data loading hook**

Write `src/hooks/useData.ts`:
```typescript
import { useMemo } from 'react';
import { Thinker, Connection } from '../types';
import { SEED_THINKERS } from '../data/thinkers';
import { buildConnections, filterThinkersByYear } from '../utils/graph';

interface UseDataResult {
  allThinkers: Thinker[];
  connections: Connection[];
  filteredThinkers: Thinker[];
}

export function useData(timelineYear: number): UseDataResult {
  const allThinkers = SEED_THINKERS;
  const connections = useMemo(() => buildConnections(allThinkers), [allThinkers]);
  const filteredThinkers = useMemo(
    () => filterThinkersByYear(allThinkers, timelineYear),
    [allThinkers, timelineYear]
  );

  return { allThinkers, connections, filteredThinkers };
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add connection builder and data loading hook"
```

---

### Task 5: EarthSphere Component

**Files:**
- Create: `src/components/Globe/EarthSphere.tsx`

- [ ] **Step 1: Write EarthSphere — dark globe with grid lines**

Write `src/components/Globe/EarthSphere.tsx`:
```typescript
import { useRef } from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../../utils/geo';

export function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Procedurally generate a dark Earth with grid lines
  // We use two spheres: a dark base + a wireframe overlay
  return (
    <group>
      {/* Dark base sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshBasicMaterial color="#0d2847" transparent opacity={0.9} />
      </mesh>
      {/* Subtle grid lines overlay */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.002, 48, 24]} />
        <meshBasicMaterial
          color="#1a3a5c"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add dark Earth sphere with wireframe grid"
```

---

### Task 6: Atmosphere Component

**Files:**
- Create: `src/components/Globe/Atmosphere.tsx`

- [ ] **Step 1: Write Atmosphere — edge glow effect**

Write `src/components/Globe/Atmosphere.tsx`:
```typescript
import { useRef } from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../../utils/geo';

export function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[GLOBE_RADIUS * 1.15, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={/* glsl */ `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vNormal = normalize(mat3(modelMatrix) * normal);
            vPosition = worldPos.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float intensity = 1.0 - abs(dot(vNormal, viewDir));
            intensity = pow(intensity, 3.0);
            gl_FragColor = vec4(0.31, 0.76, 0.97, intensity * 0.35); // #4fc3f7 glow
          }
        `}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add atmosphere glow shader around globe edge"
```

---

### Task 7: ThinkerNode Component

**Files:**
- Create: `src/components/Globe/ThinkerNode.tsx`

- [ ] **Step 1: Write ThinkerNode — glowing sphere at thinker location**

Write `src/components/Globe/ThinkerNode.tsx`:
```typescript
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { Sphere, Html } from '@react-three/drei';
import { Thinker } from '../../types';
import { SCHOOL_COLORS } from '../../data/schools';
import { latLngToVector3, GLOBE_RADIUS } from '../../utils/geo';

interface ThinkerNodeProps {
  thinker: Thinker;
  isDeceased: boolean;
  onClick: (thinker: Thinker) => void;
}

export function ThinkerNode({ thinker, isDeceased, onClick }: ThinkerNodeProps) {
  const [hovered, setHovered] = useState(false);
  const position = latLngToVector3(thinker.latitude, thinker.longitude, GLOBE_RADIUS);
  const color = SCHOOL_COLORS[thinker.school] || '#4fc3f7';
  const size = 0.04 + (thinker.influenced.length * 0.005); // larger = more influence

  return (
    <group position={position}>
      {/* Glow ring */}
      <Sphere args={[size * 2.5, 16, 16]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.25 : 0.1}
          depthWrite={false}
        />
      </Sphere>

      {/* Main node sphere */}
      <Sphere
        args={[size, 16, 16]}
        onClick={(e) => {
          e.stopPropagation();
          onClick(thinker);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isDeceased ? 0.4 : 0.9}
        />
      </Sphere>

      {/* Hover label */}
      {hovered && (
        <Html distanceFactor={8} center style={{ pointerEvents: 'none' }}>
          <div style={{
            color: '#fff',
            fontSize: '11px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '0 0 8px rgba(0,0,0,0.8)',
            lineHeight: 1.3,
          }}>
            <div style={{ fontWeight: 'bold' }}>{thinker.name_zh}</div>
            <div style={{ color: '#aaccdd', fontSize: '10px' }}>
              {thinker.name} · {thinker.born}–{thinker.died}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add thinker node component with glow and hover label"
```

---

### Task 8: ConnectionLines Component

**Files:**
- Create: `src/components/Globe/ConnectionLines.tsx`

- [ ] **Step 1: Write ConnectionLines — arc curves between thinkers**

Write `src/components/Globe/ConnectionLines.tsx`:
```typescript
import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { Connection } from '../../types';
import { SCHOOL_COLORS } from '../../data/schools';
import { latLngToVector3, midPoint, GLOBE_RADIUS } from '../../utils/geo';

interface ConnectionLinesProps {
  connections: Connection[];
}

export function ConnectionLines({ connections }: ConnectionLinesProps) {
  return (
    <group>
      {connections.map((conn) => {
        const from = latLngToVector3(conn.fromLat, conn.fromLng, GLOBE_RADIUS);
        const to = latLngToVector3(conn.toLat, conn.toLng, GLOBE_RADIUS);
        const mid = midPoint(from, to, 0.4);

        // Quadratic Bezier: from → mid(control) → to
        const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
        const points = curve.getPoints(50);
        const color = SCHOOL_COLORS[conn.school] || '#4fc3f7';

        return (
          <Line
            key={conn.id}
            points={points}
            color={color}
            lineWidth={0.5}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add arc connection lines between related thinkers"
```

---

### Task 9: GlobeScene — 3D Canvas Assembly

**Files:**
- Create: `src/components/Globe/GlobeScene.tsx`

- [ ] **Step 1: Write GlobeScene — combine all 3D elements**

Write `src/components/Globe/GlobeScene.tsx`:
```typescript
import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EarthSphere } from './EarthSphere';
import { Atmosphere } from './Atmosphere';
import { ThinkerNode } from './ThinkerNode';
import { ConnectionLines } from './ConnectionLines';
import { Thinker, Connection } from '../../types';

interface GlobeSceneProps {
  thinkers: Thinker[];
  connections: Connection[];
  timelineYear: number;
  selectedThinker: Thinker | null;
  onSelectThinker: (thinker: Thinker) => void;
}

function GlobeContent({ thinkers, connections, timelineYear, selectedThinker, onSelectThinker }: GlobeSceneProps) {
  const controlsRef = useRef<any>(null);

  return (
    <>
      {/* Background stars */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Globe elements */}
      <EarthSphere />
      <Atmosphere />

      {/* Connection arcs */}
      <ConnectionLines connections={connections} />

      {/* Thinker nodes */}
      {thinkers.map((thinker) => (
        <ThinkerNode
          key={thinker.id}
          thinker={thinker}
          isDeceased={thinker.died < timelineYear}
          onClick={onSelectThinker}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        minDistance={2}
        maxDistance={6}
        target={[0, 0, 0]}
        enablePan={false}
      />
    </>
  );
}

export function GlobeScene(props: GlobeSceneProps) {
  return (
    <Canvas
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 1.5, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <GlobeContent {...props} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: assemble 3D globe scene with stars, earth, nodes, and arcs"
```

---

### Task 10: AppContext — State Management

**Files:**
- Create: `src/context/AppContext.tsx`

- [ ] **Step 1: Write React Context for global state**

Write `src/context/AppContext.tsx`:
```typescript
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Thinker } from '../types';

interface AppContextType {
  timelineYear: number;
  setTimelineYear: (year: number) => void;
  selectedThinker: Thinker | null;
  setSelectedThinker: (t: Thinker | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const INITIAL_YEAR = 1850;

export function AppProvider({ children }: { children: ReactNode }) {
  const [timelineYear, setTimelineYear] = useState(INITIAL_YEAR);
  const [selectedThinker, setSelectedThinker] = useState<Thinker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppContext.Provider
      value={{
        timelineYear,
        setTimelineYear,
        selectedThinker,
        setSelectedThinker,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be inside AppProvider');
  return ctx;
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add AppContext for global state (timeline, selection, search)"
```

---

### Task 11: DetailPanel Component

**Files:**
- Create: `src/components/UI/DetailPanel.tsx`

- [ ] **Step 1: Write DetailPanel — slide-in detail card**

Write `src/components/UI/DetailPanel.tsx`:
```typescript
import { Thinker } from '../../types';
import { SCHOOL_COLORS, SCHOOL_LABELS } from '../../data/schools';

interface DetailPanelProps {
  thinker: Thinker | null;
  onClose: () => void;
  onThinkerClick: (id: string) => void;
  allThinkers: Thinker[];
}

export function DetailPanel({ thinker, onClose, onThinkerClick, allThinkers }: DetailPanelProps) {
  if (!thinker) return null;

  const color = SCHOOL_COLORS[thinker.school] || '#4fc3f7';
  const schoolLabel = SCHOOL_LABELS[thinker.school];

  const getThinkerById = (id: string) => allThinkers.find(t => t.id === id);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '340px',
      height: '100%',
      background: '#0d1a2d',
      borderLeft: '1px solid #1a3a5c',
      color: '#aaccdd',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      zIndex: 10,
      overflowY: 'auto',
      animation: 'slideIn 0.3s ease-out',
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'none', border: 'none', color: '#667788',
          cursor: 'pointer', fontSize: 18,
        }}
      >
        ✕
      </button>

      <div style={{ padding: '24px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: color, flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
              {thinker.name}
            </div>
            <div style={{ fontSize: 14, color: '#667788' }}>
              {thinker.name_zh} · {thinker.born}–{thinker.died}
            </div>
          </div>
        </div>

        {/* School & Region */}
        <div style={{ fontSize: 12, color: '#8899aa', marginBottom: 16 }}>
          📍 {schoolLabel?.zh || thinker.school} · {thinker.region}
        </div>

        {/* Core Ideas */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#667788', marginBottom: 6, textTransform: 'uppercase' }}>
            Core Ideas
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {thinker.coreIdeas.map((idea) => (
              <span key={idea} style={{
                fontSize: 11,
                background: `${color}22`,
                color: color,
                padding: '2px 8px',
                borderRadius: 10,
              }}>
                {idea}
              </span>
            ))}
          </div>
        </div>

        {/* Key Works */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#667788', marginBottom: 6, textTransform: 'uppercase' }}>
            Key Works
          </div>
          {thinker.keyWorks.map((work) => (
            <div key={work.title} style={{ fontSize: 12, marginBottom: 4, color: '#aaccdd' }}>
              📖 {work.title_zh} ({work.year})
            </div>
          ))}
        </div>

        {/* Influenced By */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#667788', marginBottom: 6, textTransform: 'uppercase' }}>
            ← Influenced By
          </div>
          {thinker.influencedBy.map((id) => {
            const t = getThinkerById(id);
            if (!t) return null;
            return (
              <div
                key={id}
                onClick={() => onThinkerClick(id)}
                style={{
                  fontSize: 12, color: SCHOOL_COLORS[t.school] || '#4fc3f7',
                  cursor: 'pointer', marginBottom: 2, padding: '2px 4px',
                  borderRadius: 4, transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2a3d')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                → {t.name_zh} ({t.name})
              </div>
            );
          })}
          {thinker.influencedBy.length === 0 && (
            <div style={{ fontSize: 11, color: '#556677' }}>None (original thinker)</div>
          )}
        </div>

        {/* Influenced */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#667788', marginBottom: 6, textTransform: 'uppercase' }}>
            Influenced →
          </div>
          {thinker.influenced.map((id) => {
            const t = getThinkerById(id);
            if (!t) return null;
            return (
              <div
                key={id}
                onClick={() => onThinkerClick(id)}
                style={{
                  fontSize: 12, color: SCHOOL_COLORS[t.school] || '#4fc3f7',
                  cursor: 'pointer', marginBottom: 2, padding: '2px 4px',
                  borderRadius: 4, transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2a3d')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                → {t.name_zh} ({t.name})
              </div>
            );
          })}
          {thinker.influenced.length === 0 && (
            <div style={{ fontSize: 11, color: '#556677' }}>None</div>
          )}
        </div>

        {/* Notes link */}
        <div style={{
          marginTop: 16, paddingTop: 12,
          borderTop: '1px solid #1a3a5c',
          fontSize: 11, color: '#667788',
        }}>
          {thinker.hasNotes ? '📝 Notes available' : '📝 No notes yet'}
        </div>
      </div>

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add detail panel with thinker info and relationship links"
```

---

### Task 12: Timeline Component

**Files:**
- Create: `src/components/UI/Timeline.tsx`

- [ ] **Step 1: Write Timeline — bottom year slider with cumulative mode**

Write `src/components/UI/Timeline.tsx`:
```typescript
import { useState, useCallback } from 'react';

interface TimelineProps {
  year: number;
  onChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export function Timeline({ year, onChange, minYear = 1700, maxYear = 2020 }: TimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (prev) return false;

      // Start playback
      const startYear = year < maxYear ? year : minYear;
      let current = startYear;
      const interval = setInterval(() => {
        current += speed;
        if (current >= maxYear) {
          current = maxYear;
          clearInterval(interval);
          setIsPlaying(false);
        }
        onChange(current);
      }, 100 / speed);
      return true;
    });
  }, [year, speed, minYear, maxYear, onChange]);

  const marks = [1700, 1800, 1850, 1900, 1950, 2000];

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'min(700px, 85vw)',
      background: 'rgba(13, 26, 45, 0.92)',
      border: '1px solid #1a3a5c',
      borderRadius: 8,
      padding: '12px 20px 16px',
      color: '#aaccdd',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      zIndex: 10,
    }}>
      {/* Year display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{Math.round(year)}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Speed indicator */}
          <span
            style={{ fontSize: 10, color: '#556677', cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setSpeed((s) => (s % 5) + 1)}
            title="Click to change speed"
          >
            {speed}×
          </span>
          {/* Play button */}
          <button
            onClick={togglePlay}
            style={{
              background: isPlaying ? '#ff7043' : '#1a3a5c',
              border: '1px solid #334455',
              borderRadius: 4,
              color: '#fff',
              padding: '2px 8px',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* Slider */}
      <div style={{ position: 'relative', height: 24, display: 'flex', alignItems: 'center' }}>
        {/* Track */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, height: 2,
          background: '#1a3a5c',
          borderRadius: 1,
        }} />
        {/* Progress fill */}
        <div style={{
          position: 'absolute',
          left: 0,
          width: `${((year - minYear) / (maxYear - minYear)) * 100}%`,
          height: 2,
          background: '#4fc3f7',
          borderRadius: 1,
        }} />
        {/* Input */}
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute',
            left: 0, right: 0,
            width: '100%',
            height: 24,
            WebkitAppearance: 'none',
            background: 'transparent',
            cursor: 'pointer',
            margin: 0,
          }}
        />
      </div>

      {/* Year markers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {marks.map((m) => (
          <span
            key={m}
            onClick={() => onChange(m)}
            style={{
              fontSize: 10,
              color: Math.abs(year - m) < 10 ? '#4fc3f7' : '#556677',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {m}
          </span>
        ))}
      </div>

      {/* Custom range input styles */}
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #4fc3f7;
          border: 2px solid #0a0a1a;
          cursor: pointer;
          margin-top: -6px;
        }
        input[type='range']::-webkit-slider-runnable-track {
          height: 2px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add timeline slider with cumulative mode and play button"
```

---

### Task 13: SearchBar Component

**Files:**
- Create: `src/components/UI/SearchBar.tsx`

- [ ] **Step 1: Write SearchBar — type-to-search with fly-to**

Write `src/components/UI/SearchBar.tsx`:
```typescript
import { useState, useMemo } from 'react';
import { Thinker } from '../../types';

interface SearchBarProps {
  thinkers: Thinker[];
  onSelect: (thinker: Thinker) => void;
  query: string;
  onQueryChange: (q: string) => void;
}

export function SearchBar({ thinkers, onSelect, query, onQueryChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (query.length < 1) return [];
    const q = query.toLowerCase();
    return thinkers
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.name_zh.includes(query) ||
          t.coreIdeas.some((idea) => idea.includes(q))
      )
      .slice(0, 8);
  }, [query, thinkers]);

  const showDropdown = focused && query.length >= 1;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '380px',
      zIndex: 20,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="🔍 搜索人物、著作、思想..."
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'rgba(13, 26, 45, 0.92)',
            border: '1px solid #1a3a5c',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />

        {/* Dropdown results */}
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0, right: 0,
            marginTop: 4,
            background: '#0d1a2d',
            border: '1px solid #1a3a5c',
            borderRadius: 8,
            overflow: 'hidden',
            maxHeight: 320,
            overflowY: 'auto',
          }}>
            {results.length === 0 ? (
              <div style={{ padding: 16, color: '#667788', fontSize: 13, textAlign: 'center' }}>
                No results found
              </div>
            ) : (
              results.map((t) => (
                <div
                  key={t.id}
                  onMouseDown={() => {
                    onSelect(t);
                    onQueryChange('');
                  }}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #1a3a5c',
                    transition: 'background 0.15s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2a3d')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ color: '#fff', fontSize: 13 }}>{t.name_zh}</div>
                    <div style={{ color: '#667788', fontSize: 11 }}>{t.name} · {t.born}–{t.died}</div>
                  </div>
                  <div style={{ color: '#556677', fontSize: 11 }}>{t.school}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add search bar with dropdown results"
```

---

### Task 14: App Assembly

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Assemble all components in App.tsx**

Write `src/App.tsx`:
```tsx
import { useCallback } from 'react';
import { GlobeScene } from './components/Globe/GlobeScene';
import { SearchBar } from './components/UI/SearchBar';
import { Timeline } from './components/UI/Timeline';
import { DetailPanel } from './components/UI/DetailPanel';
import { AppProvider, useAppContext } from './context/AppContext';
import { useData } from './hooks/useData';
import { Thinker } from './types';

function AppContent() {
  const {
    timelineYear, setTimelineYear,
    selectedThinker, setSelectedThinker,
    searchQuery, setSearchQuery,
  } = useAppContext();

  const { allThinkers, connections, filteredThinkers } = useData(timelineYear);

  const handleSelectThinker = useCallback((thinker: Thinker) => {
    setSelectedThinker(thinker);
  }, [setSelectedThinker]);

  const handleThinkerClick = useCallback((id: string) => {
    const thinker = allThinkers.find((t) => t.id === id);
    if (thinker) {
      setSelectedThinker(thinker);
    }
  }, [allThinkers, setSelectedThinker]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* 3D Globe */}
      <GlobeScene
        thinkers={filteredThinkers}
        connections={connections}
        timelineYear={timelineYear}
        selectedThinker={selectedThinker}
        onSelectThinker={handleSelectThinker}
      />

      {/* Search Bar */}
      <SearchBar
        thinkers={allThinkers}
        onSelect={handleSelectThinker}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      {/* Timeline */}
      <Timeline
        year={timelineYear}
        onChange={setTimelineYear}
      />

      {/* Detail Panel */}
      <DetailPanel
        thinker={selectedThinker}
        onClose={() => setSelectedThinker(null)}
        onThinkerClick={handleThinkerClick}
        allThinkers={allThinkers}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
```

- [ ] **Step 2: Update main.tsx to use the global CSS**

Modify `src/main.tsx` — verify it imports `./index.css`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 3: Ensure index.css has the slide-in animation and font setup**

Verify `src/index.css`:
```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #root { width: 100%; height: 100%; overflow: hidden; }
body {
  background: #0a0a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif;
}
```

- [ ] **Step 4: Install a missing dependency (drei Stars requires postprocessing in some versions, but basic drei Stars works standalone)**

Run: `npm run dev`

Expected: Vite dev server starts. Open http://localhost:5173.

Verify:
- Dark globe with atmosphere glow is visible
- 10 thinker nodes appear as colored spheres (at timeline year 1850, ~4-5 thinkers visible)
- Hover shows name labels
- Arc lines connect related thinkers
- Clicking a node opens detail panel on the right
- Timeline slider at bottom changes visible nodes
- Search bar finds thinkers

- [ ] **Step 5: Fix any TypeScript or runtime errors**

Run: `npm run build`

Expected: Clean build with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: assemble MVP — globe, nodes, connections, detail panel, timeline, search"
```

---

### Post-MVP Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] Globe renders with dark theme and atmosphere glow
- [ ] All seed thinker nodes appear (adjusted by timeline year)
- [ ] Hovering a node shows floating label with name and dates
- [ ] Arc connection lines between related thinkers (e.g., Hegel → Marx → Lenin)
- [ ] Clicking a node opens detail panel from the right
- [ ] Detail panel shows: name, dates, school, core ideas, key works, relationships
- [ ] Clicking a relationship name in detail panel selects that thinker
- [ ] Timeline slider filters nodes (e.g., slide to 1750 shows fewer nodes)
- [ ] Play button auto-advances the timeline
- [ ] Search bar finds thinkers by Chinese name, English name, or idea keyword
- [ ] Selecting a search result selects the corresponding node
- [ ] No console errors or React warnings
- [ ] `npm run build` succeeds with zero errors
