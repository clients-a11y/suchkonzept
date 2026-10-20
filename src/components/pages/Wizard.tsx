"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { TenantPreview } from "@/components/TenantPreview";
import { defaultContact, defaultFooter, defaultNav } from "@/data/tenants";
import { LANGUAGES } from "@/data/content";
import { INK, WHITE, contrast, formatRatio, isHex } from "@/lib/color";
import { formatClock } from "@/lib/format";
import { FONT_LABEL, saveCustomTenant, slugify, useAllTenants } from "@/lib/tenant-store";
import type { FontKey, PortalType, Tenant } from "@/lib/types";

type Draft = {
  name: string;
  kind: string;
  type: PortalType;
  tagline: string;
  region: string;
  primary: string;
  accent: string;
  surface: string;
  headingFont: FontKey;
  radius: number;
  nav: string[];
  meta: Tenant["meta"];
  languages: string[];
};

const KINDS = ["Land", "Landkreis", "Stadt", "Gemeinde", "Verband"];
const TYPE_LABEL: Record<PortalType, string> = { info: "Informationsportal", service: "Serviceportal" };
const STEPS = ["Steckbrief", "Theme", "Struktur", "Prüfen und anlegen"];
const EDIT_STEPS = ["Steckbrief", "Theme", "Struktur", "Prüfen und speichern"];
const PRESETS = [
  { name: "Moor", primary: "#2e5e4e", accent: "#e0b94a", surface: "#f1f5f2" },
  { name: "Ziegel", primary: "#8c3b2e", accent: "#e7b75f", surface: "#f8f1ee" },
  { name: "Nacht", primary: "#1f3a5f", accent: "#f2c14e", surface: "#eef2f7" },
];
const RADII = [
  { value: 2, label: "Kantig" },
  { value: 8, label: "Weich" },
  { value: 14, label: "Rund" },
];
const FONTS: FontKey[] = ["serif", "sans", "hyper"];
const FONT_VAR: Record<FontKey, string> = { serif: "var(--f-serif)", sans: "var(--f-sans)", hyper: "var(--f-hyper)" };
const META_LABEL: { key: keyof Tenant["meta"]; label: string }[] = [
  { key: "dgs", label: "Gebärdensprache" },
  { key: "ls", label: "Leichte Sprache" },
  { key: "es", label: "Einfache Sprache" },
];

// Wall clock for the stopwatch. Only called from event handlers and the interval.
function clock(): number {
  return Date.now();
}

// A saved tenant back into wizard fields. Defaults stay empty so they follow the portal type.
function draftFrom(tenant: Tenant): Draft {
  return {
    name: tenant.name,
    kind: tenant.kind,
    type: tenant.type,
    tagline: tenant.tagline === TYPE_LABEL[tenant.type] ? "" : tenant.tagline,
    region: tenant.region === tenant.name ? "" : tenant.region,
    primary: tenant.tokens.primary,
    accent: tenant.tokens.accent,
    surface: tenant.tokens.surface,
    headingFont: tenant.tokens.headingFont,
    radius: tenant.tokens.radius,
    nav: tenant.nav.map((item) => item.href),
    meta: { ...tenant.meta },
    languages: tenant.languages.filter((name) => name !== "Deutsch"),
  };
}

function initialDraft(): Draft {
  return {
    name: "",
    kind: "Stadt",
    type: "service",
    tagline: "",
    region: "",
    primary: PRESETS[0].primary,
    accent: PRESETS[0].accent,
    surface: PRESETS[0].surface,
    headingFont: "sans",
    radius: 8,
    nav: defaultNav("service").map((item) => item.href),
    meta: { dgs: false, ls: true, es: true },
    languages: [],
  };
}

function buildTenant(draft: Draft, id: string, seconds?: number): Tenant {
  const name = draft.name.trim();
  const tagline = draft.tagline.trim() || TYPE_LABEL[draft.type];
  const region = draft.region.trim() || name;
  const nav = defaultNav(draft.type).filter((item) => draft.nav.includes(item.href));
  return {
    id,
    name,
    kind: draft.kind,
    type: draft.type,
    tagline,
    region,
    tokens: {
      primary: draft.primary,
      accent: draft.accent,
      surface: draft.surface,
      headingFont: draft.headingFont,
      bodyFont: draft.headingFont === "hyper" ? "hyper" : "sans",
      radius: draft.radius,
    },
    nav,
    footer: defaultFooter(tagline, nav),
    meta: draft.meta,
    languages: ["Deutsch", ...draft.languages],
    contact: defaultContact(name, draft.type, region),
    custom: true,
    createdInSeconds: seconds,
  };
}

