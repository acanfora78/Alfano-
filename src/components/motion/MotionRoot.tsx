"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Motore di animazione unico per tutto il sito (~1 KB):
 * - [data-reveal]  → aggiunge .is-visible quando entra nel viewport
 * - [data-parallax] → aggiorna --p (-1…1) solo per gli elementi visibili
 * Rispetta prefers-reduced-motion e pulisce tutti i listener al cambio pagina.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.remove("no-js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            revealIO.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const visible = new Set<HTMLElement>();
    const parallaxIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(el);
        else visible.delete(el);
      }
      schedule();
    });

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of visible) {
        const host = (el.parentElement ?? el).getBoundingClientRect();
        const center = host.top + host.height / 2;
        const p = Math.max(-1, Math.min(1, (center - vh / 2) / (vh / 2 + host.height / 2)));
        el.style.setProperty("--p", p.toFixed(4));
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const scan = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((el) => {
        if (reduce) el.classList.add("is-visible");
        else revealIO.observe(el);
      });
      if (!reduce) root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => parallaxIO.observe(el));
    };

    scan(document);

    // Contenuti aggiunti dopo il primo render (filtri, "carica altri")
    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            if (n.matches("[data-reveal], [data-parallax]")) scan(n.parentElement ?? document);
            else scan(n);
          }
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    if (!reduce) {
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
    }

    return () => {
      revealIO.disconnect();
      parallaxIO.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
