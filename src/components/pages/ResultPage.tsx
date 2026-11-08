"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useState } from "react";
import { IconCheck, IconSparkle } from "@/components/Icons";
import { AnswerPlace, HitList, Loading, SearchHead, useArrival } from "@/components/pages/SearchPage";
import { RegionField } from "@/components/RegionField";
import { SearchPending } from "@/components/SearchPending";
import type { Place } from "@/data/places";
import { setPlaceId, usePlace } from "@/lib/place-store";
import { resultArea } from "@/lib/result-area";
import { latencyFor } from "@/lib/search-latency";
import { searchInformation } from "@/lib/smart-search";
import type { Service } from "@/lib/types";

// Services and information on one results page. The area for services on top changes with the case; the
// wording of its texts comes from the product owner.
const ACTION = "/ergebnisse";

function ServiceResult({ service, best }: { service: Service; best: boolean }) {
  return (
    <li className="t-answer">
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
      <AnswerPlace service={service} />
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

function Ghost() {
  return (
    <ol className="t-hits t-lb__ghost" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <li key={i} className="t-hit t-hit--skeleton">
          <span />
          <span />
          <span />
        </li>
      ))}
    </ol>
  );
}

function ResultBody({ q }: { q: string }) {
  const place = usePlace();
  const placeId = place?.id;
  const titles = { services: useId(), info: useId() };
  const ready = useArrival(q, latencyFor(q));
  // Only a place entered here turns a search for information into a search for services.
  const [enteredHere, setEnteredHere] = useState(false);
  const [refining, setRefining] = useState(false);

  useEffect(() => {
    if (!refining) return;
    const timer = window.setTimeout(() => setRefining(false), latencyFor(`${q}|${placeId}`));
    return () => window.clearTimeout(timer);
  }, [refining, q, placeId]);

  if (!ready) return <Loading thinking />;

  const choose = (next: Place) => {
    setPlaceId(next.id);
    setEnteredHere(true);
    setRefining(true);
  };

  const area = resultArea(q, place, enteredHere);
  const information = searchInformation(q);
  const field = <RegionField key={placeId} label="PLZ/Ort für regionale Ergebnisse" initial={place?.name ?? ""} onPlace={choose} />;
  // Services with one office for everyone: a place would change nothing.
  const placeMatters = area.kind !== "services" || area.services.some((s) => s.level !== "land");

  return (
    <div className="t-results t-lbpage">
      <p className="t-search__summary" role="status">
        Ergebnisse für „{q}“
      </p>

      {area.kind === "info" && !refining ? (
        <section className="t-lb t-lb--small" aria-label="Leistungen in Ihrer Region">
          <RegionField label="Gibt es dazu eine Leistung in Ihrer Region? PLZ/Ort eingeben" onPlace={choose} />
        </section>
      ) : (
        <section className="t-lb" aria-labelledby={titles.services}>
          <div className="t-lb__head">
            <h2 id={titles.services} className="t-h2">
              Leistungen
            </h2>
            {area.kind !== "needPlace" && placeMatters && !refining && field}
          </div>
          {refining && <SearchPending />}
          {!refining && area.kind === "services" && (
            <ul className="t-lb__services">
              {area.services.map((service) => (
                <ServiceResult key={service.slug} service={service} best={area.services.length === 1} />
              ))}
            </ul>
          )}
          {!refining && area.kind === "needPlace" && (
            <div className="t-lb__cover">
              <Ghost />
              <div className="t-lb__overlay">
                <div className="t-lb__prompt">
                  <RegionField label="Bitte geben Sie Ihre PLZ oder Ihren Ort für regionale Ergebnisse ein" onPlace={choose} />
                </div>
              </div>
            </div>
          )}
          {!refining && area.kind === "nothing" && (
            <p className="t-lb__none" role="status">
              Für diesen Ort gibt es keine regionalen Leistungen, vielleicht helfen Ihnen die Informationen unten weiter.
            </p>
          )}
        </section>
      )}

      <section className="t-lb__info" aria-labelledby={titles.info}>
        <h2 id={titles.info} className="t-h2">
          Informationen
        </h2>
        {information.length > 0 ? <HitList hits={information} /> : <p>Zu „{q}“ haben wir keine Informationen gefunden.</p>}
      </section>
    </div>
  );
}

function Results() {
  const q = (useSearchParams().get("q") ?? "").trim();
  return (
    <>
      <SearchHead q={q} action={ACTION} />
      <div className="t-container t-page">
        {/* A new search starts over: new wait, no place entered yet. */}
        {q ? <ResultBody key={q} q={q} /> : <p className="t-search__summary">Geben Sie oben ein, was Sie suchen.</p>}
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
