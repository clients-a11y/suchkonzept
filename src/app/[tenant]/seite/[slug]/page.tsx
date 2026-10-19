import { Suspense } from "react";
import type { Metadata } from "next";
import { findSeedTenant } from "@/data/tenants";
import { META_SLUGS, pagesFor } from "@/data/content";
import { ContentPageView } from "@/components/pages/ContentPageView";
import { PageLoading } from "@/components/pages/PageLoading";
import { TenantGate } from "@/components/TenantContext";

export function generateStaticParams({ params }: { params: { tenant: string } }) {
  const tenant = findSeedTenant(params.tenant);
  const own = tenant ? pagesFor(tenant).map((page) => page.slug) : [];
  return [...own, ...META_SLUGS].map((slug) => ({ slug }));
}

export const metadata: Metadata = { title: "Seite" };

async function Content({ params }: Pick<PageProps<"/[tenant]/seite/[slug]">, "params">) {
  const { slug } = await params;
  return (
    <TenantGate>
      <ContentPageView slug={slug} />
    </TenantGate>
  );
}

export default function Page({ params }: PageProps<"/[tenant]/seite/[slug]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
