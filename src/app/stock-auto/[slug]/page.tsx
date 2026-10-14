import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact/ContactForm";
import { ArrowRight, Bolt, Calendar, Fuel, Gauge, Gearbox, Phone, WhatsApp } from "@/components/ui/Icons";
import { Breadcrumbs, JsonLd } from "@/components/ui/Section";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Gallery } from "@/components/vehicles/Gallery";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleContactBar } from "@/components/vehicles/VehicleContactBar";
import { siteUrl, telUrl, whatsappUrl } from "@/config/site";
import { formatKm, formatNumber, formatPower, formatPrice } from "@/lib/format";
import { breadcrumbJsonLd, vehicleJsonLd } from "@/lib/seo";
import { vehicleFullTitle } from "@/lib/vehicles/schema";
import { getInventory, getVehicleBySlug, relatedVehicles } from "@/lib/vehicles/source";

export const revalidate = 600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { vehicles } = await getInventory();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicleBySlug(slug);
  if (!v) return { title: "Vettura non trovata", robots: { index: false } };
  const title = vehicleFullTitle(v);
  const facts = [v.year, formatKm(v.mileageKm), v.fuel, v.transmission].filter(Boolean).join(" · ");
  const description = `${title}${facts ? ` — ${facts}` : ""}. ${formatPrice(v.price)}. Disponibile presso Alfano Cars, Pompei.`;
  const path = `/stock-auto/${v.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Alfano Cars`,
      description,
      url: path,
      images: v.images[0] ? [{ url: v.images[0].src, alt: v.images[0].alt || title }] : undefined,
    },
  };
}

