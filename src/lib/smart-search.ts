import { SERVICES, findService } from "@/data/services";
import { newsFor, pagesFor } from "@/data/content";
import { INTENTS, STOPWORDS } from "@/data/intents";
import { organisationFor } from "@/data/organisation";
import { PROJECT_STATUS, projectsFor } from "@/data/projects";
import type { Service, Tenant } from "@/lib/types";

// Local stand-in for an AI-assisted search: understands phrases in plain words,
// tolerates typos and picks a best match. No network, no model, only the data in src/data.

export type InfoHit = { key: string; kind: string; title: string; text: string; href: string; score: number };
export type ServiceHit = { service: Service; score: number };
export type SmartResult = {
  query: string;
  services: ServiceHit[];
  info: InfoHit[];
  answer?: Service;
  related: Service[];
  correction?: string;
};

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(/[\s-]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function trigrams(word: string): Set<string> {
  const padded = ` ${word} `;
  const set = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) set.add(padded.slice(i, i + 3));
  return set;
}

function similarity(a: string, b: string): number {
  const ta = trigrams(a);
  const tb = trigrams(b);
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  return (2 * shared) / (ta.size + tb.size);
}

type Match = "exact" | "prefix" | "fuzzy" | null;

function compare(query: string, word: string, typing: boolean): Match {
  if (query === word) return "exact";
  if (query.length >= 3 && word.startsWith(query) && (typing || query.length >= 4)) return "prefix";
  // Compound words in both directions: "genehmigung" in "baugenehmigung", "hund" in "hundesteuer"
  if (query.length >= 6 && word.includes(query)) return "prefix";
  if (word.length >= 4 && query.startsWith(word)) return "prefix";
  if (query.length >= 5 && word.length >= 5 && Math.abs(query.length - word.length) <= 3) {
    let common = 0;
    while (common < query.length && query[common] === word[common]) common++;
    if (common >= 5 || similarity(query, word) >= 0.5) return "fuzzy";
  }
  return null;
}

type Vocab = { word: string; display: string; weight: number }[];

const VOCAB = new Map<string, Vocab>(
  SERVICES.map((s) => {
    const list: Vocab = [];
    for (const raw of s.title.split(/\s+/)) {
      const word = normalize(raw);
      if (word && !STOPWORDS.has(word)) list.push({ word, display: raw, weight: 6 });
    }
    for (const k of s.keywords) list.push({ word: normalize(k), display: k, weight: 4 });
    for (const word of tokens(s.summary)) list.push({ word, display: word, weight: 1 });
    return [s.slug, list];
  }),
);

function phraseMatches(phrase: string, query: string, queryTokens: string[], typing: boolean): boolean {
  if (` ${query} `.includes(` ${phrase} `)) return true;
  // While typing, "umgez" already points to "umgezogen".
  const last = queryTokens[queryTokens.length - 1];
  if (typing && !phrase.includes(" ") && last.length >= 4 && phrase.startsWith(last)) return true;
  const parts = phrase.split(" ");
  return parts.length > 1 && parts.every((p) => queryTokens.some((t) => compare(t, p, false) !== null));
}

// Exact words in the title count most, similar words less, words in the text least.
function scoreText(queryTokens: string[], title: string, text: string): number {
  const titleWords = tokens(title);
  const textWords = tokens(text);
  let score = 0;
  for (const t of queryTokens) {
    const inTitle = titleWords.map((w) => compare(t, w, false));
    if (inTitle.includes("exact")) score += 4;
    else if (inTitle.some(Boolean)) score += 2;
    else if (textWords.some((w) => compare(t, w, false))) score += 1;
  }
  return score;
}

