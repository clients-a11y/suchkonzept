"use client";

import { useSyncExternalStore } from "react";
import { PLACES } from "@/data/content";
import type { Place } from "@/data/content";
import type { Tenant } from "@/lib/types";

// The place a visitor entered is remembered in this browser and shared by all portals,
// so the Land portal and a city portal agree on "your place".
const KEY = "klickdummy.ort.v1";
const EVENT = "klickdummy-ort";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function read(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function usePlaceId(): string {
  return useSyncExternalStore(subscribe, read, () => "");
}

export function setPlaceId(id: string) {
  try {
    if (id) window.localStorage.setItem(KEY, id);
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the choice lasts until reload.
  }
  window.dispatchEvent(new Event(EVENT));
}

// Fixed places plus city and municipality portals created in the wizard.
export function allPlaces(custom: Tenant[]): Place[] {
  const fromWizard: Place[] = custom
    .filter((t) => t.type === "service")
    .map((t) => ({
      id: `mandant-${t.id}`,
      name: t.name,
      office: t.contact.office,
      address: t.contact.address,
      phone: t.contact.phone,
      tenant: t.id,
    }));
  return [...PLACES, ...fromWizard];
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").trim();
}

// Postcode or the beginning of a place name.
export function findPlaces(query: string, places: Place[]): Place[] {
  const q = normalize(query);
  if (!q) return [];
  if (/^\d{3,5}$/.test(q)) {
    const n = Number(q.padEnd(5, "0"));
    const exact = q.length === 5;
    return places.filter((p) => {
      if (!p.plz) return false;
      if (exact) return n >= p.plz[0] && n <= p.plz[1];
      return String(p.plz[0]).startsWith(q) || String(p.plz[1]).startsWith(q);
    });
  }
  return places.filter((p) => normalize(p.name).startsWith(q) || normalize(p.name).includes(` ${q}`));
}
