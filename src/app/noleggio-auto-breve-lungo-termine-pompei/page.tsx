import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsApp } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/ui/Section";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { whatsappUrl } from "@/config/site";
import { breadcrumbJsonLd } from "@/lib/seo";

// URL storico già indicizzato: mantenuto identico
export const metadata: Metadata = {
  title: "Noleggio auto a breve e lungo termine a Pompei",
  description:
    "Noleggio auto a breve e lungo termine a Pompei con Alfano Cars: dalla city car all'auto di prestigio, per poche ore, un weekend o periodi prolungati. Richiedi un preventivo.",
  alternates: { canonical: "/noleggio-auto-breve-lungo-termine-pompei/" },
  openGraph: { title: "Noleggio auto a breve e lungo termine a Pompei | Alfano Cars", url: "/noleggio-auto-breve-lungo-termine-pompei/" },
};

const blocks = [
  {
    id: "lungo-termine",
    k: "Lungo termine",
    title: "Noleggio auto a lungo termine a Pompei",
    image: { src: "/images/fleet/renegade-2.jpg", alt: "Jeep Renegade disponibile per il noleggio" },
    text: [
      "Il noleggio a lungo termine è la scelta per chi cerca comodità, flessibilità e soluzioni personalizzate: un'auto per un periodo prolungato, senza l'onere della proprietà.",
      "Dalle utilitarie alle auto di prestigio, per lavoro, vacanze o trasferte. Il nostro team ti aiuta a scegliere il veicolo più adatto e a definire modalità e durata del contratto.",
    ],
  },
  {
    id: "breve-termine",
    k: "Breve termine",
    title: "Noleggio auto a breve termine a Pompei",
    image: { src: "/images/fleet/stelvio-side.jpg", alt: "Alfa Romeo Stelvio con cartello noleggio" },
    text: [
      "Una soluzione rapida per esplorare la città, visitare i siti storici o affrontare un impegno di lavoro: puoi noleggiare una vettura per poche ore, una giornata intera o un weekend.",
      "Una gamma che va dalle city car alle auto di lusso. Contattaci per conoscere disponibilità e tariffe e prenotare la tua auto.",
    ],
  },
];

export default function RentalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Servizi", path: "/servizi/" },
          { name: "Noleggio auto", path: "/noleggio-auto-breve-lungo-termine-pompei/" },
        ])}
      />
      <PageHero
        eyebrow="Noleggio auto"
        lines={["Noleggio a breve", "e lungo termine."]}
        intro="Che tu abbia bisogno di un'auto per un breve soggiorno o per un periodo più lungo, Alfano Cars ti propone l'opzione giusta, senza stress né imprevisti."
        image={{ src: "/images/showroom/rental-sign.jpg", alt: "Cartello Noleggio su una vettura Alfano Cars" }}
        crumbs={[{ href: "/", label: "Home" }, { href: "/servizi/", label: "Servizi" }, { label: "Noleggio auto" }]}
      >
        <TrackedLink
          href={whatsappUrl("Buongiorno Alfano Cars, vorrei un preventivo per un noleggio auto.")}
          event="whatsapp_click"
          eventParams={{ location: "rental_hero" }}
          className="btn btn-primary"
        >
          <WhatsApp size={18} /> Richiedi un preventivo
        </TrackedLink>
      </PageHero>

      {blocks.map((b, i) => (
        <section key={b.id} id={b.id} aria-labelledby={`${b.id}-t`} className="container-x border-b border-line py-20 sm:py-28">
          <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-line" data-reveal="mask">
              <Image src={b.image.src} alt={b.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover brightness-[.85]" />
            </figure>
            <div>
              <p className="eyebrow" data-reveal="fade">{b.k}</p>
              <h2 id={`${b.id}-t`} className="headline-md mt-5 text-balance" data-reveal>
                {b.title}
              </h2>
              {b.text.map((t) => (
                <p key={t} className="mt-5 max-w-lg leading-relaxed text-ice/75" data-reveal>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="container-x py-20 sm:py-28">
        <div className="mx-auto max-w-3xl rounded-[1.25rem] border border-line bg-graphite/50 p-6 sm:p-10">
          <h2 className="font-display text-3xl tracking-tight">Richiedi un preventivo</h2>
          <p className="mb-8 mt-2 text-sm text-silver">Indica durata e tipo di vettura: ti ricontattiamo con una proposta.</p>
          <ContactForm defaultTopic="Noleggio auto" />
        </div>
      </section>
    </>
  );
}
