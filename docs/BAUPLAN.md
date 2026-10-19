# Bauplan: Klick-Dummy „Portalbaukasten“

Stand 19.10.2026. Klick-Dummy für eine mandantenfähige Portalplattform, ohne Backend.
Neutral: kein Bezug zu einem Arbeitgeber, kein fremder Code, kein fremdes Designsystem (kein MUSE),
nur fiktive Mandanten und Beispieldaten. Ein Backend (Payload) folgt später.

## Ziel

Zeigen, dass aus einem System mehrere Portale entstehen, die jeweils wie sie selbst aussehen,
und dass ein neuer Mandant in Minuten ohne Codeänderung angelegt wird.

## Entscheidungen

- Stack: Next.js 16 (App Router, TypeScript), kein Tailwind, eigenes CSS mit CSS-Variablen.
  **Achtung:** `AGENTS.md` lesen. Next 16 weicht ab, Doku liegt in `node_modules/next/dist/docs/`.
  `params` in Pages und Layouts ist ein Promise (`await params`). Client-Komponenten mit
  `useSearchParams` in `<Suspense>` einpacken.
- Designbasis: eigenes, schlichtes Token-Set (KERN vorerst nicht, Lizenzfrage offen).
- Mandantenwechsel über den Pfad: `/musterland`, `/beispielstadt` (lokal keine Domains).
- Neue Mandanten aus dem Assistenten liegen nur in `localStorage` (kein Backend).
- Alle Inhalte sind Beispieldaten, das steht sichtbar im Footer.

## Gestaltung

**Plattform-Rahmen** (Startseite `/`, Assistent `/neu`, Demo-Leiste):
- Ink `#15181C`, Papier `#F4F5F2`, Linie `#D5D8D2`, Gedämpft `#5E646B`, Roter Faden `#C8412B` (einziger Akzent,
  nur für Linien, Stoppuhr, Fokus im Rahmen).
- Schrift: Public Sans (`--f-sans`) für Text, IBM Plex Mono (`--f-mono`) für Tokens, Hex-Werte und die Stoppuhr.

**Mandanten** (Werte in `src/data/tenants.ts`):
- Musterland, Land, Informationsportal: Heide-Violett `#5B3A6E`, Sand `#D9B26F`, Fläche `#F6F2F7`,
  Überschriften Source Serif 4 (`--f-serif`), Text Public Sans, Radius 2 px, kantig und ruhig.
- Beispielstadt, Stadt, Serviceportal: Kanal-Petrol `#00707A`, Orange `#F4A259`, Fläche `#EEF6F6`,
  Atkinson Hyperlegible (`--f-hyper`) für alles, Radius 14 px, freundlich.

**Erkennungszeichen:**
1. Demo-Leiste oben auf jeder Mandantenseite (dunkel, Plattform-Stil): Link zur Übersicht,
   Mandanten-Umschalter (Select mit allen Mandanten inkl. eigener), Token-Chips
   (Farbfelder mit Hex in Mono, Schriftname, Radius), Button „Neuen Mandanten anlegen“.
   Als `<aside aria-label="Demo-Steuerung">`.
2. Stoppuhr im Assistenten (Mono, roter Faden), startet bei der ersten Eingabe.

**Illustrationen:** keine Stockfotos. Inline-SVG, das seine Farben aus den Tokens zieht
(`style={{ fill: "var(--t-primary)" }}`): Hügellandschaft für Informationsportale, Stadtblöcke für Serviceportale.
So bekommen auch neue Mandanten automatisch passende Bilder.

## Theme-Mechanik (fertig)

`themeStyle(tokens)` in `src/lib/tenant-store.ts` setzt auf dem Mandanten-Wrapper:
`--t-primary`, `--t-on-primary`, `--t-primary-tint`, `--t-accent`, `--t-on-accent`, `--t-surface`,
`--t-heading`, `--t-body`, `--t-radius`. Alle Mandanten-Komponenten nutzen nur diese Variablen.

## Grundgerüst (vorab vorhanden)

- `src/lib/types.ts` Typen (Tenant, Tokens, Service, NewsItem, ContentPage)
- `src/lib/color.ts` WCAG-Kontrast, `onColor`, `tint`, `formatRatio`
- `src/lib/tenant-store.ts` localStorage-Store (`useCustomTenants`, `useAllTenants`, `useTenant`,
  `saveCustomTenant`, `removeCustomTenant`), `themeStyle`, `FONT_LABEL`, `slugify`
