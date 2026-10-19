import { StartPage } from "@/components/pages/StartPage";
import { TenantGate } from "@/components/TenantContext";

export default function Page() {
  return (
    <TenantGate>
      <StartPage />
    </TenantGate>
  );
}
