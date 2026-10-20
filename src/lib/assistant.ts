import type { Place } from "@/data/content";
import { EXAMPLE_QUERIES, INTENTS } from "@/data/intents";
import { findService } from "@/data/services";
import { STATUS_LABEL, type Account, type Application } from "@/lib/account-store";
import { formatDate, pluralize } from "@/lib/format";
import { type Office, officeForPlace, officeOf } from "@/lib/offices";
import { findPlaces } from "@/lib/place-store";
import { normalize, searchInformation, searchServices } from "@/lib/smart-search";
import { routeQuery } from "@/lib/search-router";
import type { Service, Tenant } from "@/lib/types";

// Guided assistant: a small dialogue on top of the search engine. It asks only what the answer
// needs (above all the postcode), hands over to the portal in charge and knows the demo account.
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
  | { kind: "resident"; service: string };

export type Conversation = {
  messages: ChatMessage[];
  pending: Pending;
  service?: string; // service of the last answer, for follow-up questions
  place?: string; // place confirmed in this conversation
  question?: string; // the request in the person's words, handed over to another portal
  next: number;
};

export type AssistantEnv = {
  tenant: Tenant;
  base: string;
  tenants: Tenant[];
  places: Place[];
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
  return place.plz ? `${place.name} (${place.plz[0]})` : place.name;
}

function homePlace(env: AssistantEnv): Place | undefined {
  return env.places.find((p) => p.tenant === env.tenant.id);
}

// The Land portal itself, or the Land a city portal belongs to.
function landOf(env: AssistantEnv): Tenant | undefined {
  if (env.tenant.type === "info") return env.tenant;
  const land = homePlace(env)?.land;
  return land ? env.tenants.find((t) => t.id === land) : undefined;
}

// A place named in the text: a postcode, or "in Seehausen", "nach Bergtal", "Waldheim".
function placesIn(text: string, places: Place[], loose: boolean): Place[] {
  const digits = text.match(/\b\d{3,5}\b/)?.[0];
  if (digits) return findPlaces(digits, places);
  const list = words(text);
  const named = places.filter((p) => {
    const name = normalize(p.name);
    return list.join(" ").includes(name);
  });
  if (named.length || !loose) return named;
  // While asking for the place: also the beginning of a name ("Wald" for Waldheim).
  const rest = list.filter((w) => !["ich", "wir", "wohne", "wohnen", "lebe", "leben", "in", "nach", "aus", "jetzt", "der", "die", "gemeinde", "stadt", "ort"].includes(w) && !YES.includes(w) && !NO.includes(w));
  const query = rest.join(" ");
  return query.length >= 3 ? findPlaces(query, places) : [];
}

function starters(tenant: Tenant): Choice[] {
  const list = tenant.assistant?.starters ?? [...EXAMPLE_QUERIES[tenant.type], "Wie ist der Stand meines Antrags?"];
  return list.map((text) => ({ label: text, value: text }));
}

const TALK_TO_HUMAN: Choice = { label: "Mit einem Menschen sprechen", value: "#mensch" };

function factsOf(service: Service) {
  return [
    { label: "Kosten", value: service.costs },
    { label: "Dauer", value: service.duration },
    { label: "Online möglich", value: service.online ? "Ja" : "Nein, Termin vor Ort" },
  ];
}

function sourceOf(env: AssistantEnv, service: Service): ChatLink {
  return { label: `Leistungskatalog: ${service.title}`, href: `${env.base}/leistungen/${service.slug}` };
}

