import Link from "next/link";
import { IconCheck } from "@/components/Icons";
import { ScenarioStart } from "@/components/ScenarioStart";
import { placeOf } from "@/data/test-scenarios";
import type { FlowStep, Scenario } from "@/data/test-scenarios";

// One scenario: what the moderator reads out, the click path, what we check, and the start.

const KIND_LABEL: Record<FlowStep["kind"], string> = { person: "Person", wait: "Warten", page: "Seite", end: "Ende" };

function Fact({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function UserTestDetailPage({ scenario }: { scenario: Scenario }) {
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
            <h2 className="t-h3">Klickpfad</h2>
            <ol className="t-path">
              {scenario.path.map((step, i) => (
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
              <ScenarioStart title={scenario.title}>Szenario starten</ScenarioStart>
            </div>
            <p className="t-box__note">Alle Eingaben werden gelöscht. Zurück über „Testszenarien“ im Footer.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
