import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Connection } from '../../types';
import { getSchoolColor } from '../../data/schools';
import { latLngToVector3, midPoint, GLOBE_RADIUS } from '../../utils/geo';

const SEGMENT_COUNT = 12;  // points in the flowing segment
const SEGMENT_LENGTH = 0.08; // how much of the curve the segment covers (0–1)
const FADE_NEAR = 2.4;    // camera distance where lines start fading in
const FADE_FAR = 3.2;     // camera distance where lines are fully transparent

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
    const t = ((clock.elapsedTime * 0.15) % 1);

    // Sample segment points along the curve
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const tt = t + (i / (SEGMENT_COUNT - 1)) * SEGMENT_LENGTH;
      const p = curve.getPoint(Math.min(tt, 1));
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    }

    lineRef.current.geometry.attributes.position.needsUpdate = true;
    lineRef.current.material.opacity = 0.9 * zoomRef.current;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={SEGMENT_COUNT}
          array={positions}
          itemSize={3}
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
      lineRef.current.material.opacity = 0.3 * zoomRef.current;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={0.8}
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
      return {
        id: conn.id,
        points,
        curve,
        color: getSchoolColor(conn.school),
      };
    });
  }, [connections]);

  return (
    <group>
      {arcs.map(({ id, points, curve, color }) => (
        <group key={id}>
          {/* Solid dim line — fades with zoom */}
          <SolidArc points={points} color={color} zoomRef={zoomRef} />
          {/* Bright segment sliding along the curve → shows direction, also fades */}
          <FlowSegment curve={curve} color={color} zoomRef={zoomRef} />
        </group>
      ))}
    </group>
  );
}
