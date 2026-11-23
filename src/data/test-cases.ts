// Zwei Testcases für Tests mit echten Nutzerinnen und Nutzern, jeder als A/B-Test. Getestet wird nur die Suche:
// Jeder Test endet vor dem Antrag.

// Der Ablauf einer Variante. Die Bausteine stammen aus dem früheren Konfigurator und bleiben einzeln schaltbar.
export type TestConfig = {
  // Wo nach dem Ort gefragt wird: gar nicht, im Suchformular, im Overlay direkt nach der Suche oder erst auf der Ergebnisseite.
  place: "none" | "start" | "overlay" | "results";
  // Ob ein unklarer Begriff im Overlay „Was suchen Sie?“ fragt. Ohne Frage zeigt die Seite gleich die Ergebnisse.
  potOverlay: boolean;
  wait: 2 | 3 | 5 | 10;
  // Leistungen und Informationen in einer gemeinsamen Liste, getrennt untereinander oder in zwei Tabs.
  results: "combined" | "list" | "tabs";
  // Wie viele Treffer die Ergebnisseite höchstens zeigt.
  maxServices: 1 | 2 | 3 | 5;
  maxInfos: 1 | 3 | 5 | "all";
  // Wenn es nur um Informationen geht: wie viele Leistungen zum selben Thema dazukommen.
  topicServices: 0 | 1 | 2 | 3;
};

export const DEFAULT_CONFIG: TestConfig = { place: "results", potOverlay: false, wait: 2, results: "list", maxServices: 3, maxInfos: "all", topicServices: 0 };

// Nach dieser Zeit kommt zum Skeleton ein Hinweis mit Ladeanimation. Bis 3 Sekunden gibt es keinen zweiten Zustand.
export function hintAfter(wait: TestConfig["wait"]): number | undefined {
  return wait === 10 ? 5 : wait === 5 ? 3 : undefined;
}

export type TestVariant = { key: "a" | "b"; title: string; text: string; config: TestConfig };

export type TestCase = { id: number; title: string; summary: string; variants: [TestVariant, TestVariant] };

const COMBINED = "Leistungen und Informationen stehen in einer Liste, Leistungen tragen einen Tag. Zwei Pills filtern die Liste.";

export const TEST_CASES: TestCase[] = [
  {
    id: 1,
    title: "PLZ nach der Suche",
    summary: "Die Suche startet ohne Ort. Braucht eine Leistung den Ort, fragt direkt nach der Suche ein Overlay danach.",
    variants: [
      { key: "a", title: "Gemeinsame Liste", text: COMBINED, config: { ...DEFAULT_CONFIG, place: "overlay", results: "combined" } },
      { key: "b", title: "Getrennte Liste", text: "Der Leistungsbereich steht oben, die Informationen stehen darunter.", config: { ...DEFAULT_CONFIG, place: "overlay" } },
    ],
  },
  {
    id: 2,
    title: "PLZ vor der Suche",
    summary: "Das Suchformular fragt die Postleitzahl als Pflichtfeld mit ab. Die Ergebnisse gelten gleich für den Ort.",
    variants: [
      { key: "a", title: "Gemeinsame Liste", text: COMBINED, config: { ...DEFAULT_CONFIG, place: "start", results: "combined" } },
      { key: "b", title: "Getrennte Liste", text: "Der Leistungsbereich steht oben, die Informationen stehen darunter.", config: { ...DEFAULT_CONFIG, place: "start" } },
    ],
  },
];

export function sameConfig(a: TestConfig, b: TestConfig): boolean {
  return (Object.keys(a) as (keyof TestConfig)[]).every((key) => a[key] === b[key]);
}

// Wie die gemeinsame Liste Leistungen hervorhebt: nur mit dem Tag oder nach einem der drei Entwürfe.
export type ServiceStyle = "tag" | "tint" | "card" | "icon";

export const SERVICE_STYLES: { style: ServiceStyle; title: string; text: string }[] = [
  { style: "tag", title: "Stand heute: Tag", text: "Alle Treffer sehen gleich aus. Nur der Tag rechts zeigt, was eine Leistung ist." },
  { style: "tint", title: "Entwurf 1: Farbe", text: "Leistungen sind blau hinterlegt und haben links einen dunklen Balken. Informationen stehen auf Weiß." },
  { style: "card", title: "Entwurf 2: Karte", text: "Leistungen sind Karten mit Schatten, größerem Titel und dem Hinweis „Zur Leistung“. Informationen stehen als schlichte Zeilen dazwischen." },
  { style: "icon", title: "Entwurf 3: Symbol", text: "Jeder Treffer beginnt mit einem Symbol: Leistungen mit einem gefüllten blauen, Informationen mit einem hellen. Das Wort „Leistung“ steht vorn, der Tag rechts entfällt." },
];

// Begriffe, mit denen sich die Fälle der Suche zeigen lassen.
export const TEST_TERMS: { term: string; place?: string; shows: string }[] = [
  { term: "Personalausweis", shows: "Leistung ohne Ort, bundesweit einheitlich" },
  { term: "Kindergeld", shows: "Leistung ohne Ort, eine Stelle für alle" },
  { term: "Hund anmelden", place: "10200 Seehausen", shows: "Leistung der Gemeinde, ohne Ort kein Ergebnis" },
  { term: "Angelschein", place: "10300 Waldheim", shows: "Leistung der Gemeinde, am Ort nicht vorhanden" },
  { term: "Baustelle Marktplatz", shows: "Nur Informationen" },
];
