export interface KeyWork {
  title: string;
  title_zh: string;
  year: number;
}

export interface Thinker {
  id: string;
  name: string;
  name_zh: string;
  born: number;
  died: number;
  latitude: number;
  longitude: number;
  region: string;
  school: string;
  keyWorks: KeyWork[];
  influencedBy: string[];
  influenced: string[];
  coreIdeas: string[];
  hasNotes: boolean;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  school: string;
}

export interface SchoolColors {
  [schoolId: string]: string;
}

export interface AppState {
  allThinkers: Thinker[];
  connections: Connection[];
  selectedThinker: Thinker | null;
  timelineYear: number;
  searchQuery: string;
}
