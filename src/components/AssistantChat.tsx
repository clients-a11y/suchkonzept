"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { IconArrow } from "@/components/Icons";
import { respond, startConversation } from "@/lib/assistant";
import type { AssistantEnv, BotMessage, Choice, Conversation, Effects } from "@/lib/assistant";
import { signIn, useAccount } from "@/lib/account-store";
import { setPlaceId, usePlace, usePlaceId } from "@/lib/place-store";
import { loadChat, onChatChange, saveChat } from "@/lib/chat-store";

function apply(effects: Effects) {
  if (effects.placeId) setPlaceId(effects.placeId);
  if (effects.signIn) signIn();
}

function BotItem({ message, active, onChoose, maxChoices }: { message: BotMessage; active: boolean; onChoose: (choice: Choice) => void; maxChoices: number }) {
  const { office, list, facts, links, source, choices } = message;
  return (
    <li className="t-chat__msg t-chat__msg--bot">
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
                <Link href={link.href} className={link.primary ? "t-btn t-btn--primary t-btn--small" : "t-more"}>
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

export type Handoff = { question?: string; place?: string };
export type ChatRequest = { question?: string; place?: string; restart?: boolean; nonce: number };

// The conversation itself: on its own page or in the small window (dock). The dock passes new
// questions as requests, the page passes what the search handed over.
export function AssistantChat({ variant, handoff, request }: { variant: "page" | "dock"; handoff?: Handoff; request?: ChatRequest }) {
  const instance = useId();
  const placeId = usePlaceId();
  const place = usePlace();
  const account = useAccount();
  const ids = { log: useId(), input: useId(), hint: useId() };
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const interacted = useRef(false);
  const [conv, setConv] = useState<Conversation | null>(null);
  const [effects, setEffects] = useState<Effects>({});
  const [handled, setHandled] = useState(0);
  // Counts changes made here; only those are saved, so two open chats do not echo each other.
  const [changes, setChanges] = useState(0);
  const saved = useRef(0);
  const [draft, setDraft] = useState("");
  const dock = variant === "dock";

  const env: AssistantEnv = { placeId, account };

  // Start once the browser data is read (place, account). The search can hand over a question and
  // the place it already knows.
  if (conv === null && account !== null) {
    // A conversation from before (reload, the other view) continues, unless a new question comes in.
    const stored = handoff?.question ? null : loadChat();
    if (stored) {
      setConv(stored);
    } else {
      const started = startConversation(env, handoff ?? {});
      setConv(started.conv);
      setEffects(started.effects);
      setChanges((n) => n + 1);
    }
  } else if (conv && request && request.nonce !== handled) {
    // From outside: a new question (for example from the search) or a fresh start.
    setHandled(request.nonce);
    const base = request.place ? { ...conv, place: request.place } : conv;
    const next = request.restart ? startConversation(env, {}) : respond(base, { value: request.question ?? "" }, env);
    setConv(next.conv);
    setEffects(next.effects);
    setChanges((n) => n + 1);
  }

  // Remembering the place and signing in reach other components, so they run after rendering.
  useEffect(() => apply(effects), [effects]);

  // The conversation survives a reload and is shared by the window and the assistant page.
  useEffect(() => {
    if (!conv || changes === saved.current) return;
    saved.current = changes;
    saveChat(conv, instance);
  }, [conv, changes, instance]);

  useEffect(
    () =>
      onChatChange((change) => {
        if (change.reset) return setConv(null);
        if (change.source === instance) return;
        const stored = loadChat();
        if (stored) setConv(stored);
      }),
    [instance],
  );

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
    setChanges((n) => n + 1);
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
    setChanges((n) => n + 1);
    if (!dock) window.history.replaceState(null, "", "/assistent");
    inputRef.current?.focus();
  };

  const askingPlace = conv?.pending.kind === "place" || conv?.pending.kind === "pick";
  const last = conv?.messages[conv.messages.length - 1];
  const changePlace = (
    <button type="button" className="t-textbutton" onClick={() => choose({ label: "Ort ändern", value: "#ort-aendern" })} disabled={!conv}>
      {place ? "Ort ändern" : "Ort angeben"}
    </button>
  );

  return (
    <div className={dock ? "t-chat t-chat--dock" : "t-chat"}>
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
              <BotItem key={message.id} message={message} active={message === last} onChoose={choose} maxChoices={dock ? 3 : 5} />
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
            placeholder={dock ? (askingPlace ? "Postleitzahl oder Ort" : "Ihr Anliegen in eigenen Worten") : undefined}
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
          <button type="button" className="t-btn t-btn--small" onClick={() => choose({ label: "Einfacher erklären", value: "#einfach" })} disabled={!conv}>
            Einfacher erklären
          </button>
          <button type="button" className="t-btn t-btn--small" onClick={restart} disabled={!conv}>
            Neues Gespräch
          </button>
          <button type="button" className="t-btn t-btn--small" onClick={() => window.print()}>
            Verlauf drucken
          </button>
        </div>
      )}
    </div>
  );
}
