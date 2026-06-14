import type { Thinker } from '../../../types';
import { SectionLabel } from './CoreIdeasSection';

interface KeyWorksSectionProps {
  thinker: Thinker;
  color: string;
}

/** Derive a thematic label for a work based on the thinker's school and work title */
function getWorkTheme(titleZh: string, _school: string): { zh: string; en: string } | null {
  // Assign thematic phase labels based on recognizable keywords
  const kw = titleZh;
  if (kw.includes('精神现象') || kw.includes('逻辑学')) return { zh: '体系奠基', en: 'Foundational System' };
  if (kw.includes('资本论') || kw.includes('政治经济学')) return { zh: '成熟期批判', en: 'Mature Critique' };
  if (kw.includes('共产党宣言') || kw.includes('德意志意识形态')) return { zh: '革命纲领', en: 'Revolutionary Program' };
  if (kw.includes('1844') || kw.includes('手稿')) return { zh: '早期突破', en: 'Early Breakthrough' };
  if (kw.includes('狱中')) return { zh: '狱中沉思', en: 'Prison Reflections' };
  if (kw.includes('启蒙辩证法') || kw.includes('否定辩证法')) return { zh: '理论巅峰', en: 'Theoretical Summit' };
  if (kw.includes('历史与阶级意识')) return { zh: '方法论革命', en: 'Methodological Revolution' };
  if (kw.includes('国富论')) return { zh: '学科奠基', en: 'Discipline Foundation' };
  if (kw.includes('怎么办') || kw.includes('国家与革命')) return { zh: '革命策略', en: 'Revolutionary Strategy' };
  return null;
}

export function KeyWorksSection({ thinker, color }: KeyWorksSectionProps) {
  const works = [...thinker.keyWorks].sort((a, b) => a.year - b.year);
  if (works.length === 0) return null;

  return (
    <div style={{ padding: '0 20px 16px' }}>
      <SectionLabel zh="代表著作" en="Key Works" />

      <div style={{ position: 'relative', paddingLeft: 16 }}>
        {/* Timeline bar */}
        <div style={{
          position: 'absolute', left: 0, top: 6, bottom: 6,
          width: 1, background: 'var(--border)',
        }} />

        {works.map((work, i) => {
          const theme = getWorkTheme(work.title_zh, thinker.school);
          return (
            <div key={i} style={{ position: 'relative', marginBottom: i < works.length - 1 ? 12 : 0 }}>
              {/* Timeline dot */}
              <div style={{
                position: 'absolute', left: -20, top: 5,
                width: 6, height: 6, borderRadius: '50%',
                background: color,
                boxShadow: `0 0 6px ${color}44`,
              }} />
              {/* Year */}
              <span style={{
                fontSize: 10, color: color, fontWeight: 600,
                marginRight: 8, fontVariantNumeric: 'tabular-nums',
              }}>
                {work.year}
              </span>
              {/* Title */}
              <div style={{ display: 'inline' }}>
                <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 500 }}>
                  {work.title_zh}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, marginLeft: 6 }}>
                  {work.title}
                </span>
              </div>
              {/* Theme badge */}
              {theme && (
                <div style={{ marginTop: 2, marginLeft: 0 }}>
                  <span style={{
                    fontSize: 9, color: 'var(--text-muted)',
                    background: 'var(--surface-hover)',
                    padding: '1px 6px', borderRadius: 3,
                  }}>
                    {theme.zh} · {theme.en}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
