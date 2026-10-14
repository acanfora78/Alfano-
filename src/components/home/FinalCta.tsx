import Image from "next/image";
import Link from "next/link";
import { business, fullAddress, mapsDirectionsUrl, whatsappUrl } from "@/config/site";
import { ArrowRight, ArrowUpRight, Clock, Pin, WhatsApp } from "@/components/ui/Icons";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { TrackedLink } from "@/components/ui/TrackedLink";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden border-t border-line">
      <div className="absolute inset-0 -z-10">
        <div data-parallax style={{ ["--parallax-range" as string]: "80px", ["--parallax-scale" as string]: "1.15" }} className="absolute inset-0">
          <Image src="/images/details/steering-wheel-graded.jpg" alt="" fill sizes="100vw" className="object-cover opacity-50" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian" />
      </div>

      <div className="container-x py-28 sm:py-40">
        <p className="eyebrow mb-6 flex items-center gap-4" data-reveal="fade">
          <span className="tabular text-ion">06</span>
          <span aria-hidden className="h-px w-10 bg-line-strong" /> Contatti
        </p>
        <h2 id="cta-title" className="headline-xl max-w-[15ch] text-balance" data-reveal="fade">
          <span className="line-mask"><span>La prossima scelta</span></span>
          <span className="line-mask"><span style={{ ["--line-delay" as string]: "120ms" }}>parte da qui<span className="text-ion">.</span></span></span>
        </h2>

        <div className="mt-14 grid gap-4 sm:grid-cols-3" data-reveal>
          <Link href="/contatti/" className="group flex items-center justify-between gap-4 rounded-2xl border border-line-strong bg-ice p-6 text-obsidian transition-transform duration-500 hover:-translate-y-1">
            <span>
              <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-obsidian/60">Modulo</span>
              <span className="mt-1 block font-display text-xl">Richiedi informazioni</span>
            </span>
            <ArrowRight size={20} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <TrackedLink
            href={whatsappUrl("Buongiorno Alfano Cars, vorrei ricevere informazioni.")}
            event="whatsapp_click"
            eventParams={{ location: "final_cta" }}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-line-strong bg-obsidian/50 p-6 backdrop-blur transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-ion"
          >
            <span>
              <span className="eyebrow block text-[0.62rem]">WhatsApp</span>
              <span className="mt-1 block font-display text-xl">Contatta Alfano Cars</span>
            </span>
            <WhatsApp size={22} />
          </TrackedLink>
          <TrackedLink
            href={mapsDirectionsUrl}
            event="contact_click"
            eventParams={{ type: "directions", location: "final_cta" }}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-line-strong bg-obsidian/50 p-6 backdrop-blur transition-[transform,border-color] duration-500 hover:-translate-y-1 hover:border-ion"
          >
            <span>
              <span className="eyebrow block text-[0.62rem]">Sede</span>
              <span className="mt-1 block font-display text-xl">Vieni a trovarci</span>
            </span>
            <ArrowUpRight size={20} />
          </TrackedLink>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-12" data-reveal>
          <MapEmbed className="aspect-[4/3] sm:aspect-[16/9] lg:col-span-8 lg:aspect-auto lg:min-h-[22rem]" />
          <div className="space-y-8 rounded-2xl border border-line bg-obsidian/60 p-7 backdrop-blur lg:col-span-4">
            <div>
              <p className="eyebrow flex items-center gap-2"><Pin size={14} /> Indirizzo</p>
              <p className="mt-3 text-ice/90">{fullAddress}</p>
            </div>
            <div>
              <p className="eyebrow flex items-center gap-2"><Clock size={14} /> Orari</p>
              <dl className="mt-3 space-y-2 text-sm">
                {business.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4">
                    <dt className="text-silver">{h.days}</dt>
                    <dd className="text-right tabular">{h.slots.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
