import Link from "next/link";
import { IconArrow } from "@/components/Icons";
import { SCENARIO_GROUPS, placeOf, priorityOf } from "@/data/test-scenarios";
import type { Scenario } from "@/data/test-scenarios";

// In front of the prototype, without the portal around it: all scenarios at a glance, one page per scenario.

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const place = placeOf(scenario);
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
      <p className="t-scard__entry">
        Suchbegriff: {scenario.term}
        {place && ` · Wohnort: ${place}`}
      </p>
      <div className="t-scard__foot">
        <ul className="t-scard__tags">
          <li>{priorityOf(scenario)}</li>
          {scenario.v1 && <li>Variante 1</li>}
          {scenario.v2 && <li>Variante 2</li>}
          {scenario.chat && <li>Chat</li>}
        </ul>
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
            Mit diesen Szenarien prüfen wir an echten Menschen die Annahme 1 des Product Owners. Sie besagt, dass Leistung und
            Informationen zusammen auf eine Ergebnisseite passen.
          </p>
          <p className="t-actions">
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

        {SCENARIO_GROUPS.map((group, index) => (
          <section key={group.title} aria-labelledby={`gruppe-${index}`}>
            <h2 id={`gruppe-${index}`} className="t-h2">
              {group.title}
            </h2>
            <p className="t-scens__lead">{group.lead}</p>
            <ul className="t-scards">
              {group.scenarios.map((scenario) => (
                <ScenarioCard key={scenario.id} scenario={scenario} />
              ))}
            </ul>
          </section>
        ))}

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
      </div>
    </main>
  );
}
