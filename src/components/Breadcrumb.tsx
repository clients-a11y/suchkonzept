import Link from "next/link";

type Crumb = { label: string; href: string; lang?: string };

// Full path from the start page. The last step is the current page.
export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Startseite", href: "/" }, ...items];
  return (
    <nav aria-label="Brotkrumen" className="t-crumbs">
      <ol>
        {all.map((item, index) => {
          const last = index === all.length - 1;
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={last ? "page" : undefined} lang={item.lang}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
