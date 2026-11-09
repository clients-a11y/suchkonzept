// Szenarien für Tests mit echten Nutzerinnen und Nutzern. Getestet wird die eine Ergebnisseite (/ergebnisse),
// und nur die Suche: Jeder Test endet vor dem Antrag.

export type FlowStep = { kind: "person" | "wait" | "page" | "end"; text: string };

// Was sich je Szenario vor dem Start einstellen lässt.
export type TestConfig = {
  // Wo nach dem Ort gefragt wird: im Suchformular, im Overlay direkt nach der Suche oder erst auf der Ergebnisseite.
  place: "start" | "overlay" | "results";
  // Ob ein unklarer Begriff im Overlay „Was suchen Sie?“ fragt. Ohne Frage zeigt die Seite gleich die Ergebnisse.
  potOverlay: boolean;
  wait: 3 | 5 | 10;
  results: "list" | "tabs";
};

export const DEFAULT_CONFIG: TestConfig = { place: "results", potOverlay: true, wait: 3, results: "list" };

// Nach dieser Zeit kommt zum Skeleton ein Hinweis mit Ladeanimation. Bei 3 Sekunden gibt es keinen zweiten Zustand.
export function hintAfter(wait: TestConfig["wait"]): number | undefined {
  return wait === 10 ? 5 : wait === 5 ? 3 : undefined;
}

