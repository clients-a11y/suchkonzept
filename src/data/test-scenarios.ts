// Szenarien für Tests mit echten Nutzerinnen und Nutzern. Grundlage ist Annahme 1 des Product Owners:
// Leistung und Informationen stehen auf einer einzigen Ergebnisseite. Getestet wird nur die Suche, jeder Test
// endet vor dem Antrag.

export type FlowStep = { kind: "person" | "wait" | "page" | "end"; text: string };

export type Scenario = {
  id: number;
  // Der Fall aus Annahme 1, den die Aufgabe prüft.
  case: string;
  title: string;
  // Für die Übersicht: worum es geht, in ein bis zwei Sätzen.
  summary: string;
  v1?: FlowStep[];
  v2?: FlowStep[];
  chat?: FlowStep[];
  // Wird vorgelesen. Nennt bewusst keine Wörter aus der Oberfläche.
  task: string;
  // Fiktiver Wohnort, die Testperson bekommt ihn auf einer Karte.
  home?: string;
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
const ASK_PLACE = page("Frage „Wo wohnen Sie?“");
const ASK_POT = page("Frage „Was suchen Sie?“");
const PICK_APPLY = person("Wählt „Etwas beantragen“");
const OVERLAY = page("Overlay fragt nach dem Ort, dahinter ein Skeleton");
const TWO_LINES = page("Zwei Zeilen zum Ort, darunter die Informationen");
const NOTHING = page("Hinweis, dass es für diesen Ort nichts gibt");
const STOP: FlowStep = { kind: "end", text: "Test endet vor dem Antrag" };
const ANSWERED: FlowStep = { kind: "end", text: "Test endet, die Frage ist beantwortet" };

export const CORE_SCENARIOS: Scenario[] = [
  {
    id: 1,
    case: "Fall 1",
    title: "Eine klare Leistung",
    summary: "Die Suche erkennt eine Leistung eindeutig. Wir prüfen, ob die Menschen sie oben sofort sehen und das Feld für den Ort von sich aus nutzen.",
    v1: [search("Personalausweis"), WAIT, ASK_PLACE, enter("10200"), page("Treffer mit Bürgerbüro Seehausen"), STOP],
    v2: [search("Personalausweis"), WAIT, page("Leistung oben, Informationen darunter"), enter("10200"), WAIT, page("Leistung nennt Bürgerbüro Seehausen"), STOP],
    task: "Ihr Personalausweis läuft in zwei Monaten ab. Was müssen Sie jetzt tun, und wo müssen Sie hin?",
    home: SEEHAUSEN,
    term: "Personalausweis",
    observe: ["Trägt die Person ihre Postleitzahl ein, ohne dass jemand danach fragt?", "Wohin schaut sie zuerst?"],
    success: "Die Person nennt das Bürgerbüro Seehausen und sagt, was sie mitbringen muss.",
    ask: "Wofür ist das Feld mit der Postleitzahl da?",
  },
  {
    id: 2,
    case: "Fall 1",
    title: "Mehrere passende Leistungen",
    summary: "Zu einer Suche passen mehrere Leistungen, die Seite zeigt bis zu drei. Wir prüfen, ob die Menschen sie auseinanderhalten.",
    v1: [search("Baby"), WAIT, ASK_POT, PICK_APPLY, ASK_PLACE, enter("10200"), page("Trefferliste mit Kindergeld und Kitaplatz"), STOP],
    v2: [search("Baby"), WAIT, page("Kindergeld und Kitaplatz oben, Informationen darunter"), person("Vergleicht die Leistungen"), STOP],
    task: "Sie haben gerade ein Kind bekommen. Was können Sie jetzt beantragen?",
    home: SEEHAUSEN,
    term: "Baby",
    observe: ["Liest die Person beide Leistungen, oder klickt sie die erste an?", "Kann sie sagen, worin sich die beiden unterscheiden?"],
    success: "Die Person nennt Kindergeld und Kitaplatz.",
    ask: "Womit würden Sie anfangen, und warum?",
  },
  {
    id: 3,
    case: "Fall 2",
    title: "Leistung, die vom Ort abhängt",
    summary: "Es ist eine Leistung, aber ohne Ort gibt es kein Ergebnis. Wir prüfen, ob das Overlay mit Skeleton verstanden wird oder abschreckt.",
    v1: [search("Hund anmelden"), WAIT, ASK_PLACE, enter("10200"), page("Treffer mit Bürgerbüro Seehausen"), STOP],
    v2: [search("Hund anmelden"), WAIT, OVERLAY, enter("10200"), WAIT, page("Leistung mit Bürgerbüro Seehausen"), STOP],
    task: "Sie haben sich einen Hund angeschafft. Müssen Sie ihn irgendwo anmelden, und wenn ja, wo?",
    home: SEEHAUSEN,
    term: "Hund anmelden",
    observe: ["Denkt die Person, die Seite lädt noch oder ist kaputt?", "Gibt sie den Ort ein, oder scrollt sie am Overlay vorbei?"],
    success: "Die Person gibt ihren Ort ein und nennt das Bürgerbüro Seehausen und die Frist von einem Monat.",
    ask: "Was haben Sie gedacht, als Sie den abgedeckten Bereich gesehen haben?",
  },
  {
    id: 4,
    case: "Fall 2",
    title: "Für diesen Ort gibt es nichts",
    summary: "Waldheim hat keine Gewässer und bietet deshalb keinen Fischereischein an. Wir prüfen, ob die Menschen das als Antwort verstehen und unten weiterlesen.",
    v1: [search("Angelschein"), WAIT, ASK_PLACE, enter("10300"), page("Treffer mit dem Satz, dass es das in Waldheim nicht gibt"), ANSWERED],
    v2: [search("Angelschein"), WAIT, OVERLAY, enter("10300"), WAIT, NOTHING, person("Liest in den Informationen weiter"), ANSWERED],
    task: "Sie möchten am Wochenende angeln gehen. Was brauchen Sie dafür?",
    home: WALDHEIM,
    term: "Angelschein",
    observe: ["Hält die Person das für einen Fehler der Suche?", "Liest sie unten weiter?"],
    success: "Die Person sagt, dass es dazu in Waldheim nichts gibt, und liest in den Informationen weiter.",
    ask: "Was hat Ihnen der Hinweis gesagt?",
  },
  {
    id: 5,
    case: "Fall 3",
    title: "Reine Information",
    summary: "Die Suche findet keine klare Leistung, der Leistungsbereich schrumpft auf zwei Zeilen. Wir prüfen, ob er die Menschen stört oder ob sie ihn überhaupt sehen.",
    v1: [search("Baustelle Marktplatz"), WAIT, ASK_PLACE, enter("20100"), page("Informationen mit der Meldung zur Baustelle"), ANSWERED],
    v2: [search("Baustelle Marktplatz"), WAIT, TWO_LINES, person("Liest die Meldung zur Baustelle"), ANSWERED],
    task: "Am Marktplatz in Beispielstadt ist Baustelle, und Ihr Bus fährt anders als sonst. Bis wann bleibt das so?",
    home: "Sie wohnen in Beispielstadt, Postleitzahl 20100.",
    term: "Baustelle Marktplatz",
    observe: ["Bemerkt die Person die zwei Zeilen?", "Trägt sie dort etwas ein, obwohl sie nur lesen will?"],
    success: "Die Person sagt „bis Dezember“.",
    ask: "Was passiert Ihrer Meinung nach, wenn Sie in das kleine Feld etwas eintragen?",
  },
];

export const EXTRA_SCENARIOS: Scenario[] = [
  {
    id: 6,
    case: "Fall 3, dann Fall 1",
    title: "Von der Information zur Leistung",
    summary: "Die Suche ist erst unklar, mit dem Ort taucht eine Leistung auf. Wir prüfen, ob die Menschen verstehen, warum sich die Seite ändert.",
    v2: [search("Unterstützung für Familien"), WAIT, TWO_LINES, enter("10200"), WAIT, page("Leistungsbereich mit passender Leistung"), STOP],
    task: "Jemand hat Ihnen erzählt, dass Familien in Ihrer Gegend Unterstützung bekommen können. Ist für Sie etwas dabei?",
    home: SEEHAUSEN,
    term: "Unterstützung für Familien",
    observe: ["Trägt die Person ihren Ort von selbst ein?", "Findet sie sich zurecht, wenn die Seite sich umbaut?"],
    success: "Die Person trägt ihren Ort ein und nennt mindestens eine passende Leistung.",
    ask: "Was hat sich auf der Seite verändert, nachdem Sie den Ort eingegeben haben?",
  },
  {
    id: 7,
    case: "Fall 3, dann Fall 2",
    title: "Von der Information zu keinem Treffer",
    summary: "Die Suche ist erst unklar, und auch mit dem Ort gibt es keine Leistung. Wir prüfen, ob „bei Ihnen nicht“ als Antwort ankommt.",
    v2: [search("Zuschuss Heizung"), WAIT, TWO_LINES, enter("10300"), WAIT, NOTHING, ANSWERED],
    task: "Sie haben gehört, dass manche Orte Zuschüsse für neue Heizungen zahlen. Gilt das auch bei Ihnen?",
    home: WALDHEIM,
    term: "Zuschuss Heizung",
    observe: ["Versteht die Person, dass die Antwort „bei Ihnen nicht“ lautet?", "Sucht sie weiter, oder gibt sie auf?"],
    success: "Die Person sagt, dass es an ihrem Ort nichts gibt.",
    ask: "Wie sicher sind Sie, dass es dazu bei Ihnen nichts gibt?",
  },
  {
    id: 8,
    case: "Ergänzung, nicht in Annahme 1",
    title: "Leistung, bei der der Wohnort keine Rolle spielt",
    summary: "Kindergeld hat überall dieselbe Stelle, Annahme 1 regelt das nicht. Wir prüfen, ob das Feld für den Ort hier stört.",
    v1: [search("Kindergeld"), WAIT, ASK_POT, PICK_APPLY, page("Treffer ohne Frage nach dem Ort"), STOP],
    v2: [search("Kindergeld"), WAIT, page("Leistung oben, Feld für den Ort bleibt leer"), STOP],
    task: "Sie möchten Kindergeld beantragen. Geht das online?",
    term: "Kindergeld",
    observe: ["Trägt die Person trotzdem ihren Ort ein?", "Sucht sie nach einer Stelle in ihrer Nähe?"],
    success: "Die Person sagt, dass der Antrag online geht.",
    ask: "Hätten Sie erwartet, dass die Seite nach Ihrem Wohnort fragt?",
  },
];

export const CHAT_SCENARIO: Scenario = {
  id: 9,
  case: "Optional",
  title: "Unklares Anliegen im Chat",
  summary: "Jemand schildert nur die eigene Lage. Wir prüfen, ob die Rückfrage des Chats weiterhilft.",
  chat: [person("Schreibt „Mein Portemonnaie ist weg“"), page("Chat fragt, was darin war"), person("Wählt „Der Personalausweis“"), page("Chat fragt nach der Postleitzahl"), enter("10200"), page("Chat nennt Bürgerbüro Seehausen"), STOP],
  task: "Ihr Portemonnaie ist weg, und Ihr Personalausweis war darin. Fragen Sie den Chat, was Sie jetzt tun müssen.",
  home: SEEHAUSEN,
  term: "Mein Portemonnaie ist weg",
  observe: ["Klickt die Person die Knöpfe an, oder tippt sie?", "Beantwortet sie die Rückfrage?"],
  success: "Die Person sagt, dass sie den Verlust melden muss, und nennt das Bürgerbüro Seehausen.",
  ask: "Würden Sie so etwas lieber im Chat oder über die Suche erledigen?",
};
