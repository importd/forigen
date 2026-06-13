import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Thinker } from '../types';

interface AppContextType {
  timelineYear: number;
  setTimelineYear: (year: number) => void;
  selectedThinker: Thinker | null;
  setSelectedThinker: (t: Thinker | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const INITIAL_YEAR = 1850;

export function AppProvider({ children }: { children: ReactNode }) {
  const [timelineYear, setTimelineYear] = useState(INITIAL_YEAR);
  const [selectedThinker, setSelectedThinker] = useState<Thinker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppContext.Provider
      value={{
        timelineYear,
        setTimelineYear,
        selectedThinker,
        setSelectedThinker,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be inside AppProvider');
  return ctx;
}
