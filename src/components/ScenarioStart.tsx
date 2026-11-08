"use client";

import Link from "next/link";
import { restartDemo } from "@/components/DemoReset";

// Every run starts like a first visit, see restartDemo.
export function ScenarioStart({ title, children }: { title?: string; children: string }) {
  return (
    <Link
      href="/"
      className="t-btn"
      onClick={(event) => {
        event.preventDefault();
        restartDemo();
      }}
    >
      {children}
      {title && <span className="visually-hidden">: {title}</span>}
    </Link>
  );
}
