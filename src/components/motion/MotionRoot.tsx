"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Motore di animazione DOM unico per tutto il sito:
 * - [data-reveal]  → aggiunge .is-visible quando entra nel viewport
 * - [data-parallax] → aggiorna --p (-1…1) solo per gli elementi visibili
 * - [data-tilt] / [data-magnetic] → inclinazione 3D e attrazione verso il cursore
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

    /* ── Cursore: card con inclinazione 3D + riflesso, pulsanti magnetici ── */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let tilt: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;
    const release = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.transition = "transform .8s cubic-bezier(.16,1,.3,1)";
      el.style.transform = "";
      setTimeout(() => {
        if (el !== tilt && el !== magnet) el.style.transition = "";
      }, 800);
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const t = target?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (t !== tilt) {
        release(tilt);
        tilt = t;
      }
      if (tilt && tilt.classList.contains("is-visible")) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        tilt.style.transition = "transform .25s ease-out";
        tilt.style.transform = `perspective(1100px) rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 9).toFixed(2)}deg) translate3d(0,-6px,0)`;
        tilt.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        tilt.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      }
      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) {
        release(magnet);
        magnet = m;
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        magnet.style.transition = "transform .3s cubic-bezier(.16,1,.3,1)";
        magnet.style.transform = `translate3d(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.35).toFixed(1)}px, 0)`;
      }
    };
    const onLeave = () => {
      release(tilt);
      release(magnet);
      tilt = magnet = null;
    };
    if (fine && !reduce) {
      document.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      revealIO.disconnect();
      parallaxIO.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
