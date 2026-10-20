import { normalize, searchServices } from "@/lib/smart-search";

// Search switch: decides before the search which pot a request goes to, because the backend can
// only search one pot at a time. It works without a database: only the service catalogue (a
// static file) and fixed signal words. If the request is unclear, the search page asks.

export type Pot = "leistungen" | "informationen";

export const POT_LABEL: Record<Pot, string> = { leistungen: "Leistungen", informationen: "Informationen" };

// "~" matches inside compound words too ("ausweis" in "Personalausweis"), otherwise word starts.
const SIGNALS: Record<Pot, string[]> = {
  leistungen: [
    "beantrag", "~antrag", "anmeld", "ummeld", "abmeld", "verlaenger", "~zulass", "~genehmig", "~bescheinig", "~zeugnis",
    "~schein", "~ausweis", "reisepass", "termin", "gebuehr", "formular", "einreich", "bestell",
    "ich brauche", "wir brauchen", "ich moechte", "wir moechten", "ich will", "ich muss", "wie bekomme", "wo kann ich",
  ],
  informationen: [
    "meldung", "aktuell", "news", "neuigkeit", "presse", "~ministerium", "minister", "landtag", "landesregierung",
    "regierung", "staatskanzlei", "programm", "beschlossen", "beschliesst", "beschluss", "projekt", "baustelle", "umleitung",
    "sperrung", "veranstaltung", "plant", "geplant", "geschichte", "fakten", "statistik", "wer ist", "was ist", "wie viele",
    "oeffnungszeit", "ansprechperson", "kontakt",
  ],
};

export type Signal = { pot: Pot; word: string };
export type Route = { pot?: Pot; signals: Signal[]; catalogue?: string };

function matchesWord(word: string, stem: string): boolean {
  return stem.startsWith("~") ? word.includes(stem.slice(1)) : word.startsWith(stem);
}

export function routeQuery(input: string): Route {
  const original = input
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}-]/gu, ""))
    .filter(Boolean);
  const words = original.map((w) => normalize(w));
  const padded = ` ${words.join(" ")} `;
  const signals: Signal[] = [];
  const points: Record<Pot, number> = { leistungen: 0, informationen: 0 };

  for (const pot of ["leistungen", "informationen"] as Pot[]) {
    for (const stem of SIGNALS[pot]) {
      if (stem.includes(" ")) {
        if (padded.includes(` ${stem} `) || padded.includes(` ${stem}`)) {
          points[pot] += 2;
          signals.push({ pot, word: stem.replace("moechte", "möchte").replace("moechten", "möchten") });
        }
        continue;
      }
      const i = words.findIndex((w) => matchesWord(w, stem));
      if (i >= 0 && !signals.some((s) => s.word === original[i])) {
        points[pot] += 2;
        signals.push({ pot, word: original[i] });
      }
    }
  }
  if (/\b(19|20)\d{2}\b/.test(input)) points.informationen += 1;

  // A clear match in the catalogue. A single word ("Kita", "Hund") can also be a topic in the news.
  const catalogue = searchServices(input).answer;
  if (catalogue) points.leistungen += words.length > 1 ? 3 : 2;

  const { leistungen: l, informationen: i } = points;
  const pot: Pot | undefined = l >= 3 && l >= i + 2 ? "leistungen" : i >= 2 && i >= l + 2 ? "informationen" : undefined;
  return { pot, signals, catalogue: catalogue?.title };
}
