import { PLACES, findPlace } from "@/data/places";
import type { Place } from "@/data/places";
import { INTENTS } from "@/data/intents";
import { findService } from "@/data/services";
import { SITUATIONS, findSituation, type Situation } from "@/data/situations";
import { SITE } from "@/data/site";
import { STATUS_LABEL, type Account, type Application } from "@/lib/account-store";
import { formatDate, pluralize } from "@/lib/format";
import { type Office, isCentral, landOffice, offeredIn, officeForPlace, responsibleOffice } from "@/lib/offices";
import { findPlaces } from "@/lib/place-store";
import { normalize, searchInformation, searchServices } from "@/lib/smart-search";
import { routeQuery } from "@/lib/search-router";
import type { Service } from "@/lib/types";

// Guided assistant: a small dialogue on top of the search engine. It asks only what the answer
// needs (above all the postcode), names the office in charge and knows the demo account.
// Every answer comes from the data in src/data; nothing is generated.

export type Choice = { label: string; value: string };
export type ChatLink = { label: string; href: string; primary?: boolean };

export type BotMessage = {
  id: number;
  from: "bot";
  text: string[];
  office?: Office;
  facts?: { label: string; value: string }[];
  list?: string[];
  links?: ChatLink[];
  choices?: Choice[];
  source?: ChatLink;
  greeting?: boolean;
};
export type UserMessage = { id: number; from: "user"; text: string };
export type ChatMessage = BotMessage | UserMessage;

type Pending =
  | { kind: "none" }
  | { kind: "place"; service?: string }
  | { kind: "pick"; service?: string; places: string[] }
  | { kind: "confirm"; service: string; place: string }
  | { kind: "situation"; id: string };

export type Conversation = {
  messages: ChatMessage[];
  pending: Pending;
  service?: string; // service of the last answer, for follow-up questions
  place?: string; // place confirmed in this conversation
  unclear?: number; // questions in a row that led to no service; after two, people take over
  next: number;
};

export type AssistantEnv = {
  placeId: string;
  account: Account | null;
};

export type Effects = { placeId?: string; signIn?: boolean };

type Detail = "kosten" | "dauer" | "unterlagen" | "online" | "frist" | "voraussetzung" | "ablauf";

const DETAILS: { key: Detail; label: string; ask: string; stems: string[] }[] = [
  { key: "unterlagen", label: "Unterlagen", ask: "Welche Unterlagen brauche ich?", stems: ["unterlag", "dokument", "mitbring", "nachweis", "papiere", "brauche ich"] },
  { key: "kosten", label: "Kosten", ask: "Was kostet das?", stems: ["kost", "gebuehr", "preis", "teuer", "bezahl"] },
  { key: "dauer", label: "Dauer", ask: "Wie lange dauert das?", stems: ["dauer", "wie lange", "wann fertig", "wie schnell"] },
  { key: "online", label: "Online", ask: "Geht das online?", stems: ["online", "internet", "digital"] },
  { key: "frist", label: "Fristen", ask: "Gibt es eine Frist?", stems: ["frist", "bis wann", "spaetestens"] },
  { key: "voraussetzung", label: "Voraussetzungen", ask: "Welche Voraussetzungen gibt es?", stems: ["voraussetz", "bedingung", "darf ich"] },
  { key: "ablauf", label: "Ablauf", ask: "Wie läuft das ab?", stems: ["ablauf", "wie geht", "schritte", "vorgehen"] },
];

