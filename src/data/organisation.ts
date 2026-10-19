import { newsFor } from "@/data/content";
import type { NewsItem, Tenant } from "@/lib/types";

// Who does what: ministries of a Land, offices of a city. Like everything else this is
// configuration per tenant; tenants from the wizard get a template.
// All names are deliberate placeholders (Mustermann, Beispiel, Vorlage …), no real people.

export type OrgUnit = {
  id: string;
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
  portrait: number;
  photo?: string;
};

export type Organisation = {
  title: string;
  lead: string;
  unitLabel: string;
  heading: string;
  units: OrgUnit[];
};

const ORGANISATIONS: Record<string, Organisation> = {
  musterland: {
    title: "Landesregierung",
    lead: "Die Landesregierung besteht aus der Ministerpräsidentin und sieben Ministerien. Hier finden Sie, wer wofür zuständig ist.",
    unitLabel: "Ministerium",
    heading: "Die Ministerien",
    units: [
      {
        id: "staatskanzlei",
        name: "Staatskanzlei",
        lead: "Die Staatskanzlei unterstützt die Ministerpräsidentin und stimmt die Arbeit der Ministerien ab.",
        head: { name: "Dr. Erika Mustermann", role: "Ministerpräsidentin" },
        tasks: ["Abstimmung der Landesregierung", "Ehrenamt und Vereine", "Presse und Öffentlichkeitsarbeit", "Vertretung des Landes beim Bund und in Europa"],
        services: ["vereinsfoerderung-beantragen"],
        newsSource: "Staatskanzlei",
        address: "Schlossplatz 1, 10000 Musterstadt",
        phone: "0100 123 45 00",
        email: "poststelle@stk.musterland.example",
        portrait: 0,
        photo: "/images/portraits/musterland-staatskanzlei.webp",
      },
      {
        id: "bildung",
        name: "Ministerium für Bildung",
        lead: "Das Ministerium ist für Schulen, frühe Bildung und Weiterbildung im ganzen Land zuständig.",
        head: { name: "Sabine Beispiel", role: "Ministerin für Bildung" },
        tasks: ["Schulen und Schulsozialarbeit", "Aufsicht über Kitas und Tagespflege", "Aus- und Weiterbildung von Lehrkräften", "Erwachsenenbildung"],
        services: ["kitaplatz-beantragen"],
        newsSource: "Ministerium für Bildung",
        address: "Lindenallee 4, 10000 Musterstadt",
        phone: "0100 123 46 00",
        email: "poststelle@mb.musterland.example",
        portrait: 1,
        photo: "/images/portraits/musterland-bildung.webp",
      },
      {
        id: "umwelt",
        name: "Ministerium für Umwelt",
        lead: "Das Ministerium schützt Wasser, Boden, Luft und Natur und plant den Hochwasserschutz.",
        head: { name: "Jonas Vorlage", role: "Minister für Umwelt" },
        tasks: ["Hochwasserschutz und Gewässer", "Natur- und Artenschutz", "Klimaschutz", "Überwachung der Badegewässer"],
        services: ["fischereischein-beantragen"],
        newsSource: "Ministerium für Umwelt",
        address: "Am Ufer 12, 10000 Musterstadt",
        phone: "0100 123 47 00",
        email: "poststelle@mu.musterland.example",
        portrait: 2,
        photo: "/images/portraits/musterland-umwelt.webp",
      },
      {
        id: "gesundheit",
        name: "Ministerium für Gesundheit",
        lead: "Das Ministerium sorgt für eine gute medizinische Versorgung in Stadt und Land.",
        head: { name: "Dr. Leyla Platzhalter", role: "Ministerin für Gesundheit" },
        tasks: ["Ärztliche Versorgung auf dem Land", "Krankenhausplanung", "Pflege", "Öffentlicher Gesundheitsdienst"],
        services: [],
        newsSource: "Ministerium für Gesundheit",
        address: "Brunnenstraße 8, 10000 Musterstadt",
        phone: "0100 123 48 00",
        email: "poststelle@mg.musterland.example",
        portrait: 3,
        photo: "/images/portraits/musterland-gesundheit.webp",
      },
      {
        id: "wirtschaft",
        name: "Ministerium für Wirtschaft",
        lead: "Das Ministerium fördert Unternehmen, Handwerk und die Nahversorgung auf dem Land.",
        head: { name: "Tobias Entwurf", role: "Minister für Wirtschaft" },
        tasks: ["Mittelstand und Handwerk", "Nahversorgung und Dorfläden", "Ansiedlung von Unternehmen", "Tourismus"],
        services: [],
        newsTopics: ["Wirtschaft"],
        address: "Marktstraße 20, 10000 Musterstadt",
        phone: "0100 123 49 00",
        email: "poststelle@mw.musterland.example",
        portrait: 4,
        photo: "/images/portraits/musterland-wirtschaft.webp",
      },
      {
        id: "digitales",
        name: "Ministerium für Digitales",
        lead: "Das Ministerium bringt Verwaltungsleistungen ins Netz und baut die digitale Infrastruktur aus.",
        head: { name: "Mia Prototyp", role: "Ministerin für Digitales" },
        tasks: ["Online-Anträge und digitale Verwaltung", "Breitband und Mobilfunk", "IT-Sicherheit", "Offene Daten"],
        services: ["baugenehmigung-beantragen", "fuehrungszeugnis-beantragen"],
        newsSource: "Ministerium für Digitales",
        address: "Am Netzwerk 1, 10000 Musterstadt",
        phone: "0100 123 50 00",
        email: "poststelle@md.musterland.example",
        portrait: 5,
        photo: "/images/portraits/musterland-digitales.webp",
      },
      {
        id: "inneres",
        name: "Ministerium für Inneres",
        lead: "Das Ministerium ist für Sicherheit, die Kommunen und das Meldewesen zuständig.",
        head: { name: "Paul Probe", role: "Minister für Inneres" },
        tasks: ["Polizei und Katastrophenschutz", "Kommunen und Kommunalaufsicht", "Meldewesen, Ausweise und Pässe", "Bauordnung"],
        services: ["personalausweis-beantragen", "wohnsitz-anmelden", "baugenehmigung-beantragen"],
        address: "Wallstraße 2, 10000 Musterstadt",
        phone: "0100 123 51 00",
        email: "poststelle@mi.musterland.example",
        portrait: 6,
        photo: "/images/portraits/musterland-inneres.webp",
      },
      {
        id: "finanzen",
        name: "Ministerium für Finanzen",
        lead: "Das Ministerium stellt den Landeshaushalt auf und führt die Steuerverwaltung.",
        head: { name: "Clara Muster", role: "Ministerin für Finanzen" },
        tasks: ["Landeshaushalt", "Steuerverwaltung und Finanzämter", "Beteiligungen des Landes", "Förderung von Wohnraum"],
        services: ["wohngeld-beantragen"],
        address: "Münzgasse 5, 10000 Musterstadt",
        phone: "0100 123 52 00",
        email: "poststelle@mf.musterland.example",
        portrait: 7,
        photo: "/images/portraits/musterland-finanzen.webp",
      },
    ],
  },
  beispielstadt: {
    title: "Ämter und Ansprechpersonen",
    lead: "Die Stadtverwaltung ist in Ämter gegliedert. Hier sehen Sie, welches Amt Ihr Anliegen bearbeitet und wie Sie es erreichen.",
    unitLabel: "Amt",
    heading: "Die Ämter",
    units: [
      {
        id: "oberbuergermeisterin",
        name: "Büro der Oberbürgermeisterin",
        lead: "Die Oberbürgermeisterin leitet die Stadtverwaltung und vertritt die Stadt nach außen.",
        head: { name: "Lena Beispiel", role: "Oberbürgermeisterin" },
        tasks: ["Leitung der Stadtverwaltung", "Stadtrat und Ausschüsse", "Bürgerbeteiligung", "Städtepartnerschaften"],
        services: [],
        address: "Marktplatz 1, 20000 Beispielstadt",
        phone: "0200 98 76 00",
        email: "ob@beispielstadt.example",
        portrait: 1,
        photo: "/images/portraits/beispielstadt-oberbuergermeisterin.webp",
      },
      {
        id: "buergeramt",
        name: "Bürgeramt",
        lead: "Das Bürgeramt ist die erste Anlaufstelle für Ausweise, Meldewesen und Bescheinigungen.",
        head: { name: "Ali Mustermann", role: "Leitung Bürgeramt" },
        tasks: ["Personalausweise und Reisepässe", "An-, Um- und Abmeldung", "Führungszeugnisse", "Fundbüro"],
        services: ["personalausweis-beantragen", "wohnsitz-anmelden", "fuehrungszeugnis-beantragen"],
        newsSource: "Bürgeramt",
        address: "Marktplatz 1, 20000 Beispielstadt",
        phone: "0200 98 76 54",
        email: "buergeramt@beispielstadt.example",
        portrait: 6,
        photo: "/images/portraits/beispielstadt-buergeramt.webp",
      },
      {
        id: "jugendamt",
        name: "Jugendamt",
        lead: "Das Jugendamt vergibt Kitaplätze und berät Familien in allen Lebenslagen.",
        head: { name: "Nora Vorlage", role: "Leitung Jugendamt" },
        tasks: ["Kitaplätze und Kindertagespflege", "Beratung für Familien", "Jugendarbeit", "Elterngeld"],
        services: ["kitaplatz-beantragen"],
        newsSource: "Jugendamt",
        address: "Schulstraße 3, 20000 Beispielstadt",
        phone: "0200 98 77 10",
        email: "jugendamt@beispielstadt.example",
        portrait: 3,
        photo: "/images/portraits/beispielstadt-jugendamt.webp",
      },
      {
        id: "sozialamt",
        name: "Sozialamt",
        lead: "Das Sozialamt hilft, wenn das Geld für Miete und Leben nicht reicht.",
        head: { name: "Tom Platzhalter", role: "Leitung Sozialamt" },
        tasks: ["Wohngeld", "Grundsicherung", "Hilfe zur Pflege", "Sozialberatung in den Stadtteilen"],
        services: ["wohngeld-beantragen"],
        newsSource: "Sozialamt",
        address: "Hafenstraße 14, 20000 Beispielstadt",
        phone: "0200 98 77 20",
        email: "sozialamt@beispielstadt.example",
        portrait: 4,
        photo: "/images/portraits/beispielstadt-sozialamt.webp",
      },
      {
        id: "bauordnungsamt",
        name: "Bauordnungsamt",
        lead: "Das Bauordnungsamt prüft Bauanträge und berät, bevor Sie bauen.",
        head: { name: "Jana Entwurf", role: "Leitung Bauordnungsamt" },
        tasks: ["Baugenehmigungen", "Bauberatung", "Denkmalschutz", "Abnahme von Bauvorhaben"],
        services: ["baugenehmigung-beantragen"],
        address: "Am Kanal 7, 20000 Beispielstadt",
        phone: "0200 98 77 30",
        email: "bauordnung@beispielstadt.example",
        portrait: 5,
        photo: "/images/portraits/beispielstadt-bauordnungsamt.webp",
      },
      {
        id: "tiefbauamt",
        name: "Tiefbauamt",
        lead: "Das Tiefbauamt plant und baut Straßen, Wege und Brücken und koordiniert Baustellen.",
        head: { name: "Ben Skizze", role: "Leitung Tiefbauamt" },
        tasks: ["Straßen, Wege und Brücken", "Baustellen und Umleitungen", "Straßenbeleuchtung", "Radwege"],
        services: [],
        newsSource: "Tiefbauamt",
        address: "Am Kanal 9, 20000 Beispielstadt",
        phone: "0200 98 77 40",
        email: "tiefbau@beispielstadt.example",
        portrait: 2,
        photo: "/images/portraits/beispielstadt-tiefbauamt.webp",
      },
      {
        id: "steueramt",
        name: "Steueramt",
        lead: "Das Steueramt erhebt die städtischen Steuern und Gebühren.",
        head: { name: "Paula Probe", role: "Leitung Steueramt" },
        tasks: ["Hundesteuer", "Grundsteuer", "Gewerbesteuer", "Gebühren und Beiträge"],
        services: ["hund-anmelden"],
        address: "Marktplatz 3, 20000 Beispielstadt",
        phone: "0200 98 77 50",
        email: "steueramt@beispielstadt.example",
        portrait: 7,
        photo: "/images/portraits/beispielstadt-steueramt.webp",
      },
      {
        id: "ordnungsamt",
        name: "Ordnungsamt",
        lead: "Das Ordnungsamt sorgt für Sicherheit und Ordnung im Stadtgebiet.",
        head: { name: "Eva Muster", role: "Leitung Ordnungsamt" },
        tasks: ["Veranstaltungen und Straßensperrungen", "Fischereischeine", "Gewerbeanmeldungen", "Verkehrsüberwachung"],
        services: ["fischereischein-beantragen"],
        newsSource: "Ordnungsamt",
        address: "Marktplatz 5, 20000 Beispielstadt",
        phone: "0200 98 77 60",
        email: "ordnungsamt@beispielstadt.example",
        portrait: 0,
        photo: "/images/portraits/beispielstadt-ordnungsamt.webp",
      },
      {
        id: "gruenflaechenamt",
        name: "Grünflächenamt",
        lead: "Das Grünflächenamt pflegt Parks, Spielplätze und Stadtbäume.",
        head: { name: "Ida Konzept", role: "Leitung Grünflächenamt" },
        tasks: ["Parks und Hundewiesen", "Spielplätze", "Stadtbäume", "Friedhöfe"],
        services: [],
        newsSource: "Grünflächenamt",
        address: "Parkweg 2, 20000 Beispielstadt",
        phone: "0200 98 77 70",
        email: "gruen@beispielstadt.example",
        portrait: 3,
        photo: "/images/portraits/beispielstadt-gruenflaechenamt.webp",
      },
      {
        id: "strassenverkehrsamt",
        name: "Straßenverkehrsamt",
        lead: "Das Straßenverkehrsamt lässt Fahrzeuge zu und vergibt Kennzeichen.",
        head: { name: "Kai Testfall", role: "Leitung Straßenverkehrsamt" },
        tasks: ["Zulassung von Fahrzeugen", "Kennzeichen", "Führerscheine", "Parkausweise"],
        services: ["fahrzeug-zulassen"],
        address: "Hafenstraße 30, 20000 Beispielstadt",
        phone: "0200 98 77 80",
        email: "zulassung@beispielstadt.example",
        portrait: 6,
        photo: "/images/portraits/beispielstadt-strassenverkehrsamt.webp",
      },
    ],
  },
};

