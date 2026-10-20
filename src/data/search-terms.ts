// Search terms the editorial team assigns to a pot, because the signal words alone would place them
// wrongly. A later backend would learn candidates from searches where people switched the pot.
// Normalised form: lower case, ä → ae, ö → oe, ü → ue, ß → ss, no punctuation.
export type CuratedTerm = { term: string; pot: "leistungen" | "informationen" };

export const CURATED_TERMS: CuratedTerm[] = [
  { term: "wie hoch ist das kindergeld", pot: "informationen" },
  { term: "kindergeld hoehe", pot: "informationen" },
  { term: "hoehe kindergeld", pot: "informationen" },
  { term: "familienkasse oeffnungszeiten", pot: "informationen" },
  { term: "oeffnungszeiten familienkasse", pot: "informationen" },
  { term: "buergeramt oeffnungszeiten", pot: "informationen" },
  { term: "oeffnungszeiten buergeramt", pot: "informationen" },
  { term: "kindergeldantrag", pot: "leistungen" },
  { term: "kindergeld antrag", pot: "leistungen" },
];
