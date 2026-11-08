import { CHAT_IN_PORTAL } from "@/data/site";
import type { ContentPage, NewsItem } from "@/lib/types";

// News of the Land and of Beispielstadt in one list. Every picture is an AI-generated sample photo.
export const NEWS: NewsItem[] = [
  { id: "m8", level: "land", title: "Kindergeld jetzt vollständig online beantragen", teaser: "Familien stellen den Antrag ab sofort digital, laden die Geburtsurkunde hoch und bekommen den Bescheid ins Postfach.", date: "2026-10-16", topic: "Familie", source: "Ministerium für Gesundheit und Familie", image: { src: "/images/news/m8-kindergeld-online.webp", alt: "Person am Küchentisch füllt am Laptop einen Online-Antrag aus, daneben eine Babyflasche und eine Mappe" } },
  { id: "b1", level: "kommune", title: "Bürgeramt Beispielstadt öffnet auch samstags", teaser: "Ab November öffnet das Bürgeramt jeden ersten Samstag im Monat von 9 bis 13 Uhr.", date: "2026-10-15", topic: "Verwaltung", source: "Bürgeramt Beispielstadt", image: { src: "/images/news/b1-rathaus.webp", alt: "Historisches Rathaus mit Uhrturm am Marktplatz im Morgenlicht" } },
  { id: "m1", level: "land", title: "Landesregierung beschließt Programm für Dorfläden", teaser: "Bis 2028 fließen Mittel in die Nahversorgung auf dem Land. Läden können die Förderung ab sofort online beantragen.", date: "2026-10-14", topic: "Wirtschaft", source: "Staatskanzlei", image: { src: "/images/news/m1-dorfladen.webp", alt: "Dorfladen mit gestreifter Markise, davor Kisten mit Obst, Gemüse und Kürbissen" } },
  { id: "b7", level: "kommune", title: "Familienbüro hilft beim Kindergeldantrag", teaser: "Im Familienbüro im Rathaus Beispielstadt gibt es dienstags Hilfe beim Ausfüllen des Online-Antrags.", date: "2026-10-13", topic: "Familie", source: "Jugendamt Beispielstadt", image: { src: "/images/news/b7-familienbuero.webp", alt: "Familienbüro mit Spielecke: Eine Mitarbeiterin hilft einer Mutter am Computer, im Hintergrund spielt ein Kind" } },
  { id: "m2", level: "land", title: "Neue Schulsozialarbeit an 40 Standorten", teaser: "Das Bildungsministerium stockt die Stellen auf. Schulen können sich bis Ende November melden.", date: "2026-10-09", topic: "Bildung", source: "Ministerium für Bildung", image: { src: "/images/news/m2-schule.webp", alt: "Eingang eines modernen Schulgebäudes mit Fahrradständern und Herbstbäumen" } },
  { id: "b2", level: "kommune", title: "Beispielstadt: Anmeldung für Kitaplätze 2027 startet", teaser: "Eltern in Beispielstadt können ab sofort ihre Wunsch-Kitas im Portal angeben.", date: "2026-10-06", topic: "Familie", source: "Jugendamt Beispielstadt", image: { src: "/images/news/b2-spielplatz.webp", alt: "Spielplatz einer Kita mit Rutsche, Schaukel und Sandkasten im Herbstlaub" } },
  { id: "m3", level: "land", title: "Hochwasserschutz an der Musterau fertig", teaser: "Der neue Deich schützt rund 3.000 Haushalte. Der Radweg auf der Deichkrone ist wieder offen.", date: "2026-10-02", topic: "Umwelt", source: "Ministerium für Umwelt", image: { src: "/images/news/m3-deich.webp", alt: "Luftbild eines grünen Deichs am Fluss mit Radweg auf der Krone, dahinter ein Dorf" } },
  { id: "m9", level: "land", title: "Mehr Beratung zum Kindergeld in allen Landkreisen", teaser: "Ab November bieten Beratungsstellen in allen fünf Landkreisen offene Sprechstunden zu Familienleistungen an.", date: "2026-10-01", topic: "Familie", source: "Ministerium für Gesundheit und Familie", image: { src: "/images/news/m9-beratung.webp", alt: "Beratungsgespräch: Eine Mutter mit Baby in der Trage sitzt einer Beraterin am Schreibtisch gegenüber" } },
  { id: "b3", level: "kommune", title: "Baustelle Marktplatz Beispielstadt: Umleitung für Busse", teaser: "Die Linien 2 und 5 fahren bis Dezember über die Hafenstraße.", date: "2026-09-29", topic: "Verkehr", source: "Tiefbauamt Beispielstadt", image: { src: "/images/news/b3-baustelle.webp", alt: "Linienbus fährt an einer Baustellenabsperrung mit Warnleuchten vorbei" } },
  { id: "m4", level: "land", title: "Vereinsförderung: zweiter Stichtag naht", teaser: "Vereine können Projekte für das kommende Jahr bis zum 30. September einreichen.", date: "2026-09-18", topic: "Ehrenamt", source: "Staatskanzlei", image: { src: "/images/news/m4-verein.webp", alt: "Ehrenamtliche stellen in einer hellen Halle Tische und Stühle auf" } },
  { id: "b4", level: "kommune", title: "Neue Hundewiese im Stadtpark Beispielstadt", teaser: "Die eingezäunte Fläche ist rund um die Uhr geöffnet.", date: "2026-09-12", topic: "Umwelt", source: "Grünflächenamt Beispielstadt", image: { src: "/images/news/b4-hundewiese.webp", alt: "Hund läuft auf einer eingezäunten Wiese im Stadtpark einem Ball hinterher" } },
  { id: "b5", level: "kommune", title: "Wohngeld: Beratung in den Stadtteilen von Beispielstadt", teaser: "Die Wohngeldstelle berät im Oktober in drei Stadtteilbüros ohne Termin.", date: "2026-08-30", topic: "Soziales", source: "Sozialamt Beispielstadt", image: { src: "/images/news/b5-wohnen.webp", alt: "Reihe bunter Wohnhäuser mit Vorgärten und Fahrrädern" } },
  { id: "m5", level: "land", title: "Landarztquote zeigt erste Wirkung", teaser: "Zwölf Ärztinnen und Ärzte haben sich in unterversorgten Regionen niedergelassen.", date: "2026-08-27", topic: "Gesundheit", source: "Ministerium für Gesundheit und Familie", image: { src: "/images/news/m5-praxis.webp", alt: "Eingang einer Arztpraxis in einem renovierten Dorfhaus mit Bank und Pflanzen" } },
  { id: "m6", level: "land", title: "Digitale Bauanträge in allen Landkreisen", teaser: "Ab sofort lassen sich Bauanträge im ganzen Land vollständig online stellen.", date: "2026-07-15", topic: "Digitales", source: "Ministerium für Digitales", image: { src: "/images/news/m6-digital.webp", alt: "Laptop mit einem Grundriss auf dem Bildschirm, daneben Kaffeetasse und Pflanze" } },
  { id: "b6", level: "kommune", title: "Stadtfest Beispielstadt: Straßensperrungen am Wochenende", teaser: "Die Altstadt ist von Freitag bis Sonntag für Autos gesperrt.", date: "2025-08-20", topic: "Verkehr", source: "Ordnungsamt Beispielstadt", image: { src: "/images/news/b6-stadtfest.webp", alt: "Altstadtgasse mit Wimpelketten und Marktständen beim Stadtfest" } },
  { id: "m7", level: "land", title: "Sommerferien: Badestellen mit bester Wasserqualität", teaser: "41 von 44 Badestellen erhalten die Bestnote. Die Karte zeigt alle Messwerte.", date: "2025-07-01", topic: "Umwelt", source: "Ministerium für Umwelt", image: { src: "/images/news/m7-see.webp", alt: "Holzsteg an einem klaren See mit Bojen, im Hintergrund Wald" } },
];

