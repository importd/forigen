import JSZip from 'jszip';
import type { Thinker } from '../types';
import { SCHOOL_LABELS } from '../data/schools';
import { REGION_LABELS, IDEA_LABELS } from '../data/labels';

/**
 * Generate a complete Markdown file for a thinker,
 * with all metadata in YAML frontmatter and notes as body.
 */
function thinkerToMarkdown(thinker: Thinker, note: string): string {
  const school = SCHOOL_LABELS[thinker.school];
  const region = REGION_LABELS[thinker.region];

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
    `key_works:`,
    ...thinker.keyWorks.map(
      (w) => `  - title: "${w.title}"\n    title_zh: "${w.title_zh}"\n    year: ${w.year}`
    ),
    `influenced_by: [${thinker.influencedBy.map((s) => `"${s}"`).join(', ')}]`,
    `influenced: [${thinker.influenced.map((s) => `"${s}"`).join(', ')}]`,
    `core_ideas:`,
    ...thinker.coreIdeas.map((idea) => {
      const label = IDEA_LABELS[idea];
      return `  - slug: "${idea}"\n    label: "${label?.zh || ''}"\n    label_en: "${label?.en || ''}"`;
    }),
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
function markdownToData(md: string): { metadata: Record<string, any>; note: string } | null {
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
  let listItems: any[] = [];

  for (const line of lines) {
    if (line.trim() === '') continue;

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
      }
      continue;
    }

    // Flush list
    if (inList && currentKey) {
      (metadata as any)[currentKey] = listItems;
      listItems = [];
      inList = false;
    }

    // Key-value line
    const kv = line.match(/^(\w[\w_]*):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      let value: any = kv[2].trim();

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
function metadataToThinker(metadata: Record<string, any>): Thinker | null {
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
  };
}

/**
 * Export all thinkers + notes as a zip of Markdown files.
 */
export async function exportAllMarkdown(
  thinkers: Thinker[],
  notes: Record<string, string>
): Promise<void> {
  const zip = new JSZip();

  for (const thinker of thinkers) {
    const note = notes[thinker.id] || '';
    const md = thinkerToMarkdown(thinker, note);
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
 * Import a zip file of Markdown files.
 * Returns notes to restore AND new thinkers to add.
 */
export async function importAllMarkdown(
  file: File
): Promise<{
  notes: Record<string, string>;
  newThinkers: Thinker[];
  noteCount: number;
  thinkerCount: number;
  errors: string[];
}> {
  const zip = new JSZip();
  const loaded = await zip.loadAsync(file);
  const notes: Record<string, string> = {};
  const newThinkers: Thinker[] = [];
  const errors: string[] = [];
  let noteCount = 0;
  let thinkerCount = 0;

  const entries = Object.entries(loaded.files).filter(
    ([name]) => name.endsWith('.md')
  );

  for (const [filename, zipEntry] of entries) {
    try {
      const md = await zipEntry.async('string');
      const result = markdownToData(md);
      if (!result) {
        errors.push(`${filename}: parse failed`);
        continue;
      }

      const thinkerId = result.metadata.id || filename.replace('.md', '');
      const note = result.note;

      if (note) {
        notes[thinkerId] = note;
        noteCount++;
      }

      // Try to extract thinker metadata from frontmatter
      if (result.metadata.id && result.metadata.name) {
        const thinker = metadataToThinker(result.metadata);
        if (thinker) {
          newThinkers.push(thinker);
          thinkerCount++;
        }
      }
    } catch {
      errors.push(`${filename}: read error`);
    }
  }

  return { notes, newThinkers, noteCount, thinkerCount, errors };
}
