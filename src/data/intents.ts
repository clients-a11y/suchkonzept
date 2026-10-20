import type { PortalType } from "@/lib/types";

// Anliegen in eigenen Worten: Redewendungen, die auf Leistungen zeigen.
// Die Suche im Klick-Dummy simuliert damit eine KI-gestützte Suche, ganz ohne Backend.
// Wörter in normalisierter Form: klein, ä → ae, ö → oe, ü → ue, ß → ss.
export type Intent = {
  phrases: string[];
  services: string[];
  related: string[];
};

export const INTENTS: Intent[] = [
  {
    phrases: ["haus bauen", "bauen", "neubau", "anbau", "umbau", "garage", "carport", "dachausbau", "wintergarten", "bauantrag", "terrasse ueberdachen"],
    services: ["baugenehmigung-beantragen"],
    related: ["wohngeld-beantragen"],
  },
  {
    phrases: ["umzug", "umziehen", "umgezogen", "ziehe um", "ziehen um", "ziehe nach", "ziehen nach", "neue wohnung", "zugezogen", "ummelden", "neue adresse", "adresse aendern", "wohnort"],
    services: ["wohnsitz-anmelden"],
    related: ["fahrzeug-zulassen", "hund-anmelden"],
  },
  {
    phrases: ["ausweis", "perso", "ausweis abgelaufen", "ausweis laeuft ab", "ausweis verloren", "ausweis gestohlen", "identitaet"],
    services: ["personalausweis-beantragen"],
    related: ["fuehrungszeugnis-beantragen"],
  },
  {
    phrases: ["kind", "kinder", "baby", "kita", "kindergarten", "krippe", "betreuung", "tagesmutter", "tagespflege", "nachwuchs"],
    services: ["kitaplatz-beantragen"],
    related: ["wohngeld-beantragen"],
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
    phrases: ["verein", "ehrenamt", "foerderung", "zuschuss verein", "vereinsprojekt", "jugendarbeit", "sportverein"],
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

// Beispiele unter dem Suchfeld: zeigen, dass Anliegen in eigenen Worten funktionieren.
export const EXAMPLE_QUERIES: Record<PortalType, string[]> = {
  info: ["Ich möchte eine Garage bauen", "Zuschuss für unseren Sportverein", "Führungszeugnis für das Ehrenamt"],
  service: ["Ich bin umgezogen", "Mein Ausweis läuft ab", "Wir bekommen ein Kind"],
};