const STATUS = ["stand", "status", "bearbeit", "vorgang", "bescheid", "postfach", "nachricht", "eingegangen"];
const MY_APPLICATION = ["mein antrag", "meine antraeg", "meinem antrag", "meines antrag"];
const HUMAN = ["mensch", "mitarbeit", "sachbearbeit", "telefon", "anruf", "persoenlich", "kontakt", "sprechen"];
const HELP = ["hallo", "moin", "servus", "guten tag", "guten morgen", "hilfe", "was kannst", "wie funktioniert"];
const SIMPLE = ["einfacher", "verstehe nicht", "versteh ich nicht", "leichte sprache", "einfache sprache", "kompliziert"];
const NO_PLACE = ["ohne ort", "egal", "keine angabe", "moechte ich nicht", "will ich nicht"];
const YES = ["ja", "jo", "jep", "genau", "stimmt", "richtig", "korrekt"];
const NO = ["nein", "nee", "noe", "woanders", "anderer", "anderen", "andere"];
const CASE_NUMBER = /\b[a-z]{2}-\d{4}-\d{6}\b/i;

function words(text: string): string[] {
  return normalize(text).split(" ").filter(Boolean);
}

// Word beginnings ("kost" finds "kostet") or phrases ("wie lange").
function mentions(text: string, stems: string[]): boolean {
  const list = words(text);
  const padded = ` ${list.join(" ")} `;
  return stems.some((stem) => (stem.includes(" ") ? padded.includes(` ${stem}`) : list.some((w) => w.startsWith(stem))));
}

function saysWord(text: string, list: string[]): boolean {
  return words(text).some((w) => list.includes(w));
}

function detailIn(text: string): Detail | undefined {
  return DETAILS.find((d) => mentions(text, d.stems))?.key;
}

function placeLabel(place: Place): string {
  return `${place.name} (${place.plz[0]})`;
}

// A place named in the text: a postcode, or "in Seehausen", "nach Bergtal", "Waldheim".
function placesIn(text: string, loose: boolean): Place[] {
  const digits = text.match(/\b\d{3,5}\b/)?.[0];
  if (digits) return findPlaces(digits);
  const list = words(text);
  const named = PLACES.filter((p) => list.join(" ").includes(normalize(p.name)));
  if (named.length || !loose) return named;
  // While asking for the place: also the beginning of a name ("Wald" for Waldheim).
  const rest = list.filter((w) => !["ich", "wir", "wohne", "wohnen", "lebe", "leben", "in", "nach", "aus", "jetzt", "der", "die", "gemeinde", "stadt", "ort"].includes(w) && !YES.includes(w) && !NO.includes(w));
  const query = rest.join(" ");
  return query.length >= 3 ? findPlaces(query) : [];
}

// An everyday situation that names no service yet ("Mein Portemonnaie ist weg").
function situationIn(text: string): Situation | undefined {
  return SITUATIONS.find((s) => mentions(text, s.stems));
}

// A typed answer to the question of a situation; "other" for "Etwas anderes".
function situationAnswerIn(situation: Situation, text: string): number | "other" | undefined {
  const index = situation.answers.findIndex((a) => saysWord(text, a.words ?? []) || mentions(text, a.stems ?? []));
  if (index >= 0) return index;
  if (situation.other && mentions(text, ["etwas anderes", "anderes", "sonst"])) return "other";
  return undefined;
}

function starters(): Choice[] {
  return SITE.assistant.starters.map((text) => ({ label: text, value: text }));
}

const TALK_TO_HUMAN: Choice = { label: "Mit einem Menschen sprechen", value: "#mensch" };

function factsOf(service: Service) {
  return [
    { label: "Kosten", value: service.costs },
    { label: "Dauer", value: service.duration },
    { label: "Online möglich", value: service.online ? "Ja" : "Nein, Termin vor Ort" },
  ];
}

function sourceOf(service: Service): ChatLink {
  return { label: `Leistungskatalog: ${service.title}`, href: `/leistungen/${service.slug}` };
}

function serviceLinks(service: Service): ChatLink[] {
  const page = { label: "Alles zur Leistung", href: `/leistungen/${service.slug}` };
  return service.online ? [{ label: "Online beantragen", href: `/antrag/${service.slug}`, primary: true }, page] : [{ ...page, primary: true }];
}