export function smartSearch(tenant: Tenant, input: string, typing = false): SmartResult {
  const query = normalize(input);
  const queryTokens = tokens(input);
  const empty: SmartResult = { query: input.trim(), services: [], info: [], related: [] };
  if (!queryTokens.length) return empty;

  const scores = new Map<string, number>();
  const related = new Set<string>();
  const add = (slug: string, points: number) => scores.set(slug, (scores.get(slug) ?? 0) + points);

  for (const intent of INTENTS) {
    const hits = intent.phrases.filter((p) => phraseMatches(p, query, queryTokens, typing));
    if (!hits.length) continue;
    const points = hits.some((p) => p.includes(" ")) ? 8 : 5;
    for (const slug of intent.services) add(slug, points);
    for (const slug of intent.related) related.add(slug);
  }

  // Word by word against titles, keywords and summaries. The last word may still be typed.
  let correction: string | undefined;
  let corrected = input.trim();
  queryTokens.forEach((t, i) => {
    const lastWord = typing && i === queryTokens.length - 1;
    let matchedSomewhere = false;
    let bestFuzzy: { display: string; sim: number } | undefined;
    for (const [slug, vocab] of VOCAB) {
      let best = 0;
      for (const v of vocab) {
        const m = compare(t, v.word, lastWord);
        if (!m) continue;
        if (m !== "fuzzy") matchedSomewhere = true;
        const points = m === "exact" ? v.weight : Math.max(1, v.weight - 1);
        best = Math.max(best, points);
        if (m === "fuzzy" && v.weight > 1) {
          const sim = similarity(t, v.word);
          if (!bestFuzzy || sim > bestFuzzy.sim) bestFuzzy = { display: v.display, sim };
        }
      }
      if (best) add(slug, best);
    }
    // Fuzzy only fires for words of similar length, so a half-typed word is never "corrected".
    if (!matchedSomewhere && bestFuzzy) {
      // Replace the misspelled word in what the person typed, keep everything else.
      const fix = bestFuzzy.display;
      corrected = corrected
        .split(/(\s+)/)
        .map((w) => (normalize(w) === t ? fix : w))
        .join("");
      correction = corrected;
    }
  });

  const services = [...scores]
    .map(([slug, score]) => ({ service: findService(slug)!, score }))
    .filter((h) => h.service)
    .sort((a, b) => b.score - a.score || a.service.title.localeCompare(b.service.title, "de"));

  const [top, second] = services;
  const answer = top && top.score >= 5 && (!second || top.score >= second.score + 3) ? top.service : undefined;

  const shown = new Set(services.slice(0, 5).map((h) => h.service.slug));
  const relatedServices = [...related]
    .filter((slug) => !shown.has(slug))
    .map((slug) => findService(slug))
    .filter((s): s is Service => Boolean(s))
    .slice(0, 3);

  const org = organisationFor(tenant);
  const info: InfoHit[] = [
    ...org.units.map((u) => ({
      key: `stelle-${u.id}`,
      kind: `${org.unitLabel} · ${u.head.role} ${u.head.name}`,
      title: u.name,
      text: u.lead,
      href: `/organisation/${u.id}`,
      score: scoreText(queryTokens, `${u.name} ${u.head.name}`, [u.lead, u.head.role, ...u.tasks].join(" ")),
    })),
    ...projectsFor(tenant).projects.map((p) => ({
      key: `projekt-${p.id}`,
      kind: `Projekt · ${PROJECT_STATUS[p.status]}`,
      title: p.title,
      text: p.teaser,
      href: `/projekte/${p.id}`,
      score: scoreText(queryTokens, p.title, [p.teaser, ...p.description, p.location].join(" ")),
    })),
    ...pagesFor(tenant).map((p) => ({
      key: `seite-${p.slug}`,
      kind: "Seite",
      title: p.title,
      text: p.lead,
      href: `/seite/${p.slug}`,
      score: scoreText(queryTokens, p.title, [p.lead, ...p.sections.flatMap((s) => [s.title, ...s.body])].join(" ")),
    })),
    ...newsFor(tenant).map((n) => ({
      key: `meldung-${n.id}`,
      kind: `Meldung · ${n.source}`,
      title: n.title,
      text: n.teaser,
      href: `/aktuelles#meldung-${n.id}`,
      score: scoreText(queryTokens, `${n.title} ${n.topic}`, `${n.teaser} ${n.source}`),
    })),
  ]
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);

  return { query: input.trim(), services, info, answer, related: relatedServices, correction };
}
