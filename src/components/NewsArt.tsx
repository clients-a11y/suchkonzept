import Image from "next/image";
import type { ReactNode } from "react";
import { PortalArt } from "@/components/Art";
import type { NewsImage, PortalType } from "@/lib/types";

// Pictures for news items: flat scenes drawn only from the theme tokens, so every tenant,
// including new ones from the wizard, gets fitting images without photos.

const P = { fill: "var(--t-primary)" };
const T = { fill: "var(--t-primary-tint)" };
const A = { fill: "var(--t-accent)" };
const S = { fill: "var(--t-surface)" };
const W = { fill: "var(--t-paper)" };
const I = { fill: "var(--t-ink)" };
const line = (color: string, width = 4) => ({ fill: "none", stroke: color, strokeWidth: width, strokeLinecap: "round" as const });

const sky = <rect width="400" height="250" style={S} />;
const ground = (y: number, style = T) => <rect y={y} width="400" height={250 - y} style={style} />;

const SCENES: Record<string, () => ReactNode> = {
  laden: () => (
    <>
      {sky}
      <circle cx="338" cy="54" r="24" style={A} />
      {ground(204)}
      <rect x="88" y="62" width="224" height="144" rx="4" style={P} />
      <rect x="146" y="76" width="108" height="18" rx="3" style={W} />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <rect x={88 + i * 28} y="104" width="28" height="24" style={i % 2 ? W : A} />
          <circle cx={102 + i * 28} cy="128" r="14" style={i % 2 ? W : A} />
        </g>
      ))}
      <rect x="108" y="148" width="112" height="52" rx="3" style={T} />
      <rect x="162" y="148" width="4" height="52" style={P} />
      <rect x="240" y="146" width="52" height="60" rx="3" style={S} />
      <circle cx="282" cy="178" r="3" style={P} />
      <rect x="104" y="188" width="44" height="18" rx="2" style={A} />
      <rect x="154" y="188" width="44" height="18" rx="2" style={A} />
      {[116, 128, 140, 166, 178, 190].map((x) => (
        <circle key={x} cx={x} cy="186" r="6" style={x < 150 ? P : W} />
      ))}
    </>
  ),
  schule: () => (
    <>
      {sky}
      {ground(204)}
      <rect x="64" y="96" width="264" height="110" style={P} />
      <path d="M146 96L196 52L246 96Z" style={P} />
      <circle cx="196" cy="80" r="13" style={W} />
      <path d="M196 72v8l6 4" style={line("var(--t-primary)", 3)} />
      {[80, 114, 148, 220, 254, 288].map((x) =>
        [110, 152].map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="24" height="28" rx="2" style={T} />),
      )}
      <rect x="182" y="150" width="30" height="56" rx="2" style={A} />
      <rect x="344" y="58" width="4" height="148" style={P} />
      <path d="M348 60h40l-9 11 9 11h-40z" style={A} />
      <rect x="14" y="196" width="62" height="12" rx="2" style={A} />
      <rect x="20" y="184" width="54" height="12" rx="2" style={W} />
      <rect x="16" y="172" width="60" height="12" rx="2" style={P} />
    </>
  ),
  deich: () => (
    <>
      {sky}
      <circle cx="84" cy="58" r="22" style={A} />
      <path d="M0 120C90 100 180 104 260 96S360 92 400 98V180H0Z" style={T} />
      {[236, 272, 308].map((x) => (
        <g key={x}>
          <rect x={x} y="78" width="26" height="22" style={W} />
          <path d={`M${x - 3} 80L${x + 13} 66L${x + 29} 80Z`} style={P} />
        </g>
      ))}
      <path d="M0 176C70 128 120 118 400 116V176Z" style={P} />
      <path d="M90 136C150 124 260 120 400 119" style={line("var(--t-paper)", 4)} />
      {[40, 352].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="112" width="6" height="22" style={I} />
          <circle cx={x} cy="106" r="16" style={A} />
        </g>
      ))}
      {ground(176)}
      <path d="M20 204c20-8 40-8 60 0s40 8 60 0M200 222c20-8 40-8 60 0s40 8 60 0M120 240c20-8 40-8 60 0" style={line("var(--t-primary)", 4)} />
    </>
  ),
  verein: () => (
    <>
      {sky}
      {ground(212)}
      <rect x="84" y="38" width="5" height="176" style={P} />
      <rect x="311" y="38" width="5" height="176" style={P} />
      <rect x="89" y="40" width="222" height="52" rx="4" style={P} />
      <rect x="110" y="56" width="128" height="9" rx="4" style={{ fill: "var(--t-on-primary)" }} />
      <rect x="110" y="72" width="84" height="7" rx="3" style={{ fill: "var(--t-on-primary)", opacity: 0.7 }} />
      {[
        { x: 140, head: P, body: A, top: 136 },
        { x: 200, head: A, body: P, top: 124 },
        { x: 260, head: P, body: A, top: 136 },
      ].map(({ x, head, body, top }) => (
        <g key={x}>
          <circle cx={x} cy={top} r="16" style={head} />
          <rect x={x - 25} y={top + 22} width="50" height={212 - top - 22} rx="22" style={body} />
        </g>
      ))}
      {[
        [60, 120, A],
        [342, 140, P],
        [52, 170, P],
        [356, 104, A],
      ].map(([x, y, s], i) => (
        <rect key={i} x={x as number} y={y as number} width="8" height="8" rx="1" transform={`rotate(20 ${x} ${y})`} style={s as object} />
      ))}
    </>
  ),
  praxis: () => (
    <>
      {sky}
      <path d="M0 160C100 130 220 136 400 128V250H0Z" style={T} />
      <rect x="120" y="104" width="172" height="102" style={W} />
      <path d="M104 108L206 50L308 108Z" style={P} />
      <circle cx="206" cy="86" r="14" style={A} />
      <rect x="203" y="77" width="6" height="18" rx="1" style={W} />
      <rect x="197" y="83" width="18" height="6" rx="1" style={W} />
      <rect x="138" y="126" width="30" height="30" rx="2" style={T} />
      <rect x="244" y="126" width="30" height="30" rx="2" style={T} />
      <rect x="191" y="148" width="30" height="58" rx="2" style={P} />
      <rect x="333" y="150" width="8" height="56" style={I} />
      <circle cx="337" cy="138" r="32" style={P} />
      <rect y="204" width="400" height="46" style={A} />
      <rect x="40" y="220" width="320" height="6" rx="3" style={W} />
    </>
  ),
  digital: () => (
    <>
      {sky}
      {ground(200)}
      <rect x="108" y="46" width="184" height="124" rx="8" style={P} />
      <rect x="120" y="58" width="160" height="100" rx="3" style={W} />
      <path d="M152 136V106L180 86L208 106V136Z" style={line("var(--t-primary)", 3)} />
      <path d="M170 136V118H190V136M152 106H208" style={line("var(--t-primary)", 3)} />
      <circle cx="246" cy="110" r="17" style={A} />
      <path d="M238 110l6 6 11-12" style={line("var(--t-primary)", 4)} />
      <path d="M88 172H312L296 192H104Z" style={P} />
      <rect x="40" y="160" width="32" height="40" rx="3" style={A} />
      <ellipse cx="48" cy="146" rx="9" ry="18" transform="rotate(-20 48 146)" style={P} />
      <ellipse cx="64" cy="144" rx="9" ry="18" transform="rotate(20 64 144)" style={P} />
      <rect x="324" y="172" width="28" height="28" rx="3" style={A} />
      <path d="M352 180c10 0 10 14 0 14" style={line("var(--t-accent)", 4)} />
    </>
  ),
  see: () => (
    <>
      {sky}
      <circle cx="312" cy="62" r="26" style={A} />
      <path d="M0 132C60 108 110 114 170 104S300 112 400 100V144H0Z" style={P} />
      {ground(140)}
      <path d="M40 178h60M160 200h80M280 170h70M90 226h90" style={line("var(--t-paper)", 4)} />
      <rect x="52" y="150" width="190" height="10" rx="2" style={P} />
      {[64, 120, 176, 232].map((x) => (
        <rect key={x} x={x} y="158" width="6" height="34" style={P} />
      ))}
      <rect x="236" y="118" width="4" height="34" style={P} />
      <path d="M240 120h26l-6 7 6 7h-26z" style={A} />
      {[296, 336, 372].map((x) => (
        <circle key={x} cx={x} cy="196" r="7" style={A} />
      ))}
    </>
  ),
  rathaus: () => (
    <>
      {sky}
      {ground(210)}
      <rect x="78" y="108" width="244" height="102" style={P} />
      <rect x="174" y="40" width="52" height="72" style={P} />
      <path d="M168 42L200 10L232 42Z" style={P} />
      <circle cx="200" cy="70" r="15" style={W} />
      <path d="M200 61v9l7 4" style={line("var(--t-primary)", 3)} />
      <rect x="104" y="118" width="192" height="10" style={A} />
      {[116, 152, 236, 272].map((x) => (
        <rect key={x} x={x} y="128" width="12" height="82" style={W} />
      ))}
      <rect x="184" y="158" width="32" height="52" rx="2" style={A} />
      <rect x="96" y="210" width="208" height="8" style={W} />
      <rect x="88" y="218" width="224" height="8" style={S} />
    </>
  ),
  spielplatz: () => (
    <>
      {sky}
      <circle cx="70" cy="56" r="22" style={A} />
      {ground(196)}
      <rect x="104" y="88" width="56" height="9" style={P} />
      <rect x="106" y="96" width="7" height="100" style={P} />
      <rect x="151" y="96" width="7" height="100" style={P} />
      {[116, 136, 156, 176].map((y) => (
        <rect key={y} x="106" y={y} width="52" height="4" style={P} />
      ))}
      <path d="M158 92C214 100 222 180 280 192L272 200C210 188 204 112 156 106Z" style={A} />
      <path d="M298 196L322 92L346 196" style={line("var(--t-primary)", 6)} />
      <path d="M312 92H372M366 92L382 196" style={line("var(--t-primary)", 6)} />
      <path d="M336 94V164M356 94V164" style={line("var(--t-ink)", 2)} />
      <rect x="330" y="162" width="32" height="7" rx="2" style={A} />
      <rect x="20" y="206" width="70" height="22" rx="4" style={A} />
      <circle cx="226" cy="214" r="10" style={P} />
    </>
  ),
  bus: () => (
    <>
      {sky}
      {[[20, 70, 60], [90, 50, 90], [150, 80, 50], [240, 60, 80], [310, 70, 100]].map(([x, h, w]) => (
        <rect key={x} x={x} y={180 - h - 40} width={w} height={h + 40} style={T} />
      ))}
      <rect y="176" width="400" height="74" style={I} />
      <path d="M0 214h400" style={{ ...line("var(--t-paper)", 4), strokeDasharray: "24 18" }} />
      <rect x="70" y="108" width="196" height="76" rx="12" style={A} />
      {[86, 124, 162].map((x) => (
        <rect key={x} x={x} y="120" width="30" height="26" rx="3" style={W} />
      ))}
      <rect x="208" y="120" width="40" height="56" rx="3" style={W} />
      <rect x="70" y="160" width="196" height="6" style={P} />
      {[106, 226].map((x) => (
        <g key={x}>
          <circle cx={x} cy="186" r="15" style={I} />
          <circle cx={x} cy="186" r="6" style={W} />
        </g>
      ))}
      <rect x="296" y="150" width="88" height="16" rx="2" style={W} />
      {[296, 318, 340, 362].map((x) => (
        <rect key={x} x={x} y="150" width="11" height="16" style={A} />
      ))}
      <rect x="302" y="166" width="5" height="22" style={W} />
      <rect x="372" y="166" width="5" height="22" style={W} />
      <path d="M330 198l10-30 10 30z" style={A} />
    </>
  ),
  park: () => (
    <>
      {sky}
      {ground(166)}
      {[78, 322].map((x, i) => (
        <g key={x}>
          <rect x={x - 5} y="120" width="10" height="56" style={I} />
          <circle cx={x} cy={i ? 98 : 108} r={i ? 40 : 34} style={P} />
        </g>
      ))}
      <path d="M0 176H400M0 196H400" style={line("var(--t-paper)", 4)} />
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={10 + i * 38} y="166" width="5" height="40" rx="2" style={W} />
      ))}
      <ellipse cx="206" cy="216" rx="28" ry="12" style={P} />
      <circle cx="238" cy="204" r="11" style={P} />
      <path d="M232 196l-6-10 10 4z" style={P} />
      {[186, 198, 214, 226].map((x) => (
        <rect key={x} x={x} y="222" width="5" height="16" rx="2" style={P} />
      ))}
      <path d="M180 212c-10-6-12-14-8-20" style={line("var(--t-primary)", 4)} />
      <circle cx="276" cy="232" r="8" style={A} />
    </>
  ),
  haeuser: () => (
    <>
      {sky}
      {ground(204)}
      {[
        [20, 70, 100, P],
        [96, 64, 120, A],
        [166, 70, 90, P],
        [242, 64, 116, A],
        [312, 70, 98, P],
      ].map(([x, w, h, s]) => {
        const xx = x as number;
        const ww = w as number;
        const hh = h as number;
        const top = 204 - hh;
        return (
          <g key={xx}>
            <path d={`M${xx - 4} ${top + 2}L${xx + ww / 2} ${top - 26}L${xx + ww + 4} ${top + 2}Z`} style={s as object} />
            <rect x={xx} y={top} width={ww} height={hh} style={s as object} />
            <rect x={xx + 12} y={top + 16} width="16" height="18" rx="2" style={W} />
            <rect x={xx + ww - 28} y={top + 16} width="16" height="18" rx="2" style={W} />
            <rect x={xx + ww / 2 - 9} y="174" width="18" height="30" rx="2" style={W} />
          </g>
        );
      })}
    </>
  ),
  fest: () => (
    <>
      {sky}
      {ground(200)}
      <path d="M0 40H60V200H0Z" style={P} />
      <path d="M0 40L30 14L60 40Z" style={P} />
      <path d="M340 30H400V200H340Z" style={A} />
      <path d="M340 30L370 4L400 30Z" style={A} />
      {[0, 1].map((row) => {
        const y0 = 56 + row * 44;
        const points = Array.from({ length: 10 }, (_, i) => {
          const x = 70 + i * 28;
          const y = y0 + 22 * Math.sin((Math.PI * (x - 60)) / 280);
          return [x, y];
        });
        return (
          <g key={row}>
            <path d={`M60 ${y0}Q200 ${y0 + 44} 340 ${y0}`} style={line("var(--t-ink)", 2)} />
            {points.map(([x, y], i) => (
              <path key={i} d={`M${x - 9} ${y}H${x + 9}L${x} ${y + 16}Z`} style={[A, P, W][(i + row) % 3]} />
            ))}
          </g>
        );
      })}
      <path d="M150 200V160L200 132L250 160V200Z" style={W} />
      {[150, 175, 200, 225].map((x, i) => (
        <path key={x} d={`M${x} 160L200 132L${x + 25} 160Z`} style={i % 2 ? P : A} />
      ))}
      <rect x="164" y="170" width="72" height="30" style={T} />
      {[40, 90, 300, 350].map((x) => (
        <ellipse key={x} cx={x} cy="224" rx="16" ry="5" style={W} />
      ))}
    </>
  ),
};

