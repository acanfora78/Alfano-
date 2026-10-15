"use client";

import { useEffect, useRef } from "react";
import { afterIntro, finePointer, reducedMotion } from "@/lib/motion";

type Mote = { x: number; y: number; z: number; r: number; vx: number; vy: number; tw: number };

/**
 * Pulviscolo nei fasci di luce: movimento atmosferico continuo ma quasi impercettibile.
 * Tre piani di profondità con parallasse verso il puntatore. Canvas 2D a basso costo,
 * in pausa fuori viewport, con la scheda nascosta e con prefers-reduced-motion.
 */
export function AtmosphereDust({ className = "", density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let ready = false;
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    const n = Math.round((window.innerWidth < 768 ? 34 : 70) * density);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const motes: Mote[] = Array.from({ length: n }, () => {
      const z = Math.random();
      return { x: Math.random() * w, y: Math.random() * h, z, r: 0.4 + z * 1.6, vx: (Math.random() - 0.3) * 0.12, vy: -0.05 - Math.random() * 0.12, tw: Math.random() * Math.PI * 2 };
    });

    const frame = (t: number) => {
      raf = 0;
      px += (tx - px) * 0.04;
      py += (ty - py) * 0.04;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx * (0.4 + m.z);
        m.y += m.vy * (0.4 + m.z);
        if (m.y < -10) m.y = h + 10;
        if (m.x < -10) m.x = w + 10;
        if (m.x > w + 10) m.x = -10;
        const a = (0.15 + m.z * 0.45) * (0.6 + 0.4 * Math.sin(t / 900 + m.tw));
        ctx.globalAlpha = a;
        ctx.fillStyle = m.z > 0.82 ? "#cfe0ff" : "#f2f3f5";
        ctx.beginPath();
        ctx.arc(m.x + px * (m.z * 28), m.y + py * (m.z * 18), m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (ready && visible && !raf && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      play();
    });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    if (finePointer()) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", play);
    afterIntro().then(() => {
      ready = true;
      play();
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", play);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