- `src/data/tenants.ts` zwei Mandanten, `defaultNav(type)` für neue Mandanten
- `src/data/services.ts` gemeinsamer Leistungskatalog (10 Leistungen)
- `src/data/content.ts` News, Inhaltsseiten, `THEMES`, `LIFE_SITUATIONS`, Vorlagen für neue Mandanten
- `src/app/layout.tsx` Schriften (`--f-sans`, `--f-serif`, `--f-hyper`, `--f-mono`), `lang="de"`
- `src/components/TenantContext.tsx` (`useCurrentTenant()` liefert `{ tenant, base }`)
- `src/components/Emblem.tsx` fiktives Wappen aus Tokens

## Umgesetzt

Alle folgenden Teile sind gebaut (Stand 19.10.2026) und auf Desktop und 390 px geprüft.

### Komponenten (`src/components/`)
- `TenantShell.tsx` (client): löst Mandanten über `useTenant(id)` auf („loading“ → kurzer Ladezustand,
  undefined → „Mandant nicht gefunden“ mit Link zur Übersicht), setzt `themeStyle`, rendert Skip-Link
  „Zum Inhalt“, DemoBar, Header, `<main id="inhalt">`, Footer, stellt `TenantContext` bereit.
- `DemoBar.tsx` (siehe Erkennungszeichen).
- `Header.tsx` (client): obere Leiste mit Plätzen für Gebärdensprache, Leichte Sprache, Einfache Sprache
  (nur wenn in `tenant.meta` aktiv, Ziel `/seite/...` Platzhalter) und Sprache; Hauptzeile mit Emblem,
  Name und Tagline (Link auf Startseite), **sichtbare Hauptnavigation auf dem Desktop**
  (`<nav aria-label="Hauptnavigation">`, aktive Seite mit `aria-current`), Suchlink; mobil Menü-Button
  mit `aria-label="Menü"`, `aria-expanded`, `aria-controls`.
- `Footer.tsx`: Spalten aus `tenant.footer`, Kontaktblock, Hinweis „Klick-Dummy mit Beispieldaten“.
- `Breadcrumb.tsx`: voller Pfad, `<nav aria-label="Brotkrumen">`, letzte Stufe mit `aria-current="page"`.
- `Art.tsx`: `HillsArt` und `BlocksArt` (Token-gefärbte SVGs, `aria-hidden`).

### Seiten (`src/components/pages/` als Client-Komponenten, Routen als dünne Server-Dateien)
- `/[tenant]` StartPage:
  - Informationsportal: Kopf mit Name (H1) und Tagline, Aufmacher = neueste Meldung mit HillsArt,
    weitere Meldungen, Themen-Kacheln (`THEMES`, Link auf Suche), „Häufig gesucht“ (3 bis 4 Leistungen),
    Kontaktstreifen.
  - Serviceportal: H1 „Was möchten Sie erledigen?“ mit großem Suchfeld (GET auf `/suche?q=`),
    Schnellwahl-Chips, „Häufig gesucht“ (6 Leistungen als Karten mit Online-Badge), Lebenslagen
    (`LIFE_SITUATIONS`), Rathaus-Box mit Öffnungszeiten, 3 Meldungen.
- `/[tenant]/leistungen/[slug]` ServicePage: Breadcrumb, H1, Kurztext, Box „Das Wichtigste“
  (Kosten, Dauer, online ja/nein, Unterlagen), Hauptaktion („Online beantragen“ oder „Termin vereinbaren“,
  im Dummy mit Hinweis ohne Funktion), Zuständigkeit **ohne Inhaltssperre**: Serviceportal zeigt die
  eigene Stelle voreingestellt, Landesportal zeigt „Ort wählen“ als optionales Select über den Inhalten.
  Abschnitte als `<details>`, nur befüllte. Kontaktbox.
- `/[tenant]/suche` SearchPage (in Suspense): Eingabe, Tabs „Informationen“ und „Leistungen“ mit Anzahl,
  Standard-Tab je Portaltyp (`?tab=leistungen` erlaubt), Treffer aus Seiten, News und Leistungen
  (Titel, Kurztext, Keywords).
- `/[tenant]/aktuelles` NewsPage: Filter Thema, Jahr, Freitext, Trefferzahl, Liste. Quelle (Ressort/Amt)
  in jedem Eintrag sichtbar.
- `/[tenant]/seite/[slug]` ContentPage: Breadcrumb, H1, Lead, „Auf dieser Seite“ mit Sprungmarken,
  Abschnitte mit `id`.
- `/` PlattformStart: H1 „Ein CMS, viele Portale“, kurzer Lead, zwei Vorschaukarten der Mandanten
  (Mini-Header und Mini-Hero aus Tokens, Link „Portal öffnen“), Aufruf „Neuen Mandanten anlegen“,
  Liste eigener Mandanten aus localStorage (mit „Entfernen“), zwei Spalten „Gleich für alle“ und
  „Stellt jeder Mandant ein“.
