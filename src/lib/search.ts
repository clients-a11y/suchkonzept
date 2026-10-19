import { SERVICES } from "@/data/services";
import { newsFor, pagesFor } from "@/data/content";
import { organisationFor } from "@/data/organisation";
import { PROJECT_STATUS, projectsFor } from "@/data/projects";
import type { Service, Tenant } from "@/lib/types";

// Result rows of the search page. Matching with a query lives in smart-search.ts.
export type Hit = { key: string; kind: string; title: string; text: string; href: string };

export function allInformation(tenant: Tenant): Hit[] {
  const pages: Hit[] = pagesFor(tenant).map((p) => ({
    key: `seite-${p.slug}`,
    kind: "Seite",
    title: p.title,
    text: p.lead,
    href: `/seite/${p.slug}`,
  }));
  const news: Hit[] = newsFor(tenant).map((n) => ({
    key: `meldung-${n.id}`,
    kind: `Meldung · ${n.source}`,
    title: n.title,
    text: n.teaser,
    href: `/aktuelles#meldung-${n.id}`,
  }));
  const org = organisationFor(tenant);
  const units: Hit[] = org.units.map((u) => ({
    key: `stelle-${u.id}`,
    kind: `${org.unitLabel} · ${u.head.role} ${u.head.name}`,
    title: u.name,
    text: u.lead,
    href: `/organisation/${u.id}`,
  }));
  const projects: Hit[] = projectsFor(tenant).projects.map((p) => ({
    key: `projekt-${p.id}`,
    kind: `Projekt · ${PROJECT_STATUS[p.status]}`,
    title: p.title,
    text: p.teaser,
    href: `/projekte/${p.id}`,
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

// Services A to Z, shown when there is no query.
export function allServices(): Hit[] {
  return [...SERVICES].sort((a, b) => a.title.localeCompare(b.title, "de")).map(serviceHit);
}
