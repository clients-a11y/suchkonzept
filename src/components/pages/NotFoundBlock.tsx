import Link from "next/link";
import { SEARCH_PATH } from "@/data/site";

export function NotFoundBlock() {
  return (
    <div className="t-container t-page t-notfound">
      <h1 className="t-h1">Seite nicht gefunden</h1>
      <p className="t-lead">Die Adresse ist falsch, oder die Seite gibt es nicht mehr.</p>
      <p className="t-actions">
        <Link href="/" className="t-btn t-btn--primary">
          Zur Startseite
        </Link>
        <Link href={SEARCH_PATH} className="t-btn">
          Suche öffnen
        </Link>
      </p>
    </div>
  );
}
