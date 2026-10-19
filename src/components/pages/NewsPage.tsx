"use client";

import { useId, useState } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { Breadcrumb } from "@/components/Breadcrumb";
import { newsFor } from "@/data/content";
import { formatDate, pluralize } from "@/lib/format";
import { useDocumentTitle } from "@/lib/use-document-title";

function normalize(value: string): string {
  return value.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
}

export function NewsPage() {
  const { tenant } = useCurrentTenant();
  useDocumentTitle(`Aktuelles · ${tenant.name}`);
  const news = newsFor(tenant);
  const topics = [...new Set(news.map((n) => n.topic))].sort((a, b) => a.localeCompare(b, "de"));
  const years = [...new Set(news.map((n) => n.date.slice(0, 4)))].sort().reverse();

  const [topic, setTopic] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const topicId = useId();
  const yearId = useId();
  const textId = useId();

  const words = normalize(text).split(/\s+/).filter(Boolean);
  const list = news.filter((n) => {
    if (topic && n.topic !== topic) return false;
    if (year && !n.date.startsWith(year)) return false;
    const haystack = normalize(`${n.title} ${n.teaser} ${n.source}`);
    return words.every((w) => haystack.includes(w));
  });
  const filtered = Boolean(topic || year || text);

  return (
    <div className="t-container t-page">
      <Breadcrumb items={[{ label: "Aktuelles", href: "/aktuelles" }]} />
      <h1 className="t-h1">Aktuelles</h1>
      <p className="t-lead">Meldungen aus {tenant.kind === "Land" ? "Landesregierung und Ministerien" : "Verwaltung und Ämtern"}.</p>

      <form className="t-filters" onSubmit={(event) => event.preventDefault()}>
        <div className="t-field">
          <label htmlFor={topicId}>Thema</label>
          <select id={topicId} className="t-select" value={topic} onChange={(event) => setTopic(event.target.value)}>
            <option value="">Alle Themen</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="t-field">
          <label htmlFor={yearId}>Jahr</label>
          <select id={yearId} className="t-select" value={year} onChange={(event) => setYear(event.target.value)}>
            <option value="">Alle Jahre</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="t-field t-field--grow">
          <label htmlFor={textId}>Freitext</label>
          <input id={textId} className="t-input" type="search" value={text} autoComplete="off" onChange={(event) => setText(event.target.value)} />
        </div>
        <button
          type="button"
          className="t-btn"
          onClick={() => {
            setTopic("");
            setYear("");
            setText("");
          }}
        >
          Filter zurücksetzen
        </button>
      </form>

      <p className="t-count" role="status">
        {pluralize(list.length, "Meldung", "Meldungen")}
        {filtered ? " gefunden" : ""}
      </p>

      {list.length > 0 ? (
        <ul className="t-news-list">
          {list.map((item) => (
            <li key={item.id} id={`meldung-${item.id}`} className="t-news-item" tabIndex={-1}>
              <p className="t-meta">
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <span>{item.topic}</span>
                <span>Quelle: {item.source}</span>
              </p>
              <h2 className="t-news-item__title">{item.title}</h2>
              <p className="t-news-item__text">{item.teaser}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="t-empty">
          <p>Keine Meldungen für diese Auswahl. Setzen Sie die Filter zurück oder wählen Sie ein anderes Jahr.</p>
        </div>
      )}
    </div>
  );
}
