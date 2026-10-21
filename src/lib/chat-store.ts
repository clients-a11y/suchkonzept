"use client";

import type { Conversation } from "@/lib/assistant";

// The conversation for this browser tab: it survives a reload and is shared by the small window
// and the assistant page.
const KEY = "suchkonzept.chat.v1";
const EVENT = "suchkonzept-chat";

export type ChatChange = { source?: string; reset?: boolean };

function storage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function loadChat(): Conversation | null {
  try {
    const raw = storage()?.getItem(KEY);
    return raw ? (JSON.parse(raw) as Conversation) : null;
  } catch {
    return null;
  }
}

export function saveChat(conv: Conversation, source: string) {
  try {
    storage()?.setItem(KEY, JSON.stringify(conv));
  } catch {
    // Storage blocked or full: the conversation lasts until reload.
  }
  window.dispatchEvent(new CustomEvent<ChatChange>(EVENT, { detail: { source } }));
}

export function onChatChange(callback: (change: ChatChange) => void): () => void {
  const listener = (event: Event) => callback((event as CustomEvent<ChatChange>).detail ?? {});
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function clearChat() {
  try {
    storage()?.removeItem(KEY);
  } catch {
    // Nothing stored.
  }
  window.dispatchEvent(new CustomEvent<ChatChange>(EVENT, { detail: { reset: true } }));
}
