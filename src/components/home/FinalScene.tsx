"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import logo from "../../../public/images/brand/logo-white.png";
import { cinema } from "@/config/cinema";
import { whatsappUrl } from "@/config/site";
import { loadGsap, reducedMotion, scheduleRefresh, whenNear } from "@/lib/motion";
import { ArrowRight, WhatsApp } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";

/**
 * SCENA FINALE — l'auto si allontana, la scena si oscura,
 * compaiono il logo e il claim; poi gli inviti all'azione.
 * Senza JavaScript il blocco logo/claim/CTA è visibile da subito.
 */
export function FinalScene() {
  const section = useRef<HTMLElement>(null);
  const car = useRef<HTMLDivElement>(null);
  const dark = useRef<HTMLDivElement>(null);
  const brand = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    let cancelled = false;
    let revert = () => {};
    const target = section.current;
    let stopNear = () => {};
    if (target)
      stopNear = whenNear(target, () =>
        loadGsap().then(({ gsap }) => {
        const el = section.current;
        if (cancelled || !el) return;
        const ctx = gsap.context(() => {
          const logoEl = el.querySelector("[data-final-logo]");
          const words = el.querySelectorAll("[data-final-word]");
          const ctas = el.querySelectorAll("[data-final-cta]");
          gsap.set(dark.current, { opacity: 0 });
          gsap.set(logoEl, { autoAlpha: 0, scale: 1.25, filter: "blur(16px)" });
          gsap.set(words, { autoAlpha: 0, yPercent: 60, rotationX: -60 });
          gsap.set(ctas, { autoAlpha: 0, y: 30 });
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: el, start: "top top", end: "+=220%", pin: true, scrub: 0.8 },
            })
            .fromTo(car.current, { scale: 1.05, yPercent: 0 }, { scale: 0.22, yPercent: -12, duration: 5, ease: "power2.in" }, 0)
            .to(dark.current, { opacity: 1, duration: 2 }, 3.4)
            .to(logoEl, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.6, ease: "power2.out" }, 5)
            .to(words, { autoAlpha: 1, yPercent: 0, rotationX: 0, stagger: 0.25, duration: 1.2, ease: "power3.out" }, 5.6)
            .to(ctas, { autoAlpha: 1, y: 0, stagger: 0.15, duration: 1 }, 6.6)
            .to({}, { duration: 1 }, 7.6);
        }, el);
        revert = () => ctx.revert();
      }).then(scheduleRefresh),
      );
    return () => {
      cancelled = true;
      stopNear();
      revert();
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="final-title" className="relative h-[100svh] min-h-[34rem] overflow-hidden bg-black">
      {/* maschera radiale: allontanandosi, l'auto si dissolve nel buio senza bordi visibili */}
      <div ref={car} className="absolute inset-0 origin-[50%_55%] [-webkit-mask-image:radial-gradient(ellipse_70%_65%_at_50%_52%,#000_40%,transparent_100%)] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_52%,#000_40%,transparent_100%)]">
        <picture>
          {cinema.fogMountain.portrait && <source media="(max-width: 767px)" srcSet={cinema.fogMountain.portrait} />}
          <Image src={cinema.fogMountain.src} alt={cinema.fogMountain.alt} fill sizes="100vw" className="object-cover object-[50%_55%]" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>
      <div ref={dark} className="absolute inset-0 bg-black opacity-60" />

      <div ref={brand} className="container-x relative flex h-full flex-col items-center justify-center text-center [perspective:900px]">
        <Image data-final-logo src={logo} alt="Alfano Cars" sizes="(min-width: 768px) 320px, 200px" className="h-auto w-[200px] md:w-[320px]" />
        <h2 id="final-title" className="mt-8 font-display text-[clamp(2.6rem,9vw,8.5rem)] font-medium uppercase leading-[0.9] tracking-[-0.045em]">
          <span data-final-word className="inline-block">Beyond</span> <span data-final-word className="inline-block">the</span>{" "}
          <span data-final-word className="inline-block">
            drive<span className="text-ion">.</span>
          </span>
        </h2>
        <div className="mt-10 flex w-full flex-col justify-center gap-3 xs:w-auto xs:flex-row">
          <Link data-final-cta href="/stock-auto/" className="btn btn-primary btn-glow" data-magnetic>
            Scopri le vetture <ArrowRight size={16} className="btn-arrow" />
          </Link>
          <TrackedLink
            data-final-cta
            href={whatsappUrl("Buongiorno Alfano Cars, vorrei ricevere informazioni.")}
            event="whatsapp_click"
            eventParams={{ location: "final_scene" }}
            className="btn btn-ghost"
            data-magnetic
          >
            <WhatsApp size={16} /> Contatta Alfano Cars
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
