import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoading } from "@/components/pages/PageLoading";
import { PROJECTS, findProject } from "@/data/projects";
import { ProjectPage } from "@/components/pages/ProjectPage";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: PageProps<"/projekte/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: findProject(id)?.title ?? "Projekt nicht gefunden" };
}

// The address parameter is read inside Suspense, so the frame of the page shows at once.
async function Content({ params }: Pick<PageProps<"/projekte/[id]">, "params">) {
  const { id } = await params;
  const project = findProject(id);
  if (!project) notFound();
  return <ProjectPage project={project} />;
}

export default function Page({ params }: PageProps<"/projekte/[id]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
