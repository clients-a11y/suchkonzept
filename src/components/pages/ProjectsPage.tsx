"use client";

import Link from "next/link";
import { useState } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsFigure } from "@/components/NewsArt";
import { IconArrow } from "@/components/Icons";
import { NotFoundBlock } from "@/components/pages/NotFoundBlock";
import { organisationFor, unitFor } from "@/data/organisation";
import { PROJECT_STATUS, newsForProject, projectFor, projectsFor } from "@/data/projects";
import type { Project, ProjectStatus } from "@/data/projects";
import { formatDate, pluralize } from "@/lib/format";
import { useDocumentTitle } from "@/lib/use-document-title";
import { editorial } from "@/lib/origin";

function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(y, m - 1, 1));
}

function formatVolume(mio: number): string {
  return mio >= 1000
    ? `${(mio / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mrd. Euro`
    : `${mio.toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mio. Euro`;
}

export function Progress({ project }: { project: Project }) {
  return (
    <div className="t-bar">
      <div className="t-bar__track" aria-hidden="true">
        <span className="t-bar__fill" style={{ width: `${project.progress}%` }} />
      </div>
      <p className="t-bar__label">{project.progress} % umgesetzt</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`t-status t-status--${status}`}>{PROJECT_STATUS[status]}</span>;
}

export function ProjectCard({ project, level = 2 }: { project: Project; level?: 2 | 3 }) {
  const { tenant, base } = useCurrentTenant();
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <li className="t-projectcard">
      <NewsFigure image={{ ...project.image, credit: `${tenant.name}/Bildstelle` }} type={tenant.type} />
      <div className="t-projectcard__body">
        <StatusBadge status={project.status} />
        <Heading className="t-projectcard__title">
          <Link href={`${base}/projekte/${project.id}`} className="t-cardlink">
            {project.title}
          </Link>
        </Heading>
        <p className="t-projectcard__text">{project.teaser}</p>
        <Progress project={project} />
        <p className="t-meta">
          <span>{project.budget}</span>
          <span>{project.period}</span>
        </p>
      </div>
    </li>
  );
}

const FILTERS: (ProjectStatus | "alle")[] = ["alle", "planung", "bau", "fertig"];
const FILTER_TEXT: Record<ProjectStatus, string> = { planung: "in Planung", bau: "im Bau", fertig: "abgeschlossen" };

export function ProjectsPage() {
  const { tenant } = useCurrentTenant();
  const list = projectsFor(tenant);
  const [filter, setFilter] = useState<ProjectStatus | "alle">("alle");
  useDocumentTitle(`${list.title} · ${tenant.name}`);
  const shown = list.projects.filter((p) => filter === "alle" || p.status === filter);
  const volume = list.projects.reduce((sum, p) => sum + p.budgetMio, 0);
  const count = (s: ProjectStatus | "alle") => (s === "alle" ? list.projects.length : list.projects.filter((p) => p.status === s).length);

  return (
    <div className="t-container t-page">
      <Breadcrumb items={[{ label: list.title, href: "/projekte" }]} />
      <h1 className="t-h1">{list.title}</h1>
      <p className="t-lead">{list.lead}</p>

      <dl className="t-figures">
        <div>
          <dt>Projekte</dt>
          <dd>{list.projects.length}</dd>
        </div>
        <div>
          <dt>Im Bau</dt>
          <dd>{count("bau")}</dd>
        </div>
        <div>
          <dt>Abgeschlossen</dt>
          <dd>{count("fertig")}</dd>
        </div>
        {volume > 0 && (
          <div>
            <dt>Gesamtvolumen</dt>
            <dd>{formatVolume(volume)}</dd>
          </div>
        )}
      </dl>

      <div className="t-filterbar" role="group" aria-label="Projekte nach Stand filtern">
        {FILTERS.map((f) => (
          <button key={f} type="button" className="t-chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "alle" ? "Alle" : PROJECT_STATUS[f]} <span className="t-chip__count">{count(f)}</span>
          </button>
        ))}
      </div>
      <p className="t-count" role="status">
        {pluralize(shown.length, "Projekt", "Projekte")}
        {filter !== "alle" && ` ${FILTER_TEXT[filter]}`}
      </p>

      <ul className="t-projectcards" {...editorial(tenant, "Projekte")}>
        {shown.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ul>
    </div>
  );
}

export function ProjectPage({ id }: { id: string }) {
  const { tenant, base } = useCurrentTenant();
  const list = projectsFor(tenant);
  const project = projectFor(tenant, id);
  useDocumentTitle(`${project?.title ?? "Projekt nicht gefunden"} · ${tenant.name}`);
  if (!project) return <NotFoundBlock what="Projekt" />;

  const unit = project.unitId ? unitFor(tenant, project.unitId) : undefined;
  const org = organisationFor(tenant);
  const news = newsForProject(tenant, project);
  const others = list.projects.filter((p) => p.id !== project.id);
  const nextStep = project.milestones.find((m) => !m.done);

  return (
    <div className="t-container t-page">
      <Breadcrumb
        items={[
          { label: list.title, href: "/projekte" },
          { label: project.title, href: `/projekte/${project.id}` },
        ]}
      />
      <StatusBadge status={project.status} />
      <h1 className="t-h1">{project.title}</h1>
      <p className="t-lead">{project.teaser}</p>

      <div className="t-service" {...editorial(tenant, "Projekt")}>
        <div>
          <NewsFigure image={{ ...project.image, credit: `${tenant.name}/Bildstelle` }} type={tenant.type} size="wide" />
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
              <ul className="t-news-list t-news-list--compact">
                {news.map((item) => (
                  <li key={item.id} className="t-news-item t-news-item--thumb">
                    <NewsFigure image={item.image} type={tenant.type} size="thumb" />
                    <div>
                      <p className="t-meta">
                        <time dateTime={item.date}>{formatDate(item.date)}</time>
                        <span>{item.source}</span>
                      </p>
                      <h3 className="t-news-item__title">
                        <Link href={`${base}/aktuelles#meldung-${item.id}`}>{item.title}</Link>
                      </h3>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="t-service__side">
          <section className="t-facts">
            <h2 className="t-facts__title">Steckbrief</h2>
            <dl>
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
              <p className="t-box__link">
                <Link href={`${base}/organisation/${unit.id}`}>Zur Seite: {unit.name}</Link>
              </p>
              <p className="t-box__note">Zu {org.title}</p>
            </section>
          )}
        </div>
      </div>

      {others.length > 0 && (
        <section className="t-section">
          <div className="t-section__head">
            <h2 className="t-h2">Weitere Projekte</h2>
            <Link href={`${base}/projekte`} className="t-more">
              Alle {list.title} <IconArrow size={18} />
            </Link>
          </div>
          <ul className="t-chiplist">
            {others.map((p) => (
              <li key={p.id}>
                <Link href={`${base}/projekte/${p.id}`} className="t-chip">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
