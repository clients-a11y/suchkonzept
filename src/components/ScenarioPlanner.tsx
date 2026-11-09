"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { IconArrow } from "@/components/Icons";
import { DEFAULT_CONFIG, SCENARIOS, defaultConfig, findScenario, homeOf, scenarioName, scenarioSentence } from "@/data/test-scenarios";
import type { SavedScenario, Scenario, TestConfig } from "@/data/test-scenarios";
import { findPlaces } from "@/lib/place-store";
import { resultArea } from "@/lib/result-area";
import { searchInformation } from "@/lib/smart-search";
import { deleteScenario, markTeam, saveScenario, useSavedScenarios } from "@/lib/test-config";

// The two tabs of the tests: the saved scenarios, and the configurator that makes a scenario from a case and a
// flow. A saved scenario can be opened or deleted, not changed, so that test runs stay comparable.

export type TestsTab = "szenarien" | "konfigurator";

const TABS: { tab: TestsTab; label: string; href: string }[] = [
  { tab: "szenarien", label: "Szenarien", href: "/testszenarien" },
  { tab: "konfigurator", label: "Konfigurator", href: "/testszenarien/konfigurator" },
];

export function TestsTabs({ active }: { active: TestsTab }) {
  // Who sets up tests here and then tries a task keeps the links to the scenarios.
  useEffect(() => markTeam(), []);

  return (
    <nav aria-label="Testszenarien" className="t-pottabs">
      <ul>
        {TABS.map(({ tab, label, href }) => (
          <li key={tab}>
            <Link href={href} className="t-pottab" aria-current={tab === active ? "page" : undefined}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const PLACE_LABEL: Record<TestConfig["place"], string> = {
  none: "Gar nicht",
  start: "Im Suchformular auf der Startseite, als Pflichtfeld",
  overlay: "Im Overlay direkt nach der Suche, dahinter das Skeleton",
  results: "Erst auf der Ergebnisseite",
};

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

const PLACE_ON_CARD: Record<TestConfig["place"], string> = {
  none: "Gar nicht",
  start: "Im Suchformular",
  overlay: "Im Overlay",
  results: "Auf der Ergebnisseite",
};

function example(scenario: Scenario, place: TestConfig["place"]): string {
  return place === "none" ? scenario.term : `${scenario.term}, ${homeOf(scenario)?.plz}`;
}

function Param({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function sameConfig(a: TestConfig, b: TestConfig): boolean {
  return a.place === b.place && a.potOverlay === b.potOverlay && a.wait === b.wait && a.results === b.results && a.maxServices === b.maxServices && a.maxInfos === b.maxInfos && a.topicServices === b.topicServices;
}

// What the example data holds for a case. A higher number could be set but never appear.
function available(scenario: Scenario): { services: number; infos: number } {
  const home = homeOf(scenario);
  const place = home ? findPlaces(home.plz)[0] : undefined;
  const area = resultArea(scenario.term, place, true, undefined, Infinity, Infinity);
  return { services: area.kind === "services" ? area.services.length : 0, infos: searchInformation(scenario.term).length };
}

function amount(count: number): string {
  return count === 0 ? "keine" : "eine";
}

export function ScenarioConfigurator() {
  const router = useRouter();
  const saved = useSavedScenarios();
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [config, setConfig] = useState(() => defaultConfig(SCENARIOS[0]));
  const [goal, setGoal] = useState(SCENARIOS[0].goal);
  const [status, setStatus] = useState("");
  const caseName = useId();
  const titleId = useId();
  const goalId = useId();

  const found = available(scenario);
  const serviceCounts = ([1, 2, 3, 5] as const).filter((count) => count <= found.services);
  const topicCounts = ([0, 1, 2, 3] as const).filter((count) => count <= found.services);
  const infoCounts = ([1, 3, 5] as const).filter((count) => count < found.infos);

  const pick = (next: Scenario) => {
    setScenario(next);
    setConfig({ ...config, place: next.places[0], potOverlay: true, maxServices: DEFAULT_CONFIG.maxServices, maxInfos: DEFAULT_CONFIG.maxInfos, topicServices: DEFAULT_CONFIG.topicServices });
    setGoal(next.goal);
    setStatus("");
  };

  const change = (patch: Partial<TestConfig>) => {
    setConfig({ ...config, ...patch });
    setStatus("");
  };

  const save = () => {
    const text = goal.trim();
    if (!text) {
      setStatus("Bitte tragen Sie ein, was wir herausfinden wollen.");
      document.getElementById(goalId)?.focus();
      return;
    }
    if (saved.some((s) => s.scenarioId === scenario.id && s.goal === text && sameConfig(s.config, config))) {
      setStatus("Dieses Szenario ist schon gespeichert.");
      return;
    }
    saveScenario({ id: Date.now().toString(36), scenarioId: scenario.id, config, goal: text });
    // The new scenario stands first in the list.
    router.push("/testszenarien");
  };

  return (
    <section className="t-konf" aria-labelledby={titleId}>
      <h2 id={titleId} className="t-h2">
        Konfigurator
      </h2>
      <div className="t-sconfig">
        <fieldset className="t-fieldset">
          <legend>Was soll die Suche finden?</legend>
          <div className="t-konf__cases">
            {SCENARIOS.map((option) => (
              <label key={option.id} className="t-check t-konf__case">
                <input type="radio" name={caseName} checked={option.id === scenario.id} onChange={() => pick(option)} />
                <span>
                  {option.label}
                  <span className="t-konf__example">{example(option, option.places[0])}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="t-box__note">{scenario.summary}</p>
        </fieldset>

        <div className="t-field">
          <label htmlFor={goalId}>Was wollen wir herausfinden?</label>
          <textarea
            id={goalId}
            className="t-input t-konf__goal"
            rows={2}
            value={goal}
            required
            onChange={(event) => {
              setGoal(event.target.value);
              setStatus("");
            }}
          />
        </div>

        <Choice
          legend="Wann fragen wir nach der PLZ?"
          value={config.place}
          options={scenario.places.map((place) => ({ value: place, label: PLACE_LABEL[place] }))}
          onChange={(place) => change({ place })}
        />
        {scenario.flow === "unclear" && (
          <Choice
            legend="Fragen wir „Leistung oder Information?“"
            row
            value={config.potOverlay}
            options={[
              { value: true, label: "Im Overlay" },
              { value: false, label: "Nicht fragen" },
            ]}
            onChange={(potOverlay) => change({ potOverlay })}
          />
        )}
        <Choice
          legend="Wie lange dauert die Suche?"
          hint="Bei 5 und 10 Sekunden kommt nach 3 beziehungsweise 5 Sekunden ein Hinweis mit Ladeanimation dazu."
          row
          value={config.wait}
          options={[
            { value: 2, label: "2 Sekunden" },
            { value: 3, label: "3 Sekunden" },
            { value: 5, label: "5 Sekunden" },
            { value: 10, label: "10 Sekunden" },
          ]}
          onChange={(wait) => change({ wait })}
        />
        {scenario.flow === "info" ? (
          <Choice
            legend="Wie viele Leistungen zeigen wir?"
            hint="Leistungen zum selben Thema, sie stehen unter den Informationen."
            row
            value={config.topicServices}
            options={topicCounts.map((count) => ({ value: count, label: count === 0 ? "Keine" : String(count) }))}
            onChange={(topicServices) => change({ topicServices })}
          />
        ) : serviceCounts.length > 1 ? (
          <Choice
            legend="Wie viele Leistungen zeigen wir?"
            hint="Die direkte Leistung steht immer an erster Stelle, danach folgen naheliegende Alternativen."
            row
            value={serviceCounts.find((count) => count === config.maxServices) ?? serviceCounts[serviceCounts.length - 1]}
            options={serviceCounts.map((count) => ({ value: count, label: String(count) }))}
            onChange={(maxServices) => change({ maxServices })}
          />
        ) : (
          <p className="t-box__note">Leistungen: In diesem Fall findet die Suche {amount(found.services)}, die Anzahl lässt sich nicht einstellen.</p>
        )}
        {found.infos > 1 ? (
          <Choice<TestConfig["maxInfos"]>
            legend="Wie viele Informationen zeigen wir höchstens?"
            row
            value={config.maxInfos}
            options={[...infoCounts.map((count) => ({ value: count, label: String(count) })), { value: "all", label: `Alle (${found.infos})` }]}
            onChange={(maxInfos) => change({ maxInfos })}
          />
        ) : (
          <p className="t-box__note">Informationen: In diesem Fall findet die Suche {amount(found.infos)}, die Anzahl lässt sich nicht einstellen.</p>
        )}
        <Choice
          legend="Wie stehen die Ergebnisse da?"
          row
          value={config.results}
          options={[
            { value: "list", label: "Auf einer Seite" },
            { value: "tabs", label: "In zwei Tabs" },
          ]}
          onChange={(results) => change({ results })}
        />
      </div>

      <div className="t-konf__save">
        <p>
          <strong>Ablauf:</strong> {scenarioSentence(scenario, config)}
        </p>
        <button type="button" className="t-btn t-btn--primary" onClick={save}>
          Szenario speichern
        </button>
        <p role="status" className="t-box__note">
          {status}
        </p>
      </div>
    </section>
  );
}

function SavedCard({ saved, onDeleted }: { saved: SavedScenario; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const scenario = findScenario(String(saved.scenarioId));
  if (!scenario) return null;
  const { config } = saved;
  // Several scenarios can share a case: the buttons say which one they belong to.
  const name = scenarioName(scenario, config);
  const found = available(scenario);

  return (
    <li className="t-scard">
      <h3 className="t-scard__title">
        <Link href={`/testszenarien/${saved.id}`} className="t-cardlink">
          {scenario.label}
        </Link>
      </h3>
      <p>
        <strong>Herausfinden:</strong> {saved.goal}
      </p>
      <dl className="t-konf__params">
        <Param label="Suchbegriff">{example(scenario, config.place)}</Param>
        <Param label="Frage nach der PLZ">{PLACE_ON_CARD[config.place]}</Param>
        {scenario.flow === "unclear" && <Param label="Leistung oder Information?">{config.potOverlay ? "Im Overlay" : "Nicht fragen"}</Param>}
        <Param label="Wartezeit">{`${config.wait} Sekunden`}</Param>
        <Param label="Leistungen">{String(scenario.flow === "info" ? config.topicServices : Math.min(config.maxServices, found.services))}</Param>
        <Param label="Informationen">{String(config.maxInfos === "all" ? found.infos : Math.min(config.maxInfos, found.infos))}</Param>
        <Param label="Darstellung">{config.results === "tabs" ? "In zwei Tabs" : "Auf einer Seite"}</Param>
      </dl>
      <div className="t-konf__foot">
        <span className="t-konf__open" aria-hidden="true">
          Öffnen
          <IconArrow size={18} />
        </span>
        <div className="t-konf__actions">
          {confirming ? (
            <>
              <button
                type="button"
                className="t-btn t-btn--small"
                onClick={() => {
                  deleteScenario(saved.id);
                  onDeleted();
                }}
              >
                Endgültig löschen
                <span className="visually-hidden">: {name}</span>
              </button>
              {/* The button that was clicked is gone, the safe answer takes the focus. */}
              <button type="button" className="t-btn t-btn--small" autoFocus onClick={() => setConfirming(false)}>
                Abbrechen
              </button>
            </>
          ) : (
            <button type="button" className="t-btn t-btn--small" onClick={() => setConfirming(true)}>
              Löschen
              <span className="visually-hidden">: {name}</span>
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export function SavedScenarioList() {
  const saved = useSavedScenarios();
  const [status, setStatus] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <section aria-labelledby="gespeichert">
      <h2 id="gespeichert" ref={headingRef} tabIndex={-1} className="t-h2">
        Gespeicherte Szenarien
      </h2>
      <p className="t-box__note">Die Szenarien bleiben nur in diesem Browser gespeichert.</p>
      <p role="status" className="visually-hidden">
        {status}
      </p>
      {saved.length > 0 ? (
        <ul className="t-scards">
          {saved.map((item) => (
            <SavedCard
              key={item.id}
              saved={item}
              onDeleted={() => {
                setStatus("Szenario gelöscht.");
                headingRef.current?.focus();
              }}
            />
          ))}
        </ul>
      ) : (
        <p>
          Noch keine Szenarien gespeichert. Legen Sie im <Link href="/testszenarien/konfigurator">Konfigurator</Link> eines an.
        </p>
      )}
    </section>
  );
}
