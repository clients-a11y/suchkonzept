"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Place } from "@/data/content";
import { findPlaces, setPlaceId, usePlaceId } from "@/lib/place-store";

// Postcode or place name in, remembered place out. Used by all portals of the platform.
export function PlaceFinder({ places, label }: { places: Place[]; label: string }) {
  const placeId = usePlaceId();
  const current = places.find((p) => p.id === placeId);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Place[] | null>(null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const currentRef = useRef<HTMLParagraphElement>(null);
  const focusNext = useRef<"input" | "current" | null>(null);
  const ids = { input: useId(), hint: useId() };

  useEffect(() => {
    if (focusNext.current === "input") inputRef.current?.focus();
    if (focusNext.current === "current") currentRef.current?.focus();
    focusNext.current = null;
  });

  const choose = (place: Place) => {
    setPlaceId(place.id);
    setMatches(null);
    setEditing(false);
    setQuery("");
    setStatus(`Ort gewählt: ${place.name}. Die zuständige Stelle wird angezeigt.`);
    focusNext.current = "current";
  };

  return (
    <div className="t-finder">
      {!current || editing ? (
        <form
          className="t-finder__form"
          onSubmit={(event) => {
            event.preventDefault();
            const found = findPlaces(query, places);
            if (found.length === 1) return choose(found[0]);
            setMatches(found);
            setStatus(
              found.length
                ? `${found.length} Orte gefunden. Bitte wählen Sie einen aus.`
                : "Kein Ort gefunden. Versuchen Sie es mit der Postleitzahl, zum Beispiel 10200.",
            );
          }}
        >
          <label htmlFor={ids.input} className="t-finder__label">
            {label}
          </label>
          <div className="t-finder__row">
            <input
              ref={inputRef}
              id={ids.input}
              className="t-input"
              value={query}
              autoComplete="off"
              aria-describedby={ids.hint}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" className="t-btn">
              Stelle finden
            </button>
          </div>
          <p id={ids.hint} className="t-finder__hint">
            Zum Beispiel 10200 oder Seehausen. Ihr Ort wird in diesem Browser für alle Portale gemerkt.
          </p>
        </form>
      ) : (
        <p className="t-finder__current" ref={currentRef} tabIndex={-1}>
          Ihr Ort: <strong>{current.name}</strong>
          {current.plz && ` (${current.plz[0]})`}
          <button
            type="button"
            className="t-textbutton"
            onClick={() => {
              setEditing(true);
              focusNext.current = "input";
            }}
          >
            Ort ändern
          </button>
        </p>
      )}
      {matches && matches.length > 1 && (
        <ul className="t-finder__matches">
          {matches.map((place) => (
            <li key={place.id}>
              <button type="button" className="t-chip" onClick={() => choose(place)}>
                {place.name}
                {place.plz && ` (${place.plz[0]})`}
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="t-finder__status" role="status">
        {status}
      </p>
    </div>
  );
}
