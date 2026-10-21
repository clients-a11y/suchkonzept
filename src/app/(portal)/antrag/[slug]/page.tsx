import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoading } from "@/components/pages/PageLoading";
import { SERVICES, findService } from "@/data/services";
import { ApplicationPage } from "@/components/pages/ApplicationPage";

export function generateStaticParams() {
  return SERVICES.filter((service) => service.online).map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/antrag/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  return { title: service ? `Online-Antrag: ${service.title}` : "Leistung nicht gefunden" };
}

// The address parameter is read inside Suspense, so the frame of the page shows at once.
async function Content({ params }: Pick<PageProps<"/antrag/[slug]">, "params">) {
  const { slug } = await params;
  if (!findService(slug)) notFound();
  return <ApplicationPage slug={slug} />;
}

export default function Page({ params }: PageProps<"/antrag/[slug]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
