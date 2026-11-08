import type { Metadata } from "next";
import { ChatTestCasePage } from "@/components/pages/TestCasePage";

export const metadata: Metadata = { title: "Testfall Chat-Assistent" };

export default function Page() {
  return <ChatTestCasePage />;
}
