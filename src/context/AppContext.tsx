import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Thinker } from '../types';

const NOTES_KEY = 'forigen-notes';
const INITIAL_YEAR = 1850;

function loadNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveNotes(notes: Record<string, string>) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
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
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [timelineYear, setTimelineYear] = useState(INITIAL_YEAR);
  const [selectedThinker, setSelectedThinker] = useState<Thinker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>(loadNotes);

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
      saveNotes(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    timelineYear, setTimelineYear,
    selectedThinker, setSelectedThinker,
    searchQuery, setSearchQuery,
    notes, getNote, setNote, hasNote,
  }), [timelineYear, selectedThinker, searchQuery, notes, getNote, setNote, hasNote]);

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
