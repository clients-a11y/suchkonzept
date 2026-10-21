import type { CSSProperties, ReactNode } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";

// "So entscheidet die Suche": the search switch explained for stakeholders, with diagrams.
// The numbers are those of src/lib/search-router.ts and src/lib/smart-search.ts; the examples were read
// from the search page ("So hat die Suche entschieden").

type Lane = "l" | "i" | "q";

function Pill({ lane, children }: { lane: Lane; children: ReactNode }) {
  return <span className={`t-flow__pill t-flow__pill--${lane}`}>{children}</span>;
}

// Arrowheads per colour; each diagram gets its own ids.
function Markers({ prefix }: { prefix: string }) {
  return (
    <defs>
      {["", "l", "i", "q"].map((lane) => (
        <marker
          key={lane}
          id={`${prefix}${lane}`}
          className={lane ? `mk mk--${lane}` : "mk"}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" />
        </marker>
      ))}
    </defs>
  );
}

function FlowDiagram() {
  const a = (lane = "") => `url(#sk-a${lane})`;
  return (
    <svg
      className="t-flow__dia"
      viewBox="0 0 1000 730"
      role="img"
      aria-label="Ablauf: Eingabe, Vorschläge aus dem Leistungskatalog ohne Anfrage, Absenden, dann vergibt die Suchweiche Punkte. Mit genug Punkten für Leistungen geht genau eine Anfrage an Leistungen, mit genug Punkten für Informationen genau eine an Informationen, sonst fragt das Portal nach und erst die Wahl der Person löst die Anfrage aus."
    >
      <Markers prefix="sk-a" />

      <g className="box"><rect x="360" y="16" width="280" height="60" rx="8" /></g>
      <text className="t" x="500" y="42" textAnchor="middle">Anliegen eingeben</text>
      <text className="s" x="500" y="62" textAnchor="middle">in eigenen Worten, z. B. „Ich bin umgezogen“</text>
      <line className="edge" x1="500" y1="76" x2="500" y2="110" markerEnd={a()} />

      <g className="box"><rect x="360" y="114" width="280" height="72" rx="8" /></g>
      <text className="t" x="500" y="140" textAnchor="middle">Vorschläge beim Tippen</text>
      <text className="s" x="500" y="160" textAnchor="middle">nur aus dem Leistungskatalog</text>
      <text className="s" x="500" y="177" textAnchor="middle">keine Anfrage an das Backend</text>

      <g className="box l"><rect x="40" y="114" width="220" height="72" rx="8" /></g>
      <text className="t" x="150" y="146" textAnchor="middle">Leistungsseite</text>
      <text className="s" x="150" y="166" textAnchor="middle">Vorschlag direkt geöffnet</text>
      <line className="edge l dash" x1="360" y1="150" x2="264" y2="150" markerEnd={a("l")} />
      <text className="el l" x="312" y="140" textAnchor="middle">anklicken</text>

      <line className="edge" x1="500" y1="186" x2="500" y2="220" markerEnd={a()} />

      <g className="box"><rect x="360" y="224" width="280" height="56" rx="8" /></g>
      <text className="t" x="500" y="248" textAnchor="middle">Absenden</text>
      <text className="s" x="500" y="267" textAnchor="middle">Taste „Suchen“ oder Enter</text>
      <line className="edge" x1="500" y1="280" x2="500" y2="298" markerEnd={a()} />

      <polygon className="dmd" points="500,302 680,368 500,434 320,368" />
      <text className="t" x="500" y="358" textAnchor="middle">Suchweiche</text>
      <text className="s" x="500" y="377" textAnchor="middle">Punkte für Leistungen (L)</text>
      <text className="s" x="500" y="393" textAnchor="middle">und Informationen (I)</text>

      <polyline className="edge l" points="320,368 150,368 150,466" markerEnd={a("l")} />
      <text className="el l" x="235" y="358" textAnchor="middle">L ≥ 3 und L ≥ I + 1</text>
      <polyline className="edge i" points="680,368 850,368 850,466" markerEnd={a("i")} />
      <text className="el i" x="765" y="358" textAnchor="middle">I ≥ 2 und I ≥ L + 1</text>
      <line className="edge q" x1="500" y1="434" x2="500" y2="466" markerEnd={a("q")} />
      <text className="el q" x="510" y="455">sonst</text>

      <g className="box l"><rect x="40" y="470" width="220" height="76" rx="8" /></g>
      <text className="t" x="150" y="496" textAnchor="middle">Anfrage Leistungen</text>
      <text className="m" x="150" y="516" textAnchor="middle">GET /api/leistungen</text>
      <text className="s" x="150" y="534" textAnchor="middle">genau eine Anfrage</text>

      <g className="box q"><rect x="340" y="470" width="320" height="76" rx="8" /></g>
      <text className="t" x="500" y="494" textAnchor="middle">Rückfrage „Was suchen Sie?“</text>
      <text className="s" x="500" y="513" textAnchor="middle">Startseite: Overlay · Suchseite: im Inhalt</text>
      <text className="s" x="500" y="531" textAnchor="middle">noch keine Anfrage</text>

      <g className="box i"><rect x="740" y="470" width="220" height="76" rx="8" /></g>
      <text className="t" x="850" y="496" textAnchor="middle">Anfrage Informationen</text>
      <text className="m" x="850" y="516" textAnchor="middle">GET /api/informationen</text>
      <text className="s" x="850" y="534" textAnchor="middle">genau eine Anfrage</text>

      <line className="edge l dash" x1="340" y1="508" x2="264" y2="508" markerEnd={a("l")} />
      <text className="el l" x="302" y="499" textAnchor="middle">beantragen</text>
      <line className="edge i dash" x1="660" y1="508" x2="736" y2="508" markerEnd={a("i")} />
      <text className="el i" x="698" y="499" textAnchor="middle">informieren</text>

      <line className="edge l" x1="150" y1="546" x2="150" y2="596" markerEnd={a("l")} />
      <line className="edge i" x1="850" y1="546" x2="850" y2="596" markerEnd={a("i")} />
      <line className="edge q dash" x1="500" y1="546" x2="500" y2="596" markerEnd={a("q")} />
      <text className="el q" x="510" y="576">Im Chat fragen</text>

      <g className="box l"><rect x="40" y="600" width="220" height="64" rx="8" /></g>
      <text className="t" x="150" y="626" textAnchor="middle">Ergebnis Leistungen</text>
      <text className="s" x="150" y="646" textAnchor="middle">„Das passt am besten“ und Liste</text>

      <g className="box"><rect x="360" y="600" width="280" height="64" rx="8" /></g>
      <text className="t" x="500" y="626" textAnchor="middle">Chat-Assistent</text>
      <text className="s" x="500" y="646" textAnchor="middle">fragt nach, nutzt dieselbe Weiche</text>

      <g className="box i"><rect x="740" y="600" width="220" height="64" rx="8" /></g>
      <text className="t" x="850" y="626" textAnchor="middle">Ergebnis Informationen</text>
      <text className="s" x="850" y="646" textAnchor="middle">Stellen, Seiten, Projekte, Meldungen</text>

      <polyline className="edge dash" points="150,668 150,700 850,700 850,668" markerStart={a()} markerEnd={a()} />
      <text className="el" x="500" y="720" textAnchor="middle">Knopf „Stattdessen in … suchen“ wechselt den Bereich, mit einer neuen Anfrage</text>
    </svg>
  );
}

