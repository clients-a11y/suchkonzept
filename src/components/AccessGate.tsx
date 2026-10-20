import { PlatformMark } from "@/components/PlatformShell";

export type AccessState = "start" | "falsch" | "fehlt";

// Shown by the proxy in place of every page until the password is entered.
// A plain form without JavaScript: the proxy checks the password and sets the cookie.
export function AccessGate({ state }: { state: AccessState }) {
  const failed = state === "falsch";
  return (
    <div className="pf-root">
      <header className="pf-access__bar">
        <div className="pf-container">
          <p className="pf-access__mark">
            <PlatformMark />
            <span>Portalbaukasten</span>
          </p>
        </div>
      </header>
      <main id="inhalt" className="pf-main pf-access__main">
        <div className="pf-container">
          <div className="pf-access__inner">
            <h1 className="pf-h1 pf-h1--page">Zugang zum Klick-Dummy</h1>
            {state === "fehlt" ? (
              <>
                <p className="pf-lead">Für diese Vorschau ist noch kein Passwort hinterlegt. Bis dahin bleibt sie geschlossen.</p>
                <p className="pf-hint pf-access__setup">Für die Einrichtung: Variable DEMO_PASSWORD im Hosting setzen.</p>
              </>
            ) : (
              <>
                <p className="pf-lead">Diese Vorschau ist nicht öffentlich. Geben Sie das Passwort ein, das Sie erhalten haben.</p>
                <form method="post" className="pf-access__form">
                  <div className="pf-field">
                    <label htmlFor="zugang-passwort" className="pf-label">
                      Passwort
                    </label>
                    {failed && (
                      <p id="zugang-fehler" className="pf-error">
                        Das Passwort stimmt nicht. Prüfen Sie die Eingabe und versuchen Sie es noch einmal.
                      </p>
                    )}
                    <input
                      id="zugang-passwort"
                      name="passwort"
                      type="password"
                      autoComplete="current-password"
                      required
                      autoFocus
                      className="pf-input"
                      aria-invalid={failed || undefined}
                      aria-describedby={failed ? "zugang-fehler" : undefined}
                    />
                  </div>
                  <button type="submit" className="pf-btn pf-btn--primary">
                    Klick-Dummy öffnen
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <footer className="pf-footer">
        <div className="pf-container pf-footer__inner">
          <p>Klick-Dummy mit Beispieldaten. Alle Mandanten, Namen und Inhalte sind fiktiv.</p>
        </div>
      </footer>
    </div>
  );
}
