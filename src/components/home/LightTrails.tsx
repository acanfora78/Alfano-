"use client";

import { useEffect, useRef } from "react";
import { afterIntro, onScrollVelocity, reducedMotion } from "@/lib/motion";

type Trail = { x: number; y: number; len: number; speed: number; alpha: number; width: number; ion: boolean; dir: 1 | -1 };

/**
 * Scie di luce che attraversano l'hero come auto in corsa di notte.
 * Accelerano con la velocità di scroll. Canvas 2D leggero:
 * DPR limitato a 1,5, in pausa fuori viewport o con la scheda nascosta,
 * disattivato con prefers-reduced-motion.
 */
export function LightTrails({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let boost = 0;
    let visible = true;
    let ready = false;
    let raf = 0;
    const count = window.innerWidth < 768 ? 14 : 30;

    const spawn = (t: Partial<Trail> = {}): Trail => {
      const dir: 1 | -1 = Math.random() < 0.72 ? -1 : 1; // la maggior parte "incrocia" da destra
      const lane = Math.random();
      return {
        x: dir === -1 ? w + Math.random() * w : -Math.random() * w,
        y: h * (0.25 + lane * 0.72),
        len: 60 + Math.random() * 320 * (0.4 + lane),
        speed: (3 + Math.random() * 9) * (0.5 + lane),
        alpha: 0.12 + Math.random() * 0.4,
        width: 0.6 + lane * 1.6,
        ion: Math.random() < 0.3,
        dir,
        ...t,
      };
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const trails = Array.from({ length: count }, () => spawn({ x: Math.random() * w }));

    const frame = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const k = 1 + boost;
      for (const t of trails) {
        t.x += t.speed * k * t.dir;
        const tail = t.len * (1 + boost * 0.6);
        const x2 = t.x - tail * t.dir;
        const g = ctx.createLinearGradient(t.x, 0, x2, 0);
        const c = t.ion ? "138,175,255" : "242,243,245";
        g.addColorStop(0, `rgba(${c},${Math.min(1, t.alpha * (1 + boost * 0.5))})`);
        g.addColorStop(1, `rgba(${c},0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = t.width;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(x2, t.y);
        ctx.stroke();
        if ((t.dir === -1 && x2 < -20) || (t.dir === 1 && x2 > w + 20)) Object.assign(t, spawn());
      }
      boost *= 0.94;
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    // Non anima dietro l'overlay opaco dell'intro
    const play = () => {
      if (ready && !raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    afterIntro().then(() => {
      ready = true;
      play();
    });

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      play();
    });
    io.observe(canvas);
    const off = onScrollVelocity((v) => {
      boost = Math.min(6, Math.max(boost, Math.abs(v) / 6));
    });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", play);
    play();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      off();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", play);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
