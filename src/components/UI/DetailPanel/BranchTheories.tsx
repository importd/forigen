import { useState } from 'react';
import type { TheoryModule } from '../../../data/schoolTheories';
import { SectionLabel } from './CoreIdeasSection';

interface BranchTheoriesProps {
  school: string;
  color: string;
  schoolTheories: Record<string, TheoryModule[]>;
}

export function BranchTheories({ school, color, schoolTheories }: BranchTheoriesProps) {
  const theories = schoolTheories[school] || [];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (theories.length === 0) return null;

  const toggle = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <div style={{ padding: '0 20px 16px' }}>
      <SectionLabel zh="学派理论模块" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {theories.map((theory) => {
          const open = !!expanded[theory.slug];
          return (
            <div key={theory.slug} style={{
              background: 'var(--paper)',
              border: `1px solid ${open ? color + '44' : 'var(--border)'}`,
              borderRadius: 8,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* Header */}
              <div
                onClick={() => toggle(theory.slug)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{theory.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>
                    {theory.zh}
                  </div>
                </div>
                <span style={{
                  color: 'var(--text-muted)', fontSize: 10,
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}>
                  ▼
                </span>
              </div>

              {/* Expanded detail */}
              {open && (
                <div style={{
                  padding: '0 12px 12px',
                  borderTop: `1px solid var(--border)`,
                  paddingTop: 10,
                }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {theory.desc_zh}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
