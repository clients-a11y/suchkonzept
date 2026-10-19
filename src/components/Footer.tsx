"use client";

import Link from "next/link";
import { useCurrentTenant } from "@/components/TenantContext";

export function Footer() {
  const { tenant, base } = useCurrentTenant();
  return (
    <footer className="t-footer">
      <div className="t-container t-footer__grid">
        {tenant.footer.map((column) => (
          <div key={column.title} className="t-footer__col">
            <h2 className="t-footer__title">{column.title}</h2>
            <ul className="t-footer__links">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={base + link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="t-footer__col t-footer__contact">
          <h2 className="t-footer__title">Kontakt</h2>
          <address>
            <strong>{tenant.contact.office}</strong>
            <br />
            {tenant.contact.address}
            <br />
            Telefon {tenant.contact.phone}
            <br />
            {tenant.contact.hours}
          </address>
        </div>
      </div>
      <div className="t-container">
        <div className="t-footer__note">
          <p>Klick-Dummy mit Beispieldaten. {tenant.name} und alle Inhalte sind fiktiv.</p>
          <p>
            Gebaut mit dem <Link href="/">Portalbaukasten</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
