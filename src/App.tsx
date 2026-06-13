import { useCallback, useMemo } from 'react';
import { GlobeScene } from './components/Globe/GlobeScene';
import { SearchBar } from './components/UI/SearchBar';
import { Timeline } from './components/UI/Timeline';
import { DetailPanel } from './components/UI/DetailPanel';
import { DataToolbar } from './components/UI/DataToolbar';
import { AppProvider, useAppContext } from './context/AppContext';
import { useData } from './hooks/useData';
import type { Thinker } from './types';

function AppContent() {
  const {
    timelineYear, setTimelineYear,
    selectedThinker, setSelectedThinker,
    searchQuery, setSearchQuery,
    hasNote,
  } = useAppContext();

  const { allThinkers, connections, filteredThinkers } = useData(timelineYear);

  // When a thinker is selected, only show their connections
  const displayConnections = useMemo(() => {
    if (!selectedThinker) return connections;
    return connections.filter(
      conn => conn.from === selectedThinker.id || conn.to === selectedThinker.id
    );
  }, [connections, selectedThinker]);

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
      {/* 3D Globe */}
      <GlobeScene
        thinkers={filteredThinkers}
        connections={displayConnections}
        timelineYear={timelineYear}
        selectedThinker={selectedThinker}
        onSelectThinker={handleSelectThinker}
        onDeselect={handleDeselect}
        hasNote={hasNote}
      />

{/* Search Bar */}
      <SearchBar
        thinkers={allThinkers}
        onSelect={handleSelectThinker}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />

      {/* Data backup (bottom-left) */}
      <DataToolbar thinkers={allThinkers} />

      {/* Timeline */}
      <Timeline
        year={timelineYear}
        onChange={setTimelineYear}
        thinkerCount={filteredThinkers.length}
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
