import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, findProject } from "@/data/projects";
import { ProjectPage } from "@/components/pages/ProjectPage";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: PageProps<"/projekte/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: findProject(id)?.title ?? "Projekt nicht gefunden" };
}

export default async function Page({ params }: PageProps<"/projekte/[id]">) {
  const { id } = await params;
  const project = findProject(id);
  if (!project) notFound();
  return <ProjectPage project={project} />;
}
