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
  marxConnection?: string;     // 与马克思主义的关联
  influenceEvidence?: string;  // 影响网络的文献证据
  influenceNotes?: Record<string, string>;  // 影响关系注释：thinkerId → 传承/批判内容简述
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
