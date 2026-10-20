import Link from "next/link";
import { useId } from "react";

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
        href: `/musterland/suche?q=${q("Kindergeld beantragen")}`,
        action: "Suche öffnen",
      },
      {
        input: "Pressemitteilung Kindergeld",
        expect: "Sucht nur bei den Informationen: Meldungen des Ministeriums und die Infoseite. Ausschlaggebend ist die Art des Inhalts.",
        href: `/musterland/suche?q=${q("Pressemitteilung Kindergeld")}`,
        action: "Suche öffnen",
      },
      {
        input: "Kindergeld",
        expect: "Ein einzelnes Thema kann beides sein. Die Suche rät nicht, sondern fragt: „Was suchen Sie?“",
        href: `/musterland/suche?q=${q("Kindergeld")}`,
        action: "Suche öffnen",
      },
      {
        input: "Neuigkeiten zum Kindergeld",
        expect: "Informationen, wie bei der Pressemitteilung.",
        href: `/musterland/suche?q=${q("Neuigkeiten zum Kindergeld")}`,
        action: "Suche öffnen",
      },
      {
        input: "Ministerium für Gesundheit und Familie",
        expect: "Informationen: das Ministerium mit Aufgaben, Leitung und Kontakt.",
        href: `/musterland/suche?q=${q("Ministerium für Gesundheit und Familie")}`,
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
        href: "/musterland",
        action: "Startseite öffnen",
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
        href: "/musterland/leistungen/kindergeld-beantragen",
        action: "Leistungsseite öffnen",
      },
      {
        way: "Online beantragen",
        expect: "Anmelden mit dem Demo-Konto ohne Passwort, dann das Formular: Kind, Geburtsdatum, Steuer-Identifikationsnummer und IBAN.",
        href: "/musterland/antrag/kindergeld-beantragen",
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
        href: `/musterland/assistent?frage=${q("Kindergeld")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Wir haben ein Baby bekommen",
        expect: "Zwei Leistungen passen. Der Assistent fragt: Kitaplatz oder Kindergeld?",
        href: `/musterland/assistent?frage=${q("Wir haben ein Baby bekommen")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Kindergeld beantragen",
        expect: "Antwortet direkt mit zuständiger Stelle und Online-Antrag, ohne nach der Postleitzahl zu fragen.",
        href: `/musterland/assistent?frage=${q("Kindergeld beantragen")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Pressemitteilung Kindergeld",
        expect: "Zeigt nur Informationen und Meldungen, mit dem Angebot „Stattdessen: Kindergeld beantragen“.",
        href: `/musterland/assistent?frage=${q("Pressemitteilung Kindergeld")}`,
        action: "Im Chat fragen",
      },
      {
        input: "Kindergeld beantragen (im Serviceportal Beispielstadt)",
        expect: "Die Stadt ist nicht zuständig. Der Assistent gibt das Anliegen an das Landesportal Musterland weiter.",
        href: `/beispielstadt/assistent?frage=${q("Kindergeld beantragen")}`,
        action: "Im Chat fragen",
      },
    ],
  },
  {
    title: "Inhalte zum Nachsehen",
    intro: "Diese Inhalte findet die Suche im Bereich Informationen.",
    steps: [
      { way: "Infoseite „Kindergeld: Das Wichtigste für Familien“", expect: "Wer es bekommt, wie hoch es ist und wie der Antrag geht.", href: "/musterland/seite/kindergeld", action: "Infoseite öffnen" },
      { way: "Meldungen", expect: "Zwei Meldungen des Ministeriums zum Kindergeld, eine weitere im Serviceportal Beispielstadt.", href: "/musterland/aktuelles", action: "Aktuelles öffnen" },
      { way: "Ministerium", expect: "Aufgaben, Leitung, Kontakt und die Leistung Kindergeld.", href: "/musterland/organisation/gesundheit", action: "Ministerium öffnen" },
    ],
  },
];

function PartSection({ part, index }: { part: Part; index: number }) {
  const titleId = useId();
  return (
    <section className="pf-section" aria-labelledby={titleId}>
      <h2 id={titleId} className="pf-h2">
        <span className="pf-h2__step">Teil {index + 1}</span>
        {part.title}
      </h2>
      <p className="pf-case__intro">{part.intro}</p>
      <ol className="pf-cases">
        {part.steps.map((step) => (
          <li key={step.href + step.action} className="pf-case">
            <p className="pf-case__input">
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
              <span className="pf-case__label">Erwartet:</span> {step.expect}
            </p>
            <Link href={step.href} className="pf-btn pf-btn--small">
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
    <div className="pf-container pf-page pf-testcase">
      <h1 className="pf-h1 pf-h1--page">Testfall Kindergeld</h1>
      <p className="pf-lead">
        So zeigen Sie, wie das Portal Leistungen und Informationen auseinanderhält: Die Suche schaut immer nur in einem
        Bereich nach. Ist eine Anfrage unklar, fragt sie nach, statt zu raten.
      </p>
      <p className="pf-muted pf-case__note">
        Die Schritte laufen im Landesportal Musterland, einer im Serviceportal Beispielstadt. Inhalte, Stellen und Beträge
        sind fiktiv.
      </p>
      {PARTS.map((part, index) => (
        <PartSection key={part.title} part={part} index={index} />
      ))}
    </div>
  );
}
