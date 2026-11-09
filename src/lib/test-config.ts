"use client";

import { useMemo, useSyncExternalStore } from "react";
import { DEFAULT_CONFIG, STARTER_SCENARIOS } from "@/data/test-scenarios";
import type { SavedScenario, TestConfig } from "@/data/test-scenarios";

// The test scenarios, in this browser: the saved ones, and the settings the prototype runs with since the last start.
const KEY = "suchkonzept.testeinstellungen.v1";
const EVENT = "suchkonzept-testeinstellungen";

// saved: missing until something is saved or deleted, then the starter scenarios count.
// task: the instruction page, while a test person works on it. team: this browser has opened a scenario page.
type Stored = { active?: TestConfig; saved?: SavedScenario[]; task?: string; team?: boolean };

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
    return {
      ...stored,
      active: stored.active && { ...DEFAULT_CONFIG, ...stored.active },
      saved: stored.saved?.map((s) => ({ ...s, config: { ...DEFAULT_CONFIG, ...s.config } })),
    };
  } catch {
    return {};
  }
}

function write(next: Stored) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the prototype runs with the default settings.
  }
  window.dispatchEvent(new Event(EVENT));
}

function useStored(): Stored {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  return useMemo(() => parse(raw), [raw]);
}

export function useTestConfig(): TestConfig {
  return useStored().active ?? DEFAULT_CONFIG;
}

export function useSavedScenarios(): SavedScenario[] {
  return useStored().saved ?? STARTER_SCENARIOS;
}

export function saveScenario(scenario: SavedScenario) {
  const stored = parse(read());
  write({ ...stored, saved: [scenario, ...(stored.saved ?? STARTER_SCENARIOS)] });
}

export function deleteScenario(id: string) {
  const stored = parse(read());
  write({ ...stored, saved: (stored.saved ?? STARTER_SCENARIOS).filter((s) => s.id !== id) });
}

// False while a page from the server is taken over: until then the browser's scenarios are not known yet.
export function useStoreReady(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function useTaskHref(): string | undefined {
  return useStored().task;
}

export function useIsTeam(): boolean {
  return Boolean(useStored().team);
}

export function markTeam() {
  const stored = parse(read());
  if (!stored.team) write({ ...stored, team: true });
}

export function activateConfig(config: TestConfig, task?: string) {
  write({ ...parse(read()), active: config, task });
}
