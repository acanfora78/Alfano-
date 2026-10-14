import type { Vehicle } from "./schema";

export type SortKey = "rilevanza" | "prezzo-asc" | "prezzo-desc" | "anno-desc" | "anno-asc" | "km-asc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rilevanza", label: "In evidenza" },
  { value: "prezzo-asc", label: "Prezzo crescente" },
  { value: "prezzo-desc", label: "Prezzo decrescente" },
  { value: "anno-desc", label: "Più recenti" },
  { value: "anno-asc", label: "Meno recenti" },
  { value: "km-asc", label: "Chilometraggio minore" },
];

export type Filters = {
  q: string;
  make: string;
  fuel: string;
  transmission: string;
  body: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  kmMax?: number;
  sort: SortKey;
};

export const EMPTY_FILTERS: Filters = { q: "", make: "", fuel: "", transmission: "", body: "", sort: "rilevanza" };

const num = (v: string | null) => {
  if (v === null || v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function parseFilters(params: URLSearchParams): Filters {
  const sort = params.get("ordina") as SortKey | null;
  return {
    q: params.get("q")?.slice(0, 80) ?? "",
    make: params.get("marca") ?? "",
    fuel: params.get("alimentazione") ?? "",
    transmission: params.get("cambio") ?? "",
    body: params.get("carrozzeria") ?? "",
    priceMin: num(params.get("prezzo_min")),
    priceMax: num(params.get("prezzo_max")),
    yearMin: num(params.get("anno_min")),
    kmMax: num(params.get("km_max")),
    sort: sort && SORT_OPTIONS.some((o) => o.value === sort) ? sort : "rilevanza",
  };
}

export function serializeFilters(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.make) p.set("marca", f.make);
  if (f.fuel) p.set("alimentazione", f.fuel);
  if (f.transmission) p.set("cambio", f.transmission);
  if (f.body) p.set("carrozzeria", f.body);
  if (f.priceMin !== undefined) p.set("prezzo_min", String(f.priceMin));
  if (f.priceMax !== undefined) p.set("prezzo_max", String(f.priceMax));
  if (f.yearMin !== undefined) p.set("anno_min", String(f.yearMin));
  if (f.kmMax !== undefined) p.set("km_max", String(f.kmMax));
  if (f.sort !== "rilevanza") p.set("ordina", f.sort);
  return p.toString();
}

export function activeFilterCount(f: Filters) {
  return (
    [f.q, f.make, f.fuel, f.transmission, f.body].filter(Boolean).length +
    [f.priceMin, f.priceMax, f.yearMin, f.kmMax].filter((v) => v !== undefined).length
  );
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const statusRank = { disponibile: 0, riservata: 1, venduta: 2 } as const;

export function applyFilters(vehicles: Vehicle[], f: Filters): Vehicle[] {
  const terms = norm(f.q).split(/\s+/).filter(Boolean);

  const out = vehicles.filter((v) => {
    if (terms.length) {
      const hay = norm([v.make, v.model, v.version, v.bodyType, v.color].filter(Boolean).join(" "));
      if (!terms.every((t) => hay.includes(t))) return false;
    }
    if (f.make && v.make !== f.make) return false;
    if (f.fuel && v.fuel !== f.fuel) return false;
    if (f.transmission && v.transmission !== f.transmission) return false;
    if (f.body && v.bodyType !== f.body) return false;
    // Veicoli senza prezzo esclusi solo quando si filtra per prezzo
    if (f.priceMin !== undefined && (v.price === undefined || v.price < f.priceMin)) return false;
    if (f.priceMax !== undefined && (v.price === undefined || v.price > f.priceMax)) return false;
    if (f.yearMin !== undefined && (v.year === undefined || v.year < f.yearMin)) return false;
    if (f.kmMax !== undefined && (v.mileageKm === undefined || v.mileageKm > f.kmMax)) return false;
    return true;
  });

  // Valori mancanti sempre in fondo, indipendentemente dalla direzione
  const by = (get: (v: Vehicle) => number | undefined, dir: 1 | -1) => (a: Vehicle, b: Vehicle) => {
    const x = get(a);
    const y = get(b);
    if (x === undefined && y === undefined) return 0;
    if (x === undefined) return 1;
    if (y === undefined) return -1;
    return (x - y) * dir;
  };

  const sorters: Record<SortKey, (a: Vehicle, b: Vehicle) => number> = {
    rilevanza: (a, b) =>
      statusRank[a.status] - statusRank[b.status] || Number(!!b.featured) - Number(!!a.featured),
    "prezzo-asc": by((v) => v.price, 1),
    "prezzo-desc": by((v) => v.price, -1),
    "anno-desc": by((v) => v.year, -1),
    "anno-asc": by((v) => v.year, 1),
    "km-asc": by((v) => v.mileageKm, 1),
  };

  return [...out].sort(sorters[f.sort]);
}

/** Opzioni dei filtri derivate dai dati reali: nessun filtro vuoto. */
export function facetOptions(vehicles: Vehicle[]) {
  const uniq = (vals: (string | undefined)[]) =>
    [...new Set(vals.filter((x): x is string => !!x))].sort((a, b) => a.localeCompare(b, "it"));
  const years = vehicles.map((v) => v.year).filter((y): y is number => y !== undefined);
  const prices = vehicles.map((v) => v.price).filter((p): p is number => p !== undefined);
  const kms = vehicles.map((v) => v.mileageKm).filter((k): k is number => k !== undefined);
  return {
    makes: uniq(vehicles.map((v) => v.make)),
    fuels: uniq(vehicles.map((v) => v.fuel)),
    transmissions: uniq(vehicles.map((v) => v.transmission)),
    bodies: uniq(vehicles.map((v) => v.bodyType)),
    years: [...new Set(years)].sort((a, b) => b - a),
    hasPrice: prices.length > 0,
    hasKm: kms.length > 0,
  };
}
