import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { cinemaCredits } from "@/config/cinema";

export const metadata: Metadata = {
  title: "Crediti immagini",
  description: "Fonti e licenze delle immagini d'atmosfera utilizzate sul sito Alfano Cars.",
  alternates: { canonical: "/crediti-immagini/" },
  robots: { index: false, follow: true },
};

export default function CreditsPage() {
  return (
    <>
      <PageHero
        eyebrow="Crediti"
        lines={["Crediti immagini"]}
        intro="Il sito usa due tipi di fotografie: le foto reali della sede e delle vetture di Alfano Cars, e alcune immagini d'atmosfera per le scene cinematografiche. Le immagini d'atmosfera non raffigurano vetture in vendita: per lo stock disponibile fanno fede esclusivamente le schede del catalogo."
        crumbs={[{ href: "/", label: "Home" }, { label: "Crediti immagini" }]}
      />
      <section className="container-x py-16 sm:py-24">
        <h2 className="eyebrow mb-8">Immagini d&apos;atmosfera — Unsplash (Unsplash License)</h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cinemaCredits.map((c) => (
            <li key={c.src} className="overflow-hidden rounded-2xl border border-line bg-graphite/50">
              <div className="relative aspect-[16/10]">
                <Image src={c.src} alt={c.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
              </div>
              <div className="p-5 text-sm">
                <p className="text-ice/90">{c.alt}</p>
                <a href={c.source} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-silver underline underline-offset-4 hover:text-ice">
                  Fonte originale
                </a>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-silver">
          Le immagini sono state ritagliate e sottoposte a color grading per uniformarle alla direzione artistica del sito. La Unsplash License
          consente l&apos;uso gratuito, anche commerciale, senza obbligo di attribuzione; i crediti sono riportati per trasparenza. Le fotografie
          della sede, del piazzale e dei dettagli delle vetture sono di proprietà di Alfano Cars.
        </p>
      </section>
    </>
  );
}
