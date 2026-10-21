import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoading } from "@/components/pages/PageLoading";
import { SERVICES, findService } from "@/data/services";
import { ServicePage } from "@/components/pages/ServicePage";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/leistungen/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: findService(slug)?.title ?? "Leistung nicht gefunden" };
}

// The address parameter is read inside Suspense, so the frame of the page shows at once.
async function Content({ params }: Pick<PageProps<"/leistungen/[slug]">, "params">) {
  const { slug } = await params;
  if (!findService(slug)) notFound();
  return <ServicePage slug={slug} />;
}

export default function Page({ params }: PageProps<"/leistungen/[slug]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
