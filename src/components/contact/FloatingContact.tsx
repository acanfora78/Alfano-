"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappUrl } from "@/config/site";
import { WhatsApp } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";

/**
 * Pulsante WhatsApp persistente e discreto. Compare dopo il primo scroll,
 * non viene mostrato nelle schede vettura (che hanno la propria barra contatti)
 * né nella pagina contatti.
 */
export function FloatingContact() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hidden = /^\/stock-auto\/[^/]+\/?$/.test(pathname) || pathname.startsWith("/contatti");
  if (hidden) return null;

  return (
    <TrackedLink
      href={whatsappUrl("Buongiorno Alfano Cars, vorrei ricevere informazioni.")}
      event="whatsapp_click"
      eventParams={{ location: "floating" }}
      aria-label="Scrivici su WhatsApp"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-line-strong bg-graphite/85 text-ice shadow-[0_18px_50px_-15px_rgba(0,0,0,.8)] backdrop-blur-xl transition-[opacity,transform,border-color] duration-700 hover:border-ion hover:text-ion sm:right-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <WhatsApp size={24} />
    </TrackedLink>
  );
}
