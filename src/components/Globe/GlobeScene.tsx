import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EarthSphere } from './EarthSphere';
import { Atmosphere } from './Atmosphere';
import { ThinkerNode } from './ThinkerNode';
import { ConnectionLines } from './ConnectionLines';
import { CountryBorders } from './CountryBorders';
import type { Thinker, Connection } from '../../types';

interface GlobeSceneProps {
  thinkers: Thinker[];
  connections: Connection[];
  timelineYear: number;
  selectedThinker: Thinker | null;
  onSelectThinker: (thinker: Thinker) => void;
  hasNote: (id: string) => boolean;
}

function GlobeContent({ thinkers, connections, timelineYear, onSelectThinker, hasNote }: GlobeSceneProps) {
  const controlsRef = useRef<any>(null);

  return (
    <>
      {/* Background stars */}
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

      {/* Lighting — ambient for dark-side visibility, directional for texture definition */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <directionalLight position={[-3, -1, -3]} intensity={0.25} />

      {/* Globe elements */}
      <EarthSphere />
      <Atmosphere />
      <CountryBorders />

      {/* Connection arcs */}
      <ConnectionLines connections={connections} />

      {/* Thinker nodes */}
      {thinkers.map((thinker) => (
        <ThinkerNode
          key={thinker.id}
          thinker={thinker}
          isDeceased={thinker.died < timelineYear}
          hasNotes={hasNote(thinker.id)}
          onClick={onSelectThinker}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        minDistance={1.6}
        maxDistance={8}
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
