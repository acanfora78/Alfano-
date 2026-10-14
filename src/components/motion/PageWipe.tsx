"use client";

import { useEffect, useState } from "react";

let firstRender = true;

/** Tendina con filo di luce a ogni cambio pagina (mai al primo caricamento). */
export function PageWipe() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      return;
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(t);
  }, []);
  return show ? <div aria-hidden className="page-wipe" /> : null;
}
