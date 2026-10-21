# Umbauplan: Suchkonzept als eigenes Portal

Stand 21.10.2026. Fork von `E:\Claude\mandanten-klickdummy` auf Stand `9932a2d`
(„Wohnort erst auf der Leistungsseite fragen“). Ziel: das gesamte Suchkonzept als Prototyp eines einzelnen
Verwaltungsportals, **ohne Mandantenfähigkeit**, gestalterisch **am Bundesportal orientiert**.

## Was übernommen wird

Alles, was zum Suchkonzept gehört, mit seinen Inhalten (Details in `docs/BAUPLAN.md`):

- **Zentrale Suche** (`SmartSearch`, `src/lib/smart-search.ts`, `src/data/intents.ts`): Anliegen in eigenen
  Worten, Tippfehlerkorrektur, Wortergänzung, Kurzantwort „Das passt am besten“ mit Kosten, Dauer und
  Online-Hinweis, „Das brauchen Sie oft auch“, Beispielanfragen, Tastaturbedienung mit Ansage.
- **Suchweiche** (`src/lib/search-router.ts`, `src/data/search-terms.ts`): zwei Töpfe (Leistungen,
  Informationen), Punkteregeln, gepflegte Suchbegriffe, Erklärung „So hat die Suche entschieden“ mit der einen
  Backend-Anfrage, Knopf „Stattdessen in … suchen“.
- **Overlay „Was suchen Sie?“** (`PotDialog`, `PotIcons`) bei unklaren Anfragen.
- **Wohnort erst, wenn er gebraucht wird** (`HomePlace`, `PlaceFinder`, `src/lib/place-store.ts`,
  `src/lib/offices.ts`): PLZ oder Ort, Auswahl bei mehreren Orten, zuständige Stelle.
- **Chat-Assistent** (`src/lib/assistant.ts`, `AssistantChat`, `AssistantDock`, `AssistantPage`,
  `src/lib/chat-store.ts`) auf Basis derselben Suche und Weiche.
- **Leistungsseiten, Online-Antrag, Konto mit Postfach** (`src/data/forms.ts`, `src/lib/validate.ts`,
  `src/lib/account-store.ts`).
- **Informationsinhalte für den Topf „Informationen“:** Meldungen, Inhaltsseiten, Organisation, Großprojekte,
  inklusive der KI-Beispielfotos (`public/images`, `docs/BILDER.md`).
- **Testfall Kindergeld** (`/testfall`) und „Demo zurücksetzen“.
- **Passwort-Gate** (`src/proxy.ts`, `AccessGate`, `/zugang`), `noindex`, `robots.txt`.

## Was entfällt

- Mandanten: Route `[tenant]`, `tenant-store` mit `themeStyle` und Tokens je Mandant, `TenantShell`,
  `TenantContext`, `TenantPreview`, `Emblem`, Demo-Leiste mit Mandanten-Umschalter und Token-Chips,
  Plattform-Startseite, Onboarding-Assistent (`/neu`, `/bearbeiten`, `Wizard`, `EditTenant`),
  „Herkunft anzeigen“ (`src/lib/origin.ts`).
- Übergaben zwischen Landes- und Stadtportal in Suche, Wohnort-Abfrage und Chat. Stattdessen nennt das Portal
  nach der Ortswahl direkt die zuständige Stelle (Beispielstadt und die anderen Orte bleiben als Orte erhalten).
- Von der Demo-Leiste bleibt höchstens ein schmaler Hinweis mit Links zu Testfall und „Demo zurücksetzen“.

## Ein Portal statt zwei

- Arbeitstitel: **„Verwaltungsportal Musterland“**, fiktiv. Leistungen von Land und Kommunen in Musterland.
- Inhalte von Musterland und Beispielstadt zu einem Portal zusammenführen: ein `src/data/site.ts`
  (Name, Navigation, Footer, Kontakt, Assistenten-Texte) ersetzt `src/data/tenants.ts`.
- Meldungen, Seiten, Organisation und Projekte beider bisherigen Mandanten bleiben als Inhalte, Dopplungen
  zusammenfassen. Stellen der Stadt erscheinen als kommunale Stellen von Beispielstadt.
