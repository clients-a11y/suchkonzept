// WCAG 2.x contrast helpers used by the theme and the onboarding check.

export function isHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const INK = "#16191d";
export const WHITE = "#ffffff";

// Text colour that reads best on a given background.
export function onColor(bg: string): string {
  return contrast(WHITE, bg) >= contrast(INK, bg) ? WHITE : INK;
}

// Mix a colour with white (amount 0..1) for tints.
export function tint(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function formatRatio(ratio: number): string {
  return ratio.toFixed(1).replace(".", ",") + ":1";
}
