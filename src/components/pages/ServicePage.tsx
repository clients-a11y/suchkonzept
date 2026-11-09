"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ChatButton } from "@/components/ChatButton";
import { HomePlace } from "@/components/HomePlace";
import { IconArrow, IconCheck, IconPin } from "@/components/Icons";
import { landUnitFor, localUnitFor } from "@/data/organisation";
import { findService } from "@/data/services";
import { CHAT_IN_PORTAL, SITE } from "@/data/site";
import { type Office, isCentral, offeredIn, responsibleOffice } from "@/lib/offices";
import { usePlace } from "@/lib/place-store";
import type { Service } from "@/lib/types";

// Information pages that belong to a service.
const MORE_INFO: Record<string, { label: string; href: string }[]> = {
  "kindergeld-beantragen": [{ label: "Kindergeld: Das Wichtigste für Familien", href: "/seite/kindergeld" }],
  "personalausweis-beantragen": [{ label: "Rathaus Beispielstadt: Öffnungszeiten", href: "/seite/rathaus-beispielstadt" }],
};

function OfficeLines({ office }: { office: Office }) {
  return (
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
  );
}

// Side box: who is in charge. Services of the federation and the Land have one office; municipal ones need the place.
function Responsible({ service }: { service: Service }) {
  const place = usePlace();
  const office = responsibleOffice(service, place);
  const central = isCentral(service);
  const local = place && !central ? localUnitFor(place.id, service.slug) : undefined;
  const ministry = landUnitFor(service.slug);
  const titleId = useId();

  return (
    <section className="t-box t-box--accent" aria-labelledby={titleId}>
      <h2 id={titleId} className="t-box__title">
        Zuständige Stelle
      </h2>
      {office ? (
        <>
          <OfficeLines office={office} />
          <p className="t-box__note">
            {service.level === "bund" ? "Bundesweit einheitlich, Ihr Wohnort spielt keine Rolle." : central ? "Diese Leistung bietet das Land selbst an." : `Zuständig für ${place?.name}.`}
          </p>
        </>
      ) : place && !offeredIn(service, place) ? (
        <p className="t-box__note">In {place.name} gibt es diese Leistung nicht.</p>
      ) : (
        <p className="t-box__note">
          Hängt von Ihrem Wohnort ab. Geben Sie Postleitzahl oder Ort ein. Alle Informationen zur Leistung gelten auch ohne Angabe.
        </p>
      )}
      {(local || ministry) && (
        <ul className="t-box__links">
          {local && (
            <li>
              <Link href={`/organisation/${local.id}`}>Mehr zur Stelle: {local.name}</Link>
            </li>
          )}
          {ministry && (
            <li>
              <Link href={`/organisation/${ministry.id}`}>
                {central ? "Mehr zur Stelle" : "Fachlich zuständig im Land"}: {ministry.name}
              </Link>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

function Facts({ service }: { service: Service }) {
  const [notice, setNotice] = useState("");
  const titleId = useId();
  return (
    <section className="t-facts" aria-labelledby={titleId}>
      <h2 id={titleId} className="t-facts__title">
        Das Wichtigste
      </h2>
      <dl className="t-facts__list">
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
          <dd>
            {service.online ? (
              <span className="t-facts__online">
                <IconCheck size={18} />
                Ja
              </span>
            ) : (
              "Nein, nur vor Ort"
            )}
          </dd>
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
        {service.online ? (
          <Link href={`/antrag/${service.slug}`} className="t-btn t-btn--primary t-btn--large">
            Online beantragen
            <IconArrow size={20} />
          </Link>
        ) : (
          <>
            <button
              type="button"
              className="t-btn t-btn--primary t-btn--large"
              onClick={() => setNotice("Termin vereinbaren: Im Prototyp ohne Funktion. Hier startet später die Terminbuchung.")}
            >
              Termin vereinbaren
            </button>
            <p role="status" className="t-notice">
              {notice}
            </p>
          </>
        )}
      </div>
    </section>
  );
}

function ServiceView({ service }: { service: Service }) {
  const sections = service.sections.filter((s) => s.body.length > 0);
  const more = MORE_INFO[service.slug] ?? [];
  const ids = { more: useId(), info: useId(), questions: useId() };

  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb
            items={[
              { label: "Leistungen", href: "/leistungen" },
              { label: service.title, href: `/leistungen/${service.slug}` },
            ]}
          />
          <p className="t-pagehead__kind">Leistung · {{ bund: "Bundesweit", land: "Land Musterland", kommune: "Ihre Gemeinde" }[service.level]}</p>
          <h1 className="t-h1">{service.title}</h1>
          <p className="t-lead">{service.summary}</p>
        </div>
      </div>

      <div className="t-container t-page t-layout">
        <div className="t-layout__main">
          {/* Asked here, not on the start page: only municipal services need the place. Nothing is locked. */}
          {service.level === "kommune" && (
            <div className="t-place">
              <IconPin size={24} />
              <HomePlace />
            </div>
          )}

          <Facts service={service} />

          {sections.length > 0 && (
            <section className="t-accordions" aria-labelledby={ids.more}>
              <h2 id={ids.more} className="t-h2">
                Mehr zur Leistung
              </h2>
              {sections.map((section) => (
                <details key={section.title} className="t-accordion">
                  <summary>{section.title}</summary>
                  <div className="t-accordion__body">
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

        <aside className="t-layout__side" aria-label="Weitere Informationen">
          <Responsible service={service} />
          <section className="t-box" aria-labelledby={ids.info}>
            <h2 id={ids.info} className="t-box__title">
              Weitere Informationen
            </h2>
            <ul className="t-box__links">
              {more.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/seite/lebenslagen">Leistungen nach Lebenslagen</Link>
              </li>
              <li>
                <Link href="/seite/hilfe">Hilfe zum Portal</Link>
              </li>
            </ul>
          </section>
          <section className="t-box" aria-labelledby={ids.questions}>
            <h2 id={ids.questions} className="t-box__title">
              Fragen zur Leistung
            </h2>
            <p>
              {SITE.contact.office}
              <br />
              Telefon {SITE.contact.phone}
              <br />
              {SITE.contact.hours}
            </p>
            {CHAT_IN_PORTAL && (
              <ChatButton question={service.title} className="t-btn t-btn--small">
                Im Chat fragen
              </ChatButton>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}

export function ServicePage({ slug }: { slug: string }) {
  const service = findService(slug);
  return service ? <ServiceView service={service} /> : null;
}
