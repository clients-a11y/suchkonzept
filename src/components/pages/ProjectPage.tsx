import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsRow, Progress, StatusBadge } from "@/components/Cards";
import { IconArrow } from "@/components/Icons";
import { PhotoFigure } from "@/components/Photo";
import { findUnit } from "@/data/organisation";
import { PROJECTS, PROJECTS_PAGE, PROJECT_STATUS, newsForProject } from "@/data/projects";
import type { Project } from "@/data/projects";

function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(y, m - 1, 1));
}

export function ProjectPage({ project }: { project: Project }) {
  const unit = project.unitId ? findUnit(project.unitId) : undefined;
  const news = newsForProject(project);
  const others = PROJECTS.filter((p) => p.id !== project.id);
  const nextStep = project.milestones.find((m) => !m.done);

  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb
            items={[
              { label: PROJECTS_PAGE.title, href: "/projekte" },
              { label: project.title, href: `/projekte/${project.id}` },
            ]}
          />
          <p className="t-pagehead__kind">
            <StatusBadge status={project.status} />
            <span>{project.level === "land" ? "Land Musterland" : "Beispielstadt"}</span>
          </p>
          <h1 className="t-h1">{project.title}</h1>
          <p className="t-lead">{project.teaser}</p>
        </div>
      </div>

      <div className="t-container t-page">
        <div className="t-layout">
          <div className="t-layout__main">
            <PhotoFigure photo={project.image} size="wide" />
            <section className="t-unit-section t-project-text">
              <h2 className="t-h2">Worum es geht</h2>
              {project.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>

            <section className="t-unit-section">
              <h2 className="t-h2">Meilensteine</h2>
              <ol className="t-timeline">
                {project.milestones.map((m) => (
                  <li key={m.date + m.label} className="t-timeline__item" data-state={m.done ? "done" : m === nextStep ? "next" : "todo"}>
                    <span className="t-timeline__date">{formatMonth(m.date)}</span>
                    <span className="t-timeline__label">
                      {m.label}
                      <span className="visually-hidden">{m.done ? " (erledigt)" : m === nextStep ? " (nächster Schritt)" : " (geplant)"}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {news.length > 0 && (
              <section className="t-unit-section">
                <h2 className="t-h2">Meldungen zum Projekt</h2>
                <ul className="t-newsrows">
                  {news.map((item) => (
                    <NewsRow key={item.id} item={item} />
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="t-layout__side" aria-label="Steckbrief und Verantwortung">
            <section className="t-facts">
              <h2 className="t-facts__title">Steckbrief</h2>
              <dl className="t-facts__list">
                <div>
                  <dt>Stand</dt>
                  <dd>{PROJECT_STATUS[project.status]}</dd>
                </div>
                <div>
                  <dt>Fortschritt</dt>
                  <dd>
                    <Progress project={project} />
                  </dd>
                </div>
                <div>
                  <dt>Kosten</dt>
                  <dd>{project.budget}</dd>
                </div>
                <div>
                  <dt>Zeitraum</dt>
                  <dd>{project.period}</dd>
                </div>
                <div>
                  <dt>Ort</dt>
                  <dd>{project.location}</dd>
                </div>
                {nextStep && (
                  <div>
                    <dt>Nächster Schritt</dt>
                    <dd>
                      {nextStep.label}, {formatMonth(nextStep.date)}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
            {unit && (
              <section className="t-box">
                <h2 className="t-box__title">Verantwortlich</h2>
                <p className="t-box__office">
                  <strong>{unit.name}</strong>
                  <br />
                  {unit.head.role}: {unit.head.name}
                </p>
                <ul className="t-box__links">
                  <li>
                    <Link href={`/organisation/${unit.id}`}>Zur Seite: {unit.name}</Link>
                  </li>
                </ul>
              </section>
            )}
          </aside>
        </div>

        <section className="t-section">
          <div className="t-section__head">
            <h2 className="t-h2">Weitere Projekte</h2>
            <Link href="/projekte" className="t-more">
              Alle {PROJECTS_PAGE.title} <IconArrow size={18} />
            </Link>
          </div>
          <ul className="t-chiplist">
            {others.map((p) => (
              <li key={p.id}>
                <Link href={`/projekte/${p.id}`} className="t-chip">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
