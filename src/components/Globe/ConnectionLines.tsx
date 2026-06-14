import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Connection } from '../../types';
import { latLngToVector3, midPoint, GLOBE_RADIUS } from '../../utils/geo';
import { getSchoolColor } from '../../data/schools';

const SEGMENT_COUNT = 12;  // points in the flowing segment
const SEGMENT_LENGTH = 0.08; // how much of the curve the segment covers (0–1)
const FADE_NEAR = 2.8;    // camera distance where lines are fully visible
const FADE_FAR = 4.0;     // camera distance where lines are fully transparent

interface ConnectionLinesProps {
  connections: Connection[];
}

/** Shared zoom opacity hook — one ref for all arcs, updated once per frame. */
function useZoomOpacity(): React.MutableRefObject<number> {
  const zoomRef = useRef(1);
  const { camera } = useThree();

  useFrame(() => {
    const dist = camera.position.length();
    zoomRef.current = THREE.MathUtils.clamp(
      (FADE_FAR - dist) / (FADE_FAR - FADE_NEAR),
      0,
      1
    );
  });

  return zoomRef;
}

/** A short bright line segment that slides along the curve to show direction. */
function FlowSegment({ curve, color, zoomRef }: {
  curve: THREE.QuadraticBezierCurve3;
  color: string;
  zoomRef: React.MutableRefObject<number>;
}) {
  const lineRef = useRef<any>(null);
  const positions = useMemo(() => new Float32Array(SEGMENT_COUNT * 3), []);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    const t = ((clock.elapsedTime * 0.35) % 1);

    // Sample segment points along the curve
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const tt = t + (i / (SEGMENT_COUNT - 1)) * SEGMENT_LENGTH;
      const p = curve.getPoint(Math.min(tt, 1));
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    }

    lineRef.current.geometry.attributes.position.needsUpdate = true;
    lineRef.current.material.opacity = 0.8 * zoomRef.current;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={SEGMENT_COUNT}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
    </line>
  );
}

/** Solid dim arc whose opacity fades with zoom. */
function SolidArc({ points, color, zoomRef }: {
  points: THREE.Vector3[];
  color: string;
  zoomRef: React.MutableRefObject<number>;
}) {
  const lineRef = useRef<any>(null);

  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.45 * zoomRef.current;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={1.3}
      transparent
      opacity={0}
      depthWrite={false}
    />
  );
}

export function ConnectionLines({ connections }: ConnectionLinesProps) {
  const zoomRef = useZoomOpacity();

  const arcs = useMemo(() => {
    return connections.map((conn) => {
      const from = latLngToVector3(conn.fromLat, conn.fromLng, GLOBE_RADIUS);
      const to = latLngToVector3(conn.toLat, conn.toLng, GLOBE_RADIUS);
      const mid = midPoint(from, to, 0.35, GLOBE_RADIUS);
      const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
      const points = curve.getPoints(40);
      const sc = getSchoolColor(conn.school);
      return {
        id: conn.id,
        points,
        curve,
        solidColor: sc,           // dim solid arc — school color
        flowColor: '#ffcc80',     // warm amber flow — direction indicator
      };
    });
  }, [connections]);

  return (
    <group>
      {arcs.map(({ id, points, curve, solidColor, flowColor }) => (
        <group key={id}>
          <SolidArc points={points} color={solidColor} zoomRef={zoomRef} />
          <FlowSegment curve={curve} color={flowColor} zoomRef={zoomRef} />
        </group>
      ))}
    </group>
  );
}
