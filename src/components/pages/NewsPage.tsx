"use client";

import { useId, useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsMeta } from "@/components/Cards";
import { PhotoFigure } from "@/components/Photo";
import { NEWS } from "@/data/content";
import { pluralize } from "@/lib/format";
import type { Level } from "@/lib/types";

function normalize(value: string): string {
  return value.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
}

const LEVELS: { value: Level; label: string }[] = [
  { value: "land", label: "Land Musterland" },
  { value: "kommune", label: "Beispielstadt" },
];

export function NewsPage() {
  const topics = [...new Set(NEWS.map((n) => n.topic))].sort((a, b) => a.localeCompare(b, "de"));
  const years = [...new Set(NEWS.map((n) => n.date.slice(0, 4)))].sort().reverse();

  const [level, setLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const ids = { level: useId(), topic: useId(), year: useId(), text: useId() };

  const words = normalize(text).split(/\s+/).filter(Boolean);
  const list = NEWS.filter((n) => {
    if (level && n.level !== level) return false;
    if (topic && n.topic !== topic) return false;
    if (year && !n.date.startsWith(year)) return false;
    const haystack = normalize(`${n.title} ${n.teaser} ${n.source}`);
    return words.every((w) => haystack.includes(w));
  });
  const filtered = Boolean(level || topic || year || text);

  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb items={[{ label: "Aktuelles", href: "/aktuelles" }]} />
          <h1 className="t-h1">Aktuelles</h1>
          <p className="t-lead">Meldungen der Landesregierung, der Ministerien und der Stadtverwaltung Beispielstadt.</p>
        </div>
      </div>

      <div className="t-container t-page">
        <form className="t-filters" onSubmit={(event) => event.preventDefault()}>
          <div className="t-field">
            <label htmlFor={ids.level}>Herausgeber</label>
            <select id={ids.level} className="t-select" value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="">Alle</option>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div className="t-field">
            <label htmlFor={ids.topic}>Thema</label>
            <select id={ids.topic} className="t-select" value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="">Alle Themen</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="t-field">
            <label htmlFor={ids.year}>Jahr</label>
            <select id={ids.year} className="t-select" value={year} onChange={(event) => setYear(event.target.value)}>
              <option value="">Alle Jahre</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="t-field t-field--grow">
            <label htmlFor={ids.text}>Freitext</label>
            <input id={ids.text} className="t-input" type="search" value={text} autoComplete="off" onChange={(event) => setText(event.target.value)} />
          </div>
          <button
            type="button"
            className="t-btn"
            onClick={() => {
              setLevel("");
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
          <ul className="t-newslist">
            {list.map((item) => (
              <li key={item.id} id={`meldung-${item.id}`} className="t-newsitem" tabIndex={-1}>
                <PhotoFigure photo={item.image} />
                <div className="t-newsitem__body">
                  <NewsMeta item={item} topic />
                  <h2 className="t-newsitem__title">{item.title}</h2>
                  <p>{item.teaser}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="t-empty">
            <p>Keine Meldungen für diese Auswahl. Setzen Sie die Filter zurück oder wählen Sie ein anderes Jahr.</p>
          </div>
        )}
      </div>
    </>
  );
}
