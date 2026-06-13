import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Thinker } from '../types';
import { autoSchoolColor } from '../data/schools';
import type { IdeaDetail } from '../data/ideaDetails';
import type { TheoryModule } from '../data/schoolTheories';

const NOTES_KEY = 'forigen-notes';
const CUSTOM_KEY = 'forigen-custom-thinkers';
const LABELS_KEY = 'forigen-custom-labels';
const IDEA_DETAILS_KEY = 'forigen-custom-idea-details';
const SCHOOL_THEORIES_KEY = 'forigen-custom-school-theories';
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
  color?: string;  // optional school color from MD frontmatter
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
  customIdeaDetails: Record<string, IdeaDetail>;
  mergeIdeaDetails: (details: Record<string, IdeaDetail>) => void;
  customSchoolTheories: Record<string, TheoryModule[]>;
  mergeSchoolTheories: (theories: Record<string, TheoryModule[]>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [timelineYear, setTimelineYear] = useState(INITIAL_YEAR);
  const [selectedThinker, setSelectedThinker] = useState<Thinker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>(() => loadJSON(NOTES_KEY, {}));
  const [customThinkers, setCustomThinkers] = useState<Thinker[]>(() => loadJSON(CUSTOM_KEY, []));
  const [customLabels, setCustomLabels] = useState<CustomLabels>(() => loadJSON(LABELS_KEY, EMPTY_LABELS));
  const [customIdeaDetails, setCustomIdeaDetails] = useState<Record<string, IdeaDetail>>(() => loadJSON(IDEA_DETAILS_KEY, {}));
  const [customSchoolTheories, setCustomSchoolTheories] = useState<Record<string, TheoryModule[]>>(() => loadJSON(SCHOOL_THEORIES_KEY, {}));

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
      const mergedSchools = { ...prev.schools };
      for (const [slug, entry] of Object.entries(incoming.schools)) {
        mergedSchools[slug] = {
          ...prev.schools[slug],
          ...entry,
          // Keep existing color, or use incoming color, or auto-assign
          color: prev.schools[slug]?.color || entry.color || autoSchoolColor(slug),
        };
      }
      const next: CustomLabels = {
        schools: mergedSchools,
        regions: { ...prev.regions, ...incoming.regions },
        ideas: { ...prev.ideas, ...incoming.ideas },
      };
      saveJSON(LABELS_KEY, next);
      return next;
    });
  }, []);

  const mergeIdeaDetails = useCallback((incoming: Record<string, IdeaDetail>) => {
    setCustomIdeaDetails((prev) => {
      const next = { ...prev, ...incoming };
      saveJSON(IDEA_DETAILS_KEY, next);
      return next;
    });
  }, []);

  const mergeSchoolTheories = useCallback((incoming: Record<string, TheoryModule[]>) => {
    setCustomSchoolTheories((prev) => {
      const next = { ...prev };
      for (const [school, theories] of Object.entries(incoming)) {
        const existing = prev[school] || [];
        const slugs = new Set(existing.map((t) => t.slug));
        const newTheories = theories.filter((t) => !slugs.has(t.slug));
        if (newTheories.length > 0) {
          next[school] = [...existing, ...newTheories];
        }
      }
      saveJSON(SCHOOL_THEORIES_KEY, next);
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
    customIdeaDetails, mergeIdeaDetails,
    customSchoolTheories, mergeSchoolTheories,
  }), [timelineYear, selectedThinker, searchQuery, notes, getNote, setNote, hasNote, customThinkers, upsertCustomThinker, customLabels, mergeLabels, customIdeaDetails, mergeIdeaDetails, customSchoolTheories, mergeSchoolTheories]);

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
