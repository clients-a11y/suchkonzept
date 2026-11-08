import Link from "next/link";
import type { ReactNode } from "react";
import { ScenarioStart } from "@/components/ScenarioStart";
import { CHAT_SCENARIO, CORE_SCENARIOS, EXTRA_SCENARIOS } from "@/data/test-scenarios";
import type { Scenario } from "@/data/test-scenarios";

// What the moderator of a user test needs in a session. The overview for the product owners is /testszenarien.

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="t-scen__block">
      <h4 className="t-scen__label">{title}</h4>
      {children}
    </div>
  );
}

function CaseCard({ scenario }: { scenario: Scenario }) {
  return (
    <li className="t-scen">
      <div className="t-scen__head">
        <div>
          <p className="t-case__step">
            Szenario {scenario.id} · {scenario.case}
          </p>
          <h3 className="t-h3">{scenario.title}</h3>
        </div>
        <div className="t-scen__starts">
          {scenario.v1 && (
            <ScenarioStart title={scenario.title} variant={1}>
              Variante 1 starten
            </ScenarioStart>
          )}
          {scenario.v2 && (
            <ScenarioStart title={scenario.title} variant={2}>
              Variante 2 starten
            </ScenarioStart>
          )}
          {scenario.chat && (
            <ScenarioStart title={scenario.title} href="/assistent">
              Chat starten
            </ScenarioStart>
          )}
        </div>
      </div>
      <p className="t-scen__task">„{scenario.task}“</p>
      <p className="t-scen__meta">
        {scenario.home && <span>Wohnortkarte: {scenario.home}</span>}
        <span>Falls nötig, Suchbegriff nennen: {scenario.term}</span>
      </p>
      <div className="t-scen__grid">
        <Block title="Beobachten">
          <ul>
            {scenario.observe.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Block>
        <Block title="Geschafft, wenn">
          <p>{scenario.success}</p>
        </Block>
        <Block title="Danach fragen">
          <p>{scenario.ask}</p>
        </Block>
      </div>
    </li>
  );
}

export function UserTestCasesPage() {
  return (
    <main id="inhalt" tabIndex={-1} className="t-main">
      <div className="t-pagehead">
        <div className="t-container">
          <p className="t-case__step">Verwaltungsportal Musterland · Prototyp mit Beispieldaten</p>
          <h1 className="t-h1">Testfälle</h1>
          <p className="t-actions">
            <Link href="/testszenarien" className="t-btn">
              Zur Übersicht
            </Link>
          </p>
        </div>
      </div>

      <div className="t-container t-page t-scens">
        <section aria-labelledby="ablauf">
          <h2 id="ablauf" className="t-h2">
            So läuft der Test
          </h2>
          <ol className="t-scens__steps">
            <li>Bitten Sie die Person, laut zu denken. Sie kann nichts falsch machen, wir testen die Seite.</li>
            <li>Starten Sie das Szenario, lesen Sie die Aufgabe vor und geben Sie die Wohnortkarte dazu.</li>
            <li>Helfen Sie nicht, und sagen Sie nie „Leistung“ oder „Bereich“.</li>
            <li>Stoppen Sie, bevor die Person einen Antrag oder Termin startet. Fragen Sie dann „Wie leicht war das, von 1 sehr schwer bis 7 sehr leicht?“.</li>
            <li>Planen Sie 5 bis 8 Personen und je 30 bis 45 Minuten ein. Wechseln Sie Reihenfolge und Startvariante.</li>
          </ol>
        </section>

        <section aria-labelledby="kern">
          <h2 id="kern" className="t-h2">
            Kernszenarien
          </h2>
          <ol className="t-scens__list">
            {CORE_SCENARIOS.map((scenario) => (
              <CaseCard key={scenario.id} scenario={scenario} />
            ))}
          </ol>
        </section>

        <section aria-labelledby="extra">
          <h2 id="extra" className="t-h2">
            Wenn Zeit bleibt
          </h2>
          <ol className="t-scens__list">
            {EXTRA_SCENARIOS.map((scenario) => (
              <CaseCard key={scenario.id} scenario={scenario} />
            ))}
          </ol>
        </section>

        <section aria-labelledby="chat">
          <h2 id="chat" className="t-h2">
            Optional: Chat-Assistent
          </h2>
          <p className="t-case__intro">
            Am Ende einer Sitzung, wenn noch Zeit ist. Mehr im <Link href="/testfall/chat">Testfall Chat-Assistent</Link>.
          </p>
          <ol className="t-scens__list">
            <CaseCard scenario={CHAT_SCENARIO} />
          </ol>
        </section>
      </div>
    </main>
  );
}
