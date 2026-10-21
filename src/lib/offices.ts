import { SITE } from "@/data/site";
import type { Contact } from "@/data/site";
import type { Place } from "@/data/places";
import { groupOf, landUnitFor, localUnitFor } from "@/data/organisation";
import type { OrgUnit } from "@/data/organisation";
import type { Service } from "@/lib/types";

// Who handles a service: shared by the service page, the search, the application and the assistant.
export type Office = Contact;

function ofUnit(unit: OrgUnit): Office {
  return { office: unit.name, address: unit.address, phone: unit.phone, hours: groupOf(unit).hours };
}

// Services of the Land: the ministry in charge, or the citizens' service if none is named.
export function landOffice(service: Service): Office {
  const unit = landUnitFor(service.slug);
  return unit ? ofUnit(unit) : SITE.contact;
}

// Municipal services: the place's own office for this service, otherwise its general office.
export function officeForPlace(place: Place, service: Service): Office {
  const unit = localUnitFor(place.id, service.slug);
  return unit ? ofUnit(unit) : place;
}

// The office in charge. Municipal services need the place; without it there is no answer yet.
export function responsibleOffice(service: Service, place?: Place): Office | undefined {
  if (service.level === "land") return landOffice(service);
  return place ? officeForPlace(place, service) : undefined;
}
