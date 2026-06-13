import { useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { latLngToVector3, GLOBE_RADIUS } from '../../utils/geo';

const BORDER_RADIUS = GLOBE_RADIUS * 1.006;

interface CountryBordersProps {
  dataUrl?: string;
}

export function CountryBorders({ dataUrl = import.meta.env.BASE_URL + 'data/countries.geojson' }: CountryBordersProps) {
  const [geojson, setGeojson] = useState<any>(null);

  useEffect(() => {
    fetch(dataUrl)
      .then((res) => res.json())
      .then((data) => setGeojson(data))
      .catch((err) => console.warn('Failed to load country borders:', err));
  }, [dataUrl]);

  const lines = useMemo(() => {
    if (!geojson) return [];

    const result: THREE.Line[] = [];

    for (const feature of geojson.features) {
      if (!feature.geometry) continue;

      const { type, coordinates } = feature.geometry;
      const rings: number[][][] = [];

      if (type === 'Polygon') {
        rings.push(...coordinates);
      } else if (type === 'MultiPolygon') {
        for (const polygon of coordinates) {
          rings.push(...polygon);
        }
      } else {
        continue;
      }

      for (const ring of rings) {
        const pts: number[] = [];

        for (const coord of ring) {
          const lng = coord[0];
          const lat = coord[1];
          const pos = latLngToVector3(lat, lng, BORDER_RADIUS);
          pts.push(pos.x, pos.y, pos.z);
        }

        if (pts.length >= 6) {
          const geom = new THREE.BufferGeometry();
          geom.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
          const mat = new THREE.LineBasicMaterial({
            color: '#2a5078',
            transparent: true,
            opacity: 0.45,
            depthTest: true,
            depthWrite: false,
          });
          result.push(new THREE.Line(geom, mat));
        }
      }
    }

    return result;
  }, [geojson]);

  return (
    <group>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}
