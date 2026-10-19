"use client";

import { useMemo, useSyncExternalStore } from "react";

// One demo account for all portals of the platform, kept in this browser only.
// Applications from Musterland and Beispielstadt end up in the same mailbox.
const KEY = "klickdummy.konto.v1";
const EVENT = "klickdummy-konto";

export type ApplicationStatus = "eingegangen" | "in-bearbeitung" | "erledigt";

export type Application = {
  id: string;
  tenantId: string;
  tenantName: string;
  office: string;
  service: string;
  serviceTitle: string;
  submittedAt: string;
  status: ApplicationStatus;
  answers: { label: string; value: string }[];
  files: string[];
};

export type Message = {
  id: string;
  applicationId: string;
  tenantName: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
};

export type Account = { signedIn: boolean; applications: Application[]; messages: Message[] };

const EMPTY: Account = { signedIn: false, applications: [], messages: [] };

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  eingegangen: "Eingegangen",
  "in-bearbeitung": "In Bearbeitung",
  erledigt: "Erledigt",
};

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
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): Account {
  try {
    const data = JSON.parse(raw);
    return { ...EMPTY, ...data };
  } catch {
    return EMPTY;
  }
}

function write(account: Account) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(account));
  } catch {
    // Storage blocked: changes last until reload.
  }
  window.dispatchEvent(new Event(EVENT));
}

// null during server render and the first client render.
export function useAccount(): Account | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  return useMemo(() => (raw === null ? null : parse(raw)), [raw]);
}

export function signIn() {
  write({ ...parse(readRaw()), signedIn: true });
}

export function signOut() {
  write({ ...parse(readRaw()), signedIn: false });
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function caseNumber(tenantId: string): string {
  const prefix = tenantId.slice(0, 2).toUpperCase();
  const n = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${new Date().getFullYear()}-${n}`;
}

export function submitApplication(input: Omit<Application, "id" | "submittedAt" | "status">, keep: boolean): Application {
  const application: Application = { ...input, id: caseNumber(input.tenantId), submittedAt: today(), status: "eingegangen" };
  // Without an account nothing is stored: there is only the confirmation page.
  if (!keep) return application;
  const account = parse(readRaw());
  const message: Message = {
    id: `${application.id}-1`,
    applicationId: application.id,
    tenantName: input.tenantName,
    from: input.office,
    subject: `Eingangsbestätigung: ${input.serviceTitle}`,
    body: `Ihr Antrag ist bei uns eingegangen. Vorgangsnummer ${application.id}. Wir melden uns, sobald er bearbeitet ist.`,
    date: application.submittedAt,
    read: false,
  };
  write({ ...account, applications: [application, ...account.applications], messages: [message, ...account.messages] });
  return application;
}

// Demo control: moves an application one step further, the last step sends the decision.
export function advanceApplication(id: string) {
  const account = parse(readRaw());
  const app = account.applications.find((a) => a.id === id);
  if (!app || app.status === "erledigt") return;
  const next: ApplicationStatus = app.status === "eingegangen" ? "in-bearbeitung" : "erledigt";
  const applications = account.applications.map((a) => (a.id === id ? { ...a, status: next } : a));
  const message: Message =
    next === "erledigt"
      ? {
          id: `${id}-3`,
          applicationId: id,
          tenantName: app.tenantName,
          from: app.office,
          subject: `Bescheid: ${app.serviceTitle}`,
          body: "Ihr Antrag ist bearbeitet und wurde bewilligt. Der Bescheid hängt als PDF an (im Klick-Dummy nicht enthalten).",
          date: today(),
          read: false,
        }
      : {
          id: `${id}-2`,
          applicationId: id,
          tenantName: app.tenantName,
          from: app.office,
          subject: `In Bearbeitung: ${app.serviceTitle}`,
          body: "Ihr Antrag wird jetzt bearbeitet. Falls Unterlagen fehlen, melden wir uns hier.",
          date: today(),
          read: false,
        };
  write({ ...account, applications, messages: [message, ...account.messages] });
}

export function markRead(id: string) {
  const account = parse(readRaw());
  write({ ...account, messages: account.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) });
}

export function resetAccount() {
  write(EMPTY);
}
