// Fälle für Tests mit echten Nutzerinnen und Nutzern. Im Konfigurator wird aus einem Fall und einem Ablauf ein
// Szenario. Getestet wird die eine Ergebnisseite (/ergebnisse), und nur die Suche: Jeder Test endet vor dem Antrag.

export type FlowStep = { kind: "person" | "wait" | "page" | "end"; text: string };

// Der Ablauf eines Szenarios.
export type TestConfig = {
  // Wo nach dem Ort gefragt wird: gar nicht, im Suchformular, im Overlay direkt nach der Suche oder erst auf der Ergebnisseite.
  place: "none" | "start" | "overlay" | "results";
  // Ob ein unklarer Begriff im Overlay „Was suchen Sie?“ fragt. Ohne Frage zeigt die Seite gleich die Ergebnisse.
  potOverlay: boolean;
  wait: 2 | 3 | 5 | 10;
  results: "list" | "tabs";
  // Wie viele Treffer die Ergebnisseite höchstens zeigt.
  maxServices: 1 | 2 | 3 | 5;
  maxInfos: 1 | 3 | 5 | "all";
  // Wenn es nur um Informationen geht: wie viele Leistungen zum selben Thema dazukommen.
  topicServices: 0 | 1 | 2 | 3;
};

export const DEFAULT_CONFIG: TestConfig = { place: "results", potOverlay: true, wait: 3, results: "list", maxServices: 3, maxInfos: "all", topicServices: 0 };

// Nach dieser Zeit kommt zum Skeleton ein Hinweis mit Ladeanimation. Bei 3 Sekunden gibt es keinen zweiten Zustand.
export function hintAfter(wait: TestConfig["wait"]): number | undefined {
  return wait === 10 ? 5 : wait === 5 ? 3 : undefined;
}

export type Scenario = {
  id: number;
  // Name des Falls im Konfigurator.
  label: string;
  // Worum es geht, in einem Satz.
  summary: string;
  // Vorschlag für „Was wollen wir herausfinden?“, im Konfigurator änderbar.
  goal: string;
  // Bestimmt zusammen mit dem Ablauf den Klickpfad, siehe scenarioPath.
  flow: "clear" | "regional" | "info" | "lead" | "unclear";
  // Die Fragen nach dem Ort, die zu diesem Fall passen. Die erste ist die Vorgabe.
  places: TestConfig["place"][];
  // Der letzte Stand, bevor der Test endet.
  outcome: FlowStep;
  // Die Person muss danach in den Informationen weiterlesen.
  readOn?: boolean;
  end: FlowStep;
  // Wird vorgelesen. Nennt bewusst keine Wörter aus der Oberfläche.
  task: string;
  // Fiktiver Wohnort, die Testperson bekommt ihn auf einer Karte.
  home: string;
  // Steht groß auf der Aufgabenseite. Im moderierten Test nur nennen, wenn die Person keinen Begriff findet.
  term: string;
  success: string;
  ask: string;
};

const SEEHAUSEN = "Sie wohnen in Seehausen, Postleitzahl 10200.";
const WALDHEIM = "Sie wohnen in Waldheim, Postleitzahl 10300.";

