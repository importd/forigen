import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Thinker } from '../types';

const NOTES_KEY = 'forigen-notes';
const CUSTOM_KEY = 'forigen-custom-thinkers';
const INITIAL_YEAR = 1850;

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

interface AppContextType {
  timelineYear: number;
  setTimelineYear: (year: number) => void;
  selectedThinker: Thinker | null;
  setSelectedThinker: (t: Thinker | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notes: Record<string, string>;
  getNote: (id: string) => string;
  setNote: (id: string, content: string) => void;
  hasNote: (id: string) => boolean;
  customThinkers: Thinker[];
  addCustomThinker: (thinker: Thinker) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [timelineYear, setTimelineYear] = useState(INITIAL_YEAR);
  const [selectedThinker, setSelectedThinker] = useState<Thinker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>(() => loadJSON(NOTES_KEY, {}));
  const [customThinkers, setCustomThinkers] = useState<Thinker[]>(() => loadJSON(CUSTOM_KEY, []));

  const getNote = useCallback((id: string) => notes[id] || '', [notes]);
  const hasNote = useCallback((id: string) => !!notes[id]?.trim(), [notes]);
  const setNote = useCallback((id: string, content: string) => {
    setNotes((prev) => {
      const next = { ...prev };
      if (content.trim()) {
        next[id] = content;
      } else {
        delete next[id];
      }
      saveJSON(NOTES_KEY, next);
      return next;
    });
  }, []);

  const addCustomThinker = useCallback((thinker: Thinker) => {
    setCustomThinkers((prev) => {
      // Don't duplicate
      if (prev.some((t) => t.id === thinker.id)) return prev;
      const next = [...prev, thinker];
      saveJSON(CUSTOM_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    timelineYear, setTimelineYear,
    selectedThinker, setSelectedThinker,
    searchQuery, setSearchQuery,
    notes, getNote, setNote, hasNote,
    customThinkers, addCustomThinker,
  }), [timelineYear, selectedThinker, searchQuery, notes, getNote, setNote, hasNote, customThinkers, addCustomThinker]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be inside AppProvider');
  return ctx;
}
