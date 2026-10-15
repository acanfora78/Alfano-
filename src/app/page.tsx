import type { Metadata } from "next";
import { BeyondScene } from "@/components/home/BeyondScene";
import { DriveBy } from "@/components/home/DriveBy";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { FinalCta } from "@/components/home/FinalCta";
import { FinalScene } from "@/components/home/FinalScene";
import { Hero } from "@/components/home/Hero";
import { Immersive } from "@/components/home/Immersive";
import { ServicesInMotion } from "@/components/home/ServicesInMotion";
import { StockSection } from "@/components/home/StockSection";
import { VelocityMarquee } from "@/components/home/VelocityMarquee";
import { JsonLd } from "@/components/ui/Section";
import { dealerJsonLd } from "@/lib/seo";
import { applyFilters, EMPTY_FILTERS } from "@/lib/vehicles/filters";
import { getInventory } from "@/lib/vehicles/source";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title: "Alfano Cars — Beyond the Drive", url: "/" },
};

export const revalidate = 600;

export default async function HomePage() {
  const { vehicles } = await getInventory();
  const ordered = applyFilters(vehicles, EMPTY_FILTERS);
  const featured = ordered.filter((v) => v.featured);
  const selection = (featured.length >= 3 ? featured : ordered).slice(0, 6);

  return (
    <>
      <JsonLd data={dealerJsonLd()} />
      {/* SEQUENZA 1 — apertura: lo spot */}
      <Hero />
      {/* SEQUENZA 2 — Beyond the ordinary */}
      <BeyondScene />
      <VelocityMarquee words={["Beyond the drive", "Pompei", "Vendita", "Noleggio", "Dal 1985"]} />
      {/* THE COLLECTION — stock reale + piazzale in coverflow */}
      <StockSection vehicles={selection} total={vehicles.length} />
      <DriveBy />
      {/* SEQUENZA 3 — anatomia dei dettagli */}
      <Immersive />
      {/* SEQUENZA 4 — servizi in movimento */}
      <ServicesInMotion />
      {/* SEQUENZA 5 — l'esperienza Alfano */}
      <ExperienceSection />
      {/* FINALE */}
      <FinalScene />
      <FinalCta />
    </>
  );
}
