"use client";

import Link from "next/link";
import { resetDemo } from "@/components/DemoReset";

// Every run starts like a first visit: a remembered place would skip the step under test.
export function ScenarioStart({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} className="t-btn t-btn--primary" onClick={() => resetDemo()}>
      Szenario starten
      <span className="visually-hidden">: {title}</span>
    </Link>
  );
}
