import { useState } from 'react';
import { Html } from '@react-three/drei';
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
  // Larger base size — these are world units on a sphere of radius 1.5
  const baseSize = 0.06 + (thinker.influenced.length * 0.008);
  const glowSize = baseSize * 3.0;
  const hoverGlowSize = baseSize * 4.5;

  return (
    <group position={position}>
      {/* Outer glow ring — larger, subtle */}
      <mesh>
        <sphereGeometry args={[hovered ? hoverGlowSize : glowSize, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Mid glow ring */}
      <mesh>
        <sphereGeometry args={[baseSize * 2.0, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.4 : 0.18}
          depthWrite={false}
        />
      </mesh>

      {/* Main node sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(thinker);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[baseSize, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isDeceased ? 0.35 : 0.95}
        />
      </mesh>

      {/* Hover label — only visible when hovered */}
      {hovered && (
        <Html
          position={[0, baseSize * 1.8, 0]}
          distanceFactor={6}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            color: '#fff',
            fontSize: '12px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '0 0 10px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.9)',
            lineHeight: 1.3,
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{thinker.name_zh}</div>
            <div style={{ color: '#aaccdd', fontSize: '11px' }}>
              {thinker.name} · {thinker.born}–{thinker.died}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
