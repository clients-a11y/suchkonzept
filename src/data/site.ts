import type { FooterColumn, NavItem } from "@/lib/types";

export type Contact = { office: string; address: string; phone: string; hours?: string };

type Site = {
  name: string;
  mark: { title: string; region: string };
  region: string;
  nav: NavItem[];
  footer: FooterColumn[];
  meta: (NavItem & { icon: "hand" | "book" })[];
  languages: string[];
  contact: Contact & { email: string; hours: string };
  assistant: { greeting: string; starters: string[] };
};

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
        { label: "Testfall Kindergeld", href: "/testfall" },
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
        { label: "Chat-Assistent", href: "/assistent" },
      ],
    },
  ],
  // Quick links above the header: sign language and easy language.
  meta: [
    { label: "Gebärdensprache", href: "/seite/gebaerdensprache", icon: "hand" },
    { label: "Leichte Sprache", href: "/seite/leichte-sprache", icon: "book" },
  ],
  languages: ["Deutsch", "English"],
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
};