export type Scenario = {
  id: number;
  // Der Fall, den die Aufgabe prüft.
  case: string;
  title: string;
  // Für die Übersicht: worum es geht, in ein bis zwei Sätzen.
  summary: string;
  // Bestimmt zusammen mit den Einstellungen den Klickpfad, siehe scenarioPath.
  flow: "clear" | "regional" | "info" | "lead" | "unclear";
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
  observe: string[];
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
    case: "Fall 1",
    title: "Eine klare Leistung ohne Ort",
    summary: "Die Suche erkennt eine bundesweit einheitliche Leistung eindeutig, eine Postleitzahl ist nicht nötig. Wir prüfen, ob die Menschen sie sofort sehen und ob ihnen die Frage nach dem Ort fehlt.",
    flow: "clear",
    outcome: page("Leistung ohne Feld für den Ort, mit dem Hinweis „Bundesweit einheitlich“"),
    end: STOP,
    task: "Ihr Personalausweis läuft in zwei Monaten ab. Was müssen Sie jetzt tun?",
    home: SEEHAUSEN,
    term: "Personalausweis",
    observe: ["Wohin schaut die Person zuerst?", "Sucht sie nach einer Stelle oder einem Feld für ihren Wohnort?"],
    success: "Die Person findet die Leistung und sagt, was sie mitbringen muss.",
    ask: "Haben Sie erwartet, dass Sie Ihren Wohnort angeben müssen?",
  },
  {
    id: 2,
    case: "Fall 2",
    title: "Leistung, die vom Ort abhängt",
    summary: "Es ist eine Leistung, aber ohne Ort gibt es kein Ergebnis. Wir prüfen, ob die Menschen die Frage nach dem Ort verstehen oder ob sie abschreckt.",
    flow: "regional",
    outcome: page("Leistung mit Bürgerbüro Seehausen"),
    end: STOP,
    task: "Sie haben sich einen Hund angeschafft. Müssen Sie ihn irgendwo anmelden, und wenn ja, wo?",
    home: SEEHAUSEN,
    term: "Hund anmelden",
    observe: ["Denkt die Person, die Seite lädt noch oder ist kaputt?", "Gibt sie den Ort ein, oder übergeht sie die Frage?"],
    success: "Die Person gibt ihren Ort ein und nennt das Bürgerbüro Seehausen und die Frist von einem Monat.",
    ask: "Was haben Sie gedacht, als nach Ihrem Ort gefragt wurde?",
  },
  {
    id: 3,
    case: "Fall 2",
    title: "Für diesen Ort gibt es nichts",
    summary: "Waldheim hat keine Gewässer und bietet deshalb keinen Fischereischein an. Wir prüfen, ob die Menschen das als Antwort verstehen und in den Informationen weiterlesen.",
    flow: "regional",
    outcome: page("Hinweis, dass es für diesen Ort nichts gibt"),
    readOn: true,
    end: ANSWERED,
    task: "Sie möchten am Wochenende angeln gehen. Was brauchen Sie dafür?",
    home: WALDHEIM,
    term: "Angelschein",
    observe: ["Hält die Person das für einen Fehler der Suche?", "Liest sie in den Informationen weiter?"],
    success: "Die Person sagt, dass es dazu in Waldheim nichts gibt, und liest in den Informationen weiter.",
    ask: "Was hat Ihnen der Hinweis gesagt?",
  },
  {
    id: 4,
    case: "Fall 3",
    title: "Reine Information",
    summary: "Die Suche findet keine klare Leistung, es geht nur um Informationen. Wir prüfen, ob die Menschen die Meldung finden und ob das Feld für den Ort sie stört.",
    flow: "info",
    outcome: person("Liest die Meldung zur Baustelle"),
    end: ANSWERED,
    task: "Am Marktplatz in Beispielstadt ist Baustelle, und Ihr Bus fährt anders als sonst. Bis wann bleibt das so?",
    home: "Sie wohnen in Beispielstadt, Postleitzahl 20100.",
    term: "Baustelle Marktplatz",
    observe: ["Bemerkt die Person das Feld für den Ort?", "Trägt sie dort etwas ein, obwohl sie nur lesen will?"],
    success: "Die Person sagt „bis Dezember“.",
    ask: "Was passiert Ihrer Meinung nach, wenn Sie in das kleine Feld etwas eintragen?",
  },
  {
    id: 5,
    case: "Fall 3, dann Fall 1",
    title: "Von der Information zur Leistung",
    summary: "Die Suche ist erst unklar, mit dem Ort taucht eine Leistung auf. Wir prüfen, ob die Menschen verstehen, warum sich die Seite ändert.",
    flow: "lead",
    outcome: page("Leistungsbereich mit passender Leistung"),
    end: STOP,
    task: "Jemand hat Ihnen erzählt, dass Familien in Ihrer Gegend Unterstützung bekommen können. Ist für Sie etwas dabei?",
    home: SEEHAUSEN,
    term: "Unterstützung für Familien",
    observe: ["Trägt die Person ihren Ort von selbst ein?", "Findet sie sich zurecht, wenn die Seite sich umbaut?"],
    success: "Die Person trägt ihren Ort ein und nennt mindestens eine passende Leistung.",
    ask: "Was hat sich auf der Seite verändert, nachdem Sie den Ort eingegeben haben?",
  },
  {
    id: 6,
    case: "Unklar: Leistung oder Information",
    title: "Die Suche fragt zuerst nach",
    summary: "Aus dem Begriff allein geht nicht hervor, was gemeint ist. Ein Overlay fragt vor den Treffern nach. Wir prüfen, ob die Menschen die Frage verstehen oder sie als Hürde empfinden.",
    flow: "unclear",
    outcome: page("Kindergeld als Leistung, ohne Feld für den Ort"),
    end: STOP,
    task: "Ihr Kind ist gerade geboren, und Sie möchten jetzt Geld für Ihr Kind bekommen. Suchen Sie nach dem Wort Kindergeld.",
    home: SEEHAUSEN,
    term: "Kindergeld",
    observe: ["Versteht die Person die Frage, oder stört sie sie?", "Wählt sie ohne Zögern?"],
    success: "Die Person findet Kindergeld auf der Ergebnisseite.",
    ask: "Hätten Sie diese Frage gebraucht?",
  },
];

export function findScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => String(s.id) === id);
}

