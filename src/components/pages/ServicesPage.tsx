"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ServiceCard } from "@/components/Cards";
import { IconArrow } from "@/components/Icons";
import { SERVICES } from "@/data/services";
import { pluralize } from "@/lib/format";
import { sortedServices } from "@/lib/search";
import type { Audience, Service } from "@/lib/types";

const FILTERS: { value?: Audience; label: string }[] = [
  { label: "Alle" },
  { value: "privat", label: "Für Privatpersonen" },
  { value: "unternehmen", label: "Für Unternehmen" },
];

// A to Z, one group per first letter.
function byLetter(list: Service[]): [string, Service[]][] {
  const groups = new Map<string, Service[]>();
  for (const service of sortedServices(list)) {
    const letter = service.title[0].toUpperCase();
    groups.set(letter, [...(groups.get(letter) ?? []), service]);
  }
  return [...groups];
}

function ServiceList() {
  const params = useSearchParams();
  const requested = params.get("fuer");
  const audience = FILTERS.find((f) => f.value && f.value === requested)?.value;
  const list = audience ? SERVICES.filter((s) => s.audience.includes(audience)) : SERVICES;
  const label = audience ? FILTERS.find((f) => f.value === audience)?.label : undefined;

  return (
    <>
      <nav aria-label="Leistungen filtern" className="t-pottabs">
        <ul>
          {FILTERS.map((filter) => (
            <li key={filter.label}>
              <Link
                href={filter.value ? `/leistungen?fuer=${filter.value}` : "/leistungen"}
                className="t-pottab"
                aria-current={filter.value === audience ? "page" : undefined}
              >
                {filter.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="t-count" role="status">
        {pluralize(list.length, "Leistung", "Leistungen")}
        {label ? ` ${label.replace("Für", "für")}` : ""}
      </p>
      {byLetter(list).map(([letter, services]) => (
        <section key={letter} className="t-letter">
          <h2 className="t-letter__title">
            <span className="visually-hidden">Buchstabe </span>
            {letter}
          </h2>
          <ul className="t-cards t-cards--3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

export function ServicesPage() {
  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb items={[{ label: "Leistungen", href: "/leistungen" }]} />
          <h1 className="t-h1">Leistungen A bis Z</h1>
          <p className="t-lead">Alle Leistungen von Land und Gemeinden in Musterland. Wer zuständig ist, steht auf der Seite jeder Leistung.</p>
        </div>
      </div>
      <div className="t-container t-page">
        <Suspense fallback={<p className="t-count">Leistungen werden geladen …</p>}>
          <ServiceList />
        </Suspense>
        <p className="t-actions">
          <Link href="/seite/lebenslagen" className="t-more">
            Leistungen nach Lebenslagen <IconArrow size={18} />
          </Link>
        </p>
      </div>
    </>
  );
}
