import JSZip from 'jszip';
import type { Thinker } from '../types';
import { SCHOOL_LABELS, getSchoolColor } from '../data/schools';
import { SCHOOL_THEORIES as BUILTIN_SCHOOL_THEORIES } from '../data/schoolTheories';
import { REGION_LABELS, IDEA_LABELS } from '../data/labels';
import { IDEA_DETAILS } from '../data/ideaDetails';
import type { IdeaDetail } from '../data/ideaDetails';
import type { TheoryModule } from '../data/schoolTheories';

/**
 * Generate a complete Markdown file for a thinker,
 * with all metadata in YAML frontmatter and notes as body.
 */
function thinkerToMarkdown(
  thinker: Thinker,
  note: string,
  opts?: {
    customIdeaDetails?: Record<string, IdeaDetail>;
    customSchoolTheories?: Record<string, TheoryModule[]>;
  }
): string {
  const school = SCHOOL_LABELS[thinker.school];
  const region = REGION_LABELS[thinker.region];

  // Merge built-in + custom idea details
  const allIdeaDetails: Record<string, IdeaDetail> = { ...IDEA_DETAILS, ...(opts?.customIdeaDetails || {}) };
  // Merge built-in + custom school theories
  const allSchoolTheories: Record<string, TheoryModule[]> = { ...BUILTIN_SCHOOL_THEORIES };
  if (opts?.customSchoolTheories) {
    for (const [slug, theories] of Object.entries(opts.customSchoolTheories)) {
      allSchoolTheories[slug] = [...(allSchoolTheories[slug] || []), ...theories];
    }
  }

  // Build core_ideas with detail fields when available
  const coreIdeasYaml = thinker.coreIdeas
    .map((slug) => {
      const label = IDEA_LABELS[slug];
      const detail = allIdeaDetails[slug];
      const lines: string[] = [];
      lines.push(`  - slug: "${slug}"`);
      if (label) {
        lines.push(`    label: "${label.zh}"`);
        lines.push(`    label_en: "${label.en}"`);
      }
      if (detail) {
        lines.push(`    definition: "${detail.definition_zh.replace(/"/g, '\\"')}"`);
        lines.push(`    origin: "${detail.origin_zh.replace(/"/g, '\\"')}"`);
        lines.push(`    evolution: "${detail.evolution_zh.replace(/"/g, '\\"')}"`);
        lines.push(`    misconception: "${detail.misconception_zh.replace(/"/g, '\\"')}"`);
      }
      return lines.join('\n');
    })
    .join('\n');

  // Build school_theories for this thinker's school
  const schoolTheories = allSchoolTheories[thinker.school];
  const schoolTheoriesYaml = schoolTheories
    ? schoolTheories
        .map((t) =>
          [
            `  - school: "${thinker.school}"`,
            `    slug: "${t.slug}"`,
            `    zh: "${t.zh}"`,
            `    en: "${t.en}"`,
            `    desc_zh: "${t.desc_zh.replace(/"/g, '\\"')}"`,
            `    icon: "${t.icon}"`,
          ].join('\n')
        )
        .join('\n')
    : '';

  // Build YAML frontmatter
  const frontmatter = [
    '---',
    `id: "${thinker.id}"`,
    `name: "${thinker.name}"`,
    `name_zh: "${thinker.name_zh}"`,
    `born: ${thinker.born}`,
    `died: ${thinker.died}`,
    `latitude: ${thinker.latitude}`,
    `longitude: ${thinker.longitude}`,
    `region: "${thinker.region}"`,
    `region_label: "${region?.zh || ''}"`,
    `region_label_en: "${region?.en || ''}"`,
    `school: "${thinker.school}"`,
    `school_label: "${school?.zh || ''}"`,
    `school_label_en: "${school?.en || ''}"`,
    `school_color: "${getSchoolColor(thinker.school)}"`,
    `key_works:`,
    ...thinker.keyWorks.map(
      (w) => `  - title: "${w.title}"\n    title_zh: "${w.title_zh}"\n    year: ${w.year}`
    ),
    `influenced_by: [${thinker.influencedBy.map((s) => `"${s}"`).join(', ')}]`,
    `influenced: [${thinker.influenced.map((s) => `"${s}"`).join(', ')}]`,
    ...(thinker.influenceNotes && Object.keys(thinker.influenceNotes).length > 0
      ? [`influence_notes:`, ...Object.entries(thinker.influenceNotes).map(([k, v]) => `  ${k}: "${v.replace(/"/g, '\\"')}"`)]
      : []),
    ...(thinker.influenceEvidence ? [`influence_evidence: "${thinker.influenceEvidence.replace(/"/g, '\\"')}"`] : []),
    `core_ideas:`,
    coreIdeasYaml,
    ...(schoolTheoriesYaml ? ['school_theories:', schoolTheoriesYaml] : []),
    ...(thinker.marxConnection ? [`marx_connection: "${thinker.marxConnection.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`] : []),
    '---',
  ].join('\n');

  // Body: notes if present, otherwise empty
  const body = note.trim()
    ? `# ${thinker.name_zh} (${thinker.name})\n\n## 笔记 · Notes\n\n${note}`
    : '';

  return `${frontmatter}\n\n${body}\n`;
}

