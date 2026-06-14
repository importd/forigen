import { useMemo } from 'react';

interface Era {
  zh: string;
  start: number;
  end: number;
  color: string;
  milestones: { year: number; label: string }[];
}

const ERAS: Era[] = [
  {
    zh: '古希腊哲学',
    start: -624, end: -322,
    color: '#3a3a3a',
    milestones: [
      { year: -585, label: '泰勒斯——哲学开端' },
      { year: -399, label: '苏格拉底之死' },
      { year: -380, label: '柏拉图《理想国》' },
    ],
  },
  {
    zh: '希腊化与罗马',
    start: -322, end: 476,
    color: '#3a3a3a',
    milestones: [
      { year: -300, label: '伊壁鸠鲁/斯多葛' },
      { year: 270, label: '普罗提诺·新柏拉图' },
    ],
  },
  {
    zh: '中世纪哲学',
    start: 476, end: 1500,
    color: '#3a3a3a',
    milestones: [
      { year: 400, label: '奥古斯丁' },
      { year: 1274, label: '阿奎那' },
    ],
  },
  {
    zh: '近代哲学',
    start: 1500, end: 1781,
    color: '#3a3a3a',
    milestones: [
      { year: 1641, label: '笛卡尔《沉思集》' },
      { year: 1755, label: '卢梭《不平等起源》' },
    ],
  },
  {
    zh: '观念论时代',
    start: 1781, end: 1840,
    color: '#3a3a3a',
    milestones: [
      { year: 1781, label: '康德《纯粹理性批判》' },
      { year: 1807, label: '黑格尔《精神现象学》' },
    ],
  },
  {
    zh: '现代思想发端',
    start: 1840, end: 1883,
    color: '#3a3a3a',
    milestones: [
      { year: 1848, label: '《共产党宣言》' },
      { year: 1867, label: '《资本论》第一卷' },
      { year: 1872, label: '尼采《悲剧的诞生》' },
    ],
  },
  {
    zh: '世纪之交',
    start: 1883, end: 1917,
    color: '#3a3a3a',
    milestones: [
      { year: 1902, label: '列宁《怎么办？》' },
      { year: 1913, label: '卢森堡《资本积累论》' },
    ],
  },
  {
    zh: '战间与批判转向',
    start: 1917, end: 1945,
    color: '#3a3a3a',
    milestones: [
      { year: 1923, label: '卢卡奇《历史与阶级意识》' },
      { year: 1929, label: '葛兰西《狱中札记》' },
    ],
  },
  {
    zh: '战后思想重构',
    start: 1945, end: 1968,
    color: '#3a3a3a',
    milestones: [
      { year: 1947, label: '《启蒙辩证法》' },
      { year: 1966, label: '阿多诺《否定辩证法》' },
    ],
  },
  {
    zh: '当代多元探索',
    start: 1968, end: 2026,
    color: '#3a3a3a',
    milestones: [
      { year: 1968, label: '五月风暴' },
      { year: 1989, label: '冷战结束' },
    ],
  },
];

interface EraTimelineProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  onSelectEra: (year: number) => void;
  onHoverEra?: (start: number | null, end: number | null) => void;
  thinkerCountByEra: Record<number, number>;
}

export function EraTimeline({ minYear, maxYear, currentYear, onSelectEra, onHoverEra, thinkerCountByEra }: EraTimelineProps) {
  const activeEra = useMemo(() => {
    for (const era of ERAS) {
      if (currentYear >= era.start && currentYear <= era.end) return era;
    }
    return null;
  }, [currentYear]);

  return (
    <div style={{
      fontSize: 10,
      color: '#5a4a3a',
      fontFamily: 'var(--font-mono)',
    }}>
      {/* Era bar — equal-width segments for visual balance */}
      <div style={{
        display: 'flex',
        height: 28,
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}>
        {ERAS.map((era, i) => {
          const isActive = activeEra?.zh === era.zh;
          const count = thinkerCountByEra[era.end] || 0;
          return (
            <div
              key={era.zh}
              onClick={() => onSelectEra(era.end)}
              title={`${era.zh}（${era.start}–${era.end}）\n${count} 位思想家`}
              style={{
                flex: 1,
                background: isActive ? `${era.color}22` : 'transparent',
                borderRight: '1px solid var(--border)',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
                position: 'relative',
                gap: 2,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)';
                onHoverEra?.(era.start, era.end);
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
                onHoverEra?.(null, null);
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: isActive ? 'var(--stamp-red)' : 'var(--border)',
                opacity: isActive ? 1 : 0.5,
              }} />
              <span style={{
                color: isActive ? 'var(--stamp-red)' : '#4a3a2a',
                fontWeight: isActive ? 600 : 400,
                fontSize: 10,
                fontFamily: 'var(--font-body)',
              }}>
                {era.zh}
              </span>
              <span style={{
                color: '#5a4a3a',
                fontSize: 8,
                fontFamily: 'var(--font-mono)',
              }}>
                {era.start}–{era.end}
              </span>
            </div>
          );
        })}
      </div>

      {/* Milestones for active era */}
      {activeEra && activeEra.milestones.length > 0 && (
        <div style={{
          display: 'flex', gap: 10, marginTop: 4,
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {activeEra.milestones.map((m) => (
            <span
              key={m.label}
              onClick={() => onSelectEra(m.year)}
              style={{
                fontSize: 9,
                color: '#5a4a3a',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                padding: '1px 4px',
                borderRadius: 3,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#3a2a1a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#5a4a3a'; }}
              title={`点击跳转到 ${m.year}`}
            >
              {m.year} {m.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
