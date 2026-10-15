import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { Phone, WhatsApp } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/ui/Section";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { telUrl, whatsappUrl } from "@/config/site";
import { breadcrumbJsonLd } from "@/lib/seo";

// URL storico già indicizzato: mantenuto identico
export const metadata: Metadata = {
  title: "Tour in barca e noleggio imbarcazioni senza patente a Pompei",
  description:
    "Prenota un tour in barca nel Golfo di Napoli o noleggia un'imbarcazione senza patente con Alfano Cars, Pompei. Contattaci per disponibilità e prenotazioni.",
  alternates: { canonical: "/tour-barca-noleggio-imbarcazioni-pompei/" },
  openGraph: { title: "Tour in barca | Alfano Cars", url: "/tour-barca-noleggio-imbarcazioni-pompei/" },
};

export default function BoatPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Servizi", path: "/servizi/" },
          { name: "Tour in barca", path: "/tour-barca-noleggio-imbarcazioni-pompei/" },
        ])}
      />
      <PageHero
        eyebrow="Mare"
        lines={["Tour in barca,", "senza patente."]}
        intro="Regalati un viaggio nel Golfo di Napoli: prenotazione di tour in barca e noleggio di imbarcazioni senza patente, con la professionalità e la passione di Alfano Cars."
        crumbs={[{ href: "/", label: "Home" }, { href: "/servizi/", label: "Servizi" }, { label: "Tour in barca" }]}
      >
        <div className="flex flex-wrap gap-3">
          <TrackedLink
            href={whatsappUrl("Buongiorno Alfano Cars, vorrei informazioni su tour in barca / noleggio imbarcazioni.")}
            event="whatsapp_click"
            eventParams={{ location: "boat_hero" }}
            className="btn btn-primary"
          >
            <WhatsApp size={18} /> Prenota su WhatsApp
          </TrackedLink>
          <TrackedLink href={telUrl()} event="phone_click" eventParams={{ location: "boat_hero" }} className="btn btn-ghost">
            <Phone size={18} /> Chiama ora
          </TrackedLink>
        </div>
      </PageHero>

      <section className="container-x grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-12">
        <figure className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[1.25rem] border border-line lg:col-span-5" data-reveal="mask">
          <Image src="/images/alfano/rsq3-sede.jpg" alt="La sede Alfano Cars: l'insegna elenca il noleggio di auto, furgoni, moto, barche e bike" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[50%_35%]" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-obsidian p-5 text-xs uppercase tracking-[0.2em] text-silver">La sede di Pompei</figcaption>
        </figure>
        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="headline-md text-balance" data-reveal>
            Noleggio imbarcazioni senza patente a Pompei
          </h2>
          <p className="mt-6 leading-relaxed text-ice/75" data-reveal>
            Il noleggio di imbarcazioni senza patente si rivolge a chi desidera esplorare le acque del Golfo di Napoli senza
            possedere una patente nautica, in libertà e sicurezza. Il nostro team ti assiste durante tutto il periodo di
            noleggio.
          </p>
          <h2 className="headline-md mt-14 text-balance" data-reveal>
            Prenotazione tour in barca
          </h2>
          <p className="mt-6 leading-relaxed text-ice/75" data-reveal>
            Esplora la baia di Napoli e ammira le bellezze costiere, come Capri e Sorrento. Contattaci per disponibilità,
            itinerari e prenotazioni.
          </p>
        </div>
      </section>

      <section className="container-x pb-24">
        <div className="mx-auto max-w-3xl rounded-[1.25rem] border border-line bg-graphite/50 p-6 sm:p-10">
          <h2 className="font-display text-3xl tracking-tight">Richiedi informazioni</h2>
          <p className="mb-8 mt-2 text-sm text-silver">Indica data, numero di persone e tipo di esperienza.</p>
          <ContactForm defaultTopic="Tour in barca" />
        </div>
      </section>
    </>
  );
}
