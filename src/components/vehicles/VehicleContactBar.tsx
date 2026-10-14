"use client";

import { useEffect } from "react";
import { telUrl, whatsappUrl } from "@/config/site";
import { track } from "@/lib/analytics";
import { Phone, WhatsApp } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";

/** Traccia l'apertura della scheda e mostra una barra contatti sticky su mobile. */
export function VehicleContactBar({ title, price, url, slug }: { title: string; price: string; url: string; slug: string }) {
  useEffect(() => {
    track("vehicle_view", { vehicle: title, slug });
  }, [title, slug]);

  const message = `Buongiorno Alfano Cars, sono interessato/a a: ${title} (${price}).\n${url}`;

  return (
    <>
      {/* spazio per non coprire il footer */}
      <div aria-hidden className="h-20 lg:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-obsidian/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="container-x flex items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-silver">{title}</p>
            <p className="font-display text-lg tabular">{price}</p>
          </div>
          <TrackedLink href={telUrl()} event="phone_click" eventParams={{ location: "vehicle_bar", vehicle: title }} className="btn btn-ghost btn-sm h-12 w-12 !px-0" aria-label="Chiama Alfano Cars">
            <Phone size={18} />
          </TrackedLink>
          <TrackedLink href={whatsappUrl(message)} event="whatsapp_click" eventParams={{ location: "vehicle_bar", vehicle: title }} className="btn btn-primary btn-sm h-12">
            <WhatsApp size={18} /> WhatsApp
          </TrackedLink>
        </div>
      </div>
    </>
  );
}
