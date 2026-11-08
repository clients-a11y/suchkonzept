import { STOPWORDS } from "@/data/intents";
import type { Place } from "@/data/places";
import { offeredIn } from "@/lib/offices";
import { routeQuery } from "@/lib/search-router";
import { normalize, searchServices } from "@/lib/smart-search";
import type { Service } from "@/lib/types";

// What the area for services shows on the one results page. Later an AI makes this decision; the prototype takes the rules of the search switch and the catalogue.
export type ResultArea =
  | { kind: "services"; services: Service[] } // Fall 1
  | { kind: "needPlace" } // Fall 2: a service, but without a place there is nothing to show
  | { kind: "nothing" } // Fall 2: nothing at this place
  | { kind: "info" }; // Fall 3

const MAX_SERVICES = 3;
const STRONG = 5;
// Enough for a service to come up once the person has given a place, too weak to lead on its own.
const LEAD = 3;

// "Zuschuss Heizung" must not bring up every service that mentions a Zuschuss.
function matchesEveryWord(service: Service, query: string): boolean {
  return normalize(query)
    .split(" ")
    .filter((word) => word && !STOPWORDS.has(word))
    .every((word) => searchServices(word).services.some((h) => h.service.slug === service.slug));
}

export function resultArea(query: string, place: Place | undefined, enteredHere: boolean): ResultArea {
  const found = searchServices(query);
  const strong = found.answer ? [found.answer] : found.services.filter((h) => h.score >= STRONG).map((h) => h.service);
  const clear = routeQuery(query).pot === "informationen" ? [] : strong.slice(0, MAX_SERVICES);

  if (clear.length) {
    if (place) {
      const here = clear.filter((s) => offeredIn(s, place));
      return here.length ? { kind: "services", services: here } : { kind: "nothing" };
    }
    const general = clear.filter((s) => !s.regional);
    return general.length ? { kind: "services", services: general } : { kind: "needPlace" };
  }

  // Not clearly a service: only a place entered on this very page turns it into one.
  if (!place || !enteredHere) return { kind: "info" };
  const leads = found.services
    .filter((h) => h.score >= LEAD && offeredIn(h.service, place) && matchesEveryWord(h.service, query))
    .map((h) => h.service)
    .slice(0, MAX_SERVICES);
  return leads.length ? { kind: "services", services: leads } : { kind: "nothing" };
}
