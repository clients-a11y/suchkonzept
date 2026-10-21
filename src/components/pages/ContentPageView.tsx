import { Breadcrumb } from "@/components/Breadcrumb";
import type { ContentPage } from "@/lib/types";

export function ContentPageView({ page }: { page: ContentPage }) {
  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb items={[{ label: page.title, href: `/seite/${page.slug}`, lang: page.lang }]} />
          <h1 className="t-h1" lang={page.lang}>
            {page.title}
          </h1>
          <p className="t-lead" lang={page.lang}>
            {page.lead}
          </p>
        </div>
      </div>
      <div className="t-container t-page">
        <div className="t-article">
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
    </>
  );
}
