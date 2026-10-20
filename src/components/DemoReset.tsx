"use client";

import { useState } from "react";
import { resetAccount } from "@/lib/account-store";
import { clearChats } from "@/lib/chat-store";
import { setShowOrigin } from "@/lib/origin";
import { setPlaceId } from "@/lib/place-store";

// Before a demo: every run starts the same. Tenants created in the wizard stay.
export function DemoReset() {
  const [status, setStatus] = useState("");
  return (
    <div className="pf-reset">
      <div>
        <h2 className="pf-h3">Vor der Vorführung</h2>
        <p className="pf-muted">
          Löscht den gemerkten Ort, das Demo-Konto mit Anträgen und Postfach, die Chatverläufe und den Schalter „Herkunft
          anzeigen“. Eigene Mandanten bleiben erhalten.
        </p>
      </div>
      <button
        type="button"
        className="pf-btn pf-btn--primary"
        onClick={() => {
          setPlaceId("");
          resetAccount();
          setShowOrigin(false);
          clearChats();
          setStatus("Zurückgesetzt. Die Vorführung startet wie beim ersten Besuch.");
        }}
      >
        Demo zurücksetzen
      </button>
      <p role="status" className="pf-reset__status">
        {status}
      </p>
    </div>
  );
}
