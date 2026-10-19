import type { Service } from "@/lib/types";

// Shared service catalogue: the same records appear in every tenant.
// All values are example data for the click dummy.
export const SERVICES: Service[] = [
  {
    slug: "personalausweis-beantragen",
    title: "Personalausweis beantragen",
    summary: "Einen neuen Personalausweis beantragen, wenn der alte abläuft oder Sie zum ersten Mal einen brauchen.",
    keywords: ["ausweis", "perso", "personalausweis", "identität", "pass"],
    level: "kommune",
    online: false,
    costs: "Beispielwert: 40 Euro, unter 24 Jahren 25 Euro",
    duration: "etwa 3 bis 4 Wochen",
    documents: ["bisheriger Ausweis oder Geburtsurkunde", "ein aktuelles biometrisches Foto"],
    sections: [
      { title: "Voraussetzungen", body: ["Sie sind mindestens 16 Jahre alt und in der Kommune gemeldet."] },
      { title: "Ablauf", body: ["Termin im Bürgeramt buchen.", "Mit Unterlagen persönlich vorsprechen, Fingerabdrücke werden erfasst.", "Benachrichtigung abwarten und Ausweis abholen."] },
    ],
  },
  {
    slug: "wohnsitz-anmelden",
    title: "Wohnsitz anmelden",
    summary: "Nach einem Umzug den neuen Wohnsitz innerhalb von zwei Wochen anmelden.",
    keywords: ["umzug", "anmelden", "meldebescheinigung", "wohnung", "ummelden"],
    level: "kommune",
    online: true,
    costs: "kostenlos",
    duration: "sofort, online in wenigen Minuten",
    documents: ["Personalausweis", "Wohnungsgeberbestätigung"],
    sections: [
      { title: "Fristen", body: ["Innerhalb von zwei Wochen nach dem Einzug."] },
      { title: "Ablauf", body: ["Online anmelden oder Termin im Bürgeramt buchen.", "Meldebestätigung herunterladen oder mitnehmen."] },
    ],
  },
  {
    slug: "kitaplatz-beantragen",
    title: "Kitaplatz beantragen",
    summary: "Einen Betreuungsplatz in einer Kita oder bei einer Tagespflege für Ihr Kind anfragen.",
    keywords: ["kita", "kindergarten", "betreuung", "kind", "familie", "tagespflege"],
    level: "kommune",
    online: true,
    costs: "Beitrag je nach Einkommen",
    duration: "Zusage meist 3 Monate vor Betreuungsbeginn",
    documents: ["Geburtsurkunde des Kindes", "Nachweis über das Einkommen"],
    sections: [
      { title: "Ablauf", body: ["Wunsch-Kitas im Portal auswählen.", "Antrag online absenden.", "Zusage oder Alternativvorschlag abwarten."] },
    ],
  },
  {
    slug: "hund-anmelden",
    title: "Hund anmelden",
    summary: "Einen Hund zur Hundesteuer anmelden, wenn Sie ihn neu halten oder zuziehen.",
    keywords: ["hund", "hundesteuer", "haustier", "steuer"],
    level: "kommune",
    online: true,
    costs: "Hundesteuer nach Satzung der Kommune",
    duration: "Steuermarke in etwa 1 Woche",
    documents: ["Nachweis der Haftpflichtversicherung"],
    sections: [
      { title: "Fristen", body: ["Innerhalb eines Monats nach Beginn der Haltung."] },
    ],
  },
  {
    slug: "baugenehmigung-beantragen",
    title: "Baugenehmigung beantragen",
    summary: "Für Neubau, Umbau oder Nutzungsänderung eines Gebäudes eine Genehmigung einholen.",
    keywords: ["bauen", "bauantrag", "baugenehmigung", "haus", "umbau"],
    level: "kommune",
    online: true,
    costs: "abhängig von den Baukosten",
    duration: "etwa 3 Monate",
    documents: ["Bauzeichnungen", "Lageplan", "Baubeschreibung", "Nachweis der Bauvorlageberechtigung"],
    sections: [
      { title: "Voraussetzungen", body: ["Der Bauantrag wird von einer bauvorlageberechtigten Person eingereicht."] },
      { title: "Ablauf", body: ["Unterlagen digital einreichen.", "Behörde prüft Vollständigkeit und beteiligt Fachstellen.", "Bescheid wird digital zugestellt."] },
    ],
  },
  {
    slug: "fischereischein-beantragen",
    title: "Fischereischein beantragen",
    summary: "Den Fischereischein beantragen, um in öffentlichen Gewässern angeln zu dürfen.",
    keywords: ["angeln", "fischen", "fischereischein", "angelschein"],
    level: "kommune",
    online: false,
    costs: "Beispielwert: 30 Euro",
    duration: "etwa 2 Wochen",
    documents: ["Zeugnis über die bestandene Fischerprüfung", "Personalausweis", "Passfoto"],
    sections: [
      { title: "Voraussetzungen", body: ["Sie haben die Fischerprüfung bestanden."] },
    ],
  },
  {
    slug: "fuehrungszeugnis-beantragen",
    title: "Führungszeugnis beantragen",
    summary: "Ein Führungszeugnis für Arbeitgeber, Ehrenamt oder Behörden anfordern.",
    keywords: ["führungszeugnis", "zeugnis", "ehrenamt", "arbeit", "bewerbung"],
    level: "kommune",
    online: true,
    costs: "Beispielwert: 13 Euro, für Ehrenamt kostenlos",
    duration: "etwa 2 Wochen per Post",
    documents: ["Personalausweis mit Online-Ausweisfunktion"],
    sections: [
      { title: "Ablauf", body: ["Online beantragen und mit dem Ausweis identifizieren.", "Führungszeugnis kommt per Post."] },
    ],
  },
  {
    slug: "wohngeld-beantragen",
    title: "Wohngeld beantragen",
    summary: "Einen Zuschuss zur Miete oder zu den Kosten für selbst genutztes Wohneigentum beantragen.",
    keywords: ["wohngeld", "miete", "zuschuss", "geld", "wohnen"],
    level: "kommune",
    online: true,
    costs: "kostenlos",
    duration: "etwa 6 bis 8 Wochen",
    documents: ["Mietvertrag", "Einkommensnachweise aller Haushaltsmitglieder"],
    sections: [
      { title: "Voraussetzungen", body: ["Ihr Einkommen liegt unter einer bestimmten Grenze.", "Sie beziehen keine anderen Leistungen, die Wohnkosten schon abdecken."] },
    ],
  },
  {
    slug: "fahrzeug-zulassen",
    title: "Fahrzeug zulassen",
    summary: "Ein neues oder gebrauchtes Fahrzeug anmelden und Kennzeichen erhalten.",
    keywords: ["auto", "kfz", "zulassung", "kennzeichen", "fahrzeug"],
    level: "kommune",
    online: true,
    costs: "Beispielwert: ab 30 Euro",
    duration: "online in wenigen Tagen",
    documents: ["Zulassungsbescheinigung Teil I und II", "eVB-Nummer der Versicherung", "Personalausweis"],
    sections: [
      { title: "Ablauf", body: ["Online beantragen oder Termin vereinbaren.", "Kennzeichen prägen lassen und Plaketten anbringen."] },
    ],
  },
  {
    slug: "vereinsfoerderung-beantragen",
    title: "Förderung für Vereine beantragen",
    summary: "Zuschüsse des Landes für Projekte von Vereinen in Sport, Kultur und Ehrenamt beantragen.",
    keywords: ["verein", "förderung", "ehrenamt", "zuschuss", "kultur", "sport"],
    level: "land",
    online: true,
    costs: "kostenlos",
    duration: "Entscheidung etwa 8 Wochen nach Stichtag",
    documents: ["Projektbeschreibung", "Kosten- und Finanzierungsplan", "Vereinsregisterauszug"],
    sections: [
      { title: "Fristen", body: ["Stichtage jeweils am 31. März und 30. September."] },
    ],
  },
];

export function findService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
