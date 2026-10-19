"use client";

import Link from "next/link";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsFigure } from "@/components/NewsArt";
import { IconArrow } from "@/components/Icons";
import { NotFoundBlock } from "@/components/pages/NotFoundBlock";
import { PortraitFigure } from "@/components/pages/OrgPage";
import { newsForUnit, organisationFor, unitFor } from "@/data/organisation";
import { findService } from "@/data/services";
import { formatDate } from "@/lib/format";
import type { Service } from "@/lib/types";
import { useDocumentTitle } from "@/lib/use-document-title";

export function OrgUnitPage({ id }: { id: string }) {
  const { tenant, base } = useCurrentTenant();
  const org = organisationFor(tenant);
  const unit = unitFor(tenant, id);
  useDocumentTitle(`${unit?.name ?? `${org.unitLabel} nicht gefunden`} · ${tenant.name}`);
  if (!unit) return <NotFoundBlock what={org.unitLabel} />;

  const services = unit.services.map(findService).filter((s): s is Service => Boolean(s));
  const news = newsForUnit(tenant, unit).slice(0, 3);
  const others = org.units.filter((u) => u.id !== unit.id);

  return (
    <div className="t-container t-page">
      <Breadcrumb
        items={[
          { label: org.title, href: "/organisation" },
          { label: unit.name, href: `/organisation/${unit.id}` },
        ]}
      />
      <h1 className="t-h1">{unit.name}</h1>
      <p className="t-lead">{unit.lead}</p>

      <div className="t-service">
        <div>
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
              <ul className="t-linklist">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link href={`${base}/leistungen/${service.slug}`}>
                      <span>{service.title}</span>
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
                <Link href={`${base}/aktuelles`} className="t-more">
                  Alle Meldungen <IconArrow size={18} />
                </Link>
              </div>
              <ul className="t-news-list t-news-list--compact">
                {news.map((item) => (
                  <li key={item.id} className="t-news-item t-news-item--thumb">
                    <NewsFigure image={item.image} type={tenant.type} size="thumb" />
                    <div>
                      <p className="t-meta">
                        <time dateTime={item.date}>{formatDate(item.date)}</time>
                        <span>{item.topic}</span>
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
          <section className="t-box t-box--quiet t-leader">
            <h2 className="t-box__title">Leitung</h2>
            <PortraitFigure unit={unit} credit={`${tenant.name}/Bildstelle`} />
            <p className="t-leader__name">{unit.head.name}</p>
            <p className="t-box__note">{unit.head.role}</p>
          </section>
          <section className="t-box">
            <h2 className="t-box__title">Kontakt</h2>
            <p className="t-box__office">
              <strong>{unit.name}</strong>
              <br />
              {unit.address}
              <br />
              Telefon {unit.phone}
              <br />
              <a href={`mailto:${unit.email}`}>{unit.email}</a>
            </p>
            <p className="t-box__note">Beispieldaten: Adresse und E-Mail sind fiktiv.</p>
          </section>
        </div>
      </div>

      <section className="t-section">
        <h2 className="t-h2">Weitere {org.heading.replace(/^Die /, "")}</h2>
        <ul className="t-chiplist">
          {others.map((u) => (
            <li key={u.id}>
              <Link href={`${base}/organisation/${u.id}`} className="t-chip">
                {u.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
