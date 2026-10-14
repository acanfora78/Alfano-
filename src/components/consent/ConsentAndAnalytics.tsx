"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { readConsent, writeConsent, type Consent } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Banner di consenso + caricamento GA4 solo dopo l'accettazione.
 * Se NEXT_PUBLIC_GA_ID non è impostato il componente non fa nulla:
 * il sito usa solo storage tecnico e nessun cookie di profilazione.
 */
export function ConsentAndAnalytics() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const c = readConsent();
    setConsent(c);
    setOpen(c === null);
    const reopen = () => setOpen(true);
    window.addEventListener("ac-open-consent", reopen);
    return () => window.removeEventListener("ac-open-consent", reopen);
  }, []);

  if (!GA_ID) return null;

  const choose = (c: Consent) => {
    writeConsent(c);
    setConsent(c);
    setOpen(false);
    if (c === "denied") window.gtag?.("consent", "update", { analytics_storage: "denied" });
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {open && (
        <div
          role="dialog"
          aria-labelledby="consent-title"
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-line-strong bg-graphite/95 p-5 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:p-6"
        >
          <h2 id="consent-title" className="font-display text-lg">
            Cookie e statistiche
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-silver">
            Usiamo cookie analitici di terze parti (Google Analytics) solo con il tuo consenso, per capire come migliorare il
            sito. Dettagli nella{" "}
            <Link href="/cookie-policy/" className="text-ice underline underline-offset-4">
              cookie policy
            </Link>
            .
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button type="button" className="btn btn-primary btn-sm flex-1" onClick={() => choose("granted")}>
              Accetta
            </button>
            <button type="button" className="btn btn-ghost btn-sm flex-1" onClick={() => choose("denied")}>
              Rifiuta
            </button>
          </div>
        </div>
      )}
    </>
  );
}
