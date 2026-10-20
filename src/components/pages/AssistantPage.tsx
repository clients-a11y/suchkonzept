"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IconArrow, IconSparkle } from "@/components/Icons";
import { respond, startConversation } from "@/lib/assistant";
import type { AssistantEnv, BotMessage, Choice, Conversation, Effects } from "@/lib/assistant";
import { signIn, useAccount } from "@/lib/account-store";
import { allPlaces, setPlaceId, usePlaceId } from "@/lib/place-store";
import { useAllTenants, useCustomTenants } from "@/lib/tenant-store";
import { useDocumentTitle } from "@/lib/use-document-title";
import { origin } from "@/lib/origin";

function apply(effects: Effects) {
  if (effects.placeId) setPlaceId(effects.placeId);
  if (effects.signIn) signIn();
}

function BotItem({ message, active, onChoose, greeting }: { message: BotMessage; active: boolean; onChoose: (choice: Choice) => void; greeting: object }) {
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
          {choices.map((choice) => (
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

function Chat() {
  const { tenant, base } = useCurrentTenant();
  const params = useSearchParams();
  const tenants = useAllTenants();
  const custom = useCustomTenants();
  const placeId = usePlaceId();
  const account = useAccount();
  const ids = { log: useId(), input: useId(), hint: useId() };
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const interacted = useRef(false);
  const [conv, setConv] = useState<Conversation | null>(null);
  const [startEffects, setStartEffects] = useState<Effects>({});
  const [draft, setDraft] = useState("");

  const places = allPlaces(custom ?? []);
  const env: AssistantEnv = { tenant, base, tenants, places, placeId, account };

  // Start once the browser data is read (place, account). The search or another portal can hand
  // over a question, the place it already knows and where it came from.
  if (conv === null && account !== null && custom !== null) {
    const started = startConversation(env, {
      question: params.get("frage") ?? undefined,
      from: params.get("von") ?? undefined,
      place: params.get("ort") ?? undefined,
    });
    setConv(started.conv);
    setStartEffects(started.effects);
  }

  useEffect(() => apply(startEffects), [startEffects]);

  const count = conv?.messages.length ?? 0;
  useEffect(() => {
    if (!interacted.current) return;
    listRef.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [count]);

  const run = (input: { value: string; label?: string }) => {
    if (!conv) return;
    const next = respond(conv, input, env);
    interacted.current = true;
    setConv(next.conv);
    apply(next.effects);
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
    window.history.replaceState(null, "", `${base}/assistent`);
    inputRef.current?.focus();
  };

  const place = places.find((p) => p.id === placeId);
  const askingPlace = conv?.pending.kind === "place" || conv?.pending.kind === "pick";
  const last = conv?.messages[conv.messages.length - 1];
  const greeting = tenant.assistant?.greeting
    ? origin("mandant", "Mandant · Einstellung: Begrüßung und Einstiege")
    : origin("vorlage", "Vorlage · Begrüßung und Einstiege");

  return (
    <div className="t-chat" {...origin("zentral", "Zentral · Plattform: Assistent")}>
      <p className="t-chat__place">
        <span>
          Ihr Ort: <strong>{place ? place.name : "noch nicht angegeben"}</strong>
        </span>
        <button type="button" className="t-textbutton" onClick={() => choose({ label: "Ort ändern", value: "#ort-aendern" })} disabled={!conv}>
          {place ? "Ort ändern" : "Ort angeben"}
        </button>
      </p>

      <h2 id={ids.log} className="visually-hidden">
        Gesprächsverlauf
      </h2>
      <div role="log" aria-labelledby={ids.log} className="t-chat__log">
        <ol ref={listRef} className="t-chat__list">
          {conv?.messages.map((message) =>
            message.from === "user" ? (
              <li key={message.id} className="t-chat__msg t-chat__msg--user">
                <p className="t-chat__who">Sie</p>
                <p className="t-chat__bubble">{message.text}</p>
              </li>
            ) : (
              <BotItem key={message.id} message={message} active={message === last} onChoose={choose} greeting={greeting} />
            ),
          )}
        </ol>
        {!conv && <p className="t-chat__loading">Assistent wird geladen …</p>}
      </div>

      <form className="t-chat__composer" onSubmit={send}>
        <label htmlFor={ids.input} className="t-chat__label">
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
            aria-describedby={ids.hint}
          />
          <button type="submit" className="t-btn t-btn--primary" disabled={!conv}>
            Senden
          </button>
        </div>
        <p id={ids.hint} className="t-chat__hint">
          {askingPlace
            ? "Zum Beispiel 10200 oder Seehausen. Die Angabe bleibt nur in diesem Browser."
            : "Zum Beispiel „Mein Ausweis läuft ab“ oder „Wie ist der Stand meines Antrags?“"}
        </p>
      </form>

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
    </div>
  );
}

export function AssistantPage() {
  const { tenant, base } = useCurrentTenant();
  useDocumentTitle(`Assistent · ${tenant.name}`);
  const enabled = tenant.assistant?.enabled !== false;

  return (
    <div className="t-container t-page">
      <Breadcrumb items={[{ label: "Assistent", href: "/assistent" }]} />
      <h1 className="t-h1">Chat-Assistent</h1>
      <p className="t-lead">
        Beschreiben Sie Ihr Anliegen in eigenen Worten. Der Assistent fragt nach, was er für die Antwort braucht, und zeigt
        Ihnen die zuständige Stelle.
      </p>
      {!enabled ? (
        <div className="t-empty">
          <p>{tenant.name} bietet keinen Chat-Assistenten an. Die Suche hilft Ihnen weiter.</p>
          <Link href={`${base}/suche`} className="t-btn">
            Zur Suche
          </Link>
        </div>
      ) : (
        <>
          <p className="t-chat__notice">
            <IconSparkle size={16} />
            Automatischer Assistent, keine Person. Im Klick-Dummy lokal simuliert, ohne echte KI: Die Antworten stammen aus
            dem Leistungskatalog und den Angaben dieses Portals.
          </p>
          <div className="t-service">
            <div className="t-service__main">
              <Suspense fallback={<p className="t-chat__loading">Assistent wird geladen …</p>}>
                <Chat />
              </Suspense>
            </div>
            <div className="t-service__side">
              <section className="t-box" {...origin("mandant", "Mandant · Einstellung: Kontakt")}>
                <h2 className="t-box__title">Lieber mit einem Menschen sprechen?</h2>
                <p>
                  {tenant.contact.office}
                  <br />
                  Telefon {tenant.contact.phone}
                  <br />
                  {tenant.contact.hours}
                </p>
              </section>
              <section className="t-box t-box--quiet" {...origin("zentral", "Zentral · Plattform: Assistent")}>
                <h2 className="t-box__title">So arbeitet der Assistent</h2>
                <ul className="t-chat__rules">
                  <li>Er fragt nur, was er für die Antwort braucht.</li>
                  <li>Ihre Postleitzahl bleibt in diesem Browser.</li>
                  <li>Jede Antwort nennt ihre Quelle im Leistungskatalog oder auf diesem Portal.</li>
                  <li>Er ist eine automatische Hilfe, keine Person und keine Rechtsberatung.</li>
                </ul>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
