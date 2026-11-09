import type { Metadata } from "next";
import { UserTestPage } from "@/components/pages/UserTestPage";

export const metadata: Metadata = { title: "Konfigurator" };

export default function Page() {
  return <UserTestPage tab="konfigurator" />;
}
