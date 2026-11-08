import Link from "next/link";
import { useId } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DemoReset } from "@/components/DemoReset";
import { DiagramLink } from "@/components/DiagramLink";

// Script for demos: shows how the portal tells services from information, with Kindergeld as the
// example. Every step links to the place where it can be tried.

type Step = { input?: string; way?: string; expect: string; href: string; action: string };
type Part = { title: string; intro: string; steps: Step[] };

const q = (text: string) => encodeURIComponent(text);

const PARTS: Part[] = [
  {
    title: "Suche: Leistung oder Information",
    intro: "Die Suche schaut immer nur in einem Bereich nach. Auf jeder Ergebnisseite zeigt „So hat die Suche entschieden“ die Punkte.",
    steps: [
      {
        input: "Kindergeld beantragen",
        expect: "Sucht nur bei den Leistungen und zeigt „Das passt am besten: Kindergeld beantragen“. Ausschlaggebend ist die Handlung „beantragen“.",
        href: `/suche?q=${q("Kindergeld beantragen")}`,
        action: "Suche öffnen",
      },
      {
        input: "Pressemitteilung Kindergeld",
        expect: "Sucht nur bei den Informationen: Meldungen des Ministeriums und die Infoseite. Ausschlaggebend ist die Art des Inhalts.",
        href: `/suche?q=${q("Pressemitteilung Kindergeld")}`,
        action: "Suche öffnen",
      },
      {
        input: "Kindergeld",
        expect: "Ein einzelnes Thema kann beides sein. Die Suche rät nicht, sondern fragt: „Was suchen Sie?“ Auf der Startseite getippt, erscheint die Frage über der Seite.",
        href: `/suche?q=${q("Kindergeld")}`,
        action: "Suche öffnen",
      },
      {
        input: "Wie hoch ist das Kindergeld?",
        expect: "Informationen. Ausschlaggebend ist ein Suchbegriff, den die Redaktion fest den Informationen zugeordnet hat.",
        href: `/suche?q=${q("Wie hoch ist das Kindergeld?")}`,
        action: "Suche öffnen",
      },
      {
        input: "Neuigkeiten zum Kindergeld",
        expect: "Informationen, wie bei der Pressemitteilung.",
        href: `/suche?q=${q("Neuigkeiten zum Kindergeld")}`,
        action: "Suche öffnen",
      },
      {
        input: "Ministerium für Gesundheit und Familie",
        expect: "Informationen: das Ministerium mit Aufgaben, Leitung und Kontakt.",
        href: `/suche?q=${q("Ministerium für Gesundheit und Familie")}`,
        action: "Suche öffnen",
      },
    ],
  },
  {
    title: "Vorschläge beim Tippen",
    intro: "Die Vorschläge kommen nur aus dem Leistungskatalog, einer festen Datei. Beim Tippen entsteht keine Anfrage an die Informationen.",
    steps: [
      {
        input: "Kinderg",
        expect: "Auf der Startseite getippt: Vorschlag „Kindergeld beantragen“, dazu „Suchen nach …“ und „… in Informationen und Meldungen suchen“.",
        href: "/",
        action: "Startseite öffnen",
      },
      {
        input: "Neuigkeiten Kindergeld",
        expect: "Die Weiche rechnet schon beim Tippen mit, ohne Anfrage. Oben steht „Informationen zu ‚Neuigkeiten Kindergeld‘“, die Leistung Kindergeld beantragen erst darunter.",
        href: "/",
        action: "Startseite öffnen",
      },
    ],
  },
  {
    title: "Wohnort: Kindergeld und Gartenlaube im Vergleich",
    intro: "Wer auf „Suchen“ klickt oder einen Vorschlag wählt, gibt vorher Postleitzahl oder Ort an, damit das Portal die zuständige Stelle nennt. Ausnahme: Die Suche führt klar zu einer Leistung, für die überall dieselbe Stelle zuständig ist. Vorher „Demo zurücksetzen“, sonst ist der Ort schon bekannt.",
    steps: [
      {
        input: "Kindergeld, dann „Suchen“",
        expect: "Nur eine Frage: „Was suchen Sie?“. Nach „Etwas beantragen“ geht es ohne Postleitzahl zu den Treffern, denn für Kindergeld ist überall das Ministerium für Gesundheit und Familie zuständig. Auch der Vorschlag „Kindergeld beantragen“ öffnet die Leistungsseite direkt.",
        href: "/",
        action: "Startseite öffnen",
      },
      {
        input: "Gartenlaube, dann „Suchen“",
        expect: "Schritt 1 von 2: „Was suchen Sie?“, nach „Etwas beantragen“ Schritt 2: „Wo wohnen Sie?“. Wer die Baugenehmigung erteilt, hängt vom Ort ab. Mit 20100 nennt die Kurzantwort das Bauordnungsamt Beispielstadt.",
        href: "/",
        action: "Startseite öffnen",
      },
      {
        way: "Bei „Wo wohnen Sie?“: „Meinen Standort verwenden“",
        expect: "Demo: Nach einem Moment „Standort wird ermittelt …“ steht 20100 im Feld, darunter „Beispielstadt, ermittelt über Ihren Standort“. Ein echter Standort wird nicht abgefragt. Im Betrieb würde der Browser vorher um Erlaubnis fragen.",
        href: "/",
        action: "Startseite öffnen",
      },
      {
        input: "Personalausweis, dann den Vorschlag wählen",
        expect: "Nur ein Schritt: „Wo wohnen Sie?“, denn der Vorschlag ist eindeutig. Mit 20100 öffnet sich die Leistungsseite, rechts steht das Bürgeramt Beispielstadt mit Adresse und Öffnungszeiten.",
        href: "/",
        action: "Startseite öffnen",
      },
      {
        input: "10480 (bei „Wo wohnen Sie?“)",
        expect: "Zwei Orte teilen sich die Postleitzahl. Ein Klick auf Neudorf oder Mühlengrund schließt den Schritt ab.",
        href: "/",
        action: "Startseite öffnen",
      },
      {
        way: "Noch einmal suchen, zum Beispiel „Hund anmelden“",
        expect: "Der Ort ist gemerkt: „Ihr Wohnort: Beispielstadt“ mit „Weiter mit Beispielstadt“. Wer umgezogen ist, wählt „Anderen Ort angeben“.",
        href: "/",
        action: "Startseite öffnen",
      },
    ],
  },
  {
    title: "Beantragung bis zum Formular",
    intro: "Kindergeld ist eine Leistung des Landes. Zuständig ist deshalb überall dasselbe Ministerium, egal welcher Ort gemerkt ist.",
    steps: [
      {
        way: "Leistungsseite",
        expect: "Das Wichtigste, Unterlagen und die zuständige Stelle: Ministerium für Gesundheit und Familie.",
        href: "/leistungen/kindergeld-beantragen",
        action: "Leistungsseite öffnen",
      },
      {
        way: "Online beantragen",
        expect: "Anmelden mit dem Demo-Konto ohne Passwort, dann das Formular: Kind, Geburtsdatum, Steuer-Identifikationsnummer und IBAN.",
        href: "/antrag/kindergeld-beantragen",
        action: "Antrag öffnen",
      },
      {
        way: "Formular mit einer falschen IBAN absenden",
        expect: "Die Fehlerübersicht nennt das Problem: „Die Prüfziffern der IBAN passen nicht.“ Zum Testen passt die erfundene IBAN DE36 0000 0000 0000 0000 00.",
        href: "/antrag/kindergeld-beantragen",
        action: "Antrag öffnen",
      },
    ],
  },
  {
    title: "Inhalte zum Nachsehen",
    intro: "Diese Inhalte findet die Suche im Bereich Informationen.",
    steps: [
      { way: "Infoseite „Kindergeld: Das Wichtigste für Familien“", expect: "Wer es bekommt, wie hoch es ist und wie der Antrag geht.", href: "/seite/kindergeld", action: "Infoseite öffnen" },
      { way: "Meldungen", expect: "Zwei Meldungen des Ministeriums zum Kindergeld und eine des Jugendamts Beispielstadt.", href: "/aktuelles", action: "Aktuelles öffnen" },
      { way: "Ministerium", expect: "Aufgaben, Leitung, Kontakt und die Leistung Kindergeld.", href: "/organisation/gesundheit", action: "Ministerium öffnen" },
    ],
  },
];

