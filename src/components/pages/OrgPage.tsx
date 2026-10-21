import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { IconArrow } from "@/components/Icons";
import { PhotoFigure } from "@/components/Photo";
import { ORGANISATION, ORG_GROUPS } from "@/data/organisation";
import type { OrgGroup, OrgUnit } from "@/data/organisation";

export function PortraitFigure({ unit }: { unit: OrgUnit }) {
  return <PhotoFigure photo={{ src: unit.photo, alt: `Porträt von ${unit.head.name}, fiktive Person` }} size="portrait" />;
}

function Group({ group }: { group: OrgGroup }) {
  const [head, ...units] = group.units;
  const titleId = `gruppe-${group.id}`;
  return (
    <section className="t-section" aria-labelledby={titleId}>
      <h2 id={titleId} className="t-h2">
        {group.title}
      </h2>
      <p className="t-section__lead">{group.lead}</p>

      <article className="t-orghead">
        <PortraitFigure unit={head} />
        <div className="t-orghead__body">
          <p className="t-orghead__role">{head.head.role}</p>
          <p className="t-orghead__name">{head.head.name}</p>
          <h3 className="t-orghead__unit">
            <Link href={`/organisation/${head.id}`} className="t-cardlink">
              {head.name}
            </Link>
          </h3>
          <p>{head.lead}</p>
        </div>
      </article>

      <h3 className="t-h3 t-orgcards__title">{group.heading}</h3>
      <ul className="t-orgcards">
        {units.map((unit) => (
          <li key={unit.id} className="t-orgcard">
            <PortraitFigure unit={unit} />
            <div className="t-orgcard__body">
              <h4 className="t-orgcard__title">
                <Link href={`/organisation/${unit.id}`} className="t-cardlink">
                  {unit.name}
                </Link>
              </h4>
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
  );
}

export function OrgPage() {
  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb items={[{ label: ORGANISATION.title, href: "/organisation" }]} />
          <h1 className="t-h1">{ORGANISATION.title}</h1>
          <p className="t-lead">{ORGANISATION.lead}</p>
          <nav aria-label="Auf dieser Seite" className="t-jumps">
            <ul>
              {ORG_GROUPS.map((group) => (
                <li key={group.id}>
                  <a href={`#gruppe-${group.id}`}>{group.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="t-container t-page">
        {ORG_GROUPS.map((group) => (
          <Group key={group.id} group={group} />
        ))}
      </div>
    </>
  );
}
