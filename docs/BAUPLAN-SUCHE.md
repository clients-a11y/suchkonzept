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
- **Wohnort** (`HomePlace`, `PlaceFinder`, `src/lib/place-store.ts`, `src/lib/offices.ts`): PLZ oder Ort,
  Auswahl bei mehreren Orten, zuständige Stelle. Seit 22.10.2026 bei jeder Suche, siehe unten.
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

## Stand 21.10.2026: umgesetzt

Alle Schritte oben sind umgesetzt, gebaut und auf Desktop (1024 px) und 390 px durchgeklickt.

**Ein Portal**
- `src/data/site.ts` (Name, Navigation, Fuß, Schnellzugriff, Kontakt, Assistent) ersetzt `tenants.ts`.
  `NEWS`, Seiten, `ORG_GROUPS` (Landesregierung und Stadt Beispielstadt), `PROJECTS` und `PLACES` sind je eine Liste.
  Ämter der Stadt heißen jetzt „… Beispielstadt“, ihre Meldungen auch.
- Zuständigkeit (`src/lib/offices.ts`): Landesleistungen nennen das Ministerium. Gemeindeleistungen brauchen den
  Ort; Beispielstadt hat eigene Ämter je Leistung (`localUnitFor`), die anderen Orte ihre allgemeine Stelle. Keine
  Übergabe mehr an andere Portale, weder auf der Leistungsseite noch in Suche oder Chat.
- Der Online-Antrag nimmt den gemerkten Ort oder die Postleitzahl aus der Anschrift, um die Stelle zu nennen.
- Speicherschlüssel beginnen mit `suchkonzept.`, das Cookie des Gates heißt `suchkonzept_zugang`.

**Ergänzt**
- `/leistungen`: Leistungen A bis Z mit Filter „Für Privatpersonen“ und „Für Unternehmen“ (`audience` je Leistung),
  Ziel der Brotkrumen auf Leistungsseiten.
- Zwei Leistungen für Unternehmen: „Gewerbe anmelden“ (Gemeinde) und „Förderung für Dorfläden beantragen“ (Land),
  mit Formular und Anliegen in `intents.ts`. „förderung“ allein zeigt nicht mehr auf die Vereinsförderung.
- Seiten für den Fuß: Über dieses Portal, Kontakt, Hilfe, Impressum, Datenschutz, Barrierefreiheit (Beispieltexte).
- Gleiche Punktzahl in der Suche: Top-Aufgaben (`TOP_TASKS`) zuerst.
- Die Weiche rechnet schon beim Tippen mit (lokal, ohne Anfrage). Zeigt sie klar auf Informationen
  („Neuigkeiten Kindergeld“), steht „Informationen zu …“ als beste Wahl oben in der Vorschlagsliste und keine Leistung
  heißt „Das passt am besten“. So widersprechen sich Liste und Enter nicht mehr.
- `/so-entscheidet-die-suche`: Erklärseite für Stakeholder mit Diagrammen zu Ablauf, Leistungskatalog (heute im
  Prototyp und Vorschlag für den Betrieb), Punkteregeln, Beispielen aus dem Testfall, Wohnort und Sortierung.
  Dezent verlinkt in „So hat die Suche entschieden“, auf der Testfall-Seite und im Fuß unter „Allgemein“.
- Overlay „Was suchen Sie?“ nur noch bei der Suche auf der Startseite. Auf der Suchseite öffnet sich kein Overlay:
  Ein unklarer Begriff zeigt die Wahl im Inhalt unter den Reitern. Die Texte sprechen Bürgerinnen und Bürger an
  („Etwas beantragen“, „Sich informieren“), der technische Hinweis zur Backend-Anfrage steht nur noch in
  „So hat die Suche entschieden“ auf der Ergebnisseite.
- Wohnort bei jeder Suche (auf Wunsch, 22.10.2026, ersetzt „Wohnort erst bei Bedarf“): Wer auf der Startseite
  auf „Suchen“ klickt oder einen Vorschlag wählt, gibt vorher Postleitzahl oder Ort an, damit jedes Ergebnis die
  zuständige Stelle nennt. Ist die Weiche unsicher, führen zwei Schritte durch das Overlay (`SearchSteps` in
  `PotDialog.tsx`): „Was suchen Sie?“, dann „Wo wohnen Sie?“. Ein gemerkter Ort braucht nur „Weiter mit …“, bei
  mehreren Orten zu einer Postleitzahl schließt der Klick auf den Ort den Schritt ab. Auf der Suchseite steht der
  Wohnort über den Treffern, ohne Overlay. Wer eine Leistungsseite direkt öffnet, gibt den Ort weiterhin dort an.
