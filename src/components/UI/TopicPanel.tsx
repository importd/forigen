import { useState, useMemo } from 'react';
import type { Thinker } from '../../types';
import { TOPICS } from '../../data/topics';
import { useAppContext } from '../../context/AppContext';
import { TopicCompare } from './TopicCompare';

interface TopicPanelProps {
  thinkers: Thinker[];
  onThinkerClick: (id: string) => void;
}

const TOPIC_COLORS = [
  '#a04030', '#8a6a50', '#5a7060', '#6078a0',
  '#887050', '#607090', '#986840', '#688870',
];

export function TopicPanel({ thinkers, onThinkerClick }: TopicPanelProps) {
  const { selectedTopic, setSelectedTopic } = useAppContext();
  const [open, setOpen] = useState(false);
  const topics = useMemo(() => Object.values(TOPICS), []);

  const selected = selectedTopic ? TOPICS[selectedTopic] : null;

  const handleSelect = (slug: string) => {
    if (selectedTopic === slug) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(slug);
    }
    setOpen(false);
  };

  return (
    <div style={{
      position: 'absolute',
      top: 60, left: 24,
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
        <span style={{ fontSize: 14 }}>📋</span>
        <span>{selected ? selected.zh : '核心议题'}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 9, marginLeft: 2 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 36, left: 0,
          background: 'var(--paper)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '6px 0',
          width: 220,
          boxShadow: '0 4px 24px rgba(139, 115, 85, 0.2)',
          animation: 'stampDown 0.12s cubic-bezier(0.3, 0, 1, 1)',
          zIndex: 16,
        }}>
          {topics.map((topic, i) => {
            const isActive = selectedTopic === topic.slug;
            const tc = TOPIC_COLORS[i % TOPIC_COLORS.length];
            return (
              <div
                key={topic.slug}
                onClick={() => handleSelect(topic.slug)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  background: isActive ? 'var(--surface-hover)' : 'transparent',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ color: isActive ? tc : 'var(--text-secondary)', flex: 1 }}>{topic.zh}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{topic.stances.length}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison table */}
      {selected && (
        <div style={{ marginTop: 8, maxWidth: 420 }}>
          <TopicCompare
            topic={selected}
            thinkers={thinkers}
            onThinkerClick={onThinkerClick}
            onClose={() => setSelectedTopic(null)}
          />
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
