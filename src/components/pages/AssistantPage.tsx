"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IconSparkle } from "@/components/Icons";
import { AssistantChat } from "@/components/AssistantChat";
import { SITE } from "@/data/site";

// The search hands over a question and, if it knows one, the place.
function PageChat() {
  const params = useSearchParams();
  return <AssistantChat variant="page" handoff={{ question: params.get("frage") ?? undefined, place: params.get("ort") ?? undefined }} />;
}

export function AssistantPage() {
  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb items={[{ label: "Chat-Assistent", href: "/assistent" }]} />
          <h1 className="t-h1">Chat-Assistent</h1>
          <p className="t-lead">
            Beschreiben Sie Ihr Anliegen in eigenen Worten. Der Assistent fragt nach, was er für die Antwort braucht, und zeigt
            Ihnen die zuständige Stelle.
          </p>
        </div>
      </div>
      <div className="t-container t-page">
        <p className="t-chat__notice">
          <IconSparkle size={16} />
          Automatischer Assistent, keine Person. Im Prototyp lokal simuliert, ohne echte KI: Die Antworten stammen aus dem
          Leistungskatalog und den Inhalten dieses Portals.
        </p>
        <div className="t-layout">
          <div className="t-layout__main">
            <Suspense fallback={<p className="t-chat__loading">Assistent wird geladen …</p>}>
              <PageChat />
            </Suspense>
          </div>
          <aside className="t-layout__side" aria-label="Kontakt und Hinweise">
            <section className="t-box">
              <h2 className="t-box__title">Lieber mit einem Menschen sprechen?</h2>
              <p>
                {SITE.contact.office}
                <br />
                Telefon {SITE.contact.phone}
                <br />
                {SITE.contact.hours}
              </p>
            </section>
            <section className="t-box t-box--quiet">
              <h2 className="t-box__title">So arbeitet der Assistent</h2>
              <ul className="t-chat__rules">
                <li>Er fragt nur, was er für die Antwort braucht.</li>
                <li>Ihre Postleitzahl bleibt in diesem Browser.</li>
                <li>Jede Antwort nennt ihre Quelle im Leistungskatalog oder auf diesem Portal.</li>
                <li>Er ist eine automatische Hilfe, keine Person und keine Rechtsberatung.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