function CatalogueDiagram() {
  const b = (lane = "") => `url(#sk-b${lane})`;
  return (
    <svg
      className="t-flow__dia"
      viewBox="0 0 1000 340"
      role="img"
      aria-label="Heute im Prototyp: Der Katalog liegt als Datei im Code, wird beim Bauen Teil der Seite und einmal in den Browser geladen. Vorschlag für den Betrieb: Die Redaktion pflegt Leistungen im Backend, beim Veröffentlichen entsteht daraus eine statische Datei, die der Browser einmal lädt. Erst nach dem Absenden geht genau eine Anfrage an das Backend."
    >
      <Markers prefix="sk-b" />

      <text className="row" x="20" y="30">Heute im Prototyp</text>
      <g className="box"><rect x="20" y="44" width="250" height="78" rx="8" /></g>
      <text className="t" x="145" y="72" textAnchor="middle">Dateien im Code</text>
      <text className="m" x="145" y="92" textAnchor="middle">services.ts · intents.ts</text>
      <text className="m" x="145" y="110" textAnchor="middle">search-terms.ts</text>
      <line className="edge" x1="270" y1="83" x2="356" y2="83" markerEnd={b()} />
      <text className="el" x="313" y="73" textAnchor="middle">beim Bauen</text>

      <g className="box"><rect x="360" y="44" width="250" height="78" rx="8" /></g>
      <text className="t" x="485" y="76" textAnchor="middle">Teil der Seite</text>
      <text className="s" x="485" y="96" textAnchor="middle">mit dem Portal ausgeliefert</text>
      <text className="s" x="485" y="113" textAnchor="middle">wie ein Bild oder Stylesheet</text>
      <line className="edge l" x1="610" y1="83" x2="696" y2="83" markerEnd={b("l")} />
      <text className="el l" x="653" y="73" textAnchor="middle">einmal laden</text>

      <g className="box l"><rect x="700" y="44" width="280" height="78" rx="8" /></g>
      <text className="t" x="840" y="76" textAnchor="middle">Im Browser</text>
      <text className="s" x="840" y="96" textAnchor="middle">Vorschläge, Tippfehler, Suchweiche</text>
      <text className="s" x="840" y="113" textAnchor="middle">beim Tippen keine Anfrage</text>

      <text className="row" x="20" y="170">Vorschlag für den Betrieb</text>
      <rect className="db" x="20" y="184" width="250" height="78" rx="8" />
      <text className="t" x="145" y="212" textAnchor="middle">Backend mit Datenbank</text>
      <text className="s" x="145" y="232" textAnchor="middle">Redaktion pflegt die Leistungen</text>
      <text className="s" x="145" y="249" textAnchor="middle">geplant: Payload</text>
      <line className="edge" x1="270" y1="223" x2="356" y2="223" markerEnd={b()} />
      <text className="el" x="313" y="213" textAnchor="middle">exportiert</text>

      <g className="box"><rect x="360" y="184" width="250" height="78" rx="8" /></g>
      <text className="t" x="485" y="210" textAnchor="middle">Statische Datei</text>
      <text className="m" x="485" y="230" textAnchor="middle">leistungskatalog.json</text>
      <text className="s" x="485" y="248" textAnchor="middle">neu bei jeder Veröffentlichung</text>
      <line className="edge l" x1="610" y1="223" x2="696" y2="223" markerEnd={b("l")} />
      <text className="el l" x="653" y="213" textAnchor="middle">einmal laden</text>

      <g className="box l"><rect x="700" y="184" width="280" height="78" rx="8" /></g>
      <text className="t" x="840" y="216" textAnchor="middle">Im Browser</text>
      <text className="s" x="840" y="236" textAnchor="middle">Vorschläge, Tippfehler, Suchweiche</text>
      <text className="s" x="840" y="253" textAnchor="middle">beim Tippen keine Anfrage</text>

      <polyline className="edge" points="840,262 840,318 145,318 145,266" markerEnd={b()} />
      <text className="el" x="492" y="308" textAnchor="middle">erst nach dem Absenden: genau eine Anfrage, an Leistungen oder an Informationen</text>
    </svg>
  );
}

