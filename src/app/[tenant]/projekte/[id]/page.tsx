import { Suspense } from "react";
import type { Metadata } from "next";
import { seedProjectIds } from "@/data/projects";
import { ProjectPage } from "@/components/pages/ProjectsPage";
import { PageLoading } from "@/components/pages/PageLoading";
import { TenantGate } from "@/components/TenantContext";

export function generateStaticParams({ params }: { params: { tenant: string } }) {
  return seedProjectIds(params.tenant).map((id) => ({ id }));
}

export const metadata: Metadata = { title: "Projekt" };

async function Content({ params }: Pick<PageProps<"/[tenant]/projekte/[id]">, "params">) {
  const { id } = await params;
  return (
    <TenantGate>
      <ProjectPage id={id} />
    </TenantGate>
  );
}

export default function Page({ params }: PageProps<"/[tenant]/projekte/[id]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
