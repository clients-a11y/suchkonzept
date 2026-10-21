"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DEMO_PERSON, SERVICE_FORMS } from "@/data/forms";
import type { FormField } from "@/data/forms";
import { findService } from "@/data/services";
import { SITE } from "@/data/site";
import { signIn, submitApplication, useAccount } from "@/lib/account-store";
import type { Application } from "@/lib/account-store";
import { formatDate } from "@/lib/format";
import { responsibleOffice } from "@/lib/offices";
import { findPlaces, usePlace } from "@/lib/place-store";
import type { Place } from "@/data/places";
import type { Service } from "@/lib/types";
import { checkValue } from "@/lib/validate";

const STEPS = ["Anmelden", "Angaben", "Unterlagen", "Prüfen und absenden"];

const PREFILL = {
  "person-name": DEMO_PERSON.name,
  "person-geburt": DEMO_PERSON.birthday,
  "person-anschrift": DEMO_PERSON.address,
  "person-email": DEMO_PERSON.email,
};

const PERSON_FIELDS: FormField[] = [
  { id: "person-name", label: "Vor- und Nachname", type: "text", required: true },
  { id: "person-geburt", label: "Geburtsdatum", type: "date", required: true },
  { id: "person-anschrift", label: "Anschrift", type: "text", required: true, hint: "Straße, Hausnummer, Postleitzahl und Ort" },
  { id: "person-email", label: "E-Mail-Adresse", type: "text", required: true, hint: "Für Rückfragen zum Antrag" },
];

type Values = Record<string, string>;
type Errors = Record<string, string>;

function display(field: FormField, value: string): string {
  if (!value) return "keine Angabe";
  return field.type === "date" ? formatDate(value) : value;
}

