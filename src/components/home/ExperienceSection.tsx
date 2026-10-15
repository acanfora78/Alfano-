import Image from "next/image";
import Link from "next/link";
import { photos } from "@/config/photos";
import { business, mapsSearchUrl } from "@/config/site";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ScrollWords } from "./ScrollWords";

const values = [
  { k: "Serietà", t: "Informazioni chiare e trasparenti, dalla prima richiesta alla consegna." },
  { k: "Professionalità", t: "Un team di esperti che ti aiuta a scegliere il veicolo più adatto a te." },
  { k: "Umiltà", t: "Ascoltiamo le tue esigenze personali ed economiche prima di proporre." },
];

/**
 * SEQUENZA 5 — "The Alfano Experience".
 * Editoriale con fotografie autentiche della sede che sconfinano tra le sezioni,
 * testo che si accende con lo scroll e titolo gigante in movimento.
 */
export function ExperienceSection() {
  return (
    <section aria-labelledby="experience-title" className="relative z-10 overflow-x-clip bg-obsidian pb-28 pt-32 sm:pb-40 sm:pt-44">
      {/* "Dal 1985" gigante che scorre con la pagina */}
      <p
        aria-hidden
        data-parallax
        style={{ ["--parallax-range" as string]: "-160px", ["--parallax-scale" as string]: "1" }}
        className="text-outline pointer-events-none absolute -left-[4vw] top-10 whitespace-nowrap font-display text-[28vw] font-medium leading-none tracking-[-0.06em] opacity-50"
      >
        Dal {business.since}
      </p>

      <div className="container-x relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-6 flex items-center gap-4" data-reveal="fade">
            <span className="tabular text-ion">04</span>
            <span aria-hidden className="h-px w-10 bg-line-strong" /> The Alfano experience
          </p>
          <h2 id="experience-title" className="headline-lg text-balance" data-reveal="fade">
            <span className="line-mask"><span>Qualità e professionalità</span></span>
            <span className="line-mask"><span style={{ ["--line-delay" as string]: "120ms" }} className="text-silver">dal {business.since}.</span></span>
          </h2>
          <ScrollWords
            className="mt-10 max-w-xl font-display text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.3] tracking-tight"
            text="Serietà, professionalità e umiltà contraddistinguono da sempre Alfano Cars, realtà specializzata in vendita e noleggio auto a Pompei. Un rapporto qualità-prezzo curato, nella consapevolezza di poter soddisfare le esigenze personali e finanziarie di chi sceglie di affidarsi a noi."
          />
          <div className="mt-10 flex flex-wrap gap-3" data-reveal="fade">
            <Link href="/chi-siamo/" className="btn btn-ghost btn-sm" data-magnetic>
              La nostra sede <ArrowRight size={14} className="btn-arrow" />
            </Link>
            <TrackedLink href={mapsSearchUrl} event="contact_click" eventParams={{ type: "google_reviews" }} className="btn btn-ghost btn-sm">
              Recensioni su Google <ArrowUpRight size={14} />
            </TrackedLink>
          </div>
        </div>

        {/* Composizione fotografica a più velocità, che invade le sezioni vicine */}
        <div className="relative h-[40rem] sm:h-[50rem] lg:col-span-6 lg:-mt-56">
          <figure className="absolute right-0 top-0 h-[78%] overflow-hidden rounded-[1.25rem] border border-line" style={{ aspectRatio: "1179 / 1558" }} data-reveal="mask" data-cursor="La sede">
            <div data-parallax style={{ ["--parallax-range" as string]: "40px", ["--parallax-scale" as string]: "1.12" }} className="absolute inset-0">
              <Image src={photos.rsq3Sede.src} alt={photos.rsq3Sede.alt} fill sizes="(min-width: 1024px) 30vw, 70vw" className="object-cover" />
            </div>
          </figure>
          <figure
            data-parallax
            style={{ ["--parallax-range" as string]: "-90px", ["--parallax-scale" as string]: "1", aspectRatio: "1179 / 1564" }}
            className="absolute bottom-10 left-0 h-[48%] overflow-hidden rounded-[1.25rem] border border-line-strong shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]"
          >
            <Image src={photos.smart.src} alt={photos.smart.alt} fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover" />
          </figure>
          <figure
            data-parallax
            style={{ ["--parallax-range" as string]: "-150px", ["--parallax-scale" as string]: "1", aspectRatio: "1179 / 1557" }}
            className="absolute -bottom-24 right-[14%] h-[36%] overflow-hidden rounded-[1.25rem] border border-line-strong shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]"
          >
            <Image src={photos.ghibli.src} alt={photos.ghibli.alt} fill sizes="(min-width: 1024px) 14vw, 32vw" className="object-cover" />
          </figure>
        </div>
      </div>

      <div className="container-x relative mt-36 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        {values.map((v, i) => (
          <div key={v.k} className="group bg-obsidian p-7 transition-colors duration-700 hover:bg-graphite sm:p-9" data-reveal style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
            <p className="tabular text-xs text-ion">0{i + 1}</p>
            <h3 className="mt-4 font-display text-2xl tracking-tight transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-2">{v.k}</h3>
            <p className="mt-3 text-sm leading-relaxed text-silver">{v.t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
