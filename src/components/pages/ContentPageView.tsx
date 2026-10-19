"use client";

import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NotFoundBlock } from "@/components/pages/NotFoundBlock";
import { META_SLUGS, pageFor } from "@/data/content";
import { useDocumentTitle } from "@/lib/use-document-title";
import { editorial, origin } from "@/lib/origin";

export function ContentPageView({ slug }: { slug: string }) {
  const { tenant } = useCurrentTenant();
  const page = pageFor(tenant, slug);
  useDocumentTitle(`${page?.title ?? "Seite nicht gefunden"} · ${tenant.name}`);
  if (!page) return <NotFoundBlock what="Seite" />;

  return (
    <div className="t-container t-page">
      <Breadcrumb items={[{ label: page.title, href: `/seite/${page.slug}`, lang: page.lang }]} />
      <div className="t-article" lang={page.lang} {...(META_SLUGS.includes(page.slug) ? origin("vorlage", "Vorlage · Platzhalterseite") : editorial(tenant, "Redaktion"))}>
        <h1 className="t-h1">{page.title}</h1>
        <p className="t-lead">{page.lead}</p>
        {page.sections.length > 1 && (
          <nav aria-label="Auf dieser Seite" className="t-toc">
            <h2 className="t-toc__title">Auf dieser Seite</h2>
            <ul>
              {page.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {page.sections.map((section) => (
          <section key={section.id} id={section.id} className="t-article__section" tabIndex={-1}>
            <h2 className="t-h2">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
