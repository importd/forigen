import { useCallback, useMemo, useState } from 'react';
import { GlobeScene } from './components/Globe/GlobeScene';
import { SearchBar } from './components/UI/SearchBar';
import { Timeline } from './components/UI/Timeline';
import { DetailPanel } from './components/UI/DetailPanel';
import { DataToolbar } from './components/UI/DataToolbar';
import { TopicPanel } from './components/UI/TopicPanel';
import { SchoolPanel } from './components/UI/SchoolPanel';
import { EraTimeline } from './components/UI/EraTimeline';
import { PaperOverlay } from './components/UI/PaperOverlay';
import { AppProvider, useAppContext } from './context/AppContext';
import { useData } from './hooks/useData';
import { TOPICS } from './data/topics';
import type { Thinker } from './types';

function AppContent() {
  const {
    timelineYear, setTimelineYear,
    selectedThinker, setSelectedThinker,
    searchQuery, setSearchQuery,
    hasNote, selectedTopic,
  } = useAppContext();

  const { allThinkers, connections, filteredThinkers } = useData(timelineYear);

  // Auto-detect year range from thinkers
  const { minYear, maxYear } = useMemo(() => {
    if (allThinkers.length === 0) return { minYear: 1700, maxYear: 2026 };
    const borns = allThinkers.map((t) => t.born);
    const fullMin = Math.min(...borns);
    return { minYear: fullMin, maxYear: 2026 };
  }, [allThinkers]);

  // Count thinkers active by each era end (using mid-career year)
  const thinkerCountByEra = useMemo(() => {
    const counts: Record<number, number> = {};
    const eraEnds = [-322, 476, 1500, 1781, 1840, 1883, 1917, 1945, 1968, 2026];
    for (const end of eraEnds) {
      counts[end] = allThinkers.filter((t) => {
        const mid = t.died > 0 ? Math.round((t.born + t.died) / 2) : t.born + 40;
        return mid <= end;
      }).length;
    }
    return counts;
  }, [allThinkers]);

  const handleSelectEra = useCallback((endYear: number) => {
    setTimelineYear(endYear);
  }, [setTimelineYear]);

  // Era select: click to show only that era, click again to deselect
  const [selectedEra, setSelectedEra] = useState<{ start: number; end: number } | null>(null);
  const handleSelectEraToggle = useCallback((start: number, end: number) => {
    setSelectedEra((prev) => {
      if (prev && prev.start === start && prev.end === end) {
        return null; // deselect
      }
      return { start, end };
    });
  }, []);

  // Filter thinkers by selected era, otherwise by timeline year
  const displayThinkers = useMemo(() => {
    let base = selectedEra
      ? allThinkers.filter((t) => {
          const mid = t.died > 0 ? Math.round((t.born + t.died) / 2) : t.born + 40;
          return mid >= selectedEra.start && mid <= selectedEra.end;
        })
      : filteredThinkers;
    // When a thinker is selected, always include ALL directly connected thinkers
    if (selectedThinker) {
      const relatedIds = new Set<string>();
      for (const id of selectedThinker.influencedBy) { if (id) relatedIds.add(id); }
      for (const id of selectedThinker.influenced) { if (id) relatedIds.add(id); }
      for (const t of allThinkers) {
        if (t.influencedBy.includes(selectedThinker.id) || t.influenced.includes(selectedThinker.id)) {
          relatedIds.add(t.id);
        }
      }
      const existingIds = new Set(base.map((t) => t.id));
      const missing = allThinkers.filter((t) => relatedIds.has(t.id) && !existingIds.has(t.id));
      if (missing.length > 0) base = [...base, ...missing];
    }
    return base;
  }, [allThinkers, filteredThinkers, selectedEra, selectedThinker]);

  // When a thinker is selected, only show their connections
  const displayConnections = useMemo(() => {
    if (!selectedThinker) return connections;
    return connections.filter(
      conn => conn.from === selectedThinker.id || conn.to === selectedThinker.id
    );
  }, [connections, selectedThinker]);

  // Compute highlighted thinker IDs from selected topic/school, or selected thinker's relations
  const highlightedIds = useMemo(() => {
    // Selected thinker: highlight ALL directly connected thinkers
    if (selectedThinker) {
      const validIds = new Set(allThinkers.map((t) => t.id));
      const ids = new Set<string>([selectedThinker.id]);
      for (const id of selectedThinker.influencedBy) { if (id && validIds.has(id)) ids.add(id); }
      for (const id of selectedThinker.influenced) { if (id && validIds.has(id)) ids.add(id); }
      // Also include thinkers who reference the selected thinker
      for (const t of allThinkers) {
        if (t.influencedBy.includes(selectedThinker.id) || t.influenced.includes(selectedThinker.id)) {
          ids.add(t.id);
        }
      }
      return ids;
    }
    if (!selectedTopic) return undefined;
    // School selection: "school:slug"
    if (selectedTopic.startsWith('school:')) {
      const school = selectedTopic.slice(7);
      return new Set(allThinkers.filter((t) => t.school === school).map((t) => t.id));
    }
    // Topic selection
    const topic = TOPICS[selectedTopic];
    if (!topic) return undefined;
    return new Set(topic.stances.map((s) => s.thinkerId));
  }, [selectedTopic, allThinkers, selectedThinker]);

  const handleSelectThinker = useCallback((thinker: Thinker) => {
    setSelectedThinker(thinker);
  }, [setSelectedThinker]);

  const handleDeselect = useCallback(() => {
    setSelectedThinker(null);
  }, [setSelectedThinker]);

  const handleThinkerClick = useCallback((id: string) => {
    const thinker = allThinkers.find((t) => t.id === id);
    if (thinker) {
      setSelectedThinker(thinker);
    }
  }, [allThinkers, setSelectedThinker]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <PaperOverlay />
      {/* 3D Globe */}
      <GlobeScene
        thinkers={displayThinkers}
        connections={displayConnections}
        timelineYear={timelineYear}
        selectedThinker={selectedThinker}
        onSelectThinker={handleSelectThinker}
        onDeselect={handleDeselect}
        hasNote={hasNote}
        highlightedIds={highlightedIds}
      />

      {/* Core Topics Panel */}
      <TopicPanel thinkers={allThinkers} onThinkerClick={handleThinkerClick} />

      {/* School Panel (bottom-left) */}
      <SchoolPanel thinkers={allThinkers} onThinkerClick={handleThinkerClick} />

{/* Search Bar */}
      <SearchBar
        thinkers={allThinkers}
        onSelect={handleSelectThinker}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      {/* Data backup (bottom-left) */}
      <DataToolbar thinkers={allThinkers} />

      {/* Era timeline — macro genealogy bar */}
      <div style={{
        position: 'absolute',
        bottom: 130,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(720px, 88vw)',
        zIndex: 10,
      }}>
        <EraTimeline
          currentYear={timelineYear}
          onSelectEra={handleSelectEra}
          onSelectEraToggle={handleSelectEraToggle}
          selectedEra={selectedEra}
          thinkerCountByEra={thinkerCountByEra}
        />
      </div>

      {/* Timeline */}
      <Timeline
        year={timelineYear}
        onChange={setTimelineYear}
        thinkerCount={filteredThinkers.length}
        minYear={minYear}
        maxYear={maxYear}
      />

      {/* Detail Panel */}
      <DetailPanel
        thinker={selectedThinker}
        onClose={() => setSelectedThinker(null)}
        onThinkerClick={handleThinkerClick}
        allThinkers={allThinkers}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