- Ausnahme Leistungen mit einer Stelle für alle (auf Wunsch, 22.10.2026): Führt die Suche klar zu einer Leistung des
  Landes (`placeMatters` in `src/lib/offices.ts`), entfällt die Frage nach dem Wohnort, ebenso bei einem solchen
  Vorschlag. Vergleich im Testfall: Kindergeld ohne Postleitzahl, „Gartenlaube“ (neue Redewendung für die
  Baugenehmigung) mit Postleitzahl und Bauordnungsamt.
- „Meinen Standort verwenden“ (`LocateButton`) bei jeder Ortseingabe, als Demo: Nach kurzer Wartezeit steht immer
  20100 (Beispielstadt) im Feld, ein echter Standort wird nicht abgefragt. Im Betrieb: `navigator.geolocation` nach
  Erlaubnis, Postleitzahl über einen Geodienst, gemerkt wird nur der Ort.
- Chat: unklare Anliegen aus dem Alltag (auf Wunsch, 22.10.2026). Vorher zeigte „Ich komme mit dem Geld nicht mehr aus“
  zufällige Treffer. Jetzt erkennt der Assistent Lagen ohne Leistung (`src/data/situations.ts`: Zuwachs, Portemonnaie
  weg, Geld reicht nicht, Brief vom Amt) und fragt einmal gezielt nach, mit Antwortknöpfen oder freier Antwort. Nach
  zwei Rückfragen ohne Leistung nennt er den Bürgerservice. Eigener Teil im Testfall.
- Vorbereitung der Nutzertests (auf Wunsch, 08.11.2026): `/testszenarien` liegt als eigene Seite vor dem Portal und
  beschreibt Aufgaben, Beobachtungen und Erfolgskriterien zu Annahme 1 des Product Owners (Leistung und Informationen
  auf einer Ergebnisseite). Die Ergebnisseite aus Annahme 1 ist noch nicht gebaut. Der Chat ist im Portal ausgeblendet
  (`CHAT_IN_PORTAL`), seine Seite bleibt erreichbar, der optionale Testfall liegt unter `/testfall/chat`.
- Variante 2 (auf Wunsch, 08.11.2026): `/ergebnisse` ist die eine Ergebnisseite aus Annahme 1, gesteuert über
  `src/lib/result-area.ts`. `src/lib/variant-store.ts` merkt die Variante, die Testfälle setzen sie. Später bewertet eine
  KI die Suche und braucht 1 bis 3 Sekunden. Der Prototyp entscheidet weiter mit festen Regeln und spielt die Zeit mit
  `SearchPending` und `src/lib/search-latency.ts` nach. Beispieldaten: Waldheim hat keine Gewässer und bietet keinen
  Fischereischein an (`notOfferedIn`), Hund, Fischereischein und Baugenehmigung gibt es nur mit Ort (`regional`).
  Die Übersicht `/testszenarien` zeigt Kurzbeschreibung und Prozessflows, `/testszenarien/testfaelle` die Moderation.
  Alle Tests enden vor dem Antrag. Links zu Testfall und Testszenarien sind aus dem Portal entfernt.
- Die aufklappbare Erklärung „So hat die Suche entschieden“ ist von der Suchseite entfernt (auf Wunsch, 08.11.2026).
  Die Punkteregeln stehen weiter auf `/so-entscheidet-die-suche`.
- Die Vorschlagsliste unter dem Suchfeld ist in beiden Varianten aus (auf Wunsch, 08.11.2026), weil die KI-Suche erst
  später kommt. Schalter: `SUGGESTIONS_IN_SEARCH` in `src/data/site.ts`.
- Die Leiste über dem Kopf ist entfernt (auf Wunsch, 08.11.2026), mit ihr Gebärdensprache, Leichte Sprache und der
  Sprachwechsel. Im Footer steht jetzt eine Spalte „Prototyp“ mit Übersicht Testszenarien, Testfällen und „Demo zurücksetzen“.
