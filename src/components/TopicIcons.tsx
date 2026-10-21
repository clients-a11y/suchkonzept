import type { ReactNode } from "react";

// Two-tone pictograms for the life situations on the start page. Always decorative.
function Pictogram({ children }: { children: ReactNode }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" focusable="false" className="pictogram">
      {children}
    </svg>
  );
}

const stroke = { stroke: "currentColor", strokeWidth: 2.25, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const tint = { fill: "var(--pict-tint)" };

const ICONS: Record<string, ReactNode> = {
  familie: (
    <>
      <circle cx="14" cy="11" r="4.5" style={tint} {...stroke} />
      <circle cx="27" cy="15" r="3.5" style={tint} {...stroke} />
      <path d="M6 33c0-6 3.6-10 8-10s8 4 8 10M20 33c0-4.6 3-7.5 7-7.5s7 2.9 7 7.5" {...stroke} />
    </>
  ),
  umzug: (
    <>
      <path d="M4 26V14h18v12" style={tint} {...stroke} />
      <path d="M22 18h7l5 5v3H22" {...stroke} />
      <circle cx="11" cy="29" r="3" {...stroke} />
      <circle cx="28" cy="29" r="3" {...stroke} />
      <path d="M8 19h8" {...stroke} />
    </>
  ),
  bauen: (
    <>
      <path d="M7 34V18L20 8l13 10v16Z" style={tint} {...stroke} />
      <path d="M16 34v-9h8v9M4 34h32" {...stroke} />
    </>
  ),
  ausweis: (
    <>
      <rect x="5" y="9" width="30" height="22" rx="3" style={tint} {...stroke} />
      <circle cx="14" cy="18" r="3.5" {...stroke} />
      <path d="M9 26c.8-2.6 2.7-4 5-4s4.2 1.4 5 4M23 16h7M23 21h7M23 26h4" {...stroke} />
    </>
  ),
  freizeit: (
    <>
      <circle cx="20" cy="20" r="13" style={tint} {...stroke} />
      <path d="M20 7c3.5 3.6 5 8 5 13s-1.5 9.4-5 13M20 7c-3.5 3.6-5 8-5 13s1.5 9.4 5 13M7 20h26" {...stroke} />
    </>
  ),
  arbeit: (
    <>
      <rect x="5" y="13" width="30" height="20" rx="3" style={tint} {...stroke} />
      <path d="M15 13v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M5 22h30M18 22v3h4v-3" {...stroke} />
    </>
  ),
  privat: (
    <>
      <circle cx="20" cy="13" r="6" style={tint} {...stroke} />
      <path d="M8 34c1.2-7 5.8-11 12-11s10.8 4 12 11" {...stroke} />
    </>
  ),
  unternehmen: (
    <>
      <path d="M6 34V12l10-4v26M16 34V16h18v18" style={tint} {...stroke} />
      <path d="M4 34h32M10 15v2M10 21v2M10 27v2M21 21h2M27 21h2M21 27h2M27 27h2" {...stroke} />
    </>
  ),
};

export function TopicIcon({ name }: { name: string }) {
  return <Pictogram>{ICONS[name] ?? ICONS.freizeit}</Pictogram>;
}