function serviceLinks(env: AssistantEnv, service: Service): ChatLink[] {
  const page = { label: "Alles zur Leistung", href: `${env.base}/leistungen/${service.slug}` };
  return service.online ? [{ label: "Online beantragen", href: `${env.base}/antrag/${service.slug}`, primary: true }, page] : [{ ...page, primary: true }];
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

function handoffHref(target: Tenant, c: Conversation, env: AssistantEnv, service: Service, place?: Place): string {
  const params = new URLSearchParams({ frage: c.question ?? service.title, von: env.tenant.id });
  if (place) params.set("ort", place.id);
  return `/${target.id}/assistent?${params.toString()}`;
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
    const { tenant } = this.env;
    this.c.service = service.slug;
    this.c.pending = { kind: "none" };
    if (service.level === "land") return this.landService(service);

    const known = this.c.place ? this.env.places.find((p) => p.id === this.c.place) : undefined;
    if (known) return this.forPlace(service, known);

    const stored = this.env.places.find((p) => p.id === this.env.placeId);
    const intro = `Für „${service.title}“ ist die Stelle an Ihrem Wohnort zuständig.`;

    if (tenant.type === "info") {
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
      return this.askPlace(service, intro);
    }

    // City portal: the city is preset. Ask only if it is unclear whether the person lives here.
    const home = homePlace(this.env);
    if (!home || stored?.id === home.id) {
      if (home) this.c.place = home.id;
      return this.local(service);
    }
    this.c.pending = { kind: "resident", service: service.slug };
    const question = service.slug === "wohnsitz-anmelden" ? `Liegt Ihre neue Wohnung in ${tenant.name}?` : `Wohnen Sie in ${tenant.name}?`;
    this.say({
      text: [intro, question],
      choices: [
        { label: "Ja", value: "#ja" },
        ...(stored ? [{ label: `Nein, in ${stored.name}`, value: `#ort:${stored.id}` }] : []),
        { label: stored ? "Nein, woanders" : "Nein", value: "#nein" },
      ],
    });
  }

  landService(service: Service) {
    const { tenant } = this.env;
    if (tenant.type === "service") {
      const land = landOf(this.env);
      if (land) {
        return this.say({
          text: [`„${service.title}“ bietet das Land an, nicht ${tenant.name}. Ihr Wohnort spielt dafür keine Rolle.`, `Ich gebe Ihr Anliegen an das ${land.tagline} ${land.name} weiter.`],
          facts: factsOf(service),
          links: [
            { label: `Im ${land.tagline} ${land.name} weiterfragen`, href: handoffHref(land, this.c, this.env, service), primary: true },
            { label: `${service.title} im ${land.tagline}`, href: `/${land.id}/leistungen/${service.slug}` },
          ],
        });
      }
    }
    this.say({
      text: [`„${service.title}“ bietet das Land selbst an. Ihr Wohnort spielt dafür keine Rolle. Zuständig ist:`],
      office: officeOf(tenant, service),
      facts: factsOf(service),
      links: serviceLinks(this.env, service),
      source: sourceOf(this.env, service),
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

  // A place is known: answer here, or hand over to the portal in charge.
  forPlace(service: Service, place: Place) {
    const { tenant, tenants } = this.env;
    this.c.place = place.id;
    this.c.pending = { kind: "none" };
    if (place.id !== this.env.placeId) this.effects.placeId = place.id;
    const office = place.tenant === tenant.id ? officeOf(tenant, service) : officeForPlace(place, service, tenants);

    const city = place.tenant && place.tenant !== tenant.id ? tenants.find((t) => t.id === place.tenant) : undefined;
    if (city) {
      return this.say({
        text: [
          `${place.name} hat ein eigenes ${city.tagline}. Dort finden Sie „${service.title}“ mit Ansprechpersonen${service.online ? " und Online-Antrag" : ""}.`,
          "Ihr Anliegen gebe ich mit, Sie müssen nicht neu anfangen.",
        ],
        office,
        links: [
          { label: `Im ${city.tagline} ${city.name} weiterfragen`, href: handoffHref(city, this.c, this.env, service, place), primary: true },
          { label: `${service.title} bei ${city.name}`, href: `/${city.id}/leistungen/${service.slug}` },
        ],
      });
    }

    if (tenant.type === "service" && place.tenant !== tenant.id) {
      const land = place.land ? tenants.find((t) => t.id === place.land) : undefined;
      return this.say({
        text: [`${place.name} gehört nicht zu ${tenant.name}. Für ${place.name} ist zuständig:`],
        office,
        links: land
          ? [
              { label: `Im ${land.tagline} ${land.name} weiterfragen`, href: handoffHref(land, this.c, this.env, service, place), primary: true },
              { label: `${service.title} im ${land.tagline}`, href: `/${land.id}/leistungen/${service.slug}` },
            ]
          : [],
        choices: [{ label: "Doch, ich wohne hier", value: "#ja" }],
      });
    }

    this.local(service, office, place);
  }

  local(service: Service, office = officeOf(this.env.tenant, service), place?: Place) {
    this.say({
      text: [place && place.tenant !== this.env.tenant.id ? `Für „${service.title}“ in ${place.name} ist zuständig:` : `Für „${service.title}“ ist zuständig:`],
      office,
      facts: factsOf(service),
      links: serviceLinks(this.env, service),
      source: sourceOf(this.env, service),
      choices: followUps(service),
    });
  }

  withoutPlace(service: Service) {
    this.c.pending = { kind: "none" };
    this.say({
      text: ["Ohne Postleitzahl kann ich die zuständige Stelle nicht nennen. Alles andere gilt überall:"],
      facts: factsOf(service),
      links: serviceLinks(this.env, service),
      source: sourceOf(this.env, service),
      choices: [{ label: "Postleitzahl angeben", value: "#ort-aendern" }, ...followUps(service)],
    });
  }

  detail(service: Service, key: Detail) {
    this.c.service = service.slug;
    const name = `„${service.title}“`;
    const base = { source: sourceOf(this.env, service), choices: followUps(service, key) };
    if (key === "kosten") return this.say({ text: [`Kosten für ${name}: ${service.costs}.`], ...base });
    if (key === "dauer") return this.say({ text: [`Dauer für ${name}: ${service.duration}.`], ...base });
    if (key === "unterlagen") return this.say({ text: [`Für ${name} brauchen Sie:`], list: service.documents, ...base });
    if (key === "online") {
      return service.online
        ? this.say({ text: [`Ja, ${name} können Sie online beantragen.`], links: serviceLinks(this.env, service), ...base })
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
      return this.say({ text: ["Gerne einfacher. Schreiben Sie in wenigen Worten, was Sie brauchen.", "Zum Beispiel: „Ausweis“ oder „Umzug“."] });
    }
    const place = this.env.places.find((p) => p.id === this.c.place);
    const office = place ? (place.tenant === this.env.tenant.id ? officeOf(this.env.tenant, service) : officeForPlace(place, service, this.env.tenants)) : undefined;
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
      links: serviceLinks(this.env, service),
      choices: [TALK_TO_HUMAN],
    });
  }

  // ---------- Places ----------

  place(service: Service | undefined, place: Place) {
    if (service) return this.forPlace(service, place);
    this.c.place = place.id;
    this.c.pending = { kind: "none" };
    if (place.id !== this.env.placeId) this.effects.placeId = place.id;
    this.say({ text: [`Gemerkt: ${placeLabel(place)}. Wobei kann ich helfen?`], choices: starters(this.env.tenant) });
  }

  placeAnswer(input: string, service: Service | undefined): boolean {
    const found = placesIn(input, this.env.places, true);
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
    const land = landOf(this.env);
    const where = land?.name ?? this.env.tenant.region;
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
    const { base } = this.env;
    const account = this.env.account;
    if (!account?.signedIn) {
      return this.say({
        text: ["Den Stand Ihrer Anträge sehe ich, wenn Sie angemeldet sind.", "Im Klick-Dummy geht das mit einem Demo-Konto, ganz ohne Passwort."],
        choices: [{ label: "Mit Demo-Konto anmelden", value: "#anmelden" }],
        links: [{ label: "Zum Nutzerkonto", href: `${base}/konto` }],
      });
    }
    const apps = account.applications;
    if (!apps.length) {
      return this.say({ text: ["Sie sind angemeldet, haben aber noch keinen Antrag gestellt.", "Wobei kann ich helfen?"], choices: starters(this.env.tenant) });
    }
    const unread = account.messages.filter((m) => !m.read).length;
    const inbox = unread
      ? `Im Postfach ${unread === 1 ? "liegt eine ungelesene Nachricht" : `liegen ${unread} ungelesene Nachrichten`}.`
      : "Im Postfach haben Sie alles gelesen.";
    const links = [{ label: "Zum Postfach", href: `${base}/konto`, primary: true }];
    const choices = [{ label: "Was bedeuten die Stufen?", value: "#stufen" }];

    const number = text.match(CASE_NUMBER)?.[0].toUpperCase();
    const one = number ? apps.find((a) => a.id === number) : apps.length === 1 ? apps[0] : undefined;
    if (one) {
      const last = account.messages.find((m) => m.applicationId === one.id);
      return this.say({
        text: [
          `„${one.serviceTitle}“ bei ${one.tenantName}, Vorgangsnummer ${one.id}:`,
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
      list: apps.slice(0, 5).map((a: Application) => `${a.serviceTitle}, ${a.tenantName}: ${STATUS_LABEL[a.status]} (Vorgangsnummer ${a.id})`),
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
      links: [{ label: "Zum Postfach", href: `${this.env.base}/konto` }],
    });
  }

  // ---------- Everything else ----------

  human() {
    const { tenant } = this.env;
    const service = this.c.service ? findService(this.c.service) : undefined;
    const place = this.env.places.find((p) => p.id === this.c.place);
    const office = service && place ? (place.tenant === tenant.id ? officeOf(tenant, service) : officeForPlace(place, service, this.env.tenants)) : { ...tenant.contact };
    this.say({
      text: [service && place ? `Für „${service.title}“ erreichen Sie hier Menschen, die weiterhelfen:` : "Gerne. Hier erreichen Sie Menschen, die weiterhelfen:"],
      office,
    });
  }

  help() {
    this.say({
      text: [
        "Ich helfe Ihnen, die passende Leistung und die zuständige Stelle zu finden. Ich frage nur, was ich für die Antwort brauche, zum Beispiel Ihre Postleitzahl.",
        "Ich kann auch den Stand Ihrer Anträge nennen. Womit fangen wir an?",
      ],
      choices: [...starters(this.env.tenant), TALK_TO_HUMAN],
    });
  }

  // Like the search: one request goes to one pot. Information only when that is what is asked for.
  information(query: string, service?: Service) {
    const hits = searchInformation(this.env.tenant, query).slice(0, 4);
    const back = service ? [{ label: `Stattdessen: ${service.title}`, value: `#leistung:${service.slug}` }] : [];
    if (!hits.length) {
      return this.say({ text: [`Zu „${query.trim()}“ finde ich keine Informationen oder Meldungen.`], choices: [...back, TALK_TO_HUMAN] });
    }
    this.say({
      text: ["Dazu habe ich Informationen und Meldungen gefunden:"],
      links: hits.map((hit) => ({ label: hit.title, href: this.env.base + hit.href })),
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
    const { tenant, base } = this.env;
    // Information only as a second request, when no service fits.
    const info = searchInformation(tenant, text).slice(0, 3);
    if (info.length) {
      return this.say({
        text: ["Eine passende Leistung habe ich nicht gefunden, aber diese Informationen:"],
        links: info.map((hit) => ({ label: hit.title, href: base + hit.href })),
        choices: [TALK_TO_HUMAN],
      });
    }
    this.say({
      text: ["Das habe ich leider nicht verstanden.", "Beschreiben Sie Ihr Anliegen in wenigen Worten, zum Beispiel „Ausweis verloren“ oder „Hund anmelden“."],
      links: [{ label: `Im ganzen Portal nach „${text.trim()}“ suchen`, href: `${base}/suche?q=${encodeURIComponent(text.trim())}` }],
      choices: [...starters(tenant).slice(0, 2), TALK_TO_HUMAN],
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
    if (service) c.question = service.title;
    return service ? turn.service(service) : turn.help();
  }
  if (token.startsWith("#detail:") && current) return turn.detail(current, token.slice(8) as Detail);
  if (token.startsWith("#info:")) {
    const query = token.slice(6);
    return turn.information(query, searchServices(query).answer);
  }
  if (token.startsWith("#ort:")) {
    const place = env.places.find((p) => p.id === token.slice(5));
    return place ? turn.place(pendingService ?? current, place) : turn.askPlace(pendingService ?? current);
  }
  if (token === "#ja") {
    if (pending.kind === "confirm") {
      const place = env.places.find((p) => p.id === pending.place);
      if (pendingService && place) return turn.forPlace(pendingService, place);
    }
    const home = homePlace(env);
    if ((pending.kind === "resident" || c.place !== home?.id) && home && (pendingService ?? current)) {
      return turn.forPlace((pendingService ?? current)!, home);
    }
  }
  if (token === "#nein") return turn.askPlace(pendingService ?? current);
  turn.help();
}

function handleText(turn: Turn, text: string) {
  const { c, env } = turn;
  const pending = c.pending;
  const pendingService = "service" in pending && pending.service ? findService(pending.service) : undefined;
  const found = serviceIn(text);

  // Answers to the last question first.
  if (pending.kind === "confirm" || pending.kind === "resident") {
    const named = placesIn(text, env.places, false);
    if (named.length === 1 && pendingService) return turn.forPlace(pendingService, named[0]);
    if (saysWord(text, YES)) return handleToken(turn, "#ja");
    if (saysWord(text, NO)) return handleToken(turn, "#nein");
  }
  if (pending.kind === "place" || pending.kind === "pick") {
    if (mentions(text, NO_PLACE)) return handleToken(turn, "#ohne-ort");
    if (turn.placeAnswer(text, pendingService)) return;
    // Not a place: either a new topic, or a place this portal does not know.
    const otherTopic = found.service || found.options.length || mentions(text, [...STATUS, ...HUMAN]);
    if (!otherTopic) return turn.unknownPlace(text, pendingService);
  }

  c.pending = { kind: "none" };
  const strongStatus = mentions(text, STATUS) || CASE_NUMBER.test(text);
  if (strongStatus || (mentions(text, MY_APPLICATION) && !found.service)) return turn.status(text);
  if (mentions(text, SIMPLE)) return turn.simple();

  const detail = detailIn(text);
  const route = routeQuery(text);
  if (route.pot === "informationen" && !detail) return turn.information(text, found.service);
  if (found.service) {
    c.question = text.trim();
    // "Ich ziehe nach Seehausen": the place comes with the request.
    const named = placesIn(text, env.places, false);
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
  const named = placesIn(text, env.places, false);
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

export function startConversation(
  env: AssistantEnv,
  handoff: { question?: string; from?: string; place?: string },
): { conv: Conversation; effects: Effects } {
  const { tenant, tenants, places } = env;
  const conv: Conversation = { messages: [], pending: { kind: "none" }, next: 1 };
  if (handoff.place && places.some((p) => p.id === handoff.place)) conv.place = handoff.place;

  const greeting = tenant.assistant?.greeting ?? `Guten Tag! Ich bin der automatische Assistent für ${tenant.name}.`;
  const from = handoff.from ? tenants.find((t) => t.id === handoff.from && t.id !== tenant.id) : undefined;
  const question = handoff.question?.trim();

  if (!question) {
    conv.messages.push({
      id: conv.next++,
      from: "bot",
      greeting: true,
      text: [greeting, "Schreiben Sie einfach, was Sie vorhaben. Wenn ich etwas wissen muss, etwa Ihre Postleitzahl, frage ich nach."],
      choices: starters(tenant),
    });
    return { conv, effects: {} };
  }
  conv.messages.push({
    id: conv.next++,
    from: "bot",
    greeting: true,
    text: from ? [greeting, `Sie kommen aus dem ${from.tagline} ${from.name}. Ihr Anliegen habe ich übernommen.`] : [greeting],
  });
  return respond(conv, { value: question }, env);
}
