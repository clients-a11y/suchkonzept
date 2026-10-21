import Link from "next/link";

export function NotFoundBlock() {
  return (
    <div className="t-container t-page t-notfound">
      <h1 className="t-h1">Seite nicht gefunden</h1>
      <p className="t-lead">Die Adresse ist falsch, oder die Seite gibt es nicht mehr.</p>
      <p className="t-actions">
        <Link href="/" className="t-btn t-btn--primary">
          Zur Startseite
        </Link>
        <Link href="/suche" className="t-btn">
          Suche öffnen
        </Link>
      </p>
    </div>
  );
}
