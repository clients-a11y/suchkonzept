import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoading } from "@/components/pages/PageLoading";
import { PAGE_SLUGS, findPage } from "@/data/content";
import { ContentPageView } from "@/components/pages/ContentPageView";

export function generateStaticParams() {
  return PAGE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/seite/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: findPage(slug)?.title ?? "Seite nicht gefunden" };
}

// The address parameter is read inside Suspense, so the frame of the page shows at once.
async function Content({ params }: Pick<PageProps<"/seite/[slug]">, "params">) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();
  return <ContentPageView page={page} />;
}

export default function Page({ params }: PageProps<"/seite/[slug]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
