"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { IconCheck, IconForm, IconPin, IconSparkle } from "@/components/Icons";
import { AnswerPlace, HitList, SearchHead, useArrival } from "@/components/pages/SearchPage";
import { SearchSteps } from "@/components/PotDialog";
import type { SearchRequest } from "@/components/PotDialog";
import { RegionField } from "@/components/RegionField";
import { SearchPending } from "@/components/SearchPending";
import type { Place } from "@/data/places";
import { hintAfter } from "@/data/test-cases";
import type { TestConfig } from "@/data/test-cases";
import { isCentral, responsibleOffice } from "@/lib/offices";
import { setPlaceId, usePlace } from "@/lib/place-store";
import { isUnclear, resultArea } from "@/lib/result-area";
import type { ResultArea } from "@/lib/result-area";
import { POT_LABEL, routeQuery } from "@/lib/search-router";
import type { Pot } from "@/lib/search-router";
import { searchInformation } from "@/lib/smart-search";
import type { InfoHit } from "@/lib/smart-search";
import { useTestConfig } from "@/lib/test-config";
import type { Service } from "@/lib/types";

// Services and information on one results page: in one list, one below the other, or in two tabs. Which of
// these it is, which questions come first and how long the search takes belongs to the variant of the test
// case. The wording of the texts in the area for services comes from the product owner.
const ACTION = "/ergebnisse";
const POTS: Pot[] = ["leistungen", "informationen"];
const SEARCHING = "Wir suchen die passende Antwort …";
const STILL_SEARCHING = "Das dauert noch einen Moment. Wir suchen weiter nach der passenden Antwort …";
// The question for the place. In the overlay it is split into the line of reason and the question itself.
const PLACE_REASON = "Es stehen Ihnen regionale Leistungen für Ihren Suchbegriff zur Verfügung.";
const PLACE_ASK = "Wie lautet Ihre Postleitzahl?";
const PLACE_QUESTION = "Es stehen Ihnen regionale Leistungen für Ihren Suchbegriff zur Verfügung, wie lautet Ihre Postleitzahl?";

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

