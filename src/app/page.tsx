import type { Metadata } from "next";
import { BrandSection } from "@/components/home/BrandSection";
import { DriveBy } from "@/components/home/DriveBy";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { Immersive } from "@/components/home/Immersive";
import { IntroIgnition } from "@/components/home/IntroIgnition";
import { ServicesSection } from "@/components/home/ServicesSection";
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
      <IntroIgnition />
      <Hero />
      <VelocityMarquee words={["Beyond the drive", "Pompei", "Vendita", "Noleggio", "Dal 1985"]} />
      <StockSection vehicles={selection} total={vehicles.length} />
      <DriveBy />
      <Immersive />
      <ServicesSection />
      <BrandSection />
      <FinalCta />
    </>
  );
}
