import type { Metadata } from "next";
import { SearchPage } from "@/components/pages/SearchPage";

export const metadata: Metadata = { title: "Suche" };

export default function Page() {
  return <SearchPage />;
}
