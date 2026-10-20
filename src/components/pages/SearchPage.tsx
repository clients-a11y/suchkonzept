"use client";

import Link from "next/link";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Suspense, useId } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IconArrow, IconCheck, IconSearch, IconSparkle } from "@/components/Icons";
import { allInformation, allServices, serviceHit } from "@/lib/search";
import { searchInformation, searchServices } from "@/lib/smart-search";
import { POT_LABEL, routeQuery } from "@/lib/search-router";
import type { Pot } from "@/lib/search-router";
import type { Hit } from "@/lib/search";
import { pluralize } from "@/lib/format";
import { useDocumentTitle } from "@/lib/use-document-title";
import { origin } from "@/lib/origin";

const OTHER: Record<Pot, Pot> = { leistungen: "informationen", informationen: "leistungen" };

function searchHref(base: string, q: string, pot?: Pot): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (pot) params.set("in", pot);
  return `${base}/suche?${params.toString()}`;
}

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
    <ol className="t-hits" {...origin("zentral", "Zentral · Plattform: Suche")}>
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

// When the result is unclear, the guided assistant can narrow it down by asking.
function AssistantHint({ q }: { q: string }) {
  const { tenant, base } = useCurrentTenant();
  if (tenant.assistant?.enabled === false) return null;
  return (
    <div className="t-assisthint" {...origin("zentral", "Zentral · Plattform: Assistent")}>
      <p>Nicht eindeutig? Der Chat-Assistent fragt nach und grenzt Ihr Anliegen Schritt für Schritt ein.</p>
      <Link href={`${base}/assistent?frage=${encodeURIComponent(q)}`} className="t-more">
        Mit dem Assistenten weiterfragen <IconArrow size={18} />
      </Link>
    </div>
  );
}

// The search switch could not decide: one question, two answers.
function PotQuestion({ q }: { q: string }) {
  const { base } = useCurrentTenant();
  const titleId = useId();
  return (
    <section className="t-route" aria-labelledby={titleId} {...origin("zentral", "Zentral · Plattform: Suchweiche")}>
      <h2 id={titleId} className="t-h2">
        Was suchen Sie?
      </h2>
      <p>„{q}“ kann beides sein. Die Suche schaut immer in einem Bereich nach.</p>
      <ul className="t-route__choices">
        <li>
          <Link href={searchHref(base, q, "leistungen")} className="t-route__choice">
            <span className="t-route__title">Etwas beantragen oder erledigen</span>
            <span className="t-route__text">Leistungen wie Ausweis, Ummeldung oder Förderung</span>
          </Link>
        </li>
        <li>
          <Link href={searchHref(base, q, "informationen")} className="t-route__choice">
            <span className="t-route__title">Informationen und Meldungen</span>
            <span className="t-route__text">Nachrichten, Projekte, Ansprechpersonen und Seiten</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

function SearchResults() {
  const { tenant, base } = useCurrentTenant();
  const params = useSearchParams();

  const q = (params.get("q") ?? "").trim();
  // "tab" is the older name and still used by links such as "Leistungen A bis Z".
  const requested = params.get("in") ?? params.get("tab");
  const chosen: Pot | undefined = requested === "leistungen" || requested === "informationen" ? requested : undefined;
  const route = q && !chosen ? routeQuery(q) : undefined;
  const portalDefault: Pot = tenant.type === "service" ? "leistungen" : "informationen";
  const pot: Pot | undefined = chosen ?? (q ? route?.pot : portalDefault);

  if (!pot) {
    return (
      <>
        <SearchForm q={q} />
        <p className="t-search__summary" role="status">
          Für „{q}“ bitte einen Suchbereich wählen.
        </p>
        <PotQuestion q={q} />
        <AssistantHint q={q} />
      </>
    );
  }

  // Exactly one request, to exactly one pot.
  const services = pot === "leistungen" && q ? searchServices(q) : undefined;
  const hits: Hit[] =
    pot === "leistungen"
      ? services
        ? services.services.map((h) => serviceHit(h.service))
        : allServices()
      : q
        ? searchInformation(tenant, q)
        : allInformation(tenant);
  const answer = services?.answer;
  const other = OTHER[pot];
  const reasons = route?.signals.filter((s) => s.pot === pot).map((s) => `„${s.word}“`) ?? [];
  if (route?.catalogue && pot === "leistungen") reasons.push("einem Treffer im Leistungskatalog");
  const because = reasons.length > 1 ? `${reasons.slice(0, -1).join(", ")} und ${reasons[reasons.length - 1]}` : reasons[0];

  return (
    <>
      <SearchForm q={q} />
      <p className="t-search__summary" role="status">
        {q
          ? `${pluralize(hits.length, "Treffer", "Treffer")} für „${q}“ in ${POT_LABEL[pot]}`
          : `Kein Suchbegriff: Sie sehen alle ${POT_LABEL[pot]}.`}
      </p>
      {services?.correction && services.correction.toLowerCase() !== q.toLowerCase() && (
        <p className="t-correction">
          Meinten Sie: <Link href={searchHref(base, services.correction, pot)}>{services.correction}</Link>?
        </p>
      )}

      <div className="t-route__bar" {...origin("zentral", "Zentral · Plattform: Suchweiche")}>
        <p>
          Gesucht in <strong>{POT_LABEL[pot]}</strong>
          {route?.pot ? `, automatisch gewählt${because ? `. Erkannt an ${because}` : ""}.` : "."}
        </p>
        <Link href={searchHref(base, q, other)} className="t-btn">
          {q ? `Stattdessen in ${POT_LABEL[other]} suchen` : `${POT_LABEL[other]} anzeigen`}
        </Link>
      </div>

      {answer && (
        <div className="t-answer">
          <p className="t-answer__eyebrow">
            <IconSparkle size={18} />
            Das passt am besten zu Ihrer Anfrage
          </p>
          <h2 className="t-answer__title">
            <Link href={`${base}/leistungen/${answer.slug}`}>{answer.title}</Link>
          </h2>
          <p>{answer.summary}</p>
          <ul className="t-facts-line t-answer__facts">
            <li className={answer.online ? "t-facts-line__online" : undefined}>
              {answer.online && <IconCheck size={16} />}
              {answer.online ? "Online möglich" : "Termin vor Ort"}
            </li>
            <li>Kosten: {answer.costs}</li>
            <li>Dauer: {answer.duration}</li>
          </ul>
          {services.related.length > 0 && (
            <p className="t-answer__related">
              Das brauchen Sie oft auch:{" "}
              {services.related.map((s, i) => (
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

      <h2 className="visually-hidden">{POT_LABEL[pot]}</h2>
      {hits.length > 0 ? (
        <HitList hits={hits} />
      ) : (
        <div className="t-empty">
          <p>Keine {POT_LABEL[pot]} zu „{q}“.</p>
          <Link href={searchHref(base, q, other)} className="t-btn">
            In {POT_LABEL[other]} suchen
          </Link>
          <p>Oder prüfen Sie die Schreibweise und versuchen Sie ein allgemeineres Wort, zum Beispiel „Ausweis“.</p>
        </div>
      )}
      {q && (hits.length === 0 || (pot === "leistungen" && !answer)) && <AssistantHint q={q} />}
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
