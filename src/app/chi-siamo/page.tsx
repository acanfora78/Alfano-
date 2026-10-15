import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd, SectionHeading } from "@/components/ui/Section";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { allPhotos } from "@/config/photos";
import { business, fullAddress, mapsSearchUrl } from "@/config/site";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chi siamo — Dal 1985 a Pompei",
  description:
    "Alfano Cars: serietà, professionalità e umiltà nella vendita e nel noleggio auto a Pompei. Scopri la nostra sede in Via Tre Ponti e il nostro approccio.",
  alternates: { canonical: "/chi-siamo/" },
  openGraph: { title: "Chi siamo | Alfano Cars", url: "/chi-siamo/" },
};


export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Chi siamo", path: "/chi-siamo/" }])} />
      <PageHero
        eyebrow="Chi siamo"
        lines={["Qualità e", "professionalità", "dal 1985."]}
        image={{ src: "/images/alfano/rsq3-sede.jpg", alt: "La sede Alfano Cars a Pompei" }}
        crumbs={[{ href: "/", label: "Home" }, { label: "Chi siamo" }]}
      />

      <section className="container-x grid gap-14 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Il nostro approccio" lines={["Serietà.", "Professionalità.", "Umiltà."]} size="md" />
        </div>
        <div className="space-y-6 text-lg leading-relaxed text-ice/80 lg:col-span-6 lg:col-start-7" data-reveal>
          <p>
            Serietà, professionalità e umiltà contraddistinguono da sempre Alfano Cars, realtà specializzata in vendita e
            noleggio auto a Pompei.
          </p>
          <p>
            Ci avvaliamo di un team di esperti in grado di aiutare i nostri clienti a trovare il veicolo più adatto alle loro
            esigenze, sia che intendano acquistarlo sia che preferiscano il noleggio, con un piano personalizzato sulle loro
            attese.
          </p>
          <p>
            Oggi Alfano Cars è un nuovo concept per la vendita e il noleggio di auto, motocicli ed e-bike, con servizi dedicati
            anche ai matrimoni, agli eventi e al mare.
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <Link href="/servizi/" className="btn btn-ghost btn-sm">
              I nostri servizi <ArrowRight size={14} className="btn-arrow" />
            </Link>
            <TrackedLink href={mapsSearchUrl} event="contact_click" eventParams={{ type: "google_reviews" }} className="btn btn-ghost btn-sm">
              Recensioni su Google <ArrowUpRight size={14} />
            </TrackedLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="galleria" className="container-x pb-24">
        <h2 id="galleria" className="eyebrow mb-8">Showroom e sede</h2>
        <ul className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {allPhotos.map((g, i) => (
            <li
              key={g.src}
              className="relative mb-3 break-inside-avoid overflow-hidden rounded-[1rem] border border-line sm:mb-4"
              style={{ aspectRatio: `${g.w} / ${g.h}`, ["--reveal-delay" as string]: `${(i % 4) * 80}ms` }}
              data-reveal="mask"
              data-cursor={g.model}
            >
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 50vw" className="object-cover" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian/80 to-transparent p-3 text-[0.6rem] uppercase tracking-[0.2em] text-ice/80">
                {g.make} {g.model}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line bg-graphite/40 py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4" data-reveal>
            <p className="eyebrow">Dati aziendali</p>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-silver">Ragione sociale</dt>
                <dd className="mt-1">{business.legalName}</dd>
              </div>
              <div>
                <dt className="text-silver">Partita IVA</dt>
                <dd className="mt-1 tabular">{business.vatId}</dd>
              </div>
              <div>
                <dt className="text-silver">Sede</dt>
                <dd className="mt-1">{fullAddress}</dd>
              </div>
              <div>
                <dt className="text-silver">PEC</dt>
                <dd className="mt-1">{business.pec}</dd>
              </div>
            </dl>
          </div>
          <MapEmbed className="aspect-[4/3] sm:aspect-[16/9] lg:col-span-8" />
        </div>
      </section>
    </>
  );
}
