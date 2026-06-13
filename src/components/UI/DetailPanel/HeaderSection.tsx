import type { Thinker } from '../../../types';
import { getAcademicIdentity, getHistoricalPhase, getActivePeriod } from '../../../utils/scholarship';

interface HeaderSectionProps {
  thinker: Thinker;
  color: string;
  schoolLabel: { zh: string; en: string } | undefined;
  regionLabel: { zh: string; en: string } | undefined;
}

export function HeaderSection({ thinker, color, schoolLabel, regionLabel }: HeaderSectionProps) {
  const identities = getAcademicIdentity(thinker);
  const phase = getHistoricalPhase(thinker.born, thinker.died);
  const period = getActivePeriod(thinker.born, thinker.died);

  return (
    <div style={{ padding: '20px 20px 16px' }}>
      {/* Top row: avatar + name block */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: color, flexShrink: 0,
          boxShadow: `0 0 20px ${color}55`,
        }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            {thinker.name_zh}
          </div>
          <div style={{ fontSize: 13, color: '#667788', marginTop: 2 }}>
            {thinker.name}
          </div>
          <div style={{ fontSize: 12, color: '#556677', marginTop: 2 }}>
            {thinker.born} – {thinker.died}
          </div>
        </div>
      </div>

      {/* Identity tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {identities.map((id, i) => (
          <span key={i} style={{
            fontSize: 10,
            background: `${color}18`,
            border: `1px solid ${color}33`,
            color: '#bcc8d4',
            padding: '2px 8px',
            borderRadius: 10,
            lineHeight: 1.4,
          }}>
            {id}
          </span>
        ))}
      </div>

      {/* School & Period */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#556677', minWidth: 36 }}>学派</span>
          <span style={{
            background: `${color}22`,
            color,
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: 11,
          }}>
            {schoolLabel?.zh || thinker.school}
          </span>
          <span style={{ color: '#556677', fontSize: 10 }}>
            {schoolLabel?.en || ''}
          </span>
        </div>
        {regionLabel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#556677', minWidth: 36 }}>地区</span>
            <span style={{ color: '#8899aa' }}>{regionLabel.zh}</span>
            <span style={{ color: '#556677', fontSize: 10 }}>{regionLabel.en}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#556677', minWidth: 36 }}>时期</span>
          <span style={{ color: '#8899aa' }}>{phase.zh}</span>
          <span style={{ color: '#556677', fontSize: 10 }}>{phase.en}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#556677', minWidth: 36 }}>活跃</span>
          <span style={{ color: '#667788', fontSize: 11 }}>{period}</span>
        </div>
      </div>
    </div>
  );
}
