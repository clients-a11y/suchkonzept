import Image from "next/image";
import Link from "next/link";
import { NewsCard, ProjectCard } from "@/components/Cards";
import { ChatButton } from "@/components/ChatButton";
import { IconArrow } from "@/components/Icons";
import { SmartSearch } from "@/components/SmartSearch";
import { TopicIcon } from "@/components/TopicIcons";
import { LIFE_SITUATIONS, NEWS, TOP_TASKS } from "@/data/content";
import { PROJECTS, PROJECTS_PAGE } from "@/data/projects";
import { findService } from "@/data/services";
import { SITE } from "@/data/site";
import type { Service } from "@/lib/types";


function services(slugs: string[]): Service[] {
  return slugs.map(findService).filter((s): s is Service => Boolean(s));
}

function SectionHead({ id, title, href, more }: { id: string; title: string; href: string; more: string }) {
  return (
    <div className="t-section__head">
      <h2 id={id} className="t-h2">
        {title}
      </h2>
      <Link href={href} className="t-more">
        {more} <IconArrow size={18} />
      </Link>
    </div>
  );
}

export function StartPage() {
  const news = NEWS.slice(0, 4);
  // Running projects first.
  const rank = { bau: 0, planung: 1, fertig: 2 };
  const projects = [...PROJECTS].sort((a, b) => rank[a.status] - rank[b.status]).slice(0, 3);

  return (
    <>
      <div className="t-stage">
        <Image src="/images/news/b1-rathaus.webp" alt="" fill preload loading="eager" sizes="100vw" className="t-stage__img" />
        <div className="t-container t-stage__inner">
          <h1 className="t-stage__title">Verwaltung in Musterland online erledigen</h1>
          <p className="t-stage__lead">Leistungen von Land und Gemeinden an einem Ort. Beschreiben Sie Ihr Anliegen, wir zeigen den Weg.</p>
          <div className="t-stage__search">
            <SmartSearch label="Was möchten Sie erledigen?" />
          </div>
        </div>
      </div>

      <section className="t-container t-section" aria-labelledby="haeufig">
        <SectionHead id="haeufig" title="Häufig gesucht" href="/leistungen" more="Alle Leistungen A bis Z" />
        <ul className="t-tasks">
          {services(TOP_TASKS).map((service) => (
            <li key={service.slug}>
              <Link href={`/leistungen/${service.slug}`} className="t-task">
                <span>{service.title}</span>
                <IconArrow size={18} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="t-band-light" aria-labelledby="lebenslagen">
        <div className="t-container t-section">
          <SectionHead id="lebenslagen" title="Lebenslagen" href="/seite/lebenslagen" more="Mehr zu Lebenslagen" />
          <ul className="t-topics">
            {LIFE_SITUATIONS.map((situation) => (
              <li key={situation.title} className="t-topic">
                <span className="t-topic__icon">
                  <TopicIcon name={situation.icon} />
                </span>
                <h3 className="t-topic__title">{situation.title}</h3>
                <ul className="t-topic__links">
                  {services(situation.services).map((service) => (
                    <li key={service.slug}>
                      <Link href={`/leistungen/${service.slug}`}>{service.title}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="t-container t-section" aria-labelledby="aktuelles">
        <SectionHead id="aktuelles" title="Aktuelle Themen" href="/aktuelles" more="Alle Meldungen" />
        <ul className="t-cards t-cards--4">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </ul>
      </section>

      <section className="t-container t-section" aria-labelledby="projekte">
        <SectionHead id="projekte" title={PROJECTS_PAGE.title} href="/projekte" more={`Alle ${PROJECTS_PAGE.title}`} />
        <ul className="t-cards t-cards--3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} level={3} />
          ))}
        </ul>
      </section>

      <section className="t-band" aria-labelledby="hilfe">
        <div className="t-container t-band__inner">
          <div>
            <h2 id="hilfe" className="t-band__title">
              Fragen? Wir helfen weiter.
            </h2>
            <p>
              {SITE.contact.office}, Telefon {SITE.contact.phone}, {SITE.contact.hours}.
            </p>
          </div>
          <ChatButton className="t-btn t-btn--inverse">Chat-Assistent fragen</ChatButton>
        </div>
      </section>
    </>
  );
}
