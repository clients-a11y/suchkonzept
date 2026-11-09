import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoading } from "@/components/pages/PageLoading";
import { TaskPage } from "@/components/pages/TaskPage";
import { SCENARIOS, findScenario } from "@/data/test-scenarios";

export const metadata: Metadata = { title: "Ihre Aufgabe" };

export function generateStaticParams() {
  return SCENARIOS.map((scenario) => ({ id: String(scenario.id) }));
}

// The address parameter is read inside Suspense, so the frame of the page shows at once.
async function Content({ params }: Pick<PageProps<"/aufgabe/[id]">, "params">) {
  const { id } = await params;
  const scenario = findScenario(id);
  if (!scenario) notFound();
  return <TaskPage scenario={scenario} />;
}

export default function Page({ params }: PageProps<"/aufgabe/[id]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