const PAGES: ContentPage[] = [
  {
    slug: "kindergeld",
    title: "Kindergeld: Das Wichtigste für Familien",
    lead: "Kindergeld unterstützt Familien jeden Monat. Hier lesen Sie, wer es bekommt, wie hoch es ist und wie der Antrag funktioniert.",
    sections: [
      { id: "wer", title: "Wer bekommt Kindergeld?", body: ["Eltern, Pflegeeltern oder Großeltern, bei denen das Kind lebt.", "Für jedes Kind bekommt nur eine Person Kindergeld."] },
      { id: "hoehe", title: "Wie hoch ist das Kindergeld?", body: ["Beispielwert im Prototyp: 250 Euro pro Kind und Monat.", "Der Betrag ist für alle Kinder gleich hoch."] },
      { id: "antrag", title: "So stellen Sie den Antrag", body: ["Den Antrag stellen Sie online über die Leistung „Kindergeld beantragen“.", "Sie brauchen die Geburtsurkunde, die Steuer-Identifikationsnummern und Ihre Bankverbindung."] },
      { id: "beratung", title: "Beratung", body: ["Das Ministerium für Gesundheit und Familie berät unter 0100 123 48 00, Montag bis Freitag von 8 bis 18 Uhr.", "In Beispielstadt hilft dienstags das Familienbüro im Rathaus beim Ausfüllen."] },
    ],
  },
  {
    slug: "land-und-leute",
    title: "Land und Leute",
    lead: "Musterland liegt zwischen Mittelgebirge und Seenplatte. Hier leben rund 1,9 Millionen Menschen in 214 Gemeinden.",
    sections: [
      { id: "geschichte", title: "Geschichte", body: ["Musterland entstand 1947 aus zwei Provinzen. Die Landesverfassung gilt seit 1992.", "Die Landeshauptstadt ist Musterstadt."] },
      { id: "regionen", title: "Regionen", body: ["Der Norden ist von Seen und Landwirtschaft geprägt, der Süden von Wald und Handwerk.", "Fünf Landkreise und zwei kreisfreie Städte gliedern das Land. Die größte Stadt nach der Landeshauptstadt ist Beispielstadt am Kanal."] },
      { id: "zahlen", title: "Zahlen und Fakten", body: ["Fläche: 18.400 Quadratkilometer.", "Größte Arbeitgeber: Gesundheitswesen, Handwerk, Logistik."] },
    ],
  },
  {
    slug: "lebenslagen",
    title: "Lebenslagen",
    lead: "Finden Sie Leistungen nach dem, was gerade in Ihrem Leben passiert.",
    sections: [
      { id: "umzug", title: "Umzug", body: ["Wohnsitz anmelden, Hund ummelden, Fahrzeug umschreiben."] },
      { id: "familie", title: "Familie und Kinder", body: ["Kindergeld beantragen, Kitaplatz beantragen, Wohngeld beantragen."] },
      { id: "bauen", title: "Bauen und Wohnen", body: ["Baugenehmigung beantragen, Wohngeld beantragen."] },
      { id: "freizeit", title: "Freizeit und Ehrenamt", body: ["Fischereischein beantragen, Führungszeugnis für das Ehrenamt, Förderung für Vereine."] },
      { id: "arbeit", title: "Arbeit und Unternehmen", body: ["Gewerbe anmelden, Förderung für Dorfläden beantragen."] },
    ],
  },
  {
    slug: "rathaus-beispielstadt",
    title: "Rathaus Beispielstadt",
    lead: "Das Bürgeramt am Marktplatz ist in Beispielstadt die erste Anlaufstelle für fast alle Anliegen.",
    sections: [
      { id: "oeffnungszeiten", title: "Öffnungszeiten", body: ["Montag, Dienstag, Donnerstag 8 bis 16 Uhr.", "Mittwoch 8 bis 18 Uhr, Freitag 8 bis 12 Uhr.", "Jeden ersten Samstag im Monat 9 bis 13 Uhr."] },
      { id: "kontakt", title: "Kontakt", body: ["Bürgeramt Beispielstadt, Marktplatz 1, 20000 Beispielstadt.", "Telefon 0200 98 76 54."] },
    ],
  },
  {
    slug: "ueber-das-portal",
    title: "Über dieses Portal",
    lead: "Das Verwaltungsportal Musterland bündelt die Leistungen des Landes und seiner Gemeinden. Sie suchen an einer Stelle, das Portal nennt die zuständige Stelle.",
    sections: [
      { id: "leistungen", title: "Land und Gemeinden an einem Ort", body: ["Manche Leistungen bietet das Land selbst an, zum Beispiel das Kindergeld. Für andere ist Ihre Gemeinde zuständig, zum Beispiel für den Personalausweis.", "Für Leistungen der Gemeinden fragt das Portal erst auf der Seite der Leistung nach Ihrem Wohnort. Alle Informationen zur Leistung sehen Sie auch ohne Angabe."] },
      { id: "suche", title: "Suche in eigenen Worten", body: ["Sie können Ihr Anliegen so beschreiben, wie Sie es sagen würden, zum Beispiel „Ich ziehe um“.", "Die Suche schaut immer in einem Bereich nach: bei den Leistungen oder bei den Informationen. Ist das unklar, fragt sie nach."] },
      { id: "prototyp", title: "Ein Prototyp mit Beispieldaten", body: ["Dieses Portal ist ein Prototyp. Musterland, Beispielstadt, alle Stellen, Personen, Beträge und Meldungen sind erfunden.", "Die Fotos sind KI-generierte Beispielbilder. Die Suche arbeitet mit festen Regeln im Browser."] },
    ],
  },
  {
    slug: "kontakt",
    title: "Kontakt",
    lead: "Fragen zu einer Leistung beantwortet die zuständige Stelle. Sie steht auf der Seite jeder Leistung. Bei allgemeinen Fragen hilft der Bürgerservice.",
    sections: [
      { id: "buergerservice", title: "Bürgerservice Musterland", body: ["Schlossplatz 1, 10000 Musterstadt.", "Telefon 0100 123 45 67, Montag bis Freitag 8 bis 18 Uhr.", "E-Mail buergerservice@musterland.example."] },
      { id: "beispielstadt", title: "Bürgeramt Beispielstadt", body: ["Marktplatz 1, 20000 Beispielstadt.", "Telefon 0200 98 76 54. Öffnungszeiten stehen auf der Seite Rathaus Beispielstadt."] },
      ...(CHAT_IN_PORTAL ? [{ id: "chat", title: "Chat-Assistent", body: ["Der Chat-Assistent hilft rund um die Uhr, die passende Leistung und die zuständige Stelle zu finden. Er ist eine automatische Hilfe, keine Person."] }] : []),
    ],
  },
  {
    slug: "hilfe",
    title: "Hilfe zum Portal",
    lead: "So finden Sie Leistungen, die zuständige Stelle und den Stand Ihrer Anträge.",
    sections: [
      { id: "suchen", title: "Suchen", body: ["Schreiben Sie in das Suchfeld, was Sie vorhaben. Beim Tippen schlägt das Portal passende Leistungen vor.", "Mit den Pfeiltasten wählen Sie einen Vorschlag, mit der Eingabetaste öffnen Sie ihn, mit Escape schließen Sie die Liste."] },
      { id: "wohnort", title: "Wohnort angeben", body: ["Für Leistungen der Gemeinden geben Sie auf der Seite der Leistung Ihre Postleitzahl oder Ihren Ort ein. Das Portal zeigt dann die zuständige Stelle.", "Ihr Wohnort bleibt nur in diesem Browser gespeichert."] },
      { id: "konto", title: "Nutzerkonto und Postfach", body: ["Mit dem Nutzerkonto sind Ihre Daten im Antrag schon eingetragen. Eingangsbestätigungen und Bescheide kommen ins Postfach.", "Im Prototyp gibt es ein Demo-Konto ohne Passwort."] },
    ],
  },
  {
    slug: "angeln",
    title: "Angeln und Angelschein in Musterland",
    lead: "Wo Sie in Musterland angeln dürfen und was Sie dafür brauchen.",
    sections: [
      { id: "gewaesser", title: "Gewässer", body: ["Angeln können Sie an den Seen und Flüssen in Seehausen, Neudorf und Beispielstadt. Waldheim hat keine eigenen Gewässer und stellt deshalb keinen Fischereischein aus.", "Der nächste See liegt von Waldheim aus in Seehausen."] },
      { id: "schein", title: "Fischereischein", body: ["Zum Angeln brauchen Sie die bestandene Fischerprüfung und einen Fischereischein. Ausgestellt wird er von Gemeinden mit eigenen Gewässern."] },
    ],
  },
  {
    slug: "heizung",
    title: "Neue Heizung: Zuschüsse in den Gemeinden",
    lead: "Einige Gemeinden in Musterland zahlen einen Zuschuss für neue Heizungen.",
    sections: [
      { id: "gemeinden", title: "Welche Gemeinden mitmachen", body: ["Die Gemeinden entscheiden selbst, ob sie einen Zuschuss zahlen. Ein eigenes Antragsverfahren gibt es im Portal noch nicht.", "Fragen Sie bei Ihrer Gemeinde nach, ob sie einen Zuschuss anbietet."] },
    ],
  },
  {
    slug: "impressum",
    title: "Impressum",
    lead: "Angaben zum Anbieter dieses Portals. Alle Angaben sind Beispieldaten.",
    sections: [
      { id: "anbieter", title: "Anbieter", body: ["Land Musterland, vertreten durch die Staatskanzlei, Schlossplatz 1, 10000 Musterstadt.", "E-Mail poststelle@stk.musterland.example."] },
      { id: "redaktion", title: "Redaktion", body: ["Redaktion Verwaltungsportal in der Staatskanzlei. Für die Inhalte der Gemeinden sind die Gemeinden verantwortlich."] },
      { id: "hinweis", title: "Hinweis", body: ["Dieses Portal ist ein Prototyp mit fiktiven Inhalten. Es gibt keinen echten Anbieter."] },
    ],
  },
  {
    slug: "datenschutz",
    title: "Datenschutz",
    lead: "Welche Daten dieser Prototyp verarbeitet. Kurz gesagt: Alles bleibt in Ihrem Browser.",
    sections: [
      { id: "browser", title: "Daten im Browser", body: ["Ihr Wohnort, das Demo-Konto mit Anträgen und Postfach sowie der Chatverlauf werden nur im Speicher Ihres Browsers abgelegt.", "Nichts davon wird an einen Server übertragen."] },
      { id: "loeschen", title: "Daten löschen", body: ["„Demo zurücksetzen“ im Hinweis oben auf jeder Seite löscht alle gespeicherten Angaben."] },
    ],
  },
  {
    slug: "barrierefreiheit",
    title: "Erklärung zur Barrierefreiheit",
    lead: "Das Portal soll für alle gut nutzbar sein. Hier steht, worauf wir achten und wie Sie uns Probleme melden.",
    sections: [
      { id: "stand", title: "Stand der Vereinbarkeit", body: ["Alle Bedienelemente lassen sich mit der Tastatur erreichen und haben deutsche Namen. Texte und Bedienelemente erreichen mindestens die Kontraststufe AA.", "Jede Seite hat genau eine Hauptüberschrift und einen Sprunglink zum Inhalt."] },
      { id: "melden", title: "Barrieren melden", body: ["Schreiben Sie an barrierefrei@musterland.example. Im Prototyp ist die Adresse ein Beispiel."] },
    ],
  },
];

