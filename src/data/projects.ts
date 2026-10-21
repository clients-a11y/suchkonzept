import { NEWS } from "@/data/content";
import type { Level, NewsItem, Photo } from "@/lib/types";

// Major projects of the Land and of Beispielstadt. All figures are invented example values.

export type ProjectStatus = "planung" | "bau" | "fertig";

export type Milestone = { date: string; label: string; done: boolean };

export type Project = {
  id: string;
  level: Level;
  title: string;
  teaser: string;
  description: string[];
  status: ProjectStatus;
  progress: number;
  budget: string;
  budgetMio: number;
  period: string;
  location: string;
  unitId?: string;
  newsIds: string[];
  milestones: Milestone[];
  image: Photo;
};

export const PROJECT_STATUS: Record<ProjectStatus, string> = {
  planung: "In Planung",
  bau: "Im Bau",
  fertig: "Abgeschlossen",
};

export const PROJECTS_PAGE = {
  title: "Großprojekte",
  lead: "Was Land und Gemeinden in Musterland bauen und planen: Schutz vor Hochwasser, schnelles Internet, Gesundheit, Mobilität, Energie und Projekte in Beispielstadt. Mit Stand, Kosten und nächsten Schritten.",
};

export const PROJECTS: Project[] = [
  {
    id: "hochwasserschutz-musterau",
    level: "land",
    title: "Hochwasserschutz an der Musterau",
    teaser: "Ein neuer Deich auf 14 Kilometern schützt rund 3.000 Haushalte. Auf der Deichkrone verläuft ein Radweg.",
    description: [
      "Nach dem Hochwasser 2019 hat das Land den Deich an der Musterau zwischen Seehausen und Neudorf neu gebaut. Der Deich ist höher, breiter und hält einem Hochwasser stand, wie es statistisch einmal in 200 Jahren vorkommt.",
      "Auf der Deichkrone verläuft ein neuer Radweg, der an das Radnetz der Region anschließt. Ausgleichsflächen für Natur liegen auf der Flussseite.",
    ],
    status: "fertig",
    progress: 100,
    budget: "86 Mio. Euro",
    budgetMio: 86,
    period: "2021 bis 2026",
    location: "Musterau zwischen Seehausen und Neudorf",
    unitId: "umwelt",
    newsIds: ["m3"],
    milestones: [
      { date: "2021-03", label: "Planfeststellung abgeschlossen", done: true },
      { date: "2022-06", label: "Baubeginn am ersten Abschnitt", done: true },
      { date: "2025-11", label: "Deich auf ganzer Länge fertig", done: true },
      { date: "2026-10", label: "Radweg auf der Deichkrone freigegeben", done: true },
    ],
    image: { src: "/images/news/m3-deich.webp", alt: "Luftbild eines grünen Deichs am Fluss mit Radweg auf der Krone, dahinter ein Dorf" },
  },
  {
    id: "glasfaser-fuer-alle",
    level: "land",
    title: "Glasfaser für alle Gemeinden",
    teaser: "Bis 2028 soll jeder Haushalt im Land einen Glasfaseranschluss bekommen können, auch in kleinen Dörfern.",
    description: [
      "Wo sich der Ausbau für Unternehmen nicht lohnt, fördern Land und Bund gemeinsam. Die Landkreise schreiben die Gebiete aus, das Land übernimmt einen Teil der Kosten.",
      "In 132 von 214 Gemeinden wird bereits gebaut oder ist der Ausbau fertig.",
    ],
    status: "bau",
    progress: 64,
    budget: "240 Mio. Euro, davon 96 Mio. Euro vom Land",
    budgetMio: 240,
    period: "2023 bis 2028",
    location: "Landesweit in 214 Gemeinden",
    unitId: "digitales",
    newsIds: ["m6"],
    milestones: [
      { date: "2023-02", label: "Förderprogramm gestartet", done: true },
      { date: "2024-09", label: "Alle Ausbaugebiete vergeben", done: true },
      { date: "2026-06", label: "Hälfte der Gemeinden angeschlossen", done: true },
      { date: "2028-12", label: "Ausbau abgeschlossen", done: false },
    ],
    image: { src: "/images/projects/glasfaser.webp", alt: "Offener Graben an einer Landstraße mit orangefarbenen Leerrohren für Glasfaser und einem kleinen Bagger" },
  },
  {
    id: "landesklinikum-musterstadt",
    level: "land",
    title: "Neubau Landesklinikum Musterstadt",
    teaser: "Ein neues Klinikum mit 600 Betten ersetzt drei alte Standorte. Der Rohbau steht.",
    description: [
      "Das neue Klinikum bündelt Notaufnahme, Operationssäle und Fachabteilungen an einem Ort. Kurze Wege sollen Behandlung und Arbeit leichter machen.",
      "Der Rohbau ist fertig, jetzt folgen Technik und Innenausbau. Die drei bisherigen Standorte bleiben bis zum Umzug in Betrieb.",
    ],
    status: "bau",
    progress: 38,
    budget: "410 Mio. Euro",
    budgetMio: 410,
    period: "2024 bis 2030",
    location: "Musterstadt, Am Klinikpark",
    unitId: "gesundheit",
    newsIds: ["m5"],
    milestones: [
      { date: "2024-04", label: "Spatenstich", done: true },
      { date: "2026-08", label: "Rohbau fertig", done: true },
      { date: "2028-12", label: "Technik und Innenausbau fertig", done: false },
      { date: "2030-03", label: "Umzug und Eröffnung", done: false },
    ],
    image: { src: "/images/projects/klinikum.webp", alt: "Baustelle eines großen Krankenhauses mit zwei Turmdrehkränen und mehrgeschossigem Rohbau" },
  },
  {
    id: "radschnellweg-musterstadt-seehausen",
    level: "land",
    title: "Radschnellweg Musterstadt bis Seehausen",
    teaser: "22 Kilometer breiter, kreuzungsarmer Radweg für Pendlerinnen und Pendler zwischen Landeshauptstadt und Seehausen.",
    description: [
      "Der Radschnellweg ist vier Meter breit, beleuchtet und hat kaum Kreuzungen. Mit dem Rad soll die Strecke in unter einer Stunde zu schaffen sein.",
      "Zurzeit läuft die Planung. Bürgerinnen und Bürger konnten sich in drei Werkstätten zur Trasse äußern.",
    ],
    status: "planung",
    progress: 15,
    budget: "28 Mio. Euro",
    budgetMio: 28,
    period: "2025 bis 2029",
    location: "Zwischen Musterstadt und Seehausen",
    unitId: "wirtschaft",
    newsIds: [],
    milestones: [
      { date: "2025-05", label: "Machbarkeitsstudie fertig", done: true },
      { date: "2026-03", label: "Beteiligung zur Trasse abgeschlossen", done: true },
      { date: "2027-06", label: "Baurecht", done: false },
      { date: "2029-09", label: "Freigabe", done: false },
    ],
    image: { src: "/images/projects/radweg.webp", alt: "Breiter neuer Radweg durch offene Landschaft, in der Ferne einige Radfahrende" },
  },
  {
    id: "energiepark-nord",
    level: "land",
    title: "Energiepark Nord",
    teaser: "Solar- und Windenergie für 180.000 Haushalte. Das Land fördert Netzanschluss und Speicher.",
    description: [
      "Im Norden des Landes entsteht ein Energiepark mit Solaranlagen, Windrädern und einem großen Stromspeicher. Gebaut und betrieben wird er von privaten Unternehmen.",
      "Das Land fördert den Netzanschluss und den Speicher. Die umliegenden Gemeinden werden an den Erträgen beteiligt.",
    ],
    status: "planung",
    progress: 25,
    budget: "1,2 Mrd. Euro, davon 60 Mio. Euro Förderung",
    budgetMio: 1200,
    period: "2026 bis 2031",
    location: "Norden des Landes, bei Bergtal",
    unitId: "wirtschaft",
    newsIds: ["m1"],
    milestones: [
      { date: "2025-10", label: "Flächen gesichert", done: true },
      { date: "2026-09", label: "Genehmigung beantragt", done: true },
      { date: "2027-09", label: "Baubeginn Solarfeld", done: false },
      { date: "2031-06", label: "Vollbetrieb", done: false },
    ],
    image: { src: "/images/projects/energiepark.webp", alt: "Reihen von Solarmodulen, am Horizont Windräder und ein kleines Umspannwerk" },
  },
  {
    id: "marktplatz-beispielstadt",
    level: "kommune",
    title: "Neugestaltung Marktplatz Beispielstadt",
    teaser: "Mehr Grün, mehr Platz für Fußgängerinnen und Fußgänger, neue Bushaltestellen. Bis Dezember fahren Busse eine Umleitung.",
    description: [
      "Der Marktplatz bekommt einen neuen Belag, 24 neue Bäume, Sitzplätze und einen Brunnen. Die Bushaltestellen werden barrierefrei.",
      "Gebaut wird in drei Abschnitten, damit Markt und Geschäfte erreichbar bleiben.",
    ],
    status: "bau",
    progress: 55,
    budget: "18,5 Mio. Euro",
    budgetMio: 18.5,
    period: "2025 bis 2027",
    location: "Beispielstadt, Marktplatz und Hafenstraße",
    unitId: "tiefbauamt",
    newsIds: ["b3"],
    milestones: [
      { date: "2025-04", label: "Baubeginn erster Abschnitt", done: true },
      { date: "2026-06", label: "Erster Abschnitt fertig", done: true },
      { date: "2026-12", label: "Bushaltestellen in Betrieb", done: false },
      { date: "2027-09", label: "Einweihung", done: false },
    ],
    image: { src: "/images/projects/marktplatz.webp", alt: "Baustelle auf einem Marktplatz mit Absperrungen, neuem Pflaster und jungen Bäumen" },
  },
  {
    id: "kita-hafenviertel",
    level: "kommune",
    title: "Neue Kita im Hafenviertel von Beispielstadt",
    teaser: "120 Plätze in einem Holzbau mit großem Garten. Die Anmeldung läuft schon.",
    description: [
      "Die neue Kita entsteht in Holzbauweise und hat sechs Gruppen, eine Küche und einen großen Garten.",
      "Plätze lassen sich bereits über dieses Portal anmelden.",
    ],
    status: "bau",
    progress: 70,
    budget: "9,8 Mio. Euro",
    budgetMio: 9.8,
    period: "2025 bis 2026",
    location: "Beispielstadt, Hafenviertel, Kranweg 4",
    unitId: "jugendamt",
    newsIds: ["b2"],
    milestones: [
      { date: "2025-03", label: "Baubeginn", done: true },
      { date: "2026-05", label: "Richtfest", done: true },
      { date: "2026-12", label: "Eröffnung", done: false },
    ],
    image: { src: "/images/projects/kita.webp", alt: "Neubau einer Kita in Holzbauweise mit großen Fenstern und Garten" },
  },
  {
    id: "hallenbad-beispielstadt",
    level: "kommune",
    title: "Sanierung Hallenbad Beispielstadt",
    teaser: "Das Hallenbad aus den 1970er-Jahren wird saniert und bekommt ein Lehrschwimmbecken.",
    description: [
      "Technik, Dach und Fassade sind am Ende ihrer Lebenszeit. Die Stadt saniert das Bad und baut ein zusätzliches Becken für Schwimmkurse.",
      "Während der Bauzeit können Schulen das Bad der Nachbargemeinde nutzen.",
    ],
    status: "planung",
    progress: 10,
    budget: "24 Mio. Euro",
    budgetMio: 24,
    period: "2027 bis 2029",
    location: "Beispielstadt, Am Stadtbad 1",
    unitId: "oberbuergermeisterin",
    newsIds: [],
    milestones: [
      { date: "2026-02", label: "Stadtrat beschließt Sanierung", done: true },
      { date: "2027-01", label: "Planung fertig", done: false },
      { date: "2029-09", label: "Wiedereröffnung", done: false },
    ],
    image: { src: "/images/projects/hallenbad.webp", alt: "Hallenbad mit leerem Schwimmbecken und Gerüst während der Sanierung" },
  },
  {
    id: "stadtpark-beispielstadt",
    level: "kommune",
    title: "Stadtpark Beispielstadt: Hundewiese und Spielplätze",
    teaser: "Eine eingezäunte Hundewiese und zwei neue Spielplätze sind fertig.",
    description: [
      "Im Stadtpark sind eine eingezäunte Hundewiese und zwei Spielplätze entstanden. Neue Wege und Bänke machen den Park barrierefrei.",
    ],
    status: "fertig",
    progress: 100,
    budget: "1,2 Mio. Euro",
    budgetMio: 1.2,
    period: "2025 bis 2026",
    location: "Beispielstadt, Stadtpark",
    unitId: "gruenflaechenamt",
    newsIds: ["b4"],
    milestones: [
      { date: "2025-06", label: "Baubeginn", done: true },
      { date: "2026-09", label: "Hundewiese eröffnet", done: true },
    ],
    image: { src: "/images/news/b4-hundewiese.webp", alt: "Hund läuft auf einer eingezäunten Wiese im Stadtpark einem Ball hinterher" },
  },
];

export function findProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function newsForProject(project: Project): NewsItem[] {
  return NEWS.filter((n) => project.newsIds.includes(n.id));
}
