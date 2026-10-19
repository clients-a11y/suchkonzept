import { SERVICES } from "@/data/services";
import { newsFor, pagesFor } from "@/data/content";
import type { Tenant } from "@/lib/types";

export type Hit = { key: string; kind: string; title: string; text: string; href: string };

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

// Every word of the query has to appear somewhere in the record.
function matches(query: string, fields: string[]): boolean {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = normalize(fields.join(" "));
  return words.every((w) => haystack.includes(w));
}

export function searchInformation(tenant: Tenant, query: string): Hit[] {
  const pages: Hit[] = pagesFor(tenant)
    .filter((p) => matches(query, [p.title, p.lead, ...p.sections.flatMap((s) => [s.title, ...s.body])]))
    .map((p) => ({ key: `seite-${p.slug}`, kind: "Seite", title: p.title, text: p.lead, href: `/seite/${p.slug}` }));
  const news: Hit[] = newsFor(tenant)
    .filter((n) => matches(query, [n.title, n.teaser, n.topic, n.source]))
    .map((n) => ({ key: `meldung-${n.id}`, kind: `Meldung · ${n.source}`, title: n.title, text: n.teaser, href: `/aktuelles#meldung-${n.id}` }));
  return [...pages, ...news];
}

export function searchServices(query: string): Hit[] {
  return SERVICES.filter((s) => matches(query, [s.title, s.summary, ...s.keywords]))
    .sort((a, b) => a.title.localeCompare(b.title, "de"))
    .map((s) => ({
      key: s.slug,
      kind: s.online ? "Leistung · online möglich" : "Leistung · vor Ort",
      title: s.title,
      text: s.summary,
      href: `/leistungen/${s.slug}`,
    }));
}
