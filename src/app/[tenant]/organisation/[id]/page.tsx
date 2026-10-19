import { Suspense } from "react";
import type { Metadata } from "next";
import { seedUnitIds } from "@/data/organisation";
import { OrgUnitPage } from "@/components/pages/OrgUnitPage";
import { PageLoading } from "@/components/pages/PageLoading";
import { TenantGate } from "@/components/TenantContext";

export function generateStaticParams({ params }: { params: { tenant: string } }) {
  return seedUnitIds(params.tenant).map((id) => ({ id }));
}

export const metadata: Metadata = { title: "Organisation" };

async function Content({ params }: Pick<PageProps<"/[tenant]/organisation/[id]">, "params">) {
  const { id } = await params;
  return (
    <TenantGate>
      <OrgUnitPage id={id} />
    </TenantGate>
  );
}

export default function Page({ params }: PageProps<"/[tenant]/organisation/[id]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
