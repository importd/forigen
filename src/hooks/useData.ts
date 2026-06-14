import { useState, useEffect, useMemo, useRef } from 'react';
import type { Thinker, Connection } from '../types';
import { loadSeedThinkers } from '../data/loadThinkers';
import { useAppContext } from '../context/AppContext';
import { buildConnections, filterThinkersByYear } from '../utils/graph';

interface UseDataResult {
  allThinkers: Thinker[];
  connections: Connection[];
  filteredThinkers: Thinker[];
  loading: boolean;
}

export function useData(timelineYear: number): UseDataResult {
  const { customThinkers, mergeIdeaDetails, mergeSchoolTheories, mergeSeedNotes } = useAppContext();
  const [seedThinkers, setSeedThinkers] = useState<Thinker[]>([]);
  const [loading, setLoading] = useState(true);
  const merged = useRef(false);

  useEffect(() => {
    loadSeedThinkers().then(({ thinkers, ideaDetails, schoolTheories, notes }) => {
      setSeedThinkers(thinkers);
      if (!merged.current) {
        merged.current = true;
        if (Object.keys(ideaDetails).length > 0) mergeIdeaDetails(ideaDetails);
        if (Object.keys(schoolTheories).length > 0) mergeSchoolTheories(schoolTheories);
        if (Object.keys(notes).length > 0) mergeSeedNotes(notes);
      }
      setLoading(false);
    });
  }, [mergeIdeaDetails, mergeSchoolTheories, mergeSeedNotes]);

  const allThinkers = useMemo(
    () => [...seedThinkers, ...customThinkers],
    [seedThinkers, customThinkers]
  );

  const allConnections = useMemo(
    () => buildConnections(allThinkers),
    [allThinkers]
  );

  const filteredThinkers = useMemo(
    () => filterThinkersByYear(allThinkers, timelineYear),
    [allThinkers, timelineYear]
  );

  const connections = useMemo(() => {
    const visibleIds = new Set(filteredThinkers.map((t) => t.id));
    return allConnections.filter(
      (conn) => visibleIds.has(conn.from) && visibleIds.has(conn.to)
    );
  }, [allConnections, filteredThinkers]);

  return { allThinkers, connections, filteredThinkers, loading };
}