const person = (text: string): FlowStep => ({ kind: "person", text });
const page = (text: string): FlowStep => ({ kind: "page", text });
const PICK_APPLY = person("Wählt „Etwas beantragen“");
const STOP: FlowStep = { kind: "end", text: "Test endet vor dem Antrag" };
const ANSWERED: FlowStep = { kind: "end", text: "Test endet, die Frage ist beantwortet" };

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    label: "Leistung ohne PLZ",
    summary: "Die Suche findet mehrere passende, bundesweit einheitliche Leistungen.",
    goal: "Erkennen die Menschen die richtige Leistung, und fehlt ihnen die Frage nach dem Ort?",
    flow: "clear",
    places: ["none", "start"],
    outcome: page("Leistungen ohne Feld für den Ort, die beste zuerst, mit dem Hinweis „Bundesweit einheitlich“"),
    end: STOP,
    task: "Ihr Personalausweis läuft in zwei Monaten ab. Was müssen Sie jetzt tun?",
    home: SEEHAUSEN,
    term: "Personalausweis",
    success: "Die Person wählt „Personalausweis beantragen“ und sagt, was sie mitbringen muss.",
    ask: "Haben Sie erwartet, dass Sie Ihren Wohnort angeben müssen?",
  },
  {
    id: 2,
    label: "Leistung mit PLZ, am Ort vorhanden",
    summary: "Ohne Ort gibt es kein Ergebnis.",
    goal: "Verstehen die Menschen die Frage nach dem Ort, oder schreckt sie ab?",
    flow: "regional",
    places: ["results", "overlay", "start"],
    outcome: page("Leistung mit Bürgerbüro Seehausen"),
    end: STOP,
    task: "Sie haben sich einen Hund angeschafft. Müssen Sie ihn irgendwo anmelden, und wenn ja, wo?",
    home: SEEHAUSEN,
    term: "Hund anmelden",
    success: "Die Person gibt ihren Ort ein und nennt das Bürgerbüro Seehausen und die Frist von einem Monat.",
    ask: "Was haben Sie gedacht, als nach Ihrem Ort gefragt wurde?",
  },
  {
    id: 3,
    label: "Leistung mit PLZ, am Ort nicht vorhanden",
    summary: "Waldheim hat keine Gewässer und bietet keinen Fischereischein an.",
    goal: "Verstehen die Menschen das als Antwort, und lesen sie in den Informationen weiter?",
    flow: "regional",
    places: ["results", "overlay", "start"],
    outcome: page("Hinweis, dass es für diesen Ort nichts gibt"),
    readOn: true,
    end: ANSWERED,
    task: "Sie möchten am Wochenende angeln gehen. Was brauchen Sie dafür?",
    home: WALDHEIM,
    term: "Angelschein",
    success: "Die Person sagt, dass es dazu in Waldheim nichts gibt, und liest in den Informationen weiter.",
    ask: "Was hat Ihnen der Hinweis gesagt?",
  },
  {
    id: 4,
    label: "Information ohne PLZ",
    summary: "Die Suche findet keine Leistung, es geht nur um Informationen.",
    goal: "Finden die Menschen die Meldung?",
    flow: "info",
    places: ["none", "start"],
    outcome: person("Liest die Meldung zur Baustelle"),
    end: ANSWERED,
    task: "Am Marktplatz in Beispielstadt ist Baustelle, und Ihr Bus fährt anders als sonst. Bis wann bleibt das so?",
    home: "Sie wohnen in Beispielstadt, Postleitzahl 20100.",
    term: "Baustelle Marktplatz",
    success: "Die Person sagt „bis Dezember“.",
    ask: "Haben Sie auf der Seite etwas vermisst?",
  },
  {
    id: 5,
    label: "Information mit PLZ, dann kommt eine Leistung",
    summary: "Die Suche ist erst unklar, mit dem Ort taucht eine Leistung auf.",
    goal: "Stört das Feld für den Ort, und verstehen die Menschen, warum sich die Seite ändert?",
    flow: "lead",
    places: ["results", "start"],
    outcome: page("Leistungsbereich mit passender Leistung"),
    end: STOP,
    task: "Jemand hat Ihnen erzählt, dass Familien in Ihrer Gegend Unterstützung bekommen können. Ist für Sie etwas dabei?",
    home: SEEHAUSEN,
    term: "Unterstützung für Familien",
    success: "Die Person trägt ihren Ort ein und nennt mindestens eine passende Leistung.",
    ask: "Was hat sich auf der Seite verändert, nachdem Sie den Ort eingegeben haben?",
  },
  {
    id: 6,
    label: "Begriff unklar",
    summary: "Aus dem Begriff allein geht nicht hervor, was gemeint ist.",
    goal: "Verstehen die Menschen eine Rückfrage, oder empfinden sie sie als Hürde?",
    flow: "unclear",
    places: ["none", "start"],
    outcome: page("Kindergeld als Leistung, ohne Feld für den Ort"),
    end: STOP,
    task: "Ihr Kind ist gerade geboren, und Sie möchten jetzt Geld für Ihr Kind bekommen. Suchen Sie nach dem Wort Kindergeld.",
    home: SEEHAUSEN,
    term: "Kindergeld",
    success: "Die Person findet Kindergeld auf der Ergebnisseite.",
    ask: "Hätten Sie diese Frage gebraucht?",
  },
];

