import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Connection } from '../../types';
import { SCHOOL_COLORS } from '../../data/schools';
import { latLngToVector3, midPoint, GLOBE_RADIUS } from '../../utils/geo';

interface ConnectionLinesProps {
  connections: Connection[];
}

export function ConnectionLines({ connections }: ConnectionLinesProps) {
  return (
    <group>
      {connections.map((conn) => {
        const from = latLngToVector3(conn.fromLat, conn.fromLng, GLOBE_RADIUS);
        const to = latLngToVector3(conn.toLat, conn.toLng, GLOBE_RADIUS);
        const mid = midPoint(from, to, 0.4);

        const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone());
        const points = curve.getPoints(50);
        const color = SCHOOL_COLORS[conn.school] || '#4fc3f7';

        return (
          <Line
            key={conn.id}
            points={points}
            color={color}
            lineWidth={0.5}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        );
      })}
    </group>
  );
}
