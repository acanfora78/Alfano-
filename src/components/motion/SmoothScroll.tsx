"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type Lenis from "lenis";
import { finePointer, loadGsap, reducedMotion } from "@/lib/motion";

/**
 * Scroll fluido "cinematografico" (Lenis) sincronizzato con GSAP ScrollTrigger.
 * Solo desktop con puntatore preciso: su touch resta lo scroll nativo.
 * Disattivato con prefers-reduced-motion.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion() || !finePointer()) return;
    let cancelled = false;
    let cleanup = () => {};

    Promise.all([import("lenis"), loadGsap()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      const lenis = new LenisCtor({ lerp: 0.085, wheelMultiplier: 0.95, anchors: { offset: -88 } });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      // Si ferma quando un pannello blocca lo scroll (menu, galleria a schermo intero)
      const mo = new MutationObserver(() => {
        if (document.body.style.overflow === "hidden") lenis.stop();
        else lenis.start();
      });
      mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

      cleanup = () => {
        mo.disconnect();
        gsap.ticker.remove(raf);
        lenis.destroy();
        lenisRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  // Nuova pagina: riparte dall'alto senza animazione
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
