import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Prose } from "@/components/ui/Prose";
import { business } from "@/config/site";

export const metadata: Metadata = {
  title: "Cookie policy",
  description: "Informativa sull'uso di cookie e tecnologie simili sul sito Alfano Cars.",
  alternates: { canonical: "/cookie-policy/" },
};

export default function CookiePage() {
  const analytics = !!process.env.NEXT_PUBLIC_GA_ID;
  return (
    <>
      <PageHero eyebrow="Informativa" lines={["Cookie policy"]} crumbs={[{ href: "/", label: "Home" }, { label: "Cookie policy" }]} />
      <section className="container-x py-16 sm:py-24">
        <Prose>
          <p>
            Questa pagina descrive i cookie e le tecnologie simili utilizzate dal sito alfanocars.it, gestito da{" "}
            {business.legalName}. Per i dati del Titolare consulta la <Link href="/privacy-policy/">privacy policy</Link>.
          </p>

          <h2>Strumenti tecnici</h2>
          <p>
            Il sito utilizza esclusivamente strumenti tecnici necessari al funzionamento, che non richiedono consenso: ad
            esempio la memorizzazione locale della tua scelta sui cookie. Non utilizziamo cookie di profilazione pubblicitaria.
          </p>

          <h2>Contenuti di terze parti</h2>
          <p>
            La mappa di Google Maps viene caricata soltanto quando premi &quot;Mostra mappa&quot;: solo da quel momento Google può
            impostare propri cookie, secondo la sua informativa. I link a WhatsApp e Google Maps aprono servizi esterni.
          </p>

          <h2>Statistiche</h2>
          {analytics ? (
            <p>
              Con il tuo consenso utilizziamo Google Analytics 4 (Google Ireland Ltd.) con IP anonimizzato, per misurare in
              forma aggregata l&apos;utilizzo del sito. Senza consenso lo strumento non viene caricato. Puoi modificare la scelta
              in qualsiasi momento dal link &quot;Preferenze cookie&quot; nel piè di pagina.
            </p>
          ) : (
            <p>Al momento il sito non utilizza strumenti di statistica di terze parti.</p>
          )}

          <h2>Gestione dal browser</h2>
          <p>
            Puoi inoltre cancellare o bloccare i cookie dalle impostazioni del tuo browser. Il blocco dei soli strumenti tecnici
            potrebbe compromettere alcune funzionalità.
          </p>
        </Prose>
      </section>
    </>
  );
}
