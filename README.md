# Suchkonzept · Verwaltungsportal Musterland

Prototyp für das Suchkonzept eines einzelnen Verwaltungsportals, ohne Backend. Das fiktive
„Verwaltungsportal Musterland“ bündelt die Leistungen des Landes und seiner Gemeinden. Aufbau und Farben
orientieren sich an einem Bundesportal, ohne Hoheitszeichen und ohne übernommene Texte. Alle Inhalte sind
Beispieldaten, die Fotos sind KI-generiert.

Was der Prototyp zeigt:

- **Zentrale Suche** in eigenen Worten mit Vorschlägen, Tippfehlerkorrektur und Kurzantwort
- **Suchweiche** mit zwei Bereichen (Leistungen, Informationen) und Overlay „Was suchen Sie?“ bei unklaren Anfragen
- **Wohnort vor der Suche**: vor den Treffern oder der Leistungsseite Postleitzahl oder Ort, damit das Portal die
  zuständige Stelle nennt; bei unklarer Weiche zwei Schritte („Was suchen Sie?“, „Wo wohnen Sie?“). Entfällt bei
  Leistungen mit einer Stelle für alle, etwa Kindergeld. „Meinen Standort verwenden“ als Demo
- **Chat-Assistent** als Seite und als kleines Fenster, auf Basis derselben Suche
- **Online-Antrag** mit Formularprüfung und **Nutzerkonto mit Postfach** (Demo-Konto ohne Passwort)
- **Testfall Kindergeld** unter `/testfall` als Vorführablauf, mit „Demo zurücksetzen“
- **So entscheidet die Suche** unter `/so-entscheidet-die-suche`: Diagramme und Punkteregeln für Stakeholder

## Starten

```bash
npm install
npm run dev
```

Danach `http://localhost:3000` öffnen. `npm run build` prüft Typen und rendert alle Seiten vor.
Mit der Umgebungsvariable `DEMO_PASSWORD` schützt ein Passwort-Gate alle Seiten (siehe `src/proxy.ts`).

## Aufbau

- `src/data/` Portal (`site.ts`), Leistungskatalog, Meldungen und Seiten, Orte, Organisation, Projekte,
  Anliegen und gepflegte Suchbegriffe, Antragsformulare
- `src/lib/` Suche (`smart-search.ts`), Suchweiche (`search-router.ts`), Assistent, Zuständigkeit (`offices.ts`),
  Speicher im Browser für Wohnort, Konto und Chat
- `src/components/` Rahmen (Kopf, Fuß, Chatfenster), Suche, Overlay, Karten; `src/components/pages/` die Seiten
- `src/app/(portal)/` Routen ohne Präfix, `src/app/zugang/` Passwort-Gate
- `src/app/globals.css` ein Stylesheet, Klassen mit `t-`, Farben als CSS-Variablen

Umbauplan und Stand: [docs/BAUPLAN-SUCHE.md](docs/BAUPLAN-SUCHE.md). Vorgeschichte als mandantenfähiger Klick-Dummy:
[docs/BAUPLAN.md](docs/BAUPLAN.md). Fotos: [docs/BILDER.md](docs/BILDER.md).
