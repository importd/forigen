import type { Thinker, Connection } from '../types';
import { jitterCoords } from './geo';

export function buildConnections(thinkers: Thinker[]): Connection[] {
  const thinkerMap = new Map(thinkers.map(t => [t.id, t]));
  const connections: Connection[] = [];
  const seen = new Set<string>();

  const addConnection = (fromId: string, toId: string) => {
    const from = thinkerMap.get(fromId);
    const to = thinkerMap.get(toId);
    if (!from || !to) return;
    const pairKey = [fromId, toId].sort().join('->');
    if (seen.has(pairKey)) return;
    seen.add(pairKey);

    const fromJ = jitterCoords(from.id, from.latitude, from.longitude);
    const toJ = jitterCoords(to.id, to.latitude, to.longitude);
    connections.push({
      id: `${fromId}->${toId}`,
      from: fromId,
      to: toId,
      fromLat: fromJ.lat,
      fromLng: fromJ.lng,
      toLat: toJ.lat,
      toLng: toJ.lng,
      school: from.school,
    });
  };

  for (const thinker of thinkers) {
    // "I influenced them" — forward direction (from thinker.influenced)
    for (const targetId of thinker.influenced) {
      if (!thinkerMap.has(targetId)) {
        console.warn(`Unknown thinker slug "${targetId}" referenced by "${thinker.id}"`);
        continue;
      }
      addConnection(thinker.id, targetId);
    }

    // "They influenced me" — reverse direction (from thinker.influencedBy)
    for (const sourceId of thinker.influencedBy) {
      if (!thinkerMap.has(sourceId)) continue; // silent — thinker may be added later
      addConnection(sourceId, thinker.id);
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
