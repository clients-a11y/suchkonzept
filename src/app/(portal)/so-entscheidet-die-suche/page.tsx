import type { Metadata } from "next";
import { SearchFlowPage } from "@/components/pages/SearchFlowPage";

export const metadata: Metadata = { title: "So entscheidet die Suche" };

export default function Page() {
  return <SearchFlowPage />;
}
