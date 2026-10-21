import type { Metadata } from "next";
import { Fira_Sans, Fira_Sans_Condensed } from "next/font/google";
import "./globals.css";

const sans = Fira_Sans({ variable: "--f-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"] });
const condensed = Fira_Sans_Condensed({ variable: "--f-condensed", subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  title: { default: "Verwaltungsportal Musterland", template: "%s · Verwaltungsportal Musterland" },
  description: "Prototyp für das Suchkonzept eines Verwaltungsportals. Musterland und alle Inhalte sind fiktiv.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${sans.variable} ${condensed.variable}`}>
      <body>{children}</body>
    </html>
  );
}
