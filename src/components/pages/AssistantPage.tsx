"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IconSparkle } from "@/components/Icons";
import { AssistantChat } from "@/components/AssistantChat";
import { useDocumentTitle } from "@/lib/use-document-title";
import { origin } from "@/lib/origin";

// The search or another portal hands over a question, the known place and where it came from.
function PageChat() {
  const params = useSearchParams();
  return (
    <AssistantChat
      variant="page"
      handoff={{
        question: params.get("frage") ?? undefined,
        from: params.get("von") ?? undefined,
        place: params.get("ort") ?? undefined,
      }}
    />
  );
}

export function AssistantPage() {
  const { tenant, base } = useCurrentTenant();
  useDocumentTitle(`Assistent · ${tenant.name}`);
  const enabled = tenant.assistant?.enabled !== false;

  return (
    <div className="t-container t-page">
      <Breadcrumb items={[{ label: "Assistent", href: "/assistent" }]} />
      <h1 className="t-h1">Chat-Assistent</h1>
      <p className="t-lead">
        Beschreiben Sie Ihr Anliegen in eigenen Worten. Der Assistent fragt nach, was er für die Antwort braucht, und zeigt
        Ihnen die zuständige Stelle.
      </p>
      {!enabled ? (
        <div className="t-empty">
          <p>{tenant.name} bietet keinen Chat-Assistenten an. Die Suche hilft Ihnen weiter.</p>
          <Link href={`${base}/suche`} className="t-btn">
            Zur Suche
          </Link>
        </div>
      ) : (
        <>
          <p className="t-chat__notice">
            <IconSparkle size={16} />
            Automatischer Assistent, keine Person. Im Klick-Dummy lokal simuliert, ohne echte KI: Die Antworten stammen aus
            dem Leistungskatalog und den Angaben dieses Portals.
          </p>
          <div className="t-service">
            <div className="t-service__main">
              <Suspense fallback={<p className="t-chat__loading">Assistent wird geladen …</p>}>
                <PageChat />
              </Suspense>
            </div>
            <div className="t-service__side">
              <section className="t-box" {...origin("mandant", "Mandant · Einstellung: Kontakt")}>
                <h2 className="t-box__title">Lieber mit einem Menschen sprechen?</h2>
                <p>
                  {tenant.contact.office}
                  <br />
                  Telefon {tenant.contact.phone}
                  <br />
                  {tenant.contact.hours}
                </p>
              </section>
              <section className="t-box t-box--quiet" {...origin("zentral", "Zentral · Plattform: Assistent")}>
                <h2 className="t-box__title">So arbeitet der Assistent</h2>
                <ul className="t-chat__rules">
                  <li>Er fragt nur, was er für die Antwort braucht.</li>
                  <li>Ihre Postleitzahl bleibt in diesem Browser.</li>
                  <li>Jede Antwort nennt ihre Quelle im Leistungskatalog oder auf diesem Portal.</li>
                  <li>Er ist eine automatische Hilfe, keine Person und keine Rechtsberatung.</li>
                </ul>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
