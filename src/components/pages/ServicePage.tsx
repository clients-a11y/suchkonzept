"use client";

import { useId, useState } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NotFoundBlock } from "@/components/pages/NotFoundBlock";
import { PLACES } from "@/data/content";
import { findService } from "@/data/services";
import type { Service, Tenant } from "@/lib/types";
import { useDocumentTitle } from "@/lib/use-document-title";

type Office = { office: string; address: string; phone: string; hours?: string };

function Responsible({ tenant, service, placeId }: { tenant: Tenant; service: Service; placeId: string }) {
  let office: Office | undefined;
  let note: string;
  if (service.level === "land" || tenant.type === "service") {
    office = tenant.contact;
    note = service.level === "land" ? "Diese Leistung bietet das Land selbst an." : `Voreingestellt für ${tenant.name}.`;
  } else {
    const place = PLACES.find((p) => p.id === placeId);
    office = place;
    note = place
      ? `Zuständig für ${place.name}.`
      : "Wählen Sie oben einen Ort, dann sehen Sie hier die zuständige Stelle. Alle Informationen zur Leistung gelten auch ohne Auswahl.";
  }
  return (
    <section className="t-box">
      <h2 className="t-box__title">Zuständige Stelle</h2>
      {office && (
        <p className="t-box__office">
          <strong>{office.office}</strong>
          <br />
          {office.address}
          <br />
          Telefon {office.phone}
          {office.hours && (
            <>
              <br />
              {office.hours}
            </>
          )}
        </p>
      )}
      <p className="t-box__note">{note}</p>
    </section>
  );
}

function ServiceView({ service }: { service: Service }) {
  const { tenant } = useCurrentTenant();
  const [placeId, setPlaceId] = useState("");
  const [notice, setNotice] = useState("");
  const placeSelectId = useId();
  const placeHintId = useId();
  const choosePlace = tenant.type === "info" && service.level === "kommune";
  const action = service.online ? "Online beantragen" : "Termin vereinbaren";
  const sections = service.sections.filter((s) => s.body.length > 0);

  return (
    <div className="t-container t-page">
      <Breadcrumb
        items={[
          { label: tenant.type === "service" ? "Leistungen A bis Z" : "Verwaltungsleistungen", href: "/suche?tab=leistungen" },
          { label: service.title, href: `/leistungen/${service.slug}` },
        ]}
      />
      <h1 className="t-h1">{service.title}</h1>
      <p className="t-lead">{service.summary}</p>

      {choosePlace && (
        <div className="t-place">
          <label htmlFor={placeSelectId}>Ort wählen (optional)</label>
          <select
            id={placeSelectId}
            className="t-select"
            value={placeId}
            aria-describedby={placeHintId}
            onChange={(event) => setPlaceId(event.target.value)}
          >
            <option value="">Kein Ort gewählt</option>
            {PLACES.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
          <p id={placeHintId} className="t-place__hint">
            Zeigt die zuständige Stelle. Alle Inhalte bleiben ohne Auswahl sichtbar.
          </p>
        </div>
      )}

      <div className="t-service">
        <div className="t-service__main">
          <section className="t-facts">
            <h2 className="t-facts__title">Das Wichtigste</h2>
            <dl>
              <div>
                <dt>Kosten</dt>
                <dd>{service.costs}</dd>
              </div>
              <div>
                <dt>Dauer</dt>
                <dd>{service.duration}</dd>
              </div>
              <div>
                <dt>Online möglich</dt>
                <dd>{service.online ? "Ja" : "Nein, nur vor Ort"}</dd>
              </div>
              <div>
                <dt>Unterlagen</dt>
                <dd>
                  <ul>
                    {service.documents.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <div className="t-facts__action">
              <button
                type="button"
                className="t-btn t-btn--primary t-btn--large"
                onClick={() =>
                  setNotice(`${action}: Im Klick-Dummy ohne Funktion. Hier startet später der echte Vorgang.`)
                }
              >
                {action}
              </button>
              <p role="status" className="t-notice">
                {notice}
              </p>
            </div>
          </section>

          {sections.length > 0 && (
            <section className="t-details">
              <h2 className="t-h2">Mehr zur Leistung</h2>
              {sections.map((section) => (
                <details key={section.title} className="t-detail">
                  <summary>{section.title}</summary>
                  <div className="t-detail__body">
                    {section.body.length > 1 ? (
                      <ol>
                        {section.body.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ol>
                    ) : (
                      <p>{section.body[0]}</p>
                    )}
                  </div>
                </details>
              ))}
            </section>
          )}
        </div>

        <div className="t-service__side">
          <Responsible tenant={tenant} service={service} placeId={placeId} />
          <section className="t-box t-box--quiet">
            <h2 className="t-box__title">Fragen zur Leistung</h2>
            <p>
              {tenant.contact.office}
              <br />
              Telefon {tenant.contact.phone}
              <br />
              {tenant.contact.hours}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function ServicePage({ slug }: { slug: string }) {
  const { tenant } = useCurrentTenant();
  const service = findService(slug);
  useDocumentTitle(`${service?.title ?? "Leistung nicht gefunden"} · ${tenant.name}`);
  if (!service) return <NotFoundBlock what="Leistung" />;
  return <ServiceView service={service} />;
}
