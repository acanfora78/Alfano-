import { getImageProps } from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import { business } from "@/config/site";
import { ArrowRight } from "@/components/ui/Icons";

export function Hero() {
  const common = { alt: "Alfa Romeo Stelvio bianca nel piazzale Alfano Cars, Pompei", sizes: "100vw", priority: true, quality: 72 };
  const { props: { srcSet: desktop } } = getImageProps({ ...common, src: "/images/hero/stelvio-front-graded.jpg", width: 2000, height: 1334 });
  const { props: { srcSet: mobile, ...img } } = getImageProps({ ...common, src: "/images/hero/stelvio-portrait-graded.jpg", width: 1334, height: 2000 });

  // Preload art-directed: ogni dispositivo scarica solo la variante che userà
  preload(img.src, { as: "image", imageSrcSet: desktop, imageSizes: "100vw", media: "(min-width: 768px)", fetchPriority: "high" });
  preload(img.src, { as: "image", imageSrcSet: mobile, imageSizes: "100vw", media: "(max-width: 767px)", fetchPriority: "high" });

  return (
    <section aria-labelledby="hero-title" className="grain relative isolate flex min-h-[100svh] items-end overflow-hidden">
      {/* Visual */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div data-parallax style={{ ["--parallax-range" as string]: "-70px", ["--parallax-scale" as string]: "1.06" }} className="absolute inset-0">
          <picture className="hero-visual absolute inset-0 block">
            <source media="(min-width: 768px)" srcSet={desktop} sizes="100vw" />
            <source media="(max-width: 767px)" srcSet={mobile} sizes="100vw" />
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img {...img} className="h-full w-full object-cover object-[60%_center] md:object-[center_60%]" fetchPriority="high" />
          </picture>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/45 to-obsidian/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/10 to-transparent" />
        {/* linea di luce orizzontale */}
        <div aria-hidden className="hero-scan absolute inset-x-0 top-[88%] h-px bg-gradient-to-r from-transparent via-ion/50 to-transparent" style={{ ["--d" as string]: "900ms" }} />
      </div>

      <div className="container-x pb-[max(3.5rem,env(safe-area-inset-bottom))] pt-36 sm:pb-20">
        <p className="hero-fade eyebrow flex items-center gap-4" style={{ ["--d" as string]: "150ms" }}>
          <span className="tabular text-ion">Pompei</span>
          <span aria-hidden className="h-px w-10 bg-line-strong" />
          Vendita e noleggio dal {business.since}
        </p>

        <h1 id="hero-title" className="headline-xl mt-6 max-w-[12ch]">
          <span className="hero-line block overflow-hidden pb-[0.06em]">
            <span style={{ ["--d" as string]: "120ms" }}>Beyond</span>
          </span>
          <span className="hero-line block overflow-hidden pb-[0.06em]">
            <span style={{ ["--d" as string]: "240ms" }}>
              the drive<span className="text-ion">.</span>
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-base leading-relaxed text-ice/80 sm:text-lg" style={{ ["--d" as string]: "600ms" }}>
            Scopri una nuova prospettiva sul mondo automotive.
          </p>
          <div className="hero-fade flex flex-col gap-3 xs:flex-row" style={{ ["--d" as string]: "750ms" }}>
            <Link href="/stock-auto/" className="btn btn-primary">
              Scopri le vetture <ArrowRight size={16} className="btn-arrow" />
            </Link>
            <Link href="/contatti/" className="btn btn-ghost">
              Contattaci
            </Link>
          </div>
        </div>

        <div className="hero-fade mt-14 hidden items-center gap-4 md:flex" style={{ ["--d" as string]: "1100ms" }} aria-hidden>
          <span className="relative h-10 w-px overflow-hidden bg-line-strong">
            <span className="scroll-cue-dot absolute inset-x-0 top-0 h-1/2 bg-ion" />
          </span>
          <span className="eyebrow text-[0.62rem]">Scorri</span>
        </div>
      </div>
    </section>
  );
}
