"use client";

import Link from "next/link";
import { useCurrentTenant } from "@/components/TenantContext";

type Crumb = { label: string; href: string; lang?: string };

// Full path from the start page. Hrefs are relative to the tenant base.
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const { base } = useCurrentTenant();
  const all: Crumb[] = [{ label: "Startseite", href: "" }, ...items];
  return (
    <nav aria-label="Brotkrumen" className="t-crumbs">
      <ol>
        {all.map((item, index) => {
          const last = index === all.length - 1;
          return (
            <li key={item.href || "start"}>
              <Link href={base + item.href} aria-current={last ? "page" : undefined} lang={item.lang}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
