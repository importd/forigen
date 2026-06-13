import { useState, useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Thinker } from '../../types';
import { SCHOOL_COLORS } from '../../data/schools';
import { latLngToVector3, GLOBE_RADIUS } from '../../utils/geo';

const REF_DISTANCE = 4.0;
const NODE_MIN = 0.35;     // node can shrink a lot (distinguish countries)
const NODE_MAX = 2.2;
const LABEL_MIN = 0.6;     // label has higher floor (always readable)

interface ThinkerNodeProps {
  thinker: Thinker;
  isDeceased: boolean;
  hasNotes: boolean;
  onClick: (thinker: Thinker) => void;
}

export function ThinkerNode({ thinker, isDeceased, hasNotes, onClick }: ThinkerNodeProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const { camera } = useThree();

  const position = latLngToVector3(thinker.latitude, thinker.longitude, GLOBE_RADIUS);
  const color = SCHOOL_COLORS[thinker.school] || '#4fc3f7';

  const coreRadius = 0.025 + (thinker.influenced.length * 0.003);
  const innerGlowRadius = coreRadius * 2.2;
  const outerGlowRadius = coreRadius * 3.8;

  const noRaycast = useCallback((el: any) => {
    if (el) el.raycast = () => {};
  }, []);

  // Dynamic scaling: nodes and labels grow when far, shrink when near.
  // Labels auto-show when zoomed in close enough (nodes spread out → no overlap).
  useFrame(() => {
    if (!groupRef.current) return;
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);
    const dist = camera.position.distanceTo(worldPos);
    const nodeScale = Math.max(NODE_MIN, Math.min(NODE_MAX, dist / REF_DISTANCE));
    const labelScale = Math.max(LABEL_MIN, Math.min(NODE_MAX, dist / REF_DISTANCE));

    groupRef.current.scale.setScalar(nodeScale);

    if (labelRef.current) {
      labelRef.current.style.transform = `scale(${labelScale})`;
      // Show label when zoomed in (camera close) or when hovering
      labelRef.current.style.display = (hovered || dist < 2.6) ? 'block' : 'none';
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Note indicator ring — warm golden pulse for nodes with notes */}
      {hasNotes && (
        <mesh ref={noRaycast}>
          <sphereGeometry args={[hovered ? outerGlowRadius * 1.6 : outerGlowRadius * 1.1, 32, 32]} />
          <meshBasicMaterial
            color="#ffd54f"
            transparent
            opacity={hovered ? 0.35 : 0.15}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Outer glow — no raycast */}
      <mesh ref={noRaycast}>
        <sphereGeometry args={[hovered ? outerGlowRadius * 1.4 : outerGlowRadius, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.28 : 0.08}
          depthWrite={false}
        />
      </mesh>

      {/* Inner glow — no raycast */}
      <mesh ref={noRaycast}>
        <sphereGeometry args={[innerGlowRadius, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.45 : 0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Core clickable sphere */}
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

      {/* Label — always rendered, visibility toggled by zoom level via useFrame */}
      <Html
        position={[0, coreRadius * 4.0, 0]}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={labelRef}
          style={{
            color: '#fff',
            fontSize: '10px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '0 0 10px rgba(0,0,0,0.9)',
            lineHeight: 1.3,
            pointerEvents: 'none',
            display: 'none',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{thinker.name_zh}</div>
          <div style={{ color: '#aaccdd', fontSize: '10px' }}>
            {thinker.name} · {thinker.born}–{thinker.died}
          </div>
        </div>
      </Html>
    </group>
  );
}
