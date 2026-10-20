import type { Metadata } from "next";
import { AssistantPage } from "@/components/pages/AssistantPage";
import { TenantGate } from "@/components/TenantContext";

export const metadata: Metadata = { title: "Assistent" };

export default function Page() {
  return (
    <TenantGate>
      <AssistantPage />
    </TenantGate>
  );
}
