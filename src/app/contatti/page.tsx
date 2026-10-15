import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ArrowUpRight, Clock, Mail, Phone, Pin, WhatsApp } from "@/components/ui/Icons";
import { MapEmbed } from "@/components/ui/MapEmbed";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/ui/Section";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { business, fullAddress, mapsDirectionsUrl, telUrl, whatsappUrl } from "@/config/site";
import { breadcrumbJsonLd, dealerJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contatti — Richiedi informazioni",
  description: `Contatta Alfano Cars a Pompei: WhatsApp, telefono, email o modulo di richiesta. ${fullAddress}.`,
  alternates: { canonical: "/contatti/" },
  openGraph: { title: "Contatti | Alfano Cars", url: "/contatti/" },
};

export default function ContactPage() {
  const whatsapp = business.phones.filter((p) => p.whatsapp);
  return (
    <>
      <JsonLd data={dealerJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contatti", path: "/contatti/" }])} />
      <PageHero
        eyebrow="Contatti"
        lines={["La prossima scelta", "parte da qui."]}
        intro="Scrivici, chiamaci o vieni a trovarci in sede. Ti rispondiamo negli orari di apertura."
        image={{ src: "/images/alfano/gle-coupe-sede.jpg", alt: "La sede Alfano Cars a Pompei" }}
        crumbs={[{ href: "/", label: "Home" }, { label: "Contatti" }]}
      />

      <section className="container-x grid gap-14 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-[1.25rem] border border-line bg-graphite/50 p-6 sm:p-10">
            <h2 className="font-display text-3xl tracking-tight">Richiedi informazioni</h2>
            <p className="mb-8 mt-2 text-sm text-silver">Compila il modulo: verrai ricontattato al recapito indicato.</p>
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-10 lg:col-span-5">
          <div>
            <h2 className="eyebrow flex items-center gap-2"><WhatsApp size={14} /> WhatsApp</h2>
            <ul className="mt-4 space-y-3">
              {whatsapp.map((p) => (
                <li key={p.e164}>
                  <TrackedLink
                    href={whatsappUrl("Buongiorno Alfano Cars, vorrei ricevere informazioni.", p)}
                    event="whatsapp_click"
                    eventParams={{ location: "contact_page" }}
                    className="group flex items-center justify-between rounded-2xl border border-line-strong p-5 transition-colors hover:border-ion"
                  >
                    <span>
                      <span className="block text-xs text-silver">{p.label}</span>
                      <span className="mt-1 block font-display text-2xl tabular">{p.display}</span>
                    </span>
                    <ArrowUpRight size={20} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow flex items-center gap-2"><Phone size={14} /> Telefono</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {business.phones.map((p) => (
                <li key={p.e164}>
                  <TrackedLink href={telUrl(p)} event="phone_click" eventParams={{ location: "contact_page" }} className="flex items-center justify-between py-4 hover:text-ion">
                    <span className="tabular">{p.display}</span>
                    <span className="text-xs text-silver">{p.label}</span>
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow flex items-center gap-2"><Mail size={14} /> Email</h2>
            <p className="mt-4">
              <TrackedLink href={`mailto:${business.email}`} event="contact_click" eventParams={{ type: "email" }} className="link-line">
                {business.email}
              </TrackedLink>
            </p>
            <p className="mt-2 text-sm text-silver">PEC: {business.pec}</p>
          </div>

          <div>
            <h2 className="eyebrow flex items-center gap-2"><Clock size={14} /> Orari</h2>
            <dl className="mt-4 space-y-2 text-sm">
              {business.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-line pb-2">
                  <dt className="text-silver">{h.days}</dt>
                  <dd className="tabular">{h.slots.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </section>

      <section aria-labelledby="sede" className="container-x pb-24">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 id="sede" className="eyebrow flex items-center gap-2"><Pin size={14} /> La sede</h2>
            <p className="mt-3 font-display text-2xl">{fullAddress}</p>
          </div>
          <TrackedLink href={mapsDirectionsUrl} event="contact_click" eventParams={{ type: "directions", location: "contact_page" }} className="btn btn-ghost btn-sm self-start">
            Indicazioni stradali <ArrowUpRight size={14} />
          </TrackedLink>
        </div>
        <MapEmbed className="aspect-[4/3] sm:aspect-[21/9]" />
      </section>
    </>
  );
}
