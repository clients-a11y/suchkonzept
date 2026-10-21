import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

export default async function Page({ params }: PageProps<"/antrag/[slug]">) {
  const { slug } = await params;
  if (!findService(slug)) notFound();
  return <ApplicationPage slug={slug} />;
}
