import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { activeFilterCount, applyFilters, EMPTY_FILTERS, facetOptions, parseFilters, serializeFilters } from "@/lib/vehicles/filters";
import { validateVehicles } from "@/lib/vehicles/schema";

const { vehicles: all } = validateVehicles(JSON.parse(readFileSync("tests/fixtures/vehicles.qa.json", "utf8")));
const vehicles = all.filter((v) => v.status !== "venduta");

describe("applyFilters", () => {
  it("cerca per marca e modello ignorando maiuscole e accenti", () => {
    expect(applyFilters(vehicles, { ...EMPTY_FILTERS, q: "alfa stelvio" }).map((v) => v.id)).toEqual(["qa-1"]);
    expect(applyFilters(vehicles, { ...EMPTY_FILTERS, q: "COUPE" }).map((v) => v.id)).toEqual(["qa-5"]);
  });

  it("filtra per intervallo di prezzo escludendo i veicoli senza prezzo", () => {
    const r = applyFilters(vehicles, { ...EMPTY_FILTERS, priceMin: 15000, priceMax: 20000 });
    expect(r.map((v) => v.id).sort()).toEqual(["qa-2", "qa-4", "qa-6"]);
  });

  it("filtra per anno minimo, km massimi, alimentazione e cambio", () => {
    expect(applyFilters(vehicles, { ...EMPTY_FILTERS, yearMin: 2021 }).every((v) => (v.year ?? 0) >= 2021)).toBe(true);
    expect(applyFilters(vehicles, { ...EMPTY_FILTERS, kmMax: 40000 }).map((v) => v.id).sort()).toEqual(["qa-4", "qa-7"]);
    expect(applyFilters(vehicles, { ...EMPTY_FILTERS, fuel: "Diesel", transmission: "Automatico" }).map((v) => v.id).sort()).toEqual(["qa-1", "qa-5"]);
  });

  it("ordina per prezzo con i prezzi mancanti sempre in fondo", () => {
    const asc = applyFilters(vehicles, { ...EMPTY_FILTERS, sort: "prezzo-asc" });
    expect(asc[0].id).toBe("qa-3");
    expect(asc.at(-1)!.price).toBeUndefined();
    const desc = applyFilters(vehicles, { ...EMPTY_FILTERS, sort: "prezzo-desc" });
    expect(desc[0].id).toBe("qa-1");
    expect(desc.at(-1)!.price).toBeUndefined();
  });

  it("in evidenza: disponibili prima delle riservate", () => {
    const r = applyFilters(vehicles, EMPTY_FILTERS);
    expect(r[0].id).toBe("qa-1");
    expect(r.at(-1)!.status).toBe("riservata");
  });
});

describe("URL dei filtri", () => {
  it("serializza e rilegge gli stessi filtri", () => {
    const f = { ...EMPTY_FILTERS, q: "jeep", make: "Jeep", priceMax: 20000, yearMin: 2019, sort: "anno-desc" as const };
    const back = parseFilters(new URLSearchParams(serializeFilters(f)));
    expect(back).toEqual(f);
    expect(activeFilterCount(back)).toBe(4);
  });

  it("ignora valori non validi", () => {
    const f = parseFilters(new URLSearchParams("prezzo_min=abc&ordina=hack&km_max=-5"));
    expect(f.priceMin).toBeUndefined();
    expect(f.kmMax).toBeUndefined();
    expect(f.sort).toBe("rilevanza");
  });
});

describe("facetOptions", () => {
  it("propone solo opzioni presenti nei dati", () => {
    const f = facetOptions(vehicles);
    expect(f.makes).toContain("Jeep");
    expect(f.fuels).not.toContain("GPL");
    expect(f.hasPrice).toBe(true);
  });
});
