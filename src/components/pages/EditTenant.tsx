"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Wizard } from "@/components/pages/Wizard";
import { findSeedTenant } from "@/data/tenants";
import { useCustomTenants } from "@/lib/tenant-store";
import { useDocumentTitle } from "@/lib/use-document-title";

export function EditLoading() {
  return (
    <div className="pf-loading">
      <p role="status">Mandant wird geladen …</p>
    </div>
  );
}

// /bearbeiten?mandant=<id>: opens the wizard with a tenant saved in this browser.
export function EditTenant() {
  const id = useSearchParams().get("mandant") ?? "";
  const custom = useCustomTenants();
  const tenant = custom?.find((t) => t.id === id);
  useDocumentTitle(tenant ? `${tenant.name} bearbeiten · Portalbaukasten` : "Mandanten bearbeiten · Portalbaukasten");

  if (custom === null) return <EditLoading />;
  // The key gives every tenant a fresh wizard state.
  if (tenant) return <Wizard key={tenant.id} editing={tenant} />;

  const seed = findSeedTenant(id);
  return (
    <div className="pf-container pf-page pf-missing">
      <h1 className="pf-h1 pf-h1--page">Mandant nicht bearbeitbar</h1>
      <p className="pf-lead">
        {seed
          ? `${seed.name} ist ein Beispielmandant aus der Konfiguration. Bearbeiten lassen sich nur Mandanten, die im Assistenten angelegt wurden.`
          : "Diesen Mandanten gibt es in diesem Browser nicht. Mandanten aus dem Assistenten liegen nur in dem Browser, in dem sie angelegt wurden."}
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
  );
}
