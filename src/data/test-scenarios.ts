// Aufgaben für Tests mit echten Nutzerinnen und Nutzern. Grundlage ist Annahme 1 des Product Owners:
// Leistung und Informationen stehen auf einer einzigen Ergebnisseite.

export type Scenario = {
  id: number;
  // Der Fall aus Annahme 1, den die Aufgabe prüft.
  case: string;
  title: string;
  // Wird vorgelesen. Nennt bewusst keine Wörter aus der Oberfläche.
  task: string;
  // Fiktiver Wohnort, die Testperson bekommt ihn auf einer Karte.
  home?: string;
  // Nur nennen, wenn die Person keinen Begriff findet oder woanders landet.
  term: string;
  expected: string;
  observe: string[];
  success: string;
  ask: string[];
  // Was der Prototyp heute macht; ohne Angabe lässt sich die Aufgabe noch nicht testen.
  today?: string;
  missing?: string;
};

const SEEHAUSEN = "Sie wohnen in Seehausen, Postleitzahl 10200.";
const WALDHEIM = "Sie wohnen in Waldheim, Postleitzahl 10300.";

export const CORE_SCENARIOS: Scenario[] = [
  {
    id: 1,
    case: "Fall 1",
    title: "Eine klare Leistung",
    task: "Ihr Personalausweis läuft in zwei Monaten ab. Was müssen Sie jetzt tun, und wo müssen Sie hin?",
    home: SEEHAUSEN,
    term: "Personalausweis",
    expected: "Die Leistung steht oben, die Informationen darunter. Das Feld mit dem Hinweis „PLZ/Ort für regionale Ergebnisse“ sitzt im oberen Teil des Leistungsbereichs.",
    observe: ["Wohin schaut die Person zuerst?", "Trägt sie ihre Postleitzahl ein, ohne dass jemand danach fragt?", "Merkt sie, dass danach die zuständige Stelle dasteht?"],
    success: "Die Person nennt das Bürgerbüro Seehausen und sagt, was sie mitbringen muss.",
    ask: ["Wofür ist das Feld mit der Postleitzahl da?", "Was machen Sie als Nächstes?"],
    today: "Die Seite fragt vor den Treffern nach dem Wohnort.",
  },
  {
    id: 2,
    case: "Fall 1",
    title: "Mehrere passende Leistungen",
    task: "Sie haben gerade ein Kind bekommen. Was können Sie jetzt beantragen?",
    home: SEEHAUSEN,
    term: "Baby",
    expected: "Im Leistungsbereich stehen bis zu drei Leistungen, hier Kindergeld und Kitaplatz. Die Informationen kommen darunter.",
    observe: ["Liest die Person beide Leistungen, oder klickt sie die erste an?", "Kann sie sagen, worin sich die beiden unterscheiden?"],
    success: "Die Person nennt Kindergeld und Kitaplatz.",
    ask: ["Womit würden Sie anfangen, und warum?", "Hat Ihnen etwas gefehlt?"],
    today: "Die Leistungen stehen in der normalen Trefferliste.",
  },
  {
    id: 3,
    case: "Fall 2",
    title: "Leistung, die vom Ort abhängt",
    task: "Sie haben sich einen Hund angeschafft. Müssen Sie ihn irgendwo anmelden, und wenn ja, wo?",
    home: SEEHAUSEN,
    term: "Hund anmelden",
    expected: "Ohne Ort gibt es noch keine Treffer. Über dem Leistungsbereich liegt ein Overlay mit dem Text „Bitte geben Sie Ihre PLZ oder Ihren Ort für regionale Ergebnisse ein“ und einem Eingabefeld. Dahinter schimmert ein Skeleton.",
    observe: ["Denkt die Person, die Seite lädt noch oder ist kaputt?", "Gibt sie den Ort ein, oder scrollt sie am Overlay vorbei zu den Informationen?", "Versucht sie, das Overlay wegzuklicken?"],
    success: "Die Person gibt ihren Ort ein und nennt das Bürgerbüro Seehausen und die Frist von einem Monat.",
    ask: ["Was haben Sie gedacht, als Sie den abgedeckten Bereich gesehen haben?", "Warum will die Seite Ihren Ort wissen?"],
    today: "Die Seite fragt vor den Treffern in einem eigenen Fenster nach dem Wohnort.",
  },
  {
    id: 4,
    case: "Fall 2",
    title: "Für diesen Ort gibt es nichts",
    task: "Sie möchten am Wochenende angeln gehen. Was brauchen Sie dafür?",
    home: WALDHEIM,
    term: "Angelschein",
    expected: "Gibt die Person ihren Ort ein, erscheint der Hinweis „Für diesen Ort gibt es keine regionalen Leistungen, vielleicht helfen Ihnen die Informationen unten weiter“.",
    observe: ["Hält die Person das für einen Fehler der Suche, oder versteht sie, dass es an ihrem Ort nichts gibt?", "Liest sie unten weiter, oder probiert sie einen anderen Ort oder Begriff?"],
    success: "Die Person sagt, dass es dazu in Waldheim nichts gibt, und liest in den Informationen weiter.",
    ask: ["Was machen Sie jetzt?", "Was hat Ihnen der Hinweis gesagt?"],
    missing: "Im Prototyp hat bisher jeder Ort eine zuständige Stelle.",
  },
  {
    id: 5,
    case: "Fall 3",
    title: "Reine Information",
    task: "Am Marktplatz in Beispielstadt ist Baustelle, und Ihr Bus fährt anders als sonst. Bis wann bleibt das so?",
    home: "Sie wohnen in Beispielstadt, Postleitzahl 20100.",
    term: "Baustelle Marktplatz",
    expected: "Der Leistungsbereich schrumpft auf zwei Zeilen mit dem Text „Gibt es dazu eine Leistung in Ihrer Region? PLZ/Ort eingeben“ und einem Eingabefeld. Darunter stehen die Informationen.",
    observe: ["Bemerkt die Person die zwei Zeilen überhaupt?", "Trägt sie dort etwas ein, obwohl sie nur etwas lesen will?", "Findet sie die Meldung, ohne zurückzugehen?"],
    success: "Die Person sagt „bis Dezember“.",
    ask: ["Was passiert Ihrer Meinung nach, wenn Sie in das kleine Feld etwas eintragen?"],
    today: "Die Seite fragt auch hier vor den Treffern nach dem Wohnort.",
  },
];

