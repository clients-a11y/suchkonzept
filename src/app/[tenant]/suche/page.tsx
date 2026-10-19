import type { Metadata } from "next";
import { SearchPage } from "@/components/pages/SearchPage";
import { TenantGate } from "@/components/TenantContext";

export const metadata: Metadata = { title: "Suche" };

export default function Page() {
  return (
    <TenantGate>
      <SearchPage />
    </TenantGate>
  );
}
