import type { SchoolColors } from '../types';

export const SCHOOL_COLORS: SchoolColors = {
  'german-idealism': '#42a5f5',
  'historical-materialism': '#ff7043',
  'frankfurt-school': '#66bb6a',
  'structural-marxism': '#ab47bc',
  'existentialist-marxism': '#ffa726',
  'analytical-marxism': '#26c6da',
  'leninism': '#ef5350',
  'eco-marxism': '#9ccc65',
  'political-economy': '#78909c',
  'utopian-socialism': '#ffca28',
  'dialectical-synthesis': '#e91e63',
};

/** Palette for auto-assigning colors to new schools from uploaded MD files. */
const AUTO_PALETTE = [
  '#ff7043', '#42a5f5', '#66bb6a', '#ab47bc', '#ffa726',
  '#26c6da', '#ef5350', '#9ccc65', '#ffca28', '#e91e63',
  '#7e57c2', '#ec407a', '#29b6f6', '#8d6e63', '#d4e157',
  '#00bcd4', '#ff5252', '#69f0ae', '#448aff', '#ffab40',
];

/** Deterministic auto-color for a school slug. */
export function autoSchoolColor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  return AUTO_PALETTE[Math.abs(hash) % AUTO_PALETTE.length];
}

/** Get the color for a school — hardcoded first, then custom labels from localStorage. */
export function getSchoolColor(school: string): string {
  if (SCHOOL_COLORS[school]) return SCHOOL_COLORS[school];
  try {
    const raw = localStorage.getItem('forigen-custom-labels');
    if (raw) {
      const labels = JSON.parse(raw);
      if (labels.schools?.[school]?.color) return labels.schools[school].color;
    }
  } catch { /* ignore */ }
  return AUTO_PALETTE[0];
}

export const SCHOOL_LABELS: Record<string, { en: string; zh: string }> = {
  'german-idealism': { en: 'German Idealism', zh: '德国观念论' },
  'historical-materialism': { en: 'Historical Materialism', zh: '历史唯物主义' },
  'frankfurt-school': { en: 'Frankfurt School', zh: '法兰克福学派' },
  'structural-marxism': { en: 'Structural Marxism', zh: '结构主义马克思主义' },
  'existentialist-marxism': { en: 'Existentialist Marxism', zh: '存在主义马克思主义' },
  'analytical-marxism': { en: 'Analytical Marxism', zh: '分析马克思主义' },
  'leninism': { en: 'Leninism', zh: '列宁主义' },
  'eco-marxism': { en: 'Eco-Marxism', zh: '生态马克思主义' },
  'political-economy': { en: 'Political Economy', zh: '政治经济学' },
  'utopian-socialism': { en: 'Utopian Socialism', zh: '空想社会主义' },
  'dialectical-synthesis': { en: 'Dialectical Synthesis', zh: '辩证综合派' },
};
