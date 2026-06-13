import { useState } from 'react';
import { Sphere, Html } from '@react-three/drei';
import type { Thinker } from '../../types';
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
  const size = 0.04 + (thinker.influenced.length * 0.005);

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
