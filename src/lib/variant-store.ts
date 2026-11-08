"use client";

import { useSyncExternalStore } from "react";

// Which search flow the user test shows: 1 asks before the results, 2 is the one results page of Annahme 1.
export type Variant = 1 | 2;

const KEY = "suchkonzept.variante.v1";
const EVENT = "suchkonzept-variante";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getVariant(): Variant {
  try {
    return window.localStorage.getItem(KEY) === "2" ? 2 : 1;
  } catch {
    return 1;
  }
}

export function useVariant(): Variant {
  return useSyncExternalStore<Variant>(subscribe, getVariant, () => 1);
}

export function setVariant(variant: Variant) {
  try {
    window.localStorage.setItem(KEY, String(variant));
  } catch {
    // Storage blocked: the prototype stays on variant 1.
  }
  window.dispatchEvent(new Event(EVENT));
}
