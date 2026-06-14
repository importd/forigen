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
      left: 24,
      width: '280px',
      zIndex: 20,
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="> SEARCH THINKER... _"
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'rgba(242, 237, 228, 0.95)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
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
            background: 'var(--paper)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
            maxHeight: 320,
            overflowY: 'auto',
          }}>
            {results.length === 0 ? (
              <div style={{ padding: 16, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13, textAlign: 'center' }}>
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
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background 0.15s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 13 }}>{t.name_zh}</div>
                    <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{t.name} · {t.born}–{t.died}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{t.school}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
