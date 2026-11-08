"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { Place } from "@/data/places";
import { SITE } from "@/data/site";
import { findPlaces } from "@/lib/place-store";

// Postcode or place on the results page of variant 2. The label carries the wording of each case.
export function RegionField({
  label,
  initial = "",
  onPlace,
}: {
  label: string;
  initial?: string;
  onPlace: (place: Place) => void;
}) {
  const inputId = useId();
  const statusId = useId();
  const [value, setValue] = useState(initial);
  const [matches, setMatches] = useState<Place[]>([]);
  const [problem, setProblem] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const text = value.trim();
    const digits = /^\d+$/.test(text);
    setMatches([]);
    setProblem("");
    if (digits ? text.length !== 5 : text.length < 3) {
      setProblem("Bitte geben Sie eine Postleitzahl mit fünf Ziffern oder einen Ort ein.");
      return;
    }
    const found = findPlaces(text);
    if (found.length === 1) onPlace(found[0]);
    else if (found.length > 1) setMatches(found);
    else setProblem(digits ? `Die Postleitzahl ${text} gehört zu keinem Ort in ${SITE.region}.` : `Einen Ort „${text}“ kennen wir in ${SITE.region} nicht.`);
  };

  return (
    <form className="t-region" onSubmit={submit} noValidate>
      <label htmlFor={inputId} className="t-region__label">
        {label}
      </label>
      <div className="t-region__row">
        <input
          id={inputId}
          className="t-input"
          value={value}
          autoComplete="postal-code"
          spellCheck={false}
          aria-describedby={statusId}
          aria-invalid={problem ? true : undefined}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit" className="t-btn t-btn--primary">
          Anzeigen
        </button>
      </div>
      <p id={statusId} role="status" className="t-region__status">
        {problem || (matches.length > 1 ? `Zu „${value.trim()}“ passen mehrere Orte. Bitte wählen Sie Ihren Ort.` : "")}
      </p>
      {matches.length > 1 && (
        <ul className="t-homeplace__matches" aria-label="Passende Orte">
          {matches.map((place) => (
            <li key={place.id}>
              <button type="button" className="t-chip" onClick={() => onPlace(place)}>
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
