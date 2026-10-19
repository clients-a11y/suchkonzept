"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Tenant } from "@/lib/types";

type TenantCtx = { tenant: Tenant; base: string };

export const TenantContext = createContext<TenantCtx | null>(null);

// Pages render inside the gate. While a browser-only tenant is still being read, the shell
// renders the page segment anyway (so Next.js keeps it), and the gate keeps it empty.
export function TenantGate({ children }: { children: ReactNode }) {
  return useContext(TenantContext) ? children : null;
}

export function useCurrentTenant(): TenantCtx {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useCurrentTenant must be used inside TenantShell");
  return ctx;
}
