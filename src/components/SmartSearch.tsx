"use client";

import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useCurrentTenant } from "@/components/TenantContext";
import { IconArrow, IconBubble, IconCheck, IconSearch, IconSparkle } from "@/components/Icons";
import { EXAMPLE_QUERIES } from "@/data/intents";
import { FEATURED_SERVICES } from "@/data/content";
import { findService } from "@/data/services";
import { searchServices } from "@/lib/smart-search";
import { pluralize } from "@/lib/format";
import type { Service } from "@/lib/types";
import { origin } from "@/lib/origin";
import { openAssistant } from "@/lib/assistant-dock";

type Item = { key: string; group: string; href?: string; fill?: string; label: string; node: ReactNode };

function ServiceFacts({ service }: { service: Service }) {
  return (
    <span className="t-facts-line">
      <span className={service.online ? "t-facts-line__online" : undefined}>
        {service.online && <IconCheck size={14} />}
        {service.online ? "Online möglich" : "Termin vor Ort"}
      </span>
      <span>Kosten: {service.costs}</span>
      <span>Dauer: {service.duration}</span>
    </span>
  );
}

// Central search with suggestions while typing. The "intelligence" is simulated locally
// (phrases, typo tolerance, best match) and the hint under the field says so. Suggestions come
// only from the service catalogue, a static file: information needs a request to its own pot.
export function SmartSearch({ label }: { label: string }) {
  const { tenant, base } = useCurrentTenant();
  const router = useRouter();
  const ids = { input: useId(), list: useId(), hint: useId(), examples: useId() };
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [announcement, setAnnouncement] = useState("");

  // A hidden route keeps its state: close the list when it is hidden.
  useLayoutEffect(() => () => setOpen(false), []);

  const result = useMemo(() => searchServices(query, true), [query]);
  const trimmed = query.trim();

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];
    if (!trimmed) {
      for (const slug of FEATURED_SERVICES[tenant.type].slice(0, 5)) {
        const s = findService(slug);
        if (s)
          list.push({
            key: s.slug,
            group: "Häufige Anliegen",
            href: `/leistungen/${s.slug}`,
            label: s.title,
            node: s.title,
          });
      }
      return list;
    }
    if (result.correction && result.correction.toLowerCase() !== trimmed.toLowerCase()) {
      list.push({
        key: "fix",
        group: "",
        fill: result.correction,
        label: `Meinten Sie: ${result.correction}`,
        node: (
          <>
            Meinten Sie: <strong>{result.correction}</strong>
          </>
        ),
      });
    }
    const answer = result.answer;
    if (answer) {
      list.push({
        key: `answer-${answer.slug}`,
        group: "Das passt am besten",
        href: `/leistungen/${answer.slug}`,
        label: `Das passt am besten: ${answer.title}. ${answer.online ? "Online möglich" : "Termin vor Ort"}`,
        node: (
          <span className="t-smart__answer">
            <span className="t-smart__answer-title">{answer.title}</span>
            <span className="t-smart__answer-text">{answer.summary}</span>
            <ServiceFacts service={answer} />
          </span>
        ),
      });
    }
    for (const hit of result.services.filter((h) => h.service.slug !== answer?.slug).slice(0, 4)) {
      const s = hit.service;
      list.push({ key: s.slug, group: "Leistungen", href: `/leistungen/${s.slug}`, label: s.title, node: s.title });
    }
    for (const s of result.related) {
      list.push({
        key: `rel-${s.slug}`,
        group: "Das brauchen Sie oft auch",
        href: `/leistungen/${s.slug}`,
        label: s.title,
        node: s.title,
      });
    }
    list.push({
      key: "all",
      group: "",
      href: `/suche?q=${encodeURIComponent(trimmed)}`,
      label: `Suchen nach „${trimmed}“`,
      node: (
        <>
          Suchen nach „{trimmed}“ <IconArrow size={16} />
        </>
      ),
    });
    list.push({
      key: "info",
      group: "",
      href: `/suche?q=${encodeURIComponent(trimmed)}&in=informationen`,
      label: `„${trimmed}“ in Informationen und Meldungen suchen`,
      node: (
        <>
          „{trimmed}“ in Informationen und Meldungen suchen <IconArrow size={16} />
        </>
      ),
    });
    return list;
  }, [result, trimmed, tenant.type]);

  const visible = open && items.length > 0;
  const optionId = (i: number) => `${ids.list}-opt-${i}`;

  // Announce the number of suggestions after typing pauses.
  useEffect(() => {
    if (!visible) return;
    const found = items.filter((i) => i.group && i.group !== "Häufige Anliegen").length;
    const text = !trimmed
      ? "Häufige Anliegen. Pfeil nach unten zum Auswählen."
      : found
        ? `${pluralize(found, "Vorschlag", "Vorschläge")}${result.answer ? `, am besten passt ${result.answer.title}` : ""}. Pfeil nach unten zum Auswählen.`
        : "Keine Vorschläge. Mit Eingabe suchen Sie im ganzen Portal.";
    const timer = window.setTimeout(() => setAnnouncement(text), 500);
    return () => window.clearTimeout(timer);
  }, [visible, items, trimmed, result.answer]);

  useEffect(() => {
    if (active < 0) return;
    document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
  });

  const choose = (item: Item) => {
    if (item.fill) {
      setQuery(item.fill);
      setActive(-1);
      inputRef.current?.focus();
      return;
    }
    setOpen(false);
    if (item.href) router.push(base + item.href);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => (a + 1 >= items.length ? 0 : a + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => (a <= 0 ? items.length - 1 : a - 1));
    } else if (event.key === "Enter" && visible && active >= 0) {
      event.preventDefault();
      choose(items[active]);
    } else if (event.key === "Escape") {
      if (visible) {
        event.preventDefault();
        setOpen(false);
        setActive(-1);
      } else if (query) {
        event.preventDefault();
        setQuery("");
      }
    }
  };

  // Consecutive items with the same group form one listbox group.
  const blocks: { group: string; entries: { item: Item; index: number }[] }[] = [];
  items.forEach((item, index) => {
    const last = blocks[blocks.length - 1];
    if (last && item.group && last.group === item.group) last.entries.push({ item, index });
    else blocks.push({ group: item.group, entries: [{ item, index }] });
  });

  const renderOption = ({ item, index }: { item: Item; index: number }) => (
    <div
      key={item.key}
      id={optionId(index)}
      role="option"
      aria-selected={index === active}
      aria-label={item.key.startsWith("answer") ? item.label : undefined}
      className={[
        "t-smart__option",
        item.key.startsWith("answer") ? "t-smart__option--answer" : "",
        item.key === "fix" ? "t-smart__option--fix" : "",
        item.key === "all" || item.key === "info" ? "t-smart__option--all" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={() => setActive(index)}
      onClick={() => choose(item)}
    >
      {item.node}
    </div>
  );

  return (
    <div className="t-smart" {...origin("zentral", "Zentral · Plattform: Suche")}>
      <Form action={`${base}/suche`} role="search" className="t-smart__form" onSubmit={() => setOpen(false)}>
        <div className="t-smart__head">
          <label htmlFor={ids.input} className="t-smart__label">
            {label}
          </label>
          <span className="t-smart__badge">
            <IconSparkle size={14} />
            KI-Vorschläge
          </span>
        </div>
        <div className="t-smart__field">
          <div className="t-smart__control">
            <span className="t-smart__icon" aria-hidden="true">
              <IconSearch />
            </span>
            <input
              ref={inputRef}
              id={ids.input}
              name="q"
              type="text"
              className="t-smart__input"
              role="combobox"
              aria-expanded={visible}
              aria-controls={ids.list}
              aria-autocomplete="list"
              aria-activedescendant={visible && active >= 0 ? optionId(active) : undefined}
              aria-describedby={ids.hint}
              autoComplete="off"
              spellCheck={false}
              placeholder="Ihr Anliegen in eigenen Worten"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
                setActive(-1);
              }}
              onKeyDown={onKeyDown}
              onBlur={() => setOpen(false)}
              onClick={() => setOpen(true)}
            />
            <div
              id={ids.list}
              role="listbox"
              aria-label="Vorschläge"
              className="t-smart__list"
              hidden={!visible}
              onMouseDown={(event) => event.preventDefault()}
            >
              {blocks.map((block, b) =>
                block.group ? (
                  <div
                    key={block.group + b}
                    role="group"
                    aria-labelledby={`${ids.list}-g${b}`}
                    className="t-smart__block"
                  >
                    <div id={`${ids.list}-g${b}`} role="presentation" className="t-smart__group">
                      {block.group === "Das passt am besten" && <IconSparkle size={14} />}
                      {block.group}
                    </div>
                    {block.entries.map(renderOption)}
                  </div>
                ) : (
                  block.entries.map(renderOption)
                ),
              )}
            </div>
          </div>
          <button type="submit" className="t-btn t-btn--primary t-smart__submit">
            Suchen
          </button>
        </div>
        <p id={ids.hint} className="t-smart__hint">
          Schreiben Sie, was Sie vorhaben, zum Beispiel „Garage bauen“. Im Klick-Dummy werden die Vorschläge lokal
          simuliert, ohne echte KI.
        </p>
      </Form>

      <p className="visually-hidden" role="status">
        {announcement}
      </p>

      <div className="t-smart__examples">
        <p id={ids.examples} className="t-smart__examples-label">
          Probieren Sie:
        </p>
        <ul aria-labelledby={ids.examples}>
          {EXAMPLE_QUERIES[tenant.type].map((example) => (
            <li key={example}>
              <button
                type="button"
                className="t-smart__example"
                onClick={() => {
                  setQuery(example);
                  setOpen(true);
                  setActive(-1);
                  inputRef.current?.focus();
                }}
              >
                „{example}“
              </button>
            </li>
          ))}
        </ul>
      </div>

      {tenant.assistant?.enabled !== false && (
        <p className="t-smart__assist">
          <IconBubble size={18} />
          <Link
            href={trimmed ? `${base}/assistent?frage=${encodeURIComponent(trimmed)}` : `${base}/assistent`}
            onClick={(event) => {
              // Wide screens: the small window takes the question. Otherwise the link opens the page.
              if (openAssistant(trimmed || undefined)) event.preventDefault();
            }}
          >
            Lieber Schritt für Schritt? Chat-Assistent öffnen
          </Link>
        </p>
      )}
    </div>
  );
}
