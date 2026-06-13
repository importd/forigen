import { useMemo } from 'react';
import type { Thinker, Connection } from '../types';
import { SEED_THINKERS } from '../data/thinkers';
import { buildConnections, filterThinkersByYear } from '../utils/graph';

interface UseDataResult {
  allThinkers: Thinker[];
  connections: Connection[];
  filteredThinkers: Thinker[];
}

export function useData(timelineYear: number): UseDataResult {
  const allThinkers = SEED_THINKERS;
  const connections = useMemo(() => buildConnections(allThinkers), [allThinkers]);
  const filteredThinkers = useMemo(
    () => filterThinkersByYear(allThinkers, timelineYear),
    [allThinkers, timelineYear]
  );

  return { allThinkers, connections, filteredThinkers };
}
