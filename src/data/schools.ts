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
