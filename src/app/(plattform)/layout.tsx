import { PlatformShell } from "@/components/PlatformShell";

export default function PlatformLayout({ children }: LayoutProps<"/">) {
  return <PlatformShell>{children}</PlatformShell>;
}
