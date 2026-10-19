"use client";

import Link from "next/link";
import { useCurrentTenant } from "@/components/TenantContext";

export function NotFoundBlock({ what }: { what: string }) {
  const { base } = useCurrentTenant();
  return (
    <div className="t-container t-page t-notfound">
      <h1 className="t-h1">{what} nicht gefunden</h1>
      <p className="t-lead">Die Adresse ist falsch oder die Seite gibt es in diesem Portal nicht.</p>
      <p className="t-actions">
        <Link href={base} className="t-btn t-btn--primary">
          Zur Startseite
        </Link>
        <Link href={`${base}/suche`} className="t-btn">
          Suche öffnen
        </Link>
      </p>
    </div>
  );
}
