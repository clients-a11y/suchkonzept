import type { Metadata } from "next";
import { NewsPage } from "@/components/pages/NewsPage";

export const metadata: Metadata = { title: "Aktuelles" };

export default function Page() {
  return <NewsPage />;
}
