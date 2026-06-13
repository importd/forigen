import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Thinker } from '../types';

const NOTES_KEY = 'forigen-notes';
const CUSTOM_KEY = 'forigen-custom-thinkers';
const LABELS_KEY = 'forigen-custom-labels';
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

export interface LabelEntry {
  en: string;
  zh: string;
}

export interface CustomLabels {
  schools: Record<string, LabelEntry>;
  regions: Record<string, LabelEntry>;
  ideas: Record<string, LabelEntry>;
}

const EMPTY_LABELS: CustomLabels = { schools: {}, regions: {}, ideas: {} };

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
  upsertCustomThinker: (thinker: Thinker) => void;
  customLabels: CustomLabels;
  mergeLabels: (labels: CustomLabels) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [timelineYear, setTimelineYear] = useState(INITIAL_YEAR);
  const [selectedThinker, setSelectedThinker] = useState<Thinker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>(() => loadJSON(NOTES_KEY, {}));
  const [customThinkers, setCustomThinkers] = useState<Thinker[]>(() => loadJSON(CUSTOM_KEY, []));
  const [customLabels, setCustomLabels] = useState<CustomLabels>(() => loadJSON(LABELS_KEY, EMPTY_LABELS));

  const getNote = useCallback((id: string) => notes[id] || '', [notes]);
  const hasNote = useCallback((id: string) => !!notes[id]?.trim(), [notes]);
  const setNote = useCallback((id: string, content: string) => {
    setNotes((prev) => {
      const next = { ...prev };
      if (content.trim()) { next[id] = content; } else { delete next[id]; }
      saveJSON(NOTES_KEY, next);
      return next;
    });
  }, []);

  const upsertCustomThinker = useCallback((thinker: Thinker) => {
    setCustomThinkers((prev) => {
      const idx = prev.findIndex((t) => t.id === thinker.id);
      const next = idx >= 0
        ? [...prev.slice(0, idx), thinker, ...prev.slice(idx + 1)]
        : [...prev, thinker];
      saveJSON(CUSTOM_KEY, next);
      return next;
    });
  }, []);

  const mergeLabels = useCallback((incoming: CustomLabels) => {
    setCustomLabels((prev) => {
      const next: CustomLabels = {
        schools: { ...prev.schools, ...incoming.schools },
        regions: { ...prev.regions, ...incoming.regions },
        ideas: { ...prev.ideas, ...incoming.ideas },
      };
      saveJSON(LABELS_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    timelineYear, setTimelineYear,
    selectedThinker, setSelectedThinker,
    searchQuery, setSearchQuery,
    notes, getNote, setNote, hasNote,
    customThinkers, upsertCustomThinker,
    customLabels, mergeLabels,
  }), [timelineYear, selectedThinker, searchQuery, notes, getNote, setNote, hasNote, customThinkers, upsertCustomThinker, customLabels, mergeLabels]);

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
