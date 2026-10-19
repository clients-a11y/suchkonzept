"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { TenantContext } from "@/components/TenantContext";
import { PlatformShell } from "@/components/PlatformShell";
import { SkipLink } from "@/components/SkipLink";
import { DemoBar } from "@/components/DemoBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { themeStyle, useTenant } from "@/lib/tenant-store";
import type { Tenant } from "@/lib/types";
import { useDocumentTitle } from "@/lib/use-document-title";
import { useShowOrigin } from "@/lib/origin";

export function TenantLoading() {
  return (
    <div className="pf-loading">
      <p role="status">Portal wird geladen …</p>
    </div>
  );
}

function TenantMissing({ id, children }: { id: string; children: ReactNode }) {
  useDocumentTitle("Mandant nicht gefunden · Portalbaukasten");
  return (
    <PlatformShell>
      <div className="pf-container pf-page pf-missing">
        <h1 className="pf-h1">Mandant nicht gefunden</h1>
        <p className="pf-lead">
          Unter <code className="pf-code">/{id}</code> gibt es kein Portal. Mandanten aus dem Assistenten liegen nur in dem
          Browser, in dem sie angelegt wurden.
        </p>
        <p className="pf-actions">
          <Link href="/" className="pf-btn pf-btn--primary">
            Zur Übersicht
          </Link>
          <Link href="/neu" className="pf-btn">
            Neuen Mandanten anlegen
          </Link>
        </p>
      </div>
      {children}
    </PlatformShell>
  );
}

function ThemedShell({ tenant, children }: { tenant: Tenant; children: ReactNode }) {
  const value = useMemo(() => ({ tenant, base: `/${tenant.id}` }), [tenant]);
  const showOrigin = useShowOrigin();
  return (
    <TenantContext.Provider value={value}>
      <div
        className={`t-root t-shell t-root--${tenant.type}`}
        style={themeStyle(tenant.tokens)}
        data-shell
        data-show-origin={showOrigin ? "true" : undefined}
      >
        <SkipLink className="t-skip" />
        <DemoBar />
        <Header />
        <main id="inhalt" tabIndex={-1} className="t-main">
          {children}
        </main>
        <Footer />
      </div>
    </TenantContext.Provider>
  );
}

export function TenantShell({ id, children }: { id: string; children: ReactNode }) {
  const tenant = useTenant(id);
  // Children stay in the tree in every state; TenantGate renders them only with a tenant.
  if (tenant === "loading") {
    return (
      <>
        <TenantLoading />
        {children}
      </>
    );
  }
  if (!tenant) return <TenantMissing id={id}>{children}</TenantMissing>;
  return <ThemedShell tenant={tenant}>{children}</ThemedShell>;
}
