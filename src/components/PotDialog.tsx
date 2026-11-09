"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { IconArrow, IconBubble, IconCheck, IconClose, IconPin } from "@/components/Icons";
import { LocateButton } from "@/components/LocateButton";
import { SearchPending } from "@/components/SearchPending";
import { PictogramApplication, PictogramNews, PictogramSwitch } from "@/components/PotIcons";
import type { Place } from "@/data/places";
import { SEARCH_PATH, SITE } from "@/data/site";
import { findPlaces, setPlaceId, usePlace } from "@/lib/place-store";
import { latencyFor, markEvaluated } from "@/lib/search-latency";
import type { Pot } from "@/lib/search-router";

const CHOICES: { pot: Pot; title: string; text: string; icon: ReactNode }[] = [
  { pot: "leistungen", title: "Etwas beantragen", text: "Zum Beispiel einen Ausweis, eine Ummeldung oder Kindergeld", icon: <PictogramApplication size={36} /> },
  { pot: "informationen", title: "Sich informieren", text: "Neuigkeiten, Erklärungen, Projekte und Ansprechpersonen", icon: <PictogramNews size={36} /> },
];

function searchHref(query: string, pot?: Pot): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (pot) params.set("in", pot);
  return `${SEARCH_PATH}?${params.toString()}`;
}

