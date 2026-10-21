import Image from "next/image";
import type { Photo as PhotoData } from "@/lib/types";

// Every photo in this prototype is AI-generated and labelled as such.
export const AI_CREDIT = "Beispielbild, KI-generiert";

const SIZES = {
  card: "(min-width: 64rem) 24rem, (min-width: 40rem) 50vw, 100vw",
  wide: "(min-width: 64rem) 48rem, 100vw",
  thumb: "128px",
  portrait: "(min-width: 64rem) 18rem, (min-width: 40rem) 40vw, 100vw",
};

export function PhotoFigure({ photo, size = "card", caption = true }: { photo: PhotoData; size?: keyof typeof SIZES; caption?: boolean }) {
  const portrait = size === "portrait";
  return (
    <figure className={`t-figure t-figure--${size}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={portrait ? 800 : 1024}
        height={portrait ? 1000 : 688}
        sizes={SIZES[size]}
        className="t-figure__img"
      />
      {caption && size !== "thumb" && <figcaption className="t-figure__credit">{AI_CREDIT}</figcaption>}
    </figure>
  );
}
