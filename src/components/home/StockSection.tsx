import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles/schema";
import { InventoryEmpty } from "@/components/vehicles/Catalog";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { ArrowRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/Section";


export function StockSection({ vehicles, total }: { vehicles: Vehicle[]; total: number }) {
  return (
    <section aria-labelledby="stock-title" className="relative py-24 sm:py-36">
      <div className="container-x">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="stock-title" index="01" eyebrow="The Collection" lines={["La tua prossima auto.", "Senza compromessi."]} />
          {total > 0 && (
            <Link href="/stock-auto/" className="btn btn-ghost shrink-0 self-start md:self-auto" data-reveal="fade">
              Tutto lo stock <span className="tabular text-silver">({total})</span> <ArrowRight size={16} className="btn-arrow" />
            </Link>
          )}
        </div>

        {vehicles.length > 0 ? (
          <ul className="mt-16 grid gap-5 [perspective:1600px] sm:grid-cols-2 xl:grid-cols-3">
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

    </section>
  );
}