// Follow-up questions and services people often need as well.
function followUps(service: Service, skip?: Detail): Choice[] {
  const related = INTENTS.filter((i) => i.services.includes(service.slug))
    .flatMap((i) => i.related)
    .filter((slug, i, all) => slug !== service.slug && all.indexOf(slug) === i)
    .map((slug) => findService(slug))
    .filter((s): s is Service => Boolean(s))
    .slice(0, 2);
  return [
    ...DETAILS.filter((d) => ["unterlagen", "kosten"].includes(d.key) && d.key !== skip).map((d) => ({ label: d.ask, value: `#detail:${d.key}` })),
    { label: "Einfacher erklären", value: "#einfach" },
    ...related.map((s) => ({ label: `Auch: ${s.title}`, value: `#leistung:${s.slug}` })),
  ];
}

type Say = Omit<BotMessage, "id" | "from">;

class Turn {
  effects: Effects = {};
  constructor(
    public c: Conversation,
    public env: AssistantEnv,
  ) {}

  say(message: Say) {
    this.c.messages.push({ id: this.c.next++, from: "bot", ...message });
  }

  // ---------- Services ----------

  service(service: Service) {
    this.c.service = service.slug;
    this.c.pending = { kind: "none" };
    this.c.unclear = 0;
    if (isCentral(service)) return this.landService(service);

    const known = findPlace(this.c.place);
    if (known) return this.forPlace(service, known);

    const stored = findPlace(this.env.placeId);
    const intro = `Für „${service.title}“ ist die Stelle an Ihrem Wohnort zuständig.`;
    if (stored) {
      this.c.pending = { kind: "confirm", service: service.slug, place: stored.id };
      return this.say({
        text: [intro, `Ich habe mir ${placeLabel(stored)} gemerkt. Gilt das noch?`],
        choices: [
          { label: `Ja, ${stored.name}`, value: "#ja" },
          { label: "Anderen Ort angeben", value: "#nein" },
        ],
      });
    }
    this.askPlace(service, intro);
  }

  landService(service: Service) {
    this.say({
      text: [`„${service.title}“ ${service.level === "bund" ? "ist bundesweit einheitlich" : "bietet das Land selbst an"}. Ihr Wohnort spielt dafür keine Rolle. Zuständig ist:`],
      office: landOffice(service),
      facts: factsOf(service),
      links: serviceLinks(service),
      source: sourceOf(service),
      choices: followUps(service),
    });
  }

  askPlace(service: Service | undefined, intro?: string) {
    this.c.pending = { kind: "place", service: service?.slug };
    this.say({
      text: [`${intro ? `${intro} ` : ""}Wie lautet Ihre Postleitzahl?`, "Sie können auch den Ort schreiben. Die Angabe bleibt nur in diesem Browser."],
      choices: service ? [{ label: "Ohne Postleitzahl weiter", value: "#ohne-ort" }] : [],
    });
  }

  // The place is known: name the office there.
  forPlace(service: Service, place: Place) {
    this.c.place = place.id;
    this.c.pending = { kind: "none" };
    if (place.id !== this.env.placeId) this.effects.placeId = place.id;
    if (!offeredIn(service, place)) {
      return this.say({
        text: [`„${service.title}“ gibt es in ${place.name} nicht.`],
        choices: [{ label: "Anderen Ort angeben", value: "#ort-aendern" }, TALK_TO_HUMAN],
      });
    }
    this.say({
      text: [`Für „${service.title}“ in ${place.name} ist zuständig:`],
      office: officeForPlace(place, service),
      facts: factsOf(service),
      links: serviceLinks(service),
      source: sourceOf(service),
      choices: followUps(service),
    });
  }

  withoutPlace(service: Service) {
    this.c.pending = { kind: "none" };
    this.say({
      text: ["Ohne Postleitzahl kann ich die zuständige Stelle nicht nennen. Alles andere gilt überall:"],
      facts: factsOf(service),
      links: serviceLinks(service),
      source: sourceOf(service),
      choices: [{ label: "Postleitzahl angeben", value: "#ort-aendern" }, ...followUps(service)],
    });
  }

