import { useState } from 'react';
import type { Thinker } from '../../../types';

interface MarxConnectionSectionProps {
  thinker: Thinker;
  color: string;
}

export function MarxConnectionSection({ thinker, color }: MarxConnectionSectionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!thinker.marxConnection) return null;

  return (
    <div style={{ padding: '0 20px 16px' }}>
      <div style={{
        background: 'var(--paper)',
        border: `1px solid ${expanded ? color + '44' : 'var(--border)'}`,
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}>
        {/* Header — always visible, click to toggle */}
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 12px', cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 4, height: 14, borderRadius: 2,
              background: color, flexShrink: 0,
            }} />
            <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>
              与马克思主义的关联
            </span>
          </div>
          <span style={{
            color: 'var(--text-muted)', fontSize: 10,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}>
            ▼
          </span>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div style={{
            padding: '0 12px 12px',
            borderTop: '1px solid var(--border)',
            paddingTop: 10,
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.7 }}>
              {thinker.marxConnection}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
