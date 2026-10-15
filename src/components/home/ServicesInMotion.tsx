"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { photos, type Photo } from "@/config/photos";
import { services } from "@/config/services";
import { whatsappUrl } from "@/config/site";
import { loadGsap, reducedMotion, scheduleRefresh, whenNear } from "@/lib/motion";
import { ArrowRight, WhatsApp } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";

const svc = Object.fromEntries(services.map((s) => [s.slug, s]));

/** Fotografia verticale nitida in cornice (desktop). */
function Frame({ photo, className = "", sizes = "30vh", from = "md" }: { photo: Photo; className?: string; sizes?: string; from?: "md" | "lg" }) {
  return (
    <div
      className={`absolute hidden overflow-hidden rounded-[1.25rem] border border-line-strong shadow-[0_50px_100px_-30px_rgba(0,0,0,.95)] ${from === "lg" ? "lg:block" : "md:block"} ${className}`}
      style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
      data-cursor={photo.model}
    >
      <div data-panel-media className="absolute inset-0">
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

/** Sfondo: la stessa fotografia diffusa (desktop) e a tutto schermo nitida (mobile). */
function Backdrop({ photo, position = "50% 60%" }: { photo: Photo; position?: string }) {
  return (
    <>
      <div className="absolute inset-0 hidden md:block">
        <Image src={photo.ambient} alt="" fill sizes="100vw" className="scale-110 object-cover" />
      </div>
      <div data-panel-media className="absolute inset-0 md:hidden">
        <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
      </div>
    </>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <li className="rounded-full border border-line-strong bg-obsidian/40 px-3.5 py-1.5 text-xs text-ice/90 backdrop-blur">{children}</li>;
}

function Ask({ topic }: { topic: string }) {
  return (
    <TrackedLink
      href={whatsappUrl(`Buongiorno Alfano Cars, vorrei informazioni su: ${topic}.`)}
      event="whatsapp_click"
      eventParams={{ location: "services_motion", service: topic }}
      className="btn btn-ghost btn-sm"
    >
      <WhatsApp size={16} /> Chiedi
    </TrackedLink>
  );
}

/**
 * SEQUENZA 4 — "Services in motion".
 * Pannelli a schermo intero che si impilano (sticky): il pannello che esce arretra e si
 * scurisce mentre il successivo gli scorre sopra. Ogni servizio ha una propria regia.
 */
export function ServicesInMotion() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    let cancelled = false;
    let revert = () => {};
    const target = root.current;
    let stopNear = () => {};
    if (target)
      stopNear = whenNear(target, () =>
        loadGsap().then(({ gsap }) => {
        if (cancelled || !root.current) return;
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root.current);
        const ctx = gsap.context(() => {
          panels.forEach((panel, i) => {
            const inner = panel.querySelector<HTMLElement>("[data-panel-inner]");
            const media = panel.querySelectorAll<HTMLElement>("[data-panel-media]");
            // la camera "atterra" sull'inquadratura mentre il pannello entra
            gsap.fromTo(media, { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "top top", scrub: true } });
            const next = panels[i + 1];
            if (next && inner)
              gsap.to(inner, {
                scale: 0.86,
                yPercent: -3,
                opacity: 0.25,
                borderRadius: 28,
                ease: "none",
                scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
              });
          });
        }, root);
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
    <section aria-labelledby="services-title" className="relative bg-obsidian">
      <div className="container-x pb-16 pt-28 sm:pt-40">
        <p className="eyebrow mb-6 flex items-center gap-4" data-reveal="fade">
          <span className="tabular text-ion">03</span>
          <span aria-hidden className="h-px w-10 bg-line-strong" /> Services in motion
        </p>
        <h2 id="services-title" className="headline-xl max-w-[12ch] text-balance" data-reveal="fade">
          <span className="line-mask"><span>Mobilità,</span></span>
          <span className="line-mask"><span style={{ ["--line-delay" as string]: "120ms" }} className="text-silver">su misura.</span></span>
        </h2>
      </div>

      <div ref={root}>
        {/* 01 · VENDITA — split asimmetrico */}
        <article data-panel className="sticky top-0 h-[100svh] min-h-[36rem]" aria-labelledby="svc-vendita">
          <div data-panel-inner className="absolute inset-0 origin-top overflow-hidden bg-graphite">
            <div className="grid h-full grid-rows-[45%_55%] md:grid-cols-[42%_58%] md:grid-rows-1">
              <div className="relative order-2 flex flex-col justify-center gap-6 px-[var(--gutter)] py-10 md:order-1 md:py-0">
                <span aria-hidden className="text-outline hidden font-display text-[10vw] leading-none md:block">01</span>
                <h3 id="svc-vendita" className="headline-md">{svc.vendita.title}</h3>
                <p className="max-w-md text-ice/75">{svc.vendita.summary}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/stock-auto/" className="btn btn-primary btn-sm" data-magnetic>
                    Vai allo stock <ArrowRight size={14} className="btn-arrow" />
                  </Link>
                  <Ask topic="acquisto auto" />
                </div>
              </div>
              <div className="relative order-1 overflow-hidden md:order-2" data-cursor="Vendita">
                <div data-panel-media className="absolute inset-0">
                  <Image src={photos.gleSede.src} alt={photos.gleSede.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover object-[50%_62%]" />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* 02 · NOLEGGIO — a tutto schermo */}
        <article data-panel className="sticky top-0 h-[100svh] min-h-[36rem]" aria-labelledby="svc-noleggio">
          <div data-panel-inner className="absolute inset-0 origin-top overflow-hidden bg-obsidian">
            <Backdrop photo={photos.tRoc} />
            <Frame photo={photos.tRoc} sizes="34vh" className="right-[max(var(--gutter),5vw)] top-[12%] h-[66%] rotate-[1.5deg]" />
            <Frame photo={photos.q3Bianca} from="lg" sizes="30vh" className="right-[calc(max(var(--gutter),5vw)+40vh)] top-[24%] h-[58%] -rotate-[2deg]" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
            <div className="container-x relative flex h-full flex-col justify-end gap-6 pb-14 sm:pb-20">
              <span aria-hidden className="text-outline font-display text-[22vw] leading-none md:text-[10vw]">02</span>
              <h3 id="svc-noleggio" className="headline-lg max-w-[14ch]">Noleggio, al tuo ritmo.</h3>
              <p className="max-w-lg text-ice/80">{svc.noleggio.summary}</p>
              <ul className="flex flex-wrap gap-2">
                <Chip>Breve termine</Chip>
                <Chip>Lungo termine</Chip>
                <Chip>Furgoni</Chip>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link href="/noleggio-auto-breve-lungo-termine-pompei/" className="btn btn-primary btn-sm" data-magnetic>
                  Scopri il noleggio <ArrowRight size={14} className="btn-arrow" />
                </Link>
                <Ask topic="noleggio" />
              </div>
            </div>
          </div>
        </article>

        {/* 03 · CONDUCENTE ED EVENTI — taglio diagonale */}
        <article data-panel className="sticky top-0 h-[100svh] min-h-[36rem]" aria-labelledby="svc-eventi">
          <div data-panel-inner className="absolute inset-0 origin-top overflow-hidden bg-obsidian">
            <div className="absolute inset-0 [clip-path:polygon(0_0,62%_0,38%_100%,0_100%)]">
              <div data-panel-media className="absolute inset-0">
                <Image src={photos.q8Cerimonia.src} alt={photos.q8Cerimonia.alt} fill sizes="100vw" className="object-cover object-[45%_60%] brightness-[.85]" />
              </div>
            </div>
            <div className="absolute inset-0 [clip-path:polygon(62.4%_0,100%_0,100%_100%,38.4%_100%)]">
              <div data-panel-media className="absolute inset-0">
                <Image src={photos.sposi.src} alt={photos.sposi.alt} fill sizes="100vw" className="object-cover object-[50%_70%] brightness-[.85]" />
              </div>
            </div>
            <span aria-hidden className="absolute left-[38%] top-0 h-full w-px origin-bottom rotate-[13deg] scale-y-[1.08] bg-ion/60 shadow-[0_0_24px_2px_rgba(138,175,255,.5)] max-md:hidden" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-obsidian/20" />
            <div className="container-x relative flex h-full flex-col justify-end gap-6 pb-14 sm:pb-20">
              <span aria-hidden className="text-outline font-display text-[22vw] leading-none md:text-[10vw]">03</span>
              <h3 id="svc-eventi" className="headline-lg max-w-[16ch]">Con conducente. Per ogni evento.</h3>
              <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
                <p className="text-ice/80">{svc.conducente.summary}</p>
                <p className="text-ice/80">{svc.cerimonie.summary}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/servizi/#conducente" className="btn btn-primary btn-sm" data-magnetic>
                  Dettagli <ArrowRight size={14} className="btn-arrow" />
                </Link>
                <Ask topic="noleggio con conducente o auto per eventi" />
              </div>
            </div>
          </div>
        </article>

        {/* 04 · DUE RUOTE E MARE — card flottante */}
        <article data-panel className="sticky top-0 h-[100svh] min-h-[36rem]" aria-labelledby="svc-mare">
          <div data-panel-inner className="absolute inset-0 origin-top overflow-hidden bg-obsidian">
            <Backdrop photo={photos.tmax} position="45% 65%" />
            <Frame photo={photos.tmax} sizes="40vh" className="right-[max(var(--gutter),5vw)] top-[10%] h-[80%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/40 to-transparent" />
            <div className="container-x relative flex h-full flex-col justify-center gap-6">
              <span aria-hidden className="text-outline font-display text-[22vw] leading-none md:text-[10vw]">04</span>
              <h3 id="svc-mare" className="headline-lg max-w-[14ch]">Due ruote. E il mare.</h3>
              <p className="max-w-md text-ice/80">
                {svc.mobilita.summary} {svc.barca.summary}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/tour-barca-noleggio-imbarcazioni-pompei/" className="btn btn-primary btn-sm" data-magnetic>
                  Tour in barca <ArrowRight size={14} className="btn-arrow" />
                </Link>
                <Ask topic="moto, e-bike, quad o tour in barca" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
