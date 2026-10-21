import type { ReactNode } from "react";
import { AssistantDock } from "@/components/AssistantDock";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// Frame of every portal page: skip link, header, the one <main>, footer and the chat window.
export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="t-shell">
      <a href="#inhalt" className="t-skip">
        Zum Inhalt
      </a>
      <Header />
      <main id="inhalt" tabIndex={-1} className="t-main">
        {children}
      </main>
      <Footer />
      <AssistantDock />
    </div>
  );
}
