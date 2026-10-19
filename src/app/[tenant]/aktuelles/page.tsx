import type { Metadata } from "next";
import { NewsPage } from "@/components/pages/NewsPage";
import { TenantGate } from "@/components/TenantContext";

export const metadata: Metadata = { title: "Aktuelles" };

export default function Page() {
  return (
    <TenantGate>
      <NewsPage />
    </TenantGate>
  );
}
