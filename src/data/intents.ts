// Anliegen in eigenen Worten: Redewendungen, die auf Leistungen zeigen.
// Damit versteht die Suche Anliegen in eigenen Worten, mit festen Regeln und ohne Backend.
// Wörter in normalisierter Form: klein, ä → ae, ö → oe, ü → ue, ß → ss.
export type Intent = {
  phrases: string[];
  services: string[];
  related: string[];
};

export const INTENTS: Intent[] = [
  {
    phrases: ["haus bauen", "bauen", "neubau", "anbau", "umbau", "garage", "carport", "dachausbau", "wintergarten", "bauantrag", "terrasse ueberdachen", "gartenlaube", "gartenhaus", "laube"],
    services: ["baugenehmigung-beantragen"],
    related: ["wohngeld-beantragen"],
  },
  {
    phrases: ["umzug", "umziehen", "umgezogen", "ziehe um", "ziehen um", "ziehe nach", "ziehen nach", "neue wohnung", "zugezogen", "ummelden", "neue adresse", "adresse aendern", "wohnort"],
    services: ["wohnsitz-anmelden"],
    related: ["fahrzeug-zulassen", "hund-anmelden"],
  },
  {
    phrases: ["personalausweis", "ausweis", "perso", "ausweis abgelaufen", "ausweis laeuft ab", "ausweis verloren", "ausweis gestohlen", "identitaet"],
    services: ["personalausweis-beantragen"],
    related: ["fuehrungszeugnis-beantragen"],
  },
  {
    phrases: ["kind", "kinder", "baby", "kita", "kindergarten", "krippe", "betreuung", "tagesmutter", "tagespflege", "nachwuchs"],
    services: ["kitaplatz-beantragen"],
    related: ["kindergeld-beantragen", "wohngeld-beantragen"],
  },
  {
    // "Baby" also points to the Kita: the assistant then asks which one is meant.
    phrases: ["kindergeld", "familienkasse", "geld fuer kinder", "geld fuers kind", "kind geboren", "geburt", "neugeboren", "baby"],
    services: ["kindergeld-beantragen"],
    related: ["kitaplatz-beantragen"],
  },
  {
    phrases: ["hund", "welpe", "hundesteuer", "haustier"],
    services: ["hund-anmelden"],
    related: [],
  },
  {
    phrases: ["auto", "kfz", "kennzeichen", "zulassung", "motorrad", "auto anmelden", "auto ummelden", "auto gekauft"],
    services: ["fahrzeug-zulassen"],
    related: ["wohnsitz-anmelden"],
  },
  {
    phrases: ["miete", "miete zu hoch", "zuschuss miete", "wenig geld", "nebenkosten", "wohnkosten"],
    services: ["wohngeld-beantragen"],
    related: [],
  },
  {
    phrases: ["verein", "ehrenamt", "zuschuss verein", "vereinsprojekt", "jugendarbeit", "sportverein"],
    services: ["vereinsfoerderung-beantragen"],
    related: ["fuehrungszeugnis-beantragen"],
  },
  {
    phrases: ["fuehrungszeugnis", "bewerbung", "neuer job", "arbeitgeber", "jugendtrainer", "uebungsleiter"],
    services: ["fuehrungszeugnis-beantragen"],
    related: [],
  },
  {
    phrases: ["angeln", "angelschein", "fischen", "angler"],
    services: ["fischereischein-beantragen"],
    related: [],
  },
  {
    phrases: ["gewerbe", "selbststaendig", "selbststaendigkeit", "firma gruenden", "unternehmen gruenden", "existenzgruendung", "eigenes geschaeft", "laden eroeffnen"],
    services: ["gewerbe-anmelden"],
    related: ["dorfladen-foerderung-beantragen"],
  },
  {
    phrases: ["dorfladen", "nahversorgung", "laden im dorf", "einkaufen im dorf"],
    services: ["dorfladen-foerderung-beantragen"],
    related: ["gewerbe-anmelden"],
  },
];

// Wörter, die in fast jeder Anfrage stehen und nichts unterscheiden.
export const STOPWORDS = new Set([
  "ich", "wir", "mir", "mich", "uns", "man", "sie", "es", "er", "moechte", "moechten", "will", "wollen", "muss", "muessen",
  "brauche", "brauchen", "benoetige", "habe", "haben", "hat", "bin", "sind", "ist", "wird", "werden", "kann", "koennen",
  "ein", "eine", "einen", "einer", "einem", "mein", "meine", "meinen", "meiner", "unser", "unsere", "unseren", "der", "die",
  "das", "den", "dem", "des", "und", "oder", "fuer", "mit", "zu", "zum", "zur", "im", "in", "an", "am", "auf", "bei", "von",
  "vom", "wie", "wo", "was", "wann", "warum", "bitte", "gerne", "hallo", "neu", "neue", "neuen", "neuer", "nicht", "noch",
  "sich", "so", "da", "beantragen", "antrag", "anmelden", "machen", "bekommen", "kriegen", "gibt", "geht", "weil", "dass",
]);
