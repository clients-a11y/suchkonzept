// Illustrations drawn from the theme tokens, so every tenant gets matching pictures.
// Purely decorative: hidden from assistive technology.

type ArtProps = { className?: string };

const primary = { fill: "var(--t-primary)" };
const tintFill = { fill: "var(--t-primary-tint)" };
const accent = { fill: "var(--t-accent)" };
const surface = { fill: "var(--t-surface)" };

// Rolling hills with a small tower: information portals.
export function HillsArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className={className}>
      <rect width="640" height="360" style={surface} />
      <circle cx="486" cy="112" r="46" style={accent} />
      <path d="M0 226C112 170 214 158 326 196S540 150 640 184V360H0Z" style={tintFill} />
      <path d="M296 246V206l12-16 12 16v40z" style={primary} />
      <path d="M0 268C120 222 252 228 376 262S560 238 640 248V360H0Z" style={accent} />
      <path d="M0 306C140 268 296 296 420 318S586 298 640 298V360H0Z" style={primary} />
      <path
        d="M48 334c96-18 196-14 292 6M232 352c90-20 196-26 300-12M470 322c56-8 110-8 170 0"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ stroke: "var(--t-on-primary)", opacity: 0.28 }}
      />
    </svg>
  );
}

// Wide strip of the same landscape, used as the lower edge of the search hero.
// No sky: the hero's surface colour shows through.
export function HillsBand({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 1600 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false" className={className}>
      <circle cx="1390" cy="112" r="22" style={accent} />
      <path d="M0 140C220 100 440 96 660 124S1080 92 1300 116S1520 110 1600 104V200H0Z" style={tintFill} />
      <path d="M1140 118V96l10-13 10 13v22z" style={primary} />
      <path d="M0 162C240 130 520 138 760 154S1240 130 1600 146V200H0Z" style={accent} />
      <path d="M0 184C260 164 560 180 820 188S1320 170 1600 176V200H0Z" style={primary} />
      <path
        d="M80 194c180-10 380-8 560 4M900 197c160-12 360-14 560-6"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ stroke: "var(--t-on-primary)", opacity: 0.28 }}
      />
    </svg>
  );
}

const BACK: [number, number, number][] = [
  [16, 70, 150], [96, 60, 196], [166, 92, 128], [266, 52, 214], [326, 82, 162],
  [418, 70, 204], [496, 62, 142], [566, 66, 184],
];
const FRONT: [number, number, number][] = [
  [0, 82, 92], [90, 70, 134], [168, 62, 104], [238, 92, 152], [338, 62, 112],
  [408, 84, 142], [500, 70, 96], [578, 62, 124],
];
const BASE = 296;

// City blocks on a canal: service portals.
export function BlocksArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" className={className}>
      <rect width="640" height="360" style={surface} />
      <circle cx="468" cy="70" r="30" style={accent} />
      {BACK.map(([x, w, h]) => (
        <rect key={`b${x}`} x={x} y={BASE - h} width={w} height={h} rx="6" style={tintFill} />
      ))}
      {FRONT.map(([x, w, h], i) => (
        <g key={`f${x}`}>
          {i % 3 === 1 ? (
            <path d={`M${x} ${BASE - h + 18}L${x + w / 2} ${BASE - h - 14}L${x + w} ${BASE - h + 18}V${BASE}H${x}Z`} style={primary} />
          ) : (
            <rect x={x} y={BASE - h} width={w} height={h} rx="6" style={primary} />
          )}
          {Array.from({ length: Math.floor((h - 34) / 26) }, (_, row) =>
            [0, 1].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={x + 14 + col * (w - 40)}
                y={BASE - h + 28 + row * 26}
                width="12"
                height="14"
                rx="3"
                style={accent}
              />
            )),
          )}
        </g>
      ))}
      <rect y={BASE} width="640" height={360 - BASE} style={tintFill} />
      <path
        d="M24 322c20-8 40-8 60 0s40 8 60 0M240 340c20-8 40-8 60 0s40 8 60 0M452 318c20-8 40-8 60 0s40 8 60 0"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        style={{ stroke: "var(--t-primary)" }}
      />
    </svg>
  );
}

export function PortalArt({ type, className }: ArtProps & { type: "info" | "service" }) {
  return type === "service" ? <BlocksArt className={className} /> : <HillsArt className={className} />;
}