function PlaceDiagram() {
  const c = (lane = "") => `url(#sk-c${lane})`;
  return (
    <svg
      className="t-flow__dia"
      viewBox="0 0 1000 360"
      role="img"
      aria-label="Leistung gewählt. Bietet das Land die Leistung an, nennt das Portal das Ministerium ohne Frage nach dem Wohnort. Bei einer Leistung der Gemeinde nennt es die zuständige Stelle sofort, wenn der Wohnort bekannt ist, sonst fragt es nach Postleitzahl oder Ort."
    >
      <Markers prefix="sk-c" />

      <g className="box l"><rect x="10" y="140" width="170" height="64" rx="8" /></g>
      <text className="t" x="95" y="166" textAnchor="middle">Leistung gewählt</text>
      <text className="s" x="95" y="186" textAnchor="middle">aus Ergebnis oder Vorschlag</text>
      <line className="edge" x1="180" y1="172" x2="196" y2="172" markerEnd={c()} />

      <polygon className="dmd" points="300,122 400,172 300,222 200,172" />
      <text className="t" x="300" y="168" textAnchor="middle">Wer bietet</text>
      <text className="t" x="300" y="186" textAnchor="middle">sie an?</text>

      <polyline className="edge l" points="300,122 300,52 736,52" markerEnd={c("l")} />
      <text className="el l" x="312" y="92">Land</text>
      <g className="box l"><rect x="740" y="20" width="250" height="64" rx="8" /></g>
      <text className="t" x="865" y="46" textAnchor="middle">Ministerium nennen</text>
      <text className="s" x="865" y="66" textAnchor="middle">kein Wohnort nötig, z. B. Kindergeld</text>

      <line className="edge l" x1="400" y1="172" x2="466" y2="172" markerEnd={c("l")} />
      <text className="el l" x="434" y="162" textAnchor="middle">Gemeinde</text>

      <polygon className="dmd" points="560,120 650,172 560,224 470,172" />
      <text className="t" x="560" y="168" textAnchor="middle">Wohnort</text>
      <text className="t" x="560" y="186" textAnchor="middle">bekannt?</text>

      <line className="edge l" x1="650" y1="172" x2="736" y2="172" markerEnd={c("l")} />
      <text className="el l" x="694" y="162" textAnchor="middle">ja</text>
      <g className="box l"><rect x="740" y="140" width="250" height="64" rx="8" /></g>
      <text className="t" x="865" y="166" textAnchor="middle">Zuständige Stelle nennen</text>
      <text className="s" x="865" y="186" textAnchor="middle">20100: Bürgeramt Beispielstadt</text>

      <line className="edge l" x1="560" y1="224" x2="560" y2="266" markerEnd={c("l")} />
      <text className="el l" x="570" y="250">nein</text>
      <g className="box l"><rect x="440" y="270" width="240" height="76" rx="8" /></g>
      <text className="t" x="560" y="294" textAnchor="middle">Postleitzahl oder Ort erfragen</text>
      <text className="s" x="560" y="313" textAnchor="middle">Inhalte bleiben sichtbar</text>
      <text className="s" x="560" y="331" textAnchor="middle">10480: Neudorf oder Mühlengrund wählen</text>

      <polyline className="edge l" points="680,308 865,308 865,208" markerEnd={c("l")} />
      <text className="el l" x="772" y="298" textAnchor="middle">Ort bestimmt</text>
    </svg>
  );
}

