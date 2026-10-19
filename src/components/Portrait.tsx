// Illustrated portraits for heads of ministries and offices. No photos and no real faces:
// a bust built from the theme tokens, varied by a number (hair, glasses, suit).

const P = { fill: "var(--t-primary)" };
const T = { fill: "var(--t-primary-tint)" };
const A = { fill: "var(--t-accent)" };
const W = { fill: "var(--t-paper)" };
const I = { fill: "var(--t-ink)" };

export function Portrait({ variant, label, className }: { variant: number; label: string; className?: string }) {
  const v = Math.abs(variant) % 8;
  const hairStyle = v % 4;
  const hair = v % 3 === 1 ? I : P;
  const suit = v % 2 ? P : I;
  const glasses = v % 3 === 0;
  return (
    <svg viewBox="0 0 200 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} focusable="false" className={className}>
      <rect width="200" height="240" style={T} />
      {hairStyle === 1 && <path d="M56 100C54 48 146 48 144 100V178H56Z" style={hair} />}
      <path d="M22 240C26 190 60 170 100 170S174 190 178 240Z" style={suit} />
      <path d="M82 172L100 206L118 172Z" style={W} />
      {suit === I && <path d="M96 180H104L107 212L100 222L93 212Z" style={A} />}
      <rect x="87" y="138" width="26" height="40" rx="10" style={W} />
      <ellipse cx="100" cy="104" rx="37" ry="44" style={W} />
      {hairStyle === 0 && (
        <path d="M62 102C58 64 84 52 104 54C130 56 144 76 138 102C130 84 112 76 92 78C78 80 68 88 62 102Z" style={hair} />
      )}
      {hairStyle === 1 && <path d="M63 96C64 66 86 56 102 56C124 56 138 70 137 96C124 78 104 74 84 80C74 84 68 88 63 96Z" style={hair} />}
      {hairStyle === 2 && (
        <>
          <circle cx="100" cy="50" r="15" style={hair} />
          <path d="M64 96C62 66 84 58 100 58S138 66 136 96C124 80 76 80 64 96Z" style={hair} />
        </>
      )}
      {hairStyle === 3 && <path d="M66 90C70 66 130 66 134 90C120 80 80 80 66 90Z" style={hair} />}
      {glasses && (
        <g style={{ fill: "none", stroke: "var(--t-ink)", strokeWidth: 3 }}>
          <circle cx="86" cy="106" r="10" />
          <circle cx="114" cy="106" r="10" />
          <path d="M96 106H104" />
        </g>
      )}
    </svg>
  );
}
