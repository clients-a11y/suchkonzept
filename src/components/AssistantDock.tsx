"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { AssistantChat } from "@/components/AssistantChat";
import type { ChatRequest } from "@/components/AssistantChat";
import { IconBubble, IconClose } from "@/components/Icons";
import { DOCK_MEDIA, registerDock } from "@/lib/assistant-dock";

// Small chat window at the bottom right. It does not block the page (non-modal dialog), keeps the
// conversation while the person moves through the portal and closes with Escape.
export function AssistantDock() {
  const { tenant, base } = useCurrentTenant();
  const pathname = usePathname();
  const router = useRouter();
  const ids = { panel: useId(), title: useId() };
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [used, setUsed] = useState(false);
  const [request, setRequest] = useState<ChatRequest | undefined>();

  const enabled = tenant.assistant?.enabled !== false;
  // On the assistant page the chat is already there.
  const onPage = pathname === `${base}/assistent`;

  useEffect(() => {
    if (!enabled || onPage) return;
    registerDock((question) => {
      setUsed(true);
      setOpen(true);
      if (question) setRequest((last) => ({ question, nonce: (last?.nonce ?? 0) + 1 }));
    });
    return () => registerDock(null);
  }, [enabled, onPage]);

  // Opening moves the focus into the window, to the message field.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLInputElement>(".t-chat__composer input")?.focus();
  }, [open, request]);

  if (!enabled || onPage) return null;

  const close = () => {
    setOpen(false);
    launcherRef.current?.focus();
  };

  const toggle = () => {
    if (open) return close();
    if (!window.matchMedia(DOCK_MEDIA).matches) return router.push(`${base}/assistent`);
    setUsed(true);
    setOpen(true);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    close();
  };

  return (
    <div className={pathname === base ? "t-dock t-dock--home" : "t-dock"}>
      {used && (
        <section
          ref={panelRef}
          id={ids.panel}
          role="dialog"
          aria-labelledby={ids.title}
          className="t-dock__panel"
          hidden={!open}
          onKeyDown={onKeyDown}
        >
          <div className="t-dock__head">
            <div className="t-dock__heading">
              <h2 id={ids.title} className="t-dock__title">
                Chat-Assistent
              </h2>
              <p className="t-dock__notice">Automatische Hilfe, keine Person. Lokal simuliert, ohne echte KI.</p>
            </div>
            <button
              type="button"
              className="t-dock__action"
              onClick={() => setRequest((last) => ({ restart: true, nonce: (last?.nonce ?? 0) + 1 }))}
            >
              Neu beginnen
            </button>
            <button type="button" className="t-dock__close" onClick={close} aria-label="Chat schließen">
              <IconClose size={20} />
            </button>
          </div>
          <AssistantChat variant="dock" request={request} />
        </section>
      )}
      <button
        ref={launcherRef}
        type="button"
        className="t-dock__launcher"
        aria-expanded={used ? open : false}
        aria-controls={used ? ids.panel : undefined}
        onClick={toggle}
      >
        <IconBubble size={20} />
        Chat-Assistent
      </button>
    </div>
  );
}
