import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { Catalog } from "@/components/vehicles/Catalog";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getInventory } from "@/lib/vehicles/source";
import { CatalogSkeleton } from "@/components/vehicles/CatalogSkeleton";

export const metadata: Metadata = {
  title: "Stock auto — Vetture disponibili",
  description: "Le auto disponibili presso Alfano Cars a Pompei: cerca per marca e modello, filtra per prezzo, anno, chilometraggio e alimentazione.",
  alternates: { canonical: "/stock-auto/" },
  openGraph: { title: "Stock auto | Alfano Cars", url: "/stock-auto/" },
};

export const revalidate = 600;

export default async function StockPage() {
  const { vehicles, ok } = await getInventory();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Stock auto", path: "/stock-auto/" }])} />
      <PageHero
        eyebrow="Stock auto"
        lines={["La tua prossima auto.", "Senza compromessi."]}
        intro="Cerca tra le vetture disponibili in sede. Ogni scheda riporta i dati forniti dalla concessionaria: per conferme su disponibilità e condizioni, contattaci."
        image={{ src: "/images/alfano/g63-showroom.jpg", alt: "Mercedes-AMG G 63 nello showroom Alfano Cars" }}
        crumbs={[{ href: "/", label: "Home" }, { label: "Stock auto" }]}
      />
      <section aria-label="Catalogo vetture" className="container-x py-14 sm:py-20">
        <Suspense fallback={<CatalogSkeleton inline />}>
          <Catalog vehicles={vehicles} ok={ok} />
        </Suspense>
      </section>
    </>
  );
}
