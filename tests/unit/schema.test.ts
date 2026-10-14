import { describe, expect, it } from "vitest";
import { slugify, validateVehicles } from "@/lib/vehicles/schema";

describe("validateVehicles", () => {
  it("scarta voci incomplete e segnala l'errore", () => {
    const { vehicles, errors } = validateVehicles([{ id: "a", make: "Fiat", model: "Panda" }, { id: "b", model: "X" }, 42]);
    expect(vehicles).toHaveLength(1);
    expect(errors).toHaveLength(2);
  });

  it("genera slug stabili e unici", () => {
    const { vehicles, errors } = validateVehicles([
      { id: "1", make: "Alfa Romeo", model: "Giulia", version: "2.2 Veloce", year: 2020 },
      { id: "2", make: "Alfa Romeo", model: "Giulia", slug: "alfa-romeo-giulia-2-2-veloce-2020-1" },
    ]);
    expect(vehicles[0].slug).toBe("alfa-romeo-giulia-2-2-veloce-2020-1");
    expect(errors[0]).toMatch(/slug duplicato/);
  });

  it("non accetta valori incoerenti (prezzo zero, alimentazione sconosciuta)", () => {
    const { vehicles, errors } = validateVehicles([{ id: "1", make: "Fiat", model: "Tipo", price: 0, fuel: "Nucleare", images: ["/a.jpg", ""] }]);
    expect(vehicles[0].price).toBeUndefined();
    expect(vehicles[0].fuel).toBeUndefined();
    expect(vehicles[0].images).toEqual([{ src: "/a.jpg" }]);
    expect(errors[0]).toMatch(/alimentazione/);
  });

  it("rifiuta un inventario che non è un array", () => {
    expect(validateVehicles({}).errors).toHaveLength(1);
  });

  it("slugify rimuove accenti e simboli", () => {
    expect(slugify("Citroën C3 Aircross — 1.2!")).toBe("citroen-c3-aircross-1-2");
  });
});
