"use client";

import Link from "next/link";
import { resetDemo } from "@/components/DemoReset";
import { setVariant } from "@/lib/variant-store";
import type { Variant } from "@/lib/variant-store";

// Every run starts like a first visit: a remembered place would skip the step under test.
export function ScenarioStart({ href = "/", title, variant, children }: { href?: string; title: string; variant?: Variant; children: string }) {
  return (
    <Link
      href={href}
      className="t-btn"
      onClick={() => {
        resetDemo();
        if (variant) setVariant(variant);
      }}
    >
      {children}
      <span className="visually-hidden">: {title}</span>
    </Link>
  );
}
