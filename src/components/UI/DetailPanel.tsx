import type { Thinker } from '../../types';
import { SCHOOL_COLORS, SCHOOL_LABELS } from '../../data/schools';
import { REGION_LABELS, IDEA_LABELS } from '../../data/labels';

interface DetailPanelProps {
  thinker: Thinker | null;
  onClose: () => void;
  onThinkerClick: (id: string) => void;
  allThinkers: Thinker[];
}

export function DetailPanel({ thinker, onClose, onThinkerClick, allThinkers }: DetailPanelProps) {
  if (!thinker) return null;

  const color = SCHOOL_COLORS[thinker.school] || '#4fc3f7';
  const school = SCHOOL_LABELS[thinker.school];
  const region = REGION_LABELS[thinker.region];

  const getThinkerById = (id: string) => allThinkers.find(t => t.id === id);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '360px',
      height: '100%',
      background: '#0d1a2d',
      borderLeft: '1px solid #1a3a5c',
      color: '#aaccdd',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif',
      zIndex: 10,
      overflowY: 'auto',
      animation: 'slideIn 0.3s ease-out',
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'none', border: 'none', color: '#667788',
          cursor: 'pointer', fontSize: 18, zIndex: 1,
        }}
      >
        ✕
      </button>

      <div style={{ padding: '24px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: color, flexShrink: 0,
            boxShadow: `0 0 16px ${color}44`,
          }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
              {thinker.name_zh}
            </div>
            <div style={{ fontSize: 13, color: '#667788' }}>
              {thinker.name}
            </div>
            <div style={{ fontSize: 12, color: '#556677', marginTop: 1 }}>
              {thinker.born} – {thinker.died}
            </div>
          </div>
        </div>

        {/* School & Region — bilingual */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 18,
          fontSize: 12, color: '#8899aa',
        }}>
          <span>
            🏛️ {school?.zh || thinker.school}
            <span style={{ color: '#556677', marginLeft: 4 }}>{school?.en || ''}</span>
          </span>
          <span>
            📍 {region?.zh || thinker.region}
            <span style={{ color: '#556677', marginLeft: 4 }}>{region?.en || ''}</span>
          </span>
        </div>

        {/* Core Ideas — bilingual tags */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: '#556677', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            核心思想 · Core Ideas
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {thinker.coreIdeas.map((idea) => {
              const label = IDEA_LABELS[idea];
              return (
                <span key={idea} style={{
                  fontSize: 11,
                  background: `${color}1a`,
                  border: `1px solid ${color}33`,
                  color: '#aaccdd',
                  padding: '3px 10px',
                  borderRadius: 12,
                  lineHeight: 1.5,
                }}>
                  {label ? `${label.zh} · ${label.en}` : idea}
                </span>
              );
            })}
          </div>
        </div>

        {/* Key Works — bilingual */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: '#556677', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            代表著作 · Key Works
          </div>
          {thinker.keyWorks.map((work) => (
            <div
              key={work.title}
              style={{
                fontSize: 12, marginBottom: 6, padding: '6px 10px',
                background: '#111d2d', borderRadius: 6,
                border: '1px solid #1a2a3d',
              }}
            >
              <div style={{ color: '#aaccdd', fontWeight: 500 }}>{work.title_zh}</div>
              <div style={{ color: '#667788', fontSize: 11 }}>
                {work.title} <span style={{ color: '#556677' }}>({work.year})</span>
              </div>
            </div>
          ))}
        </div>

        {/* Influenced By — bilingual thinker names */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: '#556677', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            ← 思想来源 · Influenced By
          </div>
          {thinker.influencedBy.map((id) => {
            const t = getThinkerById(id);
            if (!t) return null;
            const tColor = SCHOOL_COLORS[t.school] || '#4fc3f7';
            return (
              <div
                key={id}
                onClick={() => onThinkerClick(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12, cursor: 'pointer',
                  marginBottom: 3, padding: '4px 8px',
                  borderRadius: 4, transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2a3d')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: tColor, flexShrink: 0,
                }} />
                <span style={{ color: '#aaccdd' }}>{t.name_zh}</span>
                <span style={{ color: '#667788', fontSize: 11 }}>{t.name}</span>
              </div>
            );
          })}
          {thinker.influencedBy.length === 0 && (
            <div style={{ fontSize: 11, color: '#556677', padding: '4px 8px' }}>无 · Original thinker</div>
          )}
        </div>

        {/* Influenced — bilingual thinker names */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, color: '#556677', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            影响后人 · Influenced →
          </div>
          {thinker.influenced.map((id) => {
            const t = getThinkerById(id);
            if (!t) return null;
            const tColor = SCHOOL_COLORS[t.school] || '#4fc3f7';
            return (
              <div
                key={id}
                onClick={() => onThinkerClick(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12, cursor: 'pointer',
                  marginBottom: 3, padding: '4px 8px',
                  borderRadius: 4, transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2a3d')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: tColor, flexShrink: 0,
                }} />
                <span style={{ color: '#aaccdd' }}>{t.name_zh}</span>
                <span style={{ color: '#667788', fontSize: 11 }}>{t.name}</span>
              </div>
            );
          })}
          {thinker.influenced.length === 0 && (
            <div style={{ fontSize: 11, color: '#556677', padding: '4px 8px' }}>无 · None</div>
          )}
        </div>

        {/* Notes */}
        <div style={{
          marginTop: 16, paddingTop: 12,
          borderTop: '1px solid #1a3a5c',
          fontSize: 11, color: '#556677',
        }}>
          {thinker.hasNotes ? '📝 已有笔记 · Notes available' : '📝 暂无笔记 · No notes yet'}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
