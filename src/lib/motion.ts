"use client";

import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

/**
 * Utilità condivise del sistema di movimento.
 * GSAP viene caricato in modo differito: non entra nel percorso critico di rendering.
 */

export type Gsap = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

let loading: Promise<Gsap> | null = null;

/**
 * GSAP serve solo alle scene guidate dallo scroll: viene caricato alla prima intenzione
 * dell'utente (scroll, rotella, tocco, tasto, mouse) dopo il load, o subito se la pagina
 * è già scrollata. Così nessun lavoro di setup pesa sul caricamento iniziale.
 */
function whenUserIntent() {
  return new Promise<void>((resolve) => {
    const events = ["scroll", "wheel", "touchstart", "keydown", "pointermove", "pointerdown"] as const;
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, go));
      resolve();
    };
    const arm = () => {
      if (window.scrollY > 0) return go();
      events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
  });
}

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
/** Ricalcola le posizioni di tutte le scene dopo un'inizializzazione tardiva (con debounce). */
export function scheduleRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh()), 120);
}

export function loadGsap(): Promise<Gsap> {
  if (!loading) {
    loading = whenUserIntent()
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
  const d = typeof document !== "undefined" ? document.documentElement.dataset : undefined;
  if (!d || (d.intro !== "play" && d.film !== "play" && d.film !== "skip")) return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("ac-intro-done", () => resolve(), { once: true }));
}

/**
 * Esegue `cb` quando l'elemento si avvicina al viewport (default: entro 1,5 schermate).
 * Le scene GSAP sotto la piega vengono create solo quando servono: meno lavoro al caricamento.
 */
export function whenNear(el: Element, cb: () => void, margin = "150% 0px") {
  // Scene già sopra o vicino al viewport (es. ricarica a metà pagina): subito,
  // così i pin non spostano mai contenuti visibili.
  if (el.getBoundingClientRect().top < window.innerHeight * 2.5) {
    cb();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin: margin },
  );
  io.observe(el);
  return () => io.disconnect();
}
