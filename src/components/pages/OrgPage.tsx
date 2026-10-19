"use client";

import Image from "next/image";
import Link from "next/link";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Portrait } from "@/components/Portrait";
import { IconArrow } from "@/components/Icons";
import { AI_CREDIT } from "@/components/NewsArt";
import { organisationFor } from "@/data/organisation";
import type { OrgUnit } from "@/data/organisation";
import { useDocumentTitle } from "@/lib/use-document-title";
import { editorial } from "@/lib/origin";

export function PortraitFigure({ unit, credit }: { unit: OrgUnit; credit: string }) {
  return (
    <figure className="t-figure t-figure--portrait">
      {unit.photo ? (
        <Image
          src={unit.photo}
          alt={`Porträt von ${unit.head.name}, fiktive Person`}
          width={800}
          height={1000}
          sizes="(min-width: 64rem) 20rem, (min-width: 40rem) 40vw, 100vw"
          className="t-figure__img t-figure__photo"
        />
      ) : (
        <Portrait variant={unit.portrait} label={`Porträt-Illustration: ${unit.head.name}`} className="t-figure__img" />
      )}
      <figcaption className="t-figure__credit">{unit.photo ? AI_CREDIT : `© ${credit}`}</figcaption>
    </figure>
  );
}

export function OrgPage() {
  const { tenant, base } = useCurrentTenant();
  const org = organisationFor(tenant);
  useDocumentTitle(`${org.title} · ${tenant.name}`);
  const [head, ...units] = org.units;
  const credit = `${tenant.name}/Bildstelle`;

  return (
    <div className="t-container t-page">
      <Breadcrumb items={[{ label: org.title, href: "/organisation" }]} />
      <h1 className="t-h1">{org.title}</h1>
      <p className="t-lead">{org.lead}</p>

      <article className="t-orghead" {...editorial(tenant, "Organisation")}>
        <PortraitFigure unit={head} credit={credit} />
        <div className="t-orghead__body">
          <p className="t-orghead__role">{head.head.role}</p>
          <p className="t-orghead__name">{head.head.name}</p>
          <h2 className="t-orghead__unit">
            <Link href={`${base}/organisation/${head.id}`} className="t-cardlink">
              {head.name}
            </Link>
          </h2>
          <p>{head.lead}</p>
        </div>
      </article>

      <section className="t-section">
        <h2 className="t-h2">{org.heading}</h2>
        <ul className="t-orgcards" {...editorial(tenant, "Organisation")}>
          {units.map((unit) => (
            <li key={unit.id} className="t-orgcard">
              <PortraitFigure unit={unit} credit={credit} />
              <div className="t-orgcard__body">
                <h3 className="t-orgcard__title">
                  <Link href={`${base}/organisation/${unit.id}`} className="t-cardlink">
                    {unit.name}
                  </Link>
                </h3>
                <p className="t-orgcard__head">
                  {unit.head.role}
                  <br />
                  <strong>{unit.head.name}</strong>
                </p>
                <ul className="t-orgcard__tasks">
                  {unit.tasks.slice(0, 3).map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
                <span className="t-orgcard__more" aria-hidden="true">
                  Mehr erfahren <IconArrow size={16} />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
