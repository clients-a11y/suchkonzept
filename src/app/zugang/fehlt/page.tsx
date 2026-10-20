import type { Metadata } from "next";
import { AccessGate } from "@/components/AccessGate";

// In production while no password is set.
export const metadata: Metadata = { title: "Zugang" };

export default function Page() {
  return <AccessGate state="fehlt" />;
}
