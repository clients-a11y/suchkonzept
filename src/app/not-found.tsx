import { PortalShell } from "@/components/PortalShell";
import { NotFoundBlock } from "@/components/pages/NotFoundBlock";

// Addresses that match no route at all.
export default function NotFound() {
  return (
    <PortalShell>
      <NotFoundBlock />
    </PortalShell>
  );
}
