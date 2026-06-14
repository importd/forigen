import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../../utils/geo';

export function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [mapTexture, setMapTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      import.meta.env.BASE_URL + 'textures/map.png',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        setMapTexture(texture);
      },
    );
  }, []);

  return (
    <group>
      {/* Base — solid warm parchment sphere ensures light color regardless of map */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshBasicMaterial color="#e8d8c0" />
      </mesh>

      {/* Map texture overlay — mostly opaque, subtle warm tint */}
      {mapTexture && (
        <mesh ref={meshRef}>
          <sphereGeometry args={[GLOBE_RADIUS * 1.001, 128, 64]} />
          <meshBasicMaterial map={mapTexture} color="#e8dcc8" transparent opacity={0.88} />
        </mesh>
      )}

      {/* Cartographic grid */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.004, 48, 24]} />
        <meshBasicMaterial
          color="#c8b898"
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>

      {/* Warm back-shadow */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.005, 64, 64]} />
        <meshStandardMaterial
          color="#e8dcc8"
          emissive="#c8b898"
          emissiveIntensity={0.12}
          side={THREE.BackSide}
          roughness={1.0}
          metalness={0.0}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
