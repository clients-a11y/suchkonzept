import type { Metadata } from "next";
import { PortalShell } from "@/components/PortalShell";
import { NotFoundBlock } from "@/components/pages/NotFoundBlock";

export const metadata: Metadata = { title: "Seite nicht gefunden" };

// Addresses that match no route at all.
export default function NotFound() {
  return (
    <PortalShell>
      <NotFoundBlock />
    </PortalShell>
  );
}
