"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageLoading } from "@/components/pages/PageLoading";
import { ScenarioStart } from "@/components/ScenarioStart";
import { findScenario, homeOf, scenarioName, scenarioPath, scenarioSentence, taskHref } from "@/data/test-scenarios";
import type { FlowStep } from "@/data/test-scenarios";
import { markTeam, useSavedScenarios, useStoreReady } from "@/lib/test-config";

// One saved scenario, only what the moderator needs: what we want to find out, the task, the click path, when it
// counts as done, and the start.

const KIND_LABEL: Record<FlowStep["kind"], string> = { person: "Person", wait: "Warten", page: "Seite", end: "Ende" };

function Fact({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
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

export function UserTestDetailPage({ id }: { id: string }) {
  const ready = useStoreReady();
  const saved = useSavedScenarios().find((s) => s.id === id);
  const scenario = saved && findScenario(String(saved.scenarioId));

  // Who sets up a test here and then tries the task keeps the links to the scenarios.
  useEffect(() => markTeam(), []);

  if (!ready) return <PageLoading />;
  if (!saved || !scenario) {
    return (
      <main id="inhalt" tabIndex={-1} className="t-main">
        <div className="t-pagehead">
          <div className="t-container">
            <h1 className="t-h1">Szenario nicht gefunden</h1>
            <p className="t-lead">Es wurde gelöscht oder in einem anderen Browser angelegt.</p>
            <p>
              <Link href="/testszenarien" className="t-sback">
                Alle Szenarien
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  const { config } = saved;
  const name = scenarioName(scenario, config);
  const home = homeOf(scenario);

  return (
    <main id="inhalt" tabIndex={-1} className="t-main">
      <div className="t-pagehead">
        <div className="t-container">
          <p>
            <Link href="/testszenarien" className="t-sback">
              Alle Szenarien
            </Link>
          </p>
          <h1 className="t-h1">{scenario.label}</h1>
          <p className="t-lead">{scenarioSentence(scenario, config)}</p>
        </div>
      </div>

      <div className="t-container t-page t-layout">
        <div className="t-layout__main t-sdetail">
          <section className="t-sdetail__card">
            <h2 className="t-h3">Das wollen wir herausfinden</h2>
            <p>{saved.goal}</p>
          </section>

          <section className="t-sdetail__card">
            <h2 className="t-h3">Aufgabe</h2>
            <p className="t-scen__task">„{scenario.task}“</p>
            <dl className="t-sfacts">
              <Fact label="Suchbegriff">{scenario.term}</Fact>
              {home && config.place !== "none" && <Fact label="Postleitzahl">{`${home.plz} ${home.town}`}</Fact>}
            </dl>
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
            <h2 className="t-h3">Auswertung</h2>
            <dl className="t-sfacts">
              <Fact label="Geschafft, wenn">{scenario.success}</Fact>
              <Fact label="Danach fragen">{scenario.ask}</Fact>
            </dl>
          </section>
        </div>

        <aside className="t-layout__side" aria-label="Szenario starten">
          <section className="t-box t-box--accent t-sbox">
            <h2 className="t-box__title">Im Prototyp starten</h2>
            <div className="t-sbox__start">
              <ScenarioStart title={name} config={config}>
                Szenario starten
              </ScenarioStart>
            </div>
            <p className="t-box__note">Alle Eingaben werden gelöscht. Zurück über „Testszenarien“ im Footer.</p>
            <TaskLink href={taskHref(scenario, config)} />
          </section>
        </aside>
      </div>
    </main>
  );
}
