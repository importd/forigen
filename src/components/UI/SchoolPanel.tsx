import { useState, useMemo } from 'react';
import type { Thinker } from '../../types';
import { SCHOOL_LABELS, SCHOOL_COLORS } from '../../data/schools';
import { useAppContext } from '../../context/AppContext';

interface SchoolPanelProps {
  thinkers: Thinker[];
  onThinkerClick: (id: string) => void;
}

const ERA_GROUPS: { era: string; slugs: string[] }[] = [
  { era: '古希腊哲学', slugs: ['milesian', 'ephesus-school', 'eleaticism', 'pluralism', 'atomism', 'pythagoreanism', 'socratics', 'sophism', 'platonism', 'aristotelianism', 'epicureanism', 'stoicism', 'skepticism'] },
  { era: '希腊化与晚期古典', slugs: ['neoplatonism', 'judaism'] },
  { era: '中世纪哲学', slugs: ['patristics', 'scholasticism', 'mysticism'] },
  { era: '近代哲学', slugs: ['empiricism', 'rationalism', 'occasionalism', 'enlightenment', 'utilitarianism', 'materialism', 'common-sense'] },
  { era: '德国古典与19世纪', slugs: ['german-idealism', 'irrationalism', 'vitalism', 'existentialism', 'positivism', 'evolutionism'] },
  { era: '马克思主义传统', slugs: ['historical-materialism', 'frankfurt-school', 'leninism', 'political-economy', 'structural-marxism', 'existentialist-marxism', 'analytical-marxism', 'eco-marxism', 'utopian-socialism'] },
  { era: '当代/其他', slugs: ['dialectical-synthesis', '无门无派'] },
];

export function SchoolPanel({ thinkers, onThinkerClick: _onThinkerClick }: SchoolPanelProps) {
  const { selectedTopic, setSelectedTopic } = useAppContext();
  const [open, setOpen] = useState(false);

  const selectedSchool = selectedTopic?.startsWith('school:') ? selectedTopic.slice(7) : null;

  const schoolMap = useMemo(() => {
    const map: Record<string, { slug: string; zh: string; desc?: string; color: string; count: number }> = {};
    const counts: Record<string, number> = {};
    for (const t of thinkers) counts[t.school] = (counts[t.school] || 0) + 1;
    for (const t of thinkers) {
      if (map[t.school]) continue;
      const label = SCHOOL_LABELS[t.school];
      map[t.school] = {
        slug: t.school,
        zh: label?.zh || t.school,
        desc: label?.desc,
        color: SCHOOL_COLORS[t.school] || '#78909c',
        count: counts[t.school] || 0,
      };
    }
    return map;
  }, [thinkers]);

  const selected = selectedSchool ? schoolMap[selectedSchool] : null;

  const handleSelect = (slug: string) => {
    if (selectedSchool === slug) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(`school:${slug}`);
    }
    setOpen(false);
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 80, left: 24,
      zIndex: 15,
    }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: open ? 'var(--surface-hover)' : 'var(--surface)',
          border: `1px solid ${open ? 'var(--text-muted)' : 'var(--border)'}`,
          borderRadius: 18,
          padding: '6px 14px',
          color: open ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          cursor: 'pointer',
          transition: 'background 0.1s, color 0.1s, border-color 0.1s',
        }}
      >
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: 0.5 }}>[流派]</span>
        <span>{selected ? selected.zh : '学派筛选'}</span>
        {selected && (
          <>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: selected.color }} />
            <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{selected.count}</span>
          </>
        )}
        <span style={{ color: 'var(--text-muted)', fontSize: 9, marginLeft: 2 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown popover */}
      {open && (
        <div style={{
          position: 'absolute',
          bottom: 40, left: 0,
          background: 'var(--paper)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '6px 0',
          maxHeight: 360,
          width: 220,
          overflowY: 'auto',
          boxShadow: '0 4px 24px rgba(139, 115, 85, 0.2)',
          animation: 'stampDown 0.12s cubic-bezier(0.3, 0, 1, 1)',
          zIndex: 16,
        }}>
          {ERA_GROUPS.map((group) => {
            const items = group.slugs.filter((s) => schoolMap[s]);
            if (items.length === 0) return null;
            return (
              <div key={group.era}>
                <div style={{
                  fontSize: 9, color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  padding: '6px 14px 3px',
                  textTransform: 'uppercase', letterSpacing: 1,
                }}>
                  {group.era}
                </div>
                {items.map((slug) => {
                  const s = schoolMap[slug];
                  const isActive = selectedSchool === slug;
                  return (
                    <div
                      key={slug}
                      onClick={() => handleSelect(slug)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '5px 14px',
                        cursor: 'pointer',
                        background: isActive ? 'var(--surface-hover)' : 'transparent',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: s.color, flexShrink: 0,
                      }} />
                      <span style={{ color: isActive ? s.color : 'var(--text-secondary)', flex: 1 }}>{s.zh}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{s.count}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Definition card */}
      {selected && (
        <div style={{
          marginTop: 6,
          background: 'var(--paper)',
          border: '1px solid var(--border)',
          borderLeft: `3px solid ${selected.color}`,
          borderRadius: '0 8px 8px 0',
          padding: '8px 12px',
          maxWidth: 320,
          animation: 'stampDown 0.12s cubic-bezier(0.3, 0, 1, 1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ color: selected.color, fontWeight: 700, fontFamily: 'var(--font-body)', fontSize: 12 }}>{selected.zh}</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', background: 'var(--surface-hover)', padding: '1px 6px', borderRadius: 4 }}>
              {selected.count} 位
            </span>
            <span style={{ flex: 1 }} />
            <button
              onClick={() => setSelectedTopic(null)}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', fontSize: 14, lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
          {selected.desc && (
            <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{selected.desc}</div>
          )}
        </div>
      )}

      <style>{`
        @keyframes stampDown {
          from { opacity: 0; transform: translateY(-2px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
