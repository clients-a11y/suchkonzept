"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { IconArrow, IconBubble, IconCheck, IconSearch, IconSparkle } from "@/components/Icons";
import { PlaceAlert, useRequiredPlace } from "@/components/RequiredPlace";
import { TOP_TASKS } from "@/data/content";
import { findService } from "@/data/services";
import { searchServices } from "@/lib/smart-search";
import { pluralize } from "@/lib/format";
import type { Service } from "@/lib/types";
import { CHAT_IN_PORTAL, ONE_RESULTS_PAGE, SEARCH_PATH, SUGGESTIONS_IN_SEARCH } from "@/data/site";
import { openAssistant } from "@/lib/assistant-dock";
import { isCentral, placeMatters } from "@/lib/offices";
import { routeQuery } from "@/lib/search-router";
import { useTestConfig } from "@/lib/test-config";
import { SearchSteps } from "@/components/PotDialog";
import type { SearchRequest } from "@/components/PotDialog";

// The highlighted first suggestion: the best service, or the information search when the switch points there.
function isLead(item: { key: string }): boolean {
  return item.key.startsWith("answer") || item.key === "info-top";
}

function resultsHref(query: string): string {
  return `/ergebnisse?q=${encodeURIComponent(query)}`;
}

// title: the service a suggestion opens, named again when the place is asked for. central: one office for
// everyone, so the place is not asked.
type Item = { key: string; group: string; href?: string; title?: string; central?: boolean; fill?: string; chat?: boolean; label: string; node: ReactNode };

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

