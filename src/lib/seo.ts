import { business, siteUrl } from "@/config/site";
import { formatPower } from "./format";
import { vehicleFullTitle, type Vehicle } from "./vehicles/schema";

const abs = (p: string) => (p.startsWith("http") ? p : `${siteUrl}${p}`);

/** Dati strutturati dell'attività: solo informazioni verificate. */
export function dealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${siteUrl}/#dealer`,
    name: business.name,
    url: `${siteUrl}/`,
    logo: abs("/images/brand/logo-white.png"),
    image: abs("/og-image.jpg"),
    email: business.email,
    telephone: `+${business.phones[0].e164}`,
    vatID: `IT${business.vatId}`,
    foundingDate: String(business.since),
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressRegion: business.address.province,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: business.openingHoursSpec.map((s) => ({ "@type": "OpeningHoursSpecification", ...s })),
    areaServed: "Pompei",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

/** Schema Car con Offer solo se il prezzo è effettivamente indicato. */
export function vehicleJsonLd(v: Vehicle) {
  const url = `${siteUrl}/stock-auto/${v.slug}/`;
  const fuelMap: Record<string, string> = { Benzina: "Gasoline", Diesel: "Diesel", Elettrica: "Electric", GPL: "LPG", Metano: "CNG" };
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicleFullTitle(v),
    url,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleConfiguration: v.version,
    modelDate: v.year ? String(v.year) : undefined,
    mileageFromOdometer: v.mileageKm !== undefined ? { "@type": "QuantitativeValue", value: v.mileageKm, unitCode: "KMT" } : undefined,
    fuelType: v.fuel ? (fuelMap[v.fuel] ?? v.fuel) : undefined,
    vehicleTransmission: v.transmission,
    color: v.color,
    numberOfDoors: v.doors,
    seatingCapacity: v.seats,
    bodyType: v.bodyType,
    vehicleEngine: v.powerKw || v.powerHp ? { "@type": "EngineSpecification", name: formatPower(v.powerKw, v.powerHp) } : undefined,
    description: v.description,
    image: v.images.map((i) => abs(i.src)),
    offers: v.price
      ? {
          "@type": "Offer",
          price: v.price,
          priceCurrency: "EUR",
          url,
          itemCondition: "https://schema.org/UsedCondition",
          availability: v.status === "disponibile" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
          seller: { "@id": `${siteUrl}/#dealer` },
        }
      : undefined,
  };
}
