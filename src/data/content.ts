import type { ContentPage, NewsItem, Tenant } from "@/lib/types";

const NEWS: NewsItem[] = [
  { id: "m1", tenant: "musterland", title: "Landesregierung beschließt Programm für Dorfläden", teaser: "Bis 2028 fließen Mittel in Nahversorgung auf dem Land. Anträge sind ab Januar möglich.", date: "2026-10-14", topic: "Wirtschaft", source: "Staatskanzlei", image: { scene: "laden", alt: "Dorfladen mit gestreifter Markise, davor Kisten mit Obst, Gemüse und Kürbissen", photo: "/images/news/m1-dorfladen.webp", credit: "Staatskanzlei/Bildstelle" } },
  { id: "m2", tenant: "musterland", title: "Neue Schulsozialarbeit an 40 Standorten", teaser: "Das Bildungsministerium stockt die Stellen auf. Schulen können sich bis Ende November melden.", date: "2026-10-09", topic: "Bildung", source: "Ministerium für Bildung", image: { scene: "schule", alt: "Eingang eines modernen Schulgebäudes mit Fahrradständern und Herbstbäumen", photo: "/images/news/m2-schule.webp", credit: "Ministerium für Bildung" } },
  { id: "m3", tenant: "musterland", title: "Hochwasserschutz an der Musterau fertig", teaser: "Der neue Deich schützt rund 3.000 Haushalte. Der Radweg auf der Deichkrone ist wieder offen.", date: "2026-10-02", topic: "Umwelt", source: "Ministerium für Umwelt", image: { scene: "deich", alt: "Luftbild eines grünen Deichs am Fluss mit Radweg auf der Krone, dahinter ein Dorf", photo: "/images/news/m3-deich.webp", credit: "Ministerium für Umwelt/Luftbild" } },
  { id: "m4", tenant: "musterland", title: "Vereinsförderung: zweiter Stichtag naht", teaser: "Vereine können Projekte für das kommende Jahr bis zum 30. September einreichen.", date: "2026-09-18", topic: "Ehrenamt", source: "Staatskanzlei", image: { scene: "verein", alt: "Ehrenamtliche stellen in einer hellen Halle Tische und Stühle auf", photo: "/images/news/m4-verein.webp", credit: "Staatskanzlei/Bildstelle" } },
  { id: "m5", tenant: "musterland", title: "Landarztquote zeigt erste Wirkung", teaser: "Zwölf Ärztinnen und Ärzte haben sich in unterversorgten Regionen niedergelassen.", date: "2026-08-27", topic: "Gesundheit", source: "Ministerium für Gesundheit", image: { scene: "praxis", alt: "Eingang einer Arztpraxis in einem renovierten Dorfhaus mit Bank und Pflanzen", photo: "/images/news/m5-praxis.webp", credit: "Ministerium für Gesundheit" } },
  { id: "m6", tenant: "musterland", title: "Digitale Bauanträge in allen Landkreisen", teaser: "Ab sofort lassen sich Bauanträge im ganzen Land vollständig online stellen.", date: "2026-07-15", topic: "Digitales", source: "Ministerium für Digitales", image: { scene: "digital", alt: "Laptop mit einem Grundriss auf dem Bildschirm, daneben Kaffeetasse und Pflanze", photo: "/images/news/m6-digital.webp", credit: "Ministerium für Digitales" } },
  { id: "m7", tenant: "musterland", title: "Sommerferien: Badestellen mit bester Wasserqualität", teaser: "41 von 44 Badestellen erhalten die Bestnote. Die Karte zeigt alle Messwerte.", date: "2025-07-01", topic: "Umwelt", source: "Ministerium für Umwelt", image: { scene: "see", alt: "Holzsteg an einem klaren See mit Bojen, im Hintergrund Wald", photo: "/images/news/m7-see.webp", credit: "Ministerium für Umwelt" } },
  { id: "b1", tenant: "beispielstadt", title: "Bürgeramt jetzt auch samstags geöffnet", teaser: "Ab November öffnet das Bürgeramt jeden ersten Samstag im Monat von 9 bis 13 Uhr.", date: "2026-10-15", topic: "Rathaus", source: "Bürgeramt", image: { scene: "rathaus", alt: "Historisches Rathaus mit Uhrturm am Marktplatz im Morgenlicht", photo: "/images/news/b1-rathaus.webp", credit: "Stadt Beispielstadt/Presseamt" } },
  { id: "b2", tenant: "beispielstadt", title: "Kitaplätze: Anmeldung für 2027 startet", teaser: "Eltern können ab sofort ihre Wunsch-Kitas im Serviceportal angeben.", date: "2026-10-06", topic: "Familie", source: "Jugendamt", image: { scene: "spielplatz", alt: "Spielplatz einer Kita mit Rutsche, Schaukel und Sandkasten im Herbstlaub", photo: "/images/news/b2-spielplatz.webp", credit: "Jugendamt Beispielstadt" } },
  { id: "b3", tenant: "beispielstadt", title: "Baustelle Marktplatz: Umleitung für Busse", teaser: "Die Linien 2 und 5 fahren bis Dezember über die Hafenstraße.", date: "2026-09-29", topic: "Verkehr", source: "Tiefbauamt", image: { scene: "bus", alt: "Linienbus fährt an einer Baustellenabsperrung mit Warnleuchten vorbei", photo: "/images/news/b3-baustelle.webp", credit: "Tiefbauamt Beispielstadt" } },
  { id: "b4", tenant: "beispielstadt", title: "Neue Hundewiese im Stadtpark", teaser: "Die eingezäunte Fläche ist rund um die Uhr geöffnet.", date: "2026-09-12", topic: "Umwelt", source: "Grünflächenamt", image: { scene: "park", alt: "Hund läuft auf einer eingezäunten Wiese im Stadtpark einem Ball hinterher", photo: "/images/news/b4-hundewiese.webp", credit: "Grünflächenamt Beispielstadt" } },
  { id: "b5", tenant: "beispielstadt", title: "Wohngeld: Beratung in den Stadtteilen", teaser: "Die Wohngeldstelle berät im Oktober in drei Stadtteilbüros ohne Termin.", date: "2026-08-30", topic: "Soziales", source: "Sozialamt", image: { scene: "haeuser", alt: "Reihe bunter Wohnhäuser mit Vorgärten und Fahrrädern", photo: "/images/news/b5-wohnen.webp", credit: "Sozialamt Beispielstadt" } },
  { id: "b6", tenant: "beispielstadt", title: "Stadtfest: Straßensperrungen am Wochenende", teaser: "Die Altstadt ist von Freitag bis Sonntag für Autos gesperrt.", date: "2025-08-20", topic: "Verkehr", source: "Ordnungsamt", image: { scene: "fest", alt: "Altstadtgasse mit Wimpelketten und Marktständen beim Stadtfest", photo: "/images/news/b6-stadtfest.webp", credit: "Ordnungsamt Beispielstadt" } },
];

