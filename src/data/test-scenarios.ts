// Szenarien für Tests mit echten Nutzerinnen und Nutzern. Getestet wird die eine Ergebnisseite (/ergebnisse),
// und nur die Suche: Jeder Test endet vor dem Antrag.

export type FlowStep = { kind: "person" | "wait" | "page" | "end"; text: string };

export type Scenario = {
  id: number;
  // Der Fall, den die Aufgabe prüft.
  case: string;
  title: string;
  // Für die Übersicht: worum es geht, in ein bis zwei Sätzen.
  summary: string;
  path: FlowStep[];
  // Wird vorgelesen. Nennt bewusst keine Wörter aus der Oberfläche.
  task: string;
  // Fiktiver Wohnort, die Testperson bekommt ihn auf einer Karte.
  home: string;
  // Nur nennen, wenn die Person keinen Begriff findet oder woanders landet.
  term: string;
  observe: string[];
  success: string;
  ask: string;
};

const SEEHAUSEN = "Sie wohnen in Seehausen, Postleitzahl 10200.";
const WALDHEIM = "Sie wohnen in Waldheim, Postleitzahl 10300.";

const person = (text: string): FlowStep => ({ kind: "person", text });
const page = (text: string): FlowStep => ({ kind: "page", text });
const search = (term: string) => person(`Sucht nach „${term}“`);
const enter = (plz: string) => person(`Gibt ${plz} ein`);
const WAIT: FlowStep = { kind: "wait", text: "Ladeanimation, 1 bis 3 Sekunden" };
const OVERLAY = page("Overlay fragt nach dem Ort, dahinter ein Skeleton");
const TWO_LINES = page("Zwei Zeilen zum Ort, darunter die Informationen");
const PICK_APPLY = person("Wählt „Etwas beantragen“");
const STOP: FlowStep = { kind: "end", text: "Test endet vor dem Antrag" };
const ANSWERED: FlowStep = { kind: "end", text: "Test endet, die Frage ist beantwortet" };

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    case: "Fall 1",
    title: "Eine klare Leistung",
    summary: "Die Suche erkennt eine Leistung eindeutig. Wir prüfen, ob die Menschen sie oben sofort sehen und das Feld für den Ort von sich aus nutzen.",
    path: [search("Personalausweis"), WAIT, page("Leistung oben, Informationen darunter"), enter("10200"), WAIT, page("Leistung nennt Bürgerbüro Seehausen"), STOP],
    task: "Ihr Personalausweis läuft in zwei Monaten ab. Was müssen Sie jetzt tun, und wo müssen Sie hin?",
    home: SEEHAUSEN,
    term: "Personalausweis",
    observe: ["Trägt die Person ihre Postleitzahl ein, ohne dass jemand danach fragt?", "Wohin schaut sie zuerst?"],
    success: "Die Person nennt das Bürgerbüro Seehausen und sagt, was sie mitbringen muss.",
    ask: "Wofür ist das Feld mit der Postleitzahl da?",
  },
  {
    id: 2,
    case: "Fall 2",
    title: "Leistung, die vom Ort abhängt",
    summary: "Es ist eine Leistung, aber ohne Ort gibt es kein Ergebnis. Wir prüfen, ob das Overlay mit Skeleton verstanden wird oder abschreckt.",
    path: [search("Hund anmelden"), WAIT, OVERLAY, enter("10200"), WAIT, page("Leistung mit Bürgerbüro Seehausen"), STOP],
    task: "Sie haben sich einen Hund angeschafft. Müssen Sie ihn irgendwo anmelden, und wenn ja, wo?",
    home: SEEHAUSEN,
    term: "Hund anmelden",
    observe: ["Denkt die Person, die Seite lädt noch oder ist kaputt?", "Gibt sie den Ort ein, oder scrollt sie am Overlay vorbei?"],
    success: "Die Person gibt ihren Ort ein und nennt das Bürgerbüro Seehausen und die Frist von einem Monat.",
    ask: "Was haben Sie gedacht, als Sie den abgedeckten Bereich gesehen haben?",
  },
  {
    id: 3,
    case: "Fall 2",
    title: "Für diesen Ort gibt es nichts",
    summary: "Waldheim hat keine Gewässer und bietet deshalb keinen Fischereischein an. Wir prüfen, ob die Menschen das als Antwort verstehen und unten weiterlesen.",
    path: [search("Angelschein"), WAIT, OVERLAY, enter("10300"), WAIT, page("Hinweis, dass es für diesen Ort nichts gibt"), person("Liest in den Informationen weiter"), ANSWERED],
    task: "Sie möchten am Wochenende angeln gehen. Was brauchen Sie dafür?",
    home: WALDHEIM,
    term: "Angelschein",
    observe: ["Hält die Person das für einen Fehler der Suche?", "Liest sie unten weiter?"],
    success: "Die Person sagt, dass es dazu in Waldheim nichts gibt, und liest in den Informationen weiter.",
    ask: "Was hat Ihnen der Hinweis gesagt?",
  },
  {
    id: 4,
    case: "Fall 3",
    title: "Reine Information",
    summary: "Die Suche findet keine klare Leistung, der Leistungsbereich schrumpft auf zwei Zeilen. Wir prüfen, ob er die Menschen stört oder ob sie ihn überhaupt sehen.",
    path: [search("Baustelle Marktplatz"), WAIT, TWO_LINES, person("Liest die Meldung zur Baustelle"), ANSWERED],
    task: "Am Marktplatz in Beispielstadt ist Baustelle, und Ihr Bus fährt anders als sonst. Bis wann bleibt das so?",
    home: "Sie wohnen in Beispielstadt, Postleitzahl 20100.",
    term: "Baustelle Marktplatz",
    observe: ["Bemerkt die Person die zwei Zeilen?", "Trägt sie dort etwas ein, obwohl sie nur lesen will?"],
    success: "Die Person sagt „bis Dezember“.",
    ask: "Was passiert Ihrer Meinung nach, wenn Sie in das kleine Feld etwas eintragen?",
  },
  {
    id: 5,
    case: "Fall 3, dann Fall 1",
    title: "Von der Information zur Leistung",
    summary: "Die Suche ist erst unklar, mit dem Ort taucht eine Leistung auf. Wir prüfen, ob die Menschen verstehen, warum sich die Seite ändert.",
    path: [search("Unterstützung für Familien"), WAIT, TWO_LINES, enter("10200"), WAIT, page("Leistungsbereich mit passender Leistung"), STOP],
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
    path: [search("Kindergeld"), WAIT, page("Overlay „Was suchen Sie?“"), PICK_APPLY, page("Ergebnisseite mit Kindergeld oben, ohne Feld für den Ort"), STOP],
    task: "Ihr Kind ist gerade geboren, und Sie möchten jetzt Geld für Ihr Kind bekommen. Suchen Sie nach dem Wort Kindergeld.",
    home: SEEHAUSEN,
    term: "Kindergeld",
    observe: ["Versteht die Person die Frage, oder stört sie sie?", "Wählt sie ohne Zögern?"],
    success: "Die Person wählt „Etwas beantragen“ und findet Kindergeld oben auf der Ergebnisseite.",
    ask: "Hätten Sie diese Frage gebraucht?",
  },
];

export function findScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => String(s.id) === id);
}

// "Seehausen, 10200" from the sentence on the card with the place.
export function placeOf(scenario: Scenario): string | undefined {
  const match = scenario.home.match(/in (.+), Postleitzahl (\d+)/);
  return match ? `${match[1]}, ${match[2]}` : undefined;
}
