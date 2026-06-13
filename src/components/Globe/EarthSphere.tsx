import { useRef } from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../../utils/geo';

export function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      {/* Dark base sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshBasicMaterial color="#0d2847" transparent opacity={0.9} />
      </mesh>
      {/* Subtle grid lines overlay */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.002, 48, 24]} />
        <meshBasicMaterial
          color="#1a3a5c"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}
