import type { Metadata } from "next";
import { OrgPage } from "@/components/pages/OrgPage";

export const metadata: Metadata = { title: "Organisation" };

export default function Page() {
  return <OrgPage />;
}
