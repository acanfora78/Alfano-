"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    k: "Design",
    title: "Linee e proporzioni.",
    text: "Guardiamo ogni vettura come la guarderai tu: dalla firma luminosa dei fari al disegno dei cerchi.",
    image: { src: "/images/details/headlight-graded.jpg", alt: "Dettaglio del faro anteriore di una Jeep Renegade" },
  },
  {
    k: "Abitacolo",
    title: "Dove il viaggio prende forma.",
    text: "Materiali, comandi, ergonomia. L'interno merita la stessa attenzione dell'esterno.",
    image: { src: "/images/details/gear-selector-graded.jpg", alt: "Selettore del cambio automatico e consolle centrale" },
  },
  {
    k: "Dettaglio",
    title: "Nulla lasciato al caso.",
    text: "Pinze, cerchi, finiture: sono i particolari a raccontare il carattere di un'auto.",
    image: { src: "/images/details/wheel-caliper-graded.jpg", alt: "Cerchio in lega con pinza freno rossa di un'Alfa Romeo" },
  },
  {
    k: "Consegna",
    title: "Le chiavi, il primo chilometro.",
    text: "Il momento della consegna è l'inizio del rapporto con noi, non la sua fine.",
    image: { src: "/images/details/key-handover-graded.jpg", alt: "Consegna delle chiavi di un'Alfa Romeo" },
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
              className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none ${
                i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
              }`}
            >
              <Image src={s.image.src} alt={s.image.alt} fill sizes="100vw" className="object-cover" />
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
