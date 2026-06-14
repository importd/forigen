import type { SchoolColors } from '../types';

export const SCHOOL_COLORS: SchoolColors = {
  // ── Ancient Greek / Aegean (warm ochres) ──
  'milesian': '#b89560',
  'ephesus-school': '#c09870',
  'eleaticism': '#c4a878',
  'pythagoreanism': '#a08850',
  'ionian': '#c8b080',
  'atomism': '#b09068',
  'ephesian': '#c09870',
  'pluralism': '#a88860',
  'sophism': '#b8a070',
  'socratics': '#c8a870',
  'platonism': '#b09068',
  'aristotelianism': '#a89878',

  // ── Hellenistic / Roman (muted ambers & purples) ──
  'academic-skepticism': '#9a8a78',
  'skepticism': '#9a8a78',
  'epicureanism': '#a89070',
  'stoicism': '#8a7a90',
  'cynicism': '#9a8068',
  'neoplatonism': '#8878a0',
  'peripatetic': '#a89878',

  // ── Medieval / Scholastic (faded browns & muted blues) ──
  'augustinianism': '#908070',
  'thomism': '#8a7a6a',
  'scholasticism': '#8a8070',
  'via-antiqua': '#8090a0',
  'nominalism': '#788898',
  'averroism': '#988870',
  'illuminationism': '#b09868',
  'sufi': '#a09068',
  'patristics': '#908070',
  'mysticism': '#8870a0',
  'judaism': '#a09068',

  // ── Renaissance / Early Modern (muted blues, rusts, golds) ──
  'humanism': '#8a7060',
  'natural-philosophy': '#7090a0',
  'rationalism': '#6078a0',
  'empiricism': '#6888a0',
  'mechanical-philosophy': '#788890',
  'enlightenment': '#b89850',
  'utilitarianism': '#6a8860',
  'materialism': '#787890',
  'common-sense': '#687868',
  'occasionalism': '#8890a0',

  // ── German Idealism / 19th Century (muted blues & greens) ──
  'transcendental-idealism': '#5088b0',
  'absolute-idealism': '#4890a8',
  'german-idealism': '#4888a8',
  'neo-kantianism': '#6090a8',
  'hegelianism': '#3880a0',
  'young-hegelian': '#5898b0',
  'irrationalism': '#808878',
  'vitalism': '#889068',
  'positivism': '#6078a0',
  'evolutionism': '#588870',

  // ── Marxist traditions (muted crimsons, rusts, olives) ──
  'historical-materialism': '#a04030',
  'marxism': '#9a3028',
  'leninism': '#a83030',
  'trotskyism': '#a84030',
  'maoism': '#a03528',
  'western-marxism': '#903830',
  'frankfurt-school': '#5a7060',
  'critical-theory': '#4a6860',
  'structural-marxism': '#6a5058',
  'analytical-marxism': '#884840',
  'austro-marxism': '#984838',
  'luxemburgism': '#a03830',
  'political-economy': '#886860',
  'existentialist-marxism': '#985038',
  'eco-marxism': '#587858',
  'utopian-socialism': '#a08850',

  // ── Phenomenology / Existentialism (muted blue-greys) ──
  'phenomenology': '#607090',
  'existentialism': '#586878',
  'hermeneutics': '#687888',
  'deconstruction': '#586888',

  // ── Analytic / Pragmatism (muted slate) ──
  'analytic-philosophy': '#587088',
  'logical-positivism': '#5070a0',
  'pragmatism': '#707860',
  'philosophy-of-language': '#6078a0',

  // ── Contemporary (subdued tones) ──
  'structuralism': '#706888',
  'post-structuralism': '#685878',
  'postmodernism': '#786088',
  'feminist-philosophy': '#885868',
  'postcolonial': '#806848',
  'psychoanalysis': '#607088',
  'process-philosophy': '#688870',
  'ecology': '#587860',
  'dialectical-synthesis': '#786888',
  '无门无派': '#7a7a7a',
};

