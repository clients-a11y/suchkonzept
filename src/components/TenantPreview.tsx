import { Emblem } from "@/components/Emblem";
import { PortalArt } from "@/components/Art";
import { themeStyle } from "@/lib/tenant-store";
import type { Tenant } from "@/lib/types";

// A small, purely visual rendering of a tenant's start page, built from its tokens.
// Hidden from assistive technology: the surrounding card or form describes the tenant in text.
export function TenantPreview({ tenant }: { tenant: Tenant }) {
  const service = tenant.type === "service";
  return (
    <div className={`t-root t-mini t-root--${tenant.type}`} style={themeStyle(tenant.tokens)} aria-hidden="true">
      <div className="t-mini__top">
        {tenant.meta.dgs && <span />}
        {tenant.meta.ls && <span />}
        {tenant.meta.es && <span />}
      </div>
      <div className="t-mini__head">
        <Emblem tenant={tenant} size={20} />
        <span className="t-mini__brand">
          <span className="t-mini__name">{tenant.name || "Name"}</span>
          <span className="t-mini__tag">{tenant.tagline}</span>
        </span>
      </div>
      <div className="t-mini__nav">
        {tenant.nav.slice(0, 4).map((item) => (
          <span key={item.href}>{item.label}</span>
        ))}
      </div>
      <div className="t-mini__hero">
        <PortalArt type={tenant.type} className="t-mini__art" />
        <div className="t-mini__copy">
          {service ? (
            <>
              <span className="t-mini__title">Was möchten Sie erledigen?</span>
              <span className="t-mini__search">
                <span />
                <span className="t-mini__button">Suchen</span>
              </span>
            </>
          ) : (
            <>
              <span className="t-mini__title">{tenant.name || "Name"}</span>
              <span className="t-mini__lead">{tenant.tagline}</span>
            </>
          )}
        </div>
      </div>
      <div className="t-mini__cards">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
