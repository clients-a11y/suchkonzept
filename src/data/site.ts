import type { FooterColumn, NavItem } from "@/lib/types";

export type Contact = { office: string; address: string; phone: string; hours?: string };

type Site = {
  name: string;
  mark: { title: string; region: string };
  region: string;
  nav: NavItem[];
  footer: FooterColumn[];
  contact: Contact & { email: string; hours: string };
  assistant: { greeting: string; starters: string[] };
  // Page with the diagrams of the search switch, for stakeholders.
  searchDiagram: string;
};

// The chat is left out of the portal for the user tests: no window, no links to it. Its page stays
// reachable for the optional test case /testfall/chat. Set to true to bring it back everywhere.
export const CHAT_IN_PORTAL: boolean = false;

// The list of suggestions under the search field comes back with the AI search. Set to true to show it again.
export const SUGGESTIONS_IN_SEARCH: boolean = false;

// The user tests show one results page for services and information; only an unclear term asks
// "Was suchen Sie?" first. Set to false for the earlier flow, which also asks for the place before the results (/suche).
export const ONE_RESULTS_PAGE: boolean = true;
export const SEARCH_PATH = ONE_RESULTS_PAGE ? "/ergebnisse" : "/suche";

// The one portal of this prototype: services of the Land and its municipalities in one place.
// Musterland, its places and everything on these pages are fictional.
export const SITE: Site = {
  name: "Verwaltungsportal Musterland",
  // The word mark sets the two parts on two lines.
  mark: { title: "Verwaltungsportal", region: "Musterland" },
  region: "Musterland",
  nav: [
    { label: "Leistungen", href: "/leistungen" },
    { label: "Aktuelles", href: "/aktuelles" },
    { label: "Organisation", href: "/organisation" },
    { label: "Projekte", href: "/projekte" },
    { label: "Land und Leute", href: "/seite/land-und-leute" },
  ],
  footer: [
    {
      title: "Allgemein",
      links: [
        { label: "Über dieses Portal", href: "/seite/ueber-das-portal" },
        { label: "Leistungen A bis Z", href: "/leistungen" },
        { label: "Aktuelles", href: "/aktuelles" },
        { label: "So entscheidet die Suche", href: "/so-entscheidet-die-suche" },
      ],
    },
    {
      title: "Rechtliches",
      links: [
        { label: "Impressum", href: "/seite/impressum" },
        { label: "Datenschutz", href: "/seite/datenschutz" },
        { label: "Barrierefreiheit", href: "/seite/barrierefreiheit" },
      ],
    },
    {
      title: "Kontakt und Hilfe",
      links: [
        { label: "Kontakt", href: "/seite/kontakt" },
        { label: "Hilfe zum Portal", href: "/seite/hilfe" },
        ...(CHAT_IN_PORTAL ? [{ label: "Chat-Assistent", href: "/assistent" }] : []),
      ],
    },
  ],
  contact: {
    office: "Bürgerservice Musterland",
    address: "Schlossplatz 1, 10000 Musterstadt",
    phone: "0100 123 45 67",
    email: "buergerservice@musterland.example",
    hours: "Mo bis Fr, 8 bis 18 Uhr",
  },
  assistant: {
    greeting:
      "Guten Tag! Ich bin der automatische Assistent des Verwaltungsportals Musterland. Ich finde mit Ihnen die passende Leistung und die zuständige Stelle, auch in Ihrer Gemeinde.",
    starters: ["Kindergeld beantragen", "Mein Ausweis läuft ab", "Wie ist der Stand meines Antrags?"],
  },
  searchDiagram: "/so-entscheidet-die-suche",
};
