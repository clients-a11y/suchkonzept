"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { IconArrow, IconBubble, IconClose } from "@/components/Icons";
import { PictogramApplication, PictogramNews, PictogramSwitch } from "@/components/PotIcons";

// The two answers to "Was suchen Sie?": in the overlay and on the search page.
export function PotChoices({ query, onChoose }: { query: string; onChoose?: () => void }) {
  const href = (pot: string) => `/suche?${new URLSearchParams({ q: query, in: pot }).toString()}`;
  const choices = [
    { pot: "leistungen", title: "Etwas beantragen", text: "Zum Beispiel einen Ausweis, eine Ummeldung oder Kindergeld", icon: <PictogramApplication size={36} /> },
    { pot: "informationen", title: "Sich informieren", text: "Neuigkeiten, Erklärungen, Projekte und Ansprechpersonen", icon: <PictogramNews size={36} /> },
  ];
  return (
    <ul className="t-route__choices">
      {choices.map((choice) => (
        <li key={choice.pot}>
          <Link href={href(choice.pot)} className="t-route__choice" onClick={onChoose}>
            <span className="t-route__icon">{choice.icon}</span>
            <span className="t-route__title">{choice.title}</span>
            {/* Read as two sentences, not as one long word. */}
            <span className="visually-hidden">. </span>
            <span className="t-route__text">{choice.text}</span>
            <span className="t-route__arrow" aria-hidden="true">
              <IconArrow size={18} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// The search switch could not decide: the question opens over the page instead of a new page.
// A native modal dialog moves the focus inside, locks the page behind it and closes with Escape.
export function PotDialog({ query, onClose, onChat }: { query: string | null; onClose: (dismissed: boolean) => void; onChat?: (q: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  // Closed by a choice (a pot or the chat) or dismissed (Escape, close button, dimmed area).
  const chosen = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (query && dialog && !dialog.open) dialog.showModal();
    if (!query && dialog?.open) dialog.close();
  }, [query]);

  const close = () => ref.current?.close();
  const choose = () => {
    chosen.current = true;
    close();
  };

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
      {query && (
        <div className="t-potdialog__box">
          <div className="t-potdialog__head">
            <span className="t-potdialog__mark">
              <PictogramSwitch size={28} />
            </span>
            <div>
              <h2 id={titleId} className="t-potdialog__title">
                Was suchen Sie?
              </h2>
              <p className="t-potdialog__lead">
                Zu „{query}“ gibt es Anträge und Informationen. Wählen Sie, was Sie gerade brauchen.
              </p>
            </div>
            <button type="button" className="t-potdialog__close" onClick={close} aria-label="Frage schließen">
              <IconClose size={20} />
            </button>
          </div>
          <PotChoices query={query} onChoose={choose} />
          {onChat && (
            <div className="t-potdialog__foot">
              <p className="t-potdialog__chat">
                Nicht sicher?{" "}
                <button
                  type="button"
                  className="t-textbutton t-potdialog__chatbutton"
                  onClick={() => {
                    choose();
                    onChat(query);
                  }}
                >
                  <IconBubble size={16} />
                  Im Chat fragen
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
