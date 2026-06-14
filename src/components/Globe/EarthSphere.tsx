import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '../../utils/geo';

export function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [earthImage, setEarthImage] = useState<HTMLImageElement | null>(null);

  // Load the satellite earth image
  useMemo(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = import.meta.env.BASE_URL + 'textures/earth.jpg';
    img.onload = () => setEarthImage(img);
  }, []);

  const tintedTexture = useMemo(() => {
    if (!earthImage) return null;

    const canvas = document.createElement('canvas');
    const w = earthImage.width || 2048;
    const h = earthImage.height || 1024;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // 1. Parchment ocean base
    ctx.fillStyle = '#e0d0b0';
    ctx.fillRect(0, 0, w, h);

    // 2. Draw earth with alpha for land visibility
    ctx.globalAlpha = 0.85;
    ctx.drawImage(earthImage, 0, 0, w, h);
    ctx.globalAlpha = 1.0;

    // 3. Multiply blend for dark brown land
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = '#8b6e4e';
    ctx.fillRect(0, 0, w, h);

    // 4. Reset and apply sepia wash
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(180, 150, 110, 0.3)';
    ctx.fillRect(0, 0, w, h);

    // 5. Add subtle noise/grain for antique feel
    const imageData = ctx.getImageData(0, 0, w, h);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 18;
      imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + noise));
      imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + noise));
      imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + noise - 6));
    }
    ctx.putImageData(imageData, 0, 0);

    // 6. Antique latitude lines
    ctx.strokeStyle = 'rgba(139, 111, 78, 0.06)';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += h / 18) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 7. Vignette for polar regions
    const vignette = ctx.createRadialGradient(
      w / 2, h / 2, w * 0.35,
      w / 2, h / 2, w * 0.7,
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(80,40,20,0.25)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [earthImage]);

  // Fallback texture while image loads
  const fallbackTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#d4c098';
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle latitude lines
    ctx.strokeStyle = 'rgba(139,111,78,0.12)';
    ctx.lineWidth = 0.5;
    for (let lat = -80; lat <= 80; lat += 10) {
      const y = ((90 - lat) / 180) * 512;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  return (
    <group>
      {/* Antique globe with real continent shapes */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 128, 64]} />
        <meshStandardMaterial
          map={tintedTexture || fallbackTexture}
          roughness={1.0}
          metalness={0.0}
          color={new THREE.Color('#e0d0b0')}
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
