"use client";

import Link from "next/link";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useState } from "react";
import type { CSSProperties } from "react";
import { PotChoices } from "@/components/PotDialog";
import { Breadcrumb } from "@/components/Breadcrumb";
import { HomePlace } from "@/components/HomePlace";
import { PlaceAlert, useRequiredPlace } from "@/components/RequiredPlace";
import { SearchPending } from "@/components/SearchPending";
import { IconArrow, IconCheck, IconPin, IconSearch, IconSparkle } from "@/components/Icons";
import { allInformation, allServices, serviceHit } from "@/lib/search";
import { searchInformation, searchServices } from "@/lib/smart-search";
import { POT_LABEL, routeQuery } from "@/lib/search-router";
import type { Pot } from "@/lib/search-router";
import type { Hit } from "@/lib/search";
import { pluralize } from "@/lib/format";
import { offeredIn, placeMatters, responsibleOffice } from "@/lib/offices";
import { latencyFor, wasEvaluated } from "@/lib/search-latency";
import { usePlace } from "@/lib/place-store";
import type { Service } from "@/lib/types";
import { CHAT_IN_PORTAL } from "@/data/site";
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
function SearchForm({ q, action, placeInForm }: { q: string; action: string; placeInForm: boolean }) {
  const inputId = useId();
  const placeId = useId();
  const statusId = useId();
  const requiredPlace = useRequiredPlace(placeId);
  return (
    <Form
      action={action}
      role="search"
      className="t-searchform"
      noValidate
      onSubmit={(event) => {
        if (placeInForm && !requiredPlace.confirm()) event.preventDefault();
      }}
    >
      <div className="t-searchform__row">
        <div className="t-searchform__field">
          <label htmlFor={inputId} className="t-searchform__label">
            Suchbegriff
          </label>
          <input key={q} id={inputId} className="t-input" name="q" type="search" defaultValue={q} autoComplete="off" />
        </div>
        {placeInForm && (
          <div className={requiredPlace.problem ? "t-searchform__field t-searchform__field--place t-searchform__field--problem" : "t-searchform__field t-searchform__field--place"}>
            <label htmlFor={placeId} className="t-searchform__label">
              PLZ oder Ort (Pflichtfeld)
            </label>
            {/* No name: the place is remembered, it does not go into the address. */}
            <input
              id={placeId}
              className="t-input"
              type="text"
              value={requiredPlace.value}
              required
              autoComplete="postal-code"
              spellCheck={false}
              aria-describedby={statusId}
              aria-invalid={requiredPlace.problem ? true : undefined}
              onChange={(event) => requiredPlace.change(event.target.value)}
            />
          </div>
        )}
        <button type="submit" className="t-btn t-btn--primary">
          <IconSearch />
          Suchen
        </button>
      </div>
      {placeInForm && <PlaceAlert id={statusId} problem={requiredPlace.problem} tries={requiredPlace.tries} />}
    </Form>
  );
}

