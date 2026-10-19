"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useLayoutEffect, useState } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { TENANTS } from "@/data/tenants";
import { FONT_LABEL, useCustomTenants } from "@/lib/tenant-store";
import { setShowOrigin, useShowOrigin } from "@/lib/origin";

// Platform controls on every tenant page. Styled like the platform, not like the tenant.
export function DemoBar() {
  const { tenant } = useCurrentTenant();
  const custom = useCustomTenants() ?? [];
  const router = useRouter();
  const selectId = useId();
  const legendId = useId();
  const showOrigin = useShowOrigin();
  const [choice, setChoice] = useState(tenant.id);
  const t = tenant.tokens;

  // A hidden route keeps its state; reset the choice so it matches the tenant on return.
  useLayoutEffect(() => () => setChoice(tenant.id), [tenant.id]);

  const fonts =
    t.headingFont === t.bodyFont ? FONT_LABEL[t.headingFont] : `${FONT_LABEL[t.headingFont]} / ${FONT_LABEL[t.bodyFont]}`;

  return (
    <aside className="pf-demobar" aria-label="Demo-Steuerung">
      <div className="pf-demobar__inner">
        <Link href="/" className="pf-demobar__home">
          Zur Übersicht
        </Link>
        <Link href="/neu" className="pf-demobar__cta">
          Neuen Mandanten anlegen
        </Link>
        {tenant.custom && (
          <Link href={`/bearbeiten?mandant=${tenant.id}`} className="pf-demobar__home">
            Diesen Mandanten bearbeiten
          </Link>
        )}
        <button
          type="button"
          className="pf-demobar__toggle"
          aria-pressed={showOrigin}
          aria-describedby={showOrigin ? legendId : undefined}
          onClick={() => setShowOrigin(!showOrigin)}
        >
          Herkunft anzeigen
        </button>
        <form
          className="pf-switch"
          onSubmit={(event) => {
            event.preventDefault();
            if (choice !== tenant.id) router.push(`/${choice}`);
          }}
        >
          <label htmlFor={selectId}>Mandant</label>
          <select id={selectId} value={choice} onChange={(event) => setChoice(event.target.value)}>
            <optgroup label="Beispiele">
              {TENANTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </optgroup>
            {custom.length > 0 && (
              <optgroup label="In diesem Browser angelegt">
                {custom.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <button type="submit">Wechseln</button>
        </form>
        <ul className="pf-chips" aria-label="Design-Tokens dieses Mandanten">
          <li className="pf-chip">
            <span className="pf-chip__swatch" style={{ background: "var(--t-primary)" }} />
            <span className="visually-hidden">Primärfarbe</span>
            <code>{t.primary.toUpperCase()}</code>
          </li>
          <li className="pf-chip">
            <span className="pf-chip__swatch" style={{ background: "var(--t-accent)" }} />
            <span className="visually-hidden">Akzentfarbe</span>
            <code>{t.accent.toUpperCase()}</code>
          </li>
          <li className="pf-chip">
            <span className="pf-chip__swatch" style={{ background: "var(--t-surface)" }} />
            <span className="visually-hidden">Fläche</span>
            <code>{t.surface.toUpperCase()}</code>
          </li>
          <li className="pf-chip pf-chip--font">
            <span className="pf-chip__label" aria-hidden="true">
              Aa
            </span>
            <span className="visually-hidden">Schrift</span>
            <code>{fonts}</code>
          </li>
          <li className="pf-chip">
            <span className="pf-chip__corner" aria-hidden="true" />
            <span className="visually-hidden">Ecken</span>
            <code>{`${t.radius} px`}</code>
          </li>
        </ul>
        {showOrigin && (
          <p id={legendId} className="pf-legend">
            <span className="pf-legend__item pf-legend__item--zentral">Zentral: für alle Mandanten gleich</span>
            <span className="pf-legend__item pf-legend__item--mandant">Mandant: eigene Einstellung oder Redaktion</span>
            <span className="pf-legend__item pf-legend__item--vorlage">Vorlage: Platzhalter für neue Mandanten</span>
          </p>
        )}
      </div>
    </aside>
  );
}
