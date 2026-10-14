import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, WhatsApp } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/ui/Section";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { services } from "@/config/services";
import { whatsappUrl } from "@/config/site";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Servizi — Vendita, noleggio, conducente, eventi",
  description:
    "Vendita auto, noleggio a breve e lungo termine, noleggio con conducente, auto per matrimoni, furgoni, moto ed e-bike, tour in barca: i servizi di Alfano Cars a Pompei.",
  alternates: { canonical: "/servizi/" },
  openGraph: { title: "Servizi | Alfano Cars", url: "/servizi/" },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Servizi", path: "/servizi/" }])} />
      <PageHero
        eyebrow="Servizi"
        lines={["Mobilità,", "su misura."]}
        intro="Alfano Cars è un nuovo concept per la vendita e il noleggio di auto, motocicli ed e-bike, con servizi dedicati anche agli eventi e al mare. Ecco cosa possiamo fare per te."
        image={{ src: "/images/showroom/rental-sign.jpg", alt: "Cartello Noleggio Alfano Cars" }}
        crumbs={[{ href: "/", label: "Home" }, { label: "Servizi" }]}
      />

      <nav aria-label="Indice dei servizi" className="sticky top-[var(--header-h)] z-20 border-b border-line bg-obsidian/85 backdrop-blur-xl">
        <ul className="container-x no-scrollbar flex gap-6 overflow-x-auto py-4 text-xs uppercase tracking-[0.18em] text-silver">
          {services.map((s) => (
            <li key={s.slug} className="shrink-0">
              <a href={`#${s.slug}`} className="link-line hover:text-ice">
                {s.kicker}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="divide-y divide-line">
        {services.map((s, i) => (
          <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-t`} className="container-x scroll-mt-36 py-20 sm:py-28">
            <div className={`grid items-center gap-10 lg:grid-cols-12 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <figure className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-line lg:col-span-6" data-reveal="mask">
                <div data-parallax style={{ ["--parallax-range" as string]: "36px" }} className="absolute inset-0">
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover brightness-[.82]" />
                </div>
              </figure>
              <div className="lg:col-span-6">
                <p className="eyebrow flex items-center gap-4" data-reveal="fade">
                  <span className="tabular text-ion">{s.index}</span>
                  <span aria-hidden className="h-px w-10 bg-line-strong" /> {s.kicker}
                </p>
                <h2 id={`${s.slug}-t`} className="headline-md mt-6 text-balance" data-reveal>
                  {s.title}
                </h2>
                <p className="mt-6 max-w-lg leading-relaxed text-ice/75" data-reveal>
                  {s.summary}
                </p>
                <ul className="mt-8 space-y-3" data-reveal>
                  {s.details.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-sm text-ice/85">
                      <span aria-hidden className="h-px w-5 bg-ion" /> {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap gap-3" data-reveal="fade">
                  <TrackedLink
                    href={whatsappUrl(`Buongiorno Alfano Cars, vorrei informazioni sul servizio: ${s.title}.`)}
                    event="whatsapp_click"
                    eventParams={{ location: "services", service: s.slug }}
                    className="btn btn-primary btn-sm"
                  >
                    <WhatsApp size={16} /> Chiedi informazioni
                  </TrackedLink>
                  {s.href && s.href !== "/servizi/" && (
                    <Link href={s.href} className="btn btn-ghost btn-sm">
                      Approfondisci <ArrowRight size={14} className="btn-arrow" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-line bg-graphite/40">
        <div className="container-x flex flex-col items-start justify-between gap-8 py-20 md:flex-row md:items-center">
          <h2 className="headline-md max-w-[18ch] text-balance" data-reveal>
            Non trovi quello che cerchi? Parliamone.
          </h2>
          <Link href="/contatti/" className="btn btn-primary" data-reveal="fade">
            Contattaci <ArrowRight size={16} className="btn-arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}
