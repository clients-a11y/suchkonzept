"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { IconBubble } from "@/components/Icons";
import { openAssistant } from "@/lib/assistant-dock";

// Entry to the chat: opens the small window on wide screens, the assistant page otherwise.
export function ChatButton({ question, className, children }: { question?: string; className?: string; children: ReactNode }) {
  const href = question ? `/assistent?frage=${encodeURIComponent(question)}` : "/assistent";
  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (openAssistant(question)) event.preventDefault();
      }}
    >
      <IconBubble size={20} />
      {children}
    </Link>
  );
}
