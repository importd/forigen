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
      background: '#0d1a2d',
      borderLeft: '1px solid #1a3a5c',
      color: '#aaccdd',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif',
      zIndex: 10,
      overflowY: 'auto',
      animation: 'slideIn 0.3s ease-out',
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 14, right: 14,
          background: '#0d1a2d', border: '1px solid #1a3a5c',
          borderRadius: '50%', width: 28, height: 28,
          color: '#667788', cursor: 'pointer',
          fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1,
        }}
      >
        ✕
      </button>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a3a5c' }}>
        <HeaderSection thinker={thinker} color={color} schoolLabel={school} regionLabel={region} />
      </div>

      {/* Core Ideas */}
      <div style={{ borderBottom: '1px solid #1a3a5c' }}>
        <CoreIdeasSection thinker={thinker} color={color} ideaDetails={mergedIdeaDetails} />
      </div>

      {/* Key Works */}
      <div style={{ borderBottom: '1px solid #1a3a5c' }}>
        <KeyWorksSection thinker={thinker} color={color} />
      </div>

      {/* Influence Network */}
      <div style={{ borderBottom: '1px solid #1a3a5c' }}>
        <InfluenceSection
          thinker={thinker}
          allThinkers={allThinkers}
          onThinkerClick={onThinkerClick}
          customColors={mergedColors}
        />
      </div>

      {/* Branch-specific theories */}
      <div style={{ borderBottom: '1px solid #1a3a5c' }}>
        <BranchTheories school={thinker.school} color={color} schoolTheories={mergedSchoolTheories} />
      </div>

      {/* Note Editor */}
      <NoteEditor thinkerId={thinker.id} />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