function Field({ field, value, error, onChange }: { field: FormField; value: string; error?: string; onChange: (v: string) => void }) {
  const id = `feld-${field.id}`;
  const hintId = `${id}-hinweis`;
  const errorId = `${id}-fehler`;
  const describedBy = [field.hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    value,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    required: field.required,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
  };
  return (
    <div className="t-formfield">
      <label htmlFor={id} className="t-formfield__label">
        {field.label}
        {!field.required && <span className="t-formfield__optional"> (optional)</span>}
      </label>
      {field.hint && (
        <p id={hintId} className="t-formfield__hint">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="t-formfield__error">
          {error}
        </p>
      )}
      {field.type === "select" ? (
        <select className="t-select" {...common}>
          <option value="">Bitte wählen</option>
          {field.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea className="t-input t-textarea" rows={4} {...common} />
      ) : (
        <input
          className="t-input"
          type={field.type === "number" ? "text" : field.type}
          inputMode={field.type === "number" || field.check === "steuerid" ? "numeric" : undefined}
          spellCheck={field.check ? false : undefined}
          autoComplete={field.id === "person-name" ? "name" : field.id === "person-email" ? "email" : "off"}
          {...common}
        />
      )}
    </div>
  );
}

function validate(fields: FormField[], values: Values): Errors {
  const errors: Errors = {};
  for (const f of fields) {
    const v = (values[f.id] ?? "").trim();
    if (f.required && !v) errors[f.id] = `Bitte ausfüllen: ${f.label}`;
    else if (v && f.type === "number" && !/^\d+([.,]\d+)?$/.test(v)) errors[f.id] = `${f.label}: bitte nur Ziffern eingeben.`;
    else if (v && f.id === "person-email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) errors[f.id] = "Geben Sie eine E-Mail-Adresse im Format name@beispiel.de an.";
    else if (v && f.check) {
      const problem = checkValue(f.check, v);
      if (problem) errors[f.id] = problem;
    }
  }
  return errors;
}

// Who receives the application: the Land office, or the office of the remembered place. Without a
// remembered place the postcode in the address decides.
function officeName(service: Service, place: Place | undefined, address: string): string {
  const fromAddress = address.match(/\b\d{5}\b/)?.[0];
  const where = place ?? (fromAddress ? findPlaces(fromAddress)[0] : undefined);
  return responsibleOffice(service, where)?.office ?? `${SITE.contact.office} (leitet weiter an Ihre Gemeinde)`;
}

function ApplicationFlow({ service }: { service: Service }) {
  const account = useAccount();
  const place = usePlace();
  const serviceFields = SERVICE_FORMS[service.slug] ?? [];
  const [step, setStep] = useState<number | null>(null);
  const [values, setValues] = useState<Values>({});
  const [files, setFiles] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<Application | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const focus = useRef<"heading" | "summary" | null>(null);
  const confirmId = useId();

  useEffect(() => {
    if (focus.current === "heading") headingRef.current?.focus();
    if (focus.current === "summary") summaryRef.current?.focus();
    focus.current = null;
  });

  // Once signed in, personal data comes from the account (once, so edits are kept).
  if (account?.signedIn && !prefilled) {
    setPrefilled(true);
    setValues((old) => ({ ...PREFILL, ...old }));
  }

  if (account === null) return <p className="t-loading">Antrag wird geladen …</p>;

  // Signed in already: the account step is done.
  const current = step ?? (account.signedIn ? 1 : 0);
  const valuesNow = values;

  const go = (next: number) => {
    setErrors({});
    setStep(next);
    focus.current = "heading";
  };

  const fail = (found: Errors) => {
    setErrors(found);
    focus.current = "summary";
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (current === 1) {
      const found = validate([...PERSON_FIELDS, ...serviceFields], valuesNow);
      if (Object.keys(found).length) return fail(found);
      return go(2);
    }
    if (current === 2) return go(3);
    if (current === 3) {
      if (!confirmed) return fail({ [confirmId]: "Bestätigen Sie, dass Ihre Angaben richtig sind." });
      const all = [...PERSON_FIELDS, ...serviceFields];
      const application = submitApplication(
        {
          office,
          service: service.slug,
          serviceTitle: service.title,
          answers: all.map((f) => ({ label: f.label, value: display(f, valuesNow[f.id] ?? "") })),
          files: Object.values(files).filter(Boolean),
        },
        account.signedIn,
      );
      setDone(application);
      focus.current = "heading";
    }
  };

  const setValue = (id: string, v: string) => setValues((old) => ({ ...old, [id]: v }));
  const office = officeName(service, place, valuesNow["person-anschrift"] ?? "");
  const errorList = Object.entries(errors);
  const fieldOf = (id: string) => [...PERSON_FIELDS, ...serviceFields].find((f) => f.id === id);

  if (done) {
    return (
      <div className="t-applydone">
        <h2 className="t-h2" ref={headingRef} tabIndex={-1}>
          Ihr Antrag ist eingegangen.
        </h2>
        <p>
          Vorgangsnummer <code className="t-casenumber">{done.id}</code>
        </p>
        <p>
          Zuständig ist {done.office}. {account.signedIn ? "Die Eingangsbestätigung liegt in Ihrem Postfach." : "Ohne Konto gibt es keine Nachrichten im Postfach. Notieren Sie sich die Vorgangsnummer."}
        </p>
        <p className="t-box__note">Prototyp: Der Antrag wird nicht übermittelt, er bleibt nur in diesem Browser.</p>
        <p className="t-actions">
          {account.signedIn && (
            <Link href="/konto" className="t-btn t-btn--primary">
              Zum Postfach
            </Link>
          )}
          <Link href={`/leistungen/${service.slug}`} className="t-btn">
            Zurück zur Leistung
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <ol className="t-steps" aria-label="Fortschritt">
        {STEPS.map((label, i) => (
          <li key={label} className="t-steps__item" data-state={i === current ? "current" : i < current ? "done" : "todo"}>
            <span className="t-steps__num" aria-hidden="true">
              {i + 1}
            </span>
            <span aria-current={i === current ? "step" : undefined}>
              {label}
              {i < current && <span className="visually-hidden"> (erledigt)</span>}
            </span>
          </li>
        ))}
      </ol>

      <form className="t-applyform" onSubmit={submit} noValidate>
        <h2 className="t-h2" ref={headingRef} tabIndex={-1}>
          <span className="t-applyform__step">Schritt {current + 1} von 4</span> {STEPS[current]}
        </h2>

        {errorList.length > 0 && (
          <div className="t-errorsummary" ref={summaryRef} tabIndex={-1} role="alert">
            <h3 className="t-errorsummary__title">Bitte prüfen Sie Ihre Angaben</h3>
            <ul>
              {errorList.map(([id, text]) => (
                <li key={id}>
                  <a href={`#${fieldOf(id) ? `feld-${id}` : id}`}>{text}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {current === 0 && (
          <div className="t-signin">
            <p>Mit dem Nutzerkonto sind Ihre Daten schon eingetragen, und Bescheide kommen in Ihr Postfach.</p>
            <p className="t-actions">
              <button
                type="button"
                className="t-btn t-btn--primary"
                onClick={() => {
                  signIn();
                  go(1);
                }}
              >
                Mit Demo-Konto anmelden
              </button>
              <button type="button" className="t-btn" onClick={() => go(1)}>
                Ohne Konto weiter
              </button>
            </p>
            <p className="t-box__note">Prototyp: Es wird kein Passwort abgefragt. Das Demo-Konto gehört der fiktiven Person {DEMO_PERSON.name}.</p>
          </div>
        )}

        {current === 1 && (
          <>
            {account.signedIn && <p className="t-box__note">Aus Ihrem Nutzerkonto übernommen. Sie können alles ändern.</p>}
            <fieldset className="t-fieldset">
              <legend className="t-fieldset__legend">Antragstellende Person</legend>
              {PERSON_FIELDS.map((f) => (
                <Field key={f.id} field={f} value={valuesNow[f.id] ?? ""} error={errors[f.id]} onChange={(v) => setValue(f.id, v)} />
              ))}
            </fieldset>
            {serviceFields.length > 0 && (
              <fieldset className="t-fieldset">
                <legend className="t-fieldset__legend">Angaben zu „{service.title}“</legend>
                {serviceFields.map((f) => (
                  <Field key={f.id} field={f} value={valuesNow[f.id] ?? ""} error={errors[f.id]} onChange={(v) => setValue(f.id, v)} />
                ))}
              </fieldset>
            )}
          </>
        )}

        {current === 2 && (
          <fieldset className="t-fieldset">
            <legend className="t-fieldset__legend">Unterlagen hochladen</legend>
            <p className="t-box__note">Sie können Unterlagen auch später über das Postfach nachreichen. Im Prototyp werden keine Dateien übertragen.</p>
            {service.documents.map((doc, i) => (
              <div key={doc} className="t-formfield">
                <label htmlFor={`datei-${i}`} className="t-formfield__label">
                  {doc} <span className="t-formfield__optional">(optional)</span>
                </label>
                <input
                  id={`datei-${i}`}
                  type="file"
                  className="t-file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => setFiles((old) => ({ ...old, [doc]: event.target.files?.[0]?.name ?? "" }))}
                />
                {files[doc] && <p className="t-formfield__hint">Ausgewählt: {files[doc]}</p>}
              </div>
            ))}
          </fieldset>
        )}

        {current === 3 && (
          <>
            <dl className="t-review">
              {[...PERSON_FIELDS, ...serviceFields].map((f) => (
                <div key={f.id}>
                  <dt>{f.label}</dt>
                  <dd>{display(f, valuesNow[f.id] ?? "")}</dd>
                </div>
              ))}
              <div>
                <dt>Unterlagen</dt>
                <dd>{Object.values(files).filter(Boolean).join(", ") || "werden nachgereicht"}</dd>
              </div>
              <div>
                <dt>Zuständig</dt>
                <dd>{office}</dd>
              </div>
            </dl>
            <p>
              <button type="button" className="t-textbutton" onClick={() => go(1)}>
                Angaben ändern
              </button>
            </p>
            <div className="t-formfield">
              {errors[confirmId] && (
                <p id={`${confirmId}-fehler`} className="t-formfield__error">
                  {errors[confirmId]}
                </p>
              )}
              <label className="t-check">
                <input
                  id={confirmId}
                  type="checkbox"
                  checked={confirmed}
                  aria-invalid={errors[confirmId] ? true : undefined}
                  aria-describedby={errors[confirmId] ? `${confirmId}-fehler` : undefined}
                  onChange={(event) => setConfirmed(event.target.checked)}
                />
                Ich versichere, dass meine Angaben richtig und vollständig sind.
              </label>
            </div>
          </>
        )}

        {current > 0 && (
          <div className="t-applyform__nav">
            <button type="button" className="t-btn" onClick={() => go(current - 1)}>
              Zurück
            </button>
            <button type="submit" className="t-btn t-btn--primary">
              {current === 3 ? "Antrag absenden" : "Weiter"}
            </button>
          </div>
        )}
      </form>
    </>
  );
}

export function ApplicationPage({ slug }: { slug: string }) {
  const service = findService(slug);
  if (!service) return null;

  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb
            items={[
              { label: "Leistungen", href: "/leistungen" },
              { label: service.title, href: `/leistungen/${service.slug}` },
              { label: "Online-Antrag", href: `/antrag/${service.slug}` },
            ]}
          />
          <h1 className="t-h1">Online-Antrag: {service.title}</h1>
        </div>
      </div>
      <div className="t-container t-page t-narrow">
        {service.online ? (
          <ApplicationFlow service={service} />
        ) : (
          <div className="t-empty">
            <p>Für diese Leistung gibt es keinen Online-Antrag. Bitte vereinbaren Sie einen Termin vor Ort.</p>
            <Link href={`/leistungen/${service.slug}`} className="t-btn">
              Zurück zur Leistung
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