export function newsFor(tenant: Tenant): NewsItem[] {
  const own = NEWS.filter((n) => n.tenant === tenant.id);
  if (own.length) return own;
  // Placeholder news for tenants created in the wizard.
  return [
    { id: `${tenant.id}-1`, tenant: tenant.id, title: `${tenant.name} hat ein neues Portal`, teaser: "Die neue Website ist online. Inhalte werden in den nächsten Wochen ergänzt.", date: "2026-10-19", topic: "Allgemeines", source: "Redaktion", image: { scene: "portal", alt: `Landschaft in den Farben von ${tenant.name}`, credit: `${tenant.name}/Redaktion` } },
    { id: `${tenant.id}-2`, tenant: tenant.id, title: "Beispielmeldung: Termine online buchen", teaser: "Termine für Behördengänge lassen sich jetzt über das Portal buchen.", date: "2026-10-12", topic: "Service", source: "Redaktion", image: { scene: "digital", alt: "Laptop mit einem Formular und einem Haken auf dem Bildschirm", credit: `${tenant.name}/Redaktion` } },
    { id: `${tenant.id}-3`, tenant: tenant.id, title: "Beispielmeldung: Sprechstunde vor Ort", teaser: "Diese Meldung ist ein Platzhalter aus der Vorlage.", date: "2026-09-30", topic: "Allgemeines", source: "Redaktion", image: { scene: "rathaus", alt: "Verwaltungsgebäude mit Uhrturm", credit: `${tenant.name}/Redaktion` } },
  ];
}

