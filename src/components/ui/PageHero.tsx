import Image from "next/image";
import type { ReactNode } from "react";
import { Breadcrumbs } from "./Section";

/** Intestazione cinematografica per le pagine interne. */
export function PageHero({
  eyebrow,
  lines,
  intro,
  image,
  crumbs,
  children,
}: {
  eyebrow: string;
  lines: string[];
  intro?: ReactNode;
  image?: { src: string; alt: string };
  crumbs: { href?: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="grain relative isolate overflow-hidden border-b border-line pt-[calc(var(--header-h)+2.5rem)]">
      {image && (
        <div className="absolute inset-0 -z-10">
          <div data-parallax style={{ ["--parallax-range" as string]: "-50px" }} className="absolute inset-0">
            <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="hero-visual object-cover opacity-55" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/40" />
        </div>
      )}
      <div className="container-x pb-14 sm:pb-20">
        <div className="hero-fade" style={{ ["--d" as string]: "100ms" }}>
          <Breadcrumbs items={crumbs} />
        </div>
        <p className="hero-fade eyebrow mt-10 flex items-center gap-4 sm:mt-16" style={{ ["--d" as string]: "200ms" }}>
          <span aria-hidden className="h-px w-10 bg-ion" /> {eyebrow}
        </p>
        <h1 className="headline-lg mt-6 max-w-[16ch] text-balance">
          {lines.map((l, i) => (
            <span key={i} className="hero-line block overflow-hidden pb-[0.06em]">
              <span style={{ ["--d" as string]: `${300 + i * 120}ms` }}>{l}</span>
            </span>
          ))}
        </h1>
        {intro && (
          <div className="hero-fade mt-8 max-w-2xl text-base leading-relaxed text-ice/75 sm:text-lg" style={{ ["--d" as string]: "650ms" }}>
            {intro}
          </div>
        )}
        {children && (
          <div className="hero-fade mt-10" style={{ ["--d" as string]: "800ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
