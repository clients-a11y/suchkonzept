import type { Place } from "@/data/content";
import { unitForService } from "@/data/organisation";
import type { Service, Tenant } from "@/lib/types";

// Who handles a service: shared by the service page and the assistant.
export type Office = { office: string; address: string; phone: string; hours?: string };

export function officeOf(tenant: Tenant, service: Service): Office {
  const unit = unitForService(tenant, service.slug);
  return unit ? { office: unit.name, address: unit.address, phone: unit.phone, hours: tenant.contact.hours } : tenant.contact;
}

// The office for a place: its own portal's office if the place has one on this platform.
export function officeForPlace(place: Place, service: Service, tenants: Tenant[]): Office {
  const own = place.tenant ? tenants.find((t) => t.id === place.tenant) : undefined;
  if (!own) return place;
  const office = officeOf(own, service);
  // Seen from another portal "Bürgeramt" needs the city's name.
  return office.office.includes(own.name) ? office : { ...office, office: `${office.office} ${own.name}` };
}