export function findScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => String(s.id) === id);
}

export function defaultConfig(scenario: Scenario): TestConfig {
  return { ...DEFAULT_CONFIG, place: scenario.places[0] };
}

// Ein im Konfigurator gespeichertes Szenario: ein Fall, sein Ablauf und was wir damit herausfinden wollen.
export type SavedScenario = { id: string; scenarioId: number; config: TestConfig; goal: string };

// Stehen beim ersten Öffnen schon da und lassen sich löschen wie alle anderen.
export const STARTER_SCENARIOS: SavedScenario[] = SCENARIOS.map((s) => ({ id: String(s.id), scenarioId: s.id, config: defaultConfig(s), goal: s.goal }));

// Ort und Postleitzahl aus dem Satz auf der Wohnortkarte.
export function homeOf(scenario: Scenario): { town: string; plz: string } | undefined {
  const match = scenario.home.match(/in (.+), Postleitzahl (\d+)/);
  return match ? { town: match[1], plz: match[2] } : undefined;
}

const PLACE_SHORT: Record<TestConfig["place"], string> = {
  none: "ohne PLZ",
  start: "PLZ im Formular",
  overlay: "PLZ im Overlay",
  results: "PLZ auf der Ergebnisseite",
};

export function scenarioName(scenario: Scenario, config: TestConfig): string {
  const parts = [scenario.term, PLACE_SHORT[config.place]];
  if (scenario.flow === "unclear") parts.push(config.potOverlay ? "mit Rückfrage" : "ohne Rückfrage");
  parts.push(`${config.wait} Sek.`, config.results === "tabs" ? "Tabs" : "Eine Seite", `bis ${scenario.flow === "info" ? config.topicServices : config.maxServices} Leistungen`, config.maxInfos === "all" ? "alle Informationen" : `bis ${config.maxInfos} Informationen`);
  return parts.join(" · ");
}

// Der Ablauf als ein Satz.
export function scenarioSentence(scenario: Scenario, config: TestConfig): string {
  const plz = homeOf(scenario)?.plz ?? "";
  const steps = [config.place === "start" ? `Sucht nach „${scenario.term}“ und gibt im Suchformular ${plz} ein` : `Sucht nach „${scenario.term}“`];
  if (config.place === "overlay") steps.push(`gibt im Overlay ${plz} ein`);
  if (config.place === "results") steps.push(`gibt auf der Ergebnisseite ${plz} ein`);
  if (scenario.flow === "unclear" && config.potOverlay) steps.push("beantwortet im Overlay „Was suchen Sie?“");
  steps.push(`wartet ${config.wait} Sekunden`);
  return `${steps.join(", ")} und sieht ${config.results === "tabs" ? "zwei Tabs" : "die Ergebnisse auf einer Seite"}.`;
}

// Der Ablauf als ein Zeichen in der Adresse der Aufgabenseite: Testpersonen sollen ihn nicht lesen können.
// Neue Werte kommen hinten dazu, damit verschickte Links gültig bleiben.
const PLACES: TestConfig["place"][] = ["start", "overlay", "results", "none"];
const WAITS: TestConfig["wait"][] = [3, 5, 10];
const MAX_SERVICES: TestConfig["maxServices"][] = [3, 1, 2, 5];
const MAX_INFOS: TestConfig["maxInfos"][] = ["all", 1, 3, 5];

// Spätere Einstellungen stehen in eigenen Bereichen der Zahl, damit ältere Codes gültig bleiben.
const SHORT_WAIT = 768;
const TOPIC_STEP = SHORT_WAIT * 2;