/** Palette for auto-assigning colors to new schools from uploaded MD files. */
export const AUTO_PALETTE: string[] = [
  '#a04030', '#8a6a50', '#5a7060', '#6078a0', '#887050',
  '#607090', '#986840', '#688870', '#786888', '#4a6860',
  '#b09050', '#6878a0', '#884838', '#587860', '#706888',
  '#a88850', '#587088', '#8a7060', '#607060', '#886878',
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

export const SCHOOL_LABELS: Record<string, { en: string; zh: string; desc?: string }> = {
  // 古希腊
  'milesian': { en: 'Milesian School', zh: '米利都学派', desc: '西方哲学的第一个学派，追问万物的本原（ἀρχή），标志着从神话思维向理性思维的过渡' },
  'ephesus-school': { en: 'Ephesian School', zh: '以弗所学派', desc: '以赫拉克利特为代表，强调万物流变与逻各斯（λόγος）的宇宙秩序' },
  'eleaticism': { en: 'Eleatic School', zh: '埃利亚学派', desc: '巴门尼德开创，首次将"存在"（τὸ ὄν）作为哲学核心范畴，以逻辑论证取代经验观察' },
  'pluralism': { en: 'Pluralism', zh: '多元论', desc: '恩培多克勒与阿那克萨戈拉，以多元本原（四根/种子）调和巴门尼德与流变论的矛盾' },
  'atomism': { en: 'Atomism', zh: '原子论', desc: '德谟克利特与留基伯，万物由不可分的原子和虚空构成——最早的机械唯物论' },
  'pythagoreanism': { en: 'Pythagoreanism', zh: '毕达哥拉斯学派', desc: '以数为万物的本原，将数学引入哲学，影响柏拉图与科学传统' },
  'socratics': { en: 'Socratic Tradition', zh: '苏格拉底传统', desc: '哲学从追问自然转向追问"人应该如何生活"——"认识你自己"，奠定西方伦理学' },
  'sophism': { en: 'Sophism', zh: '智者派', desc: '"人是万物的尺度"——将哲学从本体论转向修辞学与认识论，开启主观主义传统' },
  'platonism': { en: 'Platonism', zh: '柏拉图主义', desc: '理念论（Theory of Forms）——可感世界分有超验理念，为整个西方唯心主义奠基' },
  'aristotelianism': { en: 'Aristotelianism', zh: '逍遥学派', desc: '实体学说、四因说、三段论逻辑——"古代最伟大的思想家"，百科全书式的哲学体系' },
  'epicureanism': { en: 'Epicureanism', zh: '伊壁鸠鲁学派', desc: '原子论+快乐主义——快乐是"身体的无痛苦和灵魂的无纷扰"（ataraxia）' },
  'stoicism': { en: 'Stoicism', zh: '斯多葛学派', desc: '宇宙即理性-物质的统一体，"按照自然生活"——以不动心（apatheia）克服命运的苦难' },
  'skepticism': { en: 'Skepticism', zh: '怀疑主义', desc: '悬搁判断（epoché）可达心灵宁静——对一切独断论的批判，影响近代认识论' },

  // 希腊化与晚期古典
  'neoplatonism': { en: 'Neo-Platonism', zh: '新柏拉图主义', desc: '太一通过流溢产生理智、灵魂和自然，灵魂通过净化与迷狂回归太一' },
  'judaism': { en: 'Jewish Philosophy', zh: '犹太哲学', desc: '以希腊哲学概念诠释希伯来传统，斐洛的逻各斯学说影响基督教神学' },

  // 中世纪
  'patristics': { en: 'Patristics', zh: '教父哲学', desc: '以希腊哲学概念论证基督教教义——"信仰寻求理解"（fides quaerens intellectum）' },
  'scholasticism': { en: 'Scholasticism', zh: '经院哲学', desc: '以辩证法论证神学命题——唯实论与唯名论的共相之争，从安瑟尔谟到奥卡姆' },
  'mysticism': { en: 'Christian Mysticism', zh: '基督教神秘主义', desc: '以神秘体验超越经院理性——艾克哈特的"灵魂火花"与"弃绝"' },

  // 近代哲学
  'empiricism': { en: 'Empiricism', zh: '经验主义', desc: '一切知识来源于经验——白板说（洛克）→ 存在即被感知（贝克莱）→ 因果只是习惯（休谟）' },
  'rationalism': { en: 'Rationalism', zh: '理性主义', desc: '以理性直观和演绎法构建哲学体系——"我思故我在"（笛卡尔）→ 实体一元论（斯宾诺莎）→ 单子论（莱布尼茨）' },
  'enlightenment': { en: 'Enlightenment', zh: '启蒙运动', desc: '以理性批判宗教、专制与迷信——"敢于认识！"（Sapere aude!）从伏尔泰到百科全书派' },
  'utilitarianism': { en: 'Utilitarianism', zh: '功利主义', desc: '最大多数人的最大幸福——从爱尔维修的感觉主义到边沁和密尔的系统化' },
  'materialism': { en: 'Materialism (18th C.)', zh: '法国唯物主义', desc: '彻底的唯物主义与无神论——自然是物质的、运动的整体（霍尔巴赫、拉美特利）' },
  'common-sense': { en: 'Common Sense Philosophy', zh: '苏格兰常识哲学', desc: '以常识原则回应休谟怀疑论——人类有天赋的常识原则，无需哲学证明' },
  'occasionalism': { en: 'Occasionalism', zh: '偶因论', desc: '上帝是身心互动的唯一真正原因——试图解决笛卡尔二元论的因果问题' },

  // 德国古典与19世纪
  'german-idealism': { en: 'German Idealism', zh: '德国古典哲学', desc: '从康德的批判哲学到黑格尔的绝对唯心论——西方理性主义的最高峰与终结' },
  'irrationalism': { en: 'Irrationalism', zh: '非理性主义', desc: '意志作为物自体（叔本华）——哲学的转向：从理性走向意志、情感与直觉' },
  'vitalism': { en: 'Vitalism / Life Philosophy', zh: '生命哲学', desc: '尼采的权力意志与超人——"重估一切价值"，对柏拉图-基督教-康德传统的全面批判' },
  'existentialism': { en: 'Existentialism', zh: '存在主义', desc: '存在先于本质——从克尔凯郭尔的"信仰的跳跃"到萨特的"人注定自由"' },
  'positivism': { en: 'Positivism', zh: '实证主义', desc: '真正的知识必须是实证的（可观察可验证）——人类知识的三阶段：神学→形而上学→实证' },
  'evolutionism': { en: 'Evolutionism', zh: '进化论哲学', desc: '斯宾塞将进化原则推广到一切领域——"适者生存"的社会有机体论' },

  // 马克思主义传统
  'historical-materialism': { en: 'Historical Materialism', zh: '历史唯物主义', desc: '生产力决定生产关系，经济基础决定上层建筑——社会存在决定社会意识' },
  'frankfurt-school': { en: 'Frankfurt School', zh: '法兰克福学派', desc: '批判理论——揭示工具理性的统治逻辑，从文化工业到否定辩证法' },
  'leninism': { en: 'Leninism', zh: '列宁主义', desc: '帝国主义时代的马克思主义——先锋队建党、帝国主义论、一国建成社会主义' },
  'political-economy': { en: 'Political Economy', zh: '政治经济学', desc: '劳动价值论与分工理论——古典经济学的奠基，为马克思剩余价值理论提供前提' },

  // 当代/其他
  'structural-marxism': { en: 'Structural Marxism', zh: '结构主义马克思主义', desc: '以结构因果性反对经济决定论——阿尔都塞的多元决定与意识形态国家机器' },
  'existentialist-marxism': { en: 'Existentialist Marxism', zh: '存在主义马克思主义', desc: '以存在主义补充马克思主义的人学维度——萨特的实践辩证法' },
  'analytical-marxism': { en: 'Analytical Marxism', zh: '分析马克思主义', desc: '以分析哲学的方法重构马克思主义的核心概念——科恩的历史唯物主义辩护' },
  'eco-marxism': { en: 'Eco-Marxism', zh: '生态马克思主义', desc: '代谢断裂与环境正义——将资本逻辑批判扩展到生态维度' },
  'utopian-socialism': { en: 'Utopian Socialism', zh: '空想社会主义', desc: '不诉诸阶级斗争的社会主义理想——圣西门、傅立叶的乌托邦设计' },
  'dialectical-synthesis': { en: 'Dialectical Synthesis', zh: '辩证综合派', desc: '自成一体的辩证思维——当代理论创新者的独立探索' },
  '无门无派': { en: 'Independent', zh: '无门无派', desc: '独立思想者，不拘泥于特定学派传统' },
};