- Routen ohne Präfix: `/`, `/suche`, `/leistungen/[slug]`, `/antrag/[slug]`, `/konto`, `/assistent`,
  `/aktuelles`, `/seite/[slug]`, `/organisation`, `/organisation/[id]`, `/projekte`, `/projekte/[id]`,
  `/testfall`. Alle internen Links und gespeicherten Pfade (Chat, Konto) anpassen.

## Gestaltung: am Bundesportal orientiert

Orientierung an Aufbau und Anmutung von verwaltung.bund.de. **Keine Hoheitszeichen und keine Kopie** (siehe
`CLAUDE.md`): kein Bundesadler, keine Flagge, kein Banner „Eine offizielle Website …“, keine Wortmarke
„Verwaltung digital“, keine echten Behördennamen oder -logos, keine Originaltexte. Eigene, neutrale Wortmarke
(z. B. Schriftzug „Verwaltungsportal“ mit „Musterland“ darunter und einem schlichten, eigenen Bildzeichen).

**Farben** (Richtwerte, als CSS-Variablen):
- Leitfarbe Blau `#356799`, Hover Dunkelblau `#20487A`, Fokus Navy `#15293D`
- Flächen Hellblau `#EBF0F5` und `#F1F4F8`, Linien `#A8B4BF`, gedämpfter Text `#5D6A79`, Text `#222222`
- Hauptaktion Rot `#BF1850` (Hover `#A70D34`), sparsam und nur für die eine Hauptaktion je Ansicht
- Kontraste: Weiß auf `#356799` 5,9:1, Weiß auf `#BF1850` 6,1:1, `#222222` auf `#EBF0F5` 13,9:1, alle AA

**Schrift:** Fira Sans (Google Fonts, offene Lizenz) für alles, optional Fira Sans Condensed für große
Überschriften. Radius 4 px.

**Muster:**
- Kopf: schmale Schnellzugriff-Leiste (Gebärdensprache, Leichte Sprache, Sprache), darunter Wortmarke links,
  rechts Suche, Konto, Menü. **Abweichung vom Vorbild:** Hauptnavigation auf dem Desktop sichtbar.
- Startseite: Bild-Stage (vorhandenes Foto, blau eingefärbt) mit Überschrift, der zentralen Suche und zwei
  Einstiegskarten „Für Privatpersonen“ und „Für Unternehmen“, darunter Kartenraster „Aktuelle Themen“ und
  Icon-Karten, Chat-Einstieg unter der Suche.
- Suchergebnisse: hellblaue Karten, Filter oben, Erklärung der Weiche aufklappbar.
- Leistungsseite: Kopf mit Titel und Teaser, Seitenbox rechts (Weitere Informationen, Kontakt), Abschnitte als
  Akkordeons, aber nur befüllte, „Das Wichtigste“ oben, Wohnort-Abfrage ohne Inhaltssperre.
- Fuß: dunkelblaue Leiste, Spalten Allgemein, Rechtliches, Kontakt und Hilfe, Hinweis „Beispieldaten“.

## Verbesserungen gegenüber dem Vorbild beibehalten

Ortswahl ohne Inhaltssperre, Top-Aufgaben im Ranking, genau eine H1 je Seite, jede Landmark einmal,
Sprunglinks mit gültigem Ziel, Breadcrumb mit vollem Pfad, alle Bedienelemente mit deutschen Namen,
Kontraste AA, Tastaturbedienung für Suche, Overlay, Akkordeons, Chat und Formular.

## Vorgehen

1. Mandantenlogik entfernen, `site.ts` anlegen, Daten zusammenführen.
2. Routen ohne `[tenant]` neu anlegen, Links und gespeicherte Pfade anpassen.
3. Suche, Weiche, Wohnort und Chat ohne Portalwechsel anpassen, Testfall aktualisieren.
4. Stylesheet auf die Bundesportal-Anmutung umstellen.
5. `npm run build`, alle Seiten auf Desktop und 390 px prüfen, mit Screenshots.
6. Kleine Commits auf `main`. Vor Push, GitHub-Repo oder Railway-Deploy fragen; für ein Deploy einen eigenen
   Railway-Dienst nutzen, nicht den des Klick-Dummys.
