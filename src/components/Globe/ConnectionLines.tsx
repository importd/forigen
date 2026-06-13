import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Connection } from '../../types';
import { getSchoolColor } from '../../data/schools';
import { latLngToVector3, midPoint, GLOBE_RADIUS } from '../../utils/geo';

const BASE_OPACITY = 0.78;
const FADE_NEAR = 3.0;   // camera distance where lines become fully visible
const FADE_FAR = 6.5;    // camera distance where lines fully disappear

interface ConnectionLinesProps {
  connections: Connection[];
}

/** Animated dashed arc — dash offset slides along the curve, opacity fades with zoom. */
function FlowArc({ curve, color }: {
  curve: THREE.QuadraticBezierCurve3;
  color: string;
}) {
  const lineRef = useRef<any>(null);
  const points = useMemo(() => curve.getPoints(60), [curve]);
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material;
    if (!mat) return;

    // Animate dash offset for flow direction
    if (mat.uniforms?.dashOffset) {
      mat.uniforms.dashOffset.value -= delta * 0.08;
    }

    // Fade lines based on zoom: visible when close, hidden when far
    const dist = camera.position.length();
    const zoom = (dist - FADE_NEAR) / (FADE_FAR - FADE_NEAR);
    mat.opacity = BASE_OPACITY * (1 - Math.max(0, Math.min(1, zoom)));
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
      opacity={BASE_OPACITY}
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
        color: getSchoolColor(conn.school),
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
