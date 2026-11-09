"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { IconCheck, IconSparkle } from "@/components/Icons";
import { AnswerPlace, HitList, SearchHead, useArrival } from "@/components/pages/SearchPage";
import { SearchSteps } from "@/components/PotDialog";
import type { SearchRequest } from "@/components/PotDialog";
import { RegionField } from "@/components/RegionField";
import { SearchPending } from "@/components/SearchPending";
import type { Place } from "@/data/places";
import { hintAfter } from "@/data/test-scenarios";
import type { TestConfig } from "@/data/test-scenarios";
import { isCentral } from "@/lib/offices";
import { setPlaceId, usePlace } from "@/lib/place-store";
import { isUnclear, resultArea } from "@/lib/result-area";
import { POT_LABEL, routeQuery } from "@/lib/search-router";
import type { Pot } from "@/lib/search-router";
import { searchInformation } from "@/lib/smart-search";
import { useTestConfig } from "@/lib/test-config";
import type { Service } from "@/lib/types";

// Services and information on one results page, or in two tabs. Which questions come first and how long the
// search takes is set per test scenario. The wording of the texts in the area for services comes from the
// product owner.
const ACTION = "/ergebnisse";
const POTS: Pot[] = ["leistungen", "informationen"];
const SEARCHING = "Wir suchen die passende Antwort …";
const STILL_SEARCHING = "Das dauert noch einen Moment. Wir suchen weiter nach der passenden Antwort …";

function ServiceResult({ service, best }: { service: Service; best: boolean }) {
  return (
    <li className={best ? "t-answer" : "t-answer t-answer--more"}>
      {best && (
        <p className="t-answer__eyebrow">
          <IconSparkle size={18} />
          Das passt am besten zu Ihrer Anfrage
        </p>
      )}
      <h3 className="t-answer__title">
        <Link href={`/leistungen/${service.slug}`}>{service.title}</Link>
      </h3>
      <p>{service.summary}</p>
      {/* "Bundesweit einheitlich" once is enough. */}
      {(best || service.level !== "bund") && <AnswerPlace service={service} />}
      <ul className="t-facts-line t-answer__facts">
        <li className={service.online ? "t-facts-line__online" : undefined}>
          {service.online && <IconCheck size={16} />}
          {service.online ? "Online möglich" : "Termin vor Ort"}
        </li>
        <li>Kosten: {service.costs}</li>
        <li>Dauer: {service.duration}</li>
      </ul>
    </li>
  );
}

// still: nothing is loading, the page waits for an answer from the person.
function Ghost({ still = false, count = 3 }: { still?: boolean; count?: number }) {
  return (
    <ol className={still ? "t-hits t-lb__ghost" : "t-hits"} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="t-hit t-hit--skeleton">
          <span />
          <span />
          <span />
        </li>
      ))}
    </ol>
  );
}

function PageSkeleton({ q, tabs, still = false }: { q: string; tabs: boolean; still?: boolean }) {
  return (
    <div className="t-lbpage" aria-hidden="true">
      {/* While the search runs, the note of Waiting stands here. */}
      {still && <p className="t-search__summary">Ergebnisse für „{q}“</p>}
      {tabs ? (
        <div className="t-pottabs">
          <ul>
            {POTS.map((pot) => (
              <li key={pot}>
                <span className="t-pottab">{POT_LABEL[pot]}</span>
              </li>
            ))}
          </ul>
          <Ghost still={still} />
        </div>
      ) : (
        <>
          <div className="t-lb">
            <p className="t-h2">Leistungen</p>
            <Ghost still={still} count={1} />
          </div>
          <div className="t-lb__info">
            <p className="t-h2">Informationen</p>
            <Ghost still={still} />
          </div>
        </>
      )}
    </div>
  );
}

