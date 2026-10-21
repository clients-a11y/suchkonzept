import type { Metadata } from "next";
import { AccountPage } from "@/components/pages/AccountPage";

export const metadata: Metadata = { title: "Nutzerkonto" };

export default function Page() {
  return <AccountPage />;
}
