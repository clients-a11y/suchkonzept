import { NEWS } from "@/data/content";
import type { Level, NewsItem } from "@/lib/types";

// Who does what: the Land government with its ministries, and the city administration of
// Beispielstadt as the example of a municipality with its own offices. Other places have one
// general office (see places.ts). All names are deliberate placeholders, no real people.

export type OrgUnit = {
  id: string;
  level: Level;
  // Municipal offices: the place they serve.
  place?: string;
  name: string;
  lead: string;
  head: { name: string; role: string };
  tasks: string[];
  services: string[];
  newsSource?: string;
  newsTopics?: string[];
  address: string;
  phone: string;
  email: string;
  photo: string;
};

export type OrgGroup = {
  id: string;
  title: string;
  lead: string;
  unitLabel: string;
  heading: string;
  hours: string;
  units: OrgUnit[];
};

export const ORGANISATION = {
  title: "Organisation",
  lead: "Wer in Musterland wofür zuständig ist: die Landesregierung mit ihren Ministerien und, als Beispiel für die Gemeinden, die Stadtverwaltung von Beispielstadt.",
};

export const ORG_GROUPS: OrgGroup[] = [
  {
    id: "land",
    title: "Landesregierung",
    lead: "Die Landesregierung besteht aus der Ministerpräsidentin und sieben Ministerien.",
    unitLabel: "Ministerium",
    heading: "Die Ministerien",
    hours: "Mo bis Fr, 8 bis 18 Uhr",
    units: [
      {
        id: "staatskanzlei",
        level: "land",
        name: "Staatskanzlei",
        lead: "Die Staatskanzlei unterstützt die Ministerpräsidentin und stimmt die Arbeit der Ministerien ab.",
        head: { name: "Dr. Erika Mustermann", role: "Ministerpräsidentin" },
        tasks: ["Abstimmung der Landesregierung", "Ehrenamt und Vereine", "Presse und Öffentlichkeitsarbeit", "Vertretung des Landes beim Bund und in Europa"],
        services: ["vereinsfoerderung-beantragen"],
        newsSource: "Staatskanzlei",
        address: "Schlossplatz 1, 10000 Musterstadt",
        phone: "0100 123 45 00",
        email: "poststelle@stk.musterland.example",
        photo: "/images/portraits/musterland-staatskanzlei.webp",
      },
      {
        id: "bildung",
        level: "land",
        name: "Ministerium für Bildung",
        lead: "Das Ministerium ist für Schulen, frühe Bildung und Weiterbildung im ganzen Land zuständig.",
        head: { name: "Sabine Beispiel", role: "Ministerin für Bildung" },
        tasks: ["Schulen und Schulsozialarbeit", "Aufsicht über Kitas und Tagespflege", "Aus- und Weiterbildung von Lehrkräften", "Erwachsenenbildung"],
        services: ["kitaplatz-beantragen"],
        newsSource: "Ministerium für Bildung",
        address: "Lindenallee 4, 10000 Musterstadt",
        phone: "0100 123 46 00",
        email: "poststelle@mb.musterland.example",
        photo: "/images/portraits/musterland-bildung.webp",
      },
      {
        id: "umwelt",
        level: "land",
        name: "Ministerium für Umwelt",
        lead: "Das Ministerium schützt Wasser, Boden, Luft und Natur und plant den Hochwasserschutz.",
        head: { name: "Jonas Vorlage", role: "Minister für Umwelt" },
        tasks: ["Hochwasserschutz und Gewässer", "Natur- und Artenschutz", "Klimaschutz", "Überwachung der Badegewässer"],
        services: ["fischereischein-beantragen"],
        newsSource: "Ministerium für Umwelt",
        address: "Am Ufer 12, 10000 Musterstadt",
        phone: "0100 123 47 00",
        email: "poststelle@mu.musterland.example",
        photo: "/images/portraits/musterland-umwelt.webp",
      },
      {
        id: "gesundheit",
        level: "land",
        name: "Ministerium für Gesundheit und Familie",
        lead: "Das Ministerium sorgt für eine gute medizinische Versorgung und unterstützt Familien, mit der Familienkasse des Landes.",
        head: { name: "Dr. Leyla Platzhalter", role: "Ministerin für Gesundheit und Familie" },
        tasks: ["Ärztliche Versorgung auf dem Land", "Krankenhausplanung", "Pflege", "Familienleistungen und Kindergeld"],
        services: ["kindergeld-beantragen"],
        newsSource: "Ministerium für Gesundheit und Familie",
        address: "Brunnenstraße 8, 10000 Musterstadt",
        phone: "0100 123 48 00",
        email: "poststelle@mg.musterland.example",
        photo: "/images/portraits/musterland-gesundheit.webp",
      },
      {
        id: "wirtschaft",
        level: "land",
        name: "Ministerium für Wirtschaft",
        lead: "Das Ministerium fördert Unternehmen, Handwerk und die Nahversorgung auf dem Land.",
        head: { name: "Tobias Entwurf", role: "Minister für Wirtschaft" },
        tasks: ["Mittelstand und Handwerk", "Nahversorgung und Dorfläden", "Ansiedlung von Unternehmen", "Verkehr, Radwege und Energie"],
        services: ["dorfladen-foerderung-beantragen", "gewerbe-anmelden"],
        newsTopics: ["Wirtschaft"],
        address: "Marktstraße 20, 10000 Musterstadt",
        phone: "0100 123 49 00",
        email: "poststelle@mw.musterland.example",
        photo: "/images/portraits/musterland-wirtschaft.webp",
      },
      {
        id: "digitales",
        level: "land",
        name: "Ministerium für Digitales",
        lead: "Das Ministerium bringt Verwaltungsleistungen ins Netz und baut die digitale Infrastruktur aus.",
        head: { name: "Mia Prototyp", role: "Ministerin für Digitales" },
        tasks: ["Online-Anträge und digitale Verwaltung", "Breitband und Mobilfunk", "IT-Sicherheit", "Offene Daten"],
        services: ["fuehrungszeugnis-beantragen"],
        newsSource: "Ministerium für Digitales",
        address: "Am Netzwerk 1, 10000 Musterstadt",
        phone: "0100 123 50 00",
        email: "poststelle@md.musterland.example",
        photo: "/images/portraits/musterland-digitales.webp",
      },
      {
        id: "inneres",
        level: "land",
        name: "Ministerium für Inneres",
        lead: "Das Ministerium ist für Sicherheit, die Kommunen und das Meldewesen zuständig.",
        head: { name: "Paul Probe", role: "Minister für Inneres" },
        tasks: ["Polizei und Katastrophenschutz", "Kommunen und Kommunalaufsicht", "Meldewesen, Ausweise und Pässe", "Bauordnung"],
        services: ["personalausweis-beantragen", "wohnsitz-anmelden", "baugenehmigung-beantragen"],
        address: "Wallstraße 2, 10000 Musterstadt",
        phone: "0100 123 51 00",
        email: "poststelle@mi.musterland.example",
        photo: "/images/portraits/musterland-inneres.webp",
      },
      {
        id: "finanzen",
        level: "land",
        name: "Ministerium für Finanzen",
        lead: "Das Ministerium stellt den Landeshaushalt auf und führt die Steuerverwaltung.",
        head: { name: "Clara Muster", role: "Ministerin für Finanzen" },
        tasks: ["Landeshaushalt", "Steuerverwaltung und Finanzämter", "Beteiligungen des Landes", "Förderung von Wohnraum"],
        services: ["wohngeld-beantragen"],
        address: "Münzgasse 5, 10000 Musterstadt",
        phone: "0100 123 52 00",
        email: "poststelle@mf.musterland.example",
        photo: "/images/portraits/musterland-finanzen.webp",
      },
    ],
  },
  {
    id: "beispielstadt",
    title: "Stadt Beispielstadt",
    lead: "Die Stadtverwaltung ist in Ämter gegliedert. Sie bearbeiten die Anliegen der Menschen in Beispielstadt.",
    unitLabel: "Amt",
    heading: "Die Ämter",
    hours: "Mo, Di, Do 8 bis 16 Uhr, Mi 8 bis 18 Uhr, Fr 8 bis 12 Uhr",
    units: [
      {
        id: "oberbuergermeisterin",
        level: "kommune",
        place: "beispielstadt",
        name: "Büro der Oberbürgermeisterin Beispielstadt",
        lead: "Die Oberbürgermeisterin leitet die Stadtverwaltung und vertritt die Stadt nach außen.",
        head: { name: "Lena Beispiel", role: "Oberbürgermeisterin" },
        tasks: ["Leitung der Stadtverwaltung", "Stadtrat und Ausschüsse", "Bürgerbeteiligung", "Städtepartnerschaften"],
        services: [],
        address: "Marktplatz 1, 20000 Beispielstadt",
        phone: "0200 98 76 00",
        email: "ob@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-oberbuergermeisterin.webp",
      },
      {
        id: "buergeramt",
        level: "kommune",
        place: "beispielstadt",
        name: "Bürgeramt Beispielstadt",
        lead: "Das Bürgeramt ist die erste Anlaufstelle für Ausweise, Meldewesen und Bescheinigungen.",
        head: { name: "Ali Mustermann", role: "Leitung Bürgeramt" },
        tasks: ["Personalausweise und Reisepässe", "An-, Um- und Abmeldung", "Führungszeugnisse", "Fundbüro"],
        services: ["personalausweis-beantragen", "wohnsitz-anmelden", "fuehrungszeugnis-beantragen"],
        newsSource: "Bürgeramt Beispielstadt",
        address: "Marktplatz 1, 20000 Beispielstadt",
        phone: "0200 98 76 54",
        email: "buergeramt@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-buergeramt.webp",
      },
      {
        id: "jugendamt",
        level: "kommune",
        place: "beispielstadt",
        name: "Jugendamt Beispielstadt",
        lead: "Das Jugendamt vergibt Kitaplätze und berät Familien in allen Lebenslagen.",
        head: { name: "Nora Vorlage", role: "Leitung Jugendamt" },
        tasks: ["Kitaplätze und Kindertagespflege", "Beratung für Familien", "Jugendarbeit", "Elterngeld"],
        services: ["kitaplatz-beantragen"],
        newsSource: "Jugendamt Beispielstadt",
        address: "Schulstraße 3, 20000 Beispielstadt",
        phone: "0200 98 77 10",
        email: "jugendamt@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-jugendamt.webp",
      },
      {
        id: "sozialamt",
        level: "kommune",
        place: "beispielstadt",
        name: "Sozialamt Beispielstadt",
        lead: "Das Sozialamt hilft, wenn das Geld für Miete und Leben nicht reicht.",
        head: { name: "Tom Platzhalter", role: "Leitung Sozialamt" },
        tasks: ["Wohngeld", "Grundsicherung", "Hilfe zur Pflege", "Sozialberatung in den Stadtteilen"],
        services: ["wohngeld-beantragen"],
        newsSource: "Sozialamt Beispielstadt",
        address: "Hafenstraße 14, 20000 Beispielstadt",
        phone: "0200 98 77 20",
        email: "sozialamt@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-sozialamt.webp",
      },
      {
        id: "bauordnungsamt",
        level: "kommune",
        place: "beispielstadt",
        name: "Bauordnungsamt Beispielstadt",
        lead: "Das Bauordnungsamt prüft Bauanträge und berät, bevor Sie bauen.",
        head: { name: "Jana Entwurf", role: "Leitung Bauordnungsamt" },
        tasks: ["Baugenehmigungen", "Bauberatung", "Denkmalschutz", "Abnahme von Bauvorhaben"],
        services: ["baugenehmigung-beantragen"],
        address: "Am Kanal 7, 20000 Beispielstadt",
        phone: "0200 98 77 30",
        email: "bauordnung@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-bauordnungsamt.webp",
      },
      {
        id: "tiefbauamt",
        level: "kommune",
        place: "beispielstadt",
        name: "Tiefbauamt Beispielstadt",
        lead: "Das Tiefbauamt plant und baut Straßen, Wege und Brücken und koordiniert Baustellen.",
        head: { name: "Ben Skizze", role: "Leitung Tiefbauamt" },
        tasks: ["Straßen, Wege und Brücken", "Baustellen und Umleitungen", "Straßenbeleuchtung", "Radwege"],
        services: [],
        newsSource: "Tiefbauamt Beispielstadt",
        address: "Am Kanal 9, 20000 Beispielstadt",
        phone: "0200 98 77 40",
        email: "tiefbau@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-tiefbauamt.webp",
      },
      {
        id: "steueramt",
        level: "kommune",
        place: "beispielstadt",
        name: "Steueramt Beispielstadt",
        lead: "Das Steueramt erhebt die städtischen Steuern und Gebühren.",
        head: { name: "Paula Probe", role: "Leitung Steueramt" },
        tasks: ["Hundesteuer", "Grundsteuer", "Gewerbesteuer", "Gebühren und Beiträge"],
        services: ["hund-anmelden"],
        address: "Marktplatz 3, 20000 Beispielstadt",
        phone: "0200 98 77 50",
        email: "steueramt@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-steueramt.webp",
      },
      {
        id: "ordnungsamt",
        level: "kommune",
        place: "beispielstadt",
        name: "Ordnungsamt Beispielstadt",
        lead: "Das Ordnungsamt sorgt für Sicherheit und Ordnung im Stadtgebiet.",
        head: { name: "Eva Muster", role: "Leitung Ordnungsamt" },
        tasks: ["Veranstaltungen und Straßensperrungen", "Fischereischeine", "Gewerbeanmeldungen", "Verkehrsüberwachung"],
        services: ["fischereischein-beantragen", "gewerbe-anmelden"],
        newsSource: "Ordnungsamt Beispielstadt",
        address: "Marktplatz 5, 20000 Beispielstadt",
        phone: "0200 98 77 60",
        email: "ordnungsamt@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-ordnungsamt.webp",
      },
      {
        id: "gruenflaechenamt",
        level: "kommune",
        place: "beispielstadt",
        name: "Grünflächenamt Beispielstadt",
        lead: "Das Grünflächenamt pflegt Parks, Spielplätze und Stadtbäume.",
        head: { name: "Ida Konzept", role: "Leitung Grünflächenamt" },
        tasks: ["Parks und Hundewiesen", "Spielplätze", "Stadtbäume", "Friedhöfe"],
        services: [],
        newsSource: "Grünflächenamt Beispielstadt",
        address: "Parkweg 2, 20000 Beispielstadt",
        phone: "0200 98 77 70",
        email: "gruen@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-gruenflaechenamt.webp",
      },
      {
        id: "strassenverkehrsamt",
        level: "kommune",
        place: "beispielstadt",
        name: "Straßenverkehrsamt Beispielstadt",
        lead: "Das Straßenverkehrsamt lässt Fahrzeuge zu und vergibt Kennzeichen.",
        head: { name: "Kai Testfall", role: "Leitung Straßenverkehrsamt" },
        tasks: ["Zulassung von Fahrzeugen", "Kennzeichen", "Führerscheine", "Parkausweise"],
        services: ["fahrzeug-zulassen"],
        address: "Hafenstraße 30, 20000 Beispielstadt",
        phone: "0200 98 77 80",
        email: "zulassung@beispielstadt.example",
        photo: "/images/portraits/beispielstadt-strassenverkehrsamt.webp",
      },
    ],
  },
];

export const ORG_UNITS: OrgUnit[] = ORG_GROUPS.flatMap((g) => g.units);

export function findUnit(id: string): OrgUnit | undefined {
  return ORG_UNITS.find((u) => u.id === id);
}

export function groupOf(unit: OrgUnit): OrgGroup {
  return ORG_GROUPS.find((g) => g.units.includes(unit))!;
}

// The ministry for a service: it offers Land services itself and oversees municipal ones.
export function landUnitFor(slug: string): OrgUnit | undefined {
  return ORG_UNITS.find((u) => u.level === "land" && u.services.includes(slug));
}

// The office of a place that handles a service, if the place has its own offices here.
export function localUnitFor(placeId: string, slug: string): OrgUnit | undefined {
  return ORG_UNITS.find((u) => u.place === placeId && u.services.includes(slug));
}

export function newsForUnit(unit: OrgUnit): NewsItem[] {
  return NEWS.filter((n) => n.source === unit.newsSource || Boolean(unit.newsTopics?.includes(n.topic)));
}
