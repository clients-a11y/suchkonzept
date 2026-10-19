import type { Metadata } from "next";
import { OrgPage } from "@/components/pages/OrgPage";
import { TenantGate } from "@/components/TenantContext";

export const metadata: Metadata = { title: "Organisation" };

export default function Page() {
  return (
    <TenantGate>
      <OrgPage />
    </TenantGate>
  );
}