// First the skeleton with a small note. In a long wait a second note with a loading animation follows on top of it.
function Waiting({ wait, children }: { wait: TestConfig["wait"]; children: ReactNode }) {
  const [late, setLate] = useState(false);
  const after = hintAfter(wait);

  useEffect(() => {
    if (!after) return;
    const timer = window.setTimeout(() => setLate(true), after * 1000);
    return () => window.clearTimeout(timer);
  }, [after]);

  return (
    <div className="t-lb__cover">
      <p role="status" className="visually-hidden">
        {late ? STILL_SEARCHING : SEARCHING}
      </p>
      <p className="t-search__summary t-waiting__note" aria-hidden="true">
        <span className="t-spinner" />
        {SEARCHING}
      </p>
      {children}
      {late && (
        <div className="t-lb__overlay" aria-hidden="true">
          <div className="t-lb__prompt">
            <SearchPending text={STILL_SEARCHING} />
          </div>
        </div>
      )}
    </div>
  );
}

function tabHref(q: string, chosen: Pot | undefined, tab: Pot): string {
  const params = new URLSearchParams({ q });
  if (chosen) params.set("in", chosen);
  params.set("tab", tab);
  return `${ACTION}?${params.toString()}`;
}

function ResultBody({ q, chosen, tab }: { q: string; chosen?: Pot; tab?: Pot }) {
  const router = useRouter();
  const config = useTestConfig();
  const place = usePlace();
  const placeId = place?.id;
  const titles = { services: useId(), info: useId() };
  const tabs = config.results === "tabs";
  const ms = config.wait * 1000;
  // Closed without an answer: the results come anyway, the area for services can still ask for the place.
  const [skipped, setSkipped] = useState(false);
  const [placeEntered, setPlaceEntered] = useState(false);
  const [refining, setRefining] = useState(false);

  const askPot = !skipped && config.potOverlay && !chosen && isUnclear(q);
  const askPlace = !skipped && !askPot && config.place === "overlay" && !place && resultArea(q, undefined, false, chosen).kind === "needPlace";
  const question = useMemo<SearchRequest | null>(() => {
    if (askPot) return { query: q, place: false };
    if (askPlace) return { query: q, href: ACTION, place: true };
    return null;
  }, [askPot, askPlace, q]);

  // The questions come right after the search, the wait only once they are answered.
  const ready = useArrival(question ? "frage" : q, ms);

  useEffect(() => {
    if (!refining) return;
    const timer = window.setTimeout(() => setRefining(false), ms);
    return () => window.clearTimeout(timer);
  }, [refining, ms, placeId]);

  if (question) {
    return (
      <>
        <PageSkeleton q={q} tabs={tabs} still />
        <SearchSteps
          request={question}
          dismissLabel="Frage schließen"
          onClose={(dismissed) => {
            if (dismissed) setSkipped(true);
          }}
          onDone={(href) => {
            // The place is remembered and the page goes on by itself; the area is part of the address.
            if (askPot) router.replace(href);
          }}
        />
      </>
    );
  }

  if (!ready) {
    return (
      <Waiting wait={config.wait}>
        <PageSkeleton q={q} tabs={tabs} />
      </Waiting>
    );
  }

  const choose = (next: Place) => {
    setPlaceId(next.id);
    setPlaceEntered(true);
    setRefining(true);
  };

  // Only a place entered for this search turns a search for information into a search for services.
  const area = resultArea(q, place, placeEntered || config.place === "start", chosen, config.maxServices, config.topicServices);
  const allInformation = searchInformation(q);
  const information = config.maxInfos === "all" ? allInformation : allInformation.slice(0, config.maxInfos);
  const field = <RegionField key={placeId} label="PLZ/Ort für regionale Ergebnisse" initial={place?.name ?? ""} onPlace={choose} />;
  // Services that are the same for everyone: a place would change nothing.
  const placeMatters = area.kind !== "services" || area.services.some((s) => !isCentral(s));
  // Tabs name the area already.
  const heading = tabs ? "visually-hidden" : "t-h2";

  const askNoPlace = config.place === "none";
  const noServices = tabs ? <p>Zu „{q}“ haben wir keine Leistungen gefunden.</p> : null;
  const services =
    area.kind === "info" && !refining ? (
      askNoPlace ? (
        noServices
      ) : (
        <section className="t-lb t-lb--small" aria-label="Leistungen in Ihrer Region">
          <RegionField label="Gibt es dazu eine Leistung in Ihrer Region? PLZ/Ort eingeben" onPlace={choose} />
        </section>
      )
    ) : (
      <section className="t-lb" aria-labelledby={titles.services}>
        <div className="t-lb__head">
          <h2 id={titles.services} className={heading}>
            Leistungen
          </h2>
          {area.kind !== "needPlace" && placeMatters && !refining && !askNoPlace && field}
        </div>
        {refining && (
          <Waiting wait={config.wait}>
            <Ghost />
          </Waiting>
        )}
        {!refining && area.kind === "services" && (
          <ul className="t-lb__services">
            {area.services.map((service) => (
              <ServiceResult key={service.slug} service={service} best={!area.related && (area.services.length === 1 || service === area.direct)} />
            ))}
          </ul>
        )}
        {!refining && area.kind === "needPlace" && (
          <div className="t-lb__cover">
            <Ghost still />
            <div className="t-lb__overlay">
              <div className="t-lb__prompt">
                <RegionField label="Bitte geben Sie Ihre PLZ oder Ihren Ort für regionale Ergebnisse ein" onPlace={choose} />
              </div>
            </div>
          </div>
        )}
        {!refining && area.kind === "nothing" && (
          <p className="t-lb__none" role="status">
            Für diesen Ort gibt es keine regionalen Leistungen, vielleicht helfen Ihnen die Informationen {tabs ? "im anderen Tab" : "unten"} weiter.
          </p>
        )}
      </section>
    );

  const infos = (
    <section className="t-lb__info" aria-labelledby={titles.info}>
      <h2 id={titles.info} className={heading}>
        Informationen
      </h2>
      {information.length > 0 ? <HitList hits={information} /> : <p>Zu „{q}“ haben wir keine Informationen gefunden.</p>}
    </section>
  );

  const related = area.kind === "services" && area.related;
  const infoFirst = related || area.kind === "info" || (area.kind === "nothing" && (chosen ?? routeQuery(q).pot) === "informationen");
  const activeTab: Pot = tab ?? (infoFirst ? "informationen" : "leistungen");

  return (
    <div className="t-results t-lbpage">
      <p className="t-search__summary" role="status">
        Ergebnisse für „{q}“
      </p>

      {tabs ? (
        <div>
          <nav aria-label="Suchbereich" className="t-pottabs">
            <ul>
              {POTS.map((pot) => (
                <li key={pot}>
                  <Link href={tabHref(q, chosen, pot)} scroll={false} className="t-pottab" aria-current={pot === activeTab ? "page" : undefined}>
                    {POT_LABEL[pot]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {activeTab === "leistungen" ? services : infos}
        </div>
      ) : (
        <>
          {/* Information in focus: the services on its topic follow it. */}
          {!related && services}
          {infos}
          {related && services}
        </>
      )}
    </div>
  );
}

function asPot(value: string | null): Pot | undefined {
  return value === "leistungen" || value === "informationen" ? value : undefined;
}

function Results() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const chosen = asPot(params.get("in"));
  const tab = asPot(params.get("tab"));
  const placeInForm = useTestConfig().place === "start";
  return (
    <>
      <SearchHead q={q} action={ACTION} placeInForm={placeInForm} />
      <div className="t-container t-page">
        {/* A new search starts over: new wait, no place entered yet. */}
        {q ? <ResultBody key={`${q}|${chosen}`} q={q} chosen={chosen} tab={tab} /> : <p className="t-search__summary">Geben Sie oben ein, was Sie suchen.</p>}
      </div>
    </>
  );
}

export function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="t-pagehead">
          <div className="t-container">
            <h1 className="t-h1">Suche</h1>
          </div>
        </div>
      }
    >
      <Results />
    </Suspense>
  );
}
