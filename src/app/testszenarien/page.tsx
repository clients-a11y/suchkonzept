import type { Metadata } from "next";
import { UserTestPage } from "@/components/pages/UserTestPage";

export const metadata: Metadata = { title: "Testszenarien" };

export default function Page() {
  return <UserTestPage tab="szenarien" />;
}
