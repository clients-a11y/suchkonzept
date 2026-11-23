"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Place } from "@/data/places";
import { checkPlace } from "@/lib/place-store";

// Postcode or place on the results page. The label carries the wording of each case. focusOnMount: the field
// opened because the person asked for it.
export function RegionField({
  label,
  initial = "",
  focusOnMount = false,
  onPlace,
}: {
  label: string;
  initial?: string;
  focusOnMount?: boolean;
  onPlace: (place: Place) => void;
}) {
  const inputId = useId();
  const statusId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(initial);
  const [matches, setMatches] = useState<Place[]>([]);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

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
          ref={inputRef}
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
