import type { Check } from "@/lib/validate";

// Fields of the online application per service. Configuration like the service catalogue:
// a later backend would deliver it from the form management.

export type FormField = {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "textarea";
  required?: boolean;
  hint?: string;
  options?: string[];
  // Format check with an explanation, see src/lib/validate.ts.
  check?: Check;
};

export const SERVICE_FORMS: Record<string, FormField[]> = {
  "wohnsitz-anmelden": [
    { id: "einzug", label: "Einzugsdatum", type: "date", required: true },
    { id: "anschrift", label: "Neue Anschrift", type: "text", required: true, hint: "Straße, Hausnummer, Postleitzahl und Ort" },
    { id: "personen", label: "Weitere Personen, die mit einziehen", type: "number", hint: "0, wenn Sie allein einziehen" },
  ],
  "kitaplatz-beantragen": [
    { id: "kind", label: "Vorname des Kindes", type: "text", required: true },
    { id: "geburt", label: "Geburtsdatum des Kindes", type: "date", required: true },
    { id: "beginn", label: "Gewünschter Betreuungsbeginn", type: "date", required: true },
    { id: "umfang", label: "Betreuungsumfang", type: "select", required: true, options: ["25 Stunden pro Woche", "35 Stunden pro Woche", "45 Stunden pro Woche"] },
  ],
  "hund-anmelden": [
    { id: "name", label: "Name des Hundes", type: "text", required: true },
    { id: "rasse", label: "Rasse", type: "text" },
    { id: "seit", label: "Hund gehalten seit", type: "date", required: true },
  ],
  "baugenehmigung-beantragen": [
    { id: "vorhaben", label: "Bauvorhaben", type: "select", required: true, options: ["Neubau", "Anbau", "Umbau", "Nutzungsänderung", "Garage oder Carport"] },
    { id: "grundstueck", label: "Anschrift des Grundstücks", type: "text", required: true },
    { id: "beschreibung", label: "Kurze Beschreibung", type: "textarea" },
  ],
  "fuehrungszeugnis-beantragen": [
    { id: "art", label: "Art des Führungszeugnisses", type: "select", required: true, options: ["Für private Zwecke", "Für eine Behörde", "Erweitert, zum Beispiel für Ehrenamt mit Kindern"] },
    { id: "zweck", label: "Verwendungszweck", type: "text" },
  ],
  "wohngeld-beantragen": [
    { id: "personen", label: "Personen im Haushalt", type: "number", required: true },
    { id: "miete", label: "Monatliche Kaltmiete in Euro", type: "number", required: true },
    { id: "einkommen", label: "Monatliches Nettoeinkommen des Haushalts in Euro", type: "number", required: true },
  ],
  "fahrzeug-zulassen": [
    { id: "art", label: "Art der Zulassung", type: "select", required: true, options: ["Neufahrzeug", "Gebrauchtfahrzeug", "Umschreibung"] },
    { id: "evb", label: "eVB-Nummer der Versicherung", type: "text", required: true, hint: "Sieben Zeichen, zum Beispiel A1B2C3D" },
    { id: "kennzeichen", label: "Wunschkennzeichen", type: "text", hint: "Optional" },
  ],
  "kindergeld-beantragen": [
    { id: "kind", label: "Vor- und Nachname des Kindes", type: "text", required: true },
    { id: "geburt", label: "Geburtsdatum des Kindes", type: "date", required: true },
    { id: "verhaeltnis", label: "Sie sind", type: "select", required: true, options: ["Mutter", "Vater", "Pflegeelternteil", "Großelternteil"] },
    { id: "steuerid", label: "Steuer-Identifikationsnummer des Kindes", type: "text", required: true, check: "steuerid", hint: "Elf Ziffern. Im Prototyp genügt eine erfundene Nummer, zum Beispiel 12345678901." },
    { id: "konto", label: "IBAN für die Auszahlung", type: "text", required: true, check: "iban", hint: "Bitte keine echte Kontonummer eingeben. Zum Testen: DE36 0000 0000 0000 0000 00." },
  ],
  "vereinsfoerderung-beantragen": [
    { id: "verein", label: "Name des Vereins", type: "text", required: true },
    { id: "projekt", label: "Projekttitel", type: "text", required: true },
    { id: "summe", label: "Beantragte Summe in Euro", type: "number", required: true },
    { id: "beschreibung", label: "Kurzbeschreibung des Projekts", type: "textarea", required: true },
  ],
  "gewerbe-anmelden": [
    { id: "taetigkeit", label: "Tätigkeit", type: "text", required: true, hint: "Zum Beispiel Lebensmittelhandel oder Grafikdesign" },
    { id: "beginn", label: "Beginn der Tätigkeit", type: "date", required: true },
    { id: "betriebsstaette", label: "Anschrift der Betriebsstätte", type: "text", required: true },
    { id: "art", label: "Art des Betriebs", type: "select", required: true, options: ["Hauptbetrieb", "Zweigniederlassung", "Unselbstständige Zweigstelle"] },
  ],
  "dorfladen-foerderung-beantragen": [
    { id: "laden", label: "Name des Ladens", type: "text", required: true },
    { id: "ort", label: "Ort des Ladens", type: "text", required: true },
    { id: "summe", label: "Beantragte Summe in Euro", type: "number", required: true },
    { id: "vorhaben", label: "Was soll gefördert werden?", type: "textarea", required: true },
  ],
};

// Fictional person behind the demo account. No sign-in data is ever asked for.
export const DEMO_PERSON = {
  name: "Alex Beispiel",
  birthday: "1990-04-12",
  address: "Hafenstraße 8, 20000 Beispielstadt",
  email: "alex.beispiel@example.org",
};
