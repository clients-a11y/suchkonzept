"use client";

import { useMemo, useSyncExternalStore } from "react";
import { DEFAULT_CONFIG } from "@/data/test-scenarios";
import type { TestConfig } from "@/data/test-scenarios";

// The settings of the test scenarios, in this browser: what each scenario is set to, and the one the
// prototype runs with since the last start.
const KEY = "suchkonzept.testeinstellungen.v1";
const EVENT = "suchkonzept-testeinstellungen";

// task: the instruction page, while a test person works on it.
type Stored = { active?: TestConfig; scenarios?: Record<number, TestConfig>; task?: string };

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
    return raw ? (JSON.parse(raw) as Stored) : {};
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

export function useScenarioConfig(id: number): TestConfig {
  return useStored().scenarios?.[id] ?? DEFAULT_CONFIG;
}

export function saveScenarioConfig(id: number, config: TestConfig) {
  const stored = parse(read());
  write({ ...stored, scenarios: { ...stored.scenarios, [id]: config } });
}

export function useTaskHref(): string | undefined {
  return useStored().task;
}

export function activateConfig(config: TestConfig, task?: string) {
  write({ ...parse(read()), active: config, task });
}
