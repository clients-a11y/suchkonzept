"use client";

import { useEffect, useRef, useState } from "react";
import { IconLocate } from "@/components/Icons";
import { findPlaces } from "@/lib/place-store";

// Demo of "Meinen Standort verwenden": shows how the browser's location could fill in the postcode.
// Nothing is asked from the browser; after a short wait the demo always finds the same postcode.
// In operation the portal would ask navigator.geolocation once, turn the coordinates into a postcode
// with a geodata service and remember only the place, never the coordinates.
export const DEMO_POSTCODE = "20100";
const WAIT_MS = 1200;

export function LocateButton({ onFound }: { onFound: (postcode: string) => void }) {
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const demoPlace = findPlaces(DEMO_POSTCODE)[0]?.name;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className="t-locate">
      <button
        type="button"
        className="t-locate__button"
        aria-disabled={busy || undefined}
        onClick={() => {
          if (busy) return;
          setBusy(true);
          timer.current = window.setTimeout(() => {
            setBusy(false);
            onFound(DEMO_POSTCODE);
          }, WAIT_MS);
        }}
      >
        {busy ? <span className="t-spinner" aria-hidden="true" /> : <IconLocate size={18} />}
        {busy ? "Standort wird ermittelt …" : "Meinen Standort verwenden"}
      </button>
      <span className="t-locate__note">Demo ohne echten Standort, findet immer {demoPlace}.</span>
    </div>
  );
}
