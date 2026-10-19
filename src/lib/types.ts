export type PortalType = "info" | "service";

export type FontKey = "serif" | "sans" | "hyper";

export type Tokens = {
  primary: string;
  accent: string;
  surface: string;
  headingFont: FontKey;
  bodyFont: FontKey;
  radius: number;
};

export type NavItem = { label: string; href: string };

export type FooterColumn = { title: string; links: NavItem[] };

export type Tenant = {
  id: string;
  name: string;
  kind: string;
  type: PortalType;
  tagline: string;
  region: string;
  tokens: Tokens;
  nav: NavItem[];
  footer: FooterColumn[];
  meta: { dgs: boolean; ls: boolean; es: boolean };
  languages: string[];
  contact: { office: string; address: string; phone: string; hours: string };
  custom?: boolean;
  createdInSeconds?: number;
};

export type ServiceSection = { title: string; body: string[] };

export type Service = {
  slug: string;
  title: string;
  summary: string;
  keywords: string[];
  level: "kommune" | "land";
  online: boolean;
  costs: string;
  duration: string;
  documents: string[];
  sections: ServiceSection[];
};

// Every news item has an illustrated scene from the theme tokens (see NewsArt).
// Seeded tenants can add an AI-generated photo; it is always labelled as such.
export type NewsImage = { scene: string; alt: string; credit: string; photo?: string };

export type NewsItem = {
  id: string;
  tenant: string;
  title: string;
  teaser: string;
  date: string;
  topic: string;
  source: string;
  image?: NewsImage;
};

export type ContentPage = {
  tenant: string;
  slug: string;
  title: string;
  lead: string;
  lang?: string;
  sections: { id: string; title: string; body: string[] }[];
};
