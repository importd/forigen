import type { Thinker } from '../../types';
import type { Topic } from '../../data/topics';

interface TopicCompareProps {
  topic: Topic;
  thinkers: Thinker[];
  onThinkerClick: (id: string) => void;
  onClose: () => void;
}

export function TopicCompare({ topic, thinkers, onThinkerClick, onClose }: TopicCompareProps) {
  const thinkerMap = new Map(thinkers.map((t) => [t.id, t]));

  return (
    <div style={{
      marginTop: 12,
      background: 'var(--paper)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      animation: 'slideIn 0.25s ease-out',
      maxHeight: 420,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15 }}>{topic.icon}</span>
          <div>
            <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{topic.zh}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 2 }}>{topic.description}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: '1px solid var(--border)',
            borderRadius: '50%', width: 22, height: 22,
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 11,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{
              background: 'var(--surface-hover)',
              color: 'var(--text-muted)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>思想家</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>立场</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>方法论</th>
            </tr>
          </thead>
          <tbody>
            {topic.stances.map((s, i) => {
              const thinker = thinkerMap.get(s.thinkerId);
              return (
                <tr
                  key={s.thinkerId}
                  onClick={() => onThinkerClick(s.thinkerId)}
                  style={{
                    cursor: 'pointer',
                    background: i % 2 === 0 ? 'var(--paper)' : 'var(--surface-hover)',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#ddd5c8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#f2ede4' : '#ddd5c8')}
                >
                  <td style={{ padding: '8px 12px', color: 'var(--text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {thinker?.name_zh || s.thinkerId}
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 11 }}>{s.stance}</div>
                    {s.definition && (
                      <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 3, lineHeight: 1.5 }}>
                        {s.definition}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    {s.methodology && (
                      <span style={{
                        fontSize: 10, color: 'var(--text-muted)',
                        background: 'var(--surface-hover)', padding: '2px 6px',
                        borderRadius: 4, whiteSpace: 'nowrap',
                      }}>
                        {s.methodology}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
