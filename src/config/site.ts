/**
 * Dati aziendali centralizzati.
 *
 * Ogni informazione proviene dal sito ufficiale precedente (alfanocars.it,
 * home page, pagina noleggio, pagina tour in barca e privacy policy).
 * Le voci contrassegnate "DA CONFERMARE" presentavano versioni discordanti
 * sul vecchio sito: correggerle qui e si aggiorneranno in tutto il sito.
 */

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://alfanocars.it").replace(/\/$/, "");

export type Phone = {
  /** Numero in formato leggibile */
  display: string;
  /** Formato E.164 senza "+" per wa.me e tel: */
  e164: string;
  label: string;
  whatsapp: boolean;
};

export const business = {
  name: "Alfano Cars",
  legalName: "ALFANO CARS",
  tagline: "Beyond the drive.",
  vatId: "01850570704",
  /** Rivendicazione presente sul vecchio sito ("Qualità e professionalità dal 1985") */
  since: 1985,
  address: {
    // DA CONFERMARE: il vecchio sito riporta n. 133 (footer), n. 155 (privacy policy
    // e segnaposto mappa) e n. 151 (insegna in sede). Si usa il 155 del documento legale.
    street: "Via Tre Ponti, 155",
    postalCode: "80045",
    city: "Pompei",
    province: "NA",
    region: "Campania",
    country: "IT",
  },
  email: "alfanocars@gmail.com",
  pec: "alfanocars@pec.it",
  phones: [
    { display: "350 041 4682", e164: "393500414682", label: "Vincenzo", whatsapp: true },
    { display: "351 254 6836", e164: "393512546836", label: "Michele", whatsapp: true },
    { display: "344 487 5970", e164: "393444875970", label: "Ufficio", whatsapp: false },
    { display: "081 1871 7773", e164: "390811871773", label: "Fisso", whatsapp: false },
  ] satisfies Phone[],
  /**
   * Orari dalla home page del vecchio sito.
   * DA CONFERMARE: la pagina "Tour in barca" indicava sabato 09:00–15:00.
   */
  hours: [
    { days: "Lunedì – Venerdì", slots: ["09:00 – 13:30", "15:00 – 20:00"] },
    { days: "Sabato", slots: ["09:00 – 13:30"] },
    { days: "Domenica", slots: ["Chiuso"] },
  ],
  /** Schema.org openingHoursSpecification equivalente */
  openingHoursSpec: [
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "13:30" },
    { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "15:00", closes: "20:00" },
    { dayOfWeek: ["Saturday"], opens: "09:00", closes: "13:30" },
  ],
} as const;

export const primaryWhatsApp = business.phones[0];
export const primaryPhone = business.phones[0];

export const fullAddress = `${business.address.street}, ${business.address.postalCode} ${business.address.city} (${business.address.province})`;

const mapsQuery = encodeURIComponent(`Alfano Cars, ${business.address.street}, ${business.address.postalCode} ${business.address.city}`);
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
export const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&t=m&z=15&output=embed`;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/stock-auto/", label: "Stock auto" },
  { href: "/servizi/", label: "Servizi" },
  { href: "/chi-siamo/", label: "Chi siamo" },
  { href: "/contatti/", label: "Contatti" },
] as const;

export function whatsappUrl(text: string, phone: Phone = primaryWhatsApp) {
  return `https://wa.me/${phone.e164}?text=${encodeURIComponent(text)}`;
}

export function telUrl(phone: Phone = primaryPhone) {
  return `tel:+${phone.e164}`;
}
