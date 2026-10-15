import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { cinema, type CinemaImage } from "@/config/cinema";
import { HeroFilm, type FilmShot } from "./HeroFilm";

function shot(img: CinemaImage, priority = false): FilmShot {
  const base = { alt: img.alt, sizes: "100vw", quality: 72, priority };
  const d = getImageProps({ ...base, src: img.src, width: img.w, height: img.h }).props;
  const m = img.portrait ? getImageProps({ ...base, src: img.portrait, width: 1400, height: 2400 }).props : undefined;
  return { src: d.src, srcSet: d.srcSet!, mobileSrcSet: m?.srcSet, alt: img.alt };
}

/** Apertura cinematografica: 4 inquadrature d'atmosfera montate come uno spot. */
export function Hero() {
  const shots = {
    metal: shot(cinema.bodyMacro),
    headlight: shot(cinema.headlight),
    silhouette: shot(cinema.silhouette),
    hero: shot(cinema.tunnel, true),
  };
  // L'inquadratura finale è quella che resta: caricata con priorità (art direction)
  preload(shots.hero.src, { as: "image", imageSrcSet: shots.hero.srcSet, imageSizes: "100vw", media: "(min-width: 768px)", fetchPriority: "high" });
  if (shots.hero.mobileSrcSet)
    preload(shots.hero.src, { as: "image", imageSrcSet: shots.hero.mobileSrcSet, imageSizes: "100vw", media: "(max-width: 767px)", fetchPriority: "high" });
  return <HeroFilm shots={shots} />;
}
