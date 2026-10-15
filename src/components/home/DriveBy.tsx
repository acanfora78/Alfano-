"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { loadGsap, reducedMotion, scheduleRefresh, whenNear } from "@/lib/motion";
import { ArrowRight } from "@/components/ui/Icons";

/** Fotografie scattate nella sede Alfano Cars: non indicano disponibilità attuale. */
const FRAMES = [
  { src: "/images/hero/stelvio-side-graded.jpg", make: "Alfa Romeo", model: "Stelvio" },
  { src: "/images/fleet/renegade-graded.jpg", make: "Jeep", model: "Renegade" },
  { src: "/images/fleet/maserati-levante-graded.jpg", make: "Maserati", model: "Levante" },
  { src: "/images/fleet/fiat500x-graded.jpg", make: "Fiat", model: "500X" },
  { src: "/images/fleet/glc-coupe-graded.jpg", make: "Mercedes-Benz", model: "GLC Coupé" },
  { src: "/images/fleet/mini-countryman-graded.jpg", make: "MINI", model: "Countryman" },
  { src: "/images/fleet/smart-forfour-graded.jpg", make: "smart", model: "forfour" },
  { src: "/images/fleet/audi-q3-graded.jpg", make: "Audi", model: "Q3" },
];

export function DriveBy() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bgText = useRef<HTMLParagraphElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    let cancelled = false;
    let revert = () => {};

    const target = section.current;
    let stopNear = () => {};
    if (target)
      stopNear = whenNear(target, () =>
        loadGsap().then(({ gsap }) => {
        if (cancelled || !section.current || !track.current || !viewport.current) return;
        const el = track.current;
        viewport.current.dataset.pinned = "true";
  
        const ctx = gsap.context(() => {
          const dist = () => Math.max(0, el.scrollWidth - window.innerWidth);
          const speed = { v: 0 };
          const setVars = () => {
            el.style.setProperty("--v", speed.v.toFixed(2));
            el.style.setProperty("--va", Math.abs(speed.v).toFixed(2));
          };
          const vTo = gsap.quickTo(speed, "v", { duration: 0.45, ease: "power3.out", onUpdate: setVars });
          let rest: ReturnType<typeof setTimeout>;
          const inners = gsap.utils.toArray<HTMLElement>("[data-drive-inner]", el);
          // Coverflow: ogni vettura ruota nello spazio in base alla distanza dal centro dello schermo
          const coverflow = () => {
            const half = window.innerWidth / 2;
            for (const inner of inners) {
              const r = inner.parentElement!.getBoundingClientRect();
              const n = gsap.utils.clamp(-1, 1, (r.left + r.width / 2 - half) / half);
              inner.style.transform = `rotateY(${(-n * 26).toFixed(2)}deg) scale(${(1 - Math.abs(n) * 0.1).toFixed(3)})`;
              inner.style.opacity = (1 - Math.abs(n) * 0.35).toFixed(3);
            }
          };
          coverflow();
  
          const move = gsap.to(el, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: () => `+=${dist()}`,
              pin: true,
              scrub: 0.9,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                coverflow();
                vTo(gsap.utils.clamp(-12, 12, self.getVelocity() / 260));
                clearTimeout(rest);
                rest = setTimeout(() => vTo(0), 140);
                if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
                if (counter.current)
                  counter.current.textContent = String(Math.min(FRAMES.length, Math.floor(self.progress * FRAMES.length) + 1)).padStart(2, "0");
              },
            },
          });
  
          gsap.to(bgText.current, {
            xPercent: -35,
            ease: "none",
            scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${dist()}`, scrub: 1.2, invalidateOnRefresh: true },
          });
  
          // Parallasse interna: la foto scorre dentro la sua cornice
          el.querySelectorAll<HTMLElement>("[data-drive-img]").forEach((img) => {
            gsap.fromTo(
              img,
              { xPercent: -9 },
              {
                xPercent: 9,
                ease: "none",
                scrollTrigger: { trigger: img.parentElement, containerAnimation: move, start: "left right", end: "right left", scrub: true },
              },
            );
          });
        }, section);
  
        revert = () => {
          ctx.revert();
          if (viewport.current) delete viewport.current.dataset.pinned;
        };
      }).then(scheduleRefresh),
      );
    return () => {
      cancelled = true;
      stopNear();
      revert();
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="drive-title" className="relative overflow-hidden border-t border-line bg-obsidian">
      <div className="relative flex h-[100svh] min-h-[34rem] flex-col justify-center gap-8 pb-8 pt-[calc(var(--header-h)+1.5rem)] sm:gap-10">
        {/* Testo gigante che scorre in senso opposto */}
        <p
          ref={bgText}
          aria-hidden
          className="text-outline pointer-events-none absolute left-0 top-1/2 -z-0 -translate-y-1/2 whitespace-nowrap font-display text-[26vw] font-medium leading-none tracking-[-0.05em] opacity-60 sm:text-[18vw]"
        >
          In movimento — Pompei — In movimento
        </p>

        <div className="container-x relative flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-4">
              <span className="tabular text-ion">01</span>
              <span aria-hidden className="h-px w-10 bg-line-strong" /> The Collection · dal piazzale
            </p>
            <h2 id="drive-title" className="headline-md">
              Il piazzale,
              <br />
              <span className="text-silver">in movimento.</span>
            </h2>
          </div>
          <p className="hidden text-right text-xs leading-relaxed text-silver sm:block">
            <span ref={counter} className="font-display text-3xl tabular text-ice">
              01
            </span>{" "}
            / {String(FRAMES.length).padStart(2, "0")}
            <br />
            Foto scattate in sede
          </p>
        </div>

        <div ref={viewport} className="no-scrollbar relative overflow-x-auto [perspective:1400px] data-[pinned=true]:overflow-visible">
          <ul ref={track} className="drive-track flex w-max gap-4 px-[var(--gutter)] sm:gap-[3vw]" style={{ ["--v" as string]: 0, ["--va" as string]: 0 }}>
            {FRAMES.map((f, i) => (
              <li
                key={f.src}
                className="drive-card relative h-[52svh] w-[80vw] shrink-0 sm:h-[58svh] sm:w-[58vw] lg:w-[46vw]"
                style={{ transform: "skewX(calc(var(--v) * -1deg))" }}
              >
                <div data-drive-inner data-cursor="Piazzale" className="group relative h-full w-full overflow-hidden rounded-[1.25rem] border border-line [transform-style:preserve-3d]">
                <div data-drive-img className="absolute inset-y-0 -left-[12%] w-[124%]">
                  <Image src={f.src} alt={`${f.make} ${f.model} fotografata nella sede Alfano Cars`} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
                </div>
                {/* scia di movimento proporzionale alla velocità */}
                <div
                  aria-hidden
                  className="drive-ghost"
                  style={{ transform: "translate3d(calc(var(--v) * 9px), 0, 0)", opacity: "calc(var(--va) / 22)" }}
                >
                  <Image src={f.src} alt="" fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                  <div>
                    <p className="eyebrow text-[0.62rem]">{f.make}</p>
                    <p className="mt-1 font-display text-3xl tracking-tight sm:text-5xl">{f.model}</p>
                  </div>
                  <span className="font-display text-sm tabular text-silver">{String(i + 1).padStart(2, "0")}</span>
                </div>
                {/* dettaglio che emerge al passaggio */}
                <p className="absolute left-5 top-5 translate-y-2 rounded-full border border-line-strong bg-obsidian/60 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:left-7 sm:top-7">
                  Fotografata in sede · Pompei
                </p>
                </div>
              </li>
            ))}
            <li className="flex w-[70vw] shrink-0 flex-col justify-center gap-6 sm:w-[34vw]">
              <p className="headline-md text-balance">Le vetture disponibili sono nello stock.</p>
              <Link href="/stock-auto/" className="btn btn-primary self-start" data-magnetic>
                Vai allo stock <ArrowRight size={16} className="btn-arrow" />
              </Link>
            </li>
          </ul>
        </div>

        <div className="container-x relative flex items-center gap-4" aria-hidden>
          <span className="relative h-px flex-1 overflow-hidden bg-line-strong">
            <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-ion" />
          </span>
          <span className="eyebrow text-[0.6rem]">Scorri</span>
        </div>
      </div>
    </section>
  );
}
