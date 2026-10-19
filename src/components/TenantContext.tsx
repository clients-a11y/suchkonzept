"use client";

import { createContext, useContext } from "react";
import type { Tenant } from "@/lib/types";

type TenantCtx = { tenant: Tenant; base: string };

export const TenantContext = createContext<TenantCtx | null>(null);

export function useCurrentTenant(): TenantCtx {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useCurrentTenant must be used inside TenantShell");
  return ctx;
}