function PageSkeleton({ q, results, still = false }: { q: string; results: TestConfig["results"]; still?: boolean }) {
  return (
    <div className="t-lbpage" aria-hidden="true">
      {/* While the search runs, the note of Waiting stands here. */}
      {still && <p className="t-search__summary">Ergebnisse für „{q}“</p>}
      {results === "combined" ? (
        <div className="t-clist">
          <div className="t-chiplist">
            {POTS.map((pot) => (
              <span key={pot} className="t-chip">
                {POT_LABEL[pot]}
              </span>
            ))}
          </div>
          <Ghost still={still} count={4} />
        </div>
      ) : results === "tabs" ? (
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

type Row = { kind: "service"; service: Service } | { kind: "info"; hit: InfoHit };

// One ranking for services and information comes from the backend later. The prototype puts the service itself
// first and then takes turns, so the list shows what a mixed ranking looks like.
function mix(services: Service[], infos: InfoHit[], infoFirst: boolean): Row[] {
  const lead = infoFirst ? 0 : Math.min(1, services.length);
  const rest = services.slice(lead);
  const rows: Row[] = services.slice(0, lead).map((service) => ({ kind: "service", service }));
  for (let i = 0; i < Math.max(rest.length, infos.length); i++) {
    if (i < infos.length) rows.push({ kind: "info", hit: infos[i] });
    if (i < rest.length) rows.push({ kind: "service", service: rest[i] });
  }
  return rows;
}

// Marks a row of the one list as a service.
function ServiceTag() {
  return (
    <span className="t-tag">
      <IconForm size={14} />
      Leistung
    </span>
  );
}

// What a row says about who handles the service.
function officeLine(service: Service, place: Place | undefined): string {
  if (service.level === "bund") return "Bundesweit einheitlich";
  const office = responsibleOffice(service, place);
  if (!office) return "Zuständige Stelle hängt von Ihrem Ort ab";
  return service.level === "land" ? `Zuständig: ${office.office}` : `Zuständig für ${place?.name}: ${office.office}`;
}

// In the one list every hit looks the same. A service is told apart by its tag.
function CombinedRow({ row, index, place }: { row: Row; index: number; place: Place | undefined }) {
  const style = { "--i": index } as CSSProperties;
  if (row.kind === "info") {
    const { hit } = row;
    return (
      <li className="t-hit" style={style}>
        <p className="t-hit__kind">{hit.kind}</p>
        <h3 className="t-hit__title">
          <Link href={hit.href} className="t-cardlink">
            {hit.title}
          </Link>
        </h3>
        <p className="t-hit__text">{hit.text}</p>
      </li>
    );
  }
  const { service } = row;
  return (
    <li className="t-hit" style={style}>
      <p className="t-hit__kind t-hit__kind--tagged">
        <ServiceTag />
        <span>{officeLine(service, place)}</span>
      </p>
      <h3 className="t-hit__title">
        <Link href={`/leistungen/${service.slug}`} className="t-cardlink">
          {service.title}
        </Link>
      </h3>
      <p className="t-hit__text">{service.summary}</p>
      <ul className="t-facts-line">
        <li className={service.online ? "t-facts-line__online" : undefined}>
          {service.online && <IconCheck size={14} />}
          {service.online ? "Online möglich" : "Termin vor Ort"}
        </li>
        <li>Kosten: {service.costs}</li>
        <li>Dauer: {service.duration}</li>
      </ul>
    </li>
  );
}

// The place on the results page: a button or a field until it is known, afterwards only the place with a quiet
// link to change it. fieldFirst: without a place the field stands open instead of the button.
function PlaceFilter({ place, fieldFirst = false, onPlace }: { place: Place | undefined; fieldFirst?: boolean; onPlace: (place: Place) => void }) {
  const [opened, setOpened] = useState(false);
  if (opened || (fieldFirst && !place)) {
    return (
      <div className="t-placefilter t-placefilter--open">
        <RegionField label="PLZ/Ort für regionale Ergebnisse" initial={place?.name ?? ""} focusOnMount={opened} onPlace={onPlace} />
      </div>
    );
  }
  if (place) {
    return (
      <p className="t-placefilter">
        <span className="t-placefilter__known">
          <IconPin size={16} />
          {place.name}
        </span>
        <button type="button" className="t-textbutton" onClick={() => setOpened(true)}>
          Ort ändern
        </button>
      </p>
    );
  }
  return (
    <div className="t-placefilter">
      <button type="button" className="t-chip" onClick={() => setOpened(true)}>
        <IconPin size={16} />
        PLZ/Ort angeben
      </button>
    </div>
  );
}

// Services and information in one list, with two filters. The search cannot show a service of a municipality
// without a place, so its row asks for the place until it is known.
function CombinedResults({
  q,
  area,
  information,
  place,
  askPlace,
  refining,
  wait,
  onPlace,
  onAskPlace,
}: {
  q: string;
  area: ResultArea;
  information: InfoHit[];
  place: Place | undefined;
  askPlace: boolean;
  refining: boolean;
  wait: TestConfig["wait"];
  onPlace: (place: Place) => void;
  // The place is asked in an overlay: the row only leads back to it.
  onAskPlace?: () => void;
}) {
  const [filter, setFilter] = useState<Pot | undefined>();
  const services = area.kind === "services" ? area.services : [];
  const needPlace = area.kind === "needPlace";
  const rows = mix(services, information, area.kind === "services" && Boolean(area.related)).filter(
    (row) => !filter || (row.kind === "service") === (filter === "leistungen"),
  );
  // Services that are the same for everyone: a place would change nothing.
  const placeMatters = area.kind !== "services" || services.some((s) => !isCentral(s));
  // No number while the services are not known yet.
  const counts: Record<Pot, number | undefined> = { leistungen: needPlace || refining ? undefined : services.length, informationen: information.length };
  // The notes stand where the services would.
  const note = filter !== "informationen" && (needPlace || area.kind === "nothing");
  // The row that asks for the place holds the field itself.
  const askInRow = note && needPlace;

  return (
    <div className="t-clist">
      <div className="t-clist__bar">
        <div className="t-chiplist" role="group" aria-label="Ergebnisse filtern">
          {POTS.map((pot) => (
            <button key={pot} type="button" className="t-chip" aria-pressed={filter === pot} onClick={() => setFilter(filter === pot ? undefined : pot)}>
              {POT_LABEL[pot]}
              {counts[pot] !== undefined && <span className="t-chip__count">{counts[pot]}</span>}
            </button>
          ))}
        </div>
        {!refining && !askInRow && (needPlace || (askPlace && placeMatters)) && <PlaceFilter key={place?.id} place={place} onPlace={onPlace} />}
      </div>

      <h2 className="visually-hidden">Ergebnisse</h2>
      {refining ? (
        <Waiting wait={wait}>
          <Ghost />
        </Waiting>
      ) : note || rows.length > 0 ? (
        <ol className="t-hits">
          {askInRow && onAskPlace && (
            <li className="t-hit t-hit--notice">
              <p className="t-hit__kind t-hit__kind--tagged">
                <ServiceTag />
                <span>Ihr Ort fehlt noch</span>
              </p>
              <div className="t-askplace">
                <p className="t-hit__text">Ohne Ihren Ort können wir zu „{q}“ keine Leistungen zeigen.</p>
                <button type="button" className="t-btn t-btn--small" onClick={onAskPlace}>
                  PLZ/Ort angeben
                </button>
              </div>
            </li>
          )}
          {/* Looks like the area for services of the separate list: placeholders, covered by the question. */}
          {askInRow && !onAskPlace && (
            <li className="t-clist__cover">
              <Ghost still count={2} />
              <div className="t-lb__overlay">
                <div className="t-lb__prompt">
                  <RegionField label={PLACE_QUESTION} onPlace={onPlace} />
                </div>
              </div>
            </li>
          )}
          {note && area.kind === "nothing" && (
            <li className="t-hit t-hit--notice">
              <p className="t-hit__kind t-hit__kind--tagged">
                <ServiceTag />
                <span>{place?.name}</span>
              </p>
              <p className="t-hit__text" role="status">
                Für diesen Ort gibt es keine regionalen Leistungen, vielleicht helfen Ihnen die Informationen weiter.
              </p>
            </li>
          )}
          {rows.map((row, index) => (
            <CombinedRow key={row.kind === "service" ? row.service.slug : row.hit.key} row={row} index={index} place={place} />
          ))}
        </ol>
      ) : (
        <p>
          Zu „{q}“ haben wir {filter ? `keine ${POT_LABEL[filter]}` : "nichts"} gefunden.
        </p>
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
  // With the place in the search form, or none at all, this page has no field of its own.
  const fieldInPage = config.place === "results" || config.place === "overlay";
  // Closed without an answer: the results come anyway, the area for services can still ask for the place.
  const [skipped, setSkipped] = useState(false);
  const [placeEntered, setPlaceEntered] = useState(false);
  const [refining, setRefining] = useState(false);
  // The overlay was closed without an answer and is asked for again from the note in the results.
  const [asking, setAsking] = useState(false);
  const again = useMemo<SearchRequest | null>(() => (asking ? { query: q, href: ACTION, place: true } : null), [asking, q]);
  const askAgain = config.place === "overlay" ? () => setAsking(true) : undefined;

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
        <PageSkeleton q={q} results={config.results} still />
        <SearchSteps
          request={question}
          dismissLabel="Frage schließen"
          skipLabel={askPlace ? "Ohne Ort suchen" : undefined}
          placeTitle={PLACE_ASK}
          placeText={PLACE_REASON}
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
        <PageSkeleton q={q} results={config.results} />
      </Waiting>
    );
  }

  const choose = (next: Place) => {
    setPlaceId(next.id);
    setPlaceEntered(true);
    setRefining(true);
  };

  const placeDialog = askAgain && (
    <SearchSteps
      request={again}
      dismissLabel="Frage schließen"
      skipLabel="Ohne Ort suchen"
      placeTitle={PLACE_ASK}
      placeText={PLACE_REASON}
      onClose={() => setAsking(false)}
      onDone={() => {
        // The dialog has remembered the place; the results load again for it.
        setPlaceEntered(true);
        setRefining(true);
      }}
    />
  );

  // Only a place entered for this search turns a search for information into a search for services.
  const area = resultArea(q, place, placeEntered || config.place === "start", chosen, config.maxServices, config.topicServices);
  const allInformation = searchInformation(q);
  const information = config.maxInfos === "all" ? allInformation : allInformation.slice(0, config.maxInfos);

  if (config.results === "combined") {
    return (
      <div className="t-results t-lbpage">
        <p className="t-search__summary" role="status">
          Ergebnisse für „{q}“
        </p>
        <CombinedResults q={q} area={area} information={information} place={place} askPlace={fieldInPage} refining={refining} wait={config.wait} onPlace={choose} onAskPlace={askAgain} />
        {placeDialog}
      </div>
    );
  }
  const field = <PlaceFilter key={placeId} place={place} fieldFirst onPlace={choose} />;
  // Services that are the same for everyone: a place would change nothing.
  const placeMatters = area.kind !== "services" || area.services.some((s) => !isCentral(s));
  // Tabs name the area already.
  const heading = tabs ? "visually-hidden" : "t-h2";

  const noServices = tabs ? <p>Zu „{q}“ haben wir keine Leistungen gefunden.</p> : null;
  const services =
    area.kind === "info" && !refining ? (
      !fieldInPage ? (
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
          {area.kind !== "needPlace" && placeMatters && !refining && fieldInPage && field}
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
        {!refining && area.kind === "needPlace" && askAgain && (
          <div className="t-lb__none t-askplace">
            <p>Ohne Ihren Ort können wir zu „{q}“ keine Leistungen zeigen.</p>
            <button type="button" className="t-btn t-btn--small" onClick={askAgain}>
              PLZ/Ort angeben
            </button>
          </div>
        )}
        {!refining && area.kind === "needPlace" && !askAgain && (
          <div className="t-lb__cover">
            <Ghost still />
            <div className="t-lb__overlay">
              <div className="t-lb__prompt">
                <RegionField label={PLACE_QUESTION} onPlace={choose} />
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
      {placeDialog}
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
