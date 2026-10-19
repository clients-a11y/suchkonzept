"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { TenantPreview } from "@/components/TenantPreview";
import { TENANTS } from "@/data/tenants";
import { FONT_LABEL, removeCustomTenant, useCustomTenants } from "@/lib/tenant-store";
import { formatClock } from "@/lib/format";
import type { Tenant } from "@/lib/types";

const TYPE_LABEL: Record<Tenant["type"], string> = { info: "Informationsportal", service: "Serviceportal" };

function Specs({ tenant }: { tenant: Tenant }) {
  const t = tenant.tokens;
  const colors = [
    ["Primär", t.primary],
    ["Akzent", t.accent],
    ["Fläche", t.surface],
  ];
  return (
    <dl className="pf-specs">
      {colors.map(([label, hex]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>
            <span className="pf-specs__swatch" style={{ background: hex }} aria-hidden="true" />
            <code>{hex.toUpperCase()}</code>
          </dd>
        </div>
      ))}
      <div>
        <dt>Schrift</dt>
        <dd>
          {FONT_LABEL[t.headingFont]}
          {t.bodyFont !== t.headingFont && ` / ${FONT_LABEL[t.bodyFont]}`}
        </dd>
      </div>
      <div>
        <dt>Ecken</dt>
        <dd>
          <code>{`${t.radius} px`}</code>
        </dd>
      </div>
    </dl>
  );
}

function CustomList() {
  const custom = useCustomTenants();
  const [removed, setRemoved] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Stays visible after the last removal, so focus has somewhere to land.
  if (!custom || (custom.length === 0 && !removed)) return null;
  return (
    <section className="pf-container pf-section">
      <h2 className="pf-h2" ref={headingRef} tabIndex={-1}>
        In diesem Browser angelegt
      </h2>
      <p className="pf-muted">Diese Mandanten liegen nur im Speicher dieses Browsers. Ein Backend folgt später.</p>
      <p role="status" className="pf-status">
        {removed && `${removed} wurde entfernt.`}
        {removed && custom.length === 0 && " Es sind keine eigenen Mandanten mehr gespeichert."}
      </p>
      <ul className="pf-own" hidden={custom.length === 0}>
        {custom.map((tenant) => (
          <li key={tenant.id} className="pf-own__item">
            <span className="pf-own__swatch" style={{ background: tenant.tokens.primary }} aria-hidden="true" />
            <span className="pf-own__name">
              <strong>{tenant.name}</strong>
              <span className="pf-muted">
                {tenant.kind} · {TYPE_LABEL[tenant.type]}
                {typeof tenant.createdInSeconds === "number" && (
                  <>
                    {" "}
                    · angelegt in <code>{formatClock(tenant.createdInSeconds)}</code>
                  </>
                )}
              </span>
            </span>
            <code className="pf-own__path">/{tenant.id}</code>
            <span className="pf-own__actions">
              <Link href={`/${tenant.id}`} className="pf-btn pf-btn--small">
                Portal öffnen<span className="visually-hidden">: {tenant.name}</span>
              </Link>
              <Link href={`/bearbeiten?mandant=${tenant.id}`} className="pf-btn pf-btn--small">
                Bearbeiten<span className="visually-hidden">: {tenant.name}</span>
              </Link>
              <button
                type="button"
                className="pf-btn pf-btn--small pf-btn--ghost"
                onClick={() => {
                  removeCustomTenant(tenant.id);
                  setRemoved(tenant.name);
                  headingRef.current?.focus();
                }}
              >
                Entfernen<span className="visually-hidden">: {tenant.name}</span>
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PlatformStart() {
  return (
    <>
      <div className="pf-container pf-hero">
        <h1 className="pf-h1">Ein CMS, viele Portale</h1>
        <p className="pf-lead">
          Ein Land und eine Stadt, ein System dahinter. Farben, Schriften, Ecken und Menü sind Einstellungen des Mandanten,
          kein eigener Code. Den dritten Mandanten legen Sie selbst an.
        </p>
      </div>

      <div className="pf-container">
        <ul className="pf-fork">
          {TENANTS.map((tenant) => (
            <li key={tenant.id} className="pf-card">
              <div className="pf-card__preview">
                <TenantPreview tenant={tenant} />
              </div>
              <div className="pf-card__body">
                <h2 className="pf-card__title">{tenant.name}</h2>
                <p className="pf-muted">
                  {tenant.kind} · {TYPE_LABEL[tenant.type]}
                </p>
                <Specs tenant={tenant} />
                <Link href={`/${tenant.id}`} className="pf-btn pf-btn--primary pf-card__cta">
                  Portal öffnen<span className="visually-hidden">: {tenant.name}</span>
                </Link>
              </div>
            </li>
          ))}
          <li className="pf-card pf-card--next">
            <div className="pf-card__preview pf-ghost" aria-hidden="true">
              <span className="pf-ghost__bar" />
              <span className="pf-ghost__head" />
              <span className="pf-ghost__nav" />
              <span className="pf-ghost__hero" />
              <span className="pf-ghost__cards">
                <span className="pf-ghost__card" />
                <span className="pf-ghost__card" />
                <span className="pf-ghost__card" />
              </span>
            </div>
            <div className="pf-card__body">
              <h2 className="pf-card__title">Ihr Mandant</h2>
              <p>
                Name, Farben, Schrift und Menü in vier Schritten. Die Stoppuhr läuft mit, eine Codeänderung ist nicht nötig.
              </p>
              <Link href="/neu" className="pf-btn pf-btn--primary pf-card__cta">
                Neuen Mandanten anlegen
              </Link>
            </div>
          </li>
        </ul>
      </div>

      <CustomList />

      <section className="pf-container pf-section pf-split">
        <div>
          <h2 className="pf-h2">Gleich für alle</h2>
          <ul className="pf-ticks">
            <li>Leistungskatalog mit zehn Verwaltungsleistungen</li>
            <li>Zentrale Suche mit Vorschlägen beim Tippen, Tippfehlerkorrektur und Kurzantwort</li>
            <li>Seitentypen: Startseite, Leistung, Suche, Aktuelles, Inhaltsseite</li>
            <li>Barrierefreiheit: Sprunglink, Landmarken, Tastaturbedienung, geprüfte Kontraste</li>
            <li>Kopf- und Fußzeile, Brotkrumen, Kontaktblöcke</li>
          </ul>
        </div>
        <div>
          <h2 className="pf-h2">Stellt jeder Mandant ein</h2>
          <ul className="pf-ticks">
            <li>Primärfarbe, Akzent und Fläche</li>
            <li>Schrift für Überschriften und Ecken</li>
            <li>Portaltyp: Informationsportal oder Serviceportal</li>
            <li>Menüpunkte und Fußzeile</li>
            <li>Gebärdensprache, Leichte und Einfache Sprache, weitere Sprachen</li>
          </ul>
        </div>
      </section>
    </>
  );
}
