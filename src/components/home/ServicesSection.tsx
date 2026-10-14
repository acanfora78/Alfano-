import Image from "next/image";
import Link from "next/link";
import { services } from "@/config/services";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/Section";

export function ServicesSection() {
  return (
    <section aria-labelledby="servizi-title" className="relative border-t border-line py-24 sm:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionHeading id="servizi-title" index="03" eyebrow="Servizi" lines={["Mobilità,", "su misura."]} className="lg:col-span-7" />
          <p className="max-w-md self-end text-ice/75 leading-relaxed lg:col-span-5" data-reveal>
            Vendita e noleggio di auto, motocicli, e-bike e imbarcazioni. Un team che ti aiuta a trovare il veicolo più adatto,
            che tu voglia acquistarlo o prenderlo a noleggio.
          </p>
        </div>

        <ul className="mt-16 border-t border-line">
          {services.map((s, i) => (
            <li key={s.slug} className="group relative border-b border-line" data-reveal style={{ ["--reveal-delay" as string]: `${i * 50}ms` }}>
              <Link
                href={s.href ?? `/servizi/#${s.slug}`}
                className="relative z-10 grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-7 sm:grid-cols-[4rem_1fr_1.2fr_auto] sm:gap-8 sm:py-9"
              >
                <span className="tabular text-xs text-silver transition-colors group-hover:text-ion">{s.index}</span>
                <span className="font-display text-2xl font-medium tracking-tight transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2 sm:text-4xl">
                  {s.title}
                </span>
                <span className="hidden text-sm leading-relaxed text-silver sm:block">{s.summary}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong transition-all duration-500 group-hover:border-ion group-hover:bg-ion group-hover:text-obsidian">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
              {/* immagine che emerge al passaggio (solo desktop con puntatore) */}
              <div
                aria-hidden
                className="pointer-events-none absolute right-24 top-1/2 z-20 hidden aspect-[4/3] w-64 -translate-y-1/2 rotate-2 scale-90 overflow-hidden rounded-xl opacity-0 shadow-2xl transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 [@media(hover:hover)_and_(min-width:1280px)]:block"
              >
                <Image src={s.image.src} alt="" fill sizes="256px" className="object-cover" />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12" data-reveal="fade">
          <Link href="/servizi/" className="btn btn-ghost">
            Tutti i servizi <ArrowRight size={16} className="btn-arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
