# Übergabe an die Entwicklung

Stand 23.10.2026. Dieses Repository ist ein **klickbarer Prototyp** für das Suchkonzept eines Verwaltungsportals
(„Verwaltungsportal Musterland“, fiktiv). Er zeigt Abläufe und Regeln, ist aber kein Produktivsystem: Es gibt kein
Backend, keine Datenbank und kein echtes Nutzerkonto. Alle Inhalte sind Beispieldaten.

Am schnellsten versteht man die Suche über die Seite `/so-entscheidet-die-suche` (Diagramme und Punkteregeln) und
den Vorführablauf `/testfall`.

## Technik

| Bereich | Eingesetzt |
|---|---|
| Framework | Next.js 16.4.2, App Router, `cacheComponents` und `partialPrefetching` an (`next.config.ts`) |
| UI | React 19.3, keine UI-Bibliothek, keine weiteren Laufzeit-Abhängigkeiten |
| Sprache | TypeScript 5, strikt; ESLint 9 mit `eslint-config-next` |
| Gestaltung | ein eigenes Stylesheet `src/app/globals.css`, Klassen mit Präfix `t-`, Farben und Abstände als CSS-Variablen |
| Schrift | Fira Sans und Fira Sans Condensed über `next/font/google` (wird beim Bauen eingebunden) |
| Daten | feste TypeScript-Dateien in `src/data/`, beim Bauen Teil der Seite |
| Zustand | `localStorage` und `sessionStorage` im Browser, gelesen mit `useSyncExternalStore` |
| Zugang | Passwort-Gate in `src/proxy.ts` (in Next.js 16 heißt die Middleware „Proxy“), Cookie `suchkonzept_zugang` |
| Betrieb | Node.js 22, Render-Blueprint `render.yaml`; Kopfzeile `X-Robots-Tag: noindex` auf allen Seiten |
| Tests | keine automatisierten Tests; geprüft durch Durchklicken auf Desktop und 390 px Breite |

Achtung, Next.js 16 weicht in einigen APIs von älteren Versionen ab. Die passende Dokumentation liegt nach
`npm install` unter `node_modules/next/dist/docs/`.

## Starten, bauen, ausliefern

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # prüft Typen, rendert alle Seiten vor
npm start        # gebaute Fassung
npm run lint
```

- `DEMO_PASSWORD` setzen, dann fragt jede Seite nach diesem Passwort. Lokal ohne Variable ist das Gate aus, in
  Produktion ohne Variable bleibt die Seite zu (`/zugang/fehlt`).
- Render: Blueprint `render.yaml` (Node 22, `npm ci && npm run build`, `npm start`). Das Passwort wird in Render als
  Umgebungsvariable gepflegt und vom Blueprint nicht überschrieben.

## Aufbau

```
src/
  app/(portal)/        Routen ohne Präfix: Start, suche, leistungen, antrag, konto, assistent, aktuelles,
                       organisation, projekte, seite, testfall, so-entscheidet-die-suche
  app/zugang/          Seiten des Passwort-Gates
  app/layout.tsx       Schriften, Rahmen; app/globals.css das einzige Stylesheet
  proxy.ts             Passwort-Gate
  components/          Kopf, Fuß, Suche (SmartSearch), Schritte vor der Suche (PotDialog),
                       Wohnort (HomePlace, LocateButton), Chat (AssistantChat, AssistantDock)
  components/pages/    eine Komponente je Seite
  data/                alle Inhalte und Regeln als Daten
  lib/                 Logik ohne Oberfläche
