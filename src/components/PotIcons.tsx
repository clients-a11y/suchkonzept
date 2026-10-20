import type { ReactNode } from "react";

// Two-colour pictograms for the two search pots and the switch between them. They take the
// tenant's primary and accent colour, so every portal gets its own version. Always decorative.

type Props = { size?: number };

function Pictogram({ size = 32, children }: Props & { children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" className="pictogram">
      {children}
    </svg>
  );
}

// A form with a stamp of approval: something to apply for.
export function PictogramApplication(props: Props) {
  return (
    <Pictogram {...props}>
      <path d="M8 3.5h11l5 5V26a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 6 26V6a2.5 2.5 0 0 1 2-2.5Z" fill="var(--t-paper)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 3.5V8.5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 12.5h8M10 16.5h10M10 20.5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="23.5" cy="23.5" r="6" fill="var(--t-accent)" stroke="var(--t-paper)" strokeWidth="1.5" />
      <path d="m20.8 23.6 1.8 1.8 3.6-3.8" stroke="var(--t-on-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Pictogram>
  );
}

// A folded newspaper with a coloured headline: something to read.
export function PictogramNews(props: Props) {
  return (
    <Pictogram {...props}>
      <path d="M24 9.5h3.5V25a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4.5 5.5h19.5V25a3 3 0 0 0 3 3H8a3.5 3.5 0 0 1-3.5-3.5Z" fill="var(--t-paper)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="8.5" y="9.5" width="11.5" height="5.5" rx="1" fill="var(--t-accent)" />
      <path d="M8.5 19h11.5M8.5 23h7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Pictogram>
  );
}

// One way that forks in two, like the platform mark: the search switch.
export function PictogramSwitch(props: Props) {
  return (
    <Pictogram {...props}>
      <path d="M16 28.5V18.5L9 11.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 17V11h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 18.5l7-7" stroke="var(--t-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M17.5 11h6v6" stroke="var(--t-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="18.5" r="2.25" fill="currentColor" />
    </Pictogram>
  );
}
