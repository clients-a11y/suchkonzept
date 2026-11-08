"use client";

import { useState } from "react";
import { resetAccount } from "@/lib/account-store";
import { clearChat } from "@/lib/chat-store";
import { setPlaceId } from "@/lib/place-store";

export function resetDemo() {
  setPlaceId("");
  resetAccount();
  clearChat();
}

// Before a demo: every run starts the same. Small in the footer, with an explanation on the test case page.
export function DemoReset({ explained = false }: { explained?: boolean }) {
  const [status, setStatus] = useState("");
  const button = (
    <button
      type="button"
      className={explained ? "t-btn" : "t-footer__reset"}
      onClick={() => {
        resetDemo();
        setStatus(explained ? "Zurückgesetzt. Die Vorführung startet wie beim ersten Besuch." : "Zurückgesetzt.");
      }}
    >
      Demo zurücksetzen
    </button>
  );
  if (!explained) {
    return (
      <>
        {button}
        <span role="status" className="t-footer__status">
          {status}
        </span>
      </>
    );
  }
  return (
    <div className="t-reset">
      <div>
        <h2 className="t-h3">Vor der Vorführung</h2>
        <p>Löscht den gemerkten Wohnort, das Demo-Konto mit Anträgen und Postfach und den Chatverlauf.</p>
      </div>
      {button}
      <p role="status" className="t-reset__status">
        {status}
      </p>
    </div>
  );
}
