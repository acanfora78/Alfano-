"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cinema } from "@/config/cinema";
import { loadGsap, reducedMotion } from "@/lib/motion";

const BEATS = [
  { k: "Oltre la vendita", t: "Non vendiamo soltanto auto: ti aiutiamo a trovare quella giusta per te, da acquistare o da noleggiare." },
  { k: "Oltre il noleggio", t: "Poche ore, un weekend o mesi interi. Con o senza conducente. Per il lavoro, un viaggio o il giorno più importante." },
  { k: "Oltre il chilometro", t: "Serietà, professionalità e umiltà: il nostro modo di lavorare, dal primo contatto alla consegna delle chiavi." },
];

/**
 * SEQUENZA 2 — "Beyond the ordinary".
 * Scena bloccata: una cornice si espande fino a riempire lo schermo mentre il titolo
 * si divide ai lati; tre battute di testo si alternano; un taglio dal basso cambia inquadratura.
 */
export function BeyondScene() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const shotA = useRef<HTMLDivElement>(null);
  const shotB = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const wordL = useRef<HTMLSpanElement>(null);
  const wordR = useRef<HTMLSpanElement>(null);
  const ticks = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    let cancelled = false;
    let revert = () => {};
    loadGsap().then(({ gsap }) => {
      const el = section.current;
      if (cancelled || !el) return;
      el.dataset.scene = "on";
      const beats = gsap.utils.toArray<HTMLElement>("[data-beat]", el);
      const ctx = gsap.context(() => {
        const mobile = window.innerWidth < 768;
        gsap.set(frame.current, { clipPath: mobile ? "inset(30% 14% 30% 14% round 18px)" : "inset(24% 33% 24% 33% round 22px)" });
        gsap.set(shotA.current, { scale: 1.45 });
        gsap.set(shotB.current, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.3 });
        gsap.set(beats, { autoAlpha: 0, y: 60 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 0.8,
            onUpdate: (self) => {
              if (ticks.current) ticks.current.style.transform = `scaleY(${self.progress})`;
            },
          },
        });
        tl.to(frame.current, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 3.2, ease: "power2.inOut" }, 0)
          .to(shotA.current, { scale: 1.04, duration: 3.6, ease: "power1.out" }, 0)
          .to(wordL.current, { xPercent: -120, autoAlpha: 0, duration: 2.6, ease: "power2.in" }, 0.2)
          .to(wordR.current, { xPercent: 120, autoAlpha: 0, duration: 2.6, ease: "power2.in" }, 0.2)
          .to(beats[0], { autoAlpha: 1, y: 0, duration: 1 }, 2.9)
          .to(beats[0], { autoAlpha: 0, y: -50, duration: 0.8 }, 4.6)
          .to(shotB.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power3.inOut" }, 4.6)
          .to(shotB.current, { scale: 1.02, duration: 3.6 }, 4.6)
          .to(beats[1], { autoAlpha: 1, y: 0, duration: 1 }, 5.6)
          .to(beats[1], { autoAlpha: 0, y: -50, duration: 0.8 }, 7.2)
          .to(shade.current, { opacity: 0.55, duration: 1.4 }, 7.2)
          .to(beats[2], { autoAlpha: 1, y: 0, duration: 1 }, 8.1)
          .to({}, { duration: 1 }, 9.1);
      }, el);
      revert = () => {
        ctx.revert();
        delete el.dataset.scene;
      };
    });
    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <section id="esplora" ref={section} aria-labelledby="beyond-title" className="beyond relative h-[100svh] min-h-[34rem] overflow-hidden bg-obsidian">
      <h2 id="beyond-title" className="sr-only">
        Beyond the ordinary
      </h2>

      <div ref={frame} className="absolute inset-0 overflow-hidden" data-cursor="Scorri">
        <div ref={shotA} className="absolute inset-0">
          <Image src={cinema.mountainRoad.src} alt={cinema.mountainRoad.alt} fill sizes="100vw" className="object-cover object-[60%_50%]" />
        </div>
        <div ref={shotB} className="absolute inset-0">
          <Image src={cinema.duskRoad.src} alt={cinema.duskRoad.alt} fill sizes="100vw" className="object-cover object-[45%_55%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-obsidian/40" />
        <div ref={shade} className="absolute inset-0 bg-obsidian opacity-0" />
      </div>

      {/* Titolo che si apre ai lati della cornice */}
      <p aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[var(--gutter)] font-display text-[clamp(2.4rem,8.5vw,9rem)] font-medium uppercase leading-none tracking-[-0.045em]">
        <span ref={wordL}>Beyond</span>
        <span ref={wordR} className="text-outline">Ordinary</span>
      </p>

      {/* Battute narrative */}
      <div className="beats container-x absolute inset-x-0 bottom-0 pb-14 sm:pb-20">
        {BEATS.map((b, i) => (
          <div key={b.k} data-beat className="beat max-w-xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="tabular text-ion">0{i + 1}</span>
              <span aria-hidden className="h-px w-8 bg-line-strong" /> {b.k}
            </p>
            <p className="mt-4 font-display text-[clamp(1.6rem,3.6vw,3rem)] font-medium leading-[1.08] tracking-tight text-balance">{b.t}</p>
          </div>
        ))}
      </div>

      {/* Avanzamento della scena */}
      <div aria-hidden className="absolute right-[var(--gutter)] top-1/2 hidden h-40 w-px -translate-y-1/2 overflow-hidden bg-line-strong md:block">
        <span ref={ticks} className="absolute inset-0 origin-top scale-y-0 bg-ion" />
      </div>
    </section>
  );
}
