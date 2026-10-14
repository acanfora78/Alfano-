"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { business } from "@/config/site";
import { loadGsap, reducedMotion } from "@/lib/motion";
import { ArrowRight } from "@/components/ui/Icons";
import { LightTrails } from "./LightTrails";

export type ReelShot = { srcSet: string; src: string; mobileSrcSet?: string; alt: string; cam: string; pos: string; label: string };

const SHOT_MS = 5600;

/** Divide il testo in lettere animabili, senza spezzare le parole. */
function Chars({ text, start, step = 38, accentLast = false }: { text: string; start: number; step?: number; accentLast?: boolean }) {
  let n = 0;
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {[...w].map((c, ci) => {
            const d = start + n++ * step;
            const last = accentLast && wi === words.length - 1 && ci === w.length - 1;
            return (
              <span key={ci} className={`char ${last ? "text-ion" : ""}`} style={{ ["--d" as string]: `${d}ms` }}>
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

export function HeroReel({ shots }: { shots: ReelShot[] }) {
  const section = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const lbTop = useRef<HTMLDivElement>(null);
  const lbBottom = useRef<HTMLDivElement>(null);
  const imgs = useRef<(HTMLImageElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [leaving, setLeaving] = useState(-1);
  const [cut, setCut] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [running, setRunning] = useState(false);

  // Le altre inquadrature si caricano solo dopo la pagina (non competono con l'LCP)
  useEffect(() => {
    if (reducedMotion()) return;
    const go = () => setTimeout(() => setLoaded(true), 400);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  // Il montaggio parte a fine intro, e solo con l'hero visibile
  useEffect(() => {
    if (reducedMotion()) return;
    let introDone = document.documentElement.dataset.intro !== "play";
    let visible = true;
    const sync = () => setRunning(introDone && visible && !document.hidden);
    const onIntro = () => {
      introDone = true;
      sync();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    if (section.current) io.observe(section.current);
    window.addEventListener("ac-intro-done", onIntro);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      window.removeEventListener("ac-intro-done", onIntro);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!running || !loaded) return;
    const t = setInterval(() => {
      const a = activeRef.current;
      const next = (a + 1) % shots.length;
      const img = imgs.current[next];
      if (!img || !img.complete) return; // aspetta che l'inquadratura sia pronta
      activeRef.current = next;
      setLeaving(a);
      setActive(next);
      setCut((c) => c + 1);
    }, SHOT_MS);
    return () => clearInterval(t);
  }, [running, loaded, shots.length]);

  useEffect(() => {
    if (leaving < 0) return;
    const t = setTimeout(() => setLeaving(-1), 1700);
    return () => clearTimeout(t);
  }, [leaving, cut]);

  // Camera che avanza e letterbox che si chiude mentre si scorre fuori dall'hero
  useEffect(() => {
    if (reducedMotion()) return;
    let revert = () => {};
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled || !section.current) return;
      const ctx = gsap.context(() => {
        gsap
          .timeline({ scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: 0.5 } })
          .to(visual.current, { scale: 1.22, yPercent: 14, ease: "none" }, 0)
          .to(content.current, { yPercent: -35, opacity: 0, ease: "none" }, 0)
          .to([lbTop.current, lbBottom.current], { scaleY: 1, ease: "none" }, 0);
      });
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  const shot = shots[active];

  return (
    <section ref={section} aria-labelledby="hero-title" className="grain relative isolate h-[100svh] min-h-[36rem] overflow-hidden bg-obsidian">
      {/* ── Reel ── */}
      <div ref={visual} className="absolute inset-0 -z-10 origin-[50%_35%]">
        {shots.map((s, i) => (
          <div
            key={s.src}
            aria-hidden={i !== active}
            className={`reel-shot ${i === active ? "is-active" : ""} ${i === leaving ? "is-leaving" : ""} ${i === 0 && cut === 0 ? "is-first" : ""}`}
            style={{ ["--cam" as string]: s.cam }}
          >
            {i === 0 ? (
              <picture>
                <source media="(min-width: 768px)" srcSet={s.srcSet} sizes="100vw" />
                {s.mobileSrcSet && <source media="(max-width: 767px)" srcSet={s.mobileSrcSet} sizes="100vw" />}
                <img
                  ref={(el) => {
                    imgs.current[0] = el;
                  }}
                  src={s.src}
                  alt={s.alt}
                  className="reel-img"
                  style={{ objectPosition: s.pos }}
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            ) : (
              loaded && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  ref={(el) => {
                    imgs.current[i] = el;
                  }}
                  srcSet={s.srcSet}
                  sizes="100vw"
                  src={s.src}
                  alt={s.alt}
                  className="reel-img"
                  style={{ objectPosition: s.pos }}
                  decoding="async"
                />
              )
            )}
          </div>
        ))}
        <div key={`f${cut}`} className={`reel-flash ${cut ? "go" : ""}`} />
        <div key={`s${cut}`} className="reel-sweep go" style={cut === 0 ? { animationDelay: "calc(var(--intro, 0ms) + 1.2s)" } : undefined} />
        <div className="absolute inset-0 z-[3] bg-gradient-to-t from-obsidian via-obsidian/35 to-obsidian/40" />
        <div className="absolute inset-0 z-[3] bg-gradient-to-r from-obsidian/85 via-obsidian/15 to-transparent" />
        <LightTrails className="absolute inset-x-0 bottom-0 z-[3] h-[62%]" />
      </div>

      {/* Letterbox e mirino */}
      <div ref={lbTop} aria-hidden className="letterbox letterbox-top" />
      <div ref={lbBottom} aria-hidden className="letterbox letterbox-bottom" />
      <span aria-hidden className="hud-corner left-[var(--gutter)] top-[calc(var(--header-h)+1rem)] hidden border-l border-t md:block" />
      <span aria-hidden className="hud-corner right-[var(--gutter)] top-[calc(var(--header-h)+1rem)] hidden border-r border-t md:block" />
      <span aria-hidden className="hud-corner bottom-6 left-[var(--gutter)] hidden border-b border-l md:block" />
      <span aria-hidden className="hud-corner bottom-6 right-[var(--gutter)] hidden border-b border-r md:block" />

      {/* ── Contenuto ── */}
      <div ref={content} className="container-x relative z-[6] flex h-full flex-col justify-end pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-28 md:pb-16">
        <p className="hero-fade eyebrow flex items-center gap-4" style={{ ["--d" as string]: "100ms" }}>
          <span className="tabular text-ion">Pompei</span>
          <span aria-hidden className="hero-scan h-px w-10 bg-ion" style={{ ["--d" as string]: "200ms" }} />
          Vendita e noleggio dal {business.since}
        </p>

        <h1 id="hero-title" aria-label="Beyond the drive." className="headline-xl mt-5 max-w-[12ch]">
          <span aria-hidden className="char-line">
            <Chars text="Beyond" start={150} />
          </span>
          <span aria-hidden className="char-line">
            <Chars text="the drive." start={420} accentLast />
          </span>
        </h1>

        <div className="mt-7 flex flex-col gap-7 md:mt-9 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-base leading-relaxed text-ice/80 sm:text-lg" style={{ ["--d" as string]: "900ms" }}>
            Scopri una nuova prospettiva sul mondo automotive.
          </p>
          <div className="hero-fade flex flex-col gap-3 xs:flex-row" style={{ ["--d" as string]: "1050ms" }}>
            <Link href="/stock-auto/" className="btn btn-primary" data-magnetic>
              Scopri le vetture <ArrowRight size={16} className="btn-arrow" />
            </Link>
            <Link href="/contatti/" className="btn btn-ghost" data-magnetic>
              Contattaci
            </Link>
          </div>
        </div>

        {/* Barra "REC" del montaggio */}
        <div className="hero-fade mt-10 hidden items-center gap-6 text-[0.64rem] uppercase tracking-[0.26em] text-silver md:flex" style={{ ["--d" as string]: "1300ms" }} aria-hidden>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ion motion-reduce:animate-none" /> Rec
          </span>
          <span className="tabular text-ice">
            {String(active + 1).padStart(2, "0")} <span className="text-silver">/ {String(shots.length).padStart(2, "0")}</span>
          </span>
          <span className="relative h-px w-40 overflow-hidden bg-line-strong">
            {running && loaded && <span key={cut} className="reel-progress absolute inset-0 bg-ion" style={{ ["--shot" as string]: `${SHOT_MS}ms` }} />}
          </span>
          <span className="w-24">{shot.label}</span>
          <span className="ml-auto tabular">40.7497° N · 14.5005° E</span>
        </div>
      </div>
    </section>
  );
}
