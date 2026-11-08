# Suchkonzept · Verwaltungsportal Musterland

Prototyp für das Suchkonzept eines einzelnen Verwaltungsportals, ohne Backend. Das fiktive
„Verwaltungsportal Musterland“ bündelt die Leistungen des Landes und seiner Gemeinden. Aufbau und Farben
orientieren sich an einem Bundesportal, ohne Hoheitszeichen und ohne übernommene Texte. Alle Inhalte sind
Beispieldaten, die Fotos sind KI-generiert.

Was der Prototyp zeigt:

- **Zentrale Suche** in eigenen Worten mit Tippfehlerkorrektur und Kurzantwort. Die Vorschlagsliste ist vorerst aus
  (`SUGGESTIONS_IN_SEARCH` in `src/data/site.ts`) und kommt mit der KI-Suche
- **Suchweiche** mit zwei Bereichen (Leistungen, Informationen) und Overlay „Was suchen Sie?“ bei unklaren Anfragen
- **Wohnort vor der Suche**: vor den Treffern oder der Leistungsseite Postleitzahl oder Ort, damit das Portal die
  zuständige Stelle nennt; bei unklarer Weiche zwei Schritte („Was suchen Sie?“, „Wo wohnen Sie?“). Entfällt bei
  Leistungen mit einer Stelle für alle, etwa Kindergeld. „Meinen Standort verwenden“ als Demo
- **Chat-Assistent** (im Portal vorerst ausgeblendet, siehe `CHAT_IN_PORTAL` in `src/data/site.ts`; optional unter `/testfall/chat`) als Seite und als kleines Fenster, auf Basis derselben Suche; fragt bei unklaren Anliegen aus dem
  Alltag gezielt nach („Mein Portemonnaie ist weg“) und verweist nach zwei Rückfragen an den Bürgerservice
- **Online-Antrag** mit Formularprüfung und **Nutzerkonto mit Postfach** (Demo-Konto ohne Passwort)
- **Testszenarien** unter `/testszenarien`: Karten nach Fällen, je Szenario eine Detailseite mit Aufgabe, Klickpfaden und
  Start. Im Footer verlinkt, dort steht auch „Demo zurücksetzen“
- **Zwei Suchabläufe**: Variante 1 fragt vor den Treffern, Variante 2 ist die eine Ergebnisseite aus Annahme 1
  (`/ergebnisse`). Die Testfälle wählen die Variante. Beide spielen die spätere Wartezeit der KI mit einer Ladeanimation nach
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

Übergabe an die Entwicklung (Technik, Aufbau, was simuliert ist): [docs/UEBERGABE.md](docs/UEBERGABE.md).
Umbauplan und Stand: [docs/BAUPLAN-SUCHE.md](docs/BAUPLAN-SUCHE.md). Vorgeschichte als mandantenfähiger Klick-Dummy:
[docs/BAUPLAN.md](docs/BAUPLAN.md). Fotos: [docs/BILDER.md](docs/BILDER.md).
