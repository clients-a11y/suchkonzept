import type { Metadata } from "next";
import { Atkinson_Hyperlegible, IBM_Plex_Mono, Public_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = Public_Sans({ variable: "--f-sans", subsets: ["latin"] });
const serif = Source_Serif_4({ variable: "--f-serif", subsets: ["latin"] });
const hyper = Atkinson_Hyperlegible({ variable: "--f-hyper", subsets: ["latin"], weight: ["400", "700"] });
const mono = IBM_Plex_Mono({ variable: "--f-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: "Portalbaukasten · Klick-Dummy", template: "%s · Portalbaukasten" },
  description: "Klick-Dummy für eine mandantenfähige Portalplattform mit fiktiven Mandanten.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${sans.variable} ${serif.variable} ${hyper.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
