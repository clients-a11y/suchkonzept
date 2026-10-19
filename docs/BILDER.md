# Bilder: KI-generierte Beispielfotos

Die Beispielmandanten Musterland und Beispielstadt zeigen KI-generierte Fotos (erzeugt mit Higgsfield).
Jedes Bild ist im Portal als „Beispielbild, KI-generiert“ gekennzeichnet. Alle abgebildeten Personen sind
fiktiv. Mandanten aus dem Assistenten haben keine Fotos und zeigen die Token-Illustrationen (`NewsArt`, `Portrait`).

Stand 19.10.2026: alle 31 Bilder erzeugt mit Higgsfield, Modell GPT Image 2.5 (Variante „flare“), Qualität
„medium“, Auflösung 1k, 0,5 Credits je Bild. Meldungen im Format 3:2 (1024 × 688), Porträts 4:5, auf
800 × 1000 verkleinert. Umgewandelt in WebP (Qualität 80), zusammen etwa 2,3 MB. Jedes Bild wurde vor dem
Einbau auf Schrift, Logos und Wappen geprüft. Die Beschreibungen unten sind die Grundlage, die tatsächlich
verwendeten Prompts sind leicht ausführlicher (zusätzlich „not a real or famous person“ bei Porträts).

Regeln für alle Bilder:
- keine lesbare Schrift, keine Logos, keine Wappen, keine Hoheitszeichen, keine realen Orte oder Gebäude
- keine bekannten oder realen Personen, Gesichter frei erfunden
- dokumentarischer, ruhiger Stil wie ein Pressefoto, natürliches Licht
- Meldungen quer 16:10 (`public/images/news/<id>-<motiv>.webp`), Porträts hoch 4:5
  (`public/images/portraits/<mandant>-<stelle>.webp`)

Gemeinsamer Zusatz für jede Beschreibung:
„photorealistic documentary press photo, natural light, no readable text, no logos, no signs with letters“

## Meldungen

| Datei | Beschreibung (englisch, für die Erzeugung) |
| --- | --- |
| `m1-dorfladen` | small village grocery shop in a rural village, striped awning, wooden crates with apples and vegetables in front, autumn morning, no people |
| `m2-schule` | entrance of a modern school building with schoolyard and bicycle racks, autumn trees, no people |
| `m3-deich` | aerial drone photo of a newly built grass flood dike along a calm river, cycle path on the crest, small houses behind |
| `m4-verein` | volunteers of a local sports club setting up tables in a community hall, seen from mid distance, friendly atmosphere |
| `m5-praxis` | small doctor's practice in a village house, bench and plants at the entrance, sunny day, no people |
| `m6-digital` | laptop on a wooden desk showing an architectural floor plan, coffee mug and plant, shallow depth of field |
| `m7-see` | wooden bathing jetty on a clear lake in summer, buoys in the water, forest on the far shore, no people |
| `b1-rathaus` | historic town hall with clock tower on a market square, early morning, a few pedestrians in the distance |
| `b2-spielplatz` | colourful playground at a daycare centre with slide and swing, autumn leaves, no children |
| `b3-baustelle` | city bus driving past road construction barriers with warning lights on a detour |
| `b4-hundewiese` | fenced dog meadow in a city park with trees, a dog running after a ball |
| `b5-wohnen` | row of colourful apartment houses in a quiet residential street |
| `b6-stadtfest` | old town lane decorated with bunting for a town festival, market stalls, people in the distance |

## Porträts

Gemeinsamer Zusatz: „professional official head-and-shoulders portrait of a fictional person, neutral grey
studio background, soft light, business attire, friendly neutral expression“

| Datei | Person (fiktiv) | Beschreibung |
| --- | --- | --- |
| `musterland-staatskanzlei` | Dr. Erika Mustermann, Ministerpräsidentin | woman in her late fifties, short grey hair, glasses, dark blazer |
| `musterland-bildung` | Sabine Beispiel, Ministerin für Bildung | woman in her mid forties, shoulder-length brown hair, blue blazer |
| `musterland-umwelt` | Jonas Vorlage, Minister für Umwelt | man around forty, short beard, green-grey jacket, open collar |
| `musterland-gesundheit` | Dr. Leyla Platzhalter, Ministerin für Gesundheit | woman in her early forties, dark hair tied back, light grey blazer |
| `musterland-wirtschaft` | Tobias Entwurf, Minister für Wirtschaft | man around fifty, short dark blond hair, navy suit, tie |
| `musterland-digitales` | Mia Prototyp, Ministerin für Digitales | woman in her mid thirties, short curly hair, black blazer |
| `musterland-inneres` | Paul Probe, Minister für Inneres | man around sixty, grey hair, glasses, dark suit, tie |
| `musterland-finanzen` | Clara Muster, Ministerin für Finanzen | woman around fifty, blonde bob, burgundy blazer |
| `beispielstadt-oberbuergermeisterin` | Lena Beispiel, Oberbürgermeisterin | woman in her mid forties, long dark hair, teal blazer |
| `beispielstadt-buergeramt` | Ali Mustermann, Leitung Bürgeramt | man around forty, short black hair, light blue shirt, dark jacket |
| `beispielstadt-jugendamt` | Nora Vorlage, Leitung Jugendamt | woman in her late thirties, red hair, cardigan |
| `beispielstadt-sozialamt` | Tom Platzhalter, Leitung Sozialamt | man in his mid fifties, grey beard, sweater over shirt |
| `beispielstadt-bauordnungsamt` | Jana Entwurf, Leitung Bauordnungsamt | woman in her late forties, short brown hair, grey blazer |
| `beispielstadt-tiefbauamt` | Ben Skizze, Leitung Tiefbauamt | man in his early thirties, short hair, navy jacket |
| `beispielstadt-steueramt` | Paula Probe, Leitung Steueramt | woman around sixty, white hair, glasses, dark green blazer |
| `beispielstadt-ordnungsamt` | Eva Muster, Leitung Ordnungsamt | woman in her early fifties, chin-length dark hair, black blazer |
| `beispielstadt-gruenflaechenamt` | Ida Konzept, Leitung Grünflächenamt | woman in her late twenties, braided hair, olive jacket |
| `beispielstadt-strassenverkehrsamt` | Kai Testfall, Leitung Straßenverkehrsamt | man in his mid forties, glasses, grey suit, no tie |

## Großprojekte (nachträglich, gleiche Einstellungen)

| Datei | Beschreibung |
| --- | --- |
| `projects/glasfaser` | fibre optic broadband trench along a country road, orange cable ducts, small excavator |
| `projects/klinikum` | large hospital construction site with two tower cranes and concrete shell building |
| `projects/radweg` | wide new cycle highway through open countryside, cyclists in the distance |
| `projects/energiepark` | solar panels in the foreground, wind turbines on the horizon, small substation |
| `projects/marktplatz` | market square under construction, new paving, young trees, construction fences |
| `projects/kita` | new daycare centre in timber construction with garden, harbour cranes far behind |
| `projects/hallenbad` | 1970s indoor pool during renovation, empty pool, scaffolding |

Hochwasserschutz und Stadtpark verwenden die vorhandenen Meldungsbilder `m3-deich` und `b4-hundewiese`.
