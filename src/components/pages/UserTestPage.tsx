import Link from "next/link";
import { IconArrow } from "@/components/Icons";
import { ScenarioStart } from "@/components/ScenarioStart";
import { SCENARIOS, placeOf } from "@/data/test-scenarios";
import type { Scenario } from "@/data/test-scenarios";

// In front of the prototype, without the portal around it: all scenarios at a glance, one page per scenario.

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <li className="t-scard">
      <div className="t-scard__top">
        <span className="t-scard__badge">{scenario.id}</span>
        <span className="t-scard__meta">{scenario.case}</span>
      </div>
      <h3 className="t-scard__title">
        <Link href={`/testszenarien/${scenario.id}`} className="t-cardlink">
          {scenario.title}
        </Link>
      </h3>
      <p>{scenario.summary}</p>
      <div className="t-scard__foot">
        <p className="t-scard__entry">
          Suchbegriff: {scenario.term} · Wohnort: {placeOf(scenario)}
        </p>
        <IconArrow size={20} />
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
            Mit diesen Szenarien prüfen wir an echten Menschen, ob Leistung und Informationen zusammen auf eine Ergebnisseite
            passen.
          </p>
          <p className="t-actions">
            <ScenarioStart>Prototyp öffnen</ScenarioStart>
          </p>
        </div>
      </div>

      <div className="t-container t-page t-scens">
        <section aria-labelledby="szenarien">
          <h2 id="szenarien" className="t-h2">
            Szenarien
          </h2>
          <ul className="t-scards">
            {SCENARIOS.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="ablauf">
          <h2 id="ablauf" className="t-h2">
            So läuft der Test
          </h2>
          <ol className="t-scens__steps">
            <li>Bitten Sie die Person, laut zu denken. Sie kann nichts falsch machen, wir testen die Seite.</li>
            <li>Starten Sie das Szenario, lesen Sie die Aufgabe vor und geben Sie die Wohnortkarte dazu.</li>
            <li>Helfen Sie nicht, und sagen Sie nie „Leistung“ oder „Bereich“.</li>
            <li>Stoppen Sie, bevor die Person einen Antrag oder Termin startet. Fragen Sie dann „Wie leicht war das, von 1 sehr schwer bis 7 sehr leicht?“.</li>
            <li>Planen Sie 5 bis 8 Personen und je 30 bis 45 Minuten ein. Wechseln Sie die Reihenfolge der Szenarien.</li>
          </ol>
          <ul className="t-scens__notes">
            <li>Später bewertet eine KI jede Suche und braucht dafür 1 bis 3 Sekunden. Der Prototyp spielt diese Zeit mit einer Ladeanimation nach.</li>
            <li>Getestet wird nur die Suche, nicht der Antrag.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
