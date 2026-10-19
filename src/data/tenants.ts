import type { Tenant } from "@/lib/types";

// Two seeded, fictional tenants. Everything here is configuration:
// a third tenant is created in the browser by the onboarding wizard.
export const TENANTS: Tenant[] = [
  {
    id: "musterland",
    name: "Musterland",
    kind: "Land",
    type: "info",
    tagline: "Landesportal",
    region: "Musterland",
    tokens: {
      primary: "#5b3a6e",
      accent: "#d9b26f",
      surface: "#f6f2f7",
      headingFont: "serif",
      bodyFont: "sans",
      radius: 2,
    },
    nav: [
      { label: "Land und Leute", href: "/seite/land-und-leute" },
      { label: "Regierung", href: "/seite/regierung" },
      { label: "Aktuelles", href: "/aktuelles" },
      { label: "Verwaltungsleistungen", href: "/suche?tab=leistungen" },
    ],
    footer: [
      {
        title: "Landesportal",
        links: [
          { label: "Land und Leute", href: "/seite/land-und-leute" },
          { label: "Regierung", href: "/seite/regierung" },
          { label: "Aktuelles", href: "/aktuelles" },
        ],
      },
      {
        title: "Service",
        links: [
          { label: "Verwaltungsleistungen", href: "/suche?tab=leistungen" },
          { label: "Kontakt", href: "/seite/regierung#kontakt" },
        ],
      },
      {
        title: "Rechtliches",
        links: [
          { label: "Impressum", href: "/seite/regierung#impressum" },
          { label: "Datenschutz", href: "/seite/regierung#datenschutz" },
          { label: "Barrierefreiheit", href: "/seite/regierung#barrierefreiheit" },
        ],
      },
    ],
    meta: { dgs: true, ls: true, es: true },
    languages: ["Deutsch", "English"],
    contact: {
      office: "Bürgerservice der Landesregierung",
      address: "Schlossplatz 1, 10000 Musterstadt",
      phone: "0100 123 45 67",
      hours: "Mo bis Fr, 8 bis 18 Uhr",
    },
  },
  {
    id: "beispielstadt",
    name: "Beispielstadt",
    kind: "Stadt",
    type: "service",
    tagline: "Serviceportal",
    region: "Beispielstadt",
    tokens: {
      primary: "#00707a",
      accent: "#f4a259",
      surface: "#eef6f6",
      headingFont: "hyper",
      bodyFont: "hyper",
      radius: 14,
    },
    nav: [
      { label: "Leistungen A bis Z", href: "/suche?tab=leistungen" },
      { label: "Lebenslagen", href: "/seite/lebenslagen" },
      { label: "Rathaus", href: "/seite/rathaus" },
      { label: "Aktuelles", href: "/aktuelles" },
    ],
    footer: [
      {
        title: "Rathaus",
        links: [
          { label: "Öffnungszeiten", href: "/seite/rathaus#oeffnungszeiten" },
          { label: "Kontakt", href: "/seite/rathaus#kontakt" },
        ],
      },
      {
        title: "Service",
        links: [
          { label: "Leistungen A bis Z", href: "/suche?tab=leistungen" },
          { label: "Lebenslagen", href: "/seite/lebenslagen" },
        ],
      },
      {
        title: "Rechtliches",
        links: [
          { label: "Impressum", href: "/seite/rathaus#impressum" },
          { label: "Datenschutz", href: "/seite/rathaus#datenschutz" },
          { label: "Barrierefreiheit", href: "/seite/rathaus#barrierefreiheit" },
        ],
      },
    ],
    meta: { dgs: false, ls: true, es: true },
    languages: ["Deutsch"],
    contact: {
      office: "Bürgeramt Beispielstadt",
      address: "Marktplatz 1, 20000 Beispielstadt",
      phone: "0200 98 76 54",
      hours: "Mo, Di, Do 8 bis 16 Uhr, Mi 8 bis 18 Uhr, Fr 8 bis 12 Uhr",
    },
  },
];

export function findSeedTenant(id: string): Tenant | undefined {
  return TENANTS.find((t) => t.id === id);
}

// Default navigation for tenants created in the wizard, by portal type.
export function defaultNav(type: Tenant["type"]): Tenant["nav"] {
  return type === "service"
    ? [
        { label: "Leistungen A bis Z", href: "/suche?tab=leistungen" },
        { label: "Aktuelles", href: "/aktuelles" },
        { label: "Über uns", href: "/seite/ueber-uns" },
      ]
    : [
        { label: "Aktuelles", href: "/aktuelles" },
        { label: "Über uns", href: "/seite/ueber-uns" },
        { label: "Verwaltungsleistungen", href: "/suche?tab=leistungen" },
      ];
}
