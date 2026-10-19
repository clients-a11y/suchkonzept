import type { Metadata } from "next";
import { Wizard } from "@/components/pages/Wizard";

export const metadata: Metadata = { title: "Neuen Mandanten anlegen" };

export default function Page() {
  return <Wizard />;
}
