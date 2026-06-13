import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Connection } from '../../types';
import { SCHOOL_COLORS } from '../../data/schools';
import { latLngToVector3, midPoint, GLOBE_RADIUS } from '../../utils/geo';

interface ConnectionLinesProps {
  connections: Connection[];
}

/** Animated dashed arc — dash offset slides along the curve to show influence direction. */
function FlowArc({ curve, color }: {
  curve: THREE.QuadraticBezierCurve3;
  color: string;
}) {
  const lineRef = useRef<any>(null);
  const points = useMemo(() => curve.getPoints(60), [curve]);

  useFrame((_, delta) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material;
    if (mat && mat.uniforms && mat.uniforms.dashOffset) {
      mat.uniforms.dashOffset.value -= delta * 0.08;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={1}
      dashed
      dashSize={0.03}
      gapSize={0.02}
      transparent
      opacity={0.6}
      depthWrite={false}
    />
  );
}

export function ConnectionLines({ connections }: ConnectionLinesProps) {
  const arcs = useMemo(() => {
    return connections.map((conn) => {
      const from = latLngToVector3(conn.fromLat, conn.fromLng, GLOBE_RADIUS);
      const to = latLngToVector3(conn.toLat, conn.toLng, GLOBE_RADIUS);
      const mid = midPoint(from, to, 0.35, GLOBE_RADIUS);
      const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
      return {
        id: conn.id,
        curve,
        color: SCHOOL_COLORS[conn.school] || '#4fc3f7',
      };
    });
  }, [connections]);

  return (
    <group>
      {arcs.map(({ id, curve, color }) => (
        <FlowArc key={id} curve={curve} color={color} />
      ))}
    </group>
  );
}
