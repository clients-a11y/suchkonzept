import type { Tenant } from "@/lib/types";

function initials(name: string): string {
  const parts = name.trim().split(/[\s-]+/).filter(Boolean);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase().replace(/^(.)(.)$/, (_, a, b) => a + b.toLowerCase());
}

// Fictional emblem built from the tenant's own tokens: no real coat of arms.
export function Emblem({ tenant, size = 44 }: { tenant: Tenant; size?: number }) {
  const city = tenant.type === "service";
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" aria-hidden="true" focusable="false" className="emblem">
      {city ? (
        <path d="M4 10h6V4h6v6h8V4h6v6h6v26c0 3-2 6-6 7l-10 3-10-3c-4-1-6-4-6-7z" style={{ fill: "var(--t-primary)" }} />
      ) : (
        <path d="M2 4h36v20c0 11-8 18-18 21C10 42 2 35 2 24z" style={{ fill: "var(--t-primary)" }} />
      )}
      <path d={city ? "M4 32h32" : "M2 30h36"} style={{ stroke: "var(--t-accent)", strokeWidth: 3 }} />
      <text x="20" y={city ? 27 : 23} textAnchor="middle" fontSize="12" fontWeight="700" style={{ fill: "var(--t-on-primary)", fontFamily: "var(--t-heading)" }}>
        {initials(tenant.name)}
      </text>
    </svg>
  );
}