// Page head with breadcrumb, the one H1 and the search field.
export function SearchHead({ q, action = "/suche", placeInForm = false }: { q: string; action?: string; placeInForm?: boolean }) {
  return (
    <div className="t-pagehead">
      <div className="t-container">
        <Breadcrumb items={[{ label: "Suche", href: action }]} />
        <h1 className="t-h1">Suche</h1>
        <SearchForm q={q} action={action} placeInForm={placeInForm} />
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

// A new search shows a short loading state: the one request runs, then the hits rise in one by one.
const LOADING_MS = 550;

export function useArrival(key: string, ms: number = LOADING_MS): boolean {
  const [arrived, setArrived] = useState<string | null>(null);
  useEffect(() => {
    if (arrived === key) return;
    const timer = window.setTimeout(() => setArrived(key), ms);
    return () => window.clearTimeout(timer);
  }, [key, arrived, ms]);
  return arrived === key;
}

// thinking: the search still judges the request, which later takes an AI 1 to 3 seconds.
function Loading({ thinking = false }: { thinking?: boolean }) {
  return (
    <div className="t-loadingbox">
      {thinking ? (
        <SearchPending />
      ) : (
        <div className="t-loadingbar" aria-hidden="true">
          <span />
        </div>
      )}
      <ol className="t-hits" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="t-hit t-hit--skeleton">
            <span />
            <span />
            <span />
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HitList({ hits }: { hits: Hit[] }) {
  return (
    <ol className="t-hits">
      {hits.map((hit, i) => (
        <li key={hit.key} className="t-hit" style={{ "--i": i } as CSSProperties}>
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

// A remembered place shows right away who is in charge. Land services have one office anyway, and services
// of the federation say that no place is needed.
export function AnswerPlace({ service }: { service: Service }) {
  const place = usePlace();
  if (service.level === "bund") return <p className="t-answer__place">Bundesweit einheitlich, eine Postleitzahl ist nicht nötig.</p>;
  const office = responsibleOffice(service, place);
  if (!office) return null;
  return (
    <p className="t-answer__place">
      {service.level === "land" ? "Zuständig" : `Zuständig für ${place?.name}`}: <strong>{office.office}</strong>
    </p>
  );
}

// The search switch could not decide: one question, two answers.
function PotQuestion({ q }: { q: string }) {
  const titleId = useId();
  return (
    <section className="t-route" aria-labelledby={titleId}>
      <h2 id={titleId} className="t-h2">
        Was suchen Sie?
      </h2>
      <p>Zu „{q}“ gibt es Anträge und Informationen. Wählen Sie, was Sie gerade brauchen.</p>
      <PotChoices query={q} />
    </section>
  );
}

function SearchResults() {
  const params = useSearchParams();
  const place = usePlace();

  const q = (params.get("q") ?? "").trim();
  // "tab" is the older name of the parameter.
  const requested = params.get("in") ?? params.get("tab");
  const chosen: Pot | undefined = requested === "leistungen" || requested === "informationen" ? requested : undefined;
  const route = q && !chosen ? routeQuery(q) : undefined;
  // Without a search term the page lists all services, A to Z.
  const pot: Pot | undefined = chosen ?? (q ? route?.pot : "leistungen");
  // Without a chosen area the search has to judge the term first. The steps on the start page may have done that.
  const thinking = Boolean(q && !chosen);
  const arrived = useArrival(`${pot ?? "frage"}|${q}`, thinking ? latencyFor(q) : undefined);
  const ready = arrived || (thinking && wasEvaluated(q));

  if (!pot) {
    return (
      <>
        <SearchHead q={q} />
        <div className="t-container t-page">
          <PotTabs q={q} />
          {ready ? (
            <>
              <p className="t-search__summary" role="status">
                Für „{q}“ bitte einen Suchbereich wählen.
              </p>
              <PotQuestion q={q} />
              {CHAT_IN_PORTAL && <AssistantHint q={q} />}
            </>
          ) : (
            <Loading thinking />
          )}
        </div>
      </>
    );
  }

  // Exactly one request, to exactly one pot.
  const services = pot === "leistungen" && q ? searchServices(q) : undefined;
  // A service the place does not offer is no result: nothing to open there.
  const offered = (service: Service) => !place || offeredIn(service, place);
  const here = services?.services.filter((h) => offered(h.service));
  const notInPlace = Boolean(services?.services.length && !here?.length);
  const hits: Hit[] =
    pot === "leistungen"
      ? here
        ? here.map((h) => serviceHit(h.service))
        : allServices()
      : q
        ? searchInformation(q)
        : allInformation();
  const answer = services?.answer && offered(services.answer) ? services.answer : undefined;
  const related = services?.related.filter(offered) ?? [];
  const other = OTHER[pot];

  // The results, shown once the request has "arrived".
  const results = (
    <div className="t-results">
      {/* The place belongs to every search, so the hits can name the office in charge. Not for a service
          with one office for everyone, such as Kindergeld. */}
      {q && placeMatters(q) && (
        <div className="t-place t-place--search">
          <IconPin size={24} />
          <HomePlace hint="Dann nennen wir bei jeder Leistung die zuständige Stelle. Die Angabe bleibt nur in diesem Browser." />
        </div>
      )}
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
          {related.length > 0 && (
            <p className="t-answer__related">
              Das brauchen Sie oft auch:{" "}
              {related.map((s, i) => (
                <span key={s.slug}>
                  {i > 0 && ", "}
                  <Link href={`/leistungen/${s.slug}`}>{s.title}</Link>
                </span>
              ))}
            </p>
          )}
          <p className="t-answer__note">Vorschlag aus Ihren Worten.</p>
        </div>
      )}

      <h2 className="visually-hidden">{POT_LABEL[pot]}</h2>
      {hits.length > 0 ? (
        <HitList hits={hits} />
      ) : (
        <div className="t-empty">
          <p>{notInPlace ? `In ${place?.name} gibt es dazu keine Leistung.` : `Keine ${POT_LABEL[pot]} zu „${q}“.`}</p>
          <Link href={searchHref(q, other)} className="t-btn">
            In {POT_LABEL[other]} suchen
          </Link>
          {!notInPlace && <p>Oder prüfen Sie die Schreibweise und versuchen Sie ein allgemeineres Wort, zum Beispiel „Ausweis“.</p>}
        </div>
      )}
      {CHAT_IN_PORTAL && q && (hits.length === 0 || (pot === "leistungen" && !answer)) && <AssistantHint q={q} />}
    </div>
  );

  return (
    <>
      <SearchHead q={q} />
      <div className="t-container t-page">
        <PotTabs q={q} pot={ready || !thinking ? pot : undefined} />
        {(ready || !thinking) && <div className="t-route__bar">
          <p className="t-search__summary" role="status">
            {!ready
              ? `Suche läuft in ${POT_LABEL[pot]} …`
              : q
                ? `${pluralize(hits.length, "Treffer", "Treffer")} für „${q}“ in ${POT_LABEL[pot]}${route?.pot ? ", automatisch gewählt" : ""}.`
                : `Kein Suchbegriff: Sie sehen alle ${POT_LABEL[pot]}.`}
          </p>
          {ready && (
            <Link href={searchHref(q, other)} className="t-btn t-btn--small t-rise">
              {q ? `Stattdessen in ${POT_LABEL[other]} suchen` : `${POT_LABEL[other]} anzeigen`}
            </Link>
          )}
        </div>}
        {ready ? results : <Loading thinking={thinking} />}
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
