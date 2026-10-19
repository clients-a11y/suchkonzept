"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SkipLink } from "@/components/SkipLink";

// The platform's own mark: one line that forks into two portals.
export function PlatformMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true" focusable="false" className="pf-mark">
      <path d="M14 1v7M6 8h16M6 8v5M22 8v5" fill="none" stroke="var(--pf-red)" strokeWidth="2" />
      <rect x="1" y="13" width="10" height="10" fill="var(--pf-ink)" />
      <rect x="17" y="13" width="10" height="10" fill="var(--pf-ink)" />
    </svg>
  );
}

const LINKS = [
  { href: "/", label: "Übersicht" },
  { href: "/neu", label: "Neuen Mandanten anlegen" },
];

export function PlatformShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="pf-root" data-shell>
      <SkipLink className="pf-skip" />
      <header className="pf-header">
        <div className="pf-container pf-header__inner">
          <Link href="/" className="pf-wordmark">
            <PlatformMark />
            <span>Portalbaukasten</span>
          </Link>
          <nav aria-label="Plattform" className="pf-nav">
            <ul>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="inhalt" tabIndex={-1} className="pf-main">
        {children}
      </main>
      <footer className="pf-footer">
        <div className="pf-container pf-footer__inner">
          <p>Klick-Dummy mit Beispieldaten. Alle Mandanten, Namen und Inhalte sind fiktiv.</p>
          <p>Kein Backend: Eigene Mandanten bleiben in diesem Browser gespeichert.</p>
        </div>
      </footer>
    </div>
  );
}
