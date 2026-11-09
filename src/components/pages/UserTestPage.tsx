import { ScenarioStart } from "@/components/ScenarioStart";
import { SavedScenarioList, ScenarioConfigurator, TestsTabs } from "@/components/ScenarioPlanner";
import type { TestsTab } from "@/components/ScenarioPlanner";

// In front of the prototype, without the portal around it: the saved scenarios, and in its own tab the configurator.

export function UserTestPage({ tab }: { tab: TestsTab }) {
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

      <div className="t-container t-page">
        <TestsTabs active={tab} />
        {tab === "konfigurator" ? (
          <ScenarioConfigurator />
        ) : (
          <div className="t-scens">
            <SavedScenarioList />

            <section aria-labelledby="ablauf">
              <h2 id="ablauf" className="t-h2">
                So läuft der Test
              </h2>
              <ol className="t-scens__steps">
                <li>Bitten Sie die Person, laut zu denken. Sie kann nichts falsch machen, wir testen die Seite.</li>
                <li>Starten Sie das Szenario, lesen Sie die Aufgabe vor und geben Sie die Wohnortkarte dazu. Oder geben Sie der Person den Link zur Aufgabenseite, den Sie auf der Seite des Szenarios kopieren.</li>
                <li>Helfen Sie nicht, und sagen Sie nie „Leistung“ oder „Bereich“.</li>
                <li>Stoppen Sie, bevor die Person einen Antrag oder Termin startet. Fragen Sie dann „Wie leicht war das, von 1 sehr schwer bis 7 sehr leicht?“.</li>
                <li>Planen Sie 5 bis 8 Personen und je 30 bis 45 Minuten ein. Wechseln Sie die Reihenfolge der Szenarien.</li>
              </ol>
              <ul className="t-scens__notes">
                <li>Getestet wird nur die Suche, nicht der Antrag.</li>
              </ul>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
