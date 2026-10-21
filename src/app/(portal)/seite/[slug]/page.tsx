import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAGE_SLUGS, findPage } from "@/data/content";
import { ContentPageView } from "@/components/pages/ContentPageView";

export function generateStaticParams() {
  return PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/seite/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: findPage(slug)?.title ?? "Seite nicht gefunden" };
}

export default async function Page({ params }: PageProps<"/seite/[slug]">) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();
  return <ContentPageView page={page} />;
}
