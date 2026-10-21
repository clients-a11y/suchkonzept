// Fictional places in Musterland. Postcodes are ranges; a place without its own offices in the
// organisation data is served by its general office. Beispielstadt has offices per service.
export type Place = {
  id: string;
  name: string;
  office: string;
  address: string;
  phone: string;
  plz: [number, number];
};

export const PLACES: Place[] = [
  { id: "musterstadt", name: "Musterstadt", office: "Bürgeramt Musterstadt", address: "Rathausplatz 1, 10000 Musterstadt", phone: "0100 200 10 00", plz: [10000, 10199] },
  { id: "seehausen", name: "Seehausen", office: "Bürgerbüro Seehausen", address: "Am Ufer 4, 10200 Seehausen", phone: "0102 30 40", plz: [10200, 10299] },
  { id: "waldheim", name: "Waldheim", office: "Amt Waldheim", address: "Lindenweg 12, 10300 Waldheim", phone: "0103 55 66", plz: [10300, 10399] },
  { id: "neudorf", name: "Neudorf", office: "Gemeindeverwaltung Neudorf", address: "Dorfstraße 2, 10400 Neudorf", phone: "0104 12 34", plz: [10400, 10499] },
  // Shares postcodes with Neudorf, as real postcodes often span several municipalities.
  { id: "muehlengrund", name: "Mühlengrund", office: "Gemeindebüro Mühlengrund", address: "Mühlenweg 3, 10480 Mühlengrund", phone: "0104 56 78", plz: [10480, 10499] },
  { id: "bergtal", name: "Bergtal", office: "Bürgeramt Bergtal", address: "Talstraße 9, 10500 Bergtal", phone: "0105 98 76", plz: [10500, 10599] },
  { id: "beispielstadt", name: "Beispielstadt", office: "Bürgeramt Beispielstadt", address: "Marktplatz 1, 20000 Beispielstadt", phone: "0200 98 76 54", plz: [20000, 20999] },
];

export function findPlace(id: string | undefined): Place | undefined {
  return id ? PLACES.find((p) => p.id === id) : undefined;
}
