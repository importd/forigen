import type { Thinker } from '../types';
import type { IdeaDetail } from './ideaDetails';
import type { TheoryModule } from './schoolTheories';
import { markdownToData, metadataToThinker, extractLabels } from '../utils/markdownIO';

interface SeedData {
  thinkers: Thinker[];
  ideaDetails: Record<string, IdeaDetail>;
  schoolTheories: Record<string, TheoryModule[]>;
  notes: Record<string, string>;
}

let seedCache: SeedData | null = null;
let seedPromise: Promise<SeedData> | null = null;

/**
 * Load seed thinker IDs from index.json, then fetch each .md file.
 * To add a thinker: drop the .md in public/thinkers/ + add the ID to index.json.
 */
export async function loadSeedThinkers(): Promise<SeedData> {
  if (seedCache) return seedCache;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const base = import.meta.env.BASE_URL + 'thinkers/';

    // Load ID list
    const indexRes = await fetch(base + 'index.json');
    if (!indexRes.ok) {
      console.warn('Failed to load thinkers/index.json');
      return { thinkers: [], ideaDetails: {}, schoolTheories: {}, notes: {} };
    }
    const ids: string[] = await indexRes.json();

    const thinkers: Thinker[] = [];
    const allIdeaDetails: Record<string, IdeaDetail> = {};
    const allSchoolTheories: Record<string, TheoryModule[]> = {};
    const allNotes: Record<string, string> = {};

    const results = await Promise.all(
      ids.map(async (id) => {
        try {
          const res = await fetch(base + `${id}.md`);
          if (!res.ok) {
            console.warn(`Seed thinker ${id}.md not found (${res.status})`);
            return null;
          }
          const md = await res.text();
          const parsed = markdownToData(md);
          if (!parsed) {
            console.warn(`Seed thinker ${id}.md failed to parse`);
            return null;
          }
          const thinker = metadataToThinker(parsed.metadata);
          if (!thinker) {
            console.warn(`Seed thinker ${id}.md missing required fields`);
            return null;
          }

          // Extract academic data
          const extracted = extractLabels(parsed.metadata);
          Object.assign(allIdeaDetails, extracted.ideaDetails);
          for (const [school, theories] of Object.entries(extracted.schoolTheories)) {
            if (!allSchoolTheories[school]) allSchoolTheories[school] = [];
            const slugs = new Set(allSchoolTheories[school].map((t) => t.slug));
            for (const t of theories) {
              if (!slugs.has(t.slug)) {
                allSchoolTheories[school].push(t as TheoryModule);
                slugs.add(t.slug);
              }
            }
          }

          return { thinker, note: parsed.note || '' };
        } catch (err) {
          console.warn(`Seed thinker ${id}.md load error:`, err);
          return null;
        }
      })
    );

    for (const r of results) {
      if (r) {
        thinkers.push(r.thinker);
        if (r.note) allNotes[r.thinker.id] = r.note;
      }
    }

    if (thinkers.length < ids.length) {
      console.warn(
        `Loaded ${thinkers.length}/${ids.length} seed thinkers`
      );
    }

    seedCache = { thinkers, ideaDetails: allIdeaDetails, schoolTheories: allSchoolTheories, notes: allNotes };
    return seedCache;
  })();

  return seedPromise;
}

export { metadataToThinker, extractLabels } from '../utils/markdownIO';
