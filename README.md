# Portalbaukasten · Klick-Dummy

Klick-Dummy für eine mandantenfähige Portalplattform ohne Backend. Zwei fiktive Mandanten zeigen,
wie verschieden Portale aus demselben System aussehen können:

- **Musterland** (`/musterland`): Land, Informationsportal
- **Beispielstadt** (`/beispielstadt`): Stadt, Serviceportal

Beide Startseiten haben eine zentrale Suche, die Anliegen in eigenen Worten versteht und beim Tippen
Leistungen vorschlägt (im Klick-Dummy lokal simuliert, ohne echte KI).

Unter `/neu` legt ein Assistent in vier Schritten einen dritten Mandanten an und misst die Zeit.
Neue Mandanten liegen nur im `localStorage` des Browsers. Alle Inhalte sind Beispieldaten.

## Starten

```bash
npm install
npm run dev
```

Danach `http://localhost:3000` öffnen. `npm run build` prüft Typen und rendert die Beispielmandanten vor.

## Aufbau

- `src/data/` Mandanten, Leistungskatalog, Meldungen und Inhaltsseiten (Konfiguration, kein Code pro Mandant)
- `src/lib/` Typen, Kontrastberechnung, localStorage-Store mit `themeStyle()`, Suche
- `src/components/` Shell, Demo-Leiste, Kopf, Fuß, Brotkrumen, Illustrationen
- `src/components/pages/` Seiten als Client-Komponenten, `src/app/` nur dünne Routen
- `src/app/globals.css` Plattform-Klassen mit `pf-`, Mandanten-Klassen mit `t-`

Gestaltung, Theme-Mechanik und Abnahmekriterien stehen in [docs/BAUPLAN.md](docs/BAUPLAN.md).
