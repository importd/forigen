/**
 * Branch-specific theory modules for each school.
 * These modules are conditionally displayed in the thinker detail panel.
 */
export interface TheoryModule {
  slug: string;
  zh: string;
  en?: string;
  desc_zh: string;
  icon: string;
}

const FRANKFURT_THEORIES: TheoryModule[] = [
  {
    slug: 'critical-theory',
    zh: '批判理论',
    en: 'Critical Theory',
    desc_zh: '以跨学科方法揭示资本主义社会的统治机制与解放潜能。区别于传统理论对既有秩序的合理化，批判理论追问知识本身的社会条件，寻求超越商品交换逻辑的理性形式。',
    icon: '⚡',
  },
  {
    slug: 'culture-industry',
    zh: '文化工业批判',
    en: 'Culture Industry Critique',
    desc_zh: '揭示文化产品在资本主义下被标准化、商品化的过程。文化不再是自发的艺术创造或抵抗空间，而是批量生产的消费品，消解大众的批判意识并再生产既有统治秩序。',
    icon: '📺',
  },
  {
    slug: 'modernity-reflection',
    zh: '现代性反思',
    en: 'Modernity & Its Discontents',
    desc_zh: '对启蒙理性辩证法的深刻反思——启蒙本欲解放人类，却在工具理性的膨胀中走向其反面。现代性包含着理性与神话、自由与支配的悖论性张力。',
    icon: '🔍',
  },
  {
    slug: 'recognition-theory',
    zh: '承认理论',
    en: 'Recognition Theory',
    desc_zh: '将社会冲突的根源追溯至主体间承认关系的扭曲。个体的自我实现依赖于爱、法律与团结三个维度的承认，而蔑视经验构成社会抗争的道德动力。',
    icon: '🤝',
  },
];

const STRUCTURAL_MARXISM_THEORIES: TheoryModule[] = [
  {
    slug: 'althusserian-reading',
    zh: '阿尔都塞式阅读',
    en: 'Althusserian Reading',
    desc_zh: '运用"症候阅读法"重读马克思文本，揭示其背后的理论总问题。区分早期人道主义马克思与成熟期科学马克思，强调认识论断裂在思想史中的决定性意义。',
    icon: '📖',
  },
  {
    slug: 'overdetermination',
    zh: '矛盾与多元决定论',
    en: 'Contradiction & Overdetermination',
    desc_zh: '超越经济还原论，主张社会矛盾是多元决定的。经济"归根到底"起决定作用，但上层建筑具有相对自主性，各层次矛盾不可化约为单一的经济逻辑。',
    icon: '🔀',
  },
  {
    slug: 'ideological-apparatus',
    zh: '意识形态国家机器',
    en: 'Ideological State Apparatuses',
    desc_zh: '区分镇压性国家机器与意识形态国家机器（教育、宗教、家庭、媒体等）。统治阶级通过后者在日常生活层面再生产生产关系，意识形态具有物质性存在。',
    icon: '🏛️',
  },
];

const FEMINIST_MARXISM_THEORIES: TheoryModule[] = [
  {
    slug: 'gender-class-intersection',
    zh: '性别与阶级交叉分析',
    en: 'Gender-Class Intersectionality',
    desc_zh: '揭示资本主义与父权制的共谋关系。性别压迫不仅是文化残余，更是资本积累的内在机制——无偿家务劳动和情感劳动构成资本积累的隐蔽基础。',
    icon: '♀️',
  },
  {
    slug: 'reproductive-labor',
    zh: '再生产劳动理论',
    en: 'Reproductive Labor Theory',
    desc_zh: '将马克思主义价值分析延伸至生命再生产领域。劳动力的日常与代际再生产——生育、养育、照料——是社会总劳动不可或缺的组成部分，却在价值核算中系统性地被隐匿。',
    icon: '🏠',
  },
  {
    slug: 'social-reproduction',
    zh: '社会再生产理论',
    en: 'Social Reproduction Theory',
    desc_zh: '论证资本主义如何既依赖又不断破坏其自身的再生产条件。资本积累对劳动力的消耗与对再生产基础设施的侵蚀，构成资本主义内在的再生产危机倾向。',
    icon: '🔄',
  },
];

