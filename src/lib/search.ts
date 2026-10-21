import { SERVICES } from "@/data/services";
import { NEWS, SEARCHABLE_PAGES } from "@/data/content";
import { ORG_UNITS, groupOf } from "@/data/organisation";
import { PROJECTS, PROJECT_STATUS } from "@/data/projects";
import type { Service } from "@/lib/types";

// Result rows of the search page. Matching with a query lives in smart-search.ts.
export type Hit = { key: string; kind: string; title: string; text: string; href: string };

export function allInformation(): Hit[] {
  const units: Hit[] = ORG_UNITS.map((u) => ({
    key: `stelle-${u.id}`,
    kind: `${groupOf(u).unitLabel} · ${u.head.role} ${u.head.name}`,
    title: u.name,
    text: u.lead,
    href: `/organisation/${u.id}`,
  }));
  const projects: Hit[] = PROJECTS.map((p) => ({
    key: `projekt-${p.id}`,
    kind: `Projekt · ${PROJECT_STATUS[p.status]}`,
    title: p.title,
    text: p.teaser,
    href: `/projekte/${p.id}`,
  }));
  const pages: Hit[] = SEARCHABLE_PAGES.map((p) => ({
    key: `seite-${p.slug}`,
    kind: "Seite",
    title: p.title,
    text: p.lead,
    href: `/seite/${p.slug}`,
  }));
  const news: Hit[] = NEWS.map((n) => ({
    key: `meldung-${n.id}`,
    kind: `Meldung · ${n.source}`,
    title: n.title,
    text: n.teaser,
    href: `/aktuelles#meldung-${n.id}`,
  }));
  return [...units, ...projects, ...pages, ...news];
}

export function serviceHit(s: Service): Hit {
  return {
    key: s.slug,
    kind: s.online ? "Leistung · online möglich" : "Leistung · vor Ort",
    title: s.title,
    text: s.summary,
    href: `/leistungen/${s.slug}`,
  };
}

export function sortedServices(list: Service[] = SERVICES): Service[] {
  return [...list].sort((a, b) => a.title.localeCompare(b.title, "de"));
}

// Services A to Z, shown when there is no query.
export function allServices(): Hit[] {
  return sortedServices().map(serviceHit);
}