export function NewsArt({
  image,
  type,
  className,
}: {
  image?: NewsImage;
  type: PortalType;
  className?: string;
}) {
  const scene = image && SCENES[image.scene];
  if (!scene) {
    // No own scene (e.g. the welcome news of a wizard tenant): the portal landscape stands in.
    return image ? (
      <div role="img" aria-label={image.alt} className={className}>
        <PortalArt type={type} className="t-figure__fill" />
      </div>
    ) : (
      <PortalArt type={type} className={className} />
    );
  }
  return (
    <svg
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={image.alt}
      focusable="false"
      className={className}
    >
      {scene()}
    </svg>
  );
}

export const AI_CREDIT = "Beispielbild, KI-generiert";

// Picture with credit line, as press photos in portals have.
export function NewsFigure({
  image,
  type,
  size = "card",
}: {
  image?: NewsImage;
  type: PortalType;
  size?: "card" | "thumb" | "wide";
}) {
  const sizes = { card: "(min-width: 64rem) 25rem, (min-width: 40rem) 50vw, 100vw", wide: "(min-width: 56rem) 44rem, 100vw", thumb: "96px" };
  return (
    <figure className={`t-figure t-figure--${size}`}>
      {image?.photo ? (
        <Image
          src={image.photo}
          alt={image.alt}
          width={1024}
          height={688}
          sizes={sizes[size]}
          className="t-figure__img t-figure__photo"
        />
      ) : (
        <NewsArt image={image} type={type} className="t-figure__img" />
      )}
      {image && size !== "thumb" && (
        <figcaption className="t-figure__credit">{image.photo ? AI_CREDIT : `© ${image.credit}`}</figcaption>
      )}
    </figure>
  );
}
