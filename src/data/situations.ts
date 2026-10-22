// Anliegen aus dem Alltag, die noch keine Leistung nennen, etwa „Mein Portemonnaie ist weg“. Der Assistent
// fragt einmal gezielt nach, statt zu raten, und führt dann zur Leistung. Passt keine Antwort, fragt er
// noch einmal offen und verweist danach an den Bürgerservice.
// Wörter in normalisierter Form: klein, ä → ae, ö → oe, ü → ue, ß → ss.

export type SituationAnswer = {
  label: string;
  // Freie Antworten: Wortanfänge („kind“ findet „Kinder“) oder ganze Wörter wie „ja“.
  stems?: string[];
  words?: string[];
  // Führt zu dieser Leistung; der Text steht davor.
  service?: string;
  text?: string[];
  // Nennt den Bürgerservice.
  contact?: boolean;
};

export type Situation = {
  id: string;
  stems: string[];
  question: string[];
  answers: SituationAnswer[];
  // „Etwas anderes“ als letzte Antwort; nicht bei einer Ja-Nein-Frage.
  other?: boolean;
};

export const SITUATIONS: Situation[] = [
  {
    id: "zuwachs",
    stems: ["zuwachs", "familienzuwachs", "neues familienmitglied"],
    question: ["Herzlichen Glückwunsch! Damit ich Ihnen das Richtige zeige: Wer kommt dazu?"],
    answers: [
      { label: "Ein Kind", stems: ["kind", "baby", "tochter", "sohn", "schwanger"], service: "kindergeld-beantragen" },
      { label: "Ein Hund", stems: ["hund", "welpe"], service: "hund-anmelden" },
      {
        label: "Ein anderes Haustier",
        stems: ["katze", "kater", "kaninchen", "hamster", "vogel", "haustier", "tier"],
        text: ["Katzen, Kaninchen und andere Haustiere müssen Sie in Musterland nicht anmelden. Eine Anmeldung gibt es nur für Hunde."],
      },
    ],
    other: true,
  },
  {
    id: "portemonnaie",
    stems: ["portemonnaie", "portmonee", "portmonnaie", "geldboerse", "geldbeutel", "brieftasche", "handtasche", "geklaut", "gestohlen", "beklaut", "bestohlen"],
    question: ["Das ist ärgerlich. Was war darin? Dann sage ich Ihnen, worum Sie sich zuerst kümmern sollten."],
    answers: [
      {
        label: "Der Personalausweis",
        stems: ["ausweis", "perso"],
        service: "personalausweis-beantragen",
        text: ["Melden Sie den Verlust so bald wie möglich bei Ihrer Gemeinde. Dann wird der Ausweis gesperrt, und Sie beantragen dort gleich einen neuen."],
      },
      {
        label: "Bank- oder Kreditkarten",
        stems: ["karte", "bank", "kredit", "ec"],
        text: ["Karten sperren Sie bei Ihrer Bank, am besten sofort. Dabei kann dieses Portal nicht helfen.", "War noch etwas darin?"],
      },
    ],
    other: true,
  },
  {
    id: "geld",
    stems: ["geld", "knapp bei kasse", "pleite", "finanziell", "nicht leisten", "reicht nicht", "reicht hinten"],
    question: ["Dafür gibt es Unterstützung. Wofür reicht das Geld vor allem nicht? Dann finde ich die passende Leistung."],
    answers: [
      { label: "Für die Miete", stems: ["miete", "wohnung", "wohnen", "nebenkosten", "heizung"], service: "wohngeld-beantragen" },
      { label: "Für die Kinder", stems: ["kind", "familie"], service: "kindergeld-beantragen" },
    ],
    other: true,
  },
  {
    id: "brief",
    stems: ["brief", "post vom", "post von", "post bekommen", "schreiben vom", "schreiben von", "behoerdenbrief", "amtsdeutsch"],
    question: ["Briefe vom Amt sind oft schwer zu verstehen. Steht im Brief eine Vorgangsnummer, zum Beispiel MU-2026-123456?"],
    answers: [
      {
        label: "Ja, es gibt eine Nummer",
        words: ["ja", "jo", "genau"],
        stems: ["nummer", "vorgangsnummer", "aktenzeichen"],
        text: ["Schreiben Sie mir die Vorgangsnummer. Dann sage ich Ihnen, wie weit Ihr Antrag ist."],
      },
      {
        label: "Nein, keine Nummer",
        words: ["nein", "nee", "noe", "keine"],
        text: [
          "Wer den Brief geschickt hat, steht oben im Briefkopf, meist mit Telefonnummer. Dort kann man Ihnen den Brief am besten erklären.",
          "Allgemeine Fragen beantwortet der Bürgerservice:",
        ],
        contact: true,
      },
    ],
  },
];

export function findSituation(id: string): Situation | undefined {
  return SITUATIONS.find((s) => s.id === id);
}
