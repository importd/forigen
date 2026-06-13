import { useState, useCallback } from 'react';
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

  // Small but visible — scales naturally with camera distance via perspective projection
  const coreRadius = 0.025 + (thinker.influenced.length * 0.003);
  const innerGlowRadius = coreRadius * 2.2;
  const outerGlowRadius = coreRadius * 3.8;

  // Disable raycasting on glow meshes so they don't block clicks on the core
  const noRaycast = useCallback((el: any) => {
    if (el) el.raycast = () => {};
  }, []);

  return (
    <group position={position}>
      {/* Outer glow — no raycast, decorative only */}
      <mesh ref={noRaycast}>
        <sphereGeometry args={[hovered ? outerGlowRadius * 1.4 : outerGlowRadius, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.28 : 0.08}
          depthWrite={false}
        />
      </mesh>

      {/* Inner glow — no raycast, decorative only */}
      <mesh ref={noRaycast}>
        <sphereGeometry args={[innerGlowRadius, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.45 : 0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Core clickable sphere — ONLY this receives pointer events */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(thinker);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[coreRadius, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isDeceased ? 0.35 : 0.95}
        />
      </mesh>

      {/* Hover label — positioned above the node, doesn't block clicks */}
      {hovered && (
        <Html
          position={[0, coreRadius * 3.5, 0]}
          distanceFactor={7}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            color: '#fff',
            fontSize: '11px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '0 0 10px rgba(0,0,0,0.9)',
            lineHeight: 1.3,
            pointerEvents: 'none',
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{thinker.name_zh}</div>
            <div style={{ color: '#aaccdd', fontSize: '10px' }}>
              {thinker.name} · {thinker.born}–{thinker.died}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
