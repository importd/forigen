import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
  onDeselect: () => void;
  hasNote: (id: string) => boolean;
  highlightedIds?: Set<string>;
}

function GlobeContent({ thinkers, connections, timelineYear, selectedThinker, onSelectThinker, hasNote, highlightedIds }: GlobeSceneProps) {
  const controlsRef = useRef<any>(null);

  return (
    <>
      {/* Warm lighting — paper-bright sepia tones */}
      <ambientLight intensity={0.8} color="#faf5ee" />
      <directionalLight position={[5, 3, 5]} intensity={0.9} color="#fff8ee" />
      <directionalLight position={[-3, -1, -3]} intensity={0.35} color="#e8dcc8" />

      {/* Globe elements */}
      <EarthSphere />
      <Atmosphere />
      <CountryBorders />

      {/* Connection arcs */}
      <ConnectionLines connections={connections} />

      {/* Thinker nodes */}
      {thinkers.map((thinker) => {
        const isHighlighted = highlightedIds?.has(thinker.id) ?? false;
        const isSelected = selectedThinker?.id === thinker.id;
        const isDimmed = highlightedIds && highlightedIds.size > 0 && !isHighlighted && !isSelected;
        return (
          <ThinkerNode
            key={thinker.id}
            thinker={thinker}
            isDeceased={thinker.died < timelineYear}
            hasNotes={hasNote(thinker.id)}
            onClick={onSelectThinker}
            highlighted={isHighlighted && !isSelected}
            dimmed={isDimmed}
            selected={isSelected}
          />
        );
      })}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        minDistance={0.9}
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
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      camera={{ position: [2.0, 2.2, -0.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={props.onDeselect}
    >
      <GlobeContent {...props} />
    </Canvas>
  );
}
