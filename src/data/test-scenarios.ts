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
    task: "Ihr Personalausweis läuft in zwei Monaten ab. Finden Sie heraus, was Sie jetzt tun müssen und wohin Sie gehen.",
    home: SEEHAUSEN,
    term: "Personalausweis",
    expected: "Die Leistung steht oben im Leistungsbereich, die Informationen darunter. Oben im Bereich steht das Feld mit dem Hinweis „PLZ/Ort für regionale Ergebnisse“.",
    observe: ["Schaut die Person zuerst auf die Leistung oder auf die Informationen?", "Trägt sie ihre Postleitzahl von sich aus ein?", "Bemerkt sie, was sich danach ändert?"],
    success: "Die Person nennt das Bürgerbüro Seehausen und weiß, was sie mitbringen muss.",
    ask: ["Wofür ist das Feld mit der Postleitzahl aus Ihrer Sicht da?", "Was würden Sie als Nächstes tun?"],
    today: "Die Frage nach dem Wohnort kommt vor den Treffern.",
  },
  {
    id: 2,
    case: "Fall 1",
    title: "Mehrere passende Leistungen",
    task: "Sie haben gerade ein Kind bekommen. Finden Sie heraus, was Sie jetzt beantragen können.",
    home: SEEHAUSEN,
    term: "Baby",
    expected: "Bis zu drei Leistungen stehen im Leistungsbereich, hier Kindergeld und Kitaplatz. Die Informationen folgen darunter.",
    observe: ["Erkennt die Person, worin sich die Leistungen unterscheiden?", "Liest sie alle oder nimmt sie die erste?", "Vermisst sie etwas?"],
    success: "Die Person nennt Kindergeld und Kitaplatz.",
    ask: ["Womit würden Sie anfangen, und warum?"],
    today: "Die Leistungen stehen in der Trefferliste, nicht in einem eigenen Bereich.",
  },
  {
    id: 3,
    case: "Fall 2",
    title: "Leistung, die vom Ort abhängt",
    task: "Sie haben sich einen Hund angeschafft. Finden Sie heraus, ob Sie ihn anmelden müssen und bei wem.",
    home: SEEHAUSEN,
    term: "Hund anmelden",
    expected: "Noch keine Treffer: Über dem Leistungsbereich liegt ein Overlay mit „Bitte geben Sie Ihre PLZ oder Ihren Ort für regionale Ergebnisse ein“ und einem Eingabefeld. Dahinter schimmert ein Skeleton.",
    observe: ["Hält die Person das Skeleton für einen Ladefehler?", "Gibt sie den Ort ein oder weicht sie auf die Informationen aus?", "Wirkt das Overlay wie eine Hürde?"],
    success: "Die Person gibt ihren Ort ein und nennt die zuständige Stelle und die Frist von einem Monat.",
    ask: ["Was ging Ihnen durch den Kopf, als Sie den abgedeckten Bereich gesehen haben?", "Warum fragt die Seite Ihrer Meinung nach nach dem Ort?"],
    today: "Die Frage nach dem Wohnort kommt vor den Treffern, als eigenes Fenster statt als Overlay im Leistungsbereich.",
  },
  {
    id: 4,
    case: "Fall 2",
    title: "Für diesen Ort gibt es nichts",
    task: "Sie möchten am Wochenende angeln gehen. Finden Sie heraus, was Sie dafür brauchen.",
    home: WALDHEIM,
    term: "Angelschein",
    expected: "Nach der Eingabe des Orts erscheint: „Für diesen Ort gibt es keine regionalen Leistungen, vielleicht helfen Ihnen die Informationen unten weiter“.",
    observe: ["Versteht die Person, dass es an ihrem Ort nichts gibt und die Suche nicht kaputt ist?", "Geht sie zu den Informationen weiter?", "Probiert sie einen anderen Ort oder Begriff?"],
    success: "Die Person sagt, dass es in Waldheim dazu keine Leistung gibt, und schaut in den Informationen weiter.",
    ask: ["Was würden Sie jetzt tun?", "Wie hilfreich war der Hinweis für Sie?"],
    missing: "Im Prototyp hat bisher jeder Ort eine zuständige Stelle.",
  },
  {
    id: 5,
    case: "Fall 3",
    title: "Reine Information",
    task: "Am Marktplatz in Beispielstadt wird gebaut, und Ihr Bus fährt anders als sonst. Finden Sie heraus, bis wann das so bleibt.",
    home: "Sie wohnen in Beispielstadt, Postleitzahl 20100.",
    term: "Baustelle Marktplatz",
    expected: "Der Leistungsbereich schrumpft auf zwei Zeilen: „Gibt es dazu eine Leistung in Ihrer Region? PLZ/Ort eingeben“ mit Eingabefeld. Darunter stehen die Informationen.",
    observe: ["Übersieht die Person den kleinen Bereich, oder lenkt er sie ab?", "Trägt sie trotzdem etwas ein? Was erwartet sie dann?", "Findet sie die Meldung ohne Umweg?"],
    success: "Die Person nennt „bis Dezember“.",
    ask: ["Was, glauben Sie, passiert, wenn Sie in dem kleinen Feld etwas eintragen?"],
    today: "Die Frage nach dem Wohnort kommt auch hier vor den Treffern.",
  },
];

