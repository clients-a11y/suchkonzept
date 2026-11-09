"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { IconCheck } from "@/components/Icons";
import { ScenarioStart } from "@/components/ScenarioStart";
import { placeOf, scenarioPath, taskHref } from "@/data/test-scenarios";
import type { FlowStep, Scenario, TestConfig } from "@/data/test-scenarios";
import { saveScenarioConfig, useScenarioConfig } from "@/lib/test-config";

// One scenario: what the moderator reads out, the settings of the run, the click path, what we check, and the start.

const KIND_LABEL: Record<FlowStep["kind"], string> = { person: "Person", wait: "Warten", page: "Seite", end: "Ende" };

function Fact({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Choice<T extends string | number | boolean>({
  legend,
  hint,
  row = false,
  value,
  options,
  onChange,
}: {
  legend: string;
  hint?: string;
  row?: boolean;
  value: T;
  options: { value: T; label: string }[];
  onChange: (next: T) => void;
}) {
  const name = useId();
  const radios = options.map((option) => (
    <label key={String(option.value)} className="t-check">
      <input type="radio" name={name} checked={option.value === value} onChange={() => onChange(option.value)} />
      {option.label}
    </label>
  ));
  return (
    <fieldset className="t-fieldset">
      <legend>{legend}</legend>
      {row ? <div className="t-sconfig__row">{radios}</div> : radios}
      {hint && <p className="t-box__note">{hint}</p>}
    </fieldset>
  );
}

// The link a test person gets. The settings are in it, so it works on every device.
function TaskLink({ href }: { href: string }) {
  const [status, setStatus] = useState("");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(new URL(href, window.location.origin).href);
      setStatus("Link kopiert.");
    } catch {
      setStatus("Kopieren ging nicht. Öffnen Sie die Aufgabenseite und kopieren Sie die Adresse.");
    }
  };
  return (
    <div className="t-sbox__start">
      <h3 className="t-box__title">Für Testpersonen</h3>
      <p className="t-box__note">Die Aufgabenseite zeigt nur Aufgabe, Suchbegriff und Postleitzahl.</p>
      <button type="button" className="t-btn" onClick={copy}>
        Link kopieren
      </button>
      <Link href={href} className="t-btn">
        Aufgabenseite öffnen
      </Link>
      <p role="status" className="t-box__note">
        {status}
      </p>
    </div>
  );
}

export function UserTestDetailPage({ scenario }: { scenario: Scenario }) {
  const config = useScenarioConfig(scenario.id);
  const change = (patch: Partial<TestConfig>) => saveScenarioConfig(scenario.id, { ...config, ...patch });

  return (
    <main id="inhalt" tabIndex={-1} className="t-main">
      <div className="t-pagehead">
        <div className="t-container">
          <p>
            <Link href="/testszenarien" className="t-sback">
              Alle Szenarien
            </Link>
          </p>
          <div className="t-scard__top t-sdetail__top">
            <span className="t-scard__badge">{scenario.id}</span>
            <span className="t-scard__meta">{scenario.case}</span>
          </div>
          <h1 className="t-h1">{scenario.title}</h1>
          <p className="t-lead">{scenario.summary}</p>
        </div>
      </div>

      <div className="t-container t-page t-layout">
        <div className="t-layout__main t-sdetail">
          <section className="t-sdetail__card">
            <h2 className="t-h3">Ausgangslage</h2>
            <p className="t-scen__task">„{scenario.task}“</p>
            <p>Wohnortkarte: {scenario.home}</p>
          </section>

          <section className="t-sdetail__card">
            <h2 className="t-h3">Einstellungen für diesen Test</h2>
            <div className="t-sconfig">
              <Choice
                legend="Frage nach Postleitzahl oder Ort"
                value={config.place}
                options={[
                  { value: "start", label: "Im Suchformular auf der Startseite, als Pflichtfeld" },
                  { value: "overlay", label: "Im Overlay direkt nach der Suche, dahinter das Skeleton" },
                  { value: "results", label: "Erst auf der Ergebnisseite" },
                ]}
                onChange={(place) => change({ place })}
              />
              <Choice
                legend="Frage „Leistung oder Information“ bei unklaren Begriffen"
                row
                value={config.potOverlay}
                options={[
                  { value: true, label: "Im Overlay" },
                  { value: false, label: "Nicht fragen" },
                ]}
                onChange={(potOverlay) => change({ potOverlay })}
              />
              <Choice
                legend="Wartezeit bis zu den Ergebnissen"
                hint="Bei 5 und 10 Sekunden kommt nach 3 beziehungsweise 5 Sekunden ein Hinweis mit Ladeanimation dazu."
                row
                value={config.wait}
                options={[
                  { value: 3, label: "3 Sekunden" },
                  { value: 5, label: "5 Sekunden" },
                  { value: 10, label: "10 Sekunden" },
                ]}
                onChange={(wait) => change({ wait })}
              />
              <Choice
                legend="Darstellung der Ergebnisse"
                row
                value={config.results}
                options={[
                  { value: "list", label: "Eine Seite" },
                  { value: "tabs", label: "Zwei Tabs" },
                ]}
                onChange={(results) => change({ results })}
              />
            </div>
          </section>

          <section className="t-sdetail__card">
            <h2 className="t-h3">Klickpfad</h2>
            <ol className="t-path">
              {scenarioPath(scenario, config).map((step, i) => (
                <li key={i}>
                  <span className="t-path__no" data-kind={step.kind}>
                    {i + 1}
                  </span>
                  <span className="t-path__text">
                    <span className="t-path__kind">{KIND_LABEL[step.kind]}</span>
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="t-sdetail__card">
            <h2 className="t-h3">Was wir prüfen</h2>
            <ul className="t-checks">
              {scenario.observe.map((item) => (
                <li key={item}>
                  <IconCheck size={18} />
                  {item}
                </li>
              ))}
            </ul>
            <dl className="t-sfacts">
              <Fact label="Geschafft, wenn">{scenario.success}</Fact>
              <Fact label="Danach fragen">{scenario.ask}</Fact>
            </dl>
          </section>
        </div>

        <aside className="t-layout__side" aria-label="Szenario starten">
          <section className="t-box t-box--accent t-sbox">
            <h2 className="t-box__title">Im Prototyp starten</h2>
            <dl className="t-sfacts">
              <Fact label="Wohnort">{placeOf(scenario) ?? scenario.home}</Fact>
              <Fact label="Einstieg">Startseite, Suchfeld</Fact>
              <Fact label="Suchbegriff, falls nötig">{scenario.term}</Fact>
            </dl>
            <div className="t-sbox__start">
              <ScenarioStart title={scenario.title} config={config}>
                Szenario starten
              </ScenarioStart>
            </div>
            <p className="t-box__note">Alle Eingaben werden gelöscht, die Einstellungen bleiben. Zurück über „Testszenarien“ im Footer.</p>
            <TaskLink href={taskHref(scenario, config)} />
          </section>
        </aside>
      </div>
    </main>
  );
}
