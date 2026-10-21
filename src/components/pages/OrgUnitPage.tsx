import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsRow } from "@/components/Cards";
import { IconArrow } from "@/components/Icons";
import { PortraitFigure } from "@/components/pages/OrgPage";
import { ORGANISATION, groupOf, newsForUnit } from "@/data/organisation";
import type { OrgUnit } from "@/data/organisation";
import { PROJECTS, PROJECT_STATUS } from "@/data/projects";
import { findService } from "@/data/services";
import type { Service } from "@/lib/types";

export function OrgUnitPage({ unit }: { unit: OrgUnit }) {
  const group = groupOf(unit);
  const services = unit.services.map(findService).filter((s): s is Service => Boolean(s));
  const news = newsForUnit(unit).slice(0, 3);
  const others = group.units.filter((u) => u.id !== unit.id);
  const projects = PROJECTS.filter((p) => p.unitId === unit.id);

  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb
            items={[
              { label: ORGANISATION.title, href: "/organisation" },
              { label: unit.name, href: `/organisation/${unit.id}` },
            ]}
          />
          <p className="t-pagehead__kind">
            {group.unitLabel} · {group.title}
          </p>
          <h1 className="t-h1">{unit.name}</h1>
          <p className="t-lead">{unit.lead}</p>
        </div>
      </div>

      <div className="t-container t-page">
        <div className="t-layout">
          <div className="t-layout__main">
            <section className="t-unit-section">
              <h2 className="t-h2">Aufgaben</h2>
              <ul className="t-ticklist">
                {unit.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </section>

            {services.length > 0 && (
              <section className="t-unit-section">
                <h2 className="t-h2">Leistungen</h2>
                <ul className="t-tasks t-tasks--column">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link href={`/leistungen/${service.slug}`} className="t-task">
                        <span>{service.title}</span>
                        <IconArrow size={18} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {projects.length > 0 && (
              <section className="t-unit-section">
                <h2 className="t-h2">Projekte</h2>
                <ul className="t-tasks t-tasks--column">
                  {projects.map((p) => (
                    <li key={p.id}>
                      <Link href={`/projekte/${p.id}`} className="t-task">
                        <span>
                          {p.title}
                          <span className="t-task__meta"> · {PROJECT_STATUS[p.status]}</span>
                        </span>
                        <IconArrow size={18} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {news.length > 0 && (
              <section className="t-unit-section">
                <div className="t-section__head">
                  <h2 className="t-h2">Aktuelles</h2>
                  <Link href="/aktuelles" className="t-more">
                    Alle Meldungen <IconArrow size={18} />
                  </Link>
                </div>
                <ul className="t-newsrows">
                  {news.map((item) => (
                    <NewsRow key={item.id} item={item} />
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="t-layout__side" aria-label="Leitung und Kontakt">
            <section className="t-box t-leader">
              <h2 className="t-box__title">Leitung</h2>
              <PortraitFigure unit={unit} />
              <p className="t-leader__name">{unit.head.name}</p>
              <p className="t-box__note">{unit.head.role}</p>
            </section>
            <section className="t-box t-box--accent">
              <h2 className="t-box__title">Kontakt</h2>
              <p className="t-box__office">
                <strong>{unit.name}</strong>
                <br />
                {unit.address}
                <br />
                Telefon {unit.phone}
                <br />
                {group.hours}
                <br />
                <a href={`mailto:${unit.email}`}>{unit.email}</a>
              </p>
              <p className="t-box__note">Beispieldaten: Adresse und E-Mail sind fiktiv.</p>
            </section>
          </aside>
        </div>

        <section className="t-section">
          <h2 className="t-h2">Weitere {group.heading.replace(/^Die /, "")}</h2>
          <ul className="t-chiplist">
            {others.map((u) => (
              <li key={u.id}>
                <Link href={`/organisation/${u.id}`} className="t-chip">
                  {u.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
