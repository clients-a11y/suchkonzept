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
      <div>
        <p className="t-case__step">
          Szenario {scenario.id} · {scenario.case}
        </p>
        <h3 className="t-h3">{scenario.title}</h3>
      </div>
      <div className="t-scen__task">
        <h4 className="t-scen__label">Aufgabe vorlesen</h4>
        <p>„{scenario.task}“</p>
        {scenario.home && (
          <p className="t-scen__home">
            <strong>Wohnortkarte:</strong> {scenario.home}
          </p>
        )}
      </div>
      <div className="t-scen__grid">
        <Block title={scenario.chat ? "Das soll passieren" : "Das soll in Variante 2 passieren"}>
          <p>{scenario.expected}</p>
        </Block>
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
          <ul>
            {scenario.ask.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Block>
      </div>
      <p className="t-scen__term">
        <strong>Suchbegriff, nur wenn die Person nicht weiterkommt:</strong> {scenario.term}
      </p>
      <div className="t-scen__foot">
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
          <p className="t-lead">Alles für die Moderation einer Sitzung. Worum es in den Szenarien geht, steht in der Übersicht.</p>
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
            <li>Bitten Sie die Testperson, beim Klicken laut zu denken. Sagen Sie ihr, dass sie nichts falsch machen kann, weil wir die Seite testen.</li>
            <li>Starten Sie jedes Szenario über seinen Knopf. Der wählt die Variante und löscht den Wohnort, das Demo-Konto und den Chatverlauf vom letzten Durchgang.</li>
            <li>Lesen Sie die Aufgabe vor und geben Sie der Person die Wohnortkarte. Der Prototyp kennt nur erfundene Orte, mit der eigenen Postleitzahl käme sie nicht weiter.</li>
            <li>Helfen Sie nicht, auch wenn es schwerfällt. Sagen Sie auch nie „Leistung“ oder „Bereich“. Die Wörter stehen auf der Seite und verraten, wonach die Person suchen soll.</li>
            <li>Stoppen Sie die Person, bevor sie „Online beantragen“ anklickt oder einen Termin bucht. Wir testen nur die Suche.</li>
            <li>Nach jeder Aufgabe fragen Sie „Wie leicht oder schwer war das, von 1 sehr schwer bis 7 sehr leicht?“ und dann die Fragen aus dem Szenario.</li>
            <li>Planen Sie 5 bis 8 Personen und je Sitzung 30 bis 45 Minuten ein. Wechseln Sie die Reihenfolge der Szenarien und die Variante, mit der Sie anfangen, denn mit jeder Aufgabe kennt die Person die Seite besser.</li>
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
            Zeigen Sie den Chat am Ende einer Sitzung, wenn noch Zeit ist. Mehr Abläufe stehen im <Link href="/testfall/chat">Testfall Chat-Assistent</Link>.
          </p>
          <ol className="t-scens__list">
            <CaseCard scenario={CHAT_SCENARIO} />
          </ol>
        </section>
      </div>
    </main>
  );
}
