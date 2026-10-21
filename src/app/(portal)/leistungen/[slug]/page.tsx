import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, findService } from "@/data/services";
import { ServicePage } from "@/components/pages/ServicePage";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/leistungen/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: findService(slug)?.title ?? "Leistung nicht gefunden" };
}

export default async function Page({ params }: PageProps<"/leistungen/[slug]">) {
  const { slug } = await params;
  if (!findService(slug)) notFound();
  return <ServicePage slug={slug} />;
}
