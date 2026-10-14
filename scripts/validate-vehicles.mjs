#!/usr/bin/env node
/**
 * Controlla content/vehicles.json (o il file indicato) prima della pubblicazione.
 * Uso: npm run validate:vehicles [-- percorso/file.json]
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const file = process.argv[2] || "content/vehicles.json";
const FUELS = ["Benzina", "Diesel", "Ibrida", "Ibrida plug-in", "Elettrica", "GPL", "Metano"];
const TRANSMISSIONS = ["Manuale", "Automatico"];
const STATUSES = ["disponibile", "riservata", "venduta"];

let data;
try {
  data = JSON.parse(readFileSync(file, "utf8"));
} catch (e) {
  console.error(`✗ ${file}: JSON non valido — ${e.message}`);
  process.exit(1);
}
if (!Array.isArray(data)) {
  console.error(`✗ ${file}: deve contenere un array di veicoli`);
  process.exit(1);
}

const problems = [];
const ids = new Set();
data.forEach((v, i) => {
  const at = `#${i + 1}${v?.id ? ` (${v.id})` : ""}`;
  if (!v || typeof v !== "object") return problems.push(`${at}: non è un oggetto`);
  if (!v.id) problems.push(`${at}: "id" obbligatorio`);
  if (ids.has(v.id)) problems.push(`${at}: id duplicato`);
  ids.add(v.id);
  if (!v.make || !v.model) problems.push(`${at}: "make" e "model" obbligatori`);
  if (v.fuel && !FUELS.includes(v.fuel)) problems.push(`${at}: fuel deve essere uno di ${FUELS.join(", ")}`);
  if (v.transmission && !TRANSMISSIONS.includes(v.transmission)) problems.push(`${at}: transmission deve essere ${TRANSMISSIONS.join(" o ")}`);
  if (v.status && !STATUSES.includes(v.status)) problems.push(`${at}: status deve essere ${STATUSES.join(", ")}`);
  if (v.price !== undefined && !(typeof v.price === "number" && v.price > 0)) problems.push(`${at}: price deve essere un numero > 0 (oppure omesso)`);
  for (const im of v.images ?? []) {
    const src = typeof im === "string" ? im : im?.src;
    if (src?.startsWith("/") && !existsSync(path.join("public", src))) problems.push(`${at}: immagine mancante public${src}`);
  }
  if (!v.images?.length) problems.push(`${at}: (avviso) nessuna fotografia`);
});

if (problems.length) {
  console.log(problems.map((p) => `• ${p}`).join("\n"));
  const blocking = problems.filter((p) => !p.includes("(avviso)"));
  if (blocking.length) {
    console.error(`✗ ${blocking.length} errori in ${file}`);
    process.exit(1);
  }
}
console.log(`✓ ${file}: ${data.length} veicoli validi`);
