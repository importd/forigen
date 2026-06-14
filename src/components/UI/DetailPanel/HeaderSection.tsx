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
        }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
            {thinker.name_zh}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: 2 }}>
            {thinker.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            {thinker.born} – {thinker.died}
          </div>
        </div>
      </div>

      {/* Identity tags — Chinese only */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
        {identities.map((id, i) => (
          <span key={i} style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            background: 'rgba(139, 115, 85, 0.08)',
            border: '1px solid rgba(139, 115, 85, 0.2)',
            color: 'var(--text-secondary)',
            padding: '2px 8px',
            borderRadius: 10,
            lineHeight: 1.4,
          }}>
            {id}
          </span>
        ))}
      </div>

      {/* Metadata — Chinese only */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', minWidth: 36 }}>学派</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            borderBottom: `1px solid ${color}44`,
            color: 'var(--text-secondary)',
            padding: '2px 4px',
            fontWeight: 600,
            fontSize: 11,
          }}>
            {schoolLabel?.zh || thinker.school}
          </span>
        </div>
        {regionLabel && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', minWidth: 36 }}>地区</span>
            <span style={{ color: 'var(--text-secondary)' }}>{regionLabel.zh}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', minWidth: 36 }}>时期</span>
          <span style={{ color: 'var(--text-secondary)' }}>{phase.zh}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', minWidth: 36 }}>活跃</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{period}</span>
        </div>
      </div>
    </div>
  );
}
