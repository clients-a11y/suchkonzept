"use client";

import { useSyncExternalStore } from "react";
import type { Tenant } from "@/lib/types";

// Demo overlay "Herkunft anzeigen": marks every block as shared platform content, tenant
// content or template. The switch lives in the demo bar and is remembered in this browser.
const KEY = "klickdummy.herkunft";
const EVENT = "klickdummy-herkunft";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function useShowOrigin(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}

export function setShowOrigin(on: boolean) {
  try {
    if (on) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the switch still works until reload.
  }
  window.dispatchEvent(new Event(EVENT));
}

export type OriginKind = "zentral" | "mandant" | "vorlage";

export function origin(kind: OriginKind, label: string) {
  return { "data-origin": kind, "data-origin-label": label };
}

// Texts written by the tenant's editors, or the template for tenants from the wizard.
export function editorial(tenant: Tenant, what: string) {
  return tenant.custom ? origin("vorlage", `Vorlage · ${what}`) : origin("mandant", `Mandant · ${what}`);
}

export const CATALOGUE = origin("zentral", "Zentral · Leistungskatalog");
