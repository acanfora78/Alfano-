"use client";

import { useEffect, useRef } from "react";
import { loadGsap, reducedMotion, scheduleRefresh, whenNear } from "@/lib/motion";

/** Testo che si "accende" parola per parola seguendo lo scroll (leggibile anche senza JS). */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".sw-word");
    if (reducedMotion()) {
      words.forEach((w) => (w.style.color = "inherit"));
      return;
    }
    let cancelled = false;
    let revert = () => {};
    const target = el;
    let stopNear = () => {};
    if (target)
      stopNear = whenNear(target, () =>
        loadGsap().then(({ gsap }) => {
        if (cancelled) return;
        const ctx = gsap.context(() => {
          gsap.to(words, {
            color: "#f2f3f5",
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.4 },
          });
        });
        revert = () => ctx.revert();
      }).then(scheduleRefresh),
      );
    return () => {
      cancelled = true;
      stopNear();
      revert();
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="sw-word">
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
