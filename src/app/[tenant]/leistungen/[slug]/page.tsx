import { Suspense } from "react";
import type { Metadata } from "next";
import { SERVICES } from "@/data/services";
import { ServicePage } from "@/components/pages/ServicePage";
import { PageLoading } from "@/components/pages/PageLoading";
import { TenantGate } from "@/components/TenantContext";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export const metadata: Metadata = { title: "Leistung" };

async function Content({ params }: Pick<PageProps<"/[tenant]/leistungen/[slug]">, "params">) {
  const { slug } = await params;
  return (
    <TenantGate>
      <ServicePage slug={slug} />
    </TenantGate>
  );
}

export default function Page({ params }: PageProps<"/[tenant]/leistungen/[slug]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
