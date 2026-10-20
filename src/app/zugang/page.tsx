import type { Metadata } from "next";
import { AccessGate } from "@/components/AccessGate";

// The proxy shows this page in place of every page until the password is entered.
export const metadata: Metadata = { title: "Zugang" };

export default function Page() {
  return <AccessGate state="start" />;
}
