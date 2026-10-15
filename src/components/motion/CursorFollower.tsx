"use client";

import { useEffect, useRef } from "react";
import { finePointer, reducedMotion } from "@/lib/motion";

export const NO_POINTER_FX = "ac-no-pointer-fx";

/**
 * Anello che segue il puntatore (solo desktop). Il cursore nativo resta sempre visibile:
 * l'anello aggiunge feedback su link e media ([data-cursor="Etichetta"]).
 * Disattivabile dal footer ("Effetti cursore") e con prefers-reduced-motion.
 */
export function CursorFollower() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(NO_POINTER_FX) === "1") document.documentElement.classList.add("no-motion");
    } catch {
      /* storage non disponibile */
    }
    const el = ring.current;
    if (!el || reducedMotion() || !finePointer()) return;
    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let raf = 0;
    let mode = "";

    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const setMode = (m: string, text = "") => {
      if (m === mode && text === label.current?.textContent) return;
      mode = m;
      el.classList.toggle("is-label", m === "label");
      el.classList.toggle("is-link", m === "link");
      if (label.current) label.current.textContent = text;
    };
    const classify = (t: Element | null) => {
      if (t?.closest("input, textarea, select")) el.classList.remove("is-on");
      else if (t?.closest("a, button, [role='button'], label")) setMode("link");
      else {
        const media = t?.closest<HTMLElement>("[data-cursor]");
        if (media) setMode("label", media.dataset.cursor);
        else setMode("");
      }
    };
    const onMove = (e: PointerEvent) => {
      if (document.documentElement.classList.contains("no-motion")) {
        el.classList.remove("is-on");
        return;
      }
      x = e.clientX;
      y = e.clientY;
      el.classList.add("is-on");
      classify(e.target as Element | null);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    // Scorrendo senza muovere il mouse il contenuto sotto il puntatore cambia: aggiorna l'etichetta
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf || !el.classList.contains("is-on")) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        classify(document.elementFromPoint(x, y));
      });
    };
    const onLeave = () => el.classList.remove("is-on");
    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ring} aria-hidden className="cursor-ring">
      <span ref={label} />
    </div>
  );
}

/** Interruttore per gli effetti legati al puntatore (cursore, inclinazioni, magnetismo). */
export function PointerFxToggle() {
  return (
    <li className="hidden [@media(hover:hover)_and_(pointer:fine)]:list-item">
      <button
        type="button"
        className="link-line hover:text-ice"
        onClick={(e) => {
          const off = document.documentElement.classList.toggle("no-motion");
          try {
            localStorage.setItem(NO_POINTER_FX, off ? "1" : "0");
          } catch {
            /* storage non disponibile */
          }
          e.currentTarget.textContent = off ? "Effetti cursore: off" : "Effetti cursore: on";
        }}
      >
        Effetti cursore
      </button>
    </li>
  );
}
