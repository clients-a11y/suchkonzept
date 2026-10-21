"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProjectCard } from "@/components/Cards";
import { PROJECTS, PROJECTS_PAGE, PROJECT_STATUS } from "@/data/projects";
import type { ProjectStatus } from "@/data/projects";
import { pluralize } from "@/lib/format";

function formatVolume(mio: number): string {
  return mio >= 1000
    ? `${(mio / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mrd. Euro`
    : `${mio.toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mio. Euro`;
}

const FILTERS: (ProjectStatus | "alle")[] = ["alle", "planung", "bau", "fertig"];
const FILTER_TEXT: Record<ProjectStatus, string> = { planung: "in Planung", bau: "im Bau", fertig: "abgeschlossen" };

export function ProjectsPage() {
  const [filter, setFilter] = useState<ProjectStatus | "alle">("alle");
  const shown = PROJECTS.filter((p) => filter === "alle" || p.status === filter);
  const volume = PROJECTS.reduce((sum, p) => sum + p.budgetMio, 0);
  const count = (s: ProjectStatus | "alle") => (s === "alle" ? PROJECTS.length : PROJECTS.filter((p) => p.status === s).length);

  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb items={[{ label: PROJECTS_PAGE.title, href: "/projekte" }]} />
          <h1 className="t-h1">{PROJECTS_PAGE.title}</h1>
          <p className="t-lead">{PROJECTS_PAGE.lead}</p>
        </div>
      </div>
      <div className="t-container t-page">
        <dl className="t-figures">
          <div>
            <dt>Projekte</dt>
            <dd>{PROJECTS.length}</dd>
          </div>
          <div>
            <dt>Im Bau</dt>
            <dd>{count("bau")}</dd>
          </div>
          <div>
            <dt>Abgeschlossen</dt>
            <dd>{count("fertig")}</dd>
          </div>
          <div>
            <dt>Gesamtvolumen</dt>
            <dd>{formatVolume(volume)}</dd>
          </div>
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

        <ul className="t-cards t-cards--3">
          {shown.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      </div>
    </>
  );
}
