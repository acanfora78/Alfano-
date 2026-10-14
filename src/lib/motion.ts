"use client";

import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

/**
 * Utilità condivise del sistema di movimento.
 * GSAP viene caricato in modo differito: non entra nel percorso critico di rendering.
 */

export type Gsap = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

let loading: Promise<Gsap> | null = null;

/** Attende il caricamento della pagina e un momento di inattività del main thread. */
function whenIdle() {
  return new Promise<void>((resolve) => {
    const idle = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(() => resolve(), { timeout: 1500 }) : setTimeout(resolve, 200);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

export function loadGsap(): Promise<Gsap> {
  if (!loading) {
    loading = whenIdle()
      .then(() => Promise.all([import("gsap"), import("gsap/ScrollTrigger")]))
      .then(([g, s]) => {
        g.gsap.registerPlugin(s.ScrollTrigger);
        return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
      });
  }
  return loading;
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ── Velocità di scroll condivisa (px/frame, smussata) ─────────────────────
   Un solo ciclo rAF per tutto il sito, attivo solo con iscritti e scheda visibile. */

type Listener = (velocity: number, direction: 1 | -1) => void;
const listeners = new Set<Listener>();
let raf = 0;
let lastY = 0;
let smooth = 0;
let dir: 1 | -1 = 1;

function tick() {
  const y = window.scrollY;
  const delta = y - lastY;
  lastY = y;
  if (delta !== 0) dir = delta > 0 ? 1 : -1;
  smooth += (delta - smooth) * 0.18;
  listeners.forEach((fn) => fn(smooth, dir));
  raf = listeners.size && !document.hidden ? requestAnimationFrame(tick) : 0;
}

function start() {
  if (!raf && listeners.size && !document.hidden) {
    lastY = window.scrollY;
    raf = requestAnimationFrame(tick);
  }
}

if (typeof document !== "undefined") document.addEventListener("visibilitychange", start);

export function onScrollVelocity(fn: Listener) {
  listeners.add(fn);
  start();
  return () => {
    listeners.delete(fn);
    if (!listeners.size && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

/** Risolve quando l'intro cinematografica è terminata (o subito se non c'è). */
export function afterIntro(): Promise<void> {
  if (typeof document === "undefined" || document.documentElement.dataset.intro !== "play") return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("ac-intro-done", () => resolve(), { once: true }));
}
