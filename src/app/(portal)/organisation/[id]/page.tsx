import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLoading } from "@/components/pages/PageLoading";
import { ORG_UNITS, findUnit } from "@/data/organisation";
import { OrgUnitPage } from "@/components/pages/OrgUnitPage";

export function generateStaticParams() {
  return ORG_UNITS.map((unit) => ({ id: unit.id }));
}

export async function generateMetadata({ params }: PageProps<"/organisation/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: findUnit(id)?.name ?? "Stelle nicht gefunden" };
}

// The address parameter is read inside Suspense, so the frame of the page shows at once.
async function Content({ params }: Pick<PageProps<"/organisation/[id]">, "params">) {
  const { id } = await params;
  const unit = findUnit(id);
  if (!unit) notFound();
  return <OrgUnitPage unit={unit} />;
}

export default function Page({ params }: PageProps<"/organisation/[id]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
