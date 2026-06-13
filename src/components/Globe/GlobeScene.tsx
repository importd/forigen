import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EarthSphere } from './EarthSphere';
import { Atmosphere } from './Atmosphere';
import { ThinkerNode } from './ThinkerNode';
import { ConnectionLines } from './ConnectionLines';
import type { Thinker, Connection } from '../../types';

interface GlobeSceneProps {
  thinkers: Thinker[];
  connections: Connection[];
  timelineYear: number;
  selectedThinker: Thinker | null;
  onSelectThinker: (thinker: Thinker) => void;
}

function GlobeContent({ thinkers, connections, timelineYear, onSelectThinker }: GlobeSceneProps) {
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
