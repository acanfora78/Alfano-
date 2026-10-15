"use client";

import Image from "next/image";
import { photos } from "@/config/photos";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    k: "Luce",
    title: "Sotto le luci dello showroom.",
    text: "Le vetture ti aspettano in sede, sotto la stessa luce con cui le vedrai dal vivo: da vicino, senza filtri.",
    photo: photos.cayenne,
  },
  {
    k: "Carattere",
    title: "Ogni modello ha il suo.",
    text: "Dalla city car al SUV di prestigio: ti aiutiamo a trovare quello giusto, da acquistare o da noleggiare.",
    photo: photos.grecale,
  },
  {
    k: "Cerimonie",
    title: "Per il giorno più importante.",
    text: "Auto per matrimoni ed eventi, preparate con la cura che il momento merita.",
    photo: photos.g63,
  },
  {
    k: "Partenza",
    title: "Il primo chilometro inizia qui.",
    text: "Dalla nostra sede di Pompei alla strada: il momento della consegna è l'inizio del rapporto con noi.",
    photo: photos.q8Cerimonia,
  },
];

/**
 * Sezione immersiva guidata dallo scroll: visual sticky a tutto schermo,
 * testi editoriali progressivi, dissolvenze tra le immagini.
 * Senza JS o con movimento ridotto i contenuti restano tutti leggibili.
 */
export function Immersive() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="immersive-title" className="relative bg-obsidian">
      <div className="container-x pb-16 pt-8 sm:pb-24">
        <p className="eyebrow mb-6 flex items-center gap-4" data-reveal="fade">
          <span className="tabular text-ion">02</span>
          <span aria-hidden className="h-px w-10 bg-line-strong" />
          Cura automobilistica
        </p>
        <h2 id="immersive-title" className="headline-xl max-w-[14ch] text-balance" data-reveal="fade">
          <span className="line-mask"><span>Ogni dettaglio.</span></span>
          <span className="line-mask"><span style={{ ["--line-delay" as string]: "120ms" }} className="text-silver">Una scelta precisa.</span></span>
        </h2>
      </div>

      <div className="relative">
        {/* Visual sticky */}
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {steps.map((s, i) => (
            <div
              key={s.k}
              aria-hidden={i !== active}
              className="absolute inset-0 overflow-hidden"
              style={
                i === active
                  ? { zIndex: 2, clipPath: "inset(0 0 0 0)", transition: "clip-path 1.25s cubic-bezier(.77,0,.18,1)" }
                  : { zIndex: 1, clipPath: "inset(0 0 0 100%)", transition: "clip-path 0s linear 1.3s" }
              }
            >
              {/* atmosfera (desktop) */}
              <div className="absolute inset-0 hidden md:block">
                <Image src={s.photo.ambient} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-80" />
              </div>
              {/* fotografia: a tutto schermo su mobile, in cornice verticale su desktop */}
              <div className="absolute inset-0 overflow-hidden md:inset-y-[9%] md:left-auto md:right-[max(var(--gutter),7vw)] md:aspect-[1179/1560] md:h-[82%] md:rounded-[1.25rem] md:border md:border-line-strong md:shadow-[0_50px_100px_-30px_rgba(0,0,0,.95)]" data-cursor={s.photo.model}>
                <div
                  className="absolute inset-0 transition-transform duration-[2600ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
                  style={{ transform: i === active ? "scale(1.02)" : "scale(1.18)" }}
                >
                  <Image src={s.photo.src} alt={s.photo.alt} fill sizes="(min-width: 768px) 62vh, 100vw" className="object-cover object-[50%_60%]" />
                </div>
              </div>
              {/* linea di luce sul bordo del taglio */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 z-10 w-[2px] bg-ion shadow-[0_0_30px_4px_rgba(138,175,255,.7)]"
                style={
                  i === active
                    ? { transform: "translateX(0)", opacity: 0, transition: "transform 1.25s cubic-bezier(.77,0,.18,1), opacity .5s ease 1.05s" }
                    : { transform: "translateX(100vw)", opacity: 1, transition: "none" }
                }
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/85 via-obsidian/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-obsidian to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-obsidian to-transparent" />

          {/* indicatore di avanzamento */}
          <div className="container-x absolute inset-x-0 bottom-10 flex items-center gap-3" aria-hidden>
            {steps.map((s, i) => (
              <span key={s.k} className="flex items-center gap-3">
                <span className={`tabular text-xs transition-colors duration-500 ${i === active ? "text-ice" : "text-silver/50"}`}>0{i + 1}</span>
                {i < steps.length - 1 && (
                  <span className="relative h-px w-8 overflow-hidden bg-line-strong sm:w-14">
                    <span className={`absolute inset-0 origin-left bg-ion transition-transform duration-700 ${i < active ? "scale-x-100" : "scale-x-0"}`} />
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Testi che scorrono sopra il visual */}
        <div className="relative -mt-[100svh]">
          {steps.map((s, i) => (
            <div
              key={s.k}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-step={i}
              className="container-x flex h-[100svh] items-center"
            >
              <div
                className={`max-w-md rounded-2xl border border-line bg-obsidian/40 p-7 backdrop-blur-md transition-[transform,border-color] duration-1000 ease-[cubic-bezier(.16,1,.3,1)] sm:p-9 ${
                  i === active ? "translate-y-0 border-line-strong" : "translate-y-6"
                }`}
              >
                <p className="eyebrow flex items-center gap-3">
                  <span className="tabular text-ion">0{i + 1}</span> {s.k}
                </p>
                <h3 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-4xl">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-ice/75">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
