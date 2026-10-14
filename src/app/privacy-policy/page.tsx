import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Prose } from "@/components/ui/Prose";
import { business, fullAddress } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Informativa sul trattamento dei dati personali degli utenti del sito Alfano Cars (Reg. UE 2016/679).",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPage() {
  const phones = business.phones.filter((p) => p.whatsapp).map((p) => p.display).join(" e ");
  return (
    <>
      <PageHero eyebrow="Informativa" lines={["Privacy policy"]} crumbs={[{ href: "/", label: "Home" }, { label: "Privacy policy" }]} />
      <section className="container-x py-16 sm:py-24">
        <Prose>
          <p>
            Informativa ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (&quot;GDPR&quot;) e del D.Lgs. 196/2003 come
            modificato dal D.Lgs. 101/2018, relativa ai dati personali trattati tramite il sito alfanocars.it.
          </p>

          <h2>Titolare del trattamento</h2>
          <p>
            <strong>{business.legalName}</strong> — P.IVA {business.vatId}
            <br />
            {fullAddress}
            <br />
            Telefono: {phones} — Email: <a href={`mailto:${business.email}`}>{business.email}</a> — PEC: {business.pec}
          </p>

          <h2>Dati trattati e finalità</h2>
          <h3>Richieste di contatto</h3>
          <p>
            Tramite il modulo di contatto raccogliamo nome, telefono e/o email, l&apos;eventuale veicolo di interesse e il
            contenuto del messaggio, al solo fine di rispondere alla tua richiesta e, se lo desideri, formulare un preventivo.
            Base giuridica: esecuzione di misure precontrattuali adottate su tua richiesta (art. 6.1.b GDPR).
          </p>
          <h3>WhatsApp, telefono ed email</h3>
          <p>
            I pulsanti WhatsApp, telefono ed email aprono le rispettive applicazioni del tuo dispositivo. I dati che ci invii
            tramite questi canali sono trattati per rispondere alla tua richiesta. WhatsApp è un servizio di WhatsApp Ireland
            Ltd., soggetto alla propria informativa.
          </p>
          <h3>Dati di navigazione</h3>
          <p>
            I sistemi informatici che gestiscono il sito acquisiscono, nel normale esercizio, alcuni dati tecnici (ad esempio
            indirizzo IP, data e ora della richiesta, pagina visitata), utilizzati per garantire la sicurezza e il corretto
            funzionamento del sito e per prevenire abusi del modulo di contatto. Base giuridica: legittimo interesse (art. 6.1.f
            GDPR).
          </p>
          <h3>Statistiche</h3>
          <p>
            Eventuali strumenti di statistica di terze parti sono attivati esclusivamente previo consenso, come descritto nella{" "}
            <Link href="/cookie-policy/">cookie policy</Link>.
          </p>

          <h2>Modalità e conservazione</h2>
          <p>
            Il trattamento avviene con strumenti informatici e misure di sicurezza adeguate. I dati delle richieste di contatto
            sono conservati per il tempo necessario a gestirle e, in caso di rapporto contrattuale, per la durata prevista dalla
            legge. I dati tecnici di navigazione sono conservati per il tempo strettamente necessario alle finalità di sicurezza.
          </p>

          <h2>Destinatari</h2>
          <p>
            I dati possono essere trattati da fornitori che erogano servizi tecnici al Titolare (hosting, invio email),
            nominati ove necessario responsabili del trattamento. I dati non sono diffusi né ceduti a terzi per finalità di
            marketing.
          </p>

          <h2>Diritti dell&apos;interessato</h2>
          <p>
            Puoi esercitare in qualsiasi momento i diritti di cui agli artt. 15-22 GDPR (accesso, rettifica, cancellazione,
            limitazione, portabilità, opposizione) e revocare il consenso eventualmente prestato scrivendo a{" "}
            <a href={`mailto:${business.email}`}>{business.email}</a>. Hai inoltre diritto di proporre reclamo al Garante per la
            protezione dei dati personali (www.garanteprivacy.it).
          </p>
        </Prose>
      </section>
    </>
  );
}