export const EXTRA_SCENARIOS: Scenario[] = [
  {
    id: 6,
    case: "Fall 3, dann Fall 1",
    title: "Von der Information zur Leistung",
    task: "Sie haben gehört, dass Familien in Ihrer Gegend Unterstützung bekommen können. Finden Sie heraus, ob für Sie etwas dabei ist.",
    home: SEEHAUSEN,
    term: "Unterstützung für Familien",
    expected: "Erst Informationen mit dem kleinen Leistungsbereich. Nach der Eingabe des Orts wird daraus der Leistungsbereich aus Fall 1.",
    observe: ["Nutzt die Person den kleinen Bereich von selbst?", "Versteht sie, warum sich die Seite ändert?", "Verliert sie dabei die Orientierung?"],
    success: "Die Person trägt ihren Ort ein und nennt mindestens eine passende Leistung.",
    ask: ["Was hat sich auf der Seite verändert, nachdem Sie den Ort eingegeben haben?"],
    missing: "Der kleine Leistungsbereich ist noch nicht gebaut.",
  },
  {
    id: 7,
    case: "Fall 3, dann Fall 2",
    title: "Von der Information zu keinem Treffer",
    task: "Sie haben gehört, dass es in manchen Orten Zuschüsse für neue Heizungen gibt. Finden Sie heraus, ob das auch bei Ihnen gilt.",
    home: WALDHEIM,
    term: "Zuschuss Heizung",
    expected: "Erst Informationen mit dem kleinen Leistungsbereich. Nach der Eingabe des Orts geht es weiter wie in Fall 2, am Ende steht der Hinweis, dass es für diesen Ort nichts gibt.",
    observe: ["Ist der Person klar, dass die Antwort „bei Ihnen nicht“ lautet?", "Bleibt sie auf der Seite oder bricht sie ab?"],
    success: "Die Person sagt, dass es an ihrem Ort nichts gibt.",
    ask: ["Wie sicher sind Sie, dass es dazu bei Ihnen nichts gibt?"],
    missing: "Der kleine Leistungsbereich und der Hinweis fehlen noch.",
  },
  {
    id: 8,
    case: "Ergänzung, nicht in Annahme 1",
    title: "Leistung, bei der der Wohnort keine Rolle spielt",
    task: "Sie möchten Kindergeld beantragen. Finden Sie heraus, ob das online geht.",
    term: "Kindergeld",
    expected: "Noch offen: Annahme 1 sagt nicht, ob hier das Feld für den Ort erscheint.",
    observe: ["Erwartet die Person eine Frage nach dem Ort?", "Wäre ein Feld für den Ort hier störend?"],
    success: "Die Person sagt, dass der Antrag online geht.",
    ask: ["Hätten Sie erwartet, dass die Seite nach Ihrem Wohnort fragt?"],
    today: "Erst „Was suchen Sie?“, dann ohne Frage nach dem Wohnort zu den Treffern.",
  },
];

export const CHAT_SCENARIO: Scenario = {
  id: 9,
  case: "Optional",
  title: "Unklares Anliegen im Chat",
  task: "Ihr Portemonnaie ist weg, Ihr Personalausweis war darin. Holen Sie sich im Chat Hilfe und finden Sie heraus, was Sie jetzt tun müssen.",
  home: SEEHAUSEN,
  term: "Mein Portemonnaie ist weg",
  expected: "Der Chat fragt zurück, was darin war, und führt zum neuen Ausweis mit der Stelle am Wohnort.",
  observe: ["Antwortet die Person mit den Knöpfen oder frei?", "Wirkt die Rückfrage hilfreich oder umständlich?"],
  success: "Die Person weiß, dass sie den Verlust melden muss, und nennt das Bürgerbüro Seehausen.",
  ask: ["Würden Sie so etwas lieber im Chat oder über die Suche erledigen?"],
  today: "Läuft auf der Chat-Seite. Im Portal ist der Chat ausgeblendet.",
};
