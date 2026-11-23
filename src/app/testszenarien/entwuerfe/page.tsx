import type { Metadata } from "next";
import { DraftsPage } from "@/components/pages/DraftsPage";

export const metadata: Metadata = { title: "Entwürfe" };

export default function Page() {
  return <DraftsPage />;
}
