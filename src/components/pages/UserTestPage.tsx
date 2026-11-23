import { TestCases } from "@/components/TestCases";
import { TEST_TERMS } from "@/data/test-cases";

// In front of the prototype, without the portal around it: the two test cases with their variants A and B.

export function UserTestPage() {
  return (
    <main id="inhalt" tabIndex={-1} className="t-main">
      <div className="t-pagehead">
        <div className="t-container">
          <p className="t-case__step">Verwaltungsportal Musterland · Prototyp mit Beispieldaten</p>
          <h1 className="t-h1">Testcases</h1>
          <p className="t-lead">
            Zwei Testcases, jeder als A/B-Test: Wann fragen wir nach der Postleitzahl, und stehen Leistungen und Informationen in
            einer Liste oder getrennt?
          </p>
        </div>
      </div>

      <div className="t-container t-page t-scens">
        <TestCases />

        <section aria-labelledby="begriffe">
          <h2 id="begriffe" className="t-h2">
            Suchbegriffe für den Test
          </h2>
          <table className="t-terms">
            <thead>
              <tr>
                <th scope="col">Suchbegriff</th>
                <th scope="col">Wohnort der Testperson</th>
                <th scope="col">Zeigt</th>
              </tr>
            </thead>
            <tbody>
              {TEST_TERMS.map((item) => (
                <tr key={item.term}>
                  <th scope="row">{item.term}</th>
                  <td>{item.place ?? "beliebig"}</td>
                  <td>{item.shows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby="ablauf">
          <h2 id="ablauf" className="t-h2">
            So läuft der Test
          </h2>
          <ol className="t-scens__steps">
            <li>Bitten Sie die Person, laut zu denken. Sie kann nichts falsch machen, wir testen die Seite.</li>
            <li>Starten Sie eine Variante, stellen Sie die Aufgabe und nennen Sie der Person ihren Wohnort.</li>
            <li>Helfen Sie nicht, und sagen Sie nie „Leistung“ oder „Bereich“.</li>
            <li>Stoppen Sie, bevor die Person einen Antrag oder Termin startet. Fragen Sie dann „Wie leicht war das, von 1 sehr schwer bis 7 sehr leicht?“.</li>
            <li>Planen Sie 5 bis 8 Personen und je 30 bis 45 Minuten ein. Wechseln Sie ab, welche Variante eine Person zuerst sieht.</li>
          </ol>
          <ul className="t-scens__notes">
            <li>Jeder Start löscht alle Eingaben. Die Suche braucht in allen Varianten 2 Sekunden.</li>
            <li>Getestet wird nur die Suche, nicht der Antrag.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
