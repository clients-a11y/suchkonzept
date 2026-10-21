import type { Metadata } from "next";
import { AssistantPage } from "@/components/pages/AssistantPage";

export const metadata: Metadata = { title: "Chat-Assistent" };

export default function Page() {
  return <AssistantPage />;
}
