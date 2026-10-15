"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import logo from "../../../public/images/brand/logo-white.png";
import { business } from "@/config/site";
import { finePointer, loadGsap, reducedMotion } from "@/lib/motion";
import { ArrowRight } from "@/components/ui/Icons";
import { AtmosphereDust } from "./AtmosphereDust";

export type FilmShot = { src: string; srcSet: string; mobileSrcSet?: string; alt: string };

const KEY = "ac-film-v3";
const FILM_MS = 6700;
/** Deciso prima del paint: film completo solo alla prima visita della sessione. */
const decide = `try{if(!sessionStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.film="play"}}catch(e){}`;

function Frame({ shot, className, children, priority = false }: { shot: FilmShot; className: string; children?: React.ReactNode; priority?: boolean }) {
  return (
    <div className={`film-layer ${className}`} aria-hidden={!priority}>
      <div className="film-mask absolute inset-0">
        <picture>
          {shot.mobileSrcSet && <source media="(max-width: 767px)" srcSet={shot.mobileSrcSet} sizes="100vw" />}
          <source media="(min-width: 768px)" srcSet={shot.srcSet} sizes="100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot.src} alt={priority ? shot.alt : ""} decoding="async" fetchPriority="high" />
        </picture>
      </div>
      {children}
    </div>
  );
}

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

export function HeroFilm({ shots }: { shots: { metal: FilmShot; headlight: FilmShot; silhouette: FilmShot; hero: FilmShot } }) {
  const section = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const lbTop = useRef<HTMLDivElement>(null);
  const lbBottom = useRef<HTMLDivElement>(null);

  // Regia del film: durata, salto, fine
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.film !== "play") return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage non disponibile */
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      root.dataset.film = "done";
      delete root.dataset.filmReady;
      window.dispatchEvent(new Event("ac-intro-done"));
    };
    const skip = () => {
      if (done || root.dataset.film !== "play") return;
      root.dataset.film = "skip";
      setTimeout(finish, 1100);
    };
    // Avvio quando i fotogrammi sono decodificati (o dopo 2,5 s comunque)
    let t: ReturnType<typeof setTimeout> | undefined;
    const imgs = Array.from(section.current?.querySelectorAll<HTMLImageElement>(".film-layer img") ?? []);
    const ready = Promise.all(imgs.map((img) => (img.complete && img.naturalWidth ? Promise.resolve() : img.decode().catch(() => undefined))));
    Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]).then(() => {
      if (done) return;
      root.dataset.filmReady = "";
      t = setTimeout(finish, FILM_MS);
    });
    const opts = { passive: true, once: true } as const;
    window.addEventListener("wheel", skip, opts);
    window.addEventListener("touchmove", skip, opts);
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("ac-film-skip", skip);
    return () => {
      clearTimeout(t);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("ac-film-skip", skip);
    };
  }, []);

  // Luce che segue il cursore (desktop)
  useEffect(() => {
    const el = section.current;
    if (!el || reducedMotion() || !finePointer()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--lx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        el.style.setProperty("--ly", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      });
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Uscita: la camera entra nel tunnel, il titolo si allarga, il quadro si chiude
  useEffect(() => {
    if (reducedMotion()) return;
    let revert = () => {};
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled || !section.current) return;
      const ctx = gsap.context(() => {
        gsap
          .timeline({ scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: 0.6 } })
          .to(scene.current, { scale: 1.45, yPercent: 8, ease: "none" }, 0)
          .to(content.current, { yPercent: -45, opacity: 0, letterSpacing: "0.04em", ease: "none" }, 0)
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
    <section ref={section} aria-labelledby="hero-title" className="film grain" data-cursor="Esplora">
      <script dangerouslySetInnerHTML={{ __html: decide }} />

      <div ref={scene} className="absolute inset-0 origin-[50%_45%]">
        {/* 1 · bagliore che rivela il metallo */}
        <Frame shot={shots.metal} className="film-l1" />
        {/* 2 · macro del faro */}
        <Frame shot={shots.headlight} className="film-l2">
          <span className="film-flare" />
        </Frame>
        {/* 3 · carrellata lungo la carrozzeria */}
        <Frame shot={shots.silhouette} className="film-l3">
          <span className="film-sweep" />
        </Frame>
        {/* 4 · rivelazione dell'auto completa */}
        <Frame shot={shots.hero} className="film-l4" priority>
          <span className="film-breathe" />
          <span className="film-idle-sweep" />
        </Frame>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-obsidian/50" />
        <span className="film-cursor-light" />
        <AtmosphereDust className="absolute inset-0 h-full w-full" />
      </div>

      <div ref={lbTop} aria-hidden className="letterbox letterbox-top" />
      <div ref={lbBottom} aria-hidden className="letterbox letterbox-bottom" />

      <div ref={content} className="container-x relative z-10 flex h-full flex-col items-center justify-end pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center md:pb-14">
        <Image src={logo} alt="Alfano Cars" priority sizes="(min-width: 768px) 220px, 150px" className="film-logo h-auto w-[150px] md:w-[220px]" />

        <h1 id="hero-title" aria-label="Beyond the drive" className="mt-6 font-display text-[clamp(3.1rem,12.5vw,11.5rem)] font-medium uppercase leading-[0.86] tracking-[-0.045em] [perspective:900px] md:mt-8">
          <span aria-hidden className="block">
            <Chars text="Beyond" start={0} />
          </span>
          <span aria-hidden className="block">
            <Chars text="the drive" start={260} />
          </span>
        </h1>

        <p className="film-in mt-6 max-w-md text-base leading-relaxed text-ice/80 sm:text-lg" style={{ ["--d" as string]: "700ms" }}>
          Scopri una nuova prospettiva sul mondo automotive.
        </p>
        <div className="film-in mt-8 flex w-full flex-col justify-center gap-3 xs:w-auto xs:flex-row" style={{ ["--d" as string]: "850ms" }}>
          <Link href="/stock-auto/" className="btn btn-primary btn-glow" data-magnetic>
            Scopri le vetture <ArrowRight size={16} className="btn-arrow" />
          </Link>
          <a href="#esplora" className="btn btn-ghost" data-magnetic>
            Esplora Alfano Cars
          </a>
        </div>

        <div className="film-in mt-10 flex w-full items-end justify-between text-[0.62rem] uppercase tracking-[0.26em] text-silver" style={{ ["--d" as string]: "1100ms" }}>
          <span className="hidden sm:block">Pompei · dal {business.since}</span>
          <a href="#esplora" className="flex flex-col items-center gap-3" aria-label="Scorri per esplorare">
            <span className="scroll-line" aria-hidden />
            Scorri
          </a>
          <span className="hidden sm:block">Immagini d&apos;atmosfera</span>
        </div>
      </div>

      <button
        type="button"
        className="film-skip btn btn-ghost btn-sm"
        onClick={() => window.dispatchEvent(new Event("ac-film-skip"))}
      >
        Salta intro
      </button>
    </section>
  );
}
