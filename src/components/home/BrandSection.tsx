import Image from "next/image";
import Link from "next/link";
import { business, mapsSearchUrl } from "@/config/site";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/Section";
import { TrackedLink } from "@/components/ui/TrackedLink";

const values = [
  { k: "Serietà", t: "Informazioni chiare e trasparenti, dalla prima richiesta alla consegna." },
  { k: "Professionalità", t: "Un team di esperti che ti aiuta a scegliere il veicolo più adatto a te." },
  { k: "Umiltà", t: "Ascoltiamo le tue esigenze personali ed economiche prima di proporre." },
];

export function BrandSection() {
  return (
    <section aria-labelledby="brand-title" className="relative overflow-hidden border-t border-line bg-graphite/40 py-24 sm:py-36">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading id="brand-title" index="05" eyebrow="Chi siamo" lines={["Dal 1985,", "a Pompei."]} />
          <p className="mt-8 max-w-md leading-relaxed text-ice/75" data-reveal>
            Serietà, professionalità e umiltà contraddistinguono da sempre Alfano Cars, realtà specializzata in vendita e
            noleggio auto a Pompei. Un rapporto qualità-prezzo curato, nella consapevolezza di poter soddisfare le esigenze
            personali e finanziarie di chi sceglie di affidarsi a noi.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line" data-reveal>
            <div className="bg-obsidian p-5">
              <dt className="eyebrow text-[0.6rem]">Dal</dt>
              <dd className="mt-2 font-display text-3xl tabular">{business.since}</dd>
            </div>
            <div className="bg-obsidian p-5">
              <dt className="eyebrow text-[0.6rem]">Sede</dt>
              <dd className="mt-2 font-display text-3xl">Pompei</dd>
            </div>
            <div className="col-span-2 bg-obsidian p-5">
              <dt className="eyebrow text-[0.6rem]">Attività</dt>
              <dd className="mt-2 text-sm text-ice/85">Vendita · Noleggio · Con conducente · Eventi · Furgoni · Due ruote · Mare</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-3" data-reveal="fade">
            <Link href="/chi-siamo/" className="btn btn-ghost btn-sm">
              La nostra storia <ArrowRight size={14} className="btn-arrow" />
            </Link>
            <TrackedLink href={mapsSearchUrl} event="contact_click" eventParams={{ type: "google_reviews" }} className="btn btn-ghost btn-sm">
              Recensioni su Google <ArrowUpRight size={14} />
            </TrackedLink>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <div className="grid grid-cols-6 gap-4">
            <figure className="relative col-span-6 aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-line sm:col-span-4" data-reveal="mask">
              <div data-parallax style={{ ["--parallax-range" as string]: "40px" }} className="absolute inset-0">
                <Image src="/images/showroom/lounge-graded.jpg" alt="Showroom Alfano Cars con area d'attesa" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </figure>
            <figure className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[1.25rem] border border-line sm:col-span-2 sm:mt-24" data-reveal="mask" style={{ ["--reveal-delay" as string]: "150ms" }}>
              <Image src="/images/showroom/desk.jpg" alt="Postazione di accoglienza nello showroom" fill sizes="(min-width: 640px) 20vw, 50vw" className="object-cover brightness-[.82]" />
            </figure>
            <figure className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[1.25rem] border border-line sm:col-span-2 sm:-mt-20" data-reveal="mask" style={{ ["--reveal-delay" as string]: "250ms" }}>
              <Image src="/images/details/key-handover-2.jpg" alt="Consegna delle chiavi di una Jeep" fill sizes="(min-width: 640px) 20vw, 50vw" className="object-cover brightness-[.82]" />
            </figure>
            <figure className="relative col-span-6 aspect-[16/9] overflow-hidden rounded-[1.25rem] border border-line sm:col-span-4" data-reveal="mask" style={{ ["--reveal-delay" as string]: "300ms" }}>
              <Image src="/images/showroom/entrance-graded.jpg" alt="Ingresso e piazzale della sede Alfano Cars" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </figure>
          </div>
        </div>
      </div>

      <div className="container-x mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        {values.map((v, i) => (
          <div key={v.k} className="bg-obsidian p-7 sm:p-9" data-reveal style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
            <p className="tabular text-xs text-ion">0{i + 1}</p>
            <h3 className="mt-4 font-display text-2xl tracking-tight">{v.k}</h3>
            <p className="mt-3 text-sm leading-relaxed text-silver">{v.t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