const SPATIAL_MARXISM_THEORIES: TheoryModule[] = [
  {
    slug: 'spatial-production',
    zh: '空间生产理论',
    en: 'Production of Space',
    desc_zh: '空间不是中性的容器，而是社会关系的产物和媒介。每种生产方式都生产出特有的空间形态，资本主义通过空间的生产与重组来解决其内部的矛盾与危机。',
    icon: '🌐',
  },
  {
    slug: 'spatial-fix',
    zh: '资本积累的空间修复',
    en: 'Spatial Fix of Capital',
    desc_zh: '资本主义通过地理扩张和空间重组来暂时推迟并转移其内在危机。过剩资本和劳动力通过"空间修复"输出到新区域，在全球尺度上不断重塑不均衡的地理发展。',
    icon: '🏗️',
  },
  {
    slug: 'right-to-city',
    zh: '城市权利',
    en: 'Right to the City',
    desc_zh: '城市权利不只是获取现有城市资源的权利，更是一种按照人类需要集体重塑城市空间的权利。这是对城市作为使用价值而非交换价值的政治主张。',
    icon: '🏙️',
  },
];

const ECO_MARXISM_THEORIES: TheoryModule[] = [
  {
    slug: 'metabolic-rift',
    zh: '代谢断裂理论',
    en: 'Metabolic Rift Theory',
    desc_zh: '资本主义生产在人与自然之间造成了不可修复的"代谢断裂"。大规模工业农业和城市化掠夺土壤养分并将废物集中排放，切断了人类与地球之间物质与能量循环的自然闭环。',
    icon: '🌍',
  },
  {
    slug: 'environmental-justice',
    zh: '环境正义批判',
    en: 'Environmental Justice Critique',
    desc_zh: '环境代价不成比例地由底层阶级和边缘群体承担。资本积累不仅是阶级剥削，也是生态掠夺——二者是同一过程的双重面向，需要从政治经济学角度理解生态危机。',
    icon: '⚖️',
  },
  {
    slug: 'second-contradiction',
    zh: '资本主义第二矛盾',
    en: 'Capitalism\'s Second Contradiction',
    desc_zh: '除劳资矛盾之外，资本主义还面临生产条件（自然、劳动力、城市基础设施）被资本自我破坏的"第二矛盾"。资本倾向于削减其自身生产条件的成本，从而系统性地侵蚀其再生产基础。',
    icon: '⚠️',
  },
];

const EXISTENTIALIST_MARXISM_THEORIES: TheoryModule[] = [
  {
    slug: 'praxis-philosophy',
    zh: '实践哲学',
    en: 'Philosophy of Praxis',
    desc_zh: '将实践（praxis）确立为马克思主义的核心范畴。理论不是对世界的静观而是变革世界的活动，主体通过实践既改造客观世界又实现自我创造。',
    icon: '✊',
  },
  {
    slug: 'alienation-existential',
    zh: '存在主义异化观',
    en: 'Existentialist Alienation',
    desc_zh: '将马克思的异化劳动与存在主义哲学相结合。异化不仅是经济范畴，更是人类存在的本体论困境——人在商品世界中丧失其主体性和自由创造的本质。',
    icon: '🎭',
  },
];

export const SCHOOL_THEORIES: Record<string, TheoryModule[]> = {
  'frankfurt-school': FRANKFURT_THEORIES,
  'structural-marxism': STRUCTURAL_MARXISM_THEORIES,
  'existentialist-marxism': EXISTENTIALIST_MARXISM_THEORIES,
  'eco-marxism': ECO_MARXISM_THEORIES,
  // spatial-marxism and feminist-marxism ready for future thinkers
  'spatial-marxism': SPATIAL_MARXISM_THEORIES,
  'feminist-marxism': FEMINIST_MARXISM_THEORIES,
};

export function getSchoolTheories(schoolSlug: string): TheoryModule[] {
  return SCHOOL_THEORIES[schoolSlug] || [];
}
