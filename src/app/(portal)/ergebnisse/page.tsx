import type { Metadata } from "next";
import { ResultPage } from "@/components/pages/ResultPage";

export const metadata: Metadata = { title: "Suche" };

export default function Page() {
  return <ResultPage />;
}