function uniqueId(name: string, taken: string[]): string {
  const base = slugify(name) || "mandant";
  const reserved = new Set(["neu", "bearbeiten", "zugang", ...taken]);
  let id = base;
  for (let n = 2; reserved.has(id); n++) id = `${base}-${n}`;
  return id;
}

function contrastChecks(draft: Draft) {
  return [
    { label: "Weiße Schrift auf der Primärfarbe", ratio: contrast(WHITE, draft.primary), fg: WHITE, bg: draft.primary },
    { label: "Primärfarbe als Schrift auf Weiß", ratio: contrast(draft.primary, WHITE), fg: draft.primary, bg: WHITE },
    { label: "Primärfarbe auf der Fläche", ratio: contrast(draft.primary, draft.surface), fg: draft.primary, bg: draft.surface },
    { label: "Text auf der Fläche", ratio: contrast(INK, draft.surface), fg: INK, bg: draft.surface },
  ].map((check) => ({ ...check, ok: check.ratio >= 4.5 }));
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const pickerId = useId();
  const hexId = useId();
  const errorId = useId();
  const [text, setText] = useState(value.toUpperCase());
  const [synced, setSynced] = useState(value);
  // Picker and presets change the value from outside: show it in the text field.
  if (value !== synced) {
    setSynced(value);
    setText(value.toUpperCase());
  }
  const normalized = (text.startsWith("#") ? text : `#${text}`).trim().toLowerCase();
  const valid = isHex(normalized);
  return (
    <div className="pf-color">
      <label htmlFor={pickerId} className="pf-label">
        {label}
      </label>
      <div className="pf-color__row">
        <input id={pickerId} className="pf-color__picker" type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        <label htmlFor={hexId} className="visually-hidden">
          {label} als Hex-Wert
        </label>
        <input
          id={hexId}
          className="pf-input pf-input--mono"
          value={text}
          spellCheck={false}
          autoComplete="off"
          maxLength={7}
          aria-invalid={!valid}
          aria-describedby={valid ? undefined : errorId}
          onChange={(event) => {
            const next = event.target.value;
            setText(next);
            const hex = (next.startsWith("#") ? next : `#${next}`).trim().toLowerCase();
            if (isHex(hex)) {
              setSynced(hex);
              onChange(hex);
            }
          }}
        />
      </div>
      {!valid && (
        <p id={errorId} className="pf-error">
          Hex-Wert mit sechs Stellen eingeben, zum Beispiel #2E5E4E.
        </p>
      )}
    </div>
  );
}

function Choice({
  name,
  checked,
  onChange,
  type = "radio",
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  type?: "radio" | "checkbox";
  children: ReactNode;
}) {
  return (
    <label className="pf-choice">
      <input type={type} name={name} checked={checked} onChange={onChange} />
      <span className="pf-choice__text">{children}</span>
    </label>
  );
}

