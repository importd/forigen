import * as THREE from 'three';

/**
 * Convert latitude/longitude (degrees) to a 3D position on a sphere of given radius.
 * Y-axis is up (north pole), XZ-plane is equatorial.
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = 1
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Calculate the midpoint for an arc that rises above the sphere surface.
 */
export function midPoint(
  a: THREE.Vector3,
  b: THREE.Vector3,
  altitude: number = 0.3,
  radius: number = 1.5
): THREE.Vector3 {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(radius * (1 + altitude));
  return mid;
}

export const GLOBE_RADIUS = 1.5;

/** Deterministic jitter (±0.3°) for thinkers sharing the same geo coordinates. */
export function jitterCoords(id: string, lat: number, lng: number): { lat: number; lng: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i) | 0;
  const jLat = (hash % 7 - 3) * 0.1;
  const jLng = ((hash >> 8) % 7 - 3) * 0.1;
  return { lat: lat + jLat, lng: lng + jLng };
}