// Shown only on request: the chat is not part of the portal during the user tests.
const CHAT_PARTS: Part[] = [
  {
    title: "Chat-Assistent",
    intro: "Der Assistent nutzt dieselbe Weiche wie die Suche. Ist sie unsicher, fragt er nach.",
    steps: [
      {
        input: "Kindergeld",
        expect: "Fragt nach: „Möchten Sie etwas erledigen oder sich informieren?“, mit den Antworten „Kindergeld beantragen“ und „Informationen zu ‚Kindergeld‘“.",
        href: `/assistent?frage=${q("Kindergeld")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Wir haben ein Baby bekommen",
        expect: "Zwei Leistungen passen. Der Assistent fragt: Kitaplatz oder Kindergeld?",
        href: `/assistent?frage=${q("Wir haben ein Baby bekommen")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Kindergeld beantragen",
        expect: "Antwortet direkt mit zuständiger Stelle und Online-Antrag, ohne nach der Postleitzahl zu fragen.",
        href: `/assistent?frage=${q("Kindergeld beantragen")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Pressemitteilung Kindergeld",
        expect: "Zeigt nur Informationen und Meldungen, mit dem Angebot „Stattdessen: Kindergeld beantragen“.",
        href: `/assistent?frage=${q("Pressemitteilung Kindergeld")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Mein Ausweis läuft ab, dann „20100“",
        expect: "Der Assistent fragt nach der Postleitzahl und nennt dann direkt das Bürgeramt Beispielstadt. Der Ort wird gemerkt, auch für die Leistungsseiten.",
        href: `/assistent?frage=${q("Mein Ausweis läuft ab")}`,
        action: "Im Chat fragen",
      },
    ],
  },
  {
    title: "Chat: unklare Anliegen aus dem Alltag",
    intro: "Wer nur seine Lage schildert, bekommt eine gezielte Rückfrage mit Antwortknöpfen statt einer Trefferliste. Frei antworten geht auch. Führen zwei Rückfragen zu keiner Leistung, nennt der Assistent den Bürgerservice.",
    steps: [
      {
        input: "Bei uns gibt es bald Zuwachs",
        expect: "„Wer kommt dazu?“ mit „Ein Kind“, „Ein Hund“ und „Ein anderes Haustier“. Ein Kind: Kindergeld ohne Postleitzahl, dazu „Auch: Kitaplatz beantragen“. Ein Hund, oder getippt „einen Welpen“: Hund anmelden mit Frage nach der Postleitzahl.",
        href: `/assistent?frage=${q("Bei uns gibt es bald Zuwachs")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Mein Portemonnaie ist weg, da war alles drin",
        expect: "„Was war darin?“ Bank- oder Kreditkarten: Die sperrt die Bank, das Portal kann nicht helfen, dann „War noch etwas darin?“. Der Personalausweis: zuerst den Verlust melden, dann der neue Ausweis beim Bürgeramt am Wohnort.",
        href: `/assistent?frage=${q("Mein Portemonnaie ist weg, da war alles drin")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Ich komme mit dem Geld nicht mehr aus",
        expect: "„Wofür reicht das Geld vor allem nicht?“ Für die Miete: Wohngeld, mit Frage nach der Postleitzahl. Für die Kinder: Kindergeld, ohne.",
        href: `/assistent?frage=${q("Ich komme mit dem Geld nicht mehr aus")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Ich habe einen Brief vom Amt bekommen und verstehe ihn nicht",
        expect: "„Steht im Brief eine Vorgangsnummer?“ Ja: Nummer schreiben, zum Beispiel die aus dem Kindergeld-Antrag im Testfall Kindergeld. Nach der Anmeldung mit dem Demo-Konto nennt der Assistent den Stand. Nein: Hinweis auf den Briefkopf und der Bürgerservice.",
        href: `/assistent?frage=${q("Ich habe einen Brief vom Amt bekommen und verstehe ihn nicht")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Ich komme mit dem Geld nicht mehr aus, dann „Etwas anderes“ und „Es geht um meine Rente“",
        expect: "Zur Rente gibt es keine Leistung im Katalog. Nach zwei Rückfragen rät der Assistent nicht weiter, sondern nennt den Bürgerservice.",
        href: `/assistent?frage=${q("Ich komme mit dem Geld nicht mehr aus")}`,
        action: "Im Chat fragen",
      },
    ],
  },
];

function PartSection({ part, index }: { part: Part; index: number }) {
  const titleId = useId();
  return (
    <section className="t-section t-case" aria-labelledby={titleId}>
      <h2 id={titleId} className="t-h2">
        <span className="t-case__step">Teil {index + 1}</span>
        {part.title}
      </h2>
      <p className="t-case__intro">{part.intro}</p>
      <ol className="t-cases">
        {part.steps.map((step) => (
          <li key={step.href + step.action + (step.input ?? step.way)} className="t-case__item">
            <p className="t-case__input">
              {step.input ? (
                <>
                  Eingabe: <strong>„{step.input}“</strong>
                </>
              ) : (
                <>
                  Weg: <strong>{step.way}</strong>
                </>
              )}
            </p>
            <p>
              <span className="t-case__label">Erwartet:</span> {step.expect}
            </p>
            <Link href={step.href} className="t-btn t-btn--small">
              {step.action}
              <span className="visually-hidden">: {step.input ? `„${step.input}“` : step.way}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function TestCasePage() {
  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb items={[{ label: "Testfall Kindergeld", href: "/testfall" }]} />
          <h1 className="t-h1">Testfall Kindergeld</h1>
          <p className="t-lead">
            So zeigen Sie, wie das Portal Leistungen und Informationen auseinanderhält: Die Suche schaut immer nur in einem
            Bereich nach. Ist eine Anfrage unklar, fragt sie nach, statt zu raten. Vor jeder Suche fragt das Portal nach dem
            Wohnort, damit es die zuständige Stelle nennen kann.
          </p>
        </div>
      </div>
      <div className="t-container t-page t-testcase">
        <DiagramLink />
        <DemoReset explained />
        {PARTS.map((part, index) => (
          <PartSection key={part.title} part={part} index={index} />
        ))}
      </div>
    </>
  );
}

export function ChatTestCasePage() {
  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb items={[{ label: "Testfall Chat-Assistent", href: "/testfall/chat" }]} />
          <h1 className="t-h1">Testfall Chat-Assistent</h1>
          <p className="t-lead">
            Optional: Im Portal ist der Chat für die Tests ausgeblendet. Hier zeigen Sie ihn gezielt, wenn in der Sitzung Zeit bleibt.
          </p>
        </div>
      </div>
      <div className="t-container t-page t-testcase">
        <DemoReset explained />
        {CHAT_PARTS.map((part, index) => (
          <PartSection key={part.title} part={part} index={index} />
        ))}
      </div>
    </>
  );
}