const PAGES: ContentPage[] = [
  {
    tenant: "musterland",
    slug: "land-und-leute",
    title: "Land und Leute",
    lead: "Musterland liegt zwischen Mittelgebirge und Seenplatte. Hier leben rund 1,9 Millionen Menschen in 214 Gemeinden.",
    sections: [
      { id: "geschichte", title: "Geschichte", body: ["Musterland entstand 1947 aus zwei Provinzen. Die Landesverfassung gilt seit 1992.", "Die Landeshauptstadt ist Musterstadt."] },
      { id: "regionen", title: "Regionen", body: ["Der Norden ist von Seen und Landwirtschaft geprägt, der Süden von Wald und Handwerk.", "Fünf Landkreise und zwei kreisfreie Städte gliedern das Land."] },
      { id: "zahlen", title: "Zahlen und Fakten", body: ["Fläche: 18.400 Quadratkilometer.", "Größte Arbeitgeber: Gesundheitswesen, Handwerk, Logistik."] },
    ],
  },
  {
    tenant: "musterland",
    slug: "regierung",
    title: "Kontakt und Rechtliches",
    lead: "Kontakt zur Landesregierung sowie Impressum, Datenschutz und Erklärung zur Barrierefreiheit.",
    sections: [
      { id: "ministerien", title: "Ministerien", body: ["Alle Ministerien mit Aufgaben, Leitung und Kontakt stehen auf der Seite Landesregierung."] },
      { id: "kontakt", title: "Kontakt", body: ["Bürgerservice der Landesregierung, Schlossplatz 1, 10000 Musterstadt.", "Telefon 0100 123 45 67, Montag bis Freitag 8 bis 18 Uhr."] },
      { id: "impressum", title: "Impressum", body: ["Platzhalter: Hier steht das Impressum des Mandanten."] },
      { id: "datenschutz", title: "Datenschutz", body: ["Platzhalter: Hier steht die Datenschutzerklärung des Mandanten."] },
      { id: "barrierefreiheit", title: "Barrierefreiheit", body: ["Platzhalter: Hier steht die Erklärung zur Barrierefreiheit."] },
    ],
  },
  {
    tenant: "beispielstadt",
    slug: "lebenslagen",
    title: "Lebenslagen",
    lead: "Finden Sie Leistungen nach dem, was gerade in Ihrem Leben passiert.",
    sections: [
      { id: "umzug", title: "Umzug", body: ["Wohnsitz anmelden, Hund ummelden, Fahrzeug umschreiben."] },
      { id: "familie", title: "Familie und Kinder", body: ["Kitaplatz beantragen, Wohngeld beantragen."] },
      { id: "bauen", title: "Bauen und Wohnen", body: ["Baugenehmigung beantragen, Wohngeld beantragen."] },
      { id: "freizeit", title: "Freizeit und Ehrenamt", body: ["Fischereischein beantragen, Führungszeugnis für das Ehrenamt."] },
    ],
  },
  {
    tenant: "beispielstadt",
    slug: "rathaus",
    title: "Rathaus",
    lead: "Das Bürgeramt am Marktplatz ist Ihre erste Anlaufstelle für fast alle Anliegen.",
    sections: [
      { id: "oeffnungszeiten", title: "Öffnungszeiten", body: ["Montag, Dienstag, Donnerstag 8 bis 16 Uhr.", "Mittwoch 8 bis 18 Uhr, Freitag 8 bis 12 Uhr.", "Jeden ersten Samstag im Monat 9 bis 13 Uhr."] },
      { id: "kontakt", title: "Kontakt", body: ["Bürgeramt Beispielstadt, Marktplatz 1, 20000 Beispielstadt.", "Telefon 0200 98 76 54."] },
      { id: "impressum", title: "Impressum", body: ["Platzhalter: Hier steht das Impressum des Mandanten."] },
      { id: "datenschutz", title: "Datenschutz", body: ["Platzhalter: Hier steht die Datenschutzerklärung des Mandanten."] },
      { id: "barrierefreiheit", title: "Barrierefreiheit", body: ["Platzhalter: Hier steht die Erklärung zur Barrierefreiheit."] },
    ],
  },
];

// Languages a tenant can offer besides German. Each gets a placeholder page.
export const LANGUAGES = [
  { name: "English", code: "en", title: "English", lead: "This page is a placeholder for the English version of the portal." },
  { name: "Français", code: "fr", title: "Français", lead: "Cette page remplace la future version française du portail." },
  { name: "Polski", code: "pl", title: "Polski", lead: "Ta strona jest miejscem na przyszłą polską wersję portalu." },
  { name: "Türkçe", code: "tr", title: "Türkçe", lead: "Bu sayfa, portalın gelecekteki Türkçe sürümü için bir yer tutucudur." },
  { name: "Українська", code: "uk", title: "Українська", lead: "Ця сторінка зарезервована для майбутньої української версії порталу." },
];

export function languageSlug(name: string): string | undefined {
  const lang = LANGUAGES.find((l) => l.name === name);
  return lang ? `sprache-${lang.code}` : undefined;
}

// Placeholder pages behind the header slots for sign language, easy and plain language.
const META_PAGES: { slug: string; title: string; lead: string; body: string }[] = [
  { slug: "gebaerdensprache", title: "Gebärdensprache", lead: "Hier stehen später Videos in Deutscher Gebärdensprache.", body: "Platzhalter: Die Redaktion stellt hier Videos mit Untertiteln ein." },
  { slug: "leichte-sprache", title: "Leichte Sprache", lead: "Hier gibt es bald Texte in Leichter Sprache.", body: "Platzhalter: Die Redaktion stellt hier geprüfte Texte in Leichter Sprache ein." },
  { slug: "einfache-sprache", title: "Einfache Sprache", lead: "Hier gibt es bald die wichtigsten Inhalte in Einfacher Sprache.", body: "Platzhalter: Die Redaktion stellt hier kurze, klare Fassungen der Inhalte ein." },
];