  detail(service: Service, key: Detail) {
    this.c.service = service.slug;
    const name = `„${service.title}“`;
    const base = { source: sourceOf(service), choices: followUps(service, key) };
    if (key === "kosten") return this.say({ text: [`Kosten für ${name}: ${service.costs}.`], ...base });
    if (key === "dauer") return this.say({ text: [`Dauer für ${name}: ${service.duration}.`], ...base });
    if (key === "unterlagen") return this.say({ text: [`Für ${name} brauchen Sie:`], list: service.documents, ...base });
    if (key === "online") {
      return service.online
        ? this.say({ text: [`Ja, ${name} können Sie online beantragen.`], links: serviceLinks(service), ...base })
        : this.say({ text: [`Nein, für ${name} kommen Sie persönlich vorbei. Buchen Sie dafür einen Termin.`], ...base });
    }
    const label = DETAILS.find((d) => d.key === key)!.label;
    const section = service.sections.find((s) => normalize(s.title).startsWith(key));
    if (!section?.body.length) {
      return this.say({ text: [`Zu ${label} steht in der Beschreibung von ${name} nichts Besonderes.`], ...base });
    }
    this.say({ text: [`${section.title} für ${name}:`], list: section.body, ...base });
  }

  simple() {
    const service = this.c.service ? findService(this.c.service) : undefined;
    if (!service) {
      // After two questions that led nowhere, people take over instead of a third question.
      if ((this.c.unclear ?? 0) >= 2) return this.fallback("");
      this.c.unclear = (this.c.unclear ?? 0) + 1;
      return this.say({ text: ["Gerne einfacher. Schreiben Sie in wenigen Worten, was Sie brauchen.", "Zum Beispiel: „Ausweis“ oder „Umzug“."] });
    }
    const office = responsibleOffice(service, findPlace(this.c.place));
    const costs = service.costs.replace(/^Beispielwert:\s*/, "");
    this.say({
      text: [`„${service.title}“ in einfachen Worten:`],
      list: [
        service.online ? "Sie können das im Internet machen." : "Sie gehen dafür zum Amt. Vorher machen Sie einen Termin.",
        `Das kostet: ${costs}.`,
        `Das dauert: ${service.duration}.`,
        `Sie brauchen: ${service.documents.join(", ")}.`,
        office ? `Zuständig ist: ${office.office}.` : "Wer zuständig ist, hängt von Ihrem Wohnort ab.",
      ],
      links: serviceLinks(service),
      choices: [TALK_TO_HUMAN],
    });
  }

  // ---------- Places ----------

  place(service: Service | undefined, place: Place) {
    if (service) return this.forPlace(service, place);
    this.c.place = place.id;
    this.c.pending = { kind: "none" };
    if (place.id !== this.env.placeId) this.effects.placeId = place.id;
    this.say({ text: [`Gemerkt: ${placeLabel(place)}. Wobei kann ich helfen?`], choices: starters() });
  }

  placeAnswer(input: string, service: Service | undefined): boolean {
    const found = placesIn(input, true);
    if (found.length === 1) {
      this.place(service, found[0]);
      return true;
    }
    if (found.length > 1) {
      this.c.pending = { kind: "pick", service: service?.slug, places: found.map((p) => p.id) };
      this.say({
        text: [`Zu „${input.trim()}“ passen mehrere Orte. Wo wohnen Sie?`],
        choices: found.map((p) => ({ label: p.name, value: `#ort:${p.id}` })),
      });
      return true;
    }
    return false;
  }

