import { useState } from 'react';
import type { Thinker } from '../../../types';
import { IDEA_LABELS } from '../../../data/labels';
import type { IdeaDetail } from '../../../data/ideaDetails';

interface CoreIdeasSectionProps {
  thinker: Thinker;
  color: string;
  ideaDetails: Record<string, IdeaDetail>;
}

function IdeaCard({ slug, color, ideaDetails }: { slug: string; color: string; ideaDetails: Record<string, IdeaDetail> }) {
  const [expanded, setExpanded] = useState(false);
  const label = IDEA_LABELS[slug];
  const detail: IdeaDetail | undefined = ideaDetails[slug];

  if (!label) return null;

  // Simple tag fallback when no academic detail
  if (!detail) {
    return (
      <span key={slug} style={{
        fontSize: 11,
        background: `${color}1a`,
        border: `1px solid ${color}33`,
        color: '#aaccdd',
        padding: '3px 10px',
        borderRadius: 12,
        lineHeight: 1.5,
        cursor: 'default',
      }}>
        {label.zh} · {label.en}
      </span>
    );
  }

  return (
    <div style={{
      background: '#0f1d2d',
      border: `1px solid ${expanded ? color + '44' : '#1a2a3d'}`,
      borderRadius: 8,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Collapsed header — always visible */}
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
          <span style={{ color: '#c8d6e0', fontSize: 12, fontWeight: 600 }}>
            {label.zh}
          </span>
          <span style={{ color: '#556677', fontSize: 10 }}>
            {label.en}
          </span>
        </div>
        <span style={{
          color: '#556677', fontSize: 10,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}>
          ▼
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          padding: '0 12px 12px',
          borderTop: `1px solid #1a2a3d`,
          paddingTop: 10,
        }}>
          <DetailRow label="定义" labelEn="Definition" textZh={detail.definition_zh} textEn={detail.definition_en} />
          <DetailRow label="渊源" labelEn="Origin" textZh={detail.origin_zh} textEn={detail.origin_en} />
          <DetailRow label="演变" labelEn="Evolution" textZh={detail.evolution_zh} textEn={detail.evolution_en} />
          <DetailRow label="辨析" labelEn="Clarification" textZh={detail.misconception_zh} textEn={detail.misconception_en} />
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, labelEn, textZh, textEn }: {
  label: string; labelEn: string;
  textZh: string; textEn: string;
}) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 9, color: '#445566', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label} · {labelEn}
      </div>
      <div style={{ fontSize: 11, color: '#99aabb', lineHeight: 1.55, marginBottom: 2 }}>
        {textZh}
      </div>
      <div style={{ fontSize: 10, color: '#556677', lineHeight: 1.5 }}>
        {textEn}
      </div>
    </div>
  );
}

export function CoreIdeasSection({ thinker, color, ideaDetails }: CoreIdeasSectionProps) {
  const ideas = thinker.coreIdeas;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ideas : ideas.slice(0, 5);
  const hasDetail = ideas.some((slug) => ideaDetails[slug]);

  return (
    <div style={{ padding: '0 20px 16px' }}>
      <SectionLabel zh="核心思想" en="Core Ideas" />

      {hasDetail ? (
        /* Accordion cards for ideas with academic detail */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {visible.map((slug) => (
            <IdeaCard key={slug} slug={slug} color={color} ideaDetails={ideaDetails} />
          ))}
        </div>
      ) : (
        /* Simple tags when no idea has detail data */
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ideas.map((slug) => {
            const label = IDEA_LABELS[slug];
            if (!label) return null;
            return (
              <span key={slug} style={{
                fontSize: 11,
                background: `${color}1a`,
                border: `1px solid ${color}33`,
                color: '#aaccdd',
                padding: '3px 10px',
                borderRadius: 12,
              }}>
                {label.zh} · {label.en}
              </span>
            );
          })}
        </div>
      )}

      {ideas.length > 5 && (
        <div
          onClick={() => setShowAll(!showAll)}
          style={{
            fontSize: 10, color: '#556677', cursor: 'pointer',
            textAlign: 'center', marginTop: 8, padding: '4px 0',
          }}
        >
          {showAll ? '收起 · Collapse ▲' : `展开全部 ${ideas.length} 个 · Show All ▼`}
        </div>
      )}
    </div>
  );
}

export function SectionLabel({ zh, en }: { zh: string; en: string }) {
  return (
    <div style={{
      fontSize: 10, color: '#556677', marginBottom: 10,
      textTransform: 'uppercase', letterSpacing: 1,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span>{zh}</span>
      <span style={{ color: '#334455' }}>·</span>
      <span style={{ color: '#445566', fontSize: 9 }}>{en}</span>
    </div>
  );
}
