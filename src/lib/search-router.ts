import { CURATED_TERMS } from "@/data/search-terms";
import { intentPhrases, normalize, searchServices } from "@/lib/smart-search";

// Search switch: decides before the search which pot a request goes to, because the backend can
// only search one pot at a time. It works without a database: only the service catalogue (a
// static file) and fixed signal words. If the request is unclear, the search asks instead.

export type Pot = "leistungen" | "informationen";

export const POT_LABEL: Record<Pot, string> = { leistungen: "Leistungen", informationen: "Informationen" };

// "~" matches inside compound words too ("ausweis" in "Personalausweis"), otherwise word starts.
const SIGNALS: { pot: Pot; label: string; points: number; stems: string[] }[] = [
  {
    pot: "leistungen",
    label: "Handlung",
    points: 3,
    stems: [
      "beantrag", "~antrag", "anmeld", "ummeld", "abmeld", "verlaenger", "einreich", "formular", "termin", "bestell",
      "ich brauche", "wir brauchen", "ich moechte", "wir moechten", "ich will", "ich muss", "wie bekomme", "wo kann ich",
    ],
  },
  { pot: "leistungen", label: "Dokument", points: 2, stems: ["~ausweis", "reisepass", "~zeugnis", "~schein", "~genehmig", "~bescheinig", "~zulass", "gebuehr"] },
  {
    pot: "informationen",
    label: "Art des Inhalts",
    points: 4,
    stems: ["meldung", "pressemitteil", "presse", "news", "aktuell", "neuigkeit", "nachrichten", "bericht"],
  },
  {
    pot: "informationen",
    label: "Thema",
    points: 2,
    stems: [
      "~ministerium", "minister", "landtag", "landesregierung", "regierung", "staatskanzlei", "programm", "beschlossen",
      "beschliesst", "beschluss", "projekt", "baustelle", "umleitung", "sperrung", "veranstaltung", "plant", "geplant",
      "geschichte", "fakten", "statistik", "wer ist", "was ist", "wie viele", "erhoeh", "oeffnungszeit", "ansprechperson", "kontakt",
    ],
  },
];

// Thresholds: a pot needs enough points and a lead over the other one.
export type Signal = { pot: Pot; word: string; label: string; points: number };
export type Route = { pot?: Pot; signals: Signal[]; points: Record<Pot, number>; catalogue?: string };

function matchesWord(word: string, stem: string): boolean {
  return stem.startsWith("~") ? word.includes(stem.slice(1)) : word.startsWith(stem);
}

const SHOWN: Record<string, string> = { "ich moechte": "ich möchte", "wir moechten": "wir möchten" };

export function routeQuery(input: string): Route {
  const original = input
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}-]/gu, ""))
    .filter(Boolean);
  const words = original.map((w) => normalize(w));
  const padded = ` ${words.join(" ")} `;
  const signals: Signal[] = [];
  const used = new Set<number>();

  for (const group of SIGNALS) {
    for (const stem of group.stems) {
      if (stem.includes(" ")) {
        if (padded.includes(` ${stem}`)) signals.push({ pot: group.pot, word: SHOWN[stem] ?? stem, label: group.label, points: group.points });
        continue;
      }
      // Each word counts once, for the first group that knows it.
      const i = words.findIndex((w, index) => !used.has(index) && matchesWord(w, stem));
      if (i < 0) continue;
      used.add(i);
      signals.push({ pot: group.pot, word: original[i], label: group.label, points: group.points });
    }
  }
  const year = input.match(/\b(19|20)\d{2}\b/)?.[0];
  if (year) signals.push({ pot: "informationen", word: year, label: "Jahreszahl", points: 1 });

  // A clear match in the catalogue. A single word ("Kita", "Hund") can also be a topic in the news.
  const catalogue = searchServices(input).answer;
  if (catalogue) {
    signals.push({ pot: "leistungen", word: catalogue.title, label: "Treffer im Leistungskatalog", points: words.length > 1 ? 2 : 1 });
    const phrase = intentPhrases(input)[0];
    if (phrase) signals.push({ pot: "leistungen", word: phrase, label: "Anliegen erkannt", points: 1 });
  }

  // Terms the editorial team has placed win over the signal words.
  const whole = ` ${normalize(input)} `;
  const curated = CURATED_TERMS.find((c) => whole.includes(` ${c.term} `));
  if (curated) signals.push({ pot: curated.pot, word: input.trim(), label: "Von der Redaktion zugeordnet", points: 10 });

  const points: Record<Pot, number> = { leistungen: 0, informationen: 0 };
  for (const s of signals) points[s.pot] += s.points;
  const { leistungen: l, informationen: i } = points;
  const pot: Pot | undefined = l >= 3 && l >= i + 1 ? "leistungen" : i >= 2 && i >= l + 1 ? "informationen" : undefined;
  return { pot, signals, points, catalogue: catalogue?.title };
}
