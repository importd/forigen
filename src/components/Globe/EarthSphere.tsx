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
      {/* Warm parchment fallback sphere (visible while map loads or if fails) */}
      {!mapTexture && (
        <mesh>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          <meshBasicMaterial color="#d4c098" />
        </mesh>
      )}

      {/* Main globe with map.png texture */}
      {mapTexture && (
        <mesh ref={meshRef}>
          <sphereGeometry args={[GLOBE_RADIUS, 128, 64]} />
          <meshBasicMaterial map={mapTexture} />
        </mesh>
      )}

      {/* Cartographic grid — latitude / longitude lines */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.003, 48, 24]} />
        <meshBasicMaterial
          color="#8b6f4e"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Warm ambient back-shadow */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.005, 64, 64]} />
        <meshStandardMaterial
          color="#c8b898"
          emissive="#6b4e3d"
          emissiveIntensity={0.25}
          side={THREE.BackSide}
          roughness={1.0}
          metalness={0.0}
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
