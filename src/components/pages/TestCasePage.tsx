import Link from "next/link";
import { useId } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DemoReset } from "@/components/DemoReset";

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
        expect: "Ein einzelnes Thema kann beides sein. Die Suche rät nicht, sondern fragt: „Was suchen Sie?“ Auf der Startseite getippt, öffnet sich die Frage als Overlay über der Seite.",
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
        expect: "Auf der Startseite getippt: Vorschlag „Kindergeld beantragen“, dazu „Suchen nach …“, „… im Chat fragen“ und „… in Informationen und Meldungen suchen“.",
        href: "/",
        action: "Startseite öffnen",
      },
    ],
  },
  {
    title: "Wohnort erst, wenn er gebraucht wird",
    intro: "Das Portal fragt nach dem Wohnort nur auf der Seite einer Leistung der Gemeinde, zum Beispiel beim Personalausweis. Die Eingabe wird sofort geprüft, ohne Datenbank, und gemerkt. Die Inhalte der Seite sind auch ohne Angabe sichtbar.",
    steps: [
      {
        input: "10200 (bei „Wo wohnen Sie?“)",
        expect: "Sofort: „10200 · Seehausen. Gemerkt.“ Rechts steht die zuständige Stelle: Bürgerbüro Seehausen.",
        href: "/leistungen/personalausweis-beantragen",
        action: "Leistungsseite öffnen",
      },
      {
        input: "20100",
        expect: "Beispielstadt: Rechts steht das Bürgeramt Beispielstadt mit Adresse und Öffnungszeiten, dazu ein Link zur Seite des Amts. Kein Wechsel in ein anderes Portal.",
        href: "/leistungen/personalausweis-beantragen",
        action: "Leistungsseite öffnen",
      },
      {
        input: "10480",
        expect: "Zwei Orte teilen sich die Postleitzahl. Sie wählen zwischen Neudorf und Mühlengrund.",
        href: "/leistungen/personalausweis-beantragen",
        action: "Leistungsseite öffnen",
      },
      {
        way: "Leistungsseite „Kindergeld beantragen“",
        expect: "Keine Frage nach dem Wohnort: Für Kindergeld ist das Land zuständig.",
        href: "/leistungen/kindergeld-beantragen",
        action: "Leistungsseite öffnen",
      },
    ],
  },
  {
    title: "Beantragung bis zum Formular",
    intro: "Kindergeld ist eine Leistung des Landes. Deshalb fragt das Portal hier nicht nach dem Wohnort.",
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
      {
        way: "Im Chatfenster der Startseite: „Hund anmelden“, dann „Beispielstadt“",
        expect: "Das Fenster nennt das Steueramt Beispielstadt. Das Gespräch bleibt erhalten, wenn Sie danach im Portal weiterblättern.",
        href: "/",
        action: "Startseite öffnen",
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
            Bereich nach. Ist eine Anfrage unklar, fragt sie nach, statt zu raten.
          </p>
        </div>
      </div>
      <div className="t-container t-page t-testcase">
        <DemoReset explained />
        {PARTS.map((part, index) => (
          <PartSection key={part.title} part={part} index={index} />
        ))}
      </div>
    </>
  );
}
