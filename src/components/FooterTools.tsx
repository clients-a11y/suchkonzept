"use client";

import Link from "next/link";
import { DemoReset } from "@/components/DemoReset";
import { useTaskHref } from "@/lib/test-config";

// For the team the links around the test. A test person only gets the way back to the task.
export function FooterTools() {
  const task = useTaskHref();
  return (
    <div className="t-footer__col">
      <h2 className="t-footer__title">{task ? "Ihre Aufgabe" : "Prototyp"}</h2>
      <ul className="t-footer__links">
        {task ? (
          <li>
            <Link href={task}>Aufgabe noch einmal lesen</Link>
          </li>
        ) : (
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
