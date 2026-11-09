export type NavItem = { label: string; href: string };

export type FooterColumn = { title: string; links: NavItem[] };

// Who offers a service or publishes a text: the Land itself or a municipality.
export type Level = "kommune" | "land";

// Who a service is for. The start page has one entry for each.
export type Audience = "privat" | "unternehmen";

export type ServiceSection = { title: string; body: string[] };

export type Service = {
  slug: string;
  title: string;
  summary: string;
  keywords: string[];
  // "bund": the same everywhere, neither Land nor municipality makes a difference.
  level: Level | "bund";
  audience: Audience[];
  online: boolean;
  costs: string;
  duration: string;
  documents: string[];
  sections: ServiceSection[];
  // Exists only per place: without a place the one results page has nothing to show.
  regional?: boolean;
  // Places that do not offer it, as place ids.
  notOfferedIn?: string[];
};

// Every picture is an AI-generated sample photo and is labelled as such.
export type Photo = { src: string; alt: string };

export type NewsItem = {
  id: string;
  level: Level;
  title: string;
  teaser: string;
  date: string;
  topic: string;
  source: string;
  image: Photo;
};

export type ContentPage = {
  slug: string;
  title: string;
  lead: string;
  lang?: string;
  sections: { id: string; title: string; body: string[] }[];
};