  unknownPlace(input: string, service: Service | undefined) {
    const where = SITE.region;
    const digits = /^\s*\d{3,5}\s*$/.test(input);
    this.c.pending = { kind: "place", service: service?.slug };
    this.say({
      text: digits
        ? [
            `Die Postleitzahl ${input.trim()} gehört zu keinem Ort in ${where}.`,
            `Für Orte außerhalb von ${where} ist dieses Portal nicht zuständig. Prüfen Sie die Eingabe oder schreiben Sie den Ortsnamen.`,
          ]
        : [`Einen Ort „${input.trim()}“ kenne ich in ${where} nicht. Prüfen Sie die Schreibweise oder geben Sie die Postleitzahl ein.`],
      choices: service ? [{ label: "Ohne Postleitzahl weiter", value: "#ohne-ort" }] : [],
    });
  }

  // ---------- Account ----------

  status(text: string) {
    const account = this.env.account;
    if (!account?.signedIn) {
      return this.say({
        text: ["Den Stand Ihrer Anträge sehe ich, wenn Sie angemeldet sind.", "Im Prototyp geht das mit einem Demo-Konto, ganz ohne Passwort."],
        choices: [{ label: "Mit Demo-Konto anmelden", value: "#anmelden" }],
        links: [{ label: "Zum Nutzerkonto", href: "/konto" }],
      });
    }
    const apps = account.applications;
    if (!apps.length) {
      return this.say({ text: ["Sie sind angemeldet, haben aber noch keinen Antrag gestellt.", "Wobei kann ich helfen?"], choices: starters() });
    }
    const unread = account.messages.filter((m) => !m.read).length;
    const inbox = unread
      ? `Im Postfach ${unread === 1 ? "liegt eine ungelesene Nachricht" : `liegen ${unread} ungelesene Nachrichten`}.`
      : "Im Postfach haben Sie alles gelesen.";
    const links = [{ label: "Zum Postfach", href: "/konto", primary: true }];
    const choices = [{ label: "Was bedeuten die Stufen?", value: "#stufen" }];

    const number = text.match(CASE_NUMBER)?.[0].toUpperCase();
    const one = number ? apps.find((a) => a.id === number) : apps.length === 1 ? apps[0] : undefined;
    if (one) {
      const last = account.messages.find((m) => m.applicationId === one.id);
      return this.say({
        text: [
          `„${one.serviceTitle}“, Vorgangsnummer ${one.id}:`,
          `Stand: ${STATUS_LABEL[one.status]}. Eingereicht am ${formatDate(one.submittedAt)}, zuständig: ${one.office}.`,
          ...(last ? [`Letzte Nachricht: „${last.subject}“ vom ${formatDate(last.date)}.`] : []),
          inbox,
        ],
        links,
        choices,
      });
    }
    this.say({
      text: [
        ...(number ? [`Zur Vorgangsnummer ${number} finde ich keinen Antrag in Ihrem Konto.`] : []),
        `Sie haben ${pluralize(apps.length, "Antrag", "Anträge")} gestellt. ${inbox}`,
      ],
      list: apps.slice(0, 5).map((a: Application) => `${a.serviceTitle}: ${STATUS_LABEL[a.status]} (Vorgangsnummer ${a.id})`),
      links,
      choices,
    });
  }

  stages() {
    this.say({
      text: ["Ein Antrag durchläuft drei Stufen:"],
      list: [
        "Eingegangen: Der Antrag ist angekommen und wartet auf Bearbeitung.",
        "In Bearbeitung: Jemand prüft Ihren Antrag. Fehlen Unterlagen, kommt eine Nachricht ins Postfach.",
        "Erledigt: Der Bescheid liegt im Postfach.",
      ],
      links: [{ label: "Zum Postfach", href: "/konto" }],
    });
  }

  // ---------- Everyday situations ----------

  // One question with answers to click, instead of a guess. Typed answers work as well.
  situation(situation: Situation, skip?: number) {
    this.c.pending = { kind: "situation", id: situation.id };
    this.c.unclear = (this.c.unclear ?? 0) + 1;
    this.say({ text: situation.question, choices: this.situationChoices(situation, skip) });
  }

