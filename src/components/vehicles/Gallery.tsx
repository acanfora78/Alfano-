"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VehicleImage as Img } from "@/lib/vehicles/schema";
import { ArrowLeft, ArrowRight, Close, Expand } from "@/components/ui/Icons";
import { VehicleImage } from "./VehicleImage";

/** Galleria con immagine principale, miniature, swipe, tastiera e schermo intero. */
export function Gallery({ images, title }: { images: Img[]; title: string }) {
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touch = useRef<number | null>(null);
  const n = images.length;

  const go = useCallback((d: number) => setI((x) => (n ? (x + d + n) % n : 0)), [n]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (full && !dlg.open) dlg.showModal();
    if (!full && dlg.open) dlg.close();
    document.body.style.overflow = full ? "hidden" : "";
  }, [full]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => (touch.current = e.touches[0].clientX),
    onTouchEnd: (e: React.TouchEvent) => {
      if (touch.current === null) return;
      const dx = e.changedTouches[0].clientX - touch.current;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
      touch.current = null;
    },
  };

  const current = images[i];
  const alt = (k: number) => images[k]?.alt || `${title} — foto ${k + 1} di ${n}`;

  return (
    <div role="region" aria-roledescription="galleria" aria-label={`Fotografie di ${title}`} onKeyDown={onKey}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] border border-line bg-titanium sm:aspect-[16/10]" {...swipe}>
        {images.map((im, k) => (
          <div
            key={im.src}
            aria-hidden={k !== i}
            className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${
              k === i ? "scale-100 opacity-100" : "pointer-events-none scale-[1.03] opacity-0"
            }`}
          >
            {(Math.abs(k - i) <= 1 || k === n - 1 || k === 0) && (
              <VehicleImage src={im.src} alt={alt(k)} fill priority={k === 0} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            )}
          </div>
        ))}
        {n === 0 && <VehicleImage alt={title} />}

        {n > 1 && (
          <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-obsidian/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <p className="rounded-full bg-obsidian/60 px-3 py-1 text-xs tabular backdrop-blur" aria-live="polite">
                {i + 1} / {n}
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => go(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-obsidian/60 backdrop-blur transition hover:border-ice" aria-label="Foto precedente">
                  <ArrowLeft size={18} />
                </button>
                <button type="button" onClick={() => go(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-obsidian/60 backdrop-blur transition hover:border-ice" aria-label="Foto successiva">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
        {n > 0 && (
          <button
            type="button"
            onClick={() => setFull(true)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-obsidian/60 backdrop-blur transition hover:border-ice"
            aria-label="Visualizza a schermo intero"
          >
            <Expand size={18} />
          </button>
        )}
      </div>

      {n > 1 && (
        <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Miniature">
          {images.map((im, k) => (
            <li key={im.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setI(k)}
                aria-label={`Mostra foto ${k + 1}`}
                aria-current={k === i}
                className={`relative block h-16 w-24 overflow-hidden rounded-lg border transition sm:h-20 sm:w-28 ${
                  k === i ? "border-ion" : "border-line opacity-60 hover:opacity-100"
                }`}
              >
                <VehicleImage src={im.src} alt="" fill sizes="112px" className="object-cover" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setFull(false)}
        onKeyDown={onKey}
        aria-label={`${title} — galleria a schermo intero`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-obsidian/95 p-0 text-ice backdrop:bg-obsidian/90"
      >
        {full && current && (
          <div className="relative flex h-full w-full items-center justify-center" {...swipe}>
            <div className="relative h-[80vh] w-[94vw]">
              <VehicleImage src={current.src} alt={alt(i)} fill sizes="94vw" className="object-contain" />
            </div>
            <button type="button" onClick={() => setFull(false)} className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-line-strong" aria-label="Chiudi">
              <Close size={20} />
            </button>
            {n > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-obsidian/60" aria-label="Foto precedente">
                  <ArrowLeft size={20} />
                </button>
                <button type="button" onClick={() => go(1)} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-obsidian/60" aria-label="Foto successiva">
                  <ArrowRight size={20} />
                </button>
                <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm tabular text-silver">
                  {i + 1} / {n}
                </p>
              </>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
