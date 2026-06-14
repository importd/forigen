import type { Thinker } from '../../../types';
import { SCHOOL_COLORS } from '../../../data/schools';
import { SectionLabel } from './CoreIdeasSection';

interface InfluenceSectionProps {
  thinker: Thinker;
  allThinkers: Thinker[];
  onThinkerClick: (id: string) => void;
  customColors: Record<string, string>;
}
function getRelationType(fromThinker: Thinker, toThinker: Thinker): 'teacher' | 'critical' | 'development' | 'inheritance' {
  // Heuristic: if from and to share a school, likely direct inheritance
  if (fromThinker.school === toThinker.school) return 'inheritance';
  // If from thinker is much older (>30 years), likely a teacher/ancestor figure
  if (fromThinker.died < toThinker.born) return 'teacher';
  // Overlap in lifetimes → critical engagement or contemporaneous development
  if (fromThinker.born < toThinker.born && fromThinker.died > toThinker.born) return 'critical';
  return 'development';
}

const RELATION_LABELS: Record<string, { zh: string; en: string }> = {
  teacher: { zh: '师承', en: 'Mentor' },
  critical: { zh: '批判继承', en: 'Critical Inheritor' },
  inheritance: { zh: '学派传承', en: 'School Succession' },
  development: { zh: '影响', en: 'Influence' },
};

function InfluenceRow({ thinker, color, relation, note, onThinkerClick }: {
  thinker: Thinker;
  color: string;
  relation: string;
  note?: string;
  onThinkerClick: (id: string) => void;
}) {
  const rel = RELATION_LABELS[relation] || RELATION_LABELS.development;
  return (
    <div
      onClick={() => onThinkerClick(thinker.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        cursor: 'pointer',
        padding: '5px 8px', borderRadius: 4,
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#ddd5c8')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{
        width: 5, height: 5, borderRadius: '50%',
        background: color, flexShrink: 0,
      }} />
      <span style={{ color: 'var(--text-primary)', fontSize: 12, whiteSpace: 'nowrap' }}>{thinker.name_zh}</span>
      {note && (
        <span style={{
          fontSize: 10, color: 'var(--text-muted)',
          background: 'var(--surface-hover)',
          border: '1px solid var(--border)',
          padding: '1px 6px', borderRadius: 8,
          whiteSpace: 'nowrap',
          maxWidth: 120,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {note}
        </span>
      )}
      <span style={{ flex: 1 }} />
      <span style={{
        fontSize: 9, color: 'var(--text-muted)',
        whiteSpace: 'nowrap',
      }}>
        {rel.zh}
      </span>
    </div>
  );
}

export function InfluenceSection({ thinker, allThinkers, onThinkerClick, customColors }: InfluenceSectionProps) {
  const getThinker = (id: string) => allThinkers.find((t) => t.id === id);
  const getColor = (t: Thinker) => customColors[t.school] || SCHOOL_COLORS[t.school] || '#4fc3f7';

  const influencedBy = thinker.influencedBy
    .map((id) => getThinker(id))
    .filter(Boolean) as Thinker[];

  const influenced = thinker.influenced
    .map((id) => getThinker(id))
    .filter(Boolean) as Thinker[];

  return (
    <div style={{ padding: '0 20px 16px' }}>
      {/* ← Influenced By */}
      {influencedBy.length > 0 && (
        <div style={{ marginBottom: influenced.length > 0 ? 12 : 0 }}>
          <SectionLabel zh="← 思想来源" en="Influenced By" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {influencedBy.map((t) => (
              <InfluenceRow
                key={t.id}
                thinker={t}
                color={getColor(t)}
                relation={getRelationType(t, thinker)}
                note={thinker.influenceNotes?.[t.id]}
                onThinkerClick={onThinkerClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* → Influenced */}
      {influenced.length > 0 && (
        <div>
          <SectionLabel zh="影响后人 →" en="Influenced" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {influenced.map((t) => (
              <InfluenceRow
                key={t.id}
                thinker={t}
                color={getColor(t)}
                relation={getRelationType(thinker, t)}
                note={thinker.influenceNotes?.[t.id]}
                onThinkerClick={onThinkerClick}
              />
            ))}
          </div>
        </div>
      )}

      {influencedBy.length === 0 && influenced.length === 0 && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '4px 0' }}>
          无记录 · No recorded influence relations
        </div>
      )}

      {/* Documentary evidence */}
      {thinker.influenceEvidence && (
        <div style={{
          marginTop: 10, fontSize: 10, color: 'var(--text-muted)',
          lineHeight: 1.5, paddingTop: 8,
          borderTop: '1px solid var(--border)',
        }}>
          <span style={{ marginRight: 4 }}>📖</span>
          {thinker.influenceEvidence}
        </div>
      )}
    </div>
  );
}