// The two answers to "Was suchen Sie?": links on the search page, buttons in the steps of the overlay.
export function PotChoices({ query, onPick }: { query: string; onPick?: (pot: Pot) => void }) {
  return (
    <ul className="t-route__choices">
      {CHOICES.map((choice) => {
        const inner = (
          <>
            <span className="t-route__icon">{choice.icon}</span>
            <span className="t-route__title">{choice.title}</span>
            {/* Read as two sentences, not as one long word. */}
            <span className="visually-hidden">. </span>
            <span className="t-route__text">{choice.text}</span>
            <span className="t-route__arrow" aria-hidden="true">
              <IconArrow size={18} />
            </span>
          </>
        );
        return (
          <li key={choice.pot}>
            {onPick ? (
              <button type="button" className="t-route__choice" onClick={() => onPick(choice.pot)}>
                {inner}
              </button>
            ) : (
              <Link href={searchHref(query, choice.pot)} className="t-route__choice">
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Postcode or place, checked as it is typed against the static list of places. A remembered place is
// shown and confirmed with one click.
function PlaceStep({ onConfirm }: { onConfirm: (place: Place) => void }) {
  const stored = usePlace();
  const [editing, setEditing] = useState(!stored);
  const [value, setValue] = useState("");
  const [tried, setTried] = useState(false);
  // Filled in by "Meinen Standort verwenden" (demo); typing clears it.
  const [located, setLocated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const ids = { input: useId(), hint: useId(), status: useId() };

  // "Anderen Ort angeben" and the step change from the first question move the focus into the field.
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  if (stored && !editing) {
    return (
      <div className="t-stepplace">
        <p className="t-stepplace__known">
          <IconCheck size={18} />
          <span>
            Ihr Wohnort: <strong>{stored.name}</strong>
          </span>
        </p>
        <div className="t-stepplace__actions">
          <button type="button" className="t-btn t-btn--primary" data-autofocus onClick={() => onConfirm(stored)}>
            Weiter mit {stored.name}
            <IconArrow size={18} />
          </button>
          <button type="button" className="t-btn" onClick={() => setEditing(true)}>
            Anderen Ort angeben
          </button>
        </div>
      </div>
    );
  }

  const text = value.trim();
  const digits = /^\d+$/.test(text);
  const ready = digits ? text.length === 5 : text.length >= 3;
  const matches = ready ? findPlaces(text) : [];
  const place = matches.length === 1 ? matches[0] : undefined;

  let status = "";
  let problem = false;
  if (place) status = `${digits ? `${text} · ` : ""}${place.name}${located ? ", ermittelt über Ihren Standort" : ""}`;
  else if (ready && matches.length === 0) {
    problem = true;
    status = digits ? `Die Postleitzahl ${text} gehört zu keinem Ort in ${SITE.region}.` : `Einen Ort „${text}“ kennen wir in ${SITE.region} nicht.`;
  } else if (matches.length > 1) status = `Zu „${text}“ passen mehrere Orte. Bitte wählen Sie Ihren Ort.`;
  else if (tried) {
    problem = true;
    status = "Bitte geben Sie Ihre Postleitzahl oder Ihren Ort ein.";
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (place) return onConfirm(place);
    setTried(true);
    inputRef.current?.focus();
  };

  return (
    <form className="t-stepplace" onSubmit={submit} noValidate>
      <label htmlFor={ids.input} className="t-stepplace__label">
        Postleitzahl oder Ort
      </label>
      <div className="t-stepplace__row">
        <input
          ref={inputRef}
          id={ids.input}
          className="t-input"
          value={value}
          data-autofocus
          autoComplete="postal-code"
          spellCheck={false}
          aria-describedby={`${ids.hint} ${ids.status}`}
          aria-invalid={problem || undefined}
          onChange={(event) => {
            setValue(event.target.value);
            setLocated(false);
          }}
        />
        <button ref={submitRef} type="submit" className="t-btn t-btn--primary">
          Weiter
          <IconArrow size={18} />
        </button>
      </div>
      <p id={ids.hint} className="t-stepplace__hint">
        Zum Beispiel 10200 oder Seehausen. Die Angabe bleibt nur in diesem Browser.
      </p>
      <LocateButton
        onFound={(postcode) => {
          setValue(postcode);
          setLocated(true);
          // The place is filled in; "Weiter" is the next thing to do.
          submitRef.current?.focus();
        }}
      />
      <p id={ids.status} role="status" className={place ? "t-stepplace__status t-stepplace__status--ok" : problem ? "t-stepplace__status t-stepplace__status--problem" : "t-stepplace__status"}>
        {place && <IconCheck size={16} />}
        {status}
      </p>
      {matches.length > 1 && (
        <ul className="t-homeplace__matches" aria-label="Passende Orte">
          {matches.map((p) => (
            <li key={p.id}>
              {/* Picking the place finishes the step, one click less than picking and then "Weiter". */}
              <button type="button" className="t-chip" onClick={() => onConfirm(p)}>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

// What the person asked for: a search the switch has placed (href), a search it could not place (no href:
// the question comes first) or a page picked from the suggestions (href and title). place: whether the
// place is asked; not for a service with one office for everyone, such as Kindergeld. wait: the search still
// has to judge the request, which later takes an AI 1 to 3 seconds.
export type SearchRequest = { query: string; href?: string; title?: string; place: boolean; wait?: boolean };

// Steps before a search: "Was suchen Sie?" when the switch is unsure, then the place, so the results can
// name the office in charge. A native modal dialog keeps the focus inside and closes with Escape.
export function SearchSteps({
  request,
  onClose,
  onDone,
  onChat,
  dismissLabel = "Suche abbrechen",
}: {
  request: SearchRequest | null;
  onClose: (dismissed: boolean) => void;
  onDone: (href: string) => void;
  onChat?: (q: string) => void;
  dismissLabel?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // Closed by finishing the steps or the chat, or dismissed (Escape, close button, dimmed area).
  const chosen = useRef(false);
  const titleId = useId();
  const twoSteps = Boolean(request && !request.href && request.place);
  const [shownFor, setShownFor] = useState<SearchRequest | null>(null);
  const [step, setStep] = useState<"wait" | "pot" | "place">("place");
  const [pot, setPot] = useState<Pot | undefined>();

  // A new request starts at its first step.
  if (request !== shownFor) {
    setShownFor(request);
    setStep(request?.wait ? "wait" : request && !request.href ? "pot" : "place");
    setPot(undefined);
  }

  useEffect(() => {
    const dialog = ref.current;
    if (request && dialog && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!request && dialog?.open) dialog.close();
  }, [request]);

  const close = () => ref.current?.close();

  const finish = (href: string) => {
    chosen.current = true;
    close();
    onDone(href);
  };

  // After the wait the search knows what comes next: a question, the place or straight to the results.
  const proceed = useEffectEvent(() => {
    if (!request) return;
    markEvaluated(request.query);
    if (!request.href) setStep("pot");
    else if (request.place) setStep("place");
    else finish(request.href);
  });

  useEffect(() => {
    if (step !== "wait" || !request) return;
    const timer = window.setTimeout(() => proceed(), latencyFor(request.query));
    return () => window.clearTimeout(timer);
  }, [step, request]);

  // A step that follows the wait starts at its first control.
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, [step]);

  const confirm = (place: Place) => {
    if (!request) return;
    setPlaceId(place.id);
    finish(request.href ?? searchHref(request.query, pot));
  };

  const query = request?.query ?? "";
  const placeLead = request?.title
    ? `Für „${request.title}“ nennen wir Ihnen die zuständige Stelle.`
    : query
      ? `Damit wir zu „${query}“ die zuständige Stelle nennen können.`
      : "Damit wir die zuständige Stelle nennen können.";

  return (
    <dialog
      ref={ref}
      className="t-potdialog"
      aria-labelledby={titleId}
      onClose={() => {
        onClose(!chosen.current);
        chosen.current = false;
      }}
      onClick={(event) => {
        // A click on the dimmed area next to the box closes it as well.
        if (event.target === ref.current) close();
      }}
    >
      {request && step === "wait" && (
        <div className="t-potdialog__box t-potdialog__box--wait">
          <h2 id={titleId} className="visually-hidden">
            Suche läuft
          </h2>
          <SearchPending />
        </div>
      )}
      {request && step !== "wait" && (
        <div className="t-potdialog__box">
          <div className="t-potdialog__head">
            <span className="t-potdialog__mark">{step === "pot" ? <PictogramSwitch size={28} /> : <IconPin size={26} />}</span>
            <div>
              {twoSteps && <p className="t-potdialog__step">Schritt {step === "pot" ? 1 : 2} von 2</p>}
              <h2 id={titleId} className="t-potdialog__title">
                {step === "pot" ? "Was suchen Sie?" : "Wo wohnen Sie?"}
              </h2>
              <p className="t-potdialog__lead">
                {step === "pot" ? `Zu „${query}“ gibt es Anträge und Informationen. Wählen Sie, was Sie gerade brauchen.` : placeLead}
              </p>
            </div>
            <button type="button" className="t-potdialog__close" onClick={close} aria-label={dismissLabel}>
              <IconClose size={20} />
            </button>
          </div>

          {twoSteps && (
            <ol className="t-dsteps" aria-label="Fortschritt">
              <li data-state={step === "pot" ? "current" : "done"}>
                <span aria-current={step === "pot" ? "step" : undefined}>Bereich wählen</span>
              </li>
              <li data-state={step === "place" ? "current" : "todo"}>
                <span aria-current={step === "place" ? "step" : undefined}>Wohnort angeben</span>
              </li>
            </ol>
          )}

          {step === "pot" ? (
            <PotChoices
              query={query}
              onPick={(next) => {
                if (!request.place) return finish(searchHref(query, next));
                setPot(next);
                setStep("place");
              }}
            />
          ) : (
            <PlaceStep key={shownFor ? `${shownFor.query}|${shownFor.href ?? ""}` : "none"} onConfirm={confirm} />
          )}

          {(step === "pot" ? onChat : twoSteps) && (
            <div className="t-potdialog__foot">
              {step === "pot" && onChat ? (
                <p className="t-potdialog__chat">
                  Nicht sicher?{" "}
                  <button
                    type="button"
                    className="t-textbutton t-potdialog__chatbutton"
                    onClick={() => {
                      chosen.current = true;
                      close();
                      onChat(query);
                    }}
                  >
                    <IconBubble size={16} />
                    Im Chat fragen
                  </button>
                </p>
              ) : (
                <button type="button" className="t-textbutton" onClick={() => setStep("pot")}>
                  Zurück zu Schritt 1
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
