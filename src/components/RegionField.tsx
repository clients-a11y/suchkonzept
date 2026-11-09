"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import type { Place } from "@/data/places";
import { checkPlace } from "@/lib/place-store";

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
    const check = checkPlace(value);
    setMatches(check.matches.length > 1 ? check.matches : []);
    setProblem(check.problem);
    if (check.place) onPlace(check.place);
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
        {problem}
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
