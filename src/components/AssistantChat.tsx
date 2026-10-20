"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { IconArrow } from "@/components/Icons";
import { respond, startConversation } from "@/lib/assistant";
import type { AssistantEnv, BotMessage, Choice, Conversation, Effects } from "@/lib/assistant";
import { signIn, useAccount } from "@/lib/account-store";
import { allPlaces, setPlaceId, usePlaceId } from "@/lib/place-store";
import { useAllTenants, useCustomTenants } from "@/lib/tenant-store";
import { origin } from "@/lib/origin";

function apply(effects: Effects) {
  if (effects.placeId) setPlaceId(effects.placeId);
  if (effects.signIn) signIn();
}

function BotItem({ message, active, onChoose, greeting, maxChoices }: { message: BotMessage; active: boolean; onChoose: (choice: Choice) => void; greeting: object; maxChoices: number }) {
  const { office, list, facts, links, source, choices } = message;
  return (
    <li className="t-chat__msg t-chat__msg--bot" {...(message.greeting ? greeting : {})}>
      <p className="t-chat__who">Assistent</p>
      <div className="t-chat__bubble">
        {message.text.map((text) => (
          <p key={text}>{text}</p>
        ))}
        {office && (
          <p className="t-chat__office">
            <strong>{office.office}</strong>
            <br />
            {office.address}
            <br />
            Telefon {office.phone}
            {office.hours && (
              <>
                <br />
                {office.hours}
              </>
            )}
          </p>
        )}
        {list && (
          <ul className="t-chat__points">
            {list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {facts && (
          <dl className="t-chat__facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {links && links.length > 0 && (
          <ul className="t-chat__links">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={link.primary ? "t-btn t-btn--primary" : "t-more"}>
                  {link.label}
                  {!link.primary && <IconArrow size={16} />}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {source && (
          <p className="t-chat__source">
            Quelle: <Link href={source.href}>{source.label}</Link>
          </p>
        )}
      </div>
      {/* Only the latest message offers answers, older ones are history. */}
      {active && choices && choices.length > 0 && (
        <ul className="t-chat__choices" aria-label="Antwortvorschläge">
          {choices.slice(0, maxChoices).map((choice) => (
            <li key={choice.value}>
              <button type="button" className="t-chat__choice" onClick={() => onChoose(choice)}>
                {choice.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export type Handoff = { question?: string; from?: string; place?: string };
export type ChatRequest = { question?: string; restart?: boolean; nonce: number };

// The conversation itself: on its own page or in the small window (dock). The dock passes new
// questions as requests, the page passes what the search or another portal handed over.
export function AssistantChat({ variant, handoff, request }: { variant: "page" | "dock"; handoff?: Handoff; request?: ChatRequest }) {
  const { tenant, base } = useCurrentTenant();
  const tenants = useAllTenants();
  const custom = useCustomTenants();
  const placeId = usePlaceId();
  const account = useAccount();
  const ids = { log: useId(), input: useId(), hint: useId() };
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);
  const [conv, setConv] = useState<Conversation | null>(null);
  const [effects, setEffects] = useState<Effects>({});
  const [handled, setHandled] = useState(0);
  const [draft, setDraft] = useState("");
  const dock = variant === "dock";

  const places = allPlaces(custom ?? []);
  const env: AssistantEnv = { tenant, base, tenants, places, placeId, account };

  // Start once the browser data is read (place, account). The search or another portal can hand
  // over a question, the place it already knows and where it came from.
  if (conv === null && account !== null && custom !== null) {
    const started = startConversation(env, handoff ?? {});
    setConv(started.conv);
    setEffects(started.effects);
  } else if (conv && request && request.nonce !== handled) {
    // From outside: a new question (for example the search on the start page) or a fresh start.
    setHandled(request.nonce);
    const next = request.restart ? startConversation(env, {}) : respond(conv, { value: request.question ?? "" }, env);
    setConv(next.conv);
    setEffects(next.effects);
  }

  // Remembering the place and signing in reach other components, so they run after rendering.
  useEffect(() => apply(effects), [effects]);

  const count = conv?.messages.length ?? 0;
  useEffect(() => {
    if (dock) {
      const log = logRef.current;
      if (log) log.scrollTop = log.scrollHeight;
      return;
    }
    if (!interacted.current) return;
    listRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [count, dock]);

  const run = (input: { value: string; label?: string }) => {
    if (!conv) return;
    const next = respond(conv, input, env);
    interacted.current = true;
    setConv(next.conv);
    setEffects(next.effects);
  };

  const choose = (choice: Choice) => {
    run(choice);
    // The buttons disappear with the answer: keep the focus in the field.
    inputRef.current?.focus();
  };

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return inputRef.current?.focus();
    setDraft("");
    run({ value: text });
  };

  const restart = () => {
    const started = startConversation(env, {});
    interacted.current = false;
    setConv(started.conv);
    if (!dock) window.history.replaceState(null, "", `${base}/assistent`);
    inputRef.current?.focus();
  };

  const place = places.find((p) => p.id === placeId);
  const askingPlace = conv?.pending.kind === "place" || conv?.pending.kind === "pick";
  const last = conv?.messages[conv.messages.length - 1];
  const changePlace = (
    <button type="button" className="t-textbutton" onClick={() => choose({ label: "Ort ändern", value: "#ort-aendern" })} disabled={!conv}>
      {place ? "Ort ändern" : "Ort angeben"}
    </button>
  );
  const greeting = tenant.assistant?.greeting
    ? origin("mandant", "Mandant · Einstellung: Begrüßung und Einstiege")
    : origin("vorlage", "Vorlage · Begrüßung und Einstiege");

  return (
    <div className={dock ? "t-chat t-chat--dock" : "t-chat"} {...origin("zentral", "Zentral · Plattform: Assistent")}>
      {!dock && (
        <p className="t-chat__place">
          <span>
            Ihr Ort: <strong>{place ? place.name : "noch nicht angegeben"}</strong>
          </span>
          {changePlace}
        </p>
      )}

      <h2 id={ids.log} className="visually-hidden">
        Gesprächsverlauf
      </h2>
      {/* In the small window the history scrolls on its own, so it must be reachable by keyboard. */}
      <div ref={logRef} role="log" aria-labelledby={ids.log} className="t-chat__log" tabIndex={dock ? 0 : undefined}>
        <ol ref={listRef} className="t-chat__list">
          {conv?.messages.map((message) =>
            message.from === "user" ? (
              <li key={message.id} className="t-chat__msg t-chat__msg--user">
                <p className="t-chat__who">Sie</p>
                <p className="t-chat__bubble">{message.text}</p>
              </li>
            ) : (
              <BotItem
                key={message.id}
                message={message}
                active={message === last}
                onChoose={choose}
                greeting={greeting}
                maxChoices={dock ? 3 : 5}
              />
            ),
          )}
        </ol>
        {!conv && <p className="t-chat__loading">Assistent wird geladen …</p>}
      </div>

      <form className="t-chat__composer" onSubmit={send}>
        <label htmlFor={ids.input} className={dock ? "visually-hidden" : "t-chat__label"}>
          {askingPlace ? "Postleitzahl oder Ort" : "Ihre Nachricht"}
        </label>
        <div className="t-chat__row">
          <input
            ref={inputRef}
            id={ids.input}
            name="nachricht"
            type="text"
            className="t-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            autoComplete={askingPlace ? "postal-code" : "off"}
            enterKeyHint="send"
            placeholder={dock ? (askingPlace ? "Postleitzahl oder Ort" : "Ihre Nachricht") : undefined}
            aria-describedby={dock ? undefined : ids.hint}
          />
          <button type="submit" className="t-btn t-btn--primary" disabled={!conv}>
            Senden
          </button>
        </div>
        {dock ? (
          // In the small window: only the place, right where the postcode is typed.
          <p className="t-chat__placeline">
            Ihr Ort: <strong>{place ? place.name : "noch nicht angegeben"}</strong> · {changePlace}
          </p>
        ) : (
          <p id={ids.hint} className="t-chat__hint">
            {askingPlace
              ? "Zum Beispiel 10200 oder Seehausen. Die Angabe bleibt nur in diesem Browser."
              : "Zum Beispiel „Mein Ausweis läuft ab“ oder „Wie ist der Stand meines Antrags?“"}
          </p>
        )}
      </form>

      {!dock && (
        <div className="t-chat__tools">
          <button type="button" className="t-btn" onClick={() => choose({ label: "Einfacher erklären", value: "#einfach" })} disabled={!conv}>
            Einfacher erklären
          </button>
          <button type="button" className="t-btn" onClick={restart} disabled={!conv}>
            Neues Gespräch
          </button>
          <button type="button" className="t-btn" onClick={() => window.print()}>
            Verlauf drucken
          </button>
        </div>
      )}
    </div>
  );
}
