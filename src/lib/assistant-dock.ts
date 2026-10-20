"use client";

// Connects entry points (search, start page) with the small chat window. On narrow screens a
// small window would cover the page, so there the entry points lead to the assistant page.
export const DOCK_MEDIA = "(min-width: 40rem)";

type Opener = (question?: string, place?: string) => void;
let opener: Opener | null = null;

export function registerDock(fn: Opener | null) {
  opener = fn;
}

// True if the window took over; otherwise the caller's link to the assistant page applies.
// A place entered just before (in the search) counts as confirmed in the conversation.
export function openAssistant(question?: string, place?: string): boolean {
  if (!opener || !window.matchMedia(DOCK_MEDIA).matches) return false;
  opener(question, place);
  return true;
}
