import type { Metadata } from "next";
import { TestCasePage } from "@/components/pages/TestCasePage";

export const metadata: Metadata = { title: "Testfall Kindergeld" };

export default function Page() {
  return <TestCasePage />;
}
