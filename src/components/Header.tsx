"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { RefObject } from "react";
import { IconBubble, IconClose, IconMenu, IconSearch, IconUser } from "@/components/Icons";
import { Wordmark } from "@/components/Wordmark";
import { CHAT_IN_PORTAL, SITE } from "@/data/site";
import { useVariant } from "@/lib/variant-store";
import { useAccount } from "@/lib/account-store";

// Escape closes, focus goes back to the button. A new page closes it too.
function useDisclosure(buttonRef: RefObject<HTMLButtonElement | null>) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedOn, setOpenedOn] = useState(pathname);
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, buttonRef]);
  return [open, setOpen] as const;
}

// The page itself, or a page below it ("Leistungen" stays marked on a service page).
function current(pathname: string, href: string): "page" | "true" | undefined {
  if (pathname === href) return "page";
  return href !== "/" && pathname.startsWith(`${href}/`) ? "true" : undefined;
}

// Account link: "Anmelden" or the mailbox with the number of unread messages.
function AccountLink() {
  const account = useAccount();
  const unread = account?.messages.filter((m) => !m.read).length ?? 0;
  const signedIn = Boolean(account?.signedIn);
  return (
    <Link href="/konto" className="t-tool">
      <IconUser />
      <span className="t-tool__text">{signedIn ? "Postfach" : "Anmelden"}</span>
      {signedIn && unread > 0 && (
        <span className="t-tool__badge">
          {unread}
          <span className="visually-hidden"> ungelesen</span>
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const [open, setOpen] = useDisclosure(buttonRef);
  const close = () => setOpen(false);

  // The menu lies over the page: a click or tap outside the header closes it.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, setOpen]);

  const variant = useVariant();

  return (
    <header className="t-header" ref={headerRef}>
      <div className="t-container t-masthead">
        <Link href="/" className="t-brand" aria-label={`${SITE.name}, zur Startseite`}>
          <Wordmark />
        </Link>
        <div className="t-masthead__tools">
          <Link href={variant === 2 ? "/ergebnisse" : "/suche"} className="t-tool">
            <IconSearch />
            <span className="t-tool__text">Suche</span>
          </Link>
          <AccountLink />
          <button
            ref={buttonRef}
            type="button"
            className="t-tool t-menu-button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(!open)}
          >
            {open ? <IconClose /> : <IconMenu />}
            <span className="t-tool__text">Menü</span>
          </button>
        </div>
      </div>
      <nav aria-label="Hauptnavigation" className="t-nav" data-open={open}>
        <div className="t-container">
          <ul id={menuId} className="t-nav__list" data-open={open}>
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-nav__link" aria-current={current(pathname, item.href)} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
            {/* On phones the floating chat button would cover the page: the chat sits in the menu. */}
            {CHAT_IN_PORTAL && (
              <li className="t-nav__chat">
                <Link href="/assistent" className="t-nav__link" aria-current={current(pathname, "/assistent")} onClick={close}>
                  <IconBubble size={18} />
                  Chat-Assistent
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