// Ort und Postleitzahl aus dem Satz auf der Wohnortkarte.
export function homeOf(scenario: Scenario): { town: string; plz: string } | undefined {
  const match = scenario.home.match(/in (.+), Postleitzahl (\d+)/);
  return match ? { town: match[1], plz: match[2] } : undefined;
}

export function placeOf(scenario: Scenario): string | undefined {
  const home = homeOf(scenario);
  return home ? `${home.town}, ${home.plz}` : undefined;
}

// Die Einstellungen als ein Zeichen in der Adresse der Aufgabenseite: Testpersonen sollen sie nicht lesen können.
const PLACES: TestConfig["place"][] = ["start", "overlay", "results"];
const WAITS: TestConfig["wait"][] = [3, 5, 10];

function variantCode(config: TestConfig): string {
  const number = PLACES.indexOf(config.place) * 12 + (config.potOverlay ? 6 : 0) + WAITS.indexOf(config.wait) * 2 + (config.results === "tabs" ? 1 : 0);
  return number.toString(36);
}

export function configOfCode(code: string | null): TestConfig {
  const number = code ? parseInt(code, 36) : NaN;
  if (!(number >= 0 && number < 36)) return DEFAULT_CONFIG;
  return {
    place: PLACES[Math.floor(number / 12)],
    potOverlay: number % 12 >= 6,
    wait: WAITS[Math.floor((number % 6) / 2)],
    results: number % 2 ? "tabs" : "list",
  };
}

export function taskHref(scenario: Scenario, config: TestConfig): string {
  return `/aufgabe/${scenario.id}?v=${variantCode(config)}`;
}

// Der Klickpfad, wie ihn die eingestellte Variante tatsächlich zeigt.
export function scenarioPath(scenario: Scenario, config: TestConfig): FlowStep[] {
  const { flow, outcome, end, term } = scenario;
  const tabs = config.results === "tabs";
  const inForm = config.place === "start";
  const plz = homeOf(scenario)?.plz ?? "";
  const hint = hintAfter(config.wait);

  const search = person(inForm ? `Sucht nach „${term}“ und gibt im Formular ${plz} ein` : `Sucht nach „${term}“`);
  const enter = person(`Gibt ${plz} ein`);
  const wait: FlowStep = { kind: "wait", text: `Skeleton mit Ladeanimation, ${config.wait} Sekunden${hint ? `, nach ${hint} Sekunden zusätzlich ein Hinweis` : ""}` };
  const infoOnly = page(tabs ? "Tab Informationen offen, das Feld für den Ort liegt im Tab Leistungen" : "Zwei Zeilen zum Ort, darunter die Informationen");
  const ending = [outcome, ...(scenario.readOn ? [person(tabs ? "Wechselt zum Tab Informationen" : "Liest in den Informationen weiter")] : []), end];

  if (flow === "unclear") {
    return config.potOverlay ? [search, page("Overlay „Was suchen Sie?“, dahinter das Skeleton"), PICK_APPLY, wait, ...ending] : [search, wait, ...ending];
  }
  if (flow === "info") {
    return [search, wait, inForm ? page("Hinweis, dass es am Ort keine Leistung gibt, dazu die Informationen") : infoOnly, ...ending];
  }
  // Der Ort steht schon im Formular oder spielt keine Rolle: Die erste Antwort ist auch die letzte.
  if (inForm || flow === "clear") return [search, wait, ...ending];
  if (flow === "regional") {
    return config.place === "overlay"
      ? [search, page("Overlay fragt nach dem Ort, dahinter das Skeleton"), enter, wait, ...ending]
      : [search, wait, page(tabs ? "Tab Leistungen fragt nach dem Ort" : "Leistungsbereich fragt nach dem Ort"), enter, wait, ...ending];
  }
  return [search, wait, infoOnly, ...(tabs ? [person("Wechselt zum Tab Leistungen")] : []), enter, wait, ...ending];
}