- Testszenarien neu gegliedert (auf Wunsch, 08.11.2026): `/testszenarien` zeigt Karten nach Fällen, `/testszenarien/[id]`
  je Szenario Ausgangslage, Klickpfade, Prüfpunkte und den Start. Die Seite `/testszenarien/testfaelle` entfällt.
- Startseite: „Häufig gesucht“ ist entfernt (auf Wunsch, 08.11.2026), „Aktuelle Themen“ stehen an dessen Stelle direkt unter der Suche.

**Gestaltung** (`src/app/globals.css`, neu geschrieben)
- Farben als Variablen `--c-*`, Fira Sans und Fira Sans Condensed (Überschriften), Radius 4 px.
- Fokus: doppelter Ring (dunkel außen, weiß innen), auf dunklem Grund umgekehrt.
- Kopf: schmale Leiste mit Hinweis „Prototyp“, Testfall und „Demo zurücksetzen“ links, Gebärdensprache, Leichte
  Sprache und Sprache rechts; darunter Wortmarke (eigenes Bildzeichen: Bogen als offene Tür), Suche, Konto, Menü.
  Die Hauptnavigation liegt wie beim Vorbild auf allen Breiten hinter „Menü“ (auf Wunsch geändert, statt sichtbarer
  Navigation auf dem Desktop). Sie öffnet als Panel über der Seite; Escape, ein Klick daneben oder ein Seitenwechsel
  schließen es. Unter 30rem nur Symbole mit verstecktem Namen.
- Startseite: Rathaus-Foto graustufig, blau überlagert, darauf H1, Suche direkt auf dem Blau (weißes Eingabefeld,
  weiße Schrift, Chat-Knopf als Umriss, kurzer Hinweis „In eigenen Worten …“), ohne Beispielanfragen und ohne
  Hinweis „KI-Vorschläge“, weil die Suche mit Regeln arbeitet; danach
  Häufig gesucht, Lebenslagen mit Piktogrammen, Aktuelle Themen, Großprojekte, Hilfe-Band. Die zwei Einstiegskarten
  „Für Privatpersonen“ und „Für Unternehmen“ aus dem Plan sind auf Wunsch wieder entfernt (21.10.2026); die Suche
  steht in der Stage allein.
- Rot nur für die Hauptaktion (Suchen, Online beantragen, Weiter, Absenden). Im Chat sind Senden und Links blau.
- Unterseiten mit hellblauem Seitenkopf (Brotkrumen, H1, Einleitung), Leistungsseite mit Seitenbox rechts und
  Akkordeons, Suchergebnisse als hellblaue Karten unter den Reitern Leistungen und Informationen.

**Bewegung**
- „Suchen“ zeigt beim Absenden „Suche läuft …“ mit Kreisel. Die Suchseite zeigt danach gut eine halbe Sekunde einen
  Ladebalken und drei Platzhalter („Suche läuft in Leistungen …“), dann steigen Erklärung, beste Antwort und Treffer
  nacheinander ein. Bei einer Rückfrage gibt es keinen Ladezustand, weil noch keine Anfrage läuft.
- Vorschlagsliste, Overlay und Hintergrund blenden kurz ein. Bei „weniger Bewegung“ im System ist alles aus.
- Chat: Die eigene Nachricht gleitet von rechts ein, der Assistent „schreibt“ 0,7 Sekunden (drei Punkte), dann steigt
  die Antwort ein und die Antwortknöpfe folgen nacheinander. Gespeicherte Verläufe erscheinen ohne Animation. Das
  Chatfenster öffnet mit einer kurzen Bewegung von rechts unten.

**Technik**
- Dynamische Routen lesen `params` in einer Suspense-Grenze (sonst meldet Next 16 „URL data outside of Suspense“),
  Titel kommen aus `generateMetadata`. Unbekannte Adressen zeigen die 404-Seite im Portalrahmen.

## Offen

- Echte Inhalte für Gebärdensprache, Leichte Sprache und Englisch (Platzhalter)
- Meldungen haben keine eigenen Seiten, die Links springen in die Liste
- Unbekannte Leistung unter einer gültigen Route liefert die 404-Seite mit Status 200 (Streaming)
