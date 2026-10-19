"use client";

import { useEffect } from "react";

// The tenant is only known in the browser for wizard tenants, and reading the URL in
// generateMetadata would block the prerendered shell. So tenant pages set their title here.
// Hidden routes re-run effects when they become visible again, which restores their title.
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
