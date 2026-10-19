import Link from "next/link";
import { PlatformShell } from "@/components/PlatformShell";

export default function NotFound() {
  return (
    <PlatformShell>
      <div className="pf-container pf-page pf-missing">
        <h1 className="pf-h1">Seite nicht gefunden</h1>
        <p className="pf-lead">Diese Adresse gibt es im Portalbaukasten nicht.</p>
        <p className="pf-actions">
          <Link href="/" className="pf-btn pf-btn--primary">
            Zur Übersicht
          </Link>
        </p>
      </div>
    </PlatformShell>
  );
}
