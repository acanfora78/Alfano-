import Image from "next/image";
import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles/schema";
import { InventoryEmpty } from "@/components/vehicles/Catalog";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { ArrowRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/Section";

const yard = [
  { src: "/images/fleet/stelvio-side.jpg", alt: "Alfa Romeo Stelvio nel piazzale" },
  { src: "/images/fleet/renegade.jpg", alt: "Jeep Renegade grigia nel piazzale" },
  { src: "/images/fleet/fiat500x-smart.jpg", alt: "Fiat 500X e smart forfour in sede" },
  { src: "/images/fleet/maserati-levante.jpg", alt: "Maserati Levante bianca" },
  { src: "/images/fleet/glc-coupe.jpg", alt: "Mercedes GLC Coupé bianca" },
  { src: "/images/fleet/mini-countryman.jpg", alt: "MINI Countryman davanti alla sede" },
];

export function StockSection({ vehicles, total }: { vehicles: Vehicle[]; total: number }) {
  return (
    <section aria-labelledby="stock-title" className="relative py-24 sm:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="stock-title" index="01" eyebrow="Stock selezionato" lines={["La tua prossima auto.", "Senza compromessi."]} />
          {total > 0 && (
            <Link href="/stock-auto/" className="btn btn-ghost shrink-0 self-start md:self-auto" data-reveal="fade">
              Tutto lo stock <span className="tabular text-silver">({total})</span> <ArrowRight size={16} className="btn-arrow" />
            </Link>
          )}
        </div>

        {vehicles.length > 0 ? (
          <ul className="mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((v, i) => (
              <li key={v.id}>
                <VehicleCard vehicle={v} delay={(i % 3) * 110} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-16">
            <InventoryEmpty />
          </div>
        )}
      </div>

      {vehicles.length === 0 && (
        <div className="mt-20" aria-label="Fotografie dal piazzale Alfano Cars">
          <div className="container-x mb-6 flex items-center justify-between">
            <p className="eyebrow">Dal nostro piazzale</p>
            <p className="text-xs text-silver">Foto della sede · disponibilità da verificare</p>
          </div>
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2">
            {yard.map((im, i) => (
              <li
                key={im.src}
                data-reveal
                style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
                className="relative aspect-[4/5] w-[72vw] shrink-0 snap-start overflow-hidden rounded-[1.25rem] border border-line sm:w-[38vw] lg:w-[24vw]"
              >
                <Image src={im.src} alt={im.alt} fill sizes="(min-width: 1024px) 24vw, (min-width: 640px) 38vw, 72vw" className="object-cover brightness-[.8] saturate-[.8]" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
