import { describe, expect, it } from "vitest";
import { normalizePayload, validateContact } from "@/lib/contact";

const ok = { name: "Mario Rossi", phone: "+39 333 1234567", email: "", message: "Vorrei informazioni", consent: true };

describe("validateContact", () => {
  it("accetta una richiesta valida con solo telefono", () => {
    expect(validateContact(normalizePayload(ok))).toEqual({});
  });
  it("richiede almeno un recapito", () => {
    expect(validateContact(normalizePayload({ ...ok, phone: "" })).contact).toBeTruthy();
  });
  it("valida formato email e telefono", () => {
    const e = validateContact(normalizePayload({ ...ok, phone: "abc", email: "x@y" }));
    expect(e.phone).toBeTruthy();
    expect(e.email).toBeTruthy();
  });
  it("richiede il consenso privacy esplicito (true booleano)", () => {
    expect(validateContact(normalizePayload({ ...ok, consent: "on" })).consent).toBeTruthy();
  });
  it("tronca i campi troppo lunghi", () => {
    expect(normalizePayload({ ...ok, message: "a".repeat(5000) }).message).toHaveLength(2000);
  });
});
