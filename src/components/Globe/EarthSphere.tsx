import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../../utils/geo';

function createSepiaCanvas(): HTMLCanvasElement {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext('2d')!;

  // Warm parchment base
  ctx.fillStyle = '#d4b896';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grain / noise overlay
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 30;
    imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + noise));
    imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + noise));
    imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + noise - 10));
  }
  ctx.putImageData(imageData, 0, 0);

  // Faint latitude bands
  ctx.strokeStyle = 'rgba(139,111,78,0.15)';
  ctx.lineWidth = 0.5;
  for (let lat = -80; lat <= 80; lat += 10) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Faint longitude bands
  for (let lng = -170; lng <= 170; lng += 10) {
    const x = ((lng + 180) / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Darken edges for vignette effect (polar regions)
  const vignette = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width * 0.35,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.7,
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(1, 'rgba(80,40,20,0.3)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
}

export function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  const sepiaTexture = useMemo(() => {
    const canvas = createSepiaCanvas();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapU = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <group>
      {/* Sepia-tinted antique earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 128, 64]} />
        <meshStandardMaterial
          map={sepiaTexture}
          roughness={1.0}
          metalness={0.0}
          color={new THREE.Color('#c8b898')}
        />
      </mesh>

      {/* Brass longitude/latitude grid overlay */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.003, 48, 24]} />
        <meshBasicMaterial
          color="#8b6f4e"
          wireframe
          transparent
          opacity={0.10}
        />
      </mesh>

      {/* Warm ambient back-shadow — tints the unlit hemisphere */}
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
