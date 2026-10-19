import { Suspense } from "react";
import { TENANTS } from "@/data/tenants";
import { TenantLoading, TenantShell } from "@/components/TenantShell";

export function generateStaticParams() {
  return TENANTS.map((tenant) => ({ tenant: tenant.id }));
}

// Tenants from the wizard exist only in the browser, so the shell resolves them on the client.
async function Shell({ params, children }: Pick<LayoutProps<"/[tenant]">, "params" | "children">) {
  const { tenant } = await params;
  return <TenantShell id={tenant}>{children}</TenantShell>;
}

export default function TenantLayout({ params, children }: LayoutProps<"/[tenant]">) {
  return (
    <Suspense fallback={<TenantLoading />}>
      <Shell params={params}>{children}</Shell>
    </Suspense>
  );
}
