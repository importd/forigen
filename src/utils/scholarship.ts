import type { Thinker } from '../types';

/**
 * Historical phase classification for Western Marxist thought.
 */
export interface Phase {
  zh: string;
}

const PHASES: { maxYear: number; phase: Phase }[] = [
  { maxYear: 476, phase: { zh: '古希腊罗马哲学' } },
  { maxYear: 1500, phase: { zh: '中世纪基督教哲学' } },
  { maxYear: 1789, phase: { zh: '16-18世纪西欧哲学' } },
  { maxYear: 1830, phase: { zh: '德国古典哲学' } },
  { maxYear: 1848, phase: { zh: '古典马克思主义形成期' } },
  { maxYear: 1883, phase: { zh: '古典马克思主义成熟期' } },
  { maxYear: 1917, phase: { zh: '第二国际时期' } },
  { maxYear: 1945, phase: { zh: '西方马克思主义兴起' } },
  { maxYear: 1968, phase: { zh: '战后新左派与结构主义' } },
  { maxYear: 1989, phase: { zh: '晚期资本主义批判' } },
  { maxYear: 9999, phase: { zh: '全球化时代马克思主义' } },
];

export function getHistoricalPhase(born: number, _died: number): Phase {
  const active = born + 40;
  for (const { maxYear, phase } of PHASES) {
    if (active <= maxYear) return phase;
  }
  return PHASES[PHASES.length - 1].phase;
}

/**
 * Academic identity tags — Chinese only.
 */
const SCHOOL_IDENTITIES: Record<string, string[]> = {
  'german-idealism': ['哲学家', '观念论者'],
  'historical-materialism': ['哲学家', '革命家', '经济学家'],
  'frankfurt-school': ['社会哲学家', '批判理论家'],
  'structural-marxism': ['马克思主义理论家', '结构主义者'],
  'existentialist-marxism': ['存在主义哲学家', '马克思主义者'],
  'analytical-marxism': ['分析哲学家', '政治理论家'],
  'leninism': ['革命家', '政治理论家'],
  'eco-marxism': ['生态马克思主义者', '环境社会学家'],
  'political-economy': ['政治经济学家', '古典经济学家'],
  'utopian-socialism': ['空想社会主义者', '社会改革家'],
  'dialectical-synthesis': ['辩证法理论家'],
};

export function getAcademicIdentity(thinker: Thinker): string[] {
  return SCHOOL_IDENTITIES[thinker.school] || ['思想家'];
}

/**
 * Active period description — Chinese only.
 */
export function getActivePeriod(born: number, died: number): string {
  const half = Math.ceil((died - born) / 2);
  const mid = born + half;

  const c = Math.floor(mid / 100);
  const zhCentury = `${c}世纪`;

  const quarter = Math.floor((mid % 100) / 25);
  const parts = ['早期', '中期', '中后期', '晚期'];
  const zhPart = parts[Math.min(quarter, 3)];

  return `${zhCentury}${zhPart}`;
}

export { getSchoolTheories } from '../data/schoolTheories';
