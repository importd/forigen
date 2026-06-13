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
  altitude: number = 0.3
): THREE.Vector3 {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(1 + altitude);
  return mid;
}

export const GLOBE_RADIUS = 1.5;