/**
 * Parse a Markdown file back into thinker metadata and note content.
 */
export function markdownToData(md: string): { metadata: Record<string, any>; note: string } | null {
  const match = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    // No frontmatter — treat entire content as a note (no metadata)
    return { metadata: {}, note: md.trim() };
  }

  const [, yamlStr, body] = match;

  // Simple YAML parser (handles our specific format)
  const metadata: Record<string, any> = {};
  const lines = yamlStr.split('\n');
  let currentKey: string | null = null;
  let inList = false;
  let inMap = false;
  let listItems: any[] = [];
  let mapItems: Record<string, string> = {};

  for (const line of lines) {
    if (line.trim() === '') continue;

    // Indented map entry (e.g. influence_notes: \n  hegel: "...")
    if (inMap && line.startsWith('  ') && !line.startsWith('  - ')) {
      const trimmed = line.trim();
      const kv = trimmed.match(/^([\w-]+):\s*["']?(.*?)["']?$/);
      if (kv) {
        mapItems[kv[1]] = kv[2].replace(/\\"/g, '"');
      }
      continue;
    }

    // List item (indented)
    if (line.startsWith('  - ') || line.startsWith('    ')) {
      inList = true;
      const trimmed = line.trimStart();
      if (trimmed.startsWith('- title:')) {
        listItems.push({ title: trimmed.slice(9).replace(/"/g, '') });
      } else if (trimmed.startsWith('title_zh:')) {
        if (listItems.length > 0) {
          listItems[listItems.length - 1].title_zh = trimmed.slice(11).replace(/"/g, '');
        }
      } else if (trimmed.startsWith('year:')) {
        if (listItems.length > 0) {
          listItems[listItems.length - 1].year = parseInt(trimmed.slice(6));
        }
      } else if (trimmed.startsWith('- slug:')) {
        listItems.push({ slug: trimmed.slice(8).replace(/"/g, '') });
      } else if (trimmed.startsWith('label:')) {
        if (listItems.length > 0) {
          listItems[listItems.length - 1].label = trimmed.slice(8).replace(/"/g, '');
        }
      } else if (trimmed.startsWith('label_en:')) {
        if (listItems.length > 0) {
          listItems[listItems.length - 1].label_en = trimmed.slice(12).replace(/"/g, '');
        }
      } else if (trimmed.startsWith('definition_en:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].definition_en = trimmed.slice(16).replace(/"/g, '');
      } else if (trimmed.startsWith('definition:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].definition = trimmed.slice(13).replace(/"/g, '');
      } else if (trimmed.startsWith('origin_en:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].origin_en = trimmed.slice(12).replace(/"/g, '');
      } else if (trimmed.startsWith('origin:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].origin = trimmed.slice(9).replace(/"/g, '');
      } else if (trimmed.startsWith('evolution_en:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].evolution_en = trimmed.slice(15).replace(/"/g, '');
      } else if (trimmed.startsWith('evolution:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].evolution = trimmed.slice(12).replace(/"/g, '');
      } else if (trimmed.startsWith('misconception_en:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].misconception_en = trimmed.slice(19).replace(/"/g, '');
      } else if (trimmed.startsWith('misconception:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].misconception = trimmed.slice(16).replace(/"/g, '');
      } else if (trimmed.startsWith('- school:')) {
        listItems.push({ school: trimmed.slice(10).replace(/"/g, '') });
      } else if (trimmed.startsWith('desc_zh:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].desc_zh = trimmed.slice(10).replace(/"/g, '');
      } else if (trimmed.startsWith('desc_en:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].desc_en = trimmed.slice(10).replace(/"/g, '');
      } else if (trimmed.startsWith('icon:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].icon = trimmed.slice(7).replace(/"/g, '');
      } else if (trimmed.startsWith('zh:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].zh = trimmed.slice(5).replace(/"/g, '');
      } else if (trimmed.startsWith('en:')) {
        if (listItems.length > 0) listItems[listItems.length - 1].en = trimmed.slice(5).replace(/"/g, '');
      } else if (trimmed.startsWith('slug:')) {
        if (listItems.length > 0 && !listItems[listItems.length - 1].slug) {
          listItems[listItems.length - 1].slug = trimmed.slice(7).replace(/"/g, '');
        }
      }
      continue;
    }

    // Flush list or map
    if (inList && currentKey) {
      (metadata as any)[currentKey] = listItems;
      listItems = [];
      inList = false;
    }
    if (inMap && currentKey) {
      (metadata as any)[currentKey] = mapItems;
      mapItems = {};
      inMap = false;
    }

    // Key-value line
    const kv = line.match(/^(\w[\w_]*):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      let value: any = kv[2].trim();

      // Detect indented map keys (like influence_notes:)
      if (currentKey === 'influence_notes' && value === '') {
        inMap = true;
        continue;
      }

      if (value.startsWith('[') && value.endsWith(']')) {
        // Array
        value = value
          .slice(1, -1)
          .split(',')
          .map((s: string) => s.trim().replace(/"/g, ''));
      } else if (!isNaN(Number(value)) && value !== '') {
        value = Number(value);
      } else {
        value = value.replace(/"/g, '');
      }

      (metadata as any)[currentKey] = value;
    }
  }

  // Flush final list
  if (inList && currentKey) {
    (metadata as any)[currentKey] = listItems;
  }
  // Flush final map
  if (inMap && currentKey) {
    (metadata as any)[currentKey] = mapItems;
  }

  // Extract note from body — find the "## 笔记 · Notes" section
  const noteMatch = body.match(/##\s*笔记\s*·\s*Notes\s*\n([\s\S]*)$/);
  let note = noteMatch ? noteMatch[1].trim() : body.trim();

  // Filter out placeholder text from old exports
  if (note === '> 暂无笔记 · No notes yet') {
    note = '';
  }

  return { metadata, note };
}

/** Convert parsed frontmatter metadata to a Thinker object */
export function metadataToThinker(metadata: Record<string, any>): Thinker | null {
  if (!metadata.id || !metadata.name) return null;

  const keyWorks = (metadata.key_works || []).map((w: any) => ({
    title: w.title || '',
    title_zh: w.title_zh || '',
    year: w.year || 0,
  }));

  const coreIdeas = (metadata.core_ideas || []).map((i: any) =>
    typeof i === 'string' ? i : i.slug || ''
  ).filter(Boolean);

  return {
    id: String(metadata.id),
    name: String(metadata.name),
    name_zh: String(metadata.name_zh || metadata.name),
    born: Number(metadata.born) || 0,
    died: Number(metadata.died) || 0,
    latitude: Number(metadata.latitude) || 0,
    longitude: Number(metadata.longitude) || 0,
    region: String(metadata.region || ''),
    school: String(metadata.school || ''),
    keyWorks,
    influencedBy: Array.isArray(metadata.influenced_by) ? metadata.influenced_by : [],
    influenced: Array.isArray(metadata.influenced) ? metadata.influenced : [],
    coreIdeas,
    hasNotes: false,
    marxConnection: metadata.marx_connection || undefined,
    influenceEvidence: metadata.influence_evidence || undefined,
    influenceNotes: metadata.influence_notes || undefined,
  };
}

/**
 * Export all thinkers + notes as a zip of Markdown files.
 */
export async function exportAllMarkdown(
  thinkers: Thinker[],
  notes: Record<string, string>,
  opts?: {
    customIdeaDetails?: Record<string, IdeaDetail>;
    customSchoolTheories?: Record<string, TheoryModule[]>;
  }
): Promise<void> {
  const zip = new JSZip();

  for (const thinker of thinkers) {
    const note = notes[thinker.id] || '';
    const md = thinkerToMarkdown(thinker, note, opts);
    zip.file(`${thinker.id}.md`, md);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `forigen-backup-${date}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Extract custom labels, idea details, and school theories from parsed frontmatter metadata.
 */
interface ExtractedData {
  schools: Record<string, { en: string; zh: string; color?: string }>;
  regions: Record<string, { en: string; zh: string }>;
  ideas: Record<string, { en: string; zh: string }>;
  ideaDetails: Record<string, any>;
  schoolTheories: Record<string, any[]>;
}

export function extractLabels(metadata: Record<string, any>): ExtractedData {
  const result: ExtractedData = {
    schools: {},
    regions: {},
    ideas: {},
    ideaDetails: {},
    schoolTheories: {},
  };

  // School label (with optional color)
  const schoolSlug = metadata.school;
  if (schoolSlug && (metadata.school_label || metadata.school_label_en)) {
    result.schools[schoolSlug] = {
      zh: metadata.school_label || schoolSlug,
      en: metadata.school_label_en || schoolSlug,
      color: metadata.school_color || undefined,
    };
  }

  // Region label
  const regionSlug = metadata.region;
  if (regionSlug && (metadata.region_label || metadata.region_label_en)) {
    result.regions[regionSlug] = {
      zh: metadata.region_label || regionSlug,
      en: metadata.region_label_en || regionSlug,
    };
  }

  // Core idea labels + details
  const ideas = metadata.core_ideas;
  if (Array.isArray(ideas)) {
    for (const idea of ideas) {
      if (typeof idea === 'string') {
        const slug = idea;
        result.ideas[slug] = { zh: slug, en: slug };
      } else {
        const slug = idea.slug;
        const label = idea.label;
        const labelEn = idea.label_en;
        if (slug && (label || labelEn)) {
          result.ideas[slug] = {
            zh: label || slug,
            en: labelEn || label || slug,
          };
        }
        // Extract detail fields if present
        if (slug && idea.definition) {
          result.ideaDetails[slug] = {
            slug,
            zh: label || idea.zh || slug,
            definition_zh: idea.definition || '',
            origin_zh: idea.origin || '',
            evolution_zh: idea.evolution || '',
            misconception_zh: idea.misconception || '',
          };
        }
      }
    }
  }

  // School theories
  const theories = metadata.school_theories;
  if (Array.isArray(theories)) {
    for (const t of theories) {
      const school = t.school;
      if (school && t.slug) {
        if (!result.schoolTheories[school]) result.schoolTheories[school] = [];
        result.schoolTheories[school].push({
          slug: t.slug,
          zh: t.zh || t.slug,
          en: t.en || t.slug,
          desc_zh: t.desc_zh || '',
          desc_en: t.desc_en || '',
          icon: t.icon || '📌',
        });
      }
    }
  }

  return result;
}

/**
 * Process a single .md file string.
 */
function processMdContent(
  md: string,
  filename: string,
  notes: Record<string, string>,
  newThinkers: Thinker[],
  labels: ExtractedData,
  errors: string[]
): { noteCount: number; thinkerCount: number } {
  let noteCount = 0;
  let thinkerCount = 0;

  const result = markdownToData(md);
  if (!result) {
    errors.push(`${filename}: parse failed`);
    return { noteCount, thinkerCount };
  }

  // Extract labels, idea details, and school theories from this file's frontmatter
  const fileLabels = extractLabels(result.metadata);
  Object.assign(labels.schools, fileLabels.schools);
  Object.assign(labels.regions, fileLabels.regions);
  Object.assign(labels.ideas, fileLabels.ideas);
  Object.assign(labels.ideaDetails, fileLabels.ideaDetails);
  for (const [school, theories] of Object.entries(fileLabels.schoolTheories)) {
    if (!labels.schoolTheories[school]) labels.schoolTheories[school] = [];
    const slugs = new Set(labels.schoolTheories[school].map((t: any) => t.slug));
    for (const t of theories) {
      if (!slugs.has(t.slug)) {
        labels.schoolTheories[school].push(t);
        slugs.add(t.slug);
      }
    }
  }

  const thinkerId = result.metadata.id || filename.replace('.md', '');
  const note = result.note;

  if (note) {
    notes[thinkerId] = note;
    noteCount++;
  }

  if (result.metadata.id && result.metadata.name) {
    const thinker = metadataToThinker(result.metadata);
    if (thinker) {
      newThinkers.push(thinker);
      thinkerCount++;
    }
  }

  return { noteCount, thinkerCount };
}

/**
 * Import a .zip or .md file. Returns notes to restore AND new thinkers to add,
 * plus any idea details and school theories extracted from the files.
 */
export async function importAllMarkdown(
  file: File
): Promise<{
  notes: Record<string, string>;
  newThinkers: Thinker[];
  labels: { schools: Record<string, { en: string; zh: string; color?: string }>; regions: Record<string, { en: string; zh: string }>; ideas: Record<string, { en: string; zh: string }> };
  ideaDetails: Record<string, IdeaDetail>;
  schoolTheories: Record<string, TheoryModule[]>;
  noteCount: number;
  thinkerCount: number;
  errors: string[];
}> {
  const notes: Record<string, string> = {};
  const newThinkers: Thinker[] = [];
  const labels: ExtractedData = { schools: {}, regions: {}, ideas: {}, ideaDetails: {}, schoolTheories: {} };
  const errors: string[] = [];
  let noteCount = 0;
  let thinkerCount = 0;

  if (file.name.endsWith('.md')) {
    // Single .md file
    const md = await file.text();
    const result = processMdContent(md, file.name, notes, newThinkers, labels, errors);
    noteCount = result.noteCount;
    thinkerCount = result.thinkerCount;
  } else {
    // .zip file
    const zip = new JSZip();
    const loaded = await zip.loadAsync(file);
    const entries = Object.entries(loaded.files).filter(
      ([name]) => name.endsWith('.md')
    );

    for (const [filename, zipEntry] of entries) {
      try {
        const md = await zipEntry.async('string');
        const result = processMdContent(md, filename, notes, newThinkers, labels, errors);
        noteCount += result.noteCount;
        thinkerCount += result.thinkerCount;
      } catch {
        errors.push(`${filename}: read error`);
      }
    }
  }

  return {
    notes,
    newThinkers,
    labels: { schools: labels.schools, regions: labels.regions, ideas: labels.ideas },
    ideaDetails: labels.ideaDetails,
    schoolTheories: labels.schoolTheories,
    noteCount,
    thinkerCount,
    errors,
  };
}
