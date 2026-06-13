/**
 * Detailed academic explanations for core Marxist ideas.
 * Used by CoreIdeasSection to show expandable concept cards.
 * Falls back to simple tags when an idea has no detail entry.
 */
export interface IdeaDetail {
  slug: string;
  zh: string;
  en: string;
  definition_zh: string;
  definition_en: string;
  origin_zh: string;
  origin_en: string;
  evolution_zh: string;
  evolution_en: string;
  misconception_zh: string;
  misconception_en: string;
}

export const IDEA_DETAILS: Record<string, IdeaDetail> = {
  dialectic: {
    slug: 'dialectic',
    zh: '辩证法',
    en: 'Dialectic',
    definition_zh: '一种通过矛盾运动来理解事物发展变化的方法论。辩证法认为事物内部包含着对立统一的矛盾，正是这些矛盾的斗争与解决推动着事物从量变到质变、从低级到高级的发展。',
    definition_en: 'A methodology for understanding development and change through the movement of contradictions. Dialectic holds that things contain internally unified opposites, and it is the struggle and resolution of these contradictions that drives development from quantitative to qualitative change, from lower to higher forms.',
    origin_zh: '源自古希腊哲学（赫拉克利特、柏拉图），经黑格尔发展为系统的唯心主义辩证法（正-反-合），马克思将其"颠倒"为唯物主义辩证法——不是观念自身的运动，而是物质世界矛盾在思维中的反映。',
    origin_en: 'Originating in ancient Greek philosophy (Heraclitus, Plato), systematically developed by Hegel as idealist dialectic (thesis-antithesis-synthesis), then "inverted" by Marx into materialist dialectic — not the self-movement of concepts, but the reflection in thought of contradictions in the material world.',
    evolution_zh: '从黑格尔的观念辩证法 → 马克思的唯物辩证法 → 恩格斯的自然辩证法 → 卢卡奇的历史辩证法 → 阿多诺的否定辩证法。每一阶段都在争论辩证法的适用范围与逻辑形式。',
    evolution_en: 'From Hegel\'s conceptual dialectic → Marx\'s materialist dialectic → Engels\' dialectics of nature → Lukács\' historical dialectic → Adorno\'s negative dialectics. Each stage contested the scope and logical form of dialectical reasoning.',
    misconception_zh: '常见误解是将辩证法简化为"正-反-合"的三段论公式。实际上黑格尔本人从未使用这个公式，辩证法不是机械模板，而是对矛盾运动的具体分析。',
    misconception_en: 'A common misconception reduces dialectic to the "thesis-antithesis-synthesis" triad formula. Hegel never used this formula himself; dialectic is not a mechanical template but concrete analysis of contradictory movement.',
  },

  'historical-materialism': {
    slug: 'historical-materialism',
    zh: '历史唯物主义',
    en: 'Historical Materialism',
    definition_zh: '关于人类社会发展一般规律的科学理论。核心命题：物质生活的生产方式制约着整个社会生活、政治生活和精神生活的过程；不是人们的意识决定人们的存在，而是人们的社会存在决定人们的意识。',
    definition_en: 'The scientific theory of the general laws of human social development. Core thesis: the mode of production of material life conditions the entire process of social, political, and intellectual life; it is not human consciousness that determines their existence, but their social existence that determines their consciousness.',
    origin_zh: '马克思在《德意志意识形态》（1845-46）中首次系统阐述，批判费尔巴哈的直观唯物主义和青年黑格尔派的唯心史观。其方法论根基是对黑格尔历史哲学的唯物主义改造。',
    origin_en: 'First systematically elaborated by Marx in "The German Ideology" (1845-46), as a critique of Feuerbach\'s contemplative materialism and the Young Hegelians\' idealist view of history. Its methodological foundation is the materialist transformation of Hegel\'s philosophy of history.',
    evolution_zh: '历经普列汉诺夫的体系化、列宁的能动性强调、阿尔都塞的多元决定论改造，以及哈贝马斯对交往理性的补充。争论焦点始终是经济因素的决定性程度与上层建筑的相对自主性。',
    evolution_en: 'Evolved through Plekhanov\'s systematization, Lenin\'s emphasis on agency, Althusser\'s overdetermination reformulation, and Habermas\'s communicative rationality supplement. The enduring debate concerns the degree of economic determination versus the relative autonomy of the superstructure.',
    misconception_zh: '常被误解为"经济决定论"——认为一切社会现象都可直接还原为经济利益的算计。马克思和恩格斯明确反对这种庸俗化，强调上层建筑的"反作用"和历史的多元复杂性。',
    misconception_en: 'Often mischaracterized as "economic determinism" — the idea that all social phenomena reduce directly to economic calculation. Marx and Engels explicitly opposed such vulgarization, emphasizing the "reactive" power of the superstructure and the plural complexity of history.',
  },

  alienation: {
    slug: 'alienation',
    zh: '异化',
    en: 'Alienation',
    definition_zh: '劳动者与其劳动产品、劳动活动本身、类本质以及其他劳动者相分离的过程。在资本主义下，工人创造的财富越多，自身越贫困；劳动的创造性越被剥夺，人越降格为机器的附属物。',
    definition_en: 'The process by which laborers are separated from their products, their productive activity itself, their species-essence, and their fellow laborers. Under capitalism, the more wealth workers create, the poorer they become; the more creativity is stripped from labor, the more humans are reduced to appendages of machines.',
    origin_zh: '在马克思《1844年经济学哲学手稿》中系统论述，其思想来源包括黑格尔的"外化"概念、费尔巴哈的宗教异化理论，以及青年马克思对政治经济学的批判性阅读。',
    origin_en: 'Systematically elaborated in Marx\'s "Economic and Philosophical Manuscripts of 1844." Intellectual sources include Hegel\'s concept of "externalization," Feuerbach\'s theory of religious alienation, and young Marx\'s critical reading of political economy.',
    evolution_zh: '从马克思的四重异化论 → 卢卡奇的物化概念 → 马尔库塞的单向度人 → 列斐伏尔的日常生活异化 → 数字时代的平台异化。异化概念不断扩展其批判领域，从工厂到消费社会再到数字空间。',
    evolution_en: 'From Marx\'s fourfold alienation → Lukács\' reification → Marcuse\'s one-dimensional man → Lefebvre\'s everyday life alienation → platform alienation in the digital age. The concept continuously expands its critical domain, from factory to consumer society to digital space.',
    misconception_zh: '误以为异化只是"心理感受"或主观不满。实际上异化是客观的社会结构关系——不是工人感觉不好，而是工人的生命活动确实被资本控制和剥夺了。',
    misconception_en: 'Mistaken for a mere "psychological feeling" or subjective dissatisfaction. Alienation is actually an objective structural social relation — not that workers feel bad, but that their life-activity is genuinely controlled and expropriated by capital.',
  },

  'surplus-value': {
    slug: 'surplus-value',
    zh: '剩余价值',
    en: 'Surplus Value',
    definition_zh: '工人在必要劳动时间之外所创造并被资本家无偿占有的价值。剩余价值是资本主义利润的真正源泉，揭示了资本积累的秘密：资本通过延长劳动时间（绝对剩余价值）或提高劳动生产率（相对剩余价值）来增加对工人的剥削。',
    definition_en: 'The value created by workers beyond necessary labor time and appropriated without compensation by the capitalist. Surplus value is the true source of capitalist profit, revealing the secret of capital accumulation: capital increases exploitation by extending labor time (absolute surplus value) or raising labor productivity (relative surplus value).',
    origin_zh: '马克思在《资本论》第一卷（1867）中完成了剩余价值理论的科学论证。他在批判继承古典政治经济学（斯密、李嘉图）劳动价值论的基础上，区分了劳动和劳动力，从而解开了等价交换下剥削之谜。',
    origin_en: 'Marx completed the scientific demonstration of surplus value theory in "Capital" Volume I (1867). Critically inheriting the labor theory of value from classical political economy (Smith, Ricardo), he distinguished labor from labor-power, thereby unraveling the mystery of exploitation under equivalent exchange.',
    evolution_zh: '剩余价值理论在后来的马克思经济学中衍生出利润率下降趋势规律、生产性与非生产性劳动争论、以及当代的金融化与"数字剩余价值"讨论。',
    evolution_en: 'Surplus value theory spawned the law of the tendency of the rate of profit to fall, the productive/unproductive labor debate, and contemporary discussions of financialization and "digital surplus value."',
    misconception_zh: '常被误解为"资本家赚的每一分钱都是剥削"。马克思区分了剩余价值的创造与剩余价值的分配——商业利润、利息、地租都是剩余价值的转化形式，但剥削发生在生产领域。',
    misconception_en: 'Often misunderstood as "every penny a capitalist earns is exploitation." Marx distinguished the creation of surplus value from its distribution — commercial profit, interest, and rent are all transformed forms of surplus value, but exploitation occurs in the sphere of production.',
  },

  'class-struggle': {
    slug: 'class-struggle',
    zh: '阶级斗争',
    en: 'Class Struggle',
    definition_zh: '剥削阶级与被剥削阶级之间基于根本利益对立而产生的对抗关系。马克思主义认为，自有文字记载以来的历史都是阶级斗争史，阶级斗争是推动社会形态更替的直接动力。',
    definition_en: 'The antagonistic relationship between exploiting and exploited classes based on fundamental conflicts of interest. Marxism holds that all written history is the history of class struggles, and class struggle is the direct motive force driving the succession of social formations.',
    origin_zh: '《共产党宣言》（1848）开篇即宣告"至今一切社会的历史都是阶级斗争的历史"。这一思想来源于马克思对法国历史学家（梯叶里、基佐）阶级分析方法的批判继承，以及恩格斯对英国工人阶级状况的实证研究。',
    origin_en: '"The Communist Manifesto" (1848) opens with the declaration that all history is the history of class struggles. This idea derives from Marx\'s critical inheritance of French historians\' (Thierry, Guizot) class analysis and Engels\' empirical study of the English working class.',
    evolution_zh: '从马恩的二元阶级观 → 列宁的阶级-先锋队理论 → 葛兰西的霸权争夺战 → E.P.汤普森的阶级"发生"论（阶级是历史关系而非静态结构）→ 当代的新社会运动与阶级政治的张力。',
    evolution_en: 'From Marx-Engels\' binary class view → Lenin\'s class-vanguard theory → Gramsci\'s war of position for hegemony → E.P. Thompson\'s class as "happening" (a historical relationship, not a static structure) → contemporary tensions between new social movements and class politics.',
    misconception_zh: '误以为马克思主义将一切社会冲突都归结为阶级冲突。实际上，马克思承认民族、种族、性别等多重矛盾，但认为阶级矛盾在现代资本主义社会中具有结构性的优先性。',
    misconception_en: 'Mistaken for reducing all social conflicts to class conflict. In reality, Marx acknowledged multiple contradictions of nation, race, and gender, but argued that class contradiction holds structural primacy in modern capitalist society.',
  },

  reification: {
    slug: 'reification',
    zh: '物化',
    en: 'Reification',
    definition_zh: '人与人之间的社会关系呈现为物与物之间关系的"幽灵般的对象性"。在商品社会中，人类劳动的社会性质被颠倒地反映为劳动产品本身的客观属性，人自身的活动变成异己的、统治人的力量。',
    definition_en: 'The process by which social relations between persons take on the "phantom objectivity" of relations between things. In commodity society, the social character of human labor is inverted and reflected as objective properties of the products of labor themselves — human activity becomes an alien power that dominates humans.',
    origin_zh: '卢卡奇在《历史与阶级意识》（1923）中将马克思的商品拜物教概念与韦伯的合理化理论综合为"物化"概念，成为西方马克思主义最具影响力的范畴之一。',
    origin_en: 'Lukács synthesized Marx\'s concept of commodity fetishism with Weber\'s theory of rationalization into the concept of "reification" in "History and Class Consciousness" (1923), creating one of the most influential categories of Western Marxism.',
    evolution_zh: '从卢卡奇的物化 → 阿多诺的同一性批判 → 哈贝马斯的生活世界殖民化（系统对生活世界的侵入），物化批判从经济领域扩展到文化、交往和日常生活。',
    evolution_en: 'From Lukács\' reification → Adorno\'s critique of identity thinking → Habermas\' colonization of the lifeworld (system intrusion into lifeworld), reification critique has expanded from the economic sphere to culture, communication, and everyday life.',
    misconception_zh: '容易将物化等同于对象化。马克思区分了二者：对象化是劳动的一般特征（人将自身力量外化在产品中），物化是特定社会形态下对象化被资本逻辑扭曲的病理形态。',
    misconception_en: 'Easily conflated with objectification. Marx distinguished the two: objectification is a general feature of labor (humans externalize their powers in products), while reification is the pathological form objectification takes when distorted by the logic of capital in a specific social formation.',
  },

  hegemony: {
    slug: 'hegemony',
    zh: '文化霸权',
    en: 'Hegemony',
    definition_zh: '统治阶级通过道德与智识领导权而非单纯暴力来维持统治的机制。霸权是强制与同意的结合体——国家作为"披着甲胄的霸权"，既依靠镇压机器也依赖市民社会中的意识形态共识。',
    definition_en: 'The mechanism by which a ruling class maintains dominance through moral and intellectual leadership rather than violence alone. Hegemony combines coercion and consent — the state as "hegemony armoured by coercion," relying on both repressive apparatuses and ideological consensus in civil society.',
    origin_zh: '葛兰西在《狱中札记》（1929-1935）中发展了这一概念。他超越列宁对"领导权"的策略性理解，将其提升为关于国家权力结构的核心理论范畴，解释了西方革命失败的根本原因。',
    origin_en: 'Gramsci developed this concept in the "Prison Notebooks" (1929-1935). Moving beyond Lenin\'s tactical understanding of "leadership," he elevated hegemony to a core theoretical category of state power structure, explaining the fundamental reasons for the failure of revolution in the West.',
    evolution_zh: '从葛兰西的霸权理论 → 阿尔都塞的意识形态国家机器 → 拉克劳与墨菲的话语霸权 → 后殖民理论（萨义德、斯皮瓦克）的文化霸权分析。霸权概念从阶级政治扩展到文化政治。',
    evolution_en: 'From Gramsci\'s hegemony → Althusser\'s ideological state apparatuses → Laclau & Mouffe\'s discursive hegemony → postcolonial cultural hegemony analysis (Said, Spivak). The concept has expanded from class politics to cultural politics.',
    misconception_zh: '常被误解为纯粹的"洗脑"或阴谋论。葛兰西强调霸权是在日常生活中通过制度（学校、教堂、媒体）建构的"常识"，不是少数人的刻意欺骗，而是社会的结构性共识生产。',
    misconception_en: 'Often misunderstood as mere "brainwashing" or conspiracy. Gramsci emphasized that hegemony is constructed as "common sense" through institutions (schools, churches, media) in daily life — not deliberate deception by a few, but society\'s structural production of consensus.',
  },

  'culture-industry': {
    slug: 'culture-industry',
    zh: '文化工业',
    en: 'Culture Industry',
    definition_zh: '文化产品在资本主义下被标准化、理性化地批量生产，丧失了艺术的自发性和批判维度。文化工业将高雅艺术与低俗艺术的差异消解为表面风格差异，把消费者预先分类并制造虚假的个性，从而整合并操纵大众意识。',
    definition_en: 'Cultural products are standardized and rationally mass-produced under capitalism, losing art\'s spontaneity and critical dimension. The culture industry dissolves the difference between high and low art into superficial stylistic variations, pre-classifying consumers while manufacturing pseudo-individuality, thereby integrating and manipulating mass consciousness.',
    origin_zh: '霍克海默和阿多诺在《启蒙辩证法》（1947）的"文化工业：作为大众欺骗的启蒙"一章中提出。他们用"文化工业"替代原稿中的"大众文化"一词，以区别于自发产生于民众之中的文化。',
    origin_en: 'Proposed by Horkheimer and Adorno in "Dialectic of Enlightenment" (1947), chapter "The Culture Industry: Enlightenment as Mass Deception." They replaced the term "mass culture" with "culture industry" to distinguish it from culture that spontaneously arises from the people themselves.',
    evolution_zh: '从法兰克福学派的文化工业批判 → 本雅明对机械复制时代艺术的分析（部分反驳了阿多诺的悲观结论）→ 德波的景观社会 → 鲍德里亚的拟像与超真实。文化批判日益关注媒介形式的物质性。',
    evolution_en: 'From Frankfurt School culture industry critique → Benjamin\'s analysis of art in the age of mechanical reproduction (partially contesting Adorno\'s pessimism) → Debord\'s society of the spectacle → Baudrillard\'s simulacra and hyperreality. Cultural critique has increasingly attended to the materiality of media forms.',
    misconception_zh: '误以为是对流行文化的精英主义蔑视。实际上，阿多诺的关注点不是大众"品味低"，而是文化生产的工业逻辑系统性地消解了独立思考的可能性——问题在结构不在内容。',
    misconception_en: 'Mistaken for elitist contempt toward popular culture. Adorno\'s concern is not that mass taste is "low," but that the industrial logic of cultural production systematically dissolves the very possibility of independent thought — the problem is structural, not about content.',
  },

  'class-consciousness': {
    slug: 'class-consciousness',
    zh: '阶级意识',
    en: 'Class Consciousness',
    definition_zh: '一个阶级对其自身历史地位和利益的理性自觉。无产阶级的阶级意识不是经验性的"工人怎么想"，而是被赋予的阶级觉悟——即无产阶级如果充分认识自身处境则必然具有的意识。它是理论与实践的统一。',
    definition_en: 'A class\'s rational awareness of its own historical position and interests. Proletarian class consciousness is not empirical "what workers happen to think," but imputed class awareness — the consciousness the proletariat would necessarily have if it fully grasped its own situation. It is the unity of theory and practice.',
    origin_zh: '卢卡奇在《历史与阶级意识》（1923）中的核心概念。他将阶级意识与物化对立起来：物化是资产阶级的思想形式，阶级意识则是无产阶级克服物化达到对总体性认识的思想革命。',
    origin_en: 'The core concept of Lukács\' "History and Class Consciousness" (1923). He opposed class consciousness to reification: reification is the bourgeoisie\'s form of thought, while class consciousness is the intellectual revolution by which the proletariat overcomes reification to achieve an understanding of totality.',
    evolution_zh: '从卢卡奇的被赋予的阶级意识 → 列宁的外部灌输论 → 葛兰西的有机知识分子培育 → E.P.汤普森的阶级经验与意识形成。争论核心：阶级意识是先锋队从外部带入的，还是从工人阶级经验中内生成长的？',
    evolution_en: 'From Lukács\' imputed class consciousness → Lenin\'s external灌输 (incultation) → Gramsci\'s organic intellectual cultivation → E.P. Thompson\'s class experience and consciousness formation. The core debate: is class consciousness brought from outside by the vanguard, or does it grow endogenously from working-class experience?',
    misconception_zh: '混淆阶级意识与阶级心理。阶级心理是经验层面的（工人对日常生活的直接感受），阶级意识是理性层面的（对整体社会结构的认识）。二者之间不存在自动转化。',
    misconception_en: 'Confusing class consciousness with class psychology. Class psychology is experiential (workers\' immediate feelings about daily life); class consciousness is rational (understanding of the overall social structure). There is no automatic conversion between the two.',
  },

  totality: {
    slug: 'totality',
    zh: '总体性',
    en: 'Totality',
    definition_zh: '社会是一个由各部分相互联系、相互作用构成的有机整体，不能还原为孤立事实的集合。总体性方法是马克思主义辩证法的核心要求——只有将个别现象置于社会总体的关系网络中，才能揭示其真实意义。',
    definition_en: 'Society is an organic whole constituted by the mutual interconnection and interaction of its parts, irreducible to a collection of isolated facts. The totality method is the core requirement of Marxist dialectic — only by situating individual phenomena within the relational network of the social totality can their true meaning be revealed.',
    origin_zh: '卢卡奇在《历史与阶级意识》中将"总体性"确立为"马克思主义中具有决定意义的范畴"，并将之视为马克思主义区别于资产阶级科学的根本方法论标志。',
    origin_en: 'Lukács established "totality" in "History and Class Consciousness" as "the category that is of decisive significance in Marxism," and regarded it as the fundamental methodological marker distinguishing Marxism from bourgeois science.',
    evolution_zh: '卢卡奇的总体性 → 柯尔施对马克思主义哲学性的辩护 → 阿多诺对总体性的批判（"总体是虚假的"）→ 哈贝马斯的系统-生活世界二元论。后来者对总体性概念的封闭性和压制性保持警惕。',
    evolution_en: 'Lukács\' totality → Korsch\'s defense of Marxism\'s philosophical character → Adorno\'s critique of totality ("the whole is the false") → Habermas\' system-lifeworld dualism. Later thinkers have remained vigilant about the concept\'s potential for closure and repression.',
    misconception_zh: '误以为总体性就是"面面俱到"或"大而全"。总体性不是经验上的穷举，而是方法论上的结构性把握——理解部分如何在整体中获得其位置和功能。',
    misconception_en: 'Mistaken for "covering everything" or "comprehensiveness." Totality is not empirical exhaustiveness but methodological structural grasp — understanding how parts acquire their position and function within the whole.',
  },

  'negative-dialectics': {
    slug: 'negative-dialectics',
    zh: '否定辩证法',
    en: 'Negative Dialectics',
    definition_zh: '阿多诺提出的对传统辩证法的彻底否定性理解。否定了黑格尔辩证法中"否定之否定走向肯定"的逻辑，坚持否定不达到任何肯定终点。概念永远无法穷尽非概念之物，哲学的任务就是持续揭露概念体系与对象之间的不可消除的裂隙。',
    definition_en: 'Adorno\'s radically negative understanding of traditional dialectic, negating the Hegelian logic whereby "negation of negation leads to affirmation" and insisting that negation reaches no affirmative endpoint. Concepts can never exhaust the non-conceptual — philosophy\'s task is to continually expose the irreducible gap between conceptual systems and their objects.',
    origin_zh: '阿多诺在其晚年代表作《否定辩证法》（1966）中系统阐述。这是对整个西方哲学同一性思维传统的总批判，也是法兰克福学派批判理论的最终哲学表达。',
    origin_en: 'Systematically elaborated in Adorno\'s late magnum opus "Negative Dialectics" (1966). This represents both a total critique of the Western philosophical tradition of identity thinking and the final philosophical expression of Frankfurt School critical theory.',
    evolution_zh: '否定辩证法影响了德国新左派的理论发展，也启发了后结构主义对总体性理论的批判。但在批判理论内部，哈贝马斯批评其理论规范性不足，转向了交往理论的建构路径。',
    evolution_en: 'Negative dialectics influenced the theoretical development of the German New Left and inspired poststructuralist critiques of totality theory. However, within critical theory, Habermas criticized its insufficient normative foundations and turned toward the constructive path of communication theory.',
    misconception_zh: '误以为否定辩证法就是"什么都否定"的虚无主义。阿多诺的否定是有确定对象的否定——它否定的是同一性思维的强制性和拜物教化的概念体系，其背后是对"非同一物"的解放性关怀。',
    misconception_en: 'Mistaken for a nihilistic "negation of everything." Adorno\'s negation has determinate objects — it negates the coercive character of identity thinking and fetishized conceptual systems, motivated by an emancipatory concern for "the non-identical."',
  },

  'dialectical-materialism': {
    slug: 'dialectical-materialism',
    zh: '辩证唯物主义',
    en: 'Dialectical Materialism',
    definition_zh: '马克思主义哲学的世界观部分，研究自然界、社会和思维发展的最一般规律。将唯物主义的本体论立场（物质第一性）与辩证法的认识论方法（联系、发展、矛盾）统一为完整的哲学体系。',
    definition_en: 'The worldview component of Marxist philosophy, studying the most general laws of the development of nature, society, and thought. It unifies the ontological position of materialism (the primacy of matter) with the epistemological method of dialectics (interconnection, development, contradiction) into a complete philosophical system.',
    origin_zh: '主要由恩格斯在《反杜林论》（1878）和《自然辩证法》中奠基，后经普列汉诺夫命名并体系化，列宁在《唯物主义和经验批判主义》中进一步发展，最终在苏联马克思主义中成为官方教科书哲学。',
    origin_en: 'Primarily founded by Engels in "Anti-Dühring" (1878) and "Dialectics of Nature," then named and systematized by Plekhanov, further developed by Lenin in "Materialism and Empirio-Criticism," and finally codified as official textbook philosophy in Soviet Marxism.',
    evolution_zh: '西方马克思主义（特别是卢卡奇和柯尔施）对这一体系化提出质疑，认为将辩证法扩展到自然领域是向旧形而上学倒退。争论焦点：辩证法是否适用于无人类实践参与的纯粹自然界？',
    evolution_en: 'Western Marxism (especially Lukács and Korsch) contested this systematization, arguing that extending dialectics to the natural realm is a regression to old metaphysics. The debate: does dialectics apply to pure nature without human praxis?',
    misconception_zh: '常被等同于"苏联教科书哲学"而视为僵化的教条。实际上，辩证唯物主义内部存在丰富的争论传统——从反映论与建构论的认知论争论，到物质概念的重新诠释，远非铁板一块。',
    misconception_en: 'Often equated with ossified "Soviet textbook philosophy." In reality, dialectical materialism contains rich traditions of internal debate — from epistemological disputes between reflection and construction theories to reinterpretations of the concept of matter — and is far from monolithic.',
  },

  'scientific-socialism': {
    slug: 'scientific-socialism',
    zh: '科学社会主义',
    en: 'Scientific Socialism',
    definition_zh: '建立在唯物史观和剩余价值学说之上的社会主义理论。区别于空想社会主义，科学社会主义不从道德义愤或抽象理性出发设计理想社会，而是从资本主义生产方式的内在矛盾中揭示其灭亡的必然性和无产阶级革命的道路。',
    definition_en: 'Socialist theory grounded in historical materialism and the theory of surplus value. Unlike utopian socialism, scientific socialism does not design ideal societies from moral indignation or abstract reason, but reveals the inevitability of capitalism\'s demise and the path of proletarian revolution from the internal contradictions of the capitalist mode of production.',
    origin_zh: '恩格斯在《社会主义从空想到科学的发展》（1880）中系统阐述了这一概念。该书从马克思的《资本论》和《反杜林论》中提炼出科学社会主义的理论基础和核心论证。',
    origin_en: 'Engels systematically elaborated this concept in "Socialism: Utopian and Scientific" (1880). The work distills the theoretical foundations and core arguments of scientific socialism from Marx\'s "Capital" and "Anti-Dühring."',
    evolution_zh: '从马恩的科学社会主义 → 第二国际的进化论社会主义（伯恩斯坦修正主义）→ 列宁的帝国主义论与一国建成社会主义 → 西方马克思主义对决定论的批判与主体性维度的重新引入。',
    evolution_en: 'From Marx-Engels\' scientific socialism → Second International\'s evolutionary socialism (Bernstein\'s revisionism) → Lenin\'s theory of imperialism and socialism in one country → Western Marxism\'s critique of determinism and re-introduction of the subjective dimension.',
    misconception_zh: '"科学"一词容易被理解为精确预测的"社会科学"。马克思主义的"科学"更接近德语Wissenschaft——对事物本质的系统性、批判性的理论知识，而非实证主义的因果模型。',
    misconception_en: 'The word "scientific" is easily misunderstood as predictive "social science." Marxist "science" is closer to the German "Wissenschaft" — systematic, critical theoretical knowledge of the essence of things, rather than positivist causal modeling.',
  },

  imperialism: {
    slug: 'imperialism',
    zh: '帝国主义',
    en: 'Imperialism',
    definition_zh: '资本主义发展的最高阶段，即垄断资本主义与金融资本统治的时代。在这一阶段，资本输出取代商品输出，垄断组织的国际联盟瓜分世界市场，列强争夺殖民地导致战争不可避免。帝国主义是资本主义的寄生性和腐朽性充分暴露的时期。',
    definition_en: 'The highest stage of capitalist development — the era of monopoly capitalism and the domination of finance capital. In this stage, capital export replaces commodity export, international cartels divide world markets, and great-power rivalry over colonies makes war inevitable. Imperialism is the period when capitalism\'s parasitic and decaying character is fully revealed.',
    origin_zh: '列宁在《帝国主义是资本主义的最高阶段》（1916）中系统阐述，以回应第二国际内部关于一战性质和革命策略的争论。列宁综合了霍布森、希法亭和布哈林的理论成果。',
    origin_en: 'Lenin systematically elaborated this in "Imperialism: The Highest Stage of Capitalism" (1916), responding to debates within the Second International about the nature of WWI and revolutionary strategy. Lenin synthesized the theoretical work of Hobson, Hilferding, and Bukharin.',
    evolution_zh: '从列宁的经典帝国主义论 → 依附理论（弗兰克、多斯桑托斯）→ 世界体系理论（沃勒斯坦）→ 新帝国主义论（哈维的"剥夺性积累"）。讨论从殖民统治的形式扩展到全球资本主义体系的不平等结构。',
    evolution_en: 'From Lenin\'s classical imperialism theory → dependency theory (Frank, Dos Santos) → world-systems theory (Wallerstein) → new imperialism theory (Harvey\'s "accumulation by dispossession"). The discussion has expanded from forms of colonial rule to the unequal structure of the global capitalist system.',
    misconception_zh: '将帝国主义仅限于直接的殖民统治和军事侵略。当代帝国主义更多通过金融控制、技术垄断、知识产权制度和国际组织规则来实现——这就是"新帝国主义"的含义。',
    misconception_en: 'Restricting imperialism to direct colonial rule and military aggression. Contemporary imperialism operates more through financial control, technological monopoly, intellectual property regimes, and international institutional rules — this is the meaning of "new imperialism."',
  },

  'vanguard-party': {
    slug: 'vanguard-party',
    zh: '先锋队',
    en: 'Vanguard Party',
    definition_zh: '由职业革命家组成的、以马克思主义理论武装的精锐政治组织。先锋队的任务是向无产阶级"从外部"灌输阶级政治意识，领导工人阶级超越经济斗争的自发阶段，走向自觉的政治革命。',
    definition_en: 'An elite political organization composed of professional revolutionaries armed with Marxist theory. The vanguard party\'s task is to "从外部" (from outside)灌输 (incultate) class political consciousness into the proletariat, leading the working class beyond the spontaneous stage of economic struggle toward conscious political revolution.',
    origin_zh: '列宁在《怎么办？》（1902）中系统阐述了先锋队建党原则，反对当时俄国社会民主党内的经济主义倾向。核心命题：工人自发运动只能产生工联主义意识，科学社会主义理论必须由革命知识分子从外部灌输。',
    origin_en: 'Lenin systematically elaborated the vanguard party principle in "What Is to Be Done?" (1902), opposing the Economism tendency within the Russian Social Democratic Party. Core thesis: spontaneous worker movements can only produce trade-union consciousness; scientific socialist theory must be inculcated from outside by revolutionary intellectuals.',
    evolution_zh: '从列宁的民主集中制先锋队 → 托洛茨基的不断革命论与第四国际 → 葛兰西的"现代君主"（共产主义政党作为集体知识分子）→ 拉克劳与墨菲对先锋队逻辑的后结构主义解构。',
    evolution_en: 'From Lenin\'s democratic-centralist vanguard → Trotsky\'s permanent revolution and Fourth International → Gramsci\'s "Modern Prince" (communist party as collective intellectual) → Laclau & Mouffe\'s poststructuralist deconstruction of vanguard logic.',
    misconception_zh: '常被批评为"替代主义"——用党的专政替代阶级的专政。列宁本人承认这一张力，但认为在沙皇专制和工人阶级意识不成熟的条件下，先锋队是必要的过渡形式。',
    misconception_en: 'Often criticized as "substitutionism" — substituting the dictatorship of the party for the dictatorship of the class. Lenin acknowledged this tension but argued that under Tsarist autocracy and immature working-class consciousness, the vanguard was a necessary transitional form.',
  },

  'division-of-labour': {
    slug: 'division-of-labour',
    zh: '劳动分工',
    en: 'Division of Labour',
    definition_zh: '生产过程中劳动者被分配从事不同的专门化任务。分工既是劳动生产率提高的源泉，也是劳动异化和阶级分化的根源——特别是物质劳动与精神劳动的分工，使少数人得以垄断社会管理和思想生产的功能。',
    definition_en: 'The allocation of workers to different specialized tasks within the production process. Division of labor is both the source of rising labor productivity and the root of labor alienation and class differentiation — especially the division between material and mental labor, which enables a minority to monopolize the functions of social management and intellectual production.',
    origin_zh: '斯密在《国富论》中以制针厂为例经典论述了分工的经济效率。马克思在《德意志意识形态》和《资本论》中将其转化为批判性概念——分工不是中性的效率工具，而是阶级统治的技术基础。',
    origin_en: 'Smith classically discussed the economic efficiency of division of labor in "The Wealth of Nations" with the pin factory example. Marx transformed this into a critical concept in "The German Ideology" and "Capital" — division of labor is not a neutral efficiency tool but the technical foundation of class domination.',
    evolution_zh: '从斯密的经济分工 → 马克思的社会分工批判 → 涂尔干的分工与社会团结 → 布雷弗曼的劳动过程理论（20世纪的"去技能化"）→ 全球化时代的国际分工与全球价值链。',
    evolution_en: 'From Smith\'s economic division of labor → Marx\'s social division of labor critique → Durkheim\'s division of labor and social solidarity → Braverman\'s labor process theory (20th-century "deskilling") → international division of labor and global value chains in the era of globalization.',
    misconception_zh: '将分工只看作效率提升的技术安排。对马克思而言，分工的核心问题是：谁决定分工方式？分工的成果如何分配？分工是否使劳动者变得残缺和依赖？这些都是政治经济学问题而非纯技术问题。',
    misconception_en: 'Seeing division of labor as merely a technical arrangement for efficiency gains. For Marx, the core questions are: who decides the form of division of labor? How are its fruits distributed? Does it mutilate and make dependent the laborer? These are political-economic questions, not purely technical ones.',
  },

  'labour-theory-of-value': {
    slug: 'labour-theory-of-value',
    zh: '劳动价值论',
    en: 'Labour Theory of Value',
    definition_zh: '商品的价值量由生产该商品所耗费的社会必要劳动时间决定。劳动是价值的唯一源泉——自然只是提供物质基质，机器只是转移已有价值，只有活劳动创造新的价值。这一理论是剩余价值学说的前提。',
    definition_en: 'The magnitude of a commodity\'s value is determined by the socially necessary labor time required for its production. Labor is the sole source of value — nature only provides material substratum, machinery only transfers existing value, only living labor creates new value. This theory is the prerequisite for the doctrine of surplus value.',
    origin_zh: '古典政治经济学（配第、斯密、李嘉图）初步提出了劳动决定价值的观点。马克思在《剩余价值理论》和《资本论》中批判地改造了古典劳动价值论，解决了其中无法解释的等价交换与利润来源的矛盾。',
    origin_en: 'Classical political economy (Petty, Smith, Ricardo) initially proposed that labor determines value. Marx critically transformed the classical labor theory of value in "Theories of Surplus Value" and "Capital," resolving the classical impasse of how profit can arise under equivalent exchange.',
    evolution_zh: '劳动价值论一直是马克思经济学中最具争议的命题。从庞巴维克的边际效用挑战 → 斯拉法的商品生产分析 → 价值转形问题的百年争论 → 伊恩·赖特的抽象劳动新解释。',
    evolution_en: 'The labor theory of value has been the most contested proposition in Marxian economics. From Böhm-Bawerk\'s marginal utility challenge → Sraffa\'s commodity production analysis → the century-long transformation problem debate → Ian Wright\'s new interpretation of abstract labor.',
    misconception_zh: '常被误解为"劳动越辛苦，价值越高"的简单化理论。马克思明确：决定价值的是"社会必要"劳动时间——是全社会平均的技术水平和劳动强度，而不是某个工人流了多少汗。',
    misconception_en: 'Often reduced to the simplistic idea that "the more you sweat, the more value you create." Marx was explicit: what determines value is "socially necessary" labor time — the socially average level of technique and labor intensity, not how much a particular worker sweats.',
  },
};