// Languages offered besides German. Each gets a placeholder page.
export const LANGUAGES = [
  { name: "English", code: "en", title: "English", lead: "This page is a placeholder for the English version of the portal." },
];

export function languageSlug(name: string): string | undefined {
  const lang = LANGUAGES.find((l) => l.name === name);
  return lang ? `sprache-${lang.code}` : undefined;
}

// Placeholder pages behind the quick links for sign language and easy language.
const META_PAGES: { slug: string; title: string; lead: string; body: string }[] = [
  { slug: "gebaerdensprache", title: "Gebärdensprache", lead: "Hier stehen später Videos in Deutscher Gebärdensprache.", body: "Platzhalter: Die Redaktion stellt hier Videos mit Untertiteln ein." },
  { slug: "leichte-sprache", title: "Leichte Sprache", lead: "Hier gibt es bald Texte in Leichter Sprache.", body: "Platzhalter: Die Redaktion stellt hier geprüfte Texte in Leichter Sprache ein." },
];

function placeholderPage(slug: string): ContentPage | undefined {
  const meta = META_PAGES.find((p) => p.slug === slug);
  if (meta) {
    return { slug, title: meta.title, lead: meta.lead, sections: [{ id: "inhalt-folgt", title: "Inhalt folgt", body: [meta.body] }] };
  }
  const lang = LANGUAGES.find((l) => `sprache-${l.code}` === slug);
  return lang ? { slug, title: lang.title, lead: lang.lead, lang: lang.code, sections: [] } : undefined;
}

