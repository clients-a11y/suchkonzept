"use client";

import { useMemo, useSyncExternalStore } from "react";
import { DEFAULT_CONFIG } from "@/data/test-cases";
import type { TestConfig } from "@/data/test-cases";

// The variant of a test case the prototype runs with since the last start, in this browser.
const KEY = "suchkonzept.testeinstellungen.v2";
const EVENT = "suchkonzept-testeinstellungen";

type Stored = { active?: TestConfig };

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

function parse(raw: string): Stored {
  try {
    if (!raw) return {};
    const stored = JSON.parse(raw) as Stored;
    // Saved before a setting existed: it counts with its default.
    return { active: stored.active && { ...DEFAULT_CONFIG, ...stored.active } };
  } catch {
    return {};
  }
}

// Undefined until a variant has been started in this browser.
export function useActiveConfig(): TestConfig | undefined {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  return useMemo(() => parse(raw).active, [raw]);
}

export function useTestConfig(): TestConfig {
  return useActiveConfig() ?? DEFAULT_CONFIG;
}

export function activateConfig(config: TestConfig) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ active: config } satisfies Stored));
  } catch {
    // Storage blocked: the prototype runs with the default settings.
  }
  window.dispatchEvent(new Event(EVENT));
}
