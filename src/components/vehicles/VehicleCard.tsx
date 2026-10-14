import Link from "next/link";
import { formatKm, formatPrice } from "@/lib/format";
import { vehicleTitle, type Vehicle } from "@/lib/vehicles/schema";
import { ArrowUpRight } from "@/components/ui/Icons";
import { VehicleImage } from "./VehicleImage";

export function VehicleCard({ vehicle: v, priority = false, delay = 0 }: { vehicle: Vehicle; priority?: boolean; delay?: number }) {
  const cover = v.images[0];
  const specs = [v.year ? String(v.year) : undefined, formatKm(v.mileageKm), v.fuel, v.transmission].filter(Boolean);
  const title = vehicleTitle(v);

  return (
    <article
      data-reveal
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      className="card group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-line bg-graphite/60 transition-colors duration-500 hover:border-line-strong"
    >
      <div className="card-media relative aspect-[4/3] overflow-hidden bg-titanium">
        <VehicleImage
          src={cover?.src}
          alt={cover?.alt || `${title} ${v.version ?? ""}`.trim()}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-transparent" />
        {v.status === "riservata" && (
          <span className="absolute left-4 top-4 rounded-full border border-line-strong bg-obsidian/70 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] backdrop-blur">
            Riservata
          </span>
        )}
        <span className="card-glow pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-ion to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow text-[0.65rem]">{v.make}</p>
        <h3 className="mt-2 font-display text-2xl font-medium leading-tight tracking-tight">
          <Link href={`/stock-auto/${v.slug}/`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {v.model}
          </Link>
        </h3>
        {v.version && <p className="mt-1 line-clamp-1 text-sm text-silver">{v.version}</p>}

        {specs.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-silver tabular">
            {specs.map((s) => (
              <li key={s} className="flex items-center gap-4 first:before:hidden before:h-3 before:w-px before:bg-line-strong">
                {s}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="font-display text-2xl tabular tracking-tight">{formatPrice(v.price)}</p>
            {v.priceNote && <p className="mt-0.5 text-xs text-silver">{v.priceNote}</p>}
          </div>
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong transition-all duration-500 group-hover:border-ion group-hover:bg-ion group-hover:text-obsidian"
          >
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
      {/* focus visibile sull'intera card */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-ion group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
