"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { TENANTS, findSeedTenant } from "@/data/tenants";
import type { FontKey, Tenant, Tokens } from "@/lib/types";
import { onColor, tint } from "@/lib/color";

// Tenants created in the wizard live only in this browser (no backend yet).
const KEY = "klickdummy.mandanten.v1";
const EVENT = "klickdummy-mandanten";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw: string | null): Tenant[] {
  if (raw === null) return [];
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Returns null during server render and the first client render.
export function useCustomTenants(): Tenant[] | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  return useMemo(() => (raw === null ? null : parse(raw)), [raw]);
}

export function saveCustomTenant(tenant: Tenant) {
  const list = parse(readRaw()).filter((t) => t.id !== tenant.id);
  list.push(tenant);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage blocked: the tenant still shows until reload.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function removeCustomTenant(id: string) {
  const list = parse(readRaw()).filter((t) => t.id !== id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useAllTenants(): Tenant[] {
  const custom = useCustomTenants();
  return useMemo(() => [...TENANTS, ...(custom ?? [])], [custom]);
}

// "loading" while the browser store is not read yet, undefined if unknown.
export function useTenant(id: string): Tenant | undefined | "loading" {
  const custom = useCustomTenants();
  const seed = findSeedTenant(id);
  if (seed) return seed;
  if (custom === null) return "loading";
  return custom.find((t) => t.id === id);
}

const FONT_VAR: Record<FontKey, string> = {
  serif: "var(--f-serif)",
  sans: "var(--f-sans)",
  hyper: "var(--f-hyper)",
};

export const FONT_LABEL: Record<FontKey, string> = {
  serif: "Source Serif 4",
  sans: "Public Sans",
  hyper: "Atkinson Hyperlegible",
};

export function themeStyle(tokens: Tokens): CSSProperties {
  return {
    "--t-primary": tokens.primary,
    "--t-on-primary": onColor(tokens.primary),
    "--t-primary-tint": tint(tokens.primary, 0.88),
    "--t-accent": tokens.accent,
    "--t-on-accent": onColor(tokens.accent),
    "--t-surface": tokens.surface,
    "--t-heading": FONT_VAR[tokens.headingFont],
    "--t-body": FONT_VAR[tokens.bodyFont],
    "--t-radius": `${tokens.radius}px`,
  } as CSSProperties;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
