"use client";

import Link from "next/link";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Suspense, useId } from "react";
import { PotChoices } from "@/components/PotDialog";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IconArrow, IconCheck, IconSearch, IconSparkle } from "@/components/Icons";
import { allInformation, allServices, serviceHit } from "@/lib/search";
import { searchInformation, searchServices } from "@/lib/smart-search";
import { POT_LABEL, RULE, routeQuery } from "@/lib/search-router";
import type { Pot, Route } from "@/lib/search-router";
import type { Hit } from "@/lib/search";
import { pluralize } from "@/lib/format";
import { responsibleOffice } from "@/lib/offices";
import { usePlace } from "@/lib/place-store";
import type { Service } from "@/lib/types";
import { openAssistant } from "@/lib/assistant-dock";

const OTHER: Record<Pot, Pot> = { leistungen: "informationen", informationen: "leistungen" };
const POTS: Pot[] = ["leistungen", "informationen"];

function searchHref(q: string, pot?: Pot): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (pot) params.set("in", pot);
  return `/suche?${params.toString()}`;
}

// On the search page no overlay opens: an unclear term shows the choice in the page, under the tabs.
function SearchForm({ q }: { q: string }) {
  const inputId = useId();
  return (
    <Form action="/suche" role="search" className="t-searchform">
      <label htmlFor={inputId} className="t-searchform__label">
        Suchbegriff
      </label>
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

// Page head with breadcrumb, the one H1 and the search field.
function SearchHead({ q }: { q: string }) {
  return (
    <div className="t-pagehead">
      <div className="t-container">
        <Breadcrumb items={[{ label: "Suche", href: "/suche" }]} />
        <h1 className="t-h1">Suche</h1>
        <SearchForm q={q} />
      </div>
    </div>
  );
}

// The two pots as a filter on top. Only the chosen one is searched; the other is a new request.
function PotTabs({ q, pot }: { q: string; pot?: Pot }) {
  return (
    <nav aria-label="Suchbereich" className="t-pottabs">
      <ul>
        {POTS.map((p) => (
          <li key={p}>
            <Link href={searchHref(q, p)} className="t-pottab" aria-current={p === pot ? "page" : undefined}>
              {POT_LABEL[p]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function HitList({ hits }: { hits: Hit[] }) {
  return (
    <ol className="t-hits">
      {hits.map((hit) => (
        <li key={hit.key} className="t-hit">
          <p className="t-hit__kind">{hit.kind}</p>
          <h3 className="t-hit__title">
            <Link href={hit.href} className="t-cardlink">
              {hit.title}
            </Link>
          </h3>
          <p className="t-hit__text">{hit.text}</p>
        </li>
      ))}
    </ol>
  );
}

// When the result is unclear, the guided assistant can narrow it down by asking.
function AssistantHint({ q }: { q: string }) {
  return (
    <div className="t-assisthint">
      <p>Nicht das Richtige dabei? Im Chat fragt der Assistent nach und grenzt Ihr Anliegen ein.</p>
      <Link
        href={`/assistent?frage=${encodeURIComponent(q)}`}
        className="t-more"
        onClick={(event) => {
          if (openAssistant(q)) event.preventDefault();
        }}
      >
        „{q}“ im Chat fragen <IconArrow size={18} />
      </Link>
    </div>
  );
}

// What the backend would receive: exactly one request to one pot, or none while the person chooses.
function RequestLine({ q, pot }: { q: string; pot?: Pot }) {
  if (!pot) {
    return (
      <p className="t-route__request">
        Anfrage an das Backend: <strong>noch keine.</strong> Erst Ihre Wahl löst sie aus.
      </p>
    );
  }
  const query = new URLSearchParams(q ? { q } : {}).toString();
  return (
    <p className="t-route__request">
      Anfrage an das Backend: <code className="t-route__code">GET /api/{pot}{query ? `?${query}` : ""}</code>. Genau eine
      Anfrage, nur an den Bereich {POT_LABEL[pot]}.
    </p>
  );
}

// Makes the decision of the search switch visible, for demos and for curious visitors.
function RouteExplain({ route, q, pot }: { route?: Route; q: string; pot?: Pot }) {
  if (!route) {
    return (
      <details className="t-route__why">
        <summary>So läuft die Suche</summary>
        <div className="t-route__body">
          <p className="t-route__rule">Sie haben den Bereich selbst gewählt, die Weiche hat nicht entschieden.</p>
          <RequestLine q={q} pot={pot} />
        </div>
      </details>
    );
  }
  return (
    <details className="t-route__why">
      <summary>So hat die Suche entschieden</summary>
      <div className="t-route__body">
        <div className="t-route__points">
          {POTS.map((p) => {
            const signals = route.signals.filter((s) => s.pot === p);
            return (
              <div key={p}>
                <p className="t-route__pot">
                  {POT_LABEL[p]}: {pluralize(route.points[p], "Punkt", "Punkte")}
                </p>
                {signals.length > 0 ? (
                  <ul>
                    {signals.map((s) => (
                      <li key={s.label + s.word}>
                        „{s.word}“: {s.label}, +{s.points}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="t-route__none">Keine Hinweise</p>
                )}
              </div>
            );
          })}
        </div>
        <p className="t-route__rule">{RULE} Grundlage sind nur der Leistungskatalog und feste Signalwörter, keine Datenbank.</p>
        <RequestLine q={q} pot={pot} />
      </div>
    </details>
  );
}

// A remembered place shows right away who is in charge. Land services have one office anyway.
function AnswerPlace({ service }: { service: Service }) {
  const place = usePlace();
  const office = responsibleOffice(service, place);
  if (!office) return null;
  return (
    <p className="t-answer__place">
      {service.level === "land" ? "Zuständig" : `Zuständig für ${place?.name}`}: <strong>{office.office}</strong>
    </p>
  );
}

// The search switch could not decide: one question, two answers.
function PotQuestion({ q, route }: { q: string; route?: Route }) {
  const titleId = useId();
  return (
    <section className="t-route" aria-labelledby={titleId}>
      <h2 id={titleId} className="t-h2">
        Was suchen Sie?
      </h2>
      <p>Zu „{q}“ gibt es Anträge und Informationen. Wählen Sie, was Sie gerade brauchen.</p>
      <PotChoices query={q} />
      {route && <RouteExplain route={route} q={q} />}
    </section>
  );
}

function SearchResults() {
  const params = useSearchParams();

  const q = (params.get("q") ?? "").trim();
  // "tab" is the older name of the parameter.
  const requested = params.get("in") ?? params.get("tab");
  const chosen: Pot | undefined = requested === "leistungen" || requested === "informationen" ? requested : undefined;
  const route = q && !chosen ? routeQuery(q) : undefined;
  // Without a search term the page lists all services, A to Z.
  const pot: Pot | undefined = chosen ?? (q ? route?.pot : "leistungen");

  if (!pot) {
    return (
      <>
        <SearchHead q={q} />
        <div className="t-container t-page">
          <PotTabs q={q} />
          <p className="t-search__summary" role="status">
            Für „{q}“ bitte einen Suchbereich wählen.
          </p>
          <PotQuestion q={q} route={route} />
          <AssistantHint q={q} />
        </div>
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
        ? searchInformation(q)
        : allInformation();
  const answer = services?.answer;
  const other = OTHER[pot];

  return (
    <>
      <SearchHead q={q} />
      <div className="t-container t-page">
        <PotTabs q={q} pot={pot} />
        <div className="t-route__bar">
          <p className="t-search__summary" role="status">
            {q
              ? `${pluralize(hits.length, "Treffer", "Treffer")} für „${q}“ in ${POT_LABEL[pot]}${route?.pot ? ", automatisch gewählt" : ""}.`
              : `Kein Suchbegriff: Sie sehen alle ${POT_LABEL[pot]}.`}
          </p>
          <Link href={searchHref(q, other)} className="t-btn t-btn--small">
            {q ? `Stattdessen in ${POT_LABEL[other]} suchen` : `${POT_LABEL[other]} anzeigen`}
          </Link>
        </div>
        {q && <RouteExplain route={route?.pot ? route : undefined} q={q} pot={pot} />}
        {services?.correction && services.correction.toLowerCase() !== q.toLowerCase() && (
          <p className="t-correction">
            Meinten Sie: <Link href={searchHref(services.correction, pot)}>{services.correction}</Link>?
          </p>
        )}

        {answer && (
          <div className="t-answer">
            <p className="t-answer__eyebrow">
              <IconSparkle size={18} />
              Das passt am besten zu Ihrer Anfrage
            </p>
            <h2 className="t-answer__title">
              <Link href={`/leistungen/${answer.slug}`}>{answer.title}</Link>
            </h2>
            <p>{answer.summary}</p>
            <AnswerPlace service={answer} />
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
                    <Link href={`/leistungen/${s.slug}`}>{s.title}</Link>
                  </span>
                ))}
              </p>
            )}
            <p className="t-answer__note">Vorschlag aus Ihren Worten. Im Prototyp lokal simuliert, ohne echte KI.</p>
          </div>
        )}

        <h2 className="visually-hidden">{POT_LABEL[pot]}</h2>
        {hits.length > 0 ? (
          <HitList hits={hits} />
        ) : (
          <div className="t-empty">
            <p>Keine {POT_LABEL[pot]} zu „{q}“.</p>
            <Link href={searchHref(q, other)} className="t-btn">
              In {POT_LABEL[other]} suchen
            </Link>
            <p>Oder prüfen Sie die Schreibweise und versuchen Sie ein allgemeineres Wort, zum Beispiel „Ausweis“.</p>
          </div>
        )}
        {q && (hits.length === 0 || (pot === "leistungen" && !answer)) && <AssistantHint q={q} />}
      </div>
    </>
  );
}

export function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="t-pagehead">
          <div className="t-container">
            <h1 className="t-h1">Suche</h1>
            <p className="t-search__summary">Suche wird geladen …</p>
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
