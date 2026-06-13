import { useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { GLOBE_RADIUS } from '../../utils/geo';

export function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const earthTexture = useTexture(import.meta.env.BASE_URL + 'textures/earth.jpg');

  return (
    <group>
      {/* Textured Earth sphere with dark tint */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 128, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>
      {/* Subtle grid lines overlay — lat/long reference */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.003, 48, 24]} />
        <meshBasicMaterial
          color="#1a3a5c"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
      {/* Dark atmosphere tint sphere (inner) */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.001, 64, 64]} />
        <meshBasicMaterial
          color="#0a1020"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
