import { Wordmark } from "@/components/Wordmark";

export type AccessState = "start" | "falsch" | "fehlt";

// Shown by the proxy in place of every page until the password is entered.
// A plain form without JavaScript: the proxy checks the password and sets the cookie.
export function AccessGate({ state }: { state: AccessState }) {
  const failed = state === "falsch";
  return (
    <div className="t-shell t-access">
      <header className="t-access__bar">
        <div className="t-container">
          <Wordmark />
        </div>
      </header>
      <main id="inhalt" className="t-main">
        <div className="t-container t-page">
          <div className="t-access__inner">
            <h1 className="t-h1">Zugang zum Prototyp</h1>
            {state === "fehlt" ? (
              <>
                <p className="t-lead">Für diese Vorschau ist noch kein Passwort hinterlegt. Bis dahin bleibt sie geschlossen.</p>
                <p className="t-box__note">Für die Einrichtung: Variable DEMO_PASSWORD im Hosting setzen.</p>
              </>
            ) : (
              <>
                <p className="t-lead">Diese Vorschau ist nicht öffentlich. Geben Sie das Passwort ein, das Sie erhalten haben.</p>
                <form method="post" className="t-access__form">
                  <div className="t-formfield">
                    <label htmlFor="zugang-passwort" className="t-formfield__label">
                      Passwort
                    </label>
                    {failed && (
                      <p id="zugang-fehler" className="t-formfield__error">
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
                      className="t-input"
                      aria-invalid={failed || undefined}
                      aria-describedby={failed ? "zugang-fehler" : undefined}
                    />
                  </div>
                  <button type="submit" className="t-btn t-btn--primary">
                    Prototyp öffnen
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <footer className="t-footer">
        <div className="t-footer__bottom">
          <div className="t-container t-footer__bottom-inner">
            <p className="t-footer__note">Prototyp mit Beispieldaten. Musterland und alle Inhalte sind fiktiv.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
