"use client";

import Image from "next/image";
import { useState } from "react";
import { fullAddress, mapsDirectionsUrl, mapsEmbedUrl } from "@/config/site";
import { ArrowUpRight, Pin } from "./Icons";
import { TrackedLink } from "./TrackedLink";

/**
 * Mappa Google caricata solo su richiesta dell'utente:
 * nessun contenuto di terze parti (e relativi cookie) prima del click.
 */
export function MapEmbed({ className = "" }: { className?: string }) {
  const [load, setLoad] = useState(false);
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-line bg-graphite ${className}`}>
      {load ? (
        <iframe
          title={`Mappa: Alfano Cars, ${fullAddress}`}
          src={mapsEmbedUrl}
          className="absolute inset-0 h-full w-full grayscale-[0.85] invert-[0.92] hue-rotate-180"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <>
          <Image
            src="/images/showroom/entrance-graded.jpg"
            alt="Ingresso della sede Alfano Cars a Pompei"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="flex items-start gap-3 text-sm text-ice/90">
              <Pin size={18} className="mt-0.5 shrink-0 text-ion" />
              {fullAddress}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLoad(true)}>
                Mostra mappa
              </button>
              <TrackedLink
                href={mapsDirectionsUrl}
                event="contact_click"
                eventParams={{ type: "directions" }}
                className="btn btn-primary btn-sm"
              >
                Indicazioni <ArrowUpRight size={14} />
              </TrackedLink>
            </div>
          </div>
        </>
      )}
      {load && <p className="sr-only">La mappa è fornita da Google Maps.</p>}
    </div>
  );
}
