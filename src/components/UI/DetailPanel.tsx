import { useState, useEffect, useRef } from 'react';
import type { Thinker } from '../../types';
import { SCHOOL_COLORS, SCHOOL_LABELS } from '../../data/schools';
import { REGION_LABELS, IDEA_LABELS } from '../../data/labels';
import { useAppContext } from '../../context/AppContext';

interface DetailPanelProps {
  thinker: Thinker | null;
  onClose: () => void;
  onThinkerClick: (id: string) => void;
  allThinkers: Thinker[];
}

export function DetailPanel({ thinker, onClose, onThinkerClick, allThinkers }: DetailPanelProps) {
  if (!thinker) return null;

  const { customLabels } = useAppContext();

  // Merge hardcoded labels with custom labels from uploaded files
  const allSchoolLabels = { ...SCHOOL_LABELS, ...customLabels.schools };
  const allRegionLabels = { ...REGION_LABELS, ...customLabels.regions };
  const allIdeaLabels = { ...IDEA_LABELS, ...customLabels.ideas };

  const mergedColors = { ...SCHOOL_COLORS };
  for (const [slug, entry] of Object.entries(customLabels.schools)) {
    if (entry.color) mergedColors[slug] = entry.color;
  }
  const color = mergedColors[thinker.school] || '#4fc3f7';
  const school = allSchoolLabels[thinker.school];
  const region = allRegionLabels[thinker.region];

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
              const label = allIdeaLabels[idea];
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
            const tColor = mergedColors[t.school] || '#4fc3f7';
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
            const tColor = mergedColors[t.school] || '#4fc3f7';
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

        {/* Notes editor */}
        <NoteEditor thinkerId={thinker.id} />
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

function NoteEditor({ thinkerId }: { thinkerId: string }) {
  const { getNote, setNote } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load note only when switching thinkers (not on every auto-save)
  const getNoteRef = useRef(getNote);
  getNoteRef.current = getNote;

  useEffect(() => {
    setText(getNoteRef.current(thinkerId));
    setEditing(false);
  }, [thinkerId]);

  // Auto-save with debounce
  const handleChange = (value: string) => {
    setText(value);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setNote(thinkerId, value);
    }, 500);
  };

  const hasContent = !!text.trim();

  // State 1: No content, not editing → show "Add note" button
  if (!editing && !hasContent) {
    return (
      <div style={{
        marginTop: 16, paddingTop: 12,
        borderTop: '1px solid #1a3a5c',
      }}>
        <button
          onClick={() => setEditing(true)}
          style={{
            background: 'none', border: '1px dashed #1a3a5c',
            borderRadius: 6, color: '#556677',
            cursor: 'pointer', fontSize: 11, padding: '8px 14px',
            width: '100%', textAlign: 'left',
          }}
        >
          📝 添加笔记 · Add note...
        </button>
      </div>
    );
  }

  // State 2: Has content, not editing → show rendered note only (click to edit)
  if (!editing && hasContent) {
    return (
      <div style={{
        marginTop: 16, paddingTop: 12,
        borderTop: '1px solid #1a3a5c',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 10, color: '#556677', textTransform: 'uppercase', letterSpacing: 1 }}>
            📝 笔记 · Notes
          </span>
          <span style={{ fontSize: 9, color: '#445566' }}>
            ✓ 已保存 · Saved
          </span>
        </div>
        <div
          onClick={() => setEditing(true)}
          style={{
            fontSize: 12, color: '#aaccdd', cursor: 'pointer',
            padding: '8px 0', whiteSpace: 'pre-wrap',
            lineHeight: 1.6,
          }}
        >
          {text.length > 200 ? text.slice(0, 200) + '...' : text}
        </div>
      </div>
    );
  }

  // State 3: Editing → show textarea only
  return (
    <div style={{
      marginTop: 16, paddingTop: 12,
      borderTop: '1px solid #1a3a5c',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 10, color: '#556677', textTransform: 'uppercase', letterSpacing: 1 }}>
          📝 笔记 · Notes
        </span>
        <button
          onClick={() => {
            setNote(thinkerId, text);
            setEditing(false);
          }}
          style={{
            background: 'none', border: '1px solid #1a3a5c',
            borderRadius: 4, color: '#667788', cursor: 'pointer',
            fontSize: 10, padding: '2px 8px',
          }}
        >
          完成 · Done
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => {
          setNote(thinkerId, text);
          if (!text.trim()) setEditing(false);
        }}
        placeholder="写点关于这位思想家的笔记...&#10;&#10;支持 Markdown 格式：&#10;# 标题&#10;**粗体** *斜体*&#10;- 列表"
        autoFocus
        style={{
          width: '100%',
          minHeight: '120px',
          background: '#111d2d',
          border: '1px solid #1a3a5c',
          borderRadius: 6,
          color: '#aaccdd',
          fontSize: 12,
          padding: '10px 12px',
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit',
          lineHeight: 1.6,
        }}
      />
    </div>
  );
}
