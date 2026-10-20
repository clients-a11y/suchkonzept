"use client";

import Link from "next/link";
import { useState } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IconArrow } from "@/components/Icons";
import { PlaceFinder } from "@/components/PlaceFinder";
import { NotFoundBlock } from "@/components/pages/NotFoundBlock";
import type { Place } from "@/data/content";
import { unitForService } from "@/data/organisation";
import { findService } from "@/data/services";
import { allPlaces, usePlaceId } from "@/lib/place-store";
import { useAllTenants, useCustomTenants } from "@/lib/tenant-store";
import { type Office, officeForPlace, officeOf } from "@/lib/offices";
import type { Service, Tenant } from "@/lib/types";
import { useDocumentTitle } from "@/lib/use-document-title";
import { CATALOGUE, origin } from "@/lib/origin";

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

// Points from one portal to another: a city with its own portal, or the Land portal.
function Referral({ place, service, tenants, current }: { place: Place; service: Service; tenants: Tenant[]; current: Tenant }) {
  const target = place.tenant && place.tenant !== current.id ? place.tenant : !place.tenant && current.type === "service" ? place.land : undefined;
  const other = target ? tenants.find((t) => t.id === target) : undefined;
  if (!other) return null;
  const text =
    other.type === "service"
      ? `${other.name} hat ein eigenes Serviceportal mit Ansprechpersonen und Online-Antrag.`
      : `${place.name} gehört nicht zu ${current.name}. Die zuständige Stelle finden Sie im ${other.tagline} ${other.name}.`;
  return (
    <div className="t-referral">
      <p>{text}</p>
      <Link href={`/${other.id}/leistungen/${service.slug}`} className="t-more">
        {service.title} bei {other.name} <IconArrow size={18} />
      </Link>
    </div>
  );
}

function Responsible({ tenant, service }: { tenant: Tenant; service: Service }) {
  const { base } = useCurrentTenant();
  const tenants = useAllTenants();
  const places = allPlaces(useCustomTenants() ?? []);
  const placeId = usePlaceId();
  const place = places.find((p) => p.id === placeId);
  const unit = unitForService(tenant, service.slug);

  // Services of the Land itself have one office; a city portal presets its own.
  const landService = service.level === "land";
  const cityPortal = tenant.type === "service";
  const outside = cityPortal && place && place.tenant !== tenant.id ? place : undefined;

  let office: Office | undefined;
  let note: string;
  if (landService) {
    office = officeOf(tenant, service);
    note = "Diese Leistung bietet das Land selbst an.";
  } else if (cityPortal) {
    office = officeOf(tenant, service);
    note = `Voreingestellt für ${tenant.name}.`;
  } else if (place) {
    office = officeForPlace(place, service, tenants);
    note = `Zuständig für ${place.name}.`;
  } else {
    note = "Geben Sie oben Postleitzahl oder Ort ein, dann sehen Sie hier die zuständige Stelle. Alle Informationen zur Leistung gelten auch ohne Angabe.";
  }

  return (
    <section className="t-box" {...origin("mandant", "Mandant · Zuständigkeit")}>
      <h2 className="t-box__title">Zuständige Stelle</h2>
      {office && <OfficeLines office={office} />}
      <p className="t-box__note">{note}</p>
      {unit && (
        <p className="t-box__link">
          {cityPortal || landService ? "Mehr zur Stelle: " : "Im Land zuständig: "}
          <Link href={`${base}/organisation/${unit.id}`}>{unit.name}</Link>
        </p>
      )}
      {cityPortal && !landService && (
        <details className="t-elsewhere" open={Boolean(outside)}>
          <summary>Wohnen Sie nicht in {tenant.name}?</summary>
          <PlaceFinder places={places} label="Postleitzahl oder Ort" />
          {outside && (
            <>
              <p className="t-box__note">
                Für {outside.name} ist zuständig: <strong>{officeForPlace(outside, service, tenants).office}</strong>
              </p>
              <Referral place={outside} service={service} tenants={tenants} current={tenant} />
            </>
          )}
        </details>
      )}
    </section>
  );
}

function ServiceView({ service }: { service: Service }) {
  const { tenant, base } = useCurrentTenant();
  const tenants = useAllTenants();
  const places = allPlaces(useCustomTenants() ?? []);
  const placeId = usePlaceId();
  const place = places.find((p) => p.id === placeId);
  const [notice, setNotice] = useState("");
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
        <div className="t-place" {...origin("zentral", "Zentral · Plattform: Zuständigkeitsfinder")}>
          <PlaceFinder places={places} label="Zuständige Stelle finden: Postleitzahl oder Ort (optional)" />
          {place && <Referral place={place} service={service} tenants={tenants} current={tenant} />}
        </div>
      )}

      <div className="t-service">
        <div className="t-service__main">
          <section className="t-facts" {...CATALOGUE}>
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
              {service.online ? (
                <Link href={`${base}/antrag/${service.slug}`} className="t-btn t-btn--primary t-btn--large">
                  {action}
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    className="t-btn t-btn--primary t-btn--large"
                    onClick={() => setNotice(`${action}: Im Klick-Dummy ohne Funktion. Hier startet später die Terminbuchung.`)}
                  >
                    {action}
                  </button>
                  <p role="status" className="t-notice">
                    {notice}
                  </p>
                </>
              )}
            </div>
          </section>

          {sections.length > 0 && (
            <section className="t-details" {...CATALOGUE}>
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
          <Responsible tenant={tenant} service={service} />
          <section className="t-box t-box--quiet" {...origin("mandant", "Mandant · Einstellung: Kontakt")}>
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
