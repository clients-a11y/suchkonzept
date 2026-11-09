import { STOPWORDS } from "@/data/intents";
import type { Place } from "@/data/places";
import { SERVICES, findService } from "@/data/services";
import { offeredIn } from "@/lib/offices";
import { routeQuery } from "@/lib/search-router";
import type { Pot } from "@/lib/search-router";
import { normalize, searchServices } from "@/lib/smart-search";
import type { Service } from "@/lib/types";

// What the area for services shows on the one results page. Later an AI makes this decision; the prototype takes the rules of the search switch and the catalogue.
export type ResultArea =
  | { kind: "services"; services: Service[]; direct?: Service; related?: boolean } // Fall 1. direct: the service itself, the others are alternatives. related: services next to information in focus
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

// The service itself first, then its close alternatives.
function withNearby(direct: Service): Service[] {
  const nearby = (direct.nearby ?? []).map((slug) => findService(slug)).filter((s): s is Service => Boolean(s));
  return [direct, ...nearby];
}

// The catalogue knows the term, but it can mean a service or information: "Kindergeld". Then the page asks first.
export function isUnclear(query: string): boolean {
  if (routeQuery(query).pot) return false;
  const found = searchServices(query);
  return Boolean(found.answer) || found.services.some((h) => h.score >= STRONG);
}

export function resultArea(query: string, place: Place | undefined, enteredHere: boolean, chosen?: Pot, limit: number = MAX_SERVICES, topicLimit = 0): ResultArea {
  const found = searchServices(query);
  const direct = found.answer;
  const strong = direct ? withNearby(direct) : found.services.filter((h) => h.score >= STRONG).map((h) => h.service);
  const clear = (chosen ?? routeQuery(query).pot) === "informationen" ? [] : strong.slice(0, limit);

  if (clear.length) {
    // Alternatives only ever stand next to the service itself.
    if (place) {
      const here = direct && !offeredIn(direct, place) ? [] : clear.filter((s) => offeredIn(s, place));
      return here.length ? { kind: "services", services: here, direct } : { kind: "nothing" };
    }
    const general = direct?.regional ? [] : clear.filter((s) => !s.regional);
    return general.length ? { kind: "services", services: general, direct } : { kind: "needPlace" };
  }

  // Information in focus: services on the same topic, when a test asks for them.
  const topic = normalize(query);
  const topical = SERVICES.filter((s) => s.topics?.some((word) => topic.includes(word))).slice(0, topicLimit);
  if (topical.length) return { kind: "services", services: topical, related: true };

  // Not clearly a service: only a place entered on this very page turns it into one.
  if (!place || !enteredHere) return { kind: "info" };
  const leads = found.services
    .filter((h) => h.score >= LEAD && offeredIn(h.service, place) && matchesEveryWord(h.service, query))
    .map((h) => h.service);
  if (!leads.length) return { kind: "nothing" };
  const services = [...new Set([...leads, ...withNearby(leads[0])])].filter((s) => offeredIn(s, place)).slice(0, limit);
  return { kind: "services", services, direct: leads[0] };
}