function variantCode(config: TestConfig): string {
  const wait = WAITS.indexOf(config.wait === 2 ? 3 : config.wait);
  const flow = PLACES.indexOf(config.place) * 12 + (config.potOverlay ? 6 : 0) + wait * 2 + (config.results === "tabs" ? 1 : 0);
  const limits = MAX_SERVICES.indexOf(config.maxServices) + MAX_INFOS.indexOf(config.maxInfos) * 4;
  return (flow + limits * 48 + (config.wait === 2 ? SHORT_WAIT : 0) + config.topicServices * TOPIC_STEP).toString(36);
}

export function configOfCode(code: string | null): TestConfig {
  const whole = code ? parseInt(code, 36) : NaN;
  if (!(whole >= 0 && whole < TOPIC_STEP * 4)) return DEFAULT_CONFIG;
  const parsed = whole % TOPIC_STEP;
  const number = parsed % SHORT_WAIT;
  const flow = number % 48;
  const limits = Math.floor(number / 48);
  return {
    place: PLACES[Math.floor(flow / 12)],
    potOverlay: flow % 12 >= 6,
    wait: parsed >= SHORT_WAIT ? 2 : WAITS[Math.floor((flow % 6) / 2)],
    results: flow % 2 ? "tabs" : "list",
    maxServices: MAX_SERVICES[limits % 4],
    maxInfos: MAX_INFOS[Math.floor(limits / 4)],
    topicServices: Math.floor(whole / TOPIC_STEP) as TestConfig["topicServices"],
  };
}

export function taskHref(scenario: Scenario, config: TestConfig): string {
  return `/aufgabe/${scenario.id}?v=${variantCode(config)}`;
}

// Der Klickpfad, wie ihn der eingestellte Ablauf tatsächlich zeigt.
export function scenarioPath(scenario: Scenario, config: TestConfig): FlowStep[] {
  const { flow, outcome, end, term } = scenario;
  const tabs = config.results === "tabs";
  const inForm = config.place === "start";
  const plz = homeOf(scenario)?.plz ?? "";
  const hint = hintAfter(config.wait);

  const search = person(inForm ? `Sucht nach „${term}“ und gibt im Formular ${plz} ein` : `Sucht nach „${term}“`);
  const enter = person(`Gibt ${plz} ein`);
  const wait: FlowStep = { kind: "wait", text: `Skeleton mit Ladeanimation, ${config.wait} Sekunden${hint ? `, nach ${hint} Sekunden zusätzlich ein Hinweis` : ""}` };
  const ending = [outcome, ...(scenario.readOn ? [person(tabs ? "Wechselt zum Tab Informationen" : "Liest in den Informationen weiter")] : []), end];

  if (flow === "unclear") {
    return config.potOverlay ? [search, page("Overlay „Was suchen Sie?“, dahinter das Skeleton"), PICK_APPLY, wait, ...ending] : [search, wait, ...ending];
  }
  if (flow === "info") {
    const shown = config.topicServices
      ? tabs
        ? "Tab Informationen offen, im Tab Leistungen passende Leistungen"
        : "Informationen, darunter passende Leistungen"
      : inForm
        ? "Hinweis, dass es am Ort keine Leistung gibt, dazu die Informationen"
        : tabs
          ? "Tab Informationen offen"
          : "Nur Informationen, ohne Feld für den Ort";
    return [search, wait, page(shown), ...ending];
  }
  // Der Ort steht schon im Formular oder spielt keine Rolle: Die erste Antwort ist auch die letzte.
  if (inForm || flow === "clear") return [search, wait, ...ending];
  if (flow === "regional") {
    return config.place === "overlay"
      ? [search, page("Overlay fragt nach dem Ort, dahinter das Skeleton"), enter, wait, ...ending]
      : [search, wait, page(tabs ? "Tab Leistungen fragt nach dem Ort" : "Leistungsbereich fragt nach dem Ort"), enter, wait, ...ending];
  }
  const infoOnly = page(tabs ? "Tab Informationen offen, das Feld für den Ort liegt im Tab Leistungen" : "Zwei Zeilen zum Ort, darunter die Informationen");
  return [search, wait, infoOnly, ...(tabs ? [person("Wechselt zum Tab Leistungen")] : []), enter, wait, ...ending];
}
