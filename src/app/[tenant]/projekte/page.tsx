import type { Metadata } from "next";
import { ProjectsPage } from "@/components/pages/ProjectsPage";
import { TenantGate } from "@/components/TenantContext";

export const metadata: Metadata = { title: "Projekte" };

export default function Page() {
  return (
    <TenantGate>
      <ProjectsPage />
    </TenantGate>
  );
}
