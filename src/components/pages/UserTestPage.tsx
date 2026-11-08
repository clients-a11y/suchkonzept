import Link from "next/link";
import { ScenarioStart } from "@/components/ScenarioStart";
import { CHAT_SCENARIO, CORE_SCENARIOS, EXTRA_SCENARIOS } from "@/data/test-scenarios";
import type { Scenario } from "@/data/test-scenarios";

// In front of the prototype, without the portal around it: what the moderator of a user test needs.

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="t-scen__block">
      <h4 className="t-scen__label">{title}</h4>
      {children}
    </div>
  );
}

function ScenarioCard({ scenario, href = "/" }: { scenario: Scenario; href?: string }) {
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
        <Block title="Das soll passieren">
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
      <div className="t-scen__foot" data-ready={Boolean(scenario.today)}>
        <p>
          <strong>{scenario.today ? "Heute im Prototyp:" : "Noch nicht testbar:"}</strong> {scenario.today ?? scenario.missing}
        </p>
        {scenario.today && <ScenarioStart href={href} title={scenario.title} />}
      </div>
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
            Aufgaben für Tests mit echten Nutzerinnen und Nutzern. Sie prüfen Annahme 1 des Product Owners: Leistung und
            Informationen können auf einer einzigen Ergebnisseite stehen.
          </p>
          <p className="t-actions">
            <Link href="/" className="t-btn">
              Prototyp öffnen
            </Link>
          </p>
        </div>
      </div>

      <div className="t-container t-page t-scens">
        <p className="t-scens__status">
          <strong>Stand:</strong> Gebaut ist noch der bisherige Ablauf mit der Frage nach dem Wohnort vor den Treffern. Die
          Ergebnisseite aus Annahme 1 fehlt. Die Szenarien mit „Szenario starten“ laufen deshalb im bisherigen Ablauf.
        </p>

        <section aria-labelledby="ablauf">
          <h2 id="ablauf" className="t-h2">
            So läuft der Test
          </h2>
          <ol className="t-scens__steps">
            <li>Bitten Sie die Testperson, laut zu denken. Getestet wird die Seite, nicht die Person.</li>
            <li>Starten Sie jedes Szenario über seinen Knopf. Er setzt den Prototyp zurück, als wäre es der erste Besuch.</li>
            <li>Lesen Sie die Aufgabe vor und geben Sie die Wohnortkarte dazu. Die Orte sind erfunden, echte Postleitzahlen kennt der Prototyp nicht.</li>
            <li>Helfen Sie nicht, und verwenden Sie keine Wörter von der Seite wie „Leistung“ oder „Bereich“.</li>
            <li>Fragen Sie nach jeder Aufgabe: „Wie leicht oder schwer war das, von 1 sehr schwer bis 7 sehr leicht?“ Danach die Fragen aus dem Szenario.</li>
            <li>Planen Sie 5 bis 8 Testpersonen und 30 bis 45 Minuten je Sitzung ein. Wechseln Sie die Reihenfolge der Szenarien.</li>
          </ol>
        </section>

        <section aria-labelledby="kern">
          <h2 id="kern" className="t-h2">
            Kernszenarien
          </h2>
          <ol className="t-scens__list">
            {CORE_SCENARIOS.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </ol>
        </section>

        <section aria-labelledby="extra">
          <h2 id="extra" className="t-h2">
            Wenn Zeit bleibt
          </h2>
          <ol className="t-scens__list">
            {EXTRA_SCENARIOS.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </ol>
        </section>

        <section aria-labelledby="chat">
          <h2 id="chat" className="t-h2">
            Optional: Chat-Assistent
          </h2>
          <p className="t-case__intro">
            Der Chat ist im Portal ausgeblendet, damit er die Tests der Suche nicht beeinflusst. Zeigen Sie ihn erst am Ende einer
            Sitzung. Weitere Abläufe stehen im <Link href="/testfall/chat">Testfall Chat-Assistent</Link>.
          </p>
          <ol className="t-scens__list">
            <ScenarioCard scenario={CHAT_SCENARIO} href="/assistent" />
          </ol>
        </section>
      </div>
    </main>
  );
}
