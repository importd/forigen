import type { Thinker } from '../../types';
import { SCHOOL_COLORS, SCHOOL_LABELS } from '../../data/schools';
import { SCHOOL_THEORIES as BUILTIN_SCHOOL_THEORIES } from '../../data/schoolTheories';
import { REGION_LABELS } from '../../data/labels';
import { IDEA_DETAILS } from '../../data/ideaDetails';
import { useAppContext } from '../../context/AppContext';
import { HeaderSection } from './DetailPanel/HeaderSection';
import { CoreIdeasSection } from './DetailPanel/CoreIdeasSection';
import { KeyWorksSection } from './DetailPanel/KeyWorksSection';
import { InfluenceSection } from './DetailPanel/InfluenceSection';
import { BranchTheories } from './DetailPanel/BranchTheories';
import { MarxConnectionSection } from './DetailPanel/MarxConnectionSection';
import { NoteEditor } from './DetailPanel/NoteEditor';

interface DetailPanelProps {
  thinker: Thinker | null;
  onClose: () => void;
  onThinkerClick: (id: string) => void;
  allThinkers: Thinker[];
}

export function DetailPanel({ thinker, onClose, onThinkerClick, allThinkers }: DetailPanelProps) {
  if (!thinker) return null;

  const { customLabels, customIdeaDetails, customSchoolTheories } = useAppContext();

  // Merge label maps
  const allSchoolLabels = { ...SCHOOL_LABELS, ...customLabels.schools };
  const allRegionLabels = { ...REGION_LABELS, ...customLabels.regions };
  const school = allSchoolLabels[thinker.school];
  const region = allRegionLabels[thinker.region];

  // Merge school colors
  const mergedColors: Record<string, string> = { ...SCHOOL_COLORS };
  for (const [slug, entry] of Object.entries(customLabels.schools)) {
    if (entry.color) mergedColors[slug] = entry.color;
  }
  const color = mergedColors[thinker.school] || '#4fc3f7';

  // Merge idea details: built-in + custom
  const mergedIdeaDetails = { ...IDEA_DETAILS, ...customIdeaDetails };

  // Merge school theories: built-in + custom
  const mergedSchoolTheories: typeof BUILTIN_SCHOOL_THEORIES = { ...BUILTIN_SCHOOL_THEORIES };
  for (const [slug, theories] of Object.entries(customSchoolTheories)) {
    mergedSchoolTheories[slug] = [...(mergedSchoolTheories[slug] || []), ...theories];
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '360px',
      height: '100%',
      background: 'var(--paper)',
      borderLeft: '1px solid var(--border)',
      boxShadow: '-2px 0 16px rgba(139, 115, 85, 0.12)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
      zIndex: 10,
      overflowY: 'auto',
      animation: 'fileSlideIn 0.25s cubic-bezier(0.3, 0, 1, 1)',
    }}>
      {/* Classified header strip */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '4px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: 8,
        color: 'var(--text-muted)',
        letterSpacing: '0.08em',
      }}>
        <span>DOSSIER &middot; CLASSIFIED</span>
        <span style={{
          color: 'var(--stamp-red)',
          transform: 'rotate(-2deg)',
          display: 'inline-block',
        }}>TOP SECRET</span>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 14,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '50%', width: 28, height: 28,
          color: 'var(--text-muted)', cursor: 'pointer',
          fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1,
        }}
      >
        ✕
      </button>

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <HeaderSection thinker={thinker} color={color} schoolLabel={school} regionLabel={region} />
      </div>

      {/* Core Ideas */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <CoreIdeasSection thinker={thinker} color={color} ideaDetails={mergedIdeaDetails} />
      </div>

      {/* Key Works */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <KeyWorksSection thinker={thinker} color={color} />
      </div>

      {/* Influence Network */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <InfluenceSection
          thinker={thinker}
          allThinkers={allThinkers}
          onThinkerClick={onThinkerClick}
          customColors={mergedColors}
        />
      </div>

      {/* 与马克思主义的关联 */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <MarxConnectionSection thinker={thinker} color={color} />
      </div>

      {/* Branch-specific theories */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <BranchTheories school={thinker.school} color={color} schoolTheories={mergedSchoolTheories} />
      </div>

      {/* Note Editor */}
      <NoteEditor thinkerId={thinker.id} />

      <style>{`
        @keyframes fileSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
