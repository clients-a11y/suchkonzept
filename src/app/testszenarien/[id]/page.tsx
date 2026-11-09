import { Suspense } from "react";
import type { Metadata } from "next";
import { PageLoading } from "@/components/pages/PageLoading";
import { UserTestDetailPage } from "@/components/pages/UserTestDetailPage";
import { STARTER_SCENARIOS } from "@/data/test-scenarios";

export const metadata: Metadata = { title: "Testszenario" };

export function generateStaticParams() {
  return STARTER_SCENARIOS.map((saved) => ({ id: saved.id }));
}

// The address parameter is read inside Suspense, so the frame of the page shows at once. Saved scenarios
// live in the browser, the page looks them up there.
async function Content({ params }: Pick<PageProps<"/testszenarien/[id]">, "params">) {
  const { id } = await params;
  return <UserTestDetailPage id={id} />;
}

export default function Page({ params }: PageProps<"/testszenarien/[id]">) {
  return (
    <Suspense fallback={<PageLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