  situationChoices(situation: Situation, skip?: number): Choice[] {
    return [
      ...situation.answers.map((a, i) => ({ label: a.label, value: `#lage:${situation.id}:${i}` })).filter((_, i) => i !== skip),
      ...(situation.other ? [{ label: "Etwas anderes", value: `#lage:${situation.id}:other` }] : []),
      TALK_TO_HUMAN,
    ];
  }

  situationAnswer(situation: Situation, answer: number | "other") {
    if (answer === "other") {
      this.c.pending = { kind: "none" };
      this.c.unclear = (this.c.unclear ?? 0) + 1;
      return this.say({ text: ["Beschreiben Sie in einem Satz, worum es geht. Dann suche ich weiter."], choices: [TALK_TO_HUMAN] });
    }
    const chosen = situation.answers[answer];
    const service = chosen?.service ? findService(chosen.service) : undefined;
    if (!chosen) return this.help();
    if (service) {
      if (chosen.text) this.say({ text: chosen.text });
      return this.service(service);
    }
    // An answer without a service: say what helps. A question with several answers stays open.
    const open = situation.other && !chosen.contact ? this.situationChoices(situation, answer).filter((c) => c.value !== `#lage:${situation.id}:other`) : [];
    this.c.pending = open.length > 1 ? { kind: "situation", id: situation.id } : { kind: "none" };
    this.say({ text: chosen.text ?? [], office: chosen.contact ? SITE.contact : undefined, choices: open.length > 1 ? open : undefined });
  }

  // ---------- Everything else ----------

  human() {
    const service = this.c.service ? findService(this.c.service) : undefined;
    const office = service ? responsibleOffice(service, findPlace(this.c.place)) : undefined;
    this.say({
      text: [service && office ? `Für „${service.title}“ erreichen Sie hier Menschen, die weiterhelfen:` : "Gerne. Hier erreichen Sie Menschen, die weiterhelfen:"],
      office: office ?? SITE.contact,
    });
  }

  help() {
    this.say({
      text: [
        "Ich helfe Ihnen, die passende Leistung und die zuständige Stelle zu finden. Ich frage nur, was ich für die Antwort brauche, zum Beispiel Ihre Postleitzahl.",
        "Ich kann auch den Stand Ihrer Anträge nennen. Womit fangen wir an?",
      ],
      choices: [...starters(), TALK_TO_HUMAN],
    });
  }

  // Like the search: one request goes to one pot. Information only when that is what is asked for.
  information(query: string, service?: Service) {
    const hits = searchInformation(query).slice(0, 4);
    const back = service ? [{ label: `Stattdessen: ${service.title}`, value: `#leistung:${service.slug}` }] : [];
    if (!hits.length) {
      return this.say({ text: [`Zu „${query.trim()}“ finde ich keine Informationen oder Meldungen.`], choices: [...back, TALK_TO_HUMAN] });
    }
    this.say({
      text: ["Dazu habe ich Informationen und Meldungen gefunden:"],
      links: hits.map((hit) => ({ label: hit.title, href: hit.href })),
      choices: back,
    });
  }

  // Unclear whether the person wants to apply or to read: one question instead of a guess.
  askPot(query: string, service: Service) {
    this.say({
      text: ["Möchten Sie etwas erledigen oder sich informieren?"],
      choices: [
        { label: service.title, value: `#leistung:${service.slug}` },
        { label: `Informationen zu „${query.trim()}“`, value: `#info:${query.trim()}` },
      ],
    });
  }

  clarify(services: Service[]) {
    this.say({
      text: ["Dazu passen mehrere Leistungen. Welche meinen Sie?"],
      choices: [...services.slice(0, 3).map((s) => ({ label: s.title, value: `#leistung:${s.slug}` })), { label: "Etwas anderes", value: "#hilfe" }],
    });
  }

