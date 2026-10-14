import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { validateVehicles, type Vehicle } from "./schema";

export type InventoryResult = { vehicles: Vehicle[]; ok: boolean; source: "file" | "feed" };

const revalidate = Number(process.env.VEHICLES_REVALIDATE || 600);

async function readRaw(): Promise<{ raw: unknown; source: "file" | "feed" }> {
  const feed = process.env.VEHICLES_FEED_URL;
  if (feed) {
    const res = await fetch(feed, { next: { revalidate }, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Feed veicoli: HTTP ${res.status}`);
    return { raw: await res.json(), source: "feed" };
  }
  // VEHICLES_FILE consente di puntare a un file alternativo (es. fixture di test)
  const override = process.env.VEHICLES_FILE;
  const text = override
    ? await readFile(/*turbopackIgnore: true*/ override, "utf8")
    : await readFile(path.join(process.cwd(), "content", "vehicles.json"), "utf8");
  return { raw: JSON.parse(text), source: "file" };
}

/**
 * Inventario reale. In caso di errore della fonte restituisce ok=false:
 * le pagine mostrano uno stato di errore invece di un catalogo vuoto fuorviante.
 */
export const getInventory = cache(async (): Promise<InventoryResult> => {
  try {
    const { raw, source } = await readRaw();
    const { vehicles, errors } = validateVehicles(raw);
    if (errors.length) console.warn(`[inventario] ${errors.length} voci ignorate:\n- ${errors.join("\n- ")}`);
    return { vehicles: vehicles.filter((v) => v.status !== "venduta"), ok: true, source };
  } catch (err) {
    console.error("[inventario] fonte non disponibile:", err);
    return { vehicles: [], ok: false, source: process.env.VEHICLES_FEED_URL ? "feed" : "file" };
  }
});

export async function getVehicleBySlug(slug: string) {
  const { vehicles } = await getInventory();
  return vehicles.find((v) => v.slug === slug);
}

export function relatedVehicles(all: Vehicle[], current: Vehicle, limit = 3) {
  const score = (v: Vehicle) =>
    (v.make === current.make ? 3 : 0) +
    (v.bodyType && v.bodyType === current.bodyType ? 2 : 0) +
    (v.price && current.price && Math.abs(v.price - current.price) / current.price < 0.25 ? 1 : 0);
  return all
    .filter((v) => v.id !== current.id)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}