// Template for tenants from the wizard: three units, heads still to be named ("N. N.").
function template(tenant: Tenant): Organisation {
  const domain = `${tenant.id}.example`;
  const base = { address: tenant.contact.address, phone: tenant.contact.phone };
  if (tenant.type === "service") {
    return {
      title: "Ämter und Ansprechpersonen",
      lead: `So ist die Verwaltung von ${tenant.name} aufgebaut. Die Redaktion ergänzt Namen und Aufgaben im CMS.`,
      unitLabel: "Amt",
      heading: "Die Ämter",
      units: [
        { id: "buergeramt", name: "Bürgeramt", lead: "Erste Anlaufstelle für Ausweise, Meldewesen und Bescheinigungen.", head: { name: "N. N.", role: "Leitung Bürgeramt" }, tasks: ["Ausweise und Pässe", "Meldewesen", "Führungszeugnisse"], services: ["personalausweis-beantragen", "wohnsitz-anmelden", "fuehrungszeugnis-beantragen"], ...base, email: `buergeramt@${domain}`, portrait: 6, newsSource: "Redaktion" },
        { id: "ordnungsamt", name: "Ordnungsamt", lead: "Sicherheit, Ordnung und Genehmigungen im Gemeindegebiet.", head: { name: "N. N.", role: "Leitung Ordnungsamt" }, tasks: ["Veranstaltungen", "Hundesteuer", "Fischereischeine"], services: ["hund-anmelden", "fischereischein-beantragen"], ...base, email: `ordnungsamt@${domain}`, portrait: 0 },
        { id: "bauamt", name: "Bauamt", lead: "Bauanträge, Bauberatung und Wohnen.", head: { name: "N. N.", role: "Leitung Bauamt" }, tasks: ["Baugenehmigungen", "Bauberatung", "Wohngeld"], services: ["baugenehmigung-beantragen", "wohngeld-beantragen"], ...base, email: `bauamt@${domain}`, portrait: 5 },
      ],
    };
  }
  return {
    title: "Verwaltung",
    lead: `So ist die Verwaltung von ${tenant.name} aufgebaut. Die Redaktion ergänzt Namen und Aufgaben im CMS.`,
    unitLabel: "Bereich",
    heading: "Die Bereiche",
    units: [
      { id: "leitung", name: "Leitung der Verwaltung", lead: "Leitet die Verwaltung und vertritt sie nach außen.", head: { name: "N. N.", role: "Leitung" }, tasks: ["Leitung und Abstimmung", "Presse und Öffentlichkeitsarbeit", "Ehrenamt"], services: ["vereinsfoerderung-beantragen"], ...base, email: `leitung@${domain}`, portrait: 1, newsSource: "Redaktion" },
      { id: "buergerservice", name: "Bürgerservice", lead: "Anlaufstelle für Fragen und Anträge.", head: { name: "N. N.", role: "Leitung Bürgerservice" }, tasks: ["Auskünfte", "Ausweise und Meldewesen", "Führungszeugnisse"], services: ["personalausweis-beantragen", "fuehrungszeugnis-beantragen"], ...base, email: `service@${domain}`, portrait: 6 },
      { id: "bauen-umwelt", name: "Bauen und Umwelt", lead: "Bauanträge, Natur und Gewässer.", head: { name: "N. N.", role: "Leitung Bauen und Umwelt" }, tasks: ["Baugenehmigungen", "Naturschutz", "Gewässer"], services: ["baugenehmigung-beantragen", "fischereischein-beantragen"], ...base, email: `bauen@${domain}`, portrait: 2 },
    ],
  };
}

export function organisationFor(tenant: Tenant): Organisation {
  return ORGANISATIONS[tenant.id] ?? template(tenant);
}

export function unitFor(tenant: Tenant, id: string): OrgUnit | undefined {
  return organisationFor(tenant).units.find((u) => u.id === id);
}

// The unit that offers a service, if the tenant lists one.
export function unitForService(tenant: Tenant, slug: string): OrgUnit | undefined {
  return organisationFor(tenant).units.find((u) => u.services.includes(slug));
}

export function seedUnitIds(tenantId: string): string[] {
  return (ORGANISATIONS[tenantId]?.units ?? []).map((u) => u.id);
}

export function newsForUnit(tenant: Tenant, unit: OrgUnit): NewsItem[] {
  return newsFor(tenant).filter(
    (n) => n.source === unit.newsSource || Boolean(unit.newsTopics?.includes(n.topic)),
  );
}
