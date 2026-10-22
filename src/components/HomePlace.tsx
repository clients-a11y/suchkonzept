"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { IconCheck } from "@/components/Icons";
import { LocateButton } from "@/components/LocateButton";
import { PLACES } from "@/data/places";
import type { Place } from "@/data/places";
import { SITE } from "@/data/site";
import { findPlaces, setPlaceId, usePlaceId } from "@/lib/place-store";
import { normalize } from "@/lib/smart-search";

// Place of residence, asked only where it matters (a municipal service). Checked as it is typed,
// without a database: the postcode ranges are static data. A known place shows instead.
export function HomePlace({
  label = "Wo wohnen Sie?",
  hint = "Dann zeigen wir die zuständige Stelle. Bleibt nur in diesem Browser.",
  onChosen,
}: {
  label?: string;
  hint?: string;
  onChosen?: (place: Place) => void;
}) {
  const places = PLACES;
  const placeId = usePlaceId();
  const ids = { input: useId(), hint: useId(), status: useId() };
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const stored = places.find((p) => p.id === placeId);

  // "Wohnort ändern" opens the field and moves the focus into it.
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const choose = (place: Place) => {
    setPlaceId(place.id);
    onChosen?.(place);
  };

  if (stored && !editing) {
    return (
      <p className="t-homeplace t-homeplace--known">
        <IconCheck size={16} />
        <span>
          Ihr Wohnort: <strong>{stored.name}</strong>
        </span>
        <button
          type="button"
          className="t-textbutton"
          onClick={() => {
            setValue("");
            setEditing(true);
          }}
        >
          Wohnort ändern
        </button>
      </p>
    );
  }

  const text = value.trim();
  const digits = /^\d+$/.test(text);
  const ready = digits ? text.length === 5 : text.length >= 3;
  const matches = ready ? findPlaces(text, places) : [];
  const exact = matches.length === 1 && (digits || normalize(matches[0].name) === normalize(text)) ? matches[0] : undefined;
  const current = exact && exact.id === placeId ? exact : undefined;

  let status = "";
  if (current) {
    status = `${digits ? `${text} · ` : ""}${current.name}. Gemerkt.`;
  } else if (ready && matches.length === 0) {
    status = digits ? `Die Postleitzahl ${text} gehört zu keinem Ort in ${SITE.region}.` : `Einen Ort „${text}“ kennen wir in ${SITE.region} nicht.`;
  } else if (matches.length > 1) {
    status = `Zu „${text}“ passen mehrere Orte. Wählen Sie Ihren Ort.`;
  }

  const update = (next: string) => {
    setValue(next);
    // Typing keeps the field open, even once a place is remembered.
    setEditing(true);
    const t = next.trim();
    const isDigits = /^\d+$/.test(t);
    const found = (isDigits ? t.length === 5 : t.length >= 3) ? findPlaces(t, places) : [];
    // A unique postcode or the full place name: remembered right away.
    if (found.length === 1 && (isDigits || normalize(found[0].name) === normalize(t))) choose(found[0]);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Enter confirms the place here and does not send the search.
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (matches.length === 1) {
      choose(matches[0]);
      setValue(matches[0].name);
    }
  };

  return (
    <div className="t-homeplace">
      <label htmlFor={ids.input} className="t-homeplace__label">
        {label}
      </label>
      <input
        ref={inputRef}
        id={ids.input}
        className="t-input t-homeplace__input"
        value={value}
        onChange={(event) => update(event.target.value)}
        onKeyDown={onKeyDown}
        autoComplete="postal-code"
        spellCheck={false}
        placeholder="Postleitzahl oder Ort"
        aria-describedby={`${ids.hint} ${ids.status}`}
      />
      <p id={ids.hint} className="t-homeplace__hint">
        {hint}
      </p>
      <LocateButton onFound={update} />
      <p id={ids.status} role="status" className={current ? "t-homeplace__status t-homeplace__status--ok" : "t-homeplace__status"}>
        {current && <IconCheck size={16} />}
        {status}
      </p>
      {matches.length > 1 && (
        <ul className="t-homeplace__matches" aria-label="Passende Orte">
          {matches.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                className="t-chip"
                onClick={() => {
                  choose(place);
                  setValue(place.name);
                  inputRef.current?.focus();
                }}
              >
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
