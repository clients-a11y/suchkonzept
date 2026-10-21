import { SITE } from "@/data/site";

// The portal's own sign: an arch as an open door, in the portal blue. No coat of arms, no flag.
export function PortalSign({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false" className="t-sign">
      <rect width="40" height="40" rx="4" className="t-sign__bg" />
      <path d="M12 31V19a8 8 0 0 1 16 0v12" className="t-sign__arch" />
      <path d="M8 31h24" className="t-sign__base" />
    </svg>
  );
}

// Word mark: the sign and the name on two lines.
export function Wordmark() {
  return (
    <span className="t-wordmark">
      <PortalSign />
      <span className="t-wordmark__text">
        <span className="t-wordmark__title">{SITE.mark.title}</span>
        <span className="t-wordmark__region">{SITE.mark.region}</span>
      </span>
    </span>
  );
}
