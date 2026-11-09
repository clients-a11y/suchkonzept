import Link from "next/link";
import { PhotoFigure } from "@/components/Photo";
import { PROJECT_STATUS } from "@/data/projects";
import type { Project, ProjectStatus } from "@/data/projects";
import { formatDate } from "@/lib/format";
import type { NewsItem, Service } from "@/lib/types";

export function NewsMeta({ item, topic = false }: { item: NewsItem; topic?: boolean }) {
  return (
    <p className="t-meta">
      <time dateTime={item.date}>{formatDate(item.date)}</time>
      {topic && <span>{item.topic}</span>}
      <span>{item.source}</span>
    </p>
  );
}

// Teaser with photo; the whole card is clickable through the title link.
export function NewsCard({ item, level = 3 }: { item: NewsItem; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <li className="t-card t-card--media">
      <PhotoFigure photo={item.image} />
      <div className="t-card__body">
        <NewsMeta item={item} />
        <Heading className="t-card__title">
          <Link href={`/aktuelles#meldung-${item.id}`} className="t-cardlink">
            {item.title}
          </Link>
        </Heading>
        <p className="t-card__text">{item.teaser}</p>
      </div>
    </li>
  );
}

// Compact row with a small photo, for lists on unit and project pages.
export function NewsRow({ item }: { item: NewsItem }) {
  return (
    <li className="t-newsrow">
      <PhotoFigure photo={item.image} size="thumb" />
      <div>
        <NewsMeta item={item} />
        <h3 className="t-newsrow__title">
          <Link href={`/aktuelles#meldung-${item.id}`}>{item.title}</Link>
        </h3>
      </div>
    </li>
  );
}

export function ServiceCard({ service, level = 3 }: { service: Service; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <li className="t-card t-card--service">
      <Heading className="t-card__title">
        <Link href={`/leistungen/${service.slug}`} className="t-cardlink">
          {service.title}
        </Link>
      </Heading>
      <p className="t-card__text">{service.summary}</p>
      <p className="t-card__facts">
        <span className={service.online ? "t-badge t-badge--online" : "t-badge"}>{service.online ? "Online möglich" : "Termin vor Ort"}</span>
        <span className="t-badge t-badge--quiet">{{ bund: "Bund", land: "Land", kommune: "Gemeinde" }[service.level]}</span>
      </p>
    </li>
  );
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

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`t-status t-status--${status}`}>{PROJECT_STATUS[status]}</span>;
}

export function ProjectCard({ project, level = 2 }: { project: Project; level?: 2 | 3 }) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <li className="t-card t-card--media">
      <PhotoFigure photo={project.image} />
      <div className="t-card__body">
        <p className="t-card__eyebrow">
          <StatusBadge status={project.status} />
          <span>{project.level === "land" ? "Land Musterland" : "Beispielstadt"}</span>
        </p>
        <Heading className="t-card__title">
          <Link href={`/projekte/${project.id}`} className="t-cardlink">
            {project.title}
          </Link>
        </Heading>
        <p className="t-card__text">{project.teaser}</p>
        <Progress project={project} />
        <p className="t-meta">
          <span>{project.budget}</span>
          <span>{project.period}</span>
        </p>
      </div>
    </li>
  );
}
