"use client";

import Link from "next/link";
import { useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DEMO_PERSON } from "@/data/forms";
import { STATUS_LABEL, advanceApplication, markRead, resetAccount, signIn, signOut, useAccount } from "@/lib/account-store";
import type { ApplicationStatus } from "@/lib/account-store";
import { formatDate, pluralize } from "@/lib/format";

const ORDER: ApplicationStatus[] = ["eingegangen", "in-bearbeitung", "erledigt"];

function Head({ title, lead }: { title: string; lead: string }) {
  return (
    <div className="t-pagehead">
      <div className="t-container">
        <Breadcrumb items={[{ label: "Nutzerkonto", href: "/konto" }]} />
        <h1 className="t-h1">{title}</h1>
        <p className="t-lead">{lead}</p>
      </div>
    </div>
  );
}

// One account for applications to the Land and to the municipalities.
export function AccountPage() {
  const account = useAccount();
  const [status, setStatus] = useState("");

  if (account === null) return <p className="t-container t-page t-loading">Konto wird geladen …</p>;

  if (!account.signedIn) {
    return (
      <>
        <Head
          title="Nutzerkonto"
          lead="Mit dem Nutzerkonto stellen Sie Anträge, verfolgen den Stand und bekommen Bescheide ins Postfach, egal ob das Land oder Ihre Gemeinde zuständig ist."
        />
        <div className="t-container t-page">
          <p className="t-actions">
            <button type="button" className="t-btn t-btn--primary t-btn--large" onClick={() => signIn()}>
              Mit Demo-Konto anmelden
            </button>
          </p>
          <p className="t-box__note">Prototyp: Es wird kein Passwort abgefragt. Das Demo-Konto gehört der fiktiven Person {DEMO_PERSON.name}.</p>
        </div>
      </>
    );
  }

  const unread = account.messages.filter((m) => !m.read).length;

  return (
    <>
      <Head title="Mein Konto" lead={`Angemeldet als ${DEMO_PERSON.name}. Hier sehen Sie Ihre Anträge und Nachrichten.`} />
      <div className="t-container t-page">
      <p role="status" className="t-notice">
        {status}
      </p>

      <div className="t-layout">
        <div className="t-layout__main">
          <section className="t-unit-section">
            <h2 className="t-h2">Meine Anträge</h2>
            {account.applications.length === 0 ? (
              <div className="t-empty">
                <p>Noch keine Anträge. Viele Leistungen lassen sich online beantragen.</p>
                <Link href="/leistungen" className="t-btn">
                  Leistungen ansehen
                </Link>
              </div>
            ) : (
              <ul className="t-apps">
                {account.applications.map((app) => {
                  const pos = ORDER.indexOf(app.status);
                  return (
                    <li key={app.id} className="t-app">
                      <p className="t-meta">
                        <time dateTime={app.submittedAt}>eingereicht am {formatDate(app.submittedAt)}</time>
                        <span>
                          Vorgang <code>{app.id}</code>
                        </span>
                      </p>
                      <h3 className="t-app__title">{app.serviceTitle}</h3>
                      <p className="t-app__office">Zuständig: {app.office}</p>
                      <ol className="t-progress" aria-label={`Status: ${STATUS_LABEL[app.status]}`}>
                        {ORDER.map((s, i) => (
                          <li key={s} className="t-progress__step" data-state={i < pos ? "done" : i === pos ? "current" : "todo"}>
                            <span aria-current={i === pos ? "step" : undefined}>{STATUS_LABEL[s]}</span>
                          </li>
                        ))}
                      </ol>
                      {app.status !== "erledigt" && (
                        <button
                          type="button"
                          className="t-textbutton t-app__demo"
                          onClick={() => {
                            advanceApplication(app.id);
                            setStatus(`${app.serviceTitle}: nächster Bearbeitungsschritt simuliert. Neue Nachricht im Postfach.`);
                          }}
                        >
                          Demo: nächsten Bearbeitungsschritt simulieren
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="t-unit-section">
            <h2 className="t-h2">
              Postfach{" "}
              {unread > 0 && <span className="t-count-badge">{pluralize(unread, "ungelesene Nachricht", "ungelesene Nachrichten")}</span>}
            </h2>
            {account.messages.length === 0 ? (
              <p>Keine Nachrichten.</p>
            ) : (
              <ul className="t-inbox">
                {account.messages.map((m) => (
                  <li key={m.id} className="t-inbox__item" data-read={m.read}>
                    <details
                      onToggle={(event) => {
                        if ((event.target as HTMLDetailsElement).open && !m.read) markRead(m.id);
                      }}
                    >
                      <summary>
                        <span className="t-inbox__subject">
                          {!m.read && <span className="visually-hidden">Ungelesen: </span>}
                          {m.subject}
                        </span>
                        <span className="t-inbox__meta">
                          {m.from} · {formatDate(m.date)}
                        </span>
                      </summary>
                      <p className="t-inbox__body">{m.body}</p>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="t-layout__side">
          <section className="t-box t-box--quiet">
            <h2 className="t-box__title">Persönliche Daten</h2>
            <dl className="t-person">
              <div>
                <dt>Name</dt>
                <dd>{DEMO_PERSON.name}</dd>
              </div>
              <div>
                <dt>Geburtsdatum</dt>
                <dd>{formatDate(DEMO_PERSON.birthday)}</dd>
              </div>
              <div>
                <dt>Anschrift</dt>
                <dd>{DEMO_PERSON.address}</dd>
              </div>
              <div>
                <dt>E-Mail</dt>
                <dd>{DEMO_PERSON.email}</dd>
              </div>
            </dl>
            <p className="t-box__note">Fiktive Person für den Prototyp.</p>
          </section>
          <section className="t-box">
            <h2 className="t-box__title">Konto</h2>
            <p className="t-actions">
              <button type="button" className="t-btn" onClick={() => signOut()}>
                Abmelden
              </button>
              <button
                type="button"
                className="t-btn"
                onClick={() => {
                  resetAccount();
                  setStatus("Demo-Daten gelöscht.");
                }}
              >
                Demo-Daten löschen
              </button>
            </p>
          </section>
        </div>
      </div>
      </div>
    </>
  );
}