export const META_SLUGS = [...META_PAGES.map((p) => p.slug), ...LANGUAGES.map((l) => `sprache-${l.code}`)];

function placeholderPage(tenant: Tenant, slug: string): ContentPage | undefined {
  const meta = META_PAGES.find((p) => p.slug === slug);
  if (meta) {
    return {
      tenant: tenant.id,
      slug,
      title: meta.title,
      lead: meta.lead,
      sections: [{ id: "inhalt-folgt", title: "Inhalt folgt", body: [meta.body] }],
    };
  }
  const lang = LANGUAGES.find((l) => `sprache-${l.code}` === slug);
  if (lang && tenant.languages.includes(lang.name)) {
    return { tenant: tenant.id, slug, title: lang.title, lead: lang.lead, lang: lang.code, sections: [] };
  }
  return undefined;
}

export function pageFor(tenant: Tenant, slug: string): ContentPage | undefined {
  const own = PAGES.find((p) => p.tenant === tenant.id && p.slug === slug);
  if (own) return own;
  const placeholder = placeholderPage(tenant, slug);
  if (placeholder) return placeholder;
  if (slug === "ueber-uns") {
    return {
      tenant: tenant.id,
      slug,
      title: `Über ${tenant.name}`,
      lead: "Diese Seite stammt aus der Vorlage für neue Mandanten. Die Redaktion ersetzt die Texte im CMS.",
      sections: [
        { id: "kontakt", title: "Kontakt", body: [`${tenant.contact.office}, ${tenant.contact.address}.`, `Telefon ${tenant.contact.phone}.`] },
        { id: "impressum", title: "Impressum", body: ["Platzhalter aus der Vorlage."] },
        { id: "datenschutz", title: "Datenschutz", body: ["Platzhalter aus der Vorlage."] },
        { id: "barrierefreiheit", title: "Barrierefreiheit", body: ["Platzhalter aus der Vorlage."] },
      ],
    };
  }
  return undefined;
}

export function pagesFor(tenant: Tenant): ContentPage[] {
  const own = PAGES.filter((p) => p.tenant === tenant.id);
  if (own.length) return own;
  const about = pageFor(tenant, "ueber-uns");
  return about ? [about] : [];
}

// Themes shown on the start page of information portals.
export const THEMES = [
  { title: "Bildung", text: "Schulen, Kitas, Weiterbildung", query: "bildung" },
  { title: "Umwelt", text: "Natur, Wasser, Klimaschutz", query: "umwelt" },
  { title: "Wirtschaft", text: "Förderung, Arbeit, Ansiedlung", query: "wirtschaft" },
  { title: "Gesundheit", text: "Versorgung, Pflege, Vorsorge", query: "gesundheit" },
];

// Services shown under "Häufig gesucht", by portal type.
export const FEATURED_SERVICES: Record<Tenant["type"], string[]> = {
  info: ["vereinsfoerderung-beantragen", "baugenehmigung-beantragen", "fuehrungszeugnis-beantragen", "fischereischein-beantragen"],
  service: ["personalausweis-beantragen", "wohnsitz-anmelden", "kitaplatz-beantragen", "hund-anmelden", "wohngeld-beantragen", "fahrzeug-zulassen"],
};

// Fictional places for the optional location choice in information portals.
export const PLACES = [
  { id: "musterstadt", name: "Musterstadt", office: "Bürgeramt Musterstadt", address: "Rathausplatz 1, 10000 Musterstadt", phone: "0100 200 10 00" },
  { id: "seehausen", name: "Seehausen", office: "Bürgerbüro Seehausen", address: "Am Ufer 4, 10200 Seehausen", phone: "0102 30 40" },
  { id: "waldheim", name: "Waldheim", office: "Amt Waldheim", address: "Lindenweg 12, 10300 Waldheim", phone: "0103 55 66" },
  { id: "neudorf", name: "Neudorf", office: "Gemeindeverwaltung Neudorf", address: "Dorfstraße 2, 10400 Neudorf", phone: "0104 12 34" },
  { id: "bergtal", name: "Bergtal", office: "Bürgeramt Bergtal", address: "Talstraße 9, 10500 Bergtal", phone: "0105 98 76" },
];

// Life situations shown on the start page of service portals.
export const LIFE_SITUATIONS = [
  { title: "Umzug", services: ["wohnsitz-anmelden", "hund-anmelden", "fahrzeug-zulassen"] },
  { title: "Familie und Kinder", services: ["kitaplatz-beantragen", "wohngeld-beantragen"] },
  { title: "Bauen und Wohnen", services: ["baugenehmigung-beantragen", "wohngeld-beantragen"] },
  { title: "Freizeit und Ehrenamt", services: ["fischereischein-beantragen", "fuehrungszeugnis-beantragen"] },
];
