import type { Thinker, Connection } from '../types';

export function buildConnections(thinkers: Thinker[]): Connection[] {
  const thinkerMap = new Map(thinkers.map(t => [t.id, t]));
  const connections: Connection[] = [];
  const seen = new Set<string>();

  for (const thinker of thinkers) {
    for (const targetId of thinker.influenced) {
      const target = thinkerMap.get(targetId);
      if (!target) {
        console.warn(`Unknown thinker slug "${targetId}" referenced by "${thinker.id}"`);
        continue;
      }
      const pairKey = [thinker.id, targetId].sort().join('->');
      if (seen.has(pairKey)) continue;
      seen.add(pairKey);

      connections.push({
        id: `${thinker.id}->${targetId}`,
        from: thinker.id,
        to: targetId,
        fromLat: thinker.latitude,
        fromLng: thinker.longitude,
        toLat: target.latitude,
        toLng: target.longitude,
        school: thinker.school,
      });
    }
  }

  return connections;
}

export function filterThinkersByYear(
  thinkers: Thinker[],
  year: number
): Thinker[] {
  return thinkers.filter(t => t.born <= year);
}
