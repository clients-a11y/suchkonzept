import { Suspense } from "react";
import type { Metadata } from "next";
import { SERVICES } from "@/data/services";
import { ApplicationPage } from "@/components/pages/ApplicationPage";
import { PageLoading } from "@/components/pages/PageLoading";
import { TenantGate } from "@/components/TenantContext";

export function generateStaticParams() {
  return SERVICES.filter((service) => service.online).map((service) => ({ slug: service.slug }));
}

export const metadata: Metadata = { title: "Online-Antrag" };

async function Content({ params }: Pick<PageProps<"/[tenant]/antrag/[slug]">, "params">) {
  const { slug } = await params;
  return (
    <TenantGate>
      <ApplicationPage slug={slug} />
    </TenantGate>
  );
}

export default function Page({ params }: PageProps<"/[tenant]/antrag/[slug]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
