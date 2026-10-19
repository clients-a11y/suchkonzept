import { Suspense } from "react";
import type { Metadata } from "next";
import { EditLoading, EditTenant } from "@/components/pages/EditTenant";

export const metadata: Metadata = { title: "Mandanten bearbeiten" };

export default function Page() {
  return (
    <Suspense fallback={<EditLoading />}>
      <EditTenant />
    </Suspense>
  );
}
