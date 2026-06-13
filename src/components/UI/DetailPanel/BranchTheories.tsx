import { useState } from 'react';
import { getSchoolTheories } from '../../../utils/scholarship';
import { SectionLabel } from './CoreIdeasSection';

interface BranchTheoriesProps {
  school: string;
  color: string;
}

export function BranchTheories({ school, color }: BranchTheoriesProps) {
  const theories = getSchoolTheories(school);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (theories.length === 0) return null;

  const toggle = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <div style={{ padding: '0 20px 16px' }}>
      <SectionLabel zh="学派理论模块" en="School Theory Modules" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {theories.map((theory) => {
          const open = !!expanded[theory.slug];
          return (
            <div key={theory.slug} style={{
              background: '#0f1d2d',
              border: `1px solid ${open ? color + '44' : '#1a2a3d'}`,
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
                  <div style={{ color: '#c8d6e0', fontSize: 12, fontWeight: 600 }}>
                    {theory.zh}
                  </div>
                  <div style={{ color: '#556677', fontSize: 10 }}>
                    {theory.en}
                  </div>
                </div>
                <span style={{
                  color: '#556677', fontSize: 10,
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
                  borderTop: `1px solid #1a2a3d`,
                  paddingTop: 10,
                }}>
                  <div style={{ fontSize: 11, color: '#99aabb', lineHeight: 1.6, marginBottom: 4 }}>
                    {theory.desc_zh}
                  </div>
                  <div style={{ fontSize: 10, color: '#556677', lineHeight: 1.5 }}>
                    {theory.desc_en}
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
