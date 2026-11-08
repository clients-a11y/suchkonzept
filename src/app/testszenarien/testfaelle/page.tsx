import type { Metadata } from "next";
import { UserTestCasesPage } from "@/components/pages/UserTestCasesPage";

export const metadata: Metadata = { title: "Testfälle" };

export default function Page() {
  return <UserTestCasesPage />;
}
