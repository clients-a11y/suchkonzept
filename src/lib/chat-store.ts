"use client";

import type { Conversation } from "@/lib/assistant";

// The conversation per portal, for this browser tab: it survives a reload and is shared by the
// small window and the assistant page. A handover between portals waits here until the target opens.
const PREFIX = "klickdummy.chat.";
const HANDOFF = "klickdummy.chat-uebergabe";
const EVENT = "klickdummy-chat";

export type ChatChange = { tenantId?: string; source?: string; reset?: boolean };
export type PendingHandoff = { tenantId: string; question: string; from?: string; place?: string };

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function loadChat(tenantId: string): Conversation | null {
  try {
    const raw = storage()?.getItem(PREFIX + tenantId);
    return raw ? (JSON.parse(raw) as Conversation) : null;
  } catch {
    return null;
  }
}

export function saveChat(tenantId: string, conv: Conversation, source: string) {
  try {
    storage()?.setItem(PREFIX + tenantId, JSON.stringify(conv));
  } catch {
    // Storage blocked or full: the conversation lasts until reload.
  }
  window.dispatchEvent(new CustomEvent<ChatChange>(EVENT, { detail: { tenantId, source } }));
}

export function onChatChange(callback: (change: ChatChange) => void): () => void {
  const listener = (event: Event) => callback((event as CustomEvent<ChatChange>).detail ?? {});
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function saveHandoff(handoff: PendingHandoff) {
  try {
    storage()?.setItem(HANDOFF, JSON.stringify(handoff));
  } catch {
    // Without storage the link opens the assistant page instead.
  }
}

export function subscribeChat(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

// The waiting handover as text, so components can read it like a store.
export function readHandoffRaw(): string | null {
  try {
    return storage()?.getItem(HANDOFF) ?? null;
  } catch {
    return null;
  }
}

export function parseHandoff(raw: string): PendingHandoff | null {
  try {
    return JSON.parse(raw) as PendingHandoff;
  } catch {
    return null;
  }
}

export function clearHandoff() {
  try {
    storage()?.removeItem(HANDOFF);
  } catch {
    // Nothing stored.
  }
}

export function clearChats() {
  const store = storage();
  if (store) {
    for (const key of Object.keys(store)) if (key.startsWith(PREFIX) || key === HANDOFF) store.removeItem(key);
  }
  window.dispatchEvent(new CustomEvent<ChatChange>(EVENT, { detail: { reset: true } }));
}
