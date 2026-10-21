import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ORG_UNITS, findUnit } from "@/data/organisation";
import { OrgUnitPage } from "@/components/pages/OrgUnitPage";

export function generateStaticParams() {
  return ORG_UNITS.map((unit) => ({ id: unit.id }));
}

export async function generateMetadata({ params }: PageProps<"/organisation/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: findUnit(id)?.name ?? "Stelle nicht gefunden" };
}

export default async function Page({ params }: PageProps<"/organisation/[id]">) {
  const { id } = await params;
  const unit = findUnit(id);
  if (!unit) notFound();
  return <OrgUnitPage unit={unit} />;
}
