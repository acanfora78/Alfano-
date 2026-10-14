const eur = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const int = new Intl.NumberFormat("it-IT", { maximumFractionDigits: 0 });

export const formatPrice = (n?: number) => (n === undefined ? "Prezzo su richiesta" : eur.format(n));
export const formatKm = (n?: number) => (n === undefined ? undefined : `${int.format(n)} km`);
export const formatNumber = (n: number) => int.format(n);

export function formatPower(kw?: number, hp?: number) {
  if (kw && hp) return `${int.format(kw)} kW (${int.format(hp)} CV)`;
  if (kw) return `${int.format(kw)} kW`;
  if (hp) return `${int.format(hp)} CV`;
  return undefined;
}
