import type { Thinker } from '../types';

/**
 * Historical phase classification for Western Marxist thought.
 */
export interface Phase {
  zh: string;
  en: string;
}

const PHASES: { maxYear: number; phase: Phase }[] = [
  { maxYear: 1789, phase: { zh: '前启蒙时代', en: 'Pre-Enlightenment' } },
  { maxYear: 1830, phase: { zh: '德国观念论时期', en: 'German Idealism Period' } },
  { maxYear: 1848, phase: { zh: '古典马克思主义形成期', en: 'Classical Marxism Formation' } },
  { maxYear: 1883, phase: { zh: '古典马克思主义成熟期', en: 'Mature Classical Marxism' } },
  { maxYear: 1917, phase: { zh: '第二国际时期', en: 'Second International Period' } },
  { maxYear: 1945, phase: { zh: '西方马克思主义兴起', en: 'Rise of Western Marxism' } },
  { maxYear: 1968, phase: { zh: '战后新左派与结构主义', en: 'Postwar New Left & Structuralism' } },
  { maxYear: 1989, phase: { zh: '晚期资本主义批判', en: 'Late Capitalism Critique' } },
  { maxYear: 9999, phase: { zh: '全球化时代马克思主义', en: 'Globalization Era Marxism' } },
];

export function getHistoricalPhase(born: number, _died: number): Phase {
  const active = born + 40; // approximate peak activity
  for (const { maxYear, phase } of PHASES) {
    if (active <= maxYear) return phase;
  }
  return PHASES[PHASES.length - 1].phase;
}

/**
 * Academic identity tags based on thinker's school and ideas.
 */
const SCHOOL_IDENTITIES: Record<string, string[]> = {
  'german-idealism': ['哲学家', 'Philosopher', '观念论者', 'Idealist'],
  'historical-materialism': ['哲学家', 'Philosopher', '革命家', 'Revolutionary', '经济学家', 'Economist'],
  'frankfurt-school': ['社会哲学家', 'Social Philosopher', '批判理论家', 'Critical Theorist'],
  'structural-marxism': ['马克思主义理论家', 'Marxist Theorist', '结构主义者', 'Structuralist'],
  'existentialist-marxism': ['存在主义哲学家', 'Existentialist Philosopher', '马克思主义者', 'Marxist'],
  'analytical-marxism': ['分析哲学家', 'Analytic Philosopher', '政治理论家', 'Political Theorist'],
  'leninism': ['革命家', 'Revolutionary', '政治理论家', 'Political Theorist'],
  'eco-marxism': ['生态马克思主义者', 'Eco-Marxist', '环境社会学家', 'Environmental Sociologist'],
  'political-economy': ['政治经济学家', 'Political Economist', '古典经济学家', 'Classical Economist'],
  'utopian-socialism': ['空想社会主义者', 'Utopian Socialist', '社会改革家', 'Social Reformer'],
  'dialectical-synthesis': ['辩证法理论家', 'Dialectical Theorist'],
};

export function getAcademicIdentity(thinker: Thinker): string[] {
  return SCHOOL_IDENTITIES[thinker.school] || ['思想家', 'Thinker'];
}

/**
 * Active period description for the thinker.
 */
export function getActivePeriod(born: number, died: number): string {
  const half = Math.ceil((died - born) / 2);
  const mid = born + half;

  const centuryMap: Record<number, string> = {
    18: '18世纪', 19: '19世纪', 20: '20世纪', 21: '21世纪',
  };
  const centuryEn: Record<number, string> = {
    18: '18th Century', 19: '19th Century', 20: '20th Century', 21: '21st Century',
  };

  const c = Math.floor(mid / 100);
  const zhCentury = centuryMap[c] || `${c}世纪`;
  const enCentury = centuryEn[c] || `${c}th Century`;

  const quarter = Math.floor((mid % 100) / 25);
  const parts = ['早期', '中期', '中后期', '晚期'];
  const partsEn = ['Early', 'Mid', 'Late', 'Late'];
  const zhPart = parts[Math.min(quarter, 3)];
  const enPart = partsEn[Math.min(quarter, 3)];

  return `${zhCentury}${zhPart} · ${enPart} ${enCentury}`;
}

/**
 * Get the school's theories from the data file.
 * Re-exported from schoolTheories for convenience.
 */
export { getSchoolTheories } from '../data/schoolTheories';
