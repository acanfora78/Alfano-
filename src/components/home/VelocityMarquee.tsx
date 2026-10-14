"use client";

import { useEffect, useRef } from "react";
import { onScrollVelocity, reducedMotion } from "@/lib/motion";

/**
 * Fascia tipografica cinetica: scorre in continuo, accelera con lo scroll
 * e cambia direzione con il verso di scorrimento. In pausa fuori viewport.
 */
export function VelocityMarquee({ words, className = "" }: { words: string[]; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || !wrap.current || reducedMotion()) return;
    let x = 0;
    let dir = -1;
    let boost = 0;
    let visible = false;
    let raf = 0;

    const loop = () => {
      raf = 0;
      const half = el.scrollWidth / 2;
      x += (0.6 + boost) * dir;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${(-boost * dir * 0.9).toFixed(2)}deg)`;
      boost *= 0.92;
      if (visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      play();
    });
    io.observe(wrap.current);
    const off = onScrollVelocity((v, d) => {
      if (!visible) return;
      dir = d === 1 ? -1 : 1;
      boost = Math.min(14, Math.max(boost, Math.abs(v) * 0.35));
    });
    document.addEventListener("visibilitychange", play);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      off();
      document.removeEventListener("visibilitychange", play);
    };
  }, []);

  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={i} className="flex items-center">
          <span className={`px-[3vw] ${i % 2 ? "text-outline" : "text-ice"}`}>{w}</span>
          <span className="h-[0.12em] w-[0.12em] rounded-full bg-ion" />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={wrap} aria-hidden className={`overflow-hidden border-y border-line py-6 sm:py-10 ${className}`}>
      <div ref={track} className="marquee-track font-display text-[15vw] font-medium leading-none tracking-[-0.04em] sm:text-[9vw]">
        {row}
        {row}
      </div>
    </div>
  );
}
