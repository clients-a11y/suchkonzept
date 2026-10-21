"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { IconArrow, IconBubble, IconCheck, IconSearch, IconSparkle } from "@/components/Icons";
import { EXAMPLE_QUERIES } from "@/data/intents";
import { TOP_TASKS } from "@/data/content";
import { findService } from "@/data/services";
import { searchServices } from "@/lib/smart-search";
import { pluralize } from "@/lib/format";
import type { Service } from "@/lib/types";
import { openAssistant } from "@/lib/assistant-dock";
import { routeQuery } from "@/lib/search-router";
import { PotDialog } from "@/components/PotDialog";

type Item = { key: string; group: string; href?: string; fill?: string; chat?: boolean; label: string; node: ReactNode };

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
  const router = useRouter();
  const ids = { input: useId(), list: useId(), hint: useId(), examples: useId() };
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  // Query the search switch could not place: asked in an overlay.
  const [asking, setAsking] = useState<string | null>(null);
  // From sending until the results page takes over: the button shows that the search runs.
  const [searching, setSearching] = useState(false);

  // A hidden route keeps its state: close the list and reset the button when it is hidden.
  useLayoutEffect(
    () => () => {
      setOpen(false);
      setSearching(false);
    },
    [],
  );

  const result = useMemo(() => searchServices(query, true), [query]);
  const trimmed = query.trim();

  // The chat takes the words typed so far: in the small window on wide screens, otherwise on its page.
  const askChat = (text: string) => {
    setOpen(false);
    if (openAssistant(text || undefined)) return;
    router.push(text ? `/assistent?frage=${encodeURIComponent(text)}` : "/assistent");
  };

  const items = useMemo<Item[]>(() => {
    const list: Item[] = [];
    if (!trimmed) {
      for (const slug of TOP_TASKS.slice(0, 5)) {
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
      key: "chat",
      group: "",
      chat: true,
      label: `„${trimmed}“ im Chat fragen`,
      node: (
        <>
          <span className="t-smart__chatoption">
            <IconBubble size={16} />„{trimmed}“ im Chat fragen
          </span>
          <IconArrow size={16} />
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
  }, [result, trimmed]);

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
    if (item.chat) return askChat(trimmed);
    setOpen(false);
    if (item.key === "all" && !routeQuery(trimmed).pot) return setAsking(trimmed);
    if (item.key === "all" || item.key === "info") setSearching(true);
    if (item.href) router.push(item.href);
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
        ["all", "chat", "info"].includes(item.key) ? "t-smart__option--all" : "",
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
    <div className="t-smart">
      <Form
        action="/suche"
        role="search"
        className="t-smart__form"
        onSubmit={(event) => {
          setOpen(false);
          // Unclear between services and information: ask over the page instead of guessing.
          if (trimmed && !routeQuery(trimmed).pot) {
            event.preventDefault();
            setAsking(trimmed);
            return;
          }
          setSearching(true);
        }}
      >
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
          <button type="submit" className="t-btn t-btn--primary t-smart__submit" aria-disabled={searching || undefined}>
            {searching && <span className="t-spinner" aria-hidden="true" />}
            {searching ? "Suche läuft …" : "Suchen"}
          </button>
          <button type="button" className="t-btn t-smart__submit t-smart__chat" onClick={() => askChat(trimmed)}>
            <IconBubble size={20} />
            Im Chat fragen
          </button>
        </div>
        <p id={ids.hint} className="t-smart__hint">
          In eigenen Worten, zum Beispiel „Garage bauen“. Simuliert, ohne echte KI.
        </p>
      </Form>

      <p className="visually-hidden" role="status">
        {announcement}
      </p>
      <PotDialog
        query={asking}
        onClose={(dismissed) => {
          setAsking(null);
          if (dismissed) inputRef.current?.focus();
        }}
        onChat={askChat}
      />

      <div className="t-smart__examples">
        <p id={ids.examples} className="t-smart__examples-label">
          Probieren Sie:
        </p>
        <ul aria-labelledby={ids.examples}>
          {EXAMPLE_QUERIES.map((example) => (
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
    </div>
  );
}