const SIGNALS: { name: string; words: string; points: string; lane?: Lane; target: string }[] = [
  { name: "Handlung", words: "beantragen, Antrag, anmelden, ummelden, verlängern, Formular, Termin, „ich möchte“, „ich brauche“, „wo kann ich“", points: "+3", lane: "l", target: "Leistungen" },
  { name: "Dokument", words: "Ausweis, Reisepass, Zeugnis, Schein, Genehmigung, Bescheinigung, Zulassung, Gebühr", points: "+2", lane: "l", target: "Leistungen" },
  { name: "Treffer im Leistungskatalog", words: "Der Katalog findet eine klar beste Leistung, z. B. „Kindergeld beantragen“. Mehrere Wörter in der Anfrage: +2, ein einzelnes Wort: +1", points: "+2 / +1", lane: "l", target: "Leistungen" },
  { name: "Anliegen erkannt", words: "eine Redewendung aus dem Katalog, z. B. „umgezogen“, „Garage“, „Baby“; zählt nur zusammen mit einem Katalogtreffer", points: "+1", lane: "l", target: "Leistungen" },
  { name: "Art des Inhalts", words: "Meldung, Pressemitteilung, Presse, News, aktuell, Neuigkeit, Nachrichten, Bericht", points: "+4", lane: "i", target: "Informationen" },
  { name: "Thema", words: "Ministerium, Landesregierung, Programm, Projekt, Baustelle, Umleitung, Veranstaltung, Öffnungszeit, Ansprechperson, Kontakt, „wer ist“, „was ist“", points: "+2", lane: "i", target: "Informationen" },
  { name: "Jahreszahl", words: "2026, 1992", points: "+1", lane: "i", target: "Informationen" },
  { name: "Von der Redaktion zugeordnet", words: "feste Liste, z. B. „Wie hoch ist das Kindergeld?“ für Informationen, „Kindergeldantrag“ für Leistungen", points: "+10", target: "dem Bereich aus der Liste" },
];

