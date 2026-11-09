"use client";

import Link from "next/link";
import { restartDemo } from "@/components/DemoReset";
import { DEFAULT_CONFIG } from "@/data/test-scenarios";
import type { TestConfig } from "@/data/test-scenarios";

// Every run starts like a first visit, see restartDemo. Without a scenario: the default settings.
export function ScenarioStart({ title, config = DEFAULT_CONFIG, children }: { title?: string; config?: TestConfig; children: string }) {
  return (
    <Link
      href="/"
      className="t-btn"
      onClick={(event) => {
        event.preventDefault();
        restartDemo(config);
      }}
    >
      {children}
      {title && <span className="visually-hidden">: {title}</span>}
    </Link>
  );
}
