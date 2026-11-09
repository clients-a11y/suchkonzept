"use client";

import Link from "next/link";
import { DemoReset } from "@/components/DemoReset";
import { useIsTeam, useTaskHref } from "@/lib/test-config";

// The links around the test. A test person only gets the way back to the task; a browser of the team
// that tries out a task keeps its way back to the scenarios.
export function FooterTools() {
  const task = useTaskHref();
  const team = useIsTeam();
  const testPerson = Boolean(task) && !team;
  return (
    <div className="t-footer__col">
      <h2 className="t-footer__title">{testPerson ? "Ihre Aufgabe" : "Prototyp"}</h2>
      <ul className="t-footer__links">
        {task && (
          <li>
            <Link href={task}>Aufgabe noch einmal lesen</Link>
          </li>
        )}
        {!testPerson && (
          <>
            <li>
              <Link href="/testszenarien">Testszenarien</Link>
            </li>
            <li>
              <DemoReset />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