// Central search with suggestions while typing: phrases, typo tolerance and a best match, all with fixed
// rules in the browser. Suggestions come only from the service catalogue, a static file; information needs a
// request to its own pot. The search switch runs while typing too, so the list never contradicts it.
export function SmartSearch({ label }: { label: string }) {
  const router = useRouter();
  const ids = { input: useId(), list: useId(), hint: useId(), place: useId(), placeStatus: useId() };
  const inputRef = useRef<HTMLInputElement>(null);
  const placeInForm = useTestConfig().place === "start";
  const requiredPlace = useRequiredPlace(ids.place);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [announcement, setAnnouncement] = useState("");
  // The steps before a search: "Was suchen Sie?" if unclear, then always the place.
  const [request, setRequest] = useState<SearchRequest | null>(null);
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
  // "Neuigkeiten Kindergeld": the catalogue knows Kindergeld, but the switch sends the search to information.
  // Then the information search leads the list, and no service is called the best match.
  const infoFirst = useMemo(() => Boolean(trimmed) && routeQuery(trimmed).pot === "informationen", [trimmed]);
  const answer = infoFirst ? undefined : result.answer;

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
            title: s.title,
            central: isCentral(s),
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
    const infoHref = `/suche?q=${encodeURIComponent(trimmed)}&in=informationen`;
    if (infoFirst) {
      list.push({
        key: "info-top",
        group: "Das passt am besten",
        href: infoHref,
        label: `Das passt am besten: Informationen zu „${trimmed}“. Meldungen, Seiten, Projekte und Stellen`,
        node: (
          <span className="t-smart__answer">
            <span className="t-smart__answer-title">Informationen zu „{trimmed}“</span>
            <span className="t-smart__answer-text">Meldungen, Seiten, Projekte und Stellen</span>
          </span>
        ),
      });
    }
    if (answer) {
      list.push({
        key: `answer-${answer.slug}`,
        group: "Das passt am besten",
        href: `/leistungen/${answer.slug}`,
        title: answer.title,
        central: isCentral(answer),
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
      list.push({ key: s.slug, group: "Leistungen", href: `/leistungen/${s.slug}`, title: s.title, central: isCentral(s), label: s.title, node: s.title });
    }
    for (const s of result.related) {
      list.push({
        key: `rel-${s.slug}`,
        group: "Das brauchen Sie oft auch",
        href: `/leistungen/${s.slug}`,
        title: s.title,
        central: isCentral(s),
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
    if (CHAT_IN_PORTAL) {
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
    }
    if (!infoFirst) {
      list.push({
        key: "info",
        group: "",
        href: infoHref,
        label: `„${trimmed}“ in Informationen und Meldungen suchen`,
        node: (
          <>
            „{trimmed}“ in Informationen und Meldungen suchen <IconArrow size={16} />
          </>
        ),
      });
    }
    return list;
  }, [result, trimmed, infoFirst, answer]);

  const visible = SUGGESTIONS_IN_SEARCH && open && items.length > 0;
  const optionId = (i: number) => `${ids.list}-opt-${i}`;

  // Announce the number of suggestions after typing pauses.
  useEffect(() => {
    if (!visible) return;
    const found = items.filter((i) => i.group && i.group !== "Häufige Anliegen").length;
    const text = !trimmed
      ? "Häufige Anliegen. Pfeil nach unten zum Auswählen."
      : found
        ? `${pluralize(found, "Vorschlag", "Vorschläge")}${answer ? `, am besten passt ${answer.title}` : infoFirst ? ", am besten passen Informationen" : ""}. Pfeil nach unten zum Auswählen.`
        : "Keine Vorschläge. Mit Eingabe suchen Sie im ganzen Portal.";
    const timer = window.setTimeout(() => setAnnouncement(text), 500);
    return () => window.clearTimeout(timer);
  }, [visible, items, trimmed, answer, infoFirst]);

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
    // With the one results page a service opens at once, everything else is a search.
    if (ONE_RESULTS_PAGE) return item.title && item.href ? go(item.href) : searchNow();
    if (item.key === "all") return start(routeQuery(trimmed).pot ? { query: trimmed, href: item.href } : { query: trimmed }, undefined, true);
    if (!item.href) return;
    // A service decides by its own office, a search by the service it clearly leads to. A suggested service
    // comes from the catalogue, so nothing has to be judged first.
    start({ query: trimmed, href: item.href, title: item.title }, item.title ? !item.central : placeMatters(trimmed), !item.title);
  };

  const go = (href: string) => {
    if (href.startsWith("/suche") || href.startsWith("/ergebnisse")) setSearching(true);
    router.push(href);
  };

  // Every search asks for the place first, unless it clearly leads to a service with one office for everyone.
  const start = (next: Omit<SearchRequest, "place" | "wait">, place = placeMatters(next.query), wait = false) => {
    if (next.href && !place && !wait) return go(next.href);
    setRequest({ ...next, place, wait });
  };

  // The results page asks what is still open, waits and shows the results. A test can require the place here first.
  const searchNow = () => {
    if (placeInForm && !requiredPlace.confirm()) return;
    go(trimmed ? resultsHref(trimmed) : SEARCH_PATH);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (SUGGESTIONS_IN_SEARCH && event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => (a + 1 >= items.length ? 0 : a + 1));
    } else if (SUGGESTIONS_IN_SEARCH && event.key === "ArrowUp") {
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
      aria-label={isLead(item) ? item.label : undefined}
      className={[
        "t-smart__option",
        isLead(item) ? "t-smart__option--answer" : "",
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
        action={SEARCH_PATH}
        role="search"
        className="t-smart__form"
        noValidate
        onSubmit={(event) => {
          // A search asks for the place first; an unclear one asks "Was suchen Sie?" before that.
          event.preventDefault();
          setOpen(false);
          if (ONE_RESULTS_PAGE) return searchNow();
          if (!trimmed) return start({ query: "", href: "/suche" });
          start(routeQuery(trimmed).pot ? { query: trimmed, href: `/suche?q=${encodeURIComponent(trimmed)}` } : { query: trimmed }, undefined, true);
        }}
      >
        <div className="t-smart__head">
          <label htmlFor={ids.input} className="t-smart__label">
            {label}
          </label>
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
              {...(SUGGESTIONS_IN_SEARCH && {
                role: "combobox",
                "aria-expanded": visible,
                "aria-controls": ids.list,
                "aria-autocomplete": "list" as const,
                "aria-activedescendant": visible && active >= 0 ? optionId(active) : undefined,
              })}
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
            {SUGGESTIONS_IN_SEARCH && (
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
            )}
          </div>
          {placeInForm && (
            <div className={requiredPlace.problem ? "t-smart__place t-smart__place--problem" : "t-smart__place"}>
              <label htmlFor={ids.place} className="t-smart__placelabel">
                PLZ oder Ort (Pflichtfeld)
              </label>
              <input
                id={ids.place}
                type="text"
                className="t-smart__placeinput"
                value={requiredPlace.value}
                required
                autoComplete="postal-code"
                spellCheck={false}
                aria-describedby={ids.placeStatus}
                aria-invalid={requiredPlace.problem ? true : undefined}
                onChange={(event) => requiredPlace.change(event.target.value)}
              />
            </div>
          )}
          <button type="submit" className="t-btn t-btn--primary t-smart__submit" aria-disabled={searching || undefined}>
            {searching && <span className="t-spinner" aria-hidden="true" />}
            {searching ? "Suche läuft …" : "Suchen"}
          </button>
          {CHAT_IN_PORTAL && (
            <button type="button" className="t-btn t-smart__submit t-smart__chat" onClick={() => askChat(trimmed)}>
              <IconBubble size={20} />
              Im Chat fragen
            </button>
          )}
        </div>
        {placeInForm && <PlaceAlert id={ids.placeStatus} problem={requiredPlace.problem} tries={requiredPlace.tries} />}
        <p id={ids.hint} className="t-smart__hint">
          In eigenen Worten, zum Beispiel „Garage bauen“.{placeInForm && " Geben Sie bitte auch Ihre PLZ oder Ihren Ort an."}
        </p>
      </Form>

      <p className="visually-hidden" role="status">
        {announcement}
      </p>
      <SearchSteps
        request={request}
        onClose={(dismissed) => {
          setRequest(null);
          if (dismissed) inputRef.current?.focus();
        }}
        onDone={go}
        onChat={CHAT_IN_PORTAL ? askChat : undefined}
      />
    </div>
  );
}
