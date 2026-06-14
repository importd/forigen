import { useRef } from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../../utils/geo';

export function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[GLOBE_RADIUS * 1.15, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={/* glsl */ `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vNormal = normalize(mat3(modelMatrix) * normal);
            vPosition = worldPos.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec3 vNormal;
          varying vec3 vPosition;

          vec3 sepiaWarmColor(float t) {
            return mix(
              vec3(0.82, 0.70, 0.55),
              vec3(0.60, 0.52, 0.42),
              t
            );
          }

          void main() {
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float intensity = 1.0 - abs(dot(vNormal, viewDir));
            intensity = pow(intensity, 2.5);
            float alpha = intensity * 0.28;
            vec3 color = sepiaWarmColor(intensity);
            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}
