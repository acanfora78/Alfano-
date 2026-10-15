"use client";

import { useEffect, useRef } from "react";

const KEY = "ac-intro-v2";
const DURATION = 3600;

/**
 * Sequenza d'ingresso "Ignition" (≈3,5 s, solo home, una volta per sessione):
 * linea d'orizzonte → la luce disegna il profilo di un'auto → accensione fari →
 * partenza con scie di velocità → apertura a serranda sull'hero.
 *
 * - CSS puro: parte al primo frame, senza attendere JavaScript.
 * - Lo script inline decide PRIMA del paint se mostrarla (nessun flash).
 * - Saltabile con click, tasto, rotella o tocco. Mai con prefers-reduced-motion.
 * - Illustrazione grafica generica: non rappresenta un veicolo in vendita.
 */
const decide = `try{var d=document.documentElement;if(!sessionStorage.getItem("${KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="play"}}catch(e){}`;

export function IntroIgnition() {
  const speedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro !== "play") return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* storage non disponibile */
    }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      root.dataset.intro = "done";
      window.dispatchEvent(new Event("ac-intro-done"));
    };
    const skip = () => {
      if (done || root.dataset.intro !== "play") return;
      root.dataset.intro = "skip";
      setTimeout(finish, 650);
    };

    // Tachimetro HUD 000 → 300
    const t0 = performance.now();
    let raf = requestAnimationFrame(function loop(t) {
      const p = Math.min(1, Math.max(0, (t - t0 - 300) / 2000));
      const eased = p < 1 ? 1 - Math.pow(1 - p, 3) : 1;
      if (speedRef.current) speedRef.current.textContent = String(Math.round(eased * 300)).padStart(3, "0");
      if (p < 1 && !done) raf = requestAnimationFrame(loop);
    });

    const timer = setTimeout(finish, DURATION);
    const opts = { passive: true, once: true } as const;
    window.addEventListener("wheel", skip, opts);
    window.addEventListener("touchstart", skip, opts);
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: decide }} />
      <div className="intro" aria-hidden onClick={() => document.documentElement.dataset.intro === "play" && (document.documentElement.dataset.intro = "skip")}>
        <div className="intro-shutter intro-shutter-top" />
        <div className="intro-shutter intro-shutter-bottom" />

        <div className="intro-stage">
          {/* HUD */}
          <div className="intro-hud intro-hud-tl">
            <span className="text-ion">●</span> Alfano Cars — sistema attivo
          </div>
          <div className="intro-hud intro-hud-tr tabular">
            <span ref={speedRef} className="font-display text-3xl text-ice sm:text-5xl">000</span>
            <span className="ml-2">km/h</span>
          </div>
          <div className="intro-hud intro-hud-bl tabular">40.7497° N · 14.5005° E — Pompei</div>

          <div className="intro-horizon" />

          {/* Profilo vettura tracciato dalla luce */}
          <div className="intro-car">
            <div className="intro-streaks">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} style={{ ["--i" as string]: i }} />
              ))}
            </div>
            <svg viewBox="0 0 1000 300" className="intro-svg" fill="none">
              <defs>
                <linearGradient id="intro-stroke" x1="0" x2="1">
                  <stop offset="0" stopColor="#8aafff" stopOpacity="0.2" />
                  <stop offset="0.55" stopColor="#f2f3f5" />
                  <stop offset="1" stopColor="#8aafff" />
                </linearGradient>
                <radialGradient id="intro-flare">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.25" stopColor="#cfe0ff" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#8aafff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g stroke="url(#intro-stroke)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path
                  className="intro-draw"
                  pathLength={1}
                  d="M60 222 L60 186 C60 166 72 156 96 151 L172 140 C232 96 302 70 402 64 L560 60 C642 62 704 90 762 128 C832 137 902 146 936 161 C956 169 963 186 961 205 L956 222 L872 222 A64 64 0 0 0 744 222 L294 222 A64 64 0 0 0 166 222 Z"
                />
                <path className="intro-draw intro-draw-2" pathLength={1} d="M232 138 C287 101 342 85 406 81 L548 78 C600 81 640 101 682 127 Z M472 80 L470 134" />
                <path className="intro-draw intro-draw-3" pathLength={1} d="M100 170 C380 168 650 170 930 178" />
                <circle className="intro-draw intro-draw-3" pathLength={1} cx="808" cy="222" r="50" />
                <circle className="intro-draw intro-draw-3" pathLength={1} cx="230" cy="222" r="50" />
                <circle className="intro-draw intro-draw-4" pathLength={1} cx="808" cy="222" r="26" />
                <circle className="intro-draw intro-draw-4" pathLength={1} cx="230" cy="222" r="26" />
              </g>
              {/* fari */}
              <g className="intro-lights">
                <ellipse cx="935" cy="164" rx="70" ry="40" fill="url(#intro-flare)" />
                <rect x="760" y="162" width="460" height="3" rx="1.5" fill="#cfe0ff" opacity="0.8" />
                <ellipse cx="78" cy="160" rx="26" ry="14" fill="url(#intro-flare)" opacity="0.55" />
              </g>
            </svg>
          </div>

          <p className="intro-claim font-display">Beyond the drive.</p>
        </div>

        <button type="button" tabIndex={-1} className="intro-skip">
          Salta intro
        </button>
      </div>
    </>
  );
}
