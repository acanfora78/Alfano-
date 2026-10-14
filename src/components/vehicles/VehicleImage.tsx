"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "@/components/ui/Icons";

const OPTIMIZABLE_HOSTS = ["alfanocars.it"];

function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZABLE_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

/** Immagine veicolo con segnaposto elegante se assente o non caricabile. */
export function VehicleImage({ src, alt, className = "", ...rest }: Omit<ImageProps, "src"> & { src?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} — fotografia non disponibile`}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,_#252930_0%,_#12151a_70%)] text-silver"
      >
        <ImageOff size={28} />
        <span className="eyebrow text-[0.62rem]">Foto in arrivo</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      unoptimized={!canOptimize(src)}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