export const PAGE_SLUGS = [...PAGES.map((p) => p.slug), ...META_PAGES.map((p) => p.slug), ...LANGUAGES.map((l) => `sprache-${l.code}`)];

export function findPage(slug: string): ContentPage | undefined {
  return PAGES.find((p) => p.slug === slug) ?? placeholderPage(slug);
}

// Editorial pages for the information search. Legal and placeholder pages stay out.
export const SEARCHABLE_PAGES = PAGES.filter((p) => !["impressum", "datenschutz"].includes(p.slug));

// Top tasks: shown first while the search field is empty and preferred when scores are equal.
export const TOP_TASKS = [
  "personalausweis-beantragen",
  "wohnsitz-anmelden",
  "kindergeld-beantragen",
  "fahrzeug-zulassen",
  "kitaplatz-beantragen",
  "baugenehmigung-beantragen",
];

// Life situations on the start page, each with a pictogram (see TopicIcon).
export const LIFE_SITUATIONS: { title: string; icon: string; services: string[] }[] = [
  { title: "Familie und Kinder", icon: "familie", services: ["kindergeld-beantragen", "kitaplatz-beantragen", "wohngeld-beantragen"] },
  { title: "Umzug", icon: "umzug", services: ["wohnsitz-anmelden", "hund-anmelden", "fahrzeug-zulassen"] },
  { title: "Bauen und Wohnen", icon: "bauen", services: ["baugenehmigung-beantragen", "wohngeld-beantragen"] },
  { title: "Ausweise und Dokumente", icon: "ausweis", services: ["personalausweis-beantragen", "fuehrungszeugnis-beantragen"] },
  { title: "Freizeit und Ehrenamt", icon: "freizeit", services: ["vereinsfoerderung-beantragen", "fischereischein-beantragen"] },
  { title: "Arbeit und Unternehmen", icon: "arbeit", services: ["gewerbe-anmelden", "dorfladen-foerderung-beantragen"] },
];
