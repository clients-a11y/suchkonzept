"use client";

import { useSyncExternalStore } from "react";
import { PLACES, findPlace } from "@/data/places";
import type { Place } from "@/data/places";
import { SITE } from "@/data/site";

// The place a visitor entered is remembered in this browser, so the service pages, the search and
// the assistant agree on "your place".
const KEY = "suchkonzept.ort.v1";
const EVENT = "suchkonzept-ort";

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

export function usePlace(): Place | undefined {
  return findPlace(usePlaceId());
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

function normalize(value: string): string {
  return value.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").trim();
}

// Postcode or the beginning of a place name.
export function findPlaces(query: string, places: Place[] = PLACES): Place[] {
  const q = normalize(query);
  if (!q) return [];
  if (/^\d{3,5}$/.test(q)) {
    const n = Number(q.padEnd(5, "0"));
    const exact = q.length === 5;
    return places.filter((p) => {
      if (exact) return n >= p.plz[0] && n <= p.plz[1];
      return String(p.plz[0]).startsWith(q) || String(p.plz[1]).startsWith(q);
    });
  }
  return places.filter((p) => normalize(p.name).startsWith(q) || normalize(p.name).includes(` ${q}`));
}

// A field for postcode or place, on sending: the one place meant, or what is wrong with the entry.
export function checkPlace(text: string): { place?: Place; matches: Place[]; problem: string } {
  const value = text.trim();
  const digits = /^\d+$/.test(value);
  if (digits ? value.length !== 5 : value.length < 3) {
    return { matches: [], problem: "Bitte geben Sie eine Postleitzahl mit fünf Ziffern oder einen Ort ein." };
  }
  const matches = findPlaces(value);
  if (matches.length === 1) return { place: matches[0], matches, problem: "" };
  if (matches.length > 1) return { matches, problem: `Zu „${value}“ passen mehrere Orte. Bitte wählen Sie Ihren Ort.` };
  return { matches, problem: digits ? `Die Postleitzahl ${value} gehört zu keinem Ort in ${SITE.region}.` : `Einen Ort „${value}“ kennen wir in ${SITE.region} nicht.` };
}
