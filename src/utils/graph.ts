import type { Thinker, Connection } from '../types';

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

    connections.push({
      id: `${fromId}->${toId}`,
      from: fromId,
      to: toId,
      fromLat: from.latitude,
      fromLng: from.longitude,
      toLat: to.latitude,
      toLng: to.longitude,
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
