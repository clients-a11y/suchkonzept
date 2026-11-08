"use client";

import { useState } from "react";
import { resetAccount } from "@/lib/account-store";
import { clearChat } from "@/lib/chat-store";
import { setPlaceId } from "@/lib/place-store";

function resetDemo() {
  setPlaceId("");
  resetAccount();
  clearChat();
}

// A fresh start page: pages stay alive in the background, so only a real load also clears a search term
// still standing in the field and the state of the results page.
export function restartDemo() {
  resetDemo();
  // A client-side navigation would keep exactly the state this is meant to clear.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = "/";
}

// Before a demo: every run starts the same. Small in the footer, with an explanation on the test case page.
export function DemoReset({ explained = false }: { explained?: boolean }) {
  const [status, setStatus] = useState("");
  if (!explained) {
    return (
      <button type="button" className="t-footer__reset" onClick={restartDemo}>
        Demo zurücksetzen
      </button>
    );
  }
  return (
    <div className="t-reset">
      <div>
        <h2 className="t-h3">Vor der Vorführung</h2>
        <p>Löscht den gemerkten Wohnort, das Demo-Konto mit Anträgen und Postfach und den Chatverlauf.</p>
      </div>
      <button
        type="button"
        className="t-btn"
        onClick={() => {
          resetDemo();
          setStatus("Zurückgesetzt. Die Vorführung startet wie beim ersten Besuch.");
        }}
      >
        Demo zurücksetzen
      </button>
      <p role="status" className="t-reset__status">
        {status}
      </p>
    </div>
  );
}
