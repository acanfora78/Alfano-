/**
 * Schema dell'inventario veicoli.
 * Fonte unica: content/vehicles.json oppure il feed remoto VEHICLES_FEED_URL.
 * I campi facoltativi non disponibili vengono semplicemente omessi nel sito.
 */

export const FUELS = ["Benzina", "Diesel", "Ibrida", "Ibrida plug-in", "Elettrica", "GPL", "Metano"] as const;
export const TRANSMISSIONS = ["Manuale", "Automatico"] as const;
export const STATUSES = ["disponibile", "riservata", "venduta"] as const;

export type Fuel = (typeof FUELS)[number];
export type Transmission = (typeof TRANSMISSIONS)[number];
export type VehicleStatus = (typeof STATUSES)[number];

export type VehicleImage = { src: string; alt?: string; width?: number; height?: number };

export type Vehicle = {
  id: string;
  slug: string;
  status: VehicleStatus;
  make: string;
  model: string;
  version?: string;
  year?: number;
  /** Prima immatricolazione, formato "MM/AAAA" */
  registration?: string;
  mileageKm?: number;
  fuel?: Fuel;
  transmission?: Transmission;
  powerKw?: number;
  powerHp?: number;
  displacementCc?: number;
  bodyType?: string;
  color?: string;
  doors?: number;
  seats?: number;
  emissionClass?: string;
  owners?: number;
  /** Prezzo in euro. Se assente il sito mostra "Prezzo su richiesta". */
  price?: number;
  priceNote?: string;
  description?: string;
  features?: string[];
  images: VehicleImage[];
  featured?: boolean;
  updatedAt?: string;
};

export type ValidationResult = { vehicles: Vehicle[]; errors: string[] };

const isStr = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Valida e normalizza i dati grezzi, scartando le voci non conformi. */
export function validateVehicles(raw: unknown): ValidationResult {
  const errors: string[] = [];
  if (!Array.isArray(raw)) return { vehicles: [], errors: ["L'inventario deve essere un array JSON"] };

  const seen = new Set<string>();
  const vehicles: Vehicle[] = [];

  raw.forEach((item, i) => {
    const where = `voce #${i + 1}`;
    if (!item || typeof item !== "object") {
      errors.push(`${where}: non è un oggetto`);
      return;
    }
    const r = item as Record<string, unknown>;
    if (!isStr(r.id)) return void errors.push(`${where}: "id" mancante`);
    if (!isStr(r.make) || !isStr(r.model)) return void errors.push(`${where} (${r.id}): "make" e "model" obbligatori`);

    const slug = isStr(r.slug)
      ? slugify(r.slug)
      : slugify([r.make, r.model, r.version, r.year, r.id].filter(Boolean).join(" "));
    if (seen.has(slug)) return void errors.push(`${where}: slug duplicato "${slug}"`);

    const status = STATUSES.includes(r.status as VehicleStatus) ? (r.status as VehicleStatus) : "disponibile";
    const images = Array.isArray(r.images)
      ? (r.images as unknown[])
          .map((im) => (typeof im === "string" ? { src: im } : (im as VehicleImage)))
          .filter((im) => im && isStr(im.src))
      : [];

    const opt = <T,>(cond: boolean, v: T) => (cond ? v : undefined);
    const v: Vehicle = {
      id: r.id.trim(),
      slug,
      status,
      make: r.make.trim(),
      model: r.model.trim(),
      version: opt(isStr(r.version), r.version as string),
      year: opt(isNum(r.year) && (r.year as number) > 1900, r.year as number),
      registration: opt(isStr(r.registration), r.registration as string),
      mileageKm: opt(isNum(r.mileageKm), r.mileageKm as number),
      fuel: opt(FUELS.includes(r.fuel as Fuel), r.fuel as Fuel),
      transmission: opt(TRANSMISSIONS.includes(r.transmission as Transmission), r.transmission as Transmission),
      powerKw: opt(isNum(r.powerKw), r.powerKw as number),
      powerHp: opt(isNum(r.powerHp), r.powerHp as number),
      displacementCc: opt(isNum(r.displacementCc), r.displacementCc as number),
      bodyType: opt(isStr(r.bodyType), r.bodyType as string),
      color: opt(isStr(r.color), r.color as string),
      doors: opt(isNum(r.doors), r.doors as number),
      seats: opt(isNum(r.seats), r.seats as number),
      emissionClass: opt(isStr(r.emissionClass), r.emissionClass as string),
      owners: opt(isNum(r.owners), r.owners as number),
      price: opt(isNum(r.price) && (r.price as number) > 0, r.price as number),
      priceNote: opt(isStr(r.priceNote), r.priceNote as string),
      description: opt(isStr(r.description), r.description as string),
      features: Array.isArray(r.features) ? (r.features as unknown[]).filter(isStr) : undefined,
      images,
      featured: r.featured === true,
      updatedAt: opt(isStr(r.updatedAt), r.updatedAt as string),
    };
    if (r.fuel !== undefined && !v.fuel) errors.push(`${where} (${v.id}): alimentazione "${String(r.fuel)}" non riconosciuta`);
    seen.add(slug);
    vehicles.push(v);
  });

  return { vehicles, errors };
}

export function vehicleTitle(v: Pick<Vehicle, "make" | "model">) {
  return `${v.make} ${v.model}`;
}

export function vehicleFullTitle(v: Pick<Vehicle, "make" | "model" | "version">) {
  return [v.make, v.model, v.version].filter(Boolean).join(" ");
}
