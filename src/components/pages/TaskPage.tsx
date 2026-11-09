"use client";

import { useSearchParams } from "next/navigation";
import { restartDemo } from "@/components/DemoReset";
import { IconArrow } from "@/components/Icons";
import { SITE } from "@/data/site";
import { configOfCode, homeOf, taskHref } from "@/data/test-scenarios";
import type { Scenario } from "@/data/test-scenarios";

// What a test person sees before the task: only the task and the two things to enter. The settings of the
// run travel in the address, nothing on this page names them or what the test looks at.
export function TaskPage({ scenario }: { scenario: Scenario }) {
  const config = configOfCode(useSearchParams().get("v"));
  const home = homeOf(scenario);

  return (
    <main id="inhalt" tabIndex={-1} className="t-task">
      <div className="t-task__inner">
        <p className="t-task__portal">{SITE.name}</p>
        <h1 className="t-task__title">Ihre Aufgabe</h1>
        <p className="t-task__text">{scenario.task}</p>

        <dl className="t-task__facts">
          <div>
            <dt>Suchen Sie nach</dt>
            <dd>{scenario.term}</dd>
          </div>
          {home && config.place !== "none" && (
            <div>
              <dt>Ihre Postleitzahl</dt>
              <dd>{home.plz}</dd>
              <dd className="t-task__town">{home.town}</dd>
            </div>
          )}
        </dl>

        <button type="button" className="t-btn t-btn--primary t-btn--large t-task__start" onClick={() => restartDemo(config, taskHref(scenario, config))}>
          Aufgabe starten
          <IconArrow size={20} />
        </button>

        <p className="t-task__note">Sagen Sie bitte laut, was Sie denken. Sie können nichts falsch machen, wir testen die Seite und nicht Sie.</p>
        <p className="t-task__sample">Prototyp mit Beispieldaten. Alle Orte, Stellen und Inhalte sind fiktiv.</p>
      </div>
    </main>
  );
}
