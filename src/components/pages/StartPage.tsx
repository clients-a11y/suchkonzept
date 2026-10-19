"use client";

import Link from "next/link";
import Form from "next/form";
import { useId } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { BlocksArt, HillsArt } from "@/components/Art";
import { IconArrow, IconSearch } from "@/components/Icons";
import { FEATURED_SERVICES, LIFE_SITUATIONS, QUICK_SEARCHES, THEMES, newsFor, pageFor } from "@/data/content";
import { findService } from "@/data/services";
import { formatDate } from "@/lib/format";
import type { NewsItem, Service } from "@/lib/types";
import { useDocumentTitle } from "@/lib/use-document-title";

function featured(type: "info" | "service"): Service[] {
  return FEATURED_SERVICES[type].map(findService).filter((s): s is Service => Boolean(s));
}

function NewsMeta({ item }: { item: NewsItem }) {
  return (
    <p className="t-meta">
      <time dateTime={item.date}>{formatDate(item.date)}</time>
      <span>{item.source}</span>
    </p>
  );
}

function ContactStrip() {
  const { tenant } = useCurrentTenant();
  return (
    <section className="t-band">
      <div className="t-container t-band__inner">
        <h2 className="t-band__title">Fragen? Wir helfen weiter.</h2>
        <dl className="t-band__facts">
          <div>
            <dt>Stelle</dt>
            <dd>{tenant.contact.office}</dd>
          </div>
          <div>
            <dt>Telefon</dt>
            <dd>{tenant.contact.phone}</dd>
          </div>
          <div>
            <dt>Erreichbar</dt>
            <dd>{tenant.contact.hours}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function InfoStart() {
  const { tenant, base } = useCurrentTenant();
  const [lead, ...rest] = newsFor(tenant);
  const more = rest.slice(0, 3);
  return (
    <>
      <div className="t-container t-intro">
        <h1 className="t-h1 t-h1--display">{tenant.name}</h1>
        <p className="t-intro__tagline">{tenant.tagline}</p>
      </div>

      <section className="t-container t-section">
        <div className="t-section__head">
          <h2 className="t-h2">Aktuelles</h2>
          <Link href={`${base}/aktuelles`} className="t-more">
            Alle Meldungen <IconArrow size={18} />
          </Link>
        </div>
        <div className="t-news-grid">
          <article className="t-feature">
            <HillsArt className="t-feature__art" />
            <div className="t-feature__body">
              <NewsMeta item={lead} />
              <h3 className="t-feature__title">
                <Link href={`${base}/aktuelles#meldung-${lead.id}`} className="t-cardlink">
                  {lead.title}
                </Link>
              </h3>
              <p className="t-feature__text">{lead.teaser}</p>
            </div>
          </article>
          <ul className="t-news-list t-news-list--compact">
            {more.map((item) => (
              <li key={item.id} className="t-news-item">
                <NewsMeta item={item} />
                <h3 className="t-news-item__title">
                  <Link href={`${base}/aktuelles#meldung-${item.id}`}>{item.title}</Link>
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="t-container t-section">
        <h2 className="t-h2">Themen</h2>
        <ul className="t-tiles">
          {THEMES.map((theme) => (
            <li key={theme.query} className="t-tile">
              <h3 className="t-tile__title">
                <Link href={`${base}/suche?q=${theme.query}&tab=informationen`} className="t-cardlink">
                  {theme.title}
                </Link>
              </h3>
              <p className="t-tile__text">{theme.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="t-container t-section">
        <div className="t-section__head">
          <h2 className="t-h2">Häufig gesucht</h2>
          <Link href={`${base}/suche?tab=leistungen`} className="t-more">
            Alle Verwaltungsleistungen <IconArrow size={18} />
          </Link>
        </div>
        <ul className="t-linklist">
          {featured("info").map((service) => (
            <li key={service.slug}>
              <Link href={`${base}/leistungen/${service.slug}`}>
                <span>{service.title}</span>
                <IconArrow size={18} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ContactStrip />
    </>
  );
}

function ServiceStart() {
  const { tenant, base } = useCurrentTenant();
  const inputId = useId();
  const quickId = useId();
  const news = newsFor(tenant).slice(0, 3);
  return (
    <>
      <div className="t-hero">
        <BlocksArt className="t-hero__art" />
        <div className="t-container t-hero__inner">
          <h1 className="t-h1">Was möchten Sie erledigen?</h1>
          <Form action={`${base}/suche`} role="search" className="t-bigsearch">
            <label htmlFor={inputId} className="t-bigsearch__label">
              Leistung oder Anliegen suchen
            </label>
            <div className="t-bigsearch__row">
              <input id={inputId} className="t-input t-input--large" name="q" type="search" placeholder="zum Beispiel Personalausweis" autoComplete="off" />
              <button type="submit" className="t-btn t-btn--primary">
                <IconSearch />
                Suchen
              </button>
            </div>
          </Form>
          <p id={quickId} className="t-quick__label">
            Oft gesucht:
          </p>
          <ul className="t-quick" aria-labelledby={quickId}>
            {QUICK_SEARCHES.map((term) => (
              <li key={term}>
                <Link href={`${base}/suche?q=${encodeURIComponent(term)}&tab=leistungen`} className="t-chip">
                  {term}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <section className="t-container t-section">
        <div className="t-section__head">
          <h2 className="t-h2">Häufig gesucht</h2>
          <Link href={`${base}/suche?tab=leistungen`} className="t-more">
            Alle Leistungen A bis Z <IconArrow size={18} />
          </Link>
        </div>
        <ul className="t-cards">
          {featured("service").map((service) => (
            <li key={service.slug} className="t-card">
              <h3 className="t-card__title">
                <Link href={`${base}/leistungen/${service.slug}`} className="t-cardlink">
                  {service.title}
                </Link>
              </h3>
              <p className="t-card__text">{service.summary}</p>
              <p className={service.online ? "t-badge t-badge--online" : "t-badge"}>
                {service.online ? "Online möglich" : "Termin vor Ort"}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="t-container t-section">
        <div className="t-section__head">
          <h2 className="t-h2">Lebenslagen</h2>
          <Link href={`${base}/seite/lebenslagen`} className="t-more">
            Alle Lebenslagen <IconArrow size={18} />
          </Link>
        </div>
        <ul className="t-situations">
          {LIFE_SITUATIONS.map((situation) => (
            <li key={situation.title} className="t-situation">
              <h3 className="t-situation__title">{situation.title}</h3>
              <ul>
                {situation.services.map((slug) => {
                  const service = findService(slug);
                  if (!service) return null;
                  return (
                    <li key={slug}>
                      <Link href={`${base}/leistungen/${slug}`}>{service.title}</Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <div className="t-container t-section t-split">
        <section className="t-townhall">
          <h2 className="t-h2">Rathaus</h2>
          <p className="t-townhall__office">{tenant.contact.office}</p>
          <p>{tenant.contact.address}</p>
          <h3 className="t-townhall__sub">Öffnungszeiten</h3>
          <p>{tenant.contact.hours}</p>
          <p>Telefon {tenant.contact.phone}</p>
          <Link href={`${base}/seite/${pageFor(tenant, "rathaus") ? "rathaus" : "ueber-uns"}`} className="t-more">
            Mehr zum Rathaus <IconArrow size={18} />
          </Link>
        </section>
        <section>
          <div className="t-section__head">
            <h2 className="t-h2">Aktuelles</h2>
            <Link href={`${base}/aktuelles`} className="t-more">
              Alle Meldungen <IconArrow size={18} />
            </Link>
          </div>
          <ul className="t-news-list t-news-list--compact">
            {news.map((item) => (
              <li key={item.id} className="t-news-item">
                <NewsMeta item={item} />
                <h3 className="t-news-item__title">
                  <Link href={`${base}/aktuelles#meldung-${item.id}`}>{item.title}</Link>
                </h3>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export function StartPage() {
  const { tenant } = useCurrentTenant();
  useDocumentTitle(`${tenant.name} · ${tenant.tagline}`);
  return tenant.type === "service" ? <ServiceStart /> : <InfoStart />;
}
