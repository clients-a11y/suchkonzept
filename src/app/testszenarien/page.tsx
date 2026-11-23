import type { Metadata } from "next";
import { UserTestPage } from "@/components/pages/UserTestPage";

export const metadata: Metadata = { title: "Testcases" };

export default function Page() {
  return <UserTestPage />;
}