  fallback(text: string) {
    // Two questions led nowhere: people help on from here instead of more guessing.
    if ((this.c.unclear ?? 0) >= 2) {
      this.c.unclear = 0;
      return this.say({
        text: ["Das kann ich leider nicht zuordnen. Am besten hilft Ihnen der Bürgerservice weiter. Schildern Sie dort, was Sie mir geschrieben haben:"],
        office: SITE.contact,
      });
    }
    this.c.unclear = (this.c.unclear ?? 0) + 1;
    // Information only as a second request, when no service fits.
    const info = searchInformation(text).slice(0, 3);
    if (info.length) {
      return this.say({
        text: ["Eine passende Leistung habe ich nicht gefunden, aber diese Informationen:"],
        links: info.map((hit) => ({ label: hit.title, href: hit.href })),
        choices: [TALK_TO_HUMAN],
      });
    }
    this.say({
      text: ["Das habe ich leider nicht verstanden.", "Beschreiben Sie Ihr Anliegen in wenigen Worten, zum Beispiel „Ausweis verloren“ oder „Hund anmelden“."],
      links: [{ label: `Im ganzen Portal nach „${text.trim()}“ suchen`, href: `/suche?q=${encodeURIComponent(text.trim())}` }],
      choices: [...starters().slice(0, 2), TALK_TO_HUMAN],
    });
  }
}

function serviceIn(text: string): { service?: Service; options: Service[] } {
  const result = searchServices(text);
  if (result.answer) return { service: result.answer, options: [] };
  const strong = result.services.filter((h) => h.score >= 5).map((h) => h.service);
  if (strong.length === 1) return { service: strong[0], options: [] };
  return { options: strong };
}

function handleToken(turn: Turn, token: string) {
  const { c, env } = turn;
  const pending = c.pending;
  const current = c.service ? findService(c.service) : undefined;
  const pendingService = "service" in pending && pending.service ? findService(pending.service) : undefined;

  if (token === "#anmelden") {
    turn.effects.signIn = true;
    turn.env = { ...env, account: { ...(env.account ?? { applications: [], messages: [] }), signedIn: true } };
    turn.say({ text: ["Sie sind jetzt mit dem Demo-Konto angemeldet."] });
    return turn.status("");
  }
  if (token === "#stufen") return turn.stages();
  if (token === "#mensch") return turn.human();
  if (token === "#hilfe") return turn.help();
  if (token === "#einfach") return turn.simple();
  if (token === "#ort-aendern") return turn.askPlace(pendingService ?? current);
  if (token === "#ohne-ort") return pendingService ? turn.withoutPlace(pendingService) : turn.help();
  if (token.startsWith("#leistung:")) {
    const service = findService(token.slice(10));
    return service ? turn.service(service) : turn.help();
  }
  if (token.startsWith("#detail:") && current) return turn.detail(current, token.slice(8) as Detail);
  if (token.startsWith("#lage:")) {
    const [, id, answer] = token.split(":");
    const situation = findSituation(id);
    if (situation) return turn.situationAnswer(situation, answer === "other" ? "other" : Number(answer));
  }
  if (token.startsWith("#info:")) {
    const query = token.slice(6);
    return turn.information(query, searchServices(query).answer);
  }
  if (token.startsWith("#ort:")) {
    const place = findPlace(token.slice(5));
    return place ? turn.place(pendingService ?? current, place) : turn.askPlace(pendingService ?? current);
  }
  if (token === "#ja" && pending.kind === "confirm") {
    const place = findPlace(pending.place);
    if (pendingService && place) return turn.forPlace(pendingService, place);
  }
  if (token === "#nein") return turn.askPlace(pendingService ?? current);
  turn.help();
}

