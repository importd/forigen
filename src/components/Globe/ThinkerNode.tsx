import { useState, useCallback, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Thinker } from '../../types';
import { getSchoolColor } from '../../data/schools';
import { latLngToVector3, GLOBE_RADIUS, jitterCoords } from '../../utils/geo';

const REF_DISTANCE = 4.0;
const NODE_MIN = 0.15;
const NODE_MAX = 1.8;

interface ThinkerNodeProps {
  thinker: Thinker;
  isDeceased: boolean;
  hasNotes: boolean;
  onClick: (thinker: Thinker) => void;
  highlighted?: boolean;
  dimmed?: boolean;
  selected?: boolean;
}

export function ThinkerNode({ thinker, isDeceased, onClick, highlighted, dimmed, selected }: ThinkerNodeProps) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const { camera } = useThree();

  const color = getSchoolColor(thinker.school);
  const coreRadius = 0.02 + (thinker.influenced.length * 0.002);
  const pinHeight = coreRadius * 5;

  // Deterministic position jitter — spreads pins at identical coordinates apart in 3D.
  const jitteredPosition = useMemo(() => {
    const { lat, lng } = jitterCoords(thinker.id, thinker.latitude, thinker.longitude);
    return latLngToVector3(lat, lng, GLOBE_RADIUS * 1.01);
  }, [thinker.id, thinker.latitude, thinker.longitude]);

  // Quaternion to rotate the local Y axis to align with the surface normal
  const pinQuaternion = useMemo(() => {
    const normal = jitteredPosition.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    return q;
  }, [jitteredPosition]);

  const noRaycast = useCallback((el: any) => {
    if (el) el.raycast = () => {};
  }, []);

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
      labelRef.current.style.display = (selected || highlighted || (!dimmed && (hovered || dist < 3.2))) ? 'block' : 'none';
    }
  });

  const pinHeadY = pinHeight / 2;

  return (
    <group ref={groupRef} position={jitteredPosition}>
      {/* --- Pin base glow — size/opacity reflects state --- */}
      <mesh ref={noRaycast}>
        <sphereGeometry args={[coreRadius * (selected ? 4 : highlighted ? 3 : 2.5), 24, 24]} />
        <meshBasicMaterial
          color={selected ? '#9e2a2b' : color}
          transparent
          opacity={dimmed ? 0.01 : (selected ? 0.55 : (highlighted ? 0.35 : (hovered ? 0.25 : 0.12)))}
          depthWrite={false}
        />
      </mesh>

      {/* --- Pin stem + head, oriented outward along the surface normal --- */}
      <group quaternion={pinQuaternion}>
        {/* Pin stem — thin vertical line from globe surface outward */}
        <mesh ref={noRaycast}>
          <cylinderGeometry args={[0.003, 0.003, pinHeight, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={dimmed ? 0.05 : 0.5}
            depthWrite={false}
          />
        </mesh>

        {/* Pin head — small colored dot at the tip */}
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
          position={[0, pinHeadY, 0]}
        >
          <sphereGeometry args={[coreRadius, 12, 12]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={dimmed ? 0.15 : (isDeceased ? 0.55 : 0.9)}
            depthWrite={false}
          />
        </mesh>
        {/* Label positioned above the pin head, oriented outward */}
        <Html
          position={[0, pinHeight + coreRadius * 2.5, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            ref={labelRef}
            style={{
              fontFamily: "'Georgia', 'Noto Serif SC', serif",
              color: selected ? '#9e2a2b' : (highlighted ? color : '#3a2a1a'),
              fontSize: selected ? '9px' : '8px',
              fontStyle: 'italic',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              lineHeight: 1.3,
              pointerEvents: 'none',
              display: 'none',
              textShadow: selected
                ? '0 0 6px rgba(242,237,228,1), 0 0 3px rgba(242,237,228,1), 0 0 1px rgba(242,237,228,1)'
                : '0 0 5px rgba(242,237,228,0.95), 0 0 2px rgba(242,237,228,0.9), 0 0 1px rgba(242,237,228,0.85)',
              padding: '0',
              fontWeight: selected ? 700 : 400,
            }}
          >
            <div style={{ fontWeight: selected ? 700 : 600, fontSize: selected ? '11px' : '10px' }}>{thinker.name_zh}</div>
            {selected && (
              <div style={{ fontSize: '7px', opacity: 0.7 }}>
                {thinker.name} · {thinker.born}–{thinker.died}
            </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}
