import { useMemo } from 'react';
import type { Thinker, Connection } from '../types';
import { SEED_THINKERS } from '../data/thinkers';
import { useAppContext } from '../context/AppContext';
import { buildConnections, filterThinkersByYear } from '../utils/graph';

interface UseDataResult {
  allThinkers: Thinker[];
  connections: Connection[];
  filteredThinkers: Thinker[];
}

export function useData(timelineYear: number): UseDataResult {
  const { customThinkers } = useAppContext();

  const allThinkers = useMemo(
    () => [...SEED_THINKERS, ...customThinkers],
    [customThinkers]
  );

  const allConnections = useMemo(
    () => buildConnections(allThinkers),
    [allThinkers]
  );

  const filteredThinkers = useMemo(
    () => filterThinkersByYear(allThinkers, timelineYear),
    [allThinkers, timelineYear]
  );

  // Only show connections where both thinkers have been "born" at this year
  const connections = useMemo(() => {
    const visibleIds = new Set(filteredThinkers.map(t => t.id));
    return allConnections.filter(conn => visibleIds.has(conn.from) && visibleIds.has(conn.to));
  }, [allConnections, filteredThinkers]);

  return { allThinkers, connections, filteredThinkers };
}
