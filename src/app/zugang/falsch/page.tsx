import type { Metadata } from "next";
import { AccessGate } from "@/components/AccessGate";

// After a wrong password.
export const metadata: Metadata = { title: "Zugang" };

export default function Page() {
  return <AccessGate state="falsch" />;
}