export default async function VehiclePage({ params }: Props) {
  const { slug } = await params;
  const [v, { vehicles }] = await Promise.all([getVehicleBySlug(slug), getInventory()]);
  if (!v) notFound();

  const title = vehicleFullTitle(v);
  const url = `${siteUrl}/stock-auto/${v.slug}/`;
  const price = formatPrice(v.price);
  const related = relatedVehicles(vehicles, v);
  const waMessage = `Buongiorno Alfano Cars, sono interessato/a a: ${title} (${price}).\n${url}`;

  const keyFacts = [
    { icon: Calendar, label: "Anno", value: v.registration ?? (v.year ? String(v.year) : undefined) },
    { icon: Gauge, label: "Chilometri", value: formatKm(v.mileageKm) },
    { icon: Fuel, label: "Alimentazione", value: v.fuel },
    { icon: Gearbox, label: "Cambio", value: v.transmission },
    { icon: Bolt, label: "Potenza", value: formatPower(v.powerKw, v.powerHp) },
  ].filter((f) => f.value);

  const specs = [
    ["Marca", v.make],
    ["Modello", v.model],
    ["Versione", v.version],
    ["Immatricolazione", v.registration ?? (v.year ? String(v.year) : undefined)],
    ["Chilometraggio", formatKm(v.mileageKm)],
    ["Alimentazione", v.fuel],
    ["Cambio", v.transmission],
    ["Potenza", formatPower(v.powerKw, v.powerHp)],
    ["Cilindrata", v.displacementCc ? `${formatNumber(v.displacementCc)} cm³` : undefined],
    ["Carrozzeria", v.bodyType],
    ["Colore", v.color],
    ["Porte", v.doors?.toString()],
    ["Posti", v.seats?.toString()],
    ["Classe emissioni", v.emissionClass],
    ["Proprietari precedenti", v.owners?.toString()],
  ].filter(([, val]) => val) as [string, string][];

  return (
    <>
      <JsonLd data={vehicleJsonLd(v)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Stock auto", path: "/stock-auto/" },
          { name: title, path: `/stock-auto/${v.slug}/` },
        ])}
      />

      <div className="container-x pt-[calc(var(--header-h)+2rem)]">
        <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/stock-auto/", label: "Stock auto" }, { label: `${v.make} ${v.model}` }]} />
      </div>

      <section className="container-x grid grid-cols-1 gap-10 py-8 lg:grid-cols-12 lg:gap-12 lg:py-12">
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          <Gallery images={v.images} title={title} />
        </div>

        <aside className="min-w-0 lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <p className="eyebrow">{v.make}</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl text-balance">
              {v.model}
              {v.version && <span className="mt-2 block text-xl text-silver sm:text-2xl">{v.version}</span>}
            </h1>

            <div className="mt-8 flex items-end justify-between gap-4 border-y border-line py-6">
              <div>
                <p className="eyebrow text-[0.6rem]">Prezzo</p>
                <p className="mt-2 font-display text-4xl tabular tracking-tight">{price}</p>
                {v.priceNote && <p className="mt-1 text-xs text-silver">{v.priceNote}</p>}
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] ${
                  v.status === "disponibile" ? "border-ion/40 text-ion" : "border-line-strong text-silver"
                }`}
              >
                {v.status === "disponibile" ? "Disponibile" : "Riservata"}
              </span>
            </div>

            {keyFacts.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {keyFacts.map((f) => (
                  <div key={f.label} className="bg-obsidian p-4 last:odd:col-span-2">
                    <dt className="flex items-center gap-2 text-xs text-silver">
                      <f.icon size={14} /> {f.label}
                    </dt>
                    <dd className="mt-1.5 text-sm tabular">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 flex flex-col gap-3">
              <TrackedLink href={whatsappUrl(waMessage)} event="whatsapp_click" eventParams={{ location: "vehicle_panel", vehicle: title }} className="btn btn-primary w-full">
                <WhatsApp size={18} /> Chiedi su WhatsApp
              </TrackedLink>
              <div className="grid grid-cols-2 gap-3">
                <a href="#richiesta" className="btn btn-ghost btn-sm min-h-[3.25rem]">
                  Richiedi info
                </a>
                <TrackedLink href={telUrl()} event="phone_click" eventParams={{ location: "vehicle_panel", vehicle: title }} className="btn btn-ghost btn-sm min-h-[3.25rem]">
                  <Phone size={16} /> Chiama
                </TrackedLink>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-silver">
              Dati forniti dalla concessionaria{v.updatedAt ? `, aggiornati al ${new Date(v.updatedAt).toLocaleDateString("it-IT")}` : ""}. Disponibilità e
              condizioni da confermare al momento del contatto.
            </p>
          </div>
        </aside>
      </section>

      <section className="container-x grid grid-cols-1 gap-12 border-t border-line py-16 lg:grid-cols-12 lg:py-24">
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          {v.description && (
            <div data-reveal>
              <h2 className="eyebrow mb-5">Descrizione</h2>
              <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-ice/85">
                {v.description.split(/\n{2,}/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {v.features && v.features.length > 0 && (
            <div className="mt-14" data-reveal>
              <h2 className="eyebrow mb-5">Dotazioni</h2>
              <ul className="grid gap-x-8 gap-y-3 text-sm text-ice/85 sm:grid-cols-2">
                {v.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 border-b border-line pb-3">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ion" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={v.description || v.features?.length ? "mt-14" : ""} data-reveal>
            <h2 className="eyebrow mb-5">Specifiche tecniche</h2>
            <dl className="divide-y divide-line border-y border-line">
              {specs.map(([k, val]) => (
                <div key={k} className="grid grid-cols-2 gap-4 py-3.5 text-sm">
                  <dt className="text-silver">{k}</dt>
                  <dd className="tabular">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div id="richiesta" className="scroll-mt-28 lg:col-span-5 xl:col-span-4">
          <div className="rounded-[1.25rem] border border-line bg-graphite/50 p-6 sm:p-8" data-reveal>
            <h2 className="font-display text-2xl tracking-tight">Richiedi informazioni</h2>
            <p className="mt-2 mb-6 text-sm text-silver">Ti rispondiamo negli orari di apertura.</p>
            <ContactForm vehicle={title} vehicleUrl={url} compact />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="correlate" className="border-t border-line py-16 sm:py-24">
          <div className="container-x">
            <div className="flex items-end justify-between gap-6">
              <h2 id="correlate" className="headline-md">Potrebbero interessarti</h2>
              <Link href="/stock-auto/" className="btn btn-ghost btn-sm hidden sm:inline-flex">
                Tutto lo stock <ArrowRight size={14} className="btn-arrow" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((r, i) => (
                <li key={r.id}>
                  <VehicleCard vehicle={r} delay={i * 100} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <VehicleContactBar title={title} price={price} url={url} slug={v.slug} />
    </>
  );
}
