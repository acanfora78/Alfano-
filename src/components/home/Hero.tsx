import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { HeroReel, type ReelShot } from "./HeroReel";

const SHOTS: { src: string; w: number; h: number; mobile?: { src: string; w: number; h: number }; alt: string; cam: string; pos: string; label: string }[] = [
  {
    src: "/images/hero/stelvio-front-graded.jpg", w: 2000, h: 1334,
    mobile: { src: "/images/hero/stelvio-portrait-graded.jpg", w: 1334, h: 2000 },
    alt: "Alfa Romeo Stelvio bianca nel piazzale Alfano Cars, Pompei", cam: "cam-push", pos: "60% 60%", label: "Stelvio",
  },
  { src: "/images/hero/stelvio-side-graded.jpg", w: 2000, h: 1334, alt: "Fiancata di un'Alfa Romeo Stelvio", cam: "cam-pan-l", pos: "45% 55%", label: "Profilo" },
  { src: "/images/details/wheel-caliper-graded.jpg", w: 2000, h: 1334, alt: "Cerchio in lega e pinza freno rossa", cam: "cam-rise", pos: "50% 50%", label: "Dettaglio" },
  { src: "/images/hero/renegade-graded.jpg", w: 2000, h: 1334, alt: "Jeep Renegade grigia davanti alla sede", cam: "cam-pan-r", pos: "50% 55%", label: "Renegade" },
  { src: "/images/details/headlight-graded.jpg", w: 2000, h: 1334, alt: "Faro anteriore illuminato", cam: "cam-pull", pos: "50% 50%", label: "Luce" },
];

export function Hero() {
  const shots: ReelShot[] = SHOTS.map((s, i) => {
    const base = { alt: s.alt, sizes: "100vw", quality: 72, priority: i === 0 };
    const { props } = getImageProps({ ...base, src: s.src, width: s.w, height: s.h });
    const mobile = s.mobile ? getImageProps({ ...base, src: s.mobile.src, width: s.mobile.w, height: s.mobile.h }).props : undefined;
    return { srcSet: props.srcSet!, src: props.src, mobileSrcSet: mobile?.srcSet, alt: s.alt, cam: s.cam, pos: s.pos, label: s.label };
  });

  // Preload art-directed del primo fotogramma (elemento LCP)
  const first = shots[0];
  preload(first.src, { as: "image", imageSrcSet: first.srcSet, imageSizes: "100vw", media: "(min-width: 768px)", fetchPriority: "high" });
  if (first.mobileSrcSet)
    preload(first.src, { as: "image", imageSrcSet: first.mobileSrcSet, imageSizes: "100vw", media: "(max-width: 767px)", fetchPriority: "high" });

  return <HeroReel shots={shots} />;
}
