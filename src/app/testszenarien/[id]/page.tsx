import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoading } from "@/components/pages/PageLoading";
import { UserTestDetailPage } from "@/components/pages/UserTestDetailPage";
import { SCENARIOS, findScenario } from "@/data/test-scenarios";

export function generateStaticParams() {
  return SCENARIOS.map((scenario) => ({ id: String(scenario.id) }));
}

export async function generateMetadata({ params }: PageProps<"/testszenarien/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: findScenario(id)?.title ?? "Szenario nicht gefunden" };
}

// The address parameter is read inside Suspense, so the frame of the page shows at once.
async function Content({ params }: Pick<PageProps<"/testszenarien/[id]">, "params">) {
  const { id } = await params;
  const scenario = findScenario(id);
  if (!scenario) notFound();
  return <UserTestDetailPage scenario={scenario} />;
}

export default function Page({ params }: PageProps<"/testszenarien/[id]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