```

| Datei | Inhalt |
|---|---|
| `src/data/site.ts` | Name, Navigation, Fuß, Kontakt, Texte des Assistenten |
| `src/data/services.ts` | Leistungskatalog: Titel, Schlagwörter, Kurzbeschreibung, Zuständigkeit (`level`: Land oder Kommune), Kosten, Dauer, Unterlagen, Abschnitte |
| `src/data/intents.ts` | Anliegen in eigenen Worten („umgezogen“, „Gartenlaube“) und verwandte Leistungen |
| `src/data/search-terms.ts` | von der Redaktion fest zugeordnete Suchbegriffe |
| `src/data/situations.ts` | Lagen aus dem Alltag für Rückfragen im Chat („Mein Portemonnaie ist weg“) |
| `src/data/places.ts`, `organisation.ts` | Orte mit Postleitzahl-Bereichen, Ministerien und Ämter |
| `src/data/content.ts`, `projects.ts` | Meldungen, Inhaltsseiten, Projekte (Bereich „Informationen“) |
| `src/data/forms.ts` | Felder der Online-Anträge |
| `src/lib/smart-search.ts` | Suche im Katalog: Punkte, Tippfehler, Wortergänzung, Kurzantwort; Suche in Informationen |
| `src/lib/search-router.ts` | Suchweiche: Leistungen, Informationen oder Rückfrage |
| `src/lib/offices.ts` | zuständige Stelle je Leistung und Ort; `placeMatters` entscheidet, ob nach dem Wohnort gefragt wird |
| `src/lib/assistant.ts` | Chat als regelbasierter Dialog auf derselben Suche, ohne KI |
| `src/lib/validate.ts` | Prüfung der Antragsformulare (zum Beispiel IBAN-Prüfziffer) |
| `src/lib/*-store.ts` | Speicher im Browser: Wohnort, Demo-Konto mit Anträgen und Postfach, Chatverlauf |

Speicherschlüssel im Browser: `suchkonzept.ort.v1`, `suchkonzept.konto.v1`, `suchkonzept.chat.v1`.
„Demo zurücksetzen“ im Kopf löscht sie.

## Kernregeln der Suche

- **Suchweiche** (`search-router.ts`): Signalwörter geben Punkte für Leistungen (Handlung +3, Dokument +2,
  Katalogtreffer +2 oder +1, Anliegen +1) und Informationen (Art des Inhalts +4, Thema +2, Jahreszahl +1);
  fest zugeordnete Begriffe +10. Leistungen ab 3 Punkten mit 1 Punkt Vorsprung, Informationen ab 2 Punkten mit
  1 Punkt Vorsprung, sonst die Rückfrage „Was suchen Sie?“.
- **Kurzantwort** („Das passt am besten“): beste Leistung mit mindestens 5 Punkten und 3 Punkten Vorsprung.
- **Wohnort**: Vor der Suche und vor einem Vorschlag fragt das Portal nach Postleitzahl oder Ort, außer die Suche
  führt klar zu einer Leistung mit einer Stelle für alle (Leistung des Landes, etwa Kindergeld).
- **Chat**: dieselbe Weiche; bei mehreren passenden Leistungen oder einer Lage aus dem Alltag eine Rückfrage mit
  Antwortknöpfen; nach zwei Rückfragen ohne Leistung der Bürgerservice.

Beim Tippen entsteht keine Anfrage: Vorschläge und Weiche rechnen im Browser mit dem Leistungskatalog.

## Was nur simuliert ist

- **Backend**: Die Erklärseite zeigt „genau eine Anfrage an `/api/leistungen` oder `/api/informationen`“. Im
  Prototyp gibt es diese Endpunkte nicht, die Suche läuft vollständig im Browser.
- **Nutzerkonto, Anträge, Postfach**: Demo-Konto ohne Passwort, alles in `localStorage`.
- **Bewertung der Suche**: Später übernimmt eine KI, was heute die Punkteregeln entscheiden. Ihre Wartezeit von 1 bis 3
  Sekunden spielt `src/lib/search-latency.ts` nach.
- **Standort**: „Meinen Standort verwenden“ fragt den Browser nicht, sondern trägt nach kurzer Wartezeit immer
  20100 (Beispielstadt) ein.
- **Inhalte**: Leistungen, Stellen, Orte, Meldungen und Personen sind erfunden. Die Fotos sind KI-generiert
  (`docs/BILDER.md`).

## Für eine echte Umsetzung

- Leistungskatalog im CMS pflegen und bei jeder Veröffentlichung als statische Datei ausgeben (Vorschlag auf der
  Erklärseite, Abschnitt „Der Leistungskatalog“). Suchweiche und Vorschläge können dann unverändert im Browser
  laufen.
- Zwei Such-Endpunkte (Leistungen, Informationen) anstelle von `searchServices` und `searchInformation`.
- Postleitzahl zu Ort und Stelle über die echten Zuständigkeitsdaten; Standort über `navigator.geolocation` und
  einen Geodienst, gespeichert wird nur der Ort.
- Echtes Nutzerkonto und Postfach anstelle der Stores im Browser.
- Barrierefreiheit wurde beim Bauen beachtet (Tastaturbedienung der Vorschlagsliste, Ansagen über
  `aria-live`, native Dialoge, Fokus-Ringe, reduzierte Bewegung), aber nicht formal geprüft.

## Regeln für Inhalte und Gestaltung

- Gestaltung angelehnt an ein Bundesportal, aber ohne Hoheitszeichen, ohne echte Behördennamen oder -logos und
  ohne übernommene Texte. Eigene Wortmarke, „Beispieldaten“ im Fuß.
- UI-Texte auf Deutsch, Satzanfang groß, aktive Verben auf Buttons.
- `CLAUDE.md` und `AGENTS.md` enthalten dieselben Regeln für KI-Assistenten.

Weitere Unterlagen: Umbauplan und Änderungen in `docs/BAUPLAN-SUCHE.md`, Vorgeschichte als mandantenfähiger
Klick-Dummy in `docs/BAUPLAN.md`.
