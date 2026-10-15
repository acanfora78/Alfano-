import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { photos } from "@/config/photos";
import { HeroFilm } from "./HeroFilm";

/** Hero: la vettura protagonista in sede, aperta dall'intro "Ignition". */
export function Hero() {
  const p = photos.urus;
  const { props } = getImageProps({ src: p.src, alt: p.alt, width: p.w, height: p.h, sizes: "(min-width: 768px) 46vh, 100vw", quality: 75, priority: true });
  preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: "(min-width: 768px) 46vh, 100vw", fetchPriority: "high" });
  return <HeroFilm image={{ src: props.src, srcSet: props.srcSet!, alt: p.alt, ambient: p.ambient }} />;
}