export const EXTRA_SCENARIOS: Scenario[] = [
  {
    id: 6,
    case: "Fall 3, dann Fall 1",
    title: "Von der Information zur Leistung",
    task: "Jemand hat Ihnen erzählt, dass Familien in Ihrer Gegend Unterstützung bekommen können. Ist für Sie etwas dabei?",
    home: SEEHAUSEN,
    term: "Unterstützung für Familien",
    expected: "Erst erscheinen die Informationen mit den zwei Zeilen darüber. Gibt die Person ihren Ort ein, wächst daraus der Leistungsbereich aus Fall 1.",
    observe: ["Trägt die Person ihren Ort ein, ohne dass jemand es ihr sagt?", "Findet sie sich zurecht, wenn die Seite sich danach umbaut?"],
    success: "Die Person trägt ihren Ort ein und nennt mindestens eine passende Leistung.",
    ask: ["Was hat sich auf der Seite verändert, nachdem Sie den Ort eingegeben haben?"],
    missing: "Den kleinen Leistungsbereich gibt es noch nicht.",
  },
  {
    id: 7,
    case: "Fall 3, dann Fall 2",
    title: "Von der Information zu keinem Treffer",
    task: "Sie haben gehört, dass manche Orte Zuschüsse für neue Heizungen zahlen. Gilt das auch bei Ihnen?",
    home: WALDHEIM,
    term: "Zuschuss Heizung",
    expected: "Erst erscheinen die Informationen mit den zwei Zeilen darüber. Nach der Eingabe des Orts geht es weiter wie in Fall 2, und am Ende steht der Hinweis, dass es für diesen Ort nichts gibt.",
    observe: ["Versteht die Person, dass die Antwort „bei Ihnen nicht“ lautet?", "Sucht sie weiter, oder gibt sie auf?"],
    success: "Die Person sagt, dass es an ihrem Ort nichts gibt.",
    ask: ["Wie sicher sind Sie, dass es dazu bei Ihnen nichts gibt?"],
    missing: "Der kleine Leistungsbereich und der Hinweis fehlen noch.",
  },
  {
    id: 8,
    case: "Ergänzung, nicht in Annahme 1",
    title: "Leistung, bei der der Wohnort keine Rolle spielt",
    task: "Sie möchten Kindergeld beantragen. Geht das online?",
    term: "Kindergeld",
    expected: "Annahme 1 sagt nicht, ob hier das Feld für den Ort erscheint. Das muss der Product Owner noch klären.",
    observe: ["Wundert sich die Person, dass niemand nach dem Ort fragt?", "Sucht sie nach einer Stelle in ihrer Nähe?"],
    success: "Die Person sagt, dass der Antrag online geht.",
    ask: ["Hätten Sie erwartet, dass die Seite nach Ihrem Wohnort fragt?"],
    today: "Die Seite fragt „Was suchen Sie?“ und zeigt dann die Treffer, ohne den Wohnort wissen zu wollen.",
  },
];

export const CHAT_SCENARIO: Scenario = {
  id: 9,
  case: "Optional",
  title: "Unklares Anliegen im Chat",
  task: "Ihr Portemonnaie ist weg, und Ihr Personalausweis war darin. Fragen Sie den Chat, was Sie jetzt tun müssen.",
  home: SEEHAUSEN,
  term: "Mein Portemonnaie ist weg",
  expected: "Der Chat fragt zurück, was darin war. Danach sagt er, dass die Person den Verlust melden soll, und nennt die Stelle am Wohnort.",
  observe: ["Klickt die Person die Knöpfe an, oder tippt sie?", "Beantwortet sie die Rückfrage, oder schreibt sie etwas anderes?"],
  success: "Die Person sagt, dass sie den Verlust melden muss, und nennt das Bürgerbüro Seehausen.",
  ask: ["Würden Sie so etwas lieber im Chat oder über die Suche erledigen?"],
  today: "Der Chat läuft auf seiner eigenen Seite, im Portal ist er aus.",
};
