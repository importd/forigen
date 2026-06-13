import { useState, useMemo } from 'react';
import type { Thinker } from '../../types';

interface SearchBarProps {
  thinkers: Thinker[];
  onSelect: (thinker: Thinker) => void;
  query: string;
  onQueryChange: (q: string) => void;
}

export function SearchBar({ thinkers, onSelect, query, onQueryChange }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (query.length < 1) return [];
    const q = query.toLowerCase();
    return thinkers
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.name_zh.includes(query) ||
          t.coreIdeas.some((idea) => idea.includes(q))
      )
      .slice(0, 8);
  }, [query, thinkers]);

  const showDropdown = focused && query.length >= 1;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '380px',
      zIndex: 20,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="🔍 搜索人物、著作、思想..."
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'rgba(13, 26, 45, 0.92)',
            border: '1px solid #1a3a5c',
            borderRadius: 8,
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              (e.target as HTMLInputElement).blur();
            }
          }}
        />

        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0, right: 0,
            marginTop: 4,
            background: '#0d1a2d',
            border: '1px solid #1a3a5c',
            borderRadius: 8,
            overflow: 'hidden',
            maxHeight: 320,
            overflowY: 'auto',
          }}>
            {results.length === 0 ? (
              <div style={{ padding: 16, color: '#667788', fontSize: 13, textAlign: 'center' }}>
                No results found
              </div>
            ) : (
              results.map((t) => (
                <div
                  key={t.id}
                  onMouseDown={() => {
                    onSelect(t);
                    onQueryChange('');
                  }}
                  style={{
                    padding: '10px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #1a3a5c',
                    transition: 'background 0.15s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#1a2a3d')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ color: '#fff', fontSize: 13 }}>{t.name_zh}</div>
                    <div style={{ color: '#667788', fontSize: 11 }}>{t.name} · {t.born}–{t.died}</div>
                  </div>
                  <div style={{ color: '#556677', fontSize: 11 }}>{t.school}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