type Example = { query: string; l: number; i: number; signals: ReactNode[]; lane: Lane; result: string };

const EXAMPLES: Example[] = [
  { query: "Kindergeld beantragen", l: 6, i: 0, lane: "l", result: "Weiche wählt Leistungen", signals: [<><b>beantragen</b>: Handlung +3</>, <><b>Kindergeld beantragen</b>: Katalogtreffer +2</>, <><b>kindergeld</b>: Anliegen erkannt +1</>] },
  { query: "Ich bin umgezogen", l: 3, i: 0, lane: "l", result: "Weiche wählt Leistungen", signals: [<><b>Wohnsitz anmelden</b>: Katalogtreffer +2</>, <><b>umgezogen</b>: Anliegen erkannt +1</>, "Genau an der Schwelle, das reicht."] },
  { query: "Pressemitteilung Kindergeld", l: 3, i: 4, lane: "i", result: "Weiche wählt Informationen", signals: [<><b>Pressemitteilung</b>: Art des Inhalts +4</>, <><b>Kindergeld beantragen</b>: Katalogtreffer +2</>, <><b>kindergeld</b>: Anliegen erkannt +1</>] },
  { query: "Wie hoch ist das Kindergeld?", l: 3, i: 10, lane: "i", result: "Weiche wählt Informationen", signals: [<><b>Wie hoch ist das Kindergeld?</b>: von der Redaktion zugeordnet +10</>, <><b>Kindergeld beantragen</b>: Katalogtreffer +2</>, <><b>kindergeld</b>: Anliegen erkannt +1</>] },
  { query: "Baustelle Marktplatz 2026", l: 0, i: 3, lane: "i", result: "Weiche wählt Informationen", signals: [<><b>Baustelle</b>: Thema +2</>, <><b>2026</b>: Jahreszahl +1</>] },
  { query: "Kindergeld", l: 2, i: 0, lane: "q", result: "Rückfrage „Was suchen Sie?“", signals: [<><b>Kindergeld beantragen</b>: Katalogtreffer, ein Wort +1</>, <><b>kindergeld</b>: Anliegen erkannt +1</>, "Unter der Schwelle für Leistungen."] },
];

function Meter({ label, value, threshold, lane }: { label: string; value: number; threshold: number; lane: "l" | "i" }) {
  return (
    <div className={`t-flow__meter t-flow__meter--${lane}`}>
      <span>{label}</span>
      <span className="t-flow__track" style={{ "--v": value, "--t": threshold } as CSSProperties}>
        <i />
        <b />
      </span>
      <span className="t-flow__val">{value}</span>
    </div>
  );
}

const RECORD: { field: string; value: string; use: string; search?: boolean }[] = [
  { field: "Titel", value: "Kindergeld beantragen", use: "Suche, 6 je Wort", search: true },
  { field: "Schlagwörter", value: "kindergeld, familienkasse, familie, eltern, geburt", use: "Suche, 4 je Wort", search: true },
  { field: "Kurzbeschreibung", value: "Monatliche Unterstützung für Familien, ab dem Monat der Geburt.", use: "Suche, 1 je Wort", search: true },
  { field: "Zuständig", value: "Land", use: "Wohnort nötig?" },
  { field: "Für", value: "Privatpersonen", use: "Filter" },
  { field: "Online möglich", value: "ja", use: "Kurzantwort" },
  { field: "Kosten, Dauer", value: "kostenlos, etwa 4 bis 6 Wochen", use: "Kurzantwort" },
  { field: "Unterlagen", value: "Geburtsurkunde des Kindes, Steuer-Identifikationsnummer, Bankverbindung", use: "Seite, Chat" },
  { field: "Abschnitte", value: "Voraussetzungen, Fristen, Ablauf", use: "Seite, Chat" },
];

