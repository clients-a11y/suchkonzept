"use client";

// Routes stay mounted but hidden after navigation, so several <main> elements can be in the
// document. The link moves focus to the <main> of its own shell instead of the first id match.
export function SkipLink({ className }: { className: string }) {
  return (
    <a
      href="#inhalt"
      className={className}
      onClick={(event) => {
        const main = event.currentTarget.closest("[data-shell]")?.querySelector<HTMLElement>("main");
        if (!main) return;
        event.preventDefault();
        main.focus();
        main.scrollIntoView();
      }}
    >
      Zum Inhalt
    </a>
  );
}
