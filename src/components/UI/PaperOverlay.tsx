// PaperOverlay.tsx — ensures paper texture renders over the 3D canvas too
import { useEffect, useRef } from 'react';

export function PaperOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(256, 256);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = Math.random() * 12;
      imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = noise;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    ref.current.style.backgroundImage = `url(${canvas.toDataURL()})`;
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9997,
        pointerEvents: 'none',
        opacity: 0.03,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
