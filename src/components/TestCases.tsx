"use client";

import { restartDemo } from "@/components/DemoReset";
import { TEST_CASES, sameConfig } from "@/data/test-cases";
import type { TestCase, TestVariant } from "@/data/test-cases";
import { useActiveConfig } from "@/lib/test-config";

// The two test cases, each with its variants A and B. Starting one resets the prototype, see restartDemo.

function Variant({ testCase, variant, active }: { testCase: TestCase; variant: TestVariant; active: boolean }) {
  const letter = variant.key.toUpperCase();
  return (
    <li className="t-variant">
      <h3 className="t-variant__title">
        <span className="t-variant__letter">{letter}</span>
        {variant.title}
      </h3>
      <p>{variant.text}</p>
      <div className="t-variant__foot">
        <button type="button" className="t-btn" onClick={() => restartDemo(variant.config)}>
          Variante {letter} starten
          <span className="visually-hidden">
            : Testcase {testCase.id}, {testCase.title}
          </span>
        </button>
        {active && <p className="t-variant__active">Läuft gerade in diesem Browser</p>}
      </div>
    </li>
  );
}

export function TestCases() {
  const active = useActiveConfig();
  return (
    <>
      {TEST_CASES.map((testCase) => (
        <section key={testCase.id} className="t-tcase" aria-labelledby={`testcase-${testCase.id}`}>
          <h2 id={`testcase-${testCase.id}`} className="t-h2">
            Testcase {testCase.id}: {testCase.title}
          </h2>
          <p>{testCase.summary}</p>
          <ul className="t-variants">
            {testCase.variants.map((variant) => (
              <Variant key={variant.key} testCase={testCase} variant={variant} active={Boolean(active && sameConfig(active, variant.config))} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
