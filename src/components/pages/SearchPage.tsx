"use client";

import Link from "next/link";
import Form from "next/form";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useId, useRef } from "react";
import type { KeyboardEvent } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IconSearch, IconSparkle } from "@/components/Icons";
import { allInformation, allServices, serviceHit } from "@/lib/search";
import { smartSearch } from "@/lib/smart-search";
import type { Hit } from "@/lib/search";
import { pluralize } from "@/lib/format";
import { useDocumentTitle } from "@/lib/use-document-title";

type TabKey = "informationen" | "leistungen";

function SearchForm({ q }: { q: string }) {
  const { base } = useCurrentTenant();
  const inputId = useId();
  return (
    <Form action={`${base}/suche`} role="search" className="t-searchform">
      <label htmlFor={inputId}>Suchbegriff</label>
      <div className="t-searchform__row">
        <input key={q} id={inputId} className="t-input" name="q" type="search" defaultValue={q} autoComplete="off" />
        <button type="submit" className="t-btn t-btn--primary">
          <IconSearch />
          Suchen
        </button>
      </div>
    </Form>
  );
}

function HitList({ hits }: { hits: Hit[] }) {
  const { base } = useCurrentTenant();
  return (
    <ol className="t-hits">
      {hits.map((hit) => (
        <li key={hit.key} className="t-hit">
          <p className="t-hit__kind">{hit.kind}</p>
          <h3 className="t-hit__title">
            <Link href={base + hit.href}>{hit.title}</Link>
          </h3>
          <p className="t-hit__text">{hit.text}</p>
        </li>
      ))}
    </ol>
  );
}

function SearchResults() {
  const { tenant, base } = useCurrentTenant();
  const params = useSearchParams();
  const pathname = usePathname();
  const tabsId = useId();
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({ informationen: null, leistungen: null });

  const q = (params.get("q") ?? "").trim();
  const smart = q ? smartSearch(tenant, q) : undefined;
  const results: Record<TabKey, Hit[]> = {
    informationen: smart ? smart.info : allInformation(tenant),
    leistungen: smart ? smart.services.map((h) => serviceHit(h.service)) : allServices(),
  };

  // Without an explicit tab, a clear request for a service opens the services tab.
  const requested = params.get("tab");
  const portalDefault: TabKey = tenant.type === "service" ? "leistungen" : "informationen";
  const smartDefault: TabKey =
    smart && results.leistungen.length > 0 && (smart.answer || results.informationen.length === 0) ? "leistungen" : portalDefault;
  const tab: TabKey = requested === "leistungen" || requested === "informationen" ? requested : smartDefault;
  const order: TabKey[] = ["informationen", "leistungen"];
  const labels: Record<TabKey, string> = { informationen: "Informationen", leistungen: "Leistungen" };
  const total = results.informationen.length + results.leistungen.length;

  // The query string is the state: tabs update it without a new history entry.
  const select = (next: TabKey, focus = false) => {
    const search = new URLSearchParams(params.toString());
    search.set("tab", next);
    window.history.replaceState(null, "", `${pathname}?${search.toString()}`);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = order.indexOf(tab);
    let next: TabKey | undefined;
    if (event.key === "ArrowRight") next = order[(index + 1) % order.length];
    if (event.key === "ArrowLeft") next = order[(index - 1 + order.length) % order.length];
    if (event.key === "Home") next = order[0];
    if (event.key === "End") next = order[order.length - 1];
    if (!next) return;
    event.preventDefault();
    select(next, true);
  };

  const hits = results[tab];
  const other = order.find((key) => key !== tab)!;

  return (
    <>
      <SearchForm q={q} />
      <p className="t-search__summary" role="status">
        {q ? `${pluralize(total, "Treffer", "Treffer")} für „${q}“` : "Kein Suchbegriff: Sie sehen alle Inhalte."}
      </p>
      {smart?.correction && smart.correction.toLowerCase() !== q.toLowerCase() && (
        <p className="t-correction">
          Meinten Sie: <Link href={`${base}/suche?q=${encodeURIComponent(smart.correction)}`}>{smart.correction}</Link>?
        </p>
      )}
      {smart?.answer && (
        <div className="t-answer">
          <p className="t-answer__eyebrow">
            <IconSparkle size={18} />
            Das passt am besten zu Ihrer Anfrage
          </p>
          <h2 className="t-answer__title">
            <Link href={`${base}/leistungen/${smart.answer.slug}`}>{smart.answer.title}</Link>
          </h2>
          <p>{smart.answer.summary}</p>
          <ul className="t-answer__facts">
            <li className={smart.answer.online ? "t-badge t-badge--online" : "t-badge"}>
              {smart.answer.online ? "Online möglich" : "Termin vor Ort"}
            </li>
            <li>Kosten: {smart.answer.costs}</li>
            <li>Dauer: {smart.answer.duration}</li>
          </ul>
          {smart.related.length > 0 && (
            <p className="t-answer__related">
              Das brauchen Sie oft auch:{" "}
              {smart.related.map((s, i) => (
                <span key={s.slug}>
                  {i > 0 && ", "}
                  <Link href={`${base}/leistungen/${s.slug}`}>{s.title}</Link>
                </span>
              ))}
            </p>
          )}
          <p className="t-answer__note">Vorschlag aus Ihren Worten. Im Klick-Dummy lokal simuliert, ohne echte KI.</p>
        </div>
      )}
      <div role="tablist" aria-label="Ergebnisse nach Art" className="t-tabs">
        {order.map((key) => (
          <button
            key={key}
            ref={(node) => {
              tabRefs.current[key] = node;
            }}
            type="button"
            role="tab"
            id={`${tabsId}-${key}-tab`}
            aria-selected={tab === key}
            aria-controls={`${tabsId}-${key}-panel`}
            tabIndex={tab === key ? 0 : -1}
            className="t-tab"
            onClick={() => select(key)}
            onKeyDown={onKeyDown}
          >
            {labels[key]} <span className="t-tab__count">{results[key].length}</span>
          </button>
        ))}
      </div>
      {order.map((key) => (
        <div
          key={key}
          role="tabpanel"
          id={`${tabsId}-${key}-panel`}
          aria-labelledby={`${tabsId}-${key}-tab`}
          hidden={tab !== key}
          tabIndex={0}
          className="t-tabpanel"
        >
          <h2 className="visually-hidden">{labels[key]}</h2>
          {key === tab &&
            (hits.length > 0 ? (
              <HitList hits={hits} />
            ) : (
              <div className="t-empty">
                <p>
                  Keine {labels[key]} zu „{q}“.
                  {results[other].length > 0 &&
                    ` Unter ${labels[other]} gibt es ${pluralize(results[other].length, "Treffer", "Treffer")}.`}
                </p>
                {results[other].length > 0 ? (
                  <button type="button" className="t-btn" onClick={() => select(other, true)}>
                    {labels[other]} anzeigen
                  </button>
                ) : (
                  <p>Prüfen Sie die Schreibweise oder versuchen Sie ein allgemeineres Wort, zum Beispiel „Ausweis“.</p>
                )}
              </div>
            ))}
        </div>
      ))}
    </>
  );
}

export function SearchPage() {
  const { tenant } = useCurrentTenant();
  useDocumentTitle(`Suche · ${tenant.name}`);
  return (
    <div className="t-container t-page">
      <Breadcrumb items={[{ label: "Suche", href: "/suche" }]} />
      <h1 className="t-h1">Suche</h1>
      <Suspense fallback={<p className="t-search__summary">Suche wird geladen …</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
