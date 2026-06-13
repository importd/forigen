import type { Thinker } from '../../types';
import { SCHOOL_COLORS, SCHOOL_LABELS } from '../../data/schools';

interface DetailPanelProps {
  thinker: Thinker | null;
  onClose: () => void;
  onThinkerClick: (id: string) => void;
  allThinkers: Thinker[];
}

export function DetailPanel({ thinker, onClose, onThinkerClick, allThinkers }: DetailPanelProps) {
  if (!thinker) return null;

  const color = SCHOOL_COLORS[thinker.school] || '#4fc3f7';
  const schoolLabel = SCHOOL_LABELS[thinker.school];

  const getThinkerById = (id: string) => allThinkers.find(t => t.id === id);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '340px',
      height: '100%',
      background: '#0d1a2d',
      borderLeft: '1px solid #1a3a5c',
      color: '#aaccdd',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      zIndex: 10,
      overflowY: 'auto',
      animation: 'slideIn 0.3s ease-out',
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'none', border: 'none', color: '#667788',
          cursor: 'pointer', fontSize: 18,
        }}
      >
        ✕
      </button>

      <div style={{ padding: '24px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: color, flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
              {thinker.name}
            </div>
            <div style={{ fontSize: 14, color: '#667788' }}>
              {thinker.name_zh} · {thinker.born}–{thinker.died}
            </div>
          </div>
        </div>

        {/* School & Region */}
        <div style={{ fontSize: 12, color: '#8899aa', marginBottom: 16 }}>
          🏛️ {schoolLabel?.zh || thinker.school} · 📍 {thinker.region}
        </div>

        {/* Core Ideas */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#667788', marginBottom: 6, textTransform: 'uppercase' }}>
            Core Ideas
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {thinker.coreIdeas.map((idea) => (
              <span key={idea} style={{
                fontSize: 11,
                background: `${color}22`,
                color: color,
                padding: '2px 8px',
                borderRadius: 10,
              }}>
                {idea}
              </span>
            ))}
          </div>
        </div>

        {/* Key Works */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#667788', marginBottom: 6, textTransform: 'uppercase' }}>
            Key Works
          </div>
          {thinker.keyWorks.map((work) => (
            <div key={work.title} style={{ fontSize: 12, marginBottom: 4, color: '#aaccdd' }}>
              📖 {work.title_zh} ({work.year})
            </div>
          ))}
        </div>

        {/* Influenced By */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#667788', marginBottom: 6, textTransform: 'uppercase' }}>
            ← Influenced By
          </div>
          {thinker.influencedBy.map((id) => {
            const t = getThinkerById(id);
            if (!t) return null;
            return (
              <div
                key={id}
                onClick={() => onThinkerClick(id)}
                style={{
                  fontSize: 12, color: SCHOOL_COLORS[t.school] || '#4fc3f7',
                  cursor: 'pointer', marginBottom: 2, padding: '2px 4px',
                  borderRadius: 4, transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2a3d')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                → {t.name_zh} ({t.name})
              </div>
            );
          })}
          {thinker.influencedBy.length === 0 && (
            <div style={{ fontSize: 11, color: '#556677' }}>None (original thinker)</div>
          )}
        </div>

        {/* Influenced */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: '#667788', marginBottom: 6, textTransform: 'uppercase' }}>
            Influenced →
          </div>
          {thinker.influenced.map((id) => {
            const t = getThinkerById(id);
            if (!t) return null;
            return (
              <div
                key={id}
                onClick={() => onThinkerClick(id)}
                style={{
                  fontSize: 12, color: SCHOOL_COLORS[t.school] || '#4fc3f7',
                  cursor: 'pointer', marginBottom: 2, padding: '2px 4px',
                  borderRadius: 4, transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2a3d')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                → {t.name_zh} ({t.name})
              </div>
            );
          })}
          {thinker.influenced.length === 0 && (
            <div style={{ fontSize: 11, color: '#556677' }}>None</div>
          )}
        </div>

        {/* Notes link */}
        <div style={{
          marginTop: 16, paddingTop: 12,
          borderTop: '1px solid #1a3a5c',
          fontSize: 11, color: '#667788',
        }}>
          {thinker.hasNotes ? '📝 Notes available' : '📝 No notes yet'}
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