- `/neu` Onboarding-Assistent: vier Schritte (echte Reihenfolge, Nummern sinnvoll) mit Live-Vorschau
  rechts: 1 Steckbrief (Name, Art, Portaltyp, Tagline, Region), 2 Theme (Primärfarbe, Akzent, Fläche,
  Überschriftenschrift, Ecken; Kontrastprüfung Weiß auf Primär und Primär auf Weiß je mind. 4,5:1,
  „Weiter“ gesperrt mit klarer Erklärung), 3 Struktur (Menüpunkte aus `defaultNav`, Plätze DGS/LS/ES,
  Sprachen), 4 Prüfen und anlegen. Danach: „{Name} ist live. Angelegt in mm:ss, ohne Codeänderung.“
  und „Portal öffnen“. Mandant per `saveCustomTenant`, `createdInSeconds` setzen.

### CSS (`src/app/globals.css` ersetzen)
- Plattform-Klassen mit Präfix `pf-`, Mandanten-Klassen mit Präfix `t-`; flache Spezifität.
- Responsiv bis 360 px, sichtbarer Fokus (`:focus-visible`), `prefers-reduced-motion` beachten.
- `page.module.css` und Standardinhalte von create-next-app entfernen.

## Barrierefreiheit (Abnahme)

Genau eine H1 pro Seite, jede Landmark einmal, alle Bedienelemente mit Namen, deutsche Labels,
Kontraste AA, Skip-Link funktioniert, Tastaturbedienung für Menü, Tabs, Filter und Assistent.

## Prüfen

`npm run dev`, dann `/`, `/musterland`, `/beispielstadt`, eine Leistung, Suche, Aktuelles, Inhaltsseite
und den Assistenten durchklicken, auf Desktop und 390 px Breite. `npm run build` muss ohne Fehler laufen.

## Zentrale Suche (Nachtrag 19.10.2026)

Bürger kommen meist mit einem Anliegen auf das Portal. Deshalb ist auf beiden Startseiten eine zentrale Suche
das Hero-Element (`SmartSearch`, Combobox mit Vorschlagsliste):
- versteht Anliegen in eigenen Worten über `src/data/intents.ts` („Ich möchte eine Garage bauen“ → Baugenehmigung)
- korrigiert Tippfehler („Baugeminigung“ → „Meinten Sie: Baugenehmigung“) und ergänzt Wörter beim Tippen
- zeigt eine Kurzantwort „Das passt am besten“ mit Kosten, Dauer und Online-Hinweis sowie „Das brauchen Sie oft auch“
- Beispielanfragen als Buttons unter dem Feld, Enter führt zur Ergebnisseite mit derselben Logik
- Tastatur: Pfeiltasten, Enter, Escape; Anzahl der Vorschläge wird angesagt
- Im Klick-Dummy lokal simuliert (`src/lib/smart-search.ts`), der Hinweis unter dem Feld sagt das. Später ersetzbar
  durch eine echte KI-Suche im Backend.

## Mandanten bearbeiten (Nachtrag 19.10.2026)

Eigene Mandanten lassen sich nachträglich ändern: „Bearbeiten“ in der Liste auf `/` und „Diesen Mandanten
bearbeiten“ in der Demo-Leiste öffnen `/bearbeiten?mandant=<id>`. Der Assistent lädt die gespeicherten Werte,
alle Schritte sind direkt anwählbar, die Adresse bleibt gleich, die ursprüngliche Anlagezeit auch. Die Stoppuhr
misst nur die Änderung. Beispielmandanten bleiben Konfiguration in `src/data/tenants.ts`.

## Technische Hinweise

- Seitentitel setzen die Mandantenseiten im Browser (`useDocumentTitle`). `generateMetadata` mit `params`
  würde mit Partial Prefetching die App-Shell blockieren, und eigene Mandanten kennt der Server ohnehin nicht.
- `TenantShell` rendert das Seitensegment in jedem Zustand. `TenantGate` in den Routen hält es leer,
  solange ein Mandant aus dem `localStorage` noch nicht gelesen ist. So bleibt das Segment für Next.js gültig.
- Mit Cache Components bleiben besuchte Routen versteckt im DOM (Activity). Der Sprunglink fokussiert deshalb
  das `<main>` der eigenen Shell statt der ersten ID, Menüs schließen sich beim Verstecken.
- Die Kopfnavigation liest `useSearchParams` in einer eigenen Suspense-Grenze, damit der Rest statisch bleibt.

## Offen

- Backend (Payload) und echte Redaktionsabläufe
- Designbasis klären (KERN, Lizenzfrage)
- Echte Inhalte für Gebärdensprache, Leichte und Einfache Sprache sowie Fremdsprachen (jetzt Platzhalter)
