export interface TopicStance {
  thinkerId: string;
  stance: string;
  definition?: string;
  methodology?: string;
}

export interface Topic {
  slug: string;
  zh: string;
  icon: string;
  description: string;
  stances: TopicStance[];
}

export const TOPICS: Record<string, Topic> = {
  dialectic: {
    slug: 'dialectic',
    zh: '辩证法',
    icon: '🔄',
    description: '矛盾如何推动事物发展？从"万物皆流"到"否定辩证法"，辩证法是贯穿西方哲学的核心方法论。',
    stances: [
      { thinkerId: 'heraclitus', stance: '万物皆流与对立统一', definition: '火是万物的本原，逻各斯支配变化。对立面相互依存、相互转化——"上坡路与下坡路是同一条路"', methodology: '流变本体论' },
      { thinkerId: 'parmenides', stance: '反辩证法的存在论', definition: '存在者存在，非存在者不存在。否定流变和矛盾，以逻辑证明存在的唯一性、永恒性和不动性', methodology: '逻辑归谬法' },
      { thinkerId: 'plato', stance: '对话辩证法与理念上升', definition: '通过对话揭示矛盾，引导灵魂从可感世界上升到理念世界。辩证法是最高的学问——"使灵魂的眼睛转向真理"', methodology: '苏格拉底反诘法' },
      { thinkerId: 'aristotle', stance: '潜能与现实的对立统一', definition: '以潜能-现实的转化解释运动和变化，批判柏拉图的理念分离。矛盾律是最高思维规律——"同一事物不能同时既存在又不存在"', methodology: '三段论逻辑' },
      { thinkerId: 'kant', stance: '先验辩证论——理性的幻相', definition: '人类理性必然产生二律背反——当理性试图超出经验范围时必然陷入自我矛盾，这是理性的本性而非逻辑错误', methodology: '先验批判' },
      { thinkerId: 'fichte', stance: '自我-非我-统一的辩证运动', definition: '知识学的三条原理构成辩证运动：自我设定自身→自我设定非我→自我与非我的统一。这是黑格尔正-反-合的直接前身', methodology: '先验知识学' },
      { thinkerId: 'hegel', stance: '绝对唯心论辩证法', definition: '正题-反题-合题的矛盾运动是概念自我运动的逻辑。思维与存在在概念的辩证展开中达到同一，辩证法既是方法也是事物本身的运动', methodology: '概念辩证法' },
      { thinkerId: 'marx', stance: '唯物辩证法的颠倒', definition: '将黑格尔的"头足倒置"颠倒过来：辩证法不是观念自身的运动，而是物质世界矛盾在思维中的反映。辩证法在对现存事物的肯定的理解中同时包含否定的理解', methodology: '唯物主义辩证法' },
      { thinkerId: 'engels', stance: '自然辩证法', definition: '辩证法的三条规律——量变质变、对立统一、否定之否定——适用于自然界、社会和思维三个领域', methodology: '自然辩证法' },
      { thinkerId: 'lenin', stance: '辩证法16要素', definition: '深入研究黑格尔《逻辑学》，提出辩证法的16个要素，强调"统一物之分为两个部分以及对它的矛盾着的部分的认识是辩证法的实质"', methodology: '斗争辩证法' },
      { thinkerId: 'lukacs', stance: '总体性即辩证法的核心', definition: '辩证法的决定性因素是主体和客体的相互作用、理论和实践的统一。总体性范畴是"马克思主义中具有决定意义的范畴"', methodology: '历史辩证法' },
      { thinkerId: 'adorno', stance: '否定辩证法', definition: '否定辩证法坚持"非同一性"——概念永远无法穷尽对象。反对黑格尔的否定之否定走向肯定，坚持否定不达到任何肯定的终点', methodology: '否定辩证法' },
    ],
  },
  alienation: {
    slug: 'alienation',
    zh: '异化与物化',
    icon: '⚡',
    description: '人创造的为什么反过来统治人？从宗教异化到劳动异化到物化到同一性——批判理论的逻辑主线。',
    stances: [
      { thinkerId: 'hegel', stance: '绝对精神的外化与回归', definition: '精神外化为自然和历史，再通过人的意识回归自身。异化（Entfremdung）是精神发展的必然环节——"自我意识在它的异化中保持在自身之中"', methodology: '精神现象学' },
      { thinkerId: 'feuerbach', stance: '宗教是人的本质的异化', definition: '人将自己最好的品质投射到上帝身上，然后拜倒在自己创造的上帝面前。上帝是人的本质的异化——"神学就是人本学"', methodology: '人本学唯物主义' },
      { thinkerId: 'marx', stance: '四重异化劳动', definition: '劳动者与劳动产品异化、与劳动过程异化、与类本质异化、与其他人异化。异化不是意识问题而是资本主义生产关系下的客观结构', methodology: '政治经济学批判' },
      { thinkerId: 'lukacs', stance: '物化：从异化到物化', definition: '人与人之间的社会关系呈现为物与物之间关系的"幽灵般的对象性"。商品形式渗透到社会生活的所有方面，物化成为普遍的意识形态', methodology: '总体性辩证法' },
      { thinkerId: 'adorno', stance: '同一性思维作为异化的哲学根源', definition: '同一性思维将差异强行纳入概念体系，阿多诺将其视为物化在哲学中的对应物。文化工业使人降格为消费者，消解独立思考的能力', methodology: '否定辩证法' },
      { thinkerId: 'nietzsche', stance: '自我异化与克服', definition: '末人是对人的异化——人失去了自我超越的意志。超人是克服异化的理想——自我超越、创造新价值。生命意志需要从怨恨和奴隶道德中解放', methodology: '权力意志哲学' },
      { thinkerId: 'rousseau', stance: '文明即异化', definition: '自然状态下人是自由的，文明（私有制、社会制度）使人异化。"人生而自由，却无往不在枷锁之中"——这是最早的现代性异化诊断', methodology: '自然状态批判' },
    ],
  },
  materialism: {
    slug: 'materialism',
    zh: '唯物主义与唯心主义',
    icon: '🧱',
    description: '物质还是精神第一性？两条路线的2500年斗争——从古希腊原子论到辩证唯物主义。',
    stances: [
      { thinkerId: 'democritus', stance: '古典原子论唯物主义', definition: '万物由不可分割的原子和虚空构成。原子在虚空中运动碰撞结合，形成万物。这是最早的彻底的机械唯物论', methodology: '机械论自然哲学' },
      { thinkerId: 'aristotle', stance: '形质论的中间路线', definition: '个别事物是第一实体（唯物主义倾向），但形式是现实性原则（唯心主义倾向）。质料因与形式因的结合——"灵魂是肉体的形式"', methodology: '形质论' },
      { thinkerId: 'aquinas', stance: '基督教化的亚里士多德主义', definition: '存在是附加于本质的现实性，上帝是"自有存在"。用理性证明上帝存在（五路证明），但物质世界是上帝创造的——理性服务于信仰', methodology: '经院哲学综合' },
      { thinkerId: 'descartes', stance: '心身二元论', definition: '思维实体与广延实体的根本区分——思维是精神，广延是物质。二者之间存在不可逾越的本体论鸿沟', methodology: '理性演绎法' },
      { thinkerId: 'spinoza', stance: '实体一元论：上帝即自然', definition: '唯一实体即上帝或自然，思维与广延是其两种属性。这是对笛卡尔二元论的克服——唯物论与泛神论的融合', methodology: '几何学方法' },
      { thinkerId: 'feuerbach', stance: '人本学唯物主义', definition: '自然是第一性的，人是自然的产物。"人就是他所吃的东西"。哲学应从感性的人和自然出发，而非从抽象意识出发', methodology: '感性直观' },
      { thinkerId: 'marx', stance: '实践的唯物主义', definition: '将感性理解为实践活动而非直观。社会存在决定社会意识。对事物、现实、感性，要从"实践"的角度去理解，而非仅从"客体的或直观的形式"去理解', methodology: '历史唯物主义' },
      { thinkerId: 'engels', stance: '辩证唯物主义体系', definition: '物质是唯一客观实在，意识是物质高度发展的产物。马克思主义哲学分为辩证唯物主义（世界观）和历史唯物主义（历史观）两部分', methodology: '辩证唯物主义' },
      { thinkerId: 'lenin', stance: '唯物主义认识论', definition: '物质是标志客观实在的哲学范畴。感觉是对外部世界的反映。批判经验批判主义（马赫主义）的主观唯心论，捍卫唯物主义反映论', methodology: '唯物主义反映论' },
    ],
  },
  epistemology: {
    slug: 'epistemology',
    zh: '认识论：我们如何知道？',
    icon: '🧠',
    description: '知识从哪里来？真理的标准是什么？从柏拉图的洞穴到阿多诺的文化工业——西方认识论的演变。',
    stances: [
      { thinkerId: 'plato', stance: '回忆说：知识是灵魂对理念的回忆', definition: '灵魂在投生前曾看到理念，学习只是对已见之物的回忆。洞穴寓言：感官世界只是墙上的影子，真正的知识是对理念的理性直观', methodology: '理念论' },
      { thinkerId: 'aristotle', stance: '经验归纳+理性抽象', definition: '一切知识从感觉开始，但科学知识是对本质的形式的把握。通过归纳从个别上升到一般，再通过演绎从前提推出结论', methodology: '三段论逻辑' },
      { thinkerId: 'descartes', stance: '天赋观念+理性演绎', definition: '通过普遍怀疑找到不可动摇的支点——"我思故我在"。从清晰明确的观念出发，以数学方法推导出全部知识体系', methodology: '理性演绎法' },
      { thinkerId: 'locke', stance: '经验论：白板说', definition: '心灵最初是白板，一切观念来自经验——感觉（外部经验）和反省（内部经验）。反对天赋观念，强调观念的经验起源', methodology: '经验主义' },
      { thinkerId: 'hume', stance: '极端经验论与怀疑论', definition: '一切知识来自感觉印象。因果性只是习惯联想，不具有客观必然性。归纳推理无法被理性辩护——"休谟问题"唤醒康德', methodology: '经验论怀疑主义' },
      { thinkerId: 'kant', stance: '哥白尼式革命', definition: '不是知识符合对象，而是对象符合知识。先天综合判断如何可能？知性范畴为自然立法，但物自体不可知——划定理性的界限', methodology: '先验批判' },
      { thinkerId: 'hegel', stance: '思维与存在的同一', definition: '思维与存在在概念的辩证展开中达到同一。真理是全体——不是某个命题的正确性，而是概念的自我认识在全部展开过程中的实现', methodology: '概念辩证法' },
      { thinkerId: 'marx', stance: '实践是检验真理的标准', definition: '人的思维是否具有客观的真理性不是一个理论问题，而是一个实践问题。认识在改造世界的实践中产生和验证', methodology: '实践唯物主义' },
      { thinkerId: 'adorno', stance: '概念永远无法穷尽非概念之物', definition: '同一性思维是认识论的病理形态——将差异强行纳入概念体系是对对象的暴力。哲学的任务是"用概念的力量超越概念"', methodology: '否定辩证法' },
    ],
  },
  state: {
    slug: 'state',
    zh: '国家、权力与革命',
    icon: '🏛️',
    description: '国家是什么？权力如何运作？革命是否可能？从《理想国》到《狱中札记》——政治哲学的核心追问。',
    stances: [
      { thinkerId: 'plato', stance: '哲学家王与理想国', definition: '最好的城邦由哲学家统治——政治权力与哲学智慧的结合。正义是灵魂各部分的和谐，城邦的正义是各阶层各安其位', methodology: '理念论政治哲学' },
      { thinkerId: 'aristotle', stance: '人是政治的动物', definition: '城邦先于个人。最优政体是良治的民主制（Politeia），以中产阶级为基础。法律是最优良的统治者——"法治优于人治"', methodology: '政体分类学' },
      { thinkerId: 'locke', stance: '自然权利与有限政府', definition: '生命、自由、财产是不可剥夺的自然权利。政府基于被统治者同意，当其侵犯自然权利时人民有权反抗——为光荣革命辩护', methodology: '自然法-社会契约' },
      { thinkerId: 'rousseau', stance: '公意与人民主权', definition: '社会契约形成的"公意"是不可分割不可代表的主权。私有制是不平等的根源。公意不同于众意——它追求的是共同利益而非个人利益的总和', methodology: '社会契约论' },
      { thinkerId: 'hegel', stance: '国家是伦理理念的现实', definition: '国家是家庭和市民社会的最高综合——"国家是地上的神"。普鲁士立宪君主制是理性国家的典范，国家超越个人的特殊利益', methodology: '历史哲学' },
      { thinkerId: 'marx', stance: '国家是阶级统治的工具', definition: '国家是统治阶级用来镇压被统治阶级的机器。国家将随阶级消亡而消亡。无产阶级必须打碎旧国家机器，建立无产阶级专政作为过渡', methodology: '历史唯物主义' },
      { thinkerId: 'engels', stance: '国家起源与消亡', definition: '国家是阶级斗争不可调和的产物。它从社会中产生但凌驾于社会之上——"最强大的、经济上占统治地位的阶级的国家"。国家将随阶级消亡而"自行消亡"', methodology: '历史唯物主义' },
      { thinkerId: 'lenin', stance: '国家与革命——打碎旧机器', definition: '国家是阶级矛盾不可调和的产物和表现。无产阶级不能用旧国家机器达到自己的目的——必须打碎它，建立巴黎公社式的新型国家', methodology: '列宁主义国家理论' },
      { thinkerId: 'gramsci', stance: '国家=政治社会+市民社会', definition: '现代国家不仅包括镇压机器（警察、军队、法院），还包括市民社会（学校、教会、媒体）。霸权是"披着甲胄的强制"——统治需要同意', methodology: '文化霸权理论' },
    ],
  },
  value: {
    slug: 'value',
    zh: '劳动、价值与资本',
    icon: '💰',
    description: '价值从哪里来？资本如何积累？商品形式如何支配社会关系？——政治经济学批判的完整链条。',
    stances: [
      { thinkerId: 'adam-smith', stance: '劳动价值论的奠基', definition: '劳动是一切商品交换价值的真实尺度。分工是提高劳动生产率的关键——"看不见的手"使私人利益自动趋向公共利益', methodology: '古典政治经济学' },
      { thinkerId: 'hegel', stance: '劳动作为精神的自我产生', definition: '在主奴辩证法中，奴隶通过劳动改造自然，获得了真正的自我意识。劳动是"被压抑的欲望"——它塑造人的本质和与世界的联系', methodology: '精神现象学' },
      { thinkerId: 'marx', stance: '剩余价值与价值形式分析', definition: '劳动的二重性——具体劳动创造使用价值，抽象劳动创造价值。劳动力成为商品是剩余价值的前提。商品拜物教：社会关系颠倒地表现为物的关系', methodology: '政治经济学批判' },
      { thinkerId: 'luxemburg', stance: '资本积累的外部市场论', definition: '资本主义不能只靠自身内部市场实现剩余价值——必须不断将非资本主义领域纳入资本循环。帝国主义是资本积累的必然扩张形式', methodology: '政治经济学批判' },
      { thinkerId: 'lukacs', stance: '商品拜物教与物化意识', definition: '商品形式在资本主义中成为社会的普遍形式。物化不仅发生在经济领域，更渗透到意识结构——人变成商品世界中的旁观者', methodology: '总体性辩证法' },
      { thinkerId: 'adorno', stance: '交换价值支配社会', definition: '交换价值原则渗透到文化、艺术和日常生活——一切都被纳入等价交换的逻辑。文化工业是资本逻辑在精神领域的延伸', methodology: '否定辩证法' },
    ],
  },
  religion: {
    slug: 'religion',
    zh: '宗教批判与启蒙',
    icon: '✝️',
    description: '上帝是谁创造的？从神学到人本学到"上帝已死"——宗教批判是西方哲学走向现代性的必经之路。',
    stances: [
      { thinkerId: 'augustine', stance: '信仰寻求理解', definition: '信仰先于理性——"我信，以便我理解"。原罪使人意志受损，救赎依赖上帝恩典。上帝之城与地上之城的历史对立', methodology: '基督教柏拉图主义' },
      { thinkerId: 'aquinas', stance: '理性可证明上帝存在', definition: '五路证明：从运动、因果、偶然性、等级、目的论推出上帝存在。信仰与理性不矛盾——理性是信仰的前厅，恩典完成理性不能完成的', methodology: '经院哲学综合' },
      { thinkerId: 'spinoza', stance: '上帝即自然——泛神论', definition: '唯一实体即上帝或自然。圣经是历史的产物，应接受理性批判。预言和奇迹可用自然原因解释——"神学政治论"开创了现代圣经批判', methodology: '泛神论理性主义' },
      { thinkerId: 'hume', stance: '对上帝存在的经验怀疑', definition: '设计论论证不成立——宇宙的秩序与钟表的类比不能推出一个全知全能的造物主。神迹的证据必然不可信——"自然宗教对话录"', methodology: '经验论怀疑主义' },
      { thinkerId: 'kant', stance: '实践理性的公设', definition: '上帝存在不能用理论理性证明，但它是道德理性的必然公设——"我必须限制知识，为信仰留出地盘"。宗教是理性道德的外衣', methodology: '先验批判' },
      { thinkerId: 'feuerbach', stance: '上帝是人的本质的投射', definition: '人将自己最好的品质对象化为上帝，然后跪倒在自己创造的偶像面前。神学的秘密就是人本学——"神学已经彻底瓦解"', methodology: '人本学唯物主义' },
      { thinkerId: 'marx', stance: '宗教是人民的鸦片', definition: '宗教批判是一切批判的前提。宗教的苦难既是现实苦难的表达，也是对现实苦难的抗议。宗教是被压迫生灵的叹息，无情世界的感情——废除宗教需要废除产生宗教的社会条件', methodology: '历史唯物主义' },
      { thinkerId: 'nietzsche', stance: '上帝已死——重估一切价值', definition: '基督教道德是"奴隶道德"——将软弱美化为谦卑，压抑生命意志。超人必须超越善恶，重估一切价值。"上帝已死"意味着一切给定的意义瓦解', methodology: '权力意志谱系学' },
    ],
  },
  ideology: {
    slug: 'ideology',
    zh: '意识形态与虚假意识',
    icon: '🎯',
    description: '观念如何维系统治？从柏拉图的洞穴到马克思的"照相机隐喻"到葛兰西的"常识"——意识形态批判的演变。',
    stances: [
      { thinkerId: 'plato', stance: '洞穴寓言——认识论与政治的合一', definition: '囚徒看到的只是墙上的影子，误以为那就是真实。哲学家是挣脱洞穴看到阳光的人。意识形态批判的史前史——真理与权力的关系', methodology: '理念论隐喻' },
      { thinkerId: 'marx', stance: '统治阶级的思想是占统治地位的思想', definition: '意识形态是"照相机倒置"——社会现实在意识中被颠倒反映。不是意识决定生活，而是生活决定意识。意识形态批判需要揭示观念的物质基础', methodology: '历史唯物主义' },
      { thinkerId: 'engels', stance: '意识形态的相对独立性与反作用', definition: '意识形态虽然最终由经济基础决定，但有其相对独立性。法、哲学、宗教等意识形态可以反作用于经济基础，不能做简单的经济还原论', methodology: '辩证唯物主义' },
      { thinkerId: 'gramsci', stance: '霸权：意识形态即"常识"', definition: '统治阶级通过道德与智识上的领导权维持统治。霸权不是强力灌输而是渗透为"常识"——学校、教会、媒体在日常中建构共识。意识形态的斗争是"阵地战"', methodology: '文化霸权理论' },
      { thinkerId: 'lukacs', stance: '物化意识', definition: '资本主义社会的商品结构使人们只能以静止和孤立的方式看待社会关系。物化意识是"虚假意识"——无法从总体上把握社会的矛盾运动', methodology: '总体性辩证法' },
      { thinkerId: 'adorno', stance: '文化工业：意识形态的物质化', definition: '文化工业批量生产标准化的文化产品，将大众意识整合进既有秩序。文化不再是抵抗空间而是统治工具——"晚期资本主义的意识形态就是商品形式本身"', methodology: '否定辩证法' },
      { thinkerId: 'hume', stance: '习惯与信念的社会建构', definition: '因果性不是客观法则而是心理习惯。人类的大部分信念建立在习俗和想象之上——"理性是激情的奴隶"。这种心理分析为意识形态批判提供了认识论前史', methodology: '经验论分析' },
    ],
  },
};
