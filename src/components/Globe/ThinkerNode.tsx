import { useState, useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Thinker } from '../../types';
import { getSchoolColor } from '../../data/schools';
import { latLngToVector3, GLOBE_RADIUS } from '../../utils/geo';

const REF_DISTANCE = 4.0;
const NODE_MIN = 0.15;     // tiny dot when zoomed in close
const NODE_MAX = 1.8;

interface ThinkerNodeProps {
  thinker: Thinker;
  isDeceased: boolean;
  hasNotes: boolean;
  onClick: (thinker: Thinker) => void;
  highlighted?: boolean;
  dimmed?: boolean;
}

export function ThinkerNode({ thinker, isDeceased, hasNotes, onClick, highlighted, dimmed }: ThinkerNodeProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const { camera } = useThree();

  const position = latLngToVector3(thinker.latitude, thinker.longitude, GLOBE_RADIUS);
  const color = getSchoolColor(thinker.school);

  const coreRadius = 0.025 + (thinker.influenced.length * 0.003);

  // Ink-dot layer radii
  const bleedRadius = coreRadius * 3.5;
  const spreadRadius = coreRadius * 2.2;
  const inkCoreRadius = coreRadius;

  // Highlighted boost
  const hiBleedMult = highlighted ? 1.6 : 1;
  const hiSpreadMult = highlighted ? 1.5 : 1;

  const noRaycast = useCallback((el: any) => {
    if (el) el.raycast = () => {};
  }, []);

  // Distance-based scaling: dot grows when far (stays visible), shrinks when near.
  // Label inversely scaled — bigger when zoomed in, smaller when zoomed out.
  useFrame(() => {
    if (!groupRef.current) return;
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);
    const dist = camera.position.distanceTo(worldPos);
    const nodeScale = Math.max(NODE_MIN, Math.min(NODE_MAX, dist / REF_DISTANCE));
    const labelScale = Math.min(1.8, Math.max(1.0, dist / 2.0));

    groupRef.current.scale.setScalar(nodeScale);

    if (labelRef.current) {
      labelRef.current.style.transform = `scale(${labelScale})`;
      labelRef.current.style.display = (highlighted || (!dimmed && (hovered || dist < 2.6))) ? 'block' : 'none';
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* --- Note indicator: red stamp ring --- */}
      {hasNotes && (
        <mesh ref={noRaycast}>
          <ringGeometry args={[
            (hovered ? bleedRadius * hiBleedMult * 1.3 : bleedRadius * hiBleedMult * 0.9),
            (hovered ? bleedRadius * hiBleedMult * 1.6 : bleedRadius * hiBleedMult * 1.1),
            48
          ]} />
          <meshBasicMaterial
            color="#9e2a2b"
            transparent
            opacity={hovered ? 0.55 : 0.22}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* --- Dark dashed-feel ring for highlighted (selected) state --- */}
      {highlighted && (
        <mesh ref={noRaycast}>
          <ringGeometry args={[
            bleedRadius * hiBleedMult * 1.1,
            bleedRadius * hiBleedMult * 1.25,
            64
          ]} />
          <meshBasicMaterial
            color="#1a1a1a"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* --- Ink bleed (largest halo) --- */}
      <mesh ref={noRaycast}>
        <sphereGeometry args={[bleedRadius * hiBleedMult, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.005 : (highlighted ? 0.22 : (hovered ? 0.16 : 0.10))}
          depthWrite={false}
        />
      </mesh>

      {/* --- Ink spread (medium halo) --- */}
      <mesh ref={noRaycast}>
        <sphereGeometry args={[spreadRadius * hiSpreadMult, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.01 : (highlighted ? 0.35 : (hovered ? 0.26 : 0.18))}
          depthWrite={false}
        />
      </mesh>

      {/* --- Ink core (solid dot, clickable) --- */}
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
        <sphereGeometry args={[inkCoreRadius, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.25 : (highlighted ? 0.85 : (isDeceased ? 0.45 : 0.75))}
        />
      </mesh>

      {/* --- Label: italic Georgia/serif, handwritten feel --- */}
      <Html
        position={[0, coreRadius * 4.0, 0]}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={labelRef}
          style={{
            fontFamily: "'Georgia', 'Noto Serif SC', serif",
            color: highlighted ? '#9e2a2b' : '#5a4a3a',
            fontSize: '9px',
            fontStyle: 'italic',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            lineHeight: 1.35,
            pointerEvents: 'none',
            display: 'none',
            backgroundColor: highlighted ? 'rgba(242, 237, 228, 0.9)' : 'transparent',
            padding: highlighted ? '1px 6px' : '0',
            borderBottom: highlighted ? '1px solid #9e2a2b' : 'none',
            borderRadius: highlighted ? '2px' : '0',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{thinker.name_zh}</div>
          <div style={{ fontSize: '8px', opacity: 0.75 }}>
            {thinker.name} · {thinker.born}–{thinker.died}
          </div>
        </div>
      </Html>
    </group>
  );
}
