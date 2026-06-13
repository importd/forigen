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

/** Small glowing dot that travels along a Bezier curve to indicate influence direction. */
function FlowDot({ curve, color, phase }: {
  curve: THREE.QuadraticBezierCurve3;
  color: string;
  phase: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = ((clock.elapsedTime * 0.25 + phase) % 1);
    meshRef.current.position.copy(curve.getPoint(t));
  });

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <sphereGeometry args={[0.018, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export function ConnectionLines({ connections }: ConnectionLinesProps) {
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
        color: SCHOOL_COLORS[conn.school] || '#4fc3f7',
      };
    });
  }, [connections]);

  return (
    <group>
      {arcs.map(({ id, points, curve, color }) => (
        <group key={id}>
          {/* Thin static arc */}
          <Line
            points={points}
            color={color}
            lineWidth={0.8}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
          {/* Animated flow dots: source → target */}
          <FlowDot curve={curve} color={color} phase={0} />
          <FlowDot curve={curve} color={color} phase={0.33} />
          <FlowDot curve={curve} color={color} phase={0.66} />
        </group>
      ))}
    </group>
  );
}