function handleText(turn: Turn, text: string) {
  const { c } = turn;
  const pending = c.pending;
  const pendingService = "service" in pending && pending.service ? findService(pending.service) : undefined;
  const found = serviceIn(text);

  // Answers to the last question first.
  if (pending.kind === "situation") {
    const situation = findSituation(pending.id);
    const answer = situation ? situationAnswerIn(situation, text) : undefined;
    if (situation && answer !== undefined) return turn.situationAnswer(situation, answer);
  }
  if (pending.kind === "confirm") {
    const named = placesIn(text, false);
    if (named.length === 1 && pendingService) return turn.forPlace(pendingService, named[0]);
    if (saysWord(text, YES)) return handleToken(turn, "#ja");
    if (saysWord(text, NO)) return handleToken(turn, "#nein");
  }
  if (pending.kind === "place" || pending.kind === "pick") {
    if (mentions(text, NO_PLACE)) return handleToken(turn, "#ohne-ort");
    if (turn.placeAnswer(text, pendingService)) return;
    // Not a place: either a new topic, or a place this portal does not know.
    const otherTopic = found.service || found.options.length || mentions(text, [...STATUS, ...HUMAN]) || situationIn(text);
    if (!otherTopic) return turn.unknownPlace(text, pendingService);
  }

  c.pending = { kind: "none" };
  // Everyday situations that name no service yet: one question instead of a guess.
  const situation = found.service || CASE_NUMBER.test(text) ? undefined : situationIn(text);
  if (situation) return turn.situation(situation);
  const strongStatus = mentions(text, STATUS) || CASE_NUMBER.test(text);
  if (strongStatus || (mentions(text, MY_APPLICATION) && !found.service)) return turn.status(text);
  if (mentions(text, SIMPLE)) return turn.simple();

  const detail = detailIn(text);
  const route = routeQuery(text);
  if (route.pot === "informationen" && !detail) return turn.information(text, found.service);
  if (found.service) {
    // "Ich ziehe nach Seehausen": the place comes with the request.
    const named = placesIn(text, false);
    if (named.length === 1 && found.service.level === "kommune") c.place = named[0].id;
    if (detail) return turn.detail(found.service, detail);
    if (!route.pot && !named.length) return turn.askPot(text, found.service);
    return turn.service(found.service);
  }
  if (found.options.length > 1) return turn.clarify(found.options);

  const current = c.service ? findService(c.service) : undefined;
  if (detail && current) return turn.detail(current, detail);
  if (mentions(text, HUMAN)) return turn.human();
  if (mentions(text, HELP)) return turn.help();
  // A lone "ja" or "nein" without an open question.
  if (words(text).every((w) => YES.includes(w) || NO.includes(w))) return turn.help();

  // A place on its own: "10200", "Ich wohne in Seehausen".
  const named = placesIn(text, false);
  if (named.length === 1 || /^\s*\d{5}\s*$/.test(text)) {
    if (turn.placeAnswer(text, current)) return;
    return turn.unknownPlace(text, current);
  }
  turn.fallback(text);
}

export function respond(conv: Conversation, input: { value: string; label?: string }, env: AssistantEnv): { conv: Conversation; effects: Effects } {
  const c: Conversation = { ...conv, messages: [...conv.messages] };
  const turn = new Turn(c, env);
  const shown = (input.label ?? input.value).trim();
  if (!shown) return { conv, effects: {} };
  c.messages.push({ id: c.next++, from: "user", text: shown });
  if (input.value.startsWith("#")) handleToken(turn, input.value);
  else handleText(turn, input.value);
  return { conv: c, effects: turn.effects };
}

// A new conversation. The search can hand over a question and a place it already knows.
export function startConversation(env: AssistantEnv, handoff: { question?: string; place?: string }): { conv: Conversation; effects: Effects } {
  const conv: Conversation = { messages: [], pending: { kind: "none" }, next: 1 };
  if (findPlace(handoff.place)) conv.place = handoff.place;
  const question = handoff.question?.trim();
  conv.messages.push({
    id: conv.next++,
    from: "bot",
    greeting: true,
    text: question
      ? [SITE.assistant.greeting]
      : [SITE.assistant.greeting, "Schreiben Sie einfach, was Sie vorhaben. Wenn ich etwas wissen muss, etwa Ihre Postleitzahl, frage ich nach."],
    choices: question ? undefined : starters(),
  });
  return question ? respond(conv, { value: question }, env) : { conv, effects: {} };
}
