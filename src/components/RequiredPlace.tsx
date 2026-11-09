"use client";

import { useState } from "react";
import { IconAlert } from "@/components/Icons";
import { checkPlace, setPlaceId, usePlace } from "@/lib/place-store";

// The place as a required field of a search form, when a test asks for it together with the search term.
// fieldId: the input, which gets the focus when the place is missing.
export function useRequiredPlace(fieldId: string) {
  const stored = usePlace();
  // Empty until the person types: a remembered place stands in the field.
  const [text, setText] = useState<string | null>(null);
  const value = text ?? stored?.name ?? "";
  const [problem, setProblem] = useState("");
  // Sending again without a place shows the note anew, so the click visibly does something.
  const [tries, setTries] = useState(0);

  const change = (next: string) => {
    setText(next);
    setProblem("");
  };

  // Remembers the place and says whether the search may go on.
  const confirm = (): boolean => {
    const check = checkPlace(value);
    if (check.place) {
      setProblem("");
      setPlaceId(check.place.id);
      return true;
    }
    if (!value.trim()) setProblem("PLZ oder Ort fehlt. Ohne diese Angabe können wir nicht suchen.");
    else setProblem(check.matches.length > 1 ? `Zu „${value.trim()}“ passen mehrere Orte. Bitte geben Sie die Postleitzahl ein.` : check.problem);
    setTries((count) => count + 1);
    document.getElementById(fieldId)?.focus();
    return false;
  };

  return { value, problem, tries, change, confirm };
}

export function PlaceAlert({ id, problem, tries }: { id: string; problem: string; tries: number }) {
  return (
    <p id={id} role="status" className="t-smart__placestatus">
      {problem && (
        <span key={tries} className="t-smart__placealert">
          <IconAlert size={20} />
          {problem}
        </span>
      )}
    </p>
  );
}
