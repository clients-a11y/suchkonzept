"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { Emblem } from "@/components/Emblem";
import { IconBook, IconBubble, IconClose, IconGlobe, IconHand, IconMenu, IconSearch, IconUser } from "@/components/Icons";
import { useAccount } from "@/lib/account-store";
import { languageSlug } from "@/data/content";
import type { NavItem } from "@/lib/types";
import { origin } from "@/lib/origin";

// Escape closes, focus goes back to the button. A hidden route resets to closed.
function useDisclosure(buttonRef: RefObject<HTMLButtonElement | null>) {
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => () => setOpen(false), []);
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

type NavListProps = {
  items: NavItem[];
  base: string;
  id: string;
  open: boolean;
  onNavigate: () => void;
  isCurrent?: (href: string) => boolean;
};

function NavList({ items, base, id, open, onNavigate, isCurrent }: NavListProps) {
  return (
    <ul id={id} className="t-nav__list" data-open={open}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={base + item.href}
            className="t-nav__link"
            aria-current={isCurrent?.(item.href) ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Reads the query string, so it sits in its own Suspense boundary and the rest stays static.
function CurrentNavList(props: Omit<NavListProps, "isCurrent">) {
  const pathname = usePathname();
  const params = useSearchParams();
  const isCurrent = (href: string) => {
    const url = new URL(props.base + href, "http://x");
    if (url.pathname !== pathname) return false;
    for (const [key, value] of url.searchParams) {
      if (params.get(key) !== value) return false;
    }
    return true;
  };
  return <NavList {...props} isCurrent={isCurrent} />;
}

function LanguageSwitch() {
  const { tenant, base } = useCurrentTenant();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [open, setOpen] = useDisclosure(buttonRef);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, setOpen]);

  const others = tenant.languages.filter((name) => name !== "Deutsch");
  return (
    <div className="t-lang" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="t-topbar__link"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(!open)}
      >
        <IconGlobe size={18} />
        <span>
          <span className="t-lang__prefix">Sprache: </span>Deutsch
        </span>
      </button>
      <ul id={listId} className="t-lang__list" hidden={!open}>
        <li>
          <Link href={base} aria-current="true" onClick={() => setOpen(false)}>
            Deutsch
          </Link>
        </li>
        {others.map((name) => {
          const slug = languageSlug(name);
          if (!slug) return null;
          const code = slug.replace("sprache-", "");
          return (
            <li key={name}>
              <Link href={`${base}/seite/${slug}`} lang={code} hrefLang={code} onClick={() => setOpen(false)}>
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Account link: "Anmelden" or the mailbox with the number of unread messages.
function AccountLink() {
  const { base } = useCurrentTenant();
  const account = useAccount();
  const unread = account?.messages.filter((m) => !m.read).length ?? 0;
  const signedIn = Boolean(account?.signedIn);
  return (
    <Link href={`${base}/konto`} className="t-tool">
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
  const { tenant, base } = useCurrentTenant();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const [open, setOpen] = useDisclosure(buttonRef);

  const meta: { href: string; label: string; icon: ReactNode }[] = [];
  if (tenant.meta.dgs) meta.push({ href: "/seite/gebaerdensprache", label: "Gebärdensprache", icon: <IconHand size={18} /> });
  if (tenant.meta.ls) meta.push({ href: "/seite/leichte-sprache", label: "Leichte Sprache", icon: <IconBook size={18} /> });
  if (tenant.meta.es) meta.push({ href: "/seite/einfache-sprache", label: "Einfache Sprache", icon: <IconBubble size={18} /> });
  const multilingual = tenant.languages.length > 1;

  const listProps = { items: tenant.nav, base, id: menuId, open, onNavigate: () => setOpen(false) };

  return (
    <header className="t-header" {...origin("mandant", "Mandant · Einstellung: Name, Emblem, Menü")}>
      {(meta.length > 0 || multilingual) && (
        <div className="t-topbar">
          <div className="t-container t-topbar__inner">
            {meta.length > 0 && (
              <ul className="t-topbar__list">
                {meta.map((item) => (
                  <li key={item.href}>
                    <Link href={base + item.href} className="t-topbar__link">
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {multilingual && <LanguageSwitch />}
          </div>
        </div>
      )}
      <div className="t-container t-masthead">
        <Link href={base} className="t-brand">
          <Emblem tenant={tenant} />
          <span className="t-brand__text">
            <span className="t-brand__name">{tenant.name}</span>
            <span className="t-brand__tagline">{tenant.tagline}</span>
          </span>
        </Link>
        <div className="t-masthead__tools">
          <Link href={`${base}/suche`} className="t-tool">
            <IconSearch />
            <span className="t-tool__text">Suche</span>
          </Link>
          <AccountLink />
          <button
            ref={buttonRef}
            type="button"
            className="t-tool t-menu-button"
            aria-label="Menü"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen(!open)}
          >
            {open ? <IconClose /> : <IconMenu />}
            <span className="t-tool__text" aria-hidden="true">Menü</span>
          </button>
        </div>
      </div>
      <nav aria-label="Hauptnavigation" className="t-nav">
        <div className="t-container">
          <Suspense fallback={<NavList {...listProps} />}>
            <CurrentNavList {...listProps} />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