// Without `editing` the wizard creates a tenant, with it the same steps change a saved one.
export function Wizard({ editing }: { editing?: Tenant }) {
  const all = useAllTenants();
  const [draft, setDraft] = useState<Draft>(() => (editing ? draftFrom(editing) : initialDraft()));
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(editing ? 3 : 0);
  const [doneIn, setDoneIn] = useState(0);
  const [nameError, setNameError] = useState("");
  const [navError, setNavError] = useState("");
  const [created, setCreated] = useState<Tenant | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [stoppedAt, setStoppedAt] = useState<number | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLInputElement>(null);
  const moved = useRef(false);

  const ids = {
    name: useId(),
    nameHint: useId(),
    nameError: useId(),
    kind: useId(),
    tagline: useId(),
    taglineHint: useId(),
    region: useId(),
    gate: useId(),
    navError: useId(),
  };

  useEffect(() => {
    if (startedAt === null || stoppedAt !== null) return;
    const timer = window.setInterval(() => setNow(clock()), 250);
    return () => window.clearInterval(timer);
  }, [startedAt, stoppedAt]);

  useEffect(() => {
    if (!moved.current) return;
    (created ? successRef : headingRef).current?.focus();
  }, [step, created]);

  const elapsed =
    startedAt === null ? 0 : Math.max(0, Math.floor(((stoppedAt ?? now) - startedAt) / 1000));

  const id = useMemo(
    () => editing?.id ?? uniqueId(draft.name, all.map((t) => t.id)),
    [editing, draft.name, all],
  );
  const preview = useMemo(() => buildTenant(draft, id, editing?.createdInSeconds), [draft, id, editing]);
  const steps = editing ? EDIT_STEPS : STEPS;
  const checks = contrastChecks(draft);
  const failing = checks.filter((c) => !c.ok);
  const themeBlocked = failing.length > 0;

  const update = (patch: Partial<Draft>) => {
    if (startedAt === null) {
      const t = clock();
      setStartedAt(t);
      setNow(t);
    }
    setDraft((d) => ({ ...d, ...patch }));
  };

  const goTo = (next: number) => {
    moved.current = true;
    setStep(next);
    setReached((r) => Math.max(r, next));
  };

  const next = (event: FormEvent) => {
    event.preventDefault();
    if (step === 0 && !draft.name.trim()) {
      setNameError("Geben Sie einen Namen ein. Er steht im Kopf des Portals und in der Adresse.");
      nameRef.current?.focus();
      return;
    }
    if (step === 1 && themeBlocked) return;
    if (step === 2 && draft.nav.length === 0) {
      setNavError("Wählen Sie mindestens einen Menüpunkt.");
      navRef.current?.focus();
      return;
    }
    if (step < 3) {
      goTo(step + 1);
      return;
    }
    const stop = clock();
    const seconds = startedAt === null ? 0 : Math.floor((stop - startedAt) / 1000);
    setStoppedAt(stop);
    setDoneIn(seconds);
    // Editing keeps the original creation time; the stopwatch only measures this change.
    const tenant = buildTenant(draft, id, editing ? editing.createdInSeconds : seconds);
    saveCustomTenant(tenant);
    moved.current = true;
    setCreated(tenant);
  };

  const restart = () => {
    moved.current = true;
    setDraft(initialDraft());
    setStep(0);
    setReached(0);
    setNameError("");
    setNavError("");
    setCreated(null);
    setStartedAt(null);
    setStoppedAt(null);
  };

  const status = startedAt === null ? "Startet mit der ersten Eingabe" : stoppedAt !== null ? "Gestoppt" : "Läuft";
  const navOptions = defaultNav(draft.type);

  return (
    <div className="pf-container pf-page">
      <div className="pf-wizard__head">
        <div>
          <h1 className="pf-h1 pf-h1--page">{editing ? "Mandanten bearbeiten" : "Neuen Mandanten anlegen"}</h1>
          <p className="pf-lead">
            {editing
              ? `Dieselben vier Schritte, mit den gespeicherten Werten von ${editing.name}. Änderungen gelten sofort für das Portal.`
              : "Vier Schritte, keine Zeile Code. Am Ende steht ein eigenes Portal unter eigener Adresse."}
          </p>
        </div>
        <div className="pf-clock">
          <span className="pf-clock__label">Zeit</span>
          <span className="pf-clock__time" role="timer">
            {formatClock(elapsed)}
          </span>
          <span className="pf-clock__hint">{status}</span>
        </div>
      </div>

      <ol className="pf-steps" aria-label="Fortschritt">
        {steps.map((label, index) => {
          const current = !created && index === step;
          const done = Boolean(created) || (index <= reached && index !== step);
          const content = (
            <>
              <span className="pf-steps__num">{index + 1}</span>
              <span className="pf-steps__label">{label}</span>
              {done && !current && <span className="visually-hidden"> (bearbeitet)</span>}
            </>
          );
          return (
            <li key={label} className="pf-steps__item" data-state={current ? "current" : done ? "done" : "todo"}>
              {!created && !current && index <= reached ? (
                <button type="button" className="pf-steps__link" onClick={() => goTo(index)}>
                  {content}
                </button>
              ) : (
                <span className="pf-steps__link" aria-current={current ? "step" : undefined}>
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="pf-wizard">
        <div className="pf-wizard__main">
          {created ? (
            <div className="pf-success">
              <h2 className="pf-h2" ref={successRef} tabIndex={-1}>
                {editing ? `${created.name} ist aktualisiert.` : `${created.name} ist live.`}
              </h2>
              <p className="pf-success__time">
                {editing ? "Gespeichert in " : "Angelegt in "}
                <span className="pf-success__clock">{formatClock(doneIn)}</span>, ohne Codeänderung.
              </p>
              <p className="pf-muted">
                Adresse <code className="pf-code">/{created.id}</code>. Der Mandant liegt im Speicher dieses Browsers und
                steht im Mandanten-Umschalter.
              </p>
              <p className="pf-actions">
                <Link href={`/${created.id}`} className="pf-btn pf-btn--primary">
                  Portal öffnen
                </Link>
                {!editing && (
                  <button type="button" className="pf-btn" onClick={restart}>
                    Weiteren Mandanten anlegen
                  </button>
                )}
                <Link href="/" className="pf-btn pf-btn--ghost">
                  Zur Übersicht
                </Link>
              </p>
            </div>
          ) : (
            <form className="pf-form" onSubmit={next} noValidate>
              <h2 className="pf-h2" ref={headingRef} tabIndex={-1}>
                <span className="pf-h2__step">Schritt {step + 1} von 4</span> {steps[step]}
              </h2>

              {step === 0 && (
                <>
                  <div className="pf-field">
                    <label htmlFor={ids.name} className="pf-label">
                      Name
                    </label>
                    <p id={ids.nameHint} className="pf-hint">
                      {editing ? "So heißt das Portal im Kopf. Die Adresse bleibt " : "So heißt das Portal im Kopf. Daraus entsteht die Adresse "}
                      <code className="pf-code">/{id}</code>.
                    </p>
                    <input
                      ref={nameRef}
                      id={ids.name}
                      className="pf-input"
                      value={draft.name}
                      maxLength={60}
                      autoComplete="off"
                      aria-invalid={Boolean(nameError)}
                      aria-describedby={nameError ? `${ids.nameHint} ${ids.nameError}` : ids.nameHint}
                      onChange={(event) => {
                        update({ name: event.target.value });
                        if (event.target.value.trim()) setNameError("");
                      }}
                    />
                    {nameError && (
                      <p id={ids.nameError} className="pf-error">
                        {nameError}
                      </p>
                    )}
                  </div>
                  <div className="pf-field">
                    <label htmlFor={ids.kind} className="pf-label">
                      Art der Verwaltung
                    </label>
                    <select
                      id={ids.kind}
                      className="pf-input"
                      value={draft.kind}
                      onChange={(event) => update({ kind: event.target.value })}
                    >
                      {KINDS.map((kind) => (
                        <option key={kind}>{kind}</option>
                      ))}
                    </select>
                  </div>
                  <fieldset className="pf-fieldset">
                    <legend className="pf-label">Portaltyp</legend>
                    <div className="pf-choices pf-choices--cards">
                      <Choice
                        name="type"
                        checked={draft.type === "info"}
                        onChange={() => update({ type: "info", nav: defaultNav("info").map((n) => n.href) })}
                      >
                        <strong>Informationsportal</strong>
                        <span className="pf-choice__desc">Meldungen, Themen und Politik vorn, Leistungen als eigener Bereich.</span>
                      </Choice>
                      <Choice
                        name="type"
                        checked={draft.type === "service"}
                        onChange={() => update({ type: "service", nav: defaultNav("service").map((n) => n.href) })}
                      >
                        <strong>Serviceportal</strong>
                        <span className="pf-choice__desc">Große Suche und Leistungen vorn, Meldungen weiter unten.</span>
                      </Choice>
                    </div>
                  </fieldset>
                  <div className="pf-field">
                    <label htmlFor={ids.tagline} className="pf-label">
                      Unterzeile (optional)
                    </label>
                    <p id={ids.taglineHint} className="pf-hint">
                      Steht unter dem Namen. Ohne Eingabe: „{TYPE_LABEL[draft.type]}“.
                    </p>
                    <input
                      id={ids.tagline}
                      className="pf-input"
                      value={draft.tagline}
                      maxLength={40}
                      autoComplete="off"
                      aria-describedby={ids.taglineHint}
                      onChange={(event) => update({ tagline: event.target.value })}
                    />
                  </div>
                  <div className="pf-field">
                    <label htmlFor={ids.region} className="pf-label">
                      Region (optional)
                    </label>
                    <input
                      id={ids.region}
                      className="pf-input"
                      value={draft.region}
                      maxLength={60}
                      autoComplete="off"
                      onChange={(event) => update({ region: event.target.value })}
                    />
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <fieldset className="pf-fieldset">
                    <legend className="pf-label">Vorschläge</legend>
                    <div className="pf-presets">
                      {PRESETS.map((preset) => {
                        const active =
                          draft.primary === preset.primary && draft.accent === preset.accent && draft.surface === preset.surface;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            className="pf-preset"
                            aria-pressed={active}
                            onClick={() => update({ primary: preset.primary, accent: preset.accent, surface: preset.surface })}
                          >
                            <span className="pf-preset__swatches" aria-hidden="true">
                              <span style={{ background: preset.primary }} />
                              <span style={{ background: preset.accent }} />
                              <span style={{ background: preset.surface }} />
                            </span>
                            {preset.name}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                  <div className="pf-colors">
                    <ColorField label="Primärfarbe" value={draft.primary} onChange={(hex) => update({ primary: hex })} />
                    <ColorField label="Akzentfarbe" value={draft.accent} onChange={(hex) => update({ accent: hex })} />
                    <ColorField label="Fläche" value={draft.surface} onChange={(hex) => update({ surface: hex })} />
                  </div>
                  <fieldset className="pf-fieldset">
                    <legend className="pf-label">Schrift für Überschriften</legend>
                    <div className="pf-choices">
                      {FONTS.map((font) => (
                        <Choice key={font} name="font" checked={draft.headingFont === font} onChange={() => update({ headingFont: font })}>
                          <span className="pf-choice__font" style={{ fontFamily: FONT_VAR[font] }}>
                            {FONT_LABEL[font]}
                          </span>
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="pf-fieldset">
                    <legend className="pf-label">Ecken</legend>
                    <div className="pf-choices pf-choices--row">
                      {RADII.map((r) => (
                        <Choice key={r.value} name="radius" checked={draft.radius === r.value} onChange={() => update({ radius: r.value })}>
                          <span className="pf-corner" style={{ borderTopLeftRadius: r.value * 1.5 }} aria-hidden="true" />
                          {r.label} <code className="pf-code">{r.value} px</code>
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                  <div className="pf-checks">
                    <h3 className="pf-h3">Kontrastprüfung</h3>
                    <p className="pf-hint">Jede Kombination braucht mindestens 4,5:1 (WCAG AA für Text).</p>
                    <ul>
                      {checks.map((check) => (
                        <li key={check.label} className="pf-check" data-ok={check.ok}>
                          <span className="pf-check__sample" style={{ background: check.bg, color: check.fg }} aria-hidden="true">
                            Aa
                          </span>
                          <span className="pf-check__label">{check.label}</span>
                          <span className="pf-check__ratio">
                            <code>{formatRatio(check.ratio)}</code> {check.ok ? "erfüllt" : "zu gering"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <fieldset className="pf-fieldset" aria-describedby={navError ? ids.navError : undefined}>
                    <legend className="pf-label">Menüpunkte</legend>
                    <p className="pf-hint">Vorlage für ein {TYPE_LABEL[draft.type]}. Die Seiten dahinter kommen aus der Vorlage.</p>
                    <div className="pf-choices">
                      {navOptions.map((item, index) => (
                        <label key={item.href} className="pf-choice">
                          <input
                            ref={index === 0 ? navRef : undefined}
                            type="checkbox"
                            checked={draft.nav.includes(item.href)}
                            onChange={(event) => {
                              const nav = event.target.checked
                                ? [...draft.nav, item.href]
                                : draft.nav.filter((href) => href !== item.href);
                              update({ nav });
                              if (nav.length) setNavError("");
                            }}
                          />
                          <span className="pf-choice__text">{item.label}</span>
                        </label>
                      ))}
                    </div>
                    {navError && (
                      <p id={ids.navError} className="pf-error">
                        {navError}
                      </p>
                    )}
                  </fieldset>
                  <fieldset className="pf-fieldset">
                    <legend className="pf-label">Plätze im Kopf</legend>
                    <p className="pf-hint">Links zu Angeboten in Gebärdensprache, Leichter und Einfacher Sprache.</p>
                    <div className="pf-choices">
                      {META_LABEL.map(({ key, label }) => (
                        <Choice
                          key={key}
                          type="checkbox"
                          name={key}
                          checked={draft.meta[key]}
                          onChange={() => update({ meta: { ...draft.meta, [key]: !draft.meta[key] } })}
                        >
                          {label}
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="pf-fieldset">
                    <legend className="pf-label">Weitere Sprachen</legend>
                    <p className="pf-hint">Deutsch ist immer dabei. Jede Sprache bekommt eine Platzhalterseite.</p>
                    <div className="pf-choices pf-choices--row">
                      {LANGUAGES.map((lang) => (
                        <Choice
                          key={lang.code}
                          type="checkbox"
                          name="languages"
                          checked={draft.languages.includes(lang.name)}
                          onChange={() =>
                            update({
                              languages: draft.languages.includes(lang.name)
                                ? draft.languages.filter((l) => l !== lang.name)
                                : [...draft.languages, lang.name],
                            })
                          }
                        >
                          <span lang={lang.code}>{lang.name}</span>
                        </Choice>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}

              {step === 3 && (
                <dl className="pf-review">
                  <div>
                    <dt>Steckbrief</dt>
                    <dd>
                      {preview.name}, {preview.kind}, {TYPE_LABEL[preview.type]}
                      <br />
                      Unterzeile: {preview.tagline}. Region: {preview.region}.
                      <br />
                      Adresse: <code className="pf-code">/{preview.id}</code>
                    </dd>
                    <dd>
                      <button type="button" className="pf-textbutton" onClick={() => goTo(0)}>
                        Steckbrief ändern
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt>Theme</dt>
                    <dd>
                      <span className="pf-review__swatches" aria-hidden="true">
                        <span style={{ background: draft.primary }} />
                        <span style={{ background: draft.accent }} />
                        <span style={{ background: draft.surface }} />
                      </span>
                      <code className="pf-code">
                        {draft.primary.toUpperCase()} · {draft.accent.toUpperCase()} · {draft.surface.toUpperCase()}
                      </code>
                      <br />
                      {FONT_LABEL[draft.headingFont]}, Ecken {draft.radius} px. Kontraste geprüft.
                    </dd>
                    <dd>
                      <button type="button" className="pf-textbutton" onClick={() => goTo(1)}>
                        Theme ändern
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt>Struktur</dt>
                    <dd>
                      Menü: {preview.nav.map((n) => n.label).join(", ")}
                      <br />
                      Im Kopf: {META_LABEL.filter((m) => draft.meta[m.key]).map((m) => m.label).join(", ") || "keine Plätze"}
                      <br />
                      Sprachen: {preview.languages.join(", ")}
                    </dd>
                    <dd>
                      <button type="button" className="pf-textbutton" onClick={() => goTo(2)}>
                        Struktur ändern
                      </button>
                    </dd>
                  </div>
                </dl>
              )}

              {step === 1 && themeBlocked && (
                <p id={ids.gate} className="pf-gate">
                  Weiter ist gesperrt: {failing.map((c) => `${c.label} erreicht nur ${formatRatio(c.ratio)}`).join(", ")}. Nötig
                  sind mindestens 4,5:1. Wählen Sie eine dunklere Primärfarbe oder eine hellere Fläche.
                </p>
              )}

              <div className="pf-form__nav">
                {step > 0 && (
                  <button type="button" className="pf-btn pf-btn--ghost" onClick={() => goTo(step - 1)}>
                    Zurück
                  </button>
                )}
                <button
                  type="submit"
                  className="pf-btn pf-btn--primary pf-form__next"
                  aria-disabled={step === 1 && themeBlocked ? true : undefined}
                  aria-describedby={step === 1 && themeBlocked ? ids.gate : undefined}
                >
                  {step === 3 ? (editing ? "Änderungen speichern" : "Mandanten anlegen") : "Weiter"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="pf-wizard__preview">
          <h2 className="pf-h3">Vorschau</h2>
          <div className="pf-preview">
            <TenantPreview tenant={created ?? preview} />
          </div>
          <p className="pf-muted pf-preview__caption">
            Startseite unter <code className="pf-code">/{created?.id ?? preview.id}</code>. Ändert sich mit jeder Eingabe.
          </p>
        </div>
      </div>
    </div>
  );
}
