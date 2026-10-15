"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import logo from "../../../public/images/brand/logo-white.png";
import { business } from "@/config/site";
import { finePointer, loadGsap, reducedMotion } from "@/lib/motion";
import { ArrowRight } from "@/components/ui/Icons";
import { AtmosphereDust } from "./AtmosphereDust";

type HeroImage = { src: string; srcSet: string; alt: string; ambient: string };

function Chars({ text, start, accentLast = false }: { text: string; start: number; accentLast?: boolean }) {
  let n = 0;
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {[...w].map((c, ci) => {
            const last = accentLast && wi === words.length - 1 && ci === w.length - 1;
            return (
              <span key={ci} className={`film-char ${last ? "text-ion" : ""}`} style={{ ["--d" as string]: `${start + n++ * 42}ms` }}>
                {c}
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

/**
 * HERO — la vettura protagonista nello showroom.
 * Desktop: fotografia nitida in una grande cornice verticale, con l'atmosfera del
 * soffitto luminoso diffusa sullo sfondo. Mobile: fotografia a tutto schermo.
 * Si apre al termine dell'intro "Ignition"; uscendo, la camera avanza e il quadro si chiude.
 */
export function HeroFilm({ image }: { image: HeroImage }) {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const ambient = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const lbTop = useRef<HTMLDivElement>(null);
  const lbBottom = useRef<HTMLDivElement>(null);

  // Cornice che si inclina verso il cursore + luce che lo segue (desktop)
  useEffect(() => {
    const el = section.current;
    const fr = frame.current;
    if (!el || !fr || reducedMotion() || !finePointer()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf || document.documentElement.classList.contains("no-motion")) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--lx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--ly", `${(py * 100).toFixed(1)}%`);
        fr.style.transform = `perspective(1400px) rotateY(${((px - 0.5) * -7).toFixed(2)}deg) rotateX(${((py - 0.5) * 5).toFixed(2)}deg)`;
      });
    };
    const reset = () => (fr.style.transform = "");
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Uscita: la camera avanza sulla vettura, il titolo sale e il letterbox si chiude
  useEffect(() => {
    if (reducedMotion()) return;
    let revert = () => {};
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled || !section.current) return;
      const ctx = gsap.context(() => {
        gsap
          .timeline({ scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: 0.6 } })
          .to(frame.current, { scale: 1.18, yPercent: 10, ease: "none" }, 0)
          .to(ambient.current, { scale: 1.3, ease: "none" }, 0)
          .to(content.current, { yPercent: -40, opacity: 0, ease: "none" }, 0)
          .to([lbTop.current, lbBottom.current], { scaleY: 1, ease: "none" }, 0);
      });
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="hero-title" className="film grain">
      {/* Atmosfera: lo showroom diffuso sullo sfondo (desktop) */}
      <div ref={ambient} aria-hidden className="absolute inset-0 hidden md:block">
        <Image src={image.ambient} alt="" fill sizes="100vw" className="film-ambient object-cover" />
        <span className="film-breathe" />
      </div>

      {/* Fotografia: a tutto schermo su mobile, in cornice su desktop */}
      <div className="absolute inset-0 md:inset-y-[calc(var(--header-h)+2vh)] md:left-auto md:right-[max(var(--gutter),6vw)] md:aspect-[1179/1560] md:h-[calc(100svh-var(--header-h)-6vh)]">
        <div ref={frame} className="film-frame relative h-full w-full overflow-hidden md:rounded-[1.5rem] md:border md:border-line-strong md:shadow-[0_60px_120px_-40px_rgba(0,0,0,.95)]" data-cursor="Showroom">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} srcSet={image.srcSet} sizes="(min-width: 768px) 46vh, 100vw" alt={image.alt} fetchPriority="high" decoding="async" className="film-pull absolute inset-0 h-full w-full object-cover" />
          <span className="film-idle-sweep" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent md:from-obsidian/50 md:via-transparent" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/40 to-transparent max-md:hidden" />
      <span className="film-cursor-light" />
      <AtmosphereDust className="absolute inset-0 h-full w-full" density={0.7} />

      <div ref={lbTop} aria-hidden className="letterbox letterbox-top" />
      <div ref={lbBottom} aria-hidden className="letterbox letterbox-bottom" />

      <div ref={content} className="container-x relative z-10 flex h-full flex-col justify-end pb-[max(2.5rem,env(safe-area-inset-bottom))] md:justify-center md:pb-0">
        <div className="max-w-[44rem]">
          <Image src={logo} alt="Alfano Cars" priority sizes="(min-width: 768px) 200px, 140px" className="film-logo h-auto w-[140px] md:w-[200px]" />
          <h1 id="hero-title" aria-label="Beyond the drive" className="mt-6 font-display text-[clamp(3.1rem,10vw,9.5rem)] font-medium uppercase leading-[0.86] tracking-[-0.045em] [perspective:900px] md:mt-10">
            <span aria-hidden className="block">
              <Chars text="Beyond" start={0} />
            </span>
            <span aria-hidden className="block">
              <Chars text="the drive." start={260} accentLast />
            </span>
          </h1>
          <p className="film-in mt-6 max-w-md text-base leading-relaxed text-ice/80 sm:text-lg" style={{ ["--d" as string]: "700ms" }}>
            Scopri una nuova prospettiva sul mondo automotive.
          </p>
          <div className="film-in mt-8 flex flex-col gap-3 xs:flex-row" style={{ ["--d" as string]: "850ms" }}>
            <Link href="/stock-auto/" className="btn btn-primary btn-glow" data-magnetic>
              Scopri le vetture <ArrowRight size={16} className="btn-arrow" />
            </Link>
            <a href="#esplora" className="btn btn-ghost" data-magnetic>
              Esplora Alfano Cars
            </a>
          </div>
          <div className="film-in mt-10 flex items-center gap-6 text-[0.62rem] uppercase tracking-[0.26em] text-silver" style={{ ["--d" as string]: "1100ms" }}>
            <a href="#esplora" className="flex items-center gap-3" aria-label="Scorri per esplorare">
              <span className="scroll-line" aria-hidden />
              Scorri
            </a>
            <span className="hidden sm:block">Pompei · dal {business.since}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