export function SearchFlowPage() {
  return (
    <>
      <div className="t-pagehead">
        <div className="t-container">
          <Breadcrumb items={[{ label: "So entscheidet die Suche", href: "/so-entscheidet-die-suche" }]} />
          <h1 className="t-h1">So entscheidet die Suche</h1>
          <p className="t-lead">
            Das Backend durchsucht pro Anfrage genau einen Bereich: Leistungen oder Informationen. Bevor die Anfrage losgeht,
            entscheidet eine Weiche, welcher Bereich gemeint ist. Sie braucht dafür keine Datenbank, nur den Leistungskatalog
            und feste Signalwörter. Ist sie unsicher, fragt sie nach, statt zu raten.
          </p>
          <nav aria-label="Auf dieser Seite" className="t-jumps">
            <ul>
              <li><a href="#ablauf">Ablauf</a></li>
              <li><a href="#katalog">Leistungskatalog</a></li>
              <li><a href="#punkte">Punkte</a></li>
              <li><a href="#beispiele">Beispiele</a></li>
              <li><a href="#wohnort">Wohnort</a></li>
              <li><a href="#sortierung">Sortierung und Chat</a></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="t-container t-page t-flow">
        <section aria-labelledby="ablauf">
          <h2 id="ablauf" className="t-h2">Vom Suchfeld zur Anfrage</h2>
          <figure className="t-flow__figure">
            <div className="t-flow__scroll">
              <FlowDiagram />
            </div>
            <div className="t-flow__legend" aria-hidden="true">
              <span><span className="t-flow__swatch t-flow__swatch--l" />Bereich Leistungen</span>
              <span><span className="t-flow__swatch t-flow__swatch--i" />Bereich Informationen</span>
              <span><span className="t-flow__swatch t-flow__swatch--q" />Rückfrage</span>
              <span><svg width="34" height="8" viewBox="0 0 34 8"><line x1="0" y1="4" x2="34" y2="4" stroke="currentColor" strokeWidth="1.6" /></svg>Die Weiche entscheidet</span>
              <span><svg width="34" height="8" viewBox="0 0 34 8"><line x1="0" y1="4" x2="34" y2="4" stroke="currentColor" strokeWidth="1.6" strokeDasharray="6 5" /></svg>Die Person entscheidet</span>
            </div>
            <figcaption>
              Beim Tippen entsteht keine Anfrage: Die Vorschläge kommen aus dem Leistungskatalog, der als feste Datei im Browser
              liegt. Erst nach dem Absenden rechnet die Weiche. Sie schickt genau eine Anfrage in einen Bereich oder, wenn sie
              unsicher ist, gar keine und fragt zuerst.
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="katalog">
          <h2 id="katalog" className="t-h2">Der Leistungskatalog</h2>
          <p>
            Vorschläge beim Tippen und die Suchweiche arbeiten nur mit dem Leistungskatalog. Er liegt als feste Datei vor und
            kommt zusammen mit dem Portal in den Browser. Deshalb geht beim Tippen keine einzige Anfrage an die Datenbank. Die
            Datenbank wird erst gefragt, wenn die Weiche entschieden hat.
          </p>
          <figure className="t-flow__figure">
            <div className="t-flow__scroll">
              <CatalogueDiagram />
            </div>
            <figcaption>
              Im Prototyp gibt es kein Backend: Der Katalog ist Teil des Codes. Für den Betrieb schlagen wir vor, dass das Backend
              den Katalog bei jeder Veröffentlichung als Datei ausgibt. Die Datenbank ist dann nur an zwei Stellen beteiligt: beim
              Veröffentlichen und bei der einen Suchanfrage nach der Weiche.
            </figcaption>
          </figure>

          <div className="t-flow__two">
            <div className="t-flow__card">
              <h3 className="t-h3">Was ein Eintrag enthält</h3>
              <p className="t-flow__muted">Beispiel aus dem Katalog, rechts steht, wofür das Feld genutzt wird.</p>
              <dl className="t-flow__record">
                {RECORD.map((row) => (
                  <div key={row.field}>
                    <dt>{row.field}</dt>
                    <dd>{row.value}</dd>
                    <dd className={row.search ? "t-flow__use t-flow__use--search" : "t-flow__use"}>{row.use}</dd>
                  </div>
                ))}
              </dl>
              <p className="t-flow__muted">
                Ein gleiches Wort zählt voll, ein Wortanfang, ein Wortteil („genehmigung“ in „Baugenehmigung“) oder eine ähnliche
                Schreibweise einen Punkt weniger. Füllwörter wie „ich“, „möchte“ oder „bitte“ zählen nicht.
              </p>
            </div>
            <div className="t-flow__card">
              <h3 className="t-h3">Was die Suche außerdem mitbringt</h3>
              <ul>
                <li>
                  <b>Anliegen in eigenen Worten:</b> Redewendungen, die auf Leistungen zeigen, z. B. „kind geboren“, „geburt“,
                  „baby“ für Kindergeld, mit „Kitaplatz beantragen“ als oft auch gebraucht. Eine Redewendung zählt 5 Punkte,
                  eine aus mehreren Wörtern 8.
                </li>
                <li><b>Signalwörter der Weiche</b> aus der Tabelle unten.</li>
                <li><b>Von der Redaktion zugeordnete Begriffe</b> wie „Wie hoch ist das Kindergeld?“.</li>
              </ul>
              <h3 className="t-h3">Was nicht hineingehört</h3>
              <ul>
                <li>Meldungen, Seiten, Projekte und Stellen. Sie bilden den Bereich Informationen und bleiben in der Datenbank.</li>
                <li>Personenbezogene Daten. Der Katalog ist für alle gleich und darf öffentlich ausgeliefert werden.</li>
                <li>Die zuständige Stelle je Ort. Sie kommt aus einer eigenen Liste der Orte mit ihren Postleitzahl-Bereichen.</li>
              </ul>
              <p className="t-flow__muted">Umfang im Prototyp: 13 Leistungen und 13 Gruppen von Redewendungen.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="punkte">
          <h2 id="punkte" className="t-h2">Wie die Weiche Punkte vergibt</h2>
          <p>
            Die Weiche liest die Anfrage Wort für Wort und sammelt Punkte für beide Bereiche. Jedes Wort zählt nur einmal, und
            zwar für das erste Signal, das es kennt.
          </p>
          <div className="t-flow__tablewrap">
            <table className="t-flow__table">
              <thead>
                <tr>
                  <th scope="col">Signal</th>
                  <th scope="col">Erkennt zum Beispiel</th>
                  <th scope="col">Punkte</th>
                  <th scope="col">Zählt für</th>
                </tr>
              </thead>
              <tbody>
                {SIGNALS.map((s) => (
                  <tr key={s.name}>
                    <th scope="row">{s.name}</th>
                    <td className="t-flow__words">{s.words}</td>
                    <td className="t-flow__pts">{s.points}</td>
                    <td>{s.lane ? <Pill lane={s.lane}>{s.target}</Pill> : s.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="t-h3">Die Entscheidung</h3>
          <div className="t-flow__rule">
            <div><Pill lane="l">Leistungen</Pill><p>wenn Leistungen mindestens 3 Punkte hat und mindestens 1 Punkt vor Informationen liegt.</p></div>
            <div><Pill lane="i">Informationen</Pill><p>wenn Informationen mindestens 2 Punkte hat und mindestens 1 Punkt vor Leistungen liegt.</p></div>
            <div><Pill lane="q">Rückfrage</Pill><p>in allen anderen Fällen: „Was suchen Sie?“ mit den Antworten „Etwas beantragen“ und „Sich informieren“.</p></div>
          </div>
          <ul className="t-flow__notes">
            <li>Für Informationen reicht eine niedrigere Schwelle, weil ihre Signalwörter seltener zufällig vorkommen.</li>
            <li>Ein einzelnes Thema wie „Kindergeld“, „Kinder“ oder „Hund“ erreicht keine Schwelle. Es kann ein Antrag oder eine Nachricht gemeint sein, deshalb fragt das Portal.</li>
            <li>Die Ergebnisseite zeigt die Rechnung unter „So hat die Suche entschieden“, samt der einen Anfrage an das Backend.</li>
          </ul>
        </section>

        <section aria-labelledby="beispiele">
          <h2 id="beispiele" className="t-h2">Beispiele aus dem Testfall</h2>
          <p className="t-flow__muted">Balken von 0 bis 10 Punkten. Der Strich markiert die Mindestpunktzahl: 3 für Leistungen, 2 für Informationen.</p>
          <ul className="t-flow__examples">
            {EXAMPLES.map((ex) => (
              <li key={ex.query} className="t-flow__example">
                <h3 className="t-h3">„{ex.query}“</h3>
                <Meter label="Leistungen" value={ex.l} threshold={3} lane="l" />
                <Meter label="Informationen" value={ex.i} threshold={2} lane="i" />
                <ul className="t-flow__signals">
                  {ex.signals.map((s, n) => (
                    <li key={n}>{s}</li>
                  ))}
                </ul>
                <Pill lane={ex.lane}>{ex.result}</Pill>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="wohnort">
          <h2 id="wohnort" className="t-h2">Nach der Weiche: Wohnort erst bei Bedarf</h2>
          <p>
            Ist eine Leistung gefunden, fragt das Portal nur dann nach dem Wohnort, wenn eine Gemeinde zuständig ist. Die
            Informationen zur Leistung bleiben dabei immer sichtbar.
          </p>
          <figure className="t-flow__figure">
            <div className="t-flow__scroll">
              <PlaceDiagram />
            </div>
            <figcaption>
              Auch diese Prüfung braucht keine Datenbank: Die Orte mit ihren Postleitzahl-Bereichen liegen ebenfalls als feste
              Datei vor. Der Ort wird nur im Browser gemerkt. Suche, Leistungsseite, Antrag und Chat nutzen denselben Ort, damit
              niemand ihn zweimal eingeben muss.
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="sortierung">
          <h2 id="sortierung" className="t-h2">Wie die Treffer sortiert werden</h2>
          <div className="t-flow__two">
            <div className="t-flow__card">
              <Pill lane="l">Leistungen</Pill>
              <ul>
                <li>Eine erkannte Redewendung zählt am meisten, danach Wörter im Titel, Schlagwörter und zuletzt Wörter in der Beschreibung.</li>
                <li>„Das passt am besten“ erscheint nur, wenn die beste Leistung mindestens 5 Punkte hat und 3 Punkte vor der zweiten liegt.</li>
                <li>Tippfehler werden korrigiert („Baugeminigung“ wird zu „Baugenehmigung“). Bei Gleichstand stehen häufige Anliegen vorn.</li>
              </ul>
            </div>
            <div className="t-flow__card">
              <Pill lane="i">Informationen</Pill>
              <ul>
                <li>Ein Suchwort im Titel zählt mehr als im Text. Stehen alle Suchwörter im Titel, gibt es einen Bonus.</li>
                <li>Bei Gleichstand stehen Stellen und Seiten vor Projekten, Projekte vor Meldungen, neuere Meldungen zuerst.</li>
              </ul>
            </div>
          </div>
          <div className="t-flow__card">
            <h3 className="t-h3">Chat-Assistent</h3>
            <p>
              Der Chat nutzt dieselbe Weiche. Ist Informationen gemeint, zeigt er passende Seiten und Meldungen. Ist die Anfrage
              unklar, fragt er „Möchten Sie etwas erledigen oder sich informieren?“. Passen mehrere Leistungen, etwa bei „Wir haben
              ein Baby bekommen“, fragt er, welche gemeint ist.
            </p>
          </div>
        </section>

        <p className="t-flow__muted">
          Prototyp mit Beispieldaten. Die Weiche ist im Browser simuliert, ohne echte KI. Die Regeln stehen in{" "}
          <code>src/lib/search-router.ts</code>, die von der Redaktion zugeordneten Begriffe in <code>src/data/search-terms.ts</code>.
        </p>
      </div>
    </>
  );
}
