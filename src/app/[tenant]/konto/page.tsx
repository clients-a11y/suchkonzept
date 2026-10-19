import type { Metadata } from "next";
import { AccountPage } from "@/components/pages/AccountPage";
import { TenantGate } from "@/components/TenantContext";

export const metadata: Metadata = { title: "Nutzerkonto" };

export default function Page() {
  return (
    <TenantGate>
      <AccountPage />
    </TenantGate>
  );
}
