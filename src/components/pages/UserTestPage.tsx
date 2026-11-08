import Link from "next/link";
import { CHAT_SCENARIO, CORE_SCENARIOS, EXTRA_SCENARIOS } from "@/data/test-scenarios";
import type { FlowStep, Scenario } from "@/data/test-scenarios";

// In front of the prototype, without the portal around it: the overview for the product owners.
// What a moderator needs in a session is on the page of test cases.

const KIND_LABEL: Record<FlowStep["kind"], string> = { person: "Person", wait: "Warten", page: "Seite", end: "Ende" };

function Flow({ label, steps }: { label: string; steps: FlowStep[] }) {
  return (
    <div className="t-flowrow">
      <h4 className="t-scen__label">{label}</h4>
      <ol className="t-flowline">
        {steps.map((step, i) => (
          <li key={i}>
            <span className="t-flowstep" data-kind={step.kind}>
              <span className="visually-hidden">{KIND_LABEL[step.kind]}: </span>
              {step.text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ScenarioSummary({ scenario }: { scenario: Scenario }) {
  return (
    <li className="t-scen">
      <div>
        <p className="t-case__step">
          Szenario {scenario.id} · {scenario.case}
        </p>
        <h3 className="t-h3">{scenario.title}</h3>
        <p className="t-scen__summary">{scenario.summary}</p>
      </div>
      {scenario.v1 && <Flow label="Variante 1, Frage vor den Treffern" steps={scenario.v1} />}
      {scenario.v2 && <Flow label="Variante 2, eine Ergebnisseite" steps={scenario.v2} />}
      {scenario.chat && <Flow label="Chat-Assistent" steps={scenario.chat} />}
    </li>
  );
}

export function UserTestPage() {
  return (
    <main id="inhalt" tabIndex={-1} className="t-main">
      <div className="t-pagehead">
        <div className="t-container">
          <p className="t-case__step">Verwaltungsportal Musterland · Prototyp mit Beispieldaten</p>
          <h1 className="t-h1">Testszenarien</h1>
          <p className="t-lead">
            Mit diesen Szenarien prüfen wir an echten Menschen die Annahme 1 des Product Owners. Sie besagt, dass Leistung und
            Informationen zusammen auf eine Ergebnisseite passen.
          </p>
          <p className="t-actions">
            <Link href="/testszenarien/testfaelle" className="t-btn t-btn--primary">
              Testfälle öffnen
            </Link>
            <Link href="/" className="t-btn">
              Prototyp öffnen
            </Link>
          </p>
        </div>
      </div>

      <div className="t-container t-page t-scens">
        <section aria-labelledby="varianten">
          <h2 id="varianten" className="t-h2">
            Zwei Varianten im Vergleich
          </h2>
          <div className="t-scens__two">
            <div>
              <h3 className="t-h3">Variante 1, Frage vor den Treffern</h3>
              <p>Ist die Suche unklar, fragt die Seite „Was suchen Sie?“. Danach will sie den Wohnort wissen, erst dann kommen die Treffer.</p>
            </div>
            <div>
              <h3 className="t-h3">Variante 2, eine Ergebnisseite</h3>
              <p>Die Treffer kommen ohne Zwischenfrage. Oben steht der Leistungsbereich mit dem Feld für den Ort, darunter die Informationen.</p>
            </div>
          </div>
          <ul className="t-scens__notes">
            <li>Später bewertet eine KI jede Suche. Im Prototyp machen das feste Regeln.</li>
            <li>Die KI braucht dafür 1 bis 3 Sekunden. Der Prototyp spielt diese Zeit mit einer Ladeanimation nach.</li>
            <li>Getestet wird nur die Suche. Jeder Test endet, bevor jemand einen Antrag startet.</li>
          </ul>
        </section>

        <section aria-labelledby="kern">
          <h2 id="kern" className="t-h2">
            Kernszenarien
          </h2>
          <div className="t-flowlegend" aria-hidden="true">
            <span className="t-flowstep" data-kind="person">
              Das macht die Person
            </span>
            <span className="t-flowstep" data-kind="wait">
              Ladeanimation
            </span>
            <span className="t-flowstep" data-kind="page">
              Das zeigt die Seite
            </span>
            <span className="t-flowstep" data-kind="end">
              Ende des Tests
            </span>
          </div>
          <ol className="t-scens__list">
            {CORE_SCENARIOS.map((scenario) => (
              <ScenarioSummary key={scenario.id} scenario={scenario} />
            ))}
          </ol>
        </section>

        <section aria-labelledby="extra">
          <h2 id="extra" className="t-h2">
            Wenn Zeit bleibt
          </h2>
          <ol className="t-scens__list">
            {EXTRA_SCENARIOS.map((scenario) => (
              <ScenarioSummary key={scenario.id} scenario={scenario} />
            ))}
          </ol>
        </section>

        <section aria-labelledby="chat">
          <h2 id="chat" className="t-h2">
            Optional: Chat-Assistent
          </h2>
          <p className="t-case__intro">
            Im Portal ist der Chat aus, damit die Testpersonen die Suche benutzen. Mehr Abläufe stehen im <Link href="/testfall/chat">Testfall Chat-Assistent</Link>.
          </p>
          <ol className="t-scens__list">
            <ScenarioSummary scenario={CHAT_SCENARIO} />
          </ol>
        </section>
      </div>
    </main>
  );
}
