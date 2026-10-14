"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { business, nav, primaryPhone, primaryWhatsApp, telUrl, whatsappUrl } from "@/config/site";
import { ArrowUpRight, Close, Phone, WhatsApp } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Chiude il menu al cambio pagina
  useEffect(() => setOpen(false), [pathname]);

  // Blocca lo scroll, gestisce Esc e il focus quando il menu è aperto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const a = items[0];
        const b = items[items.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled || open;

  return (
    <>
      <a
        href="#contenuto"
        className="fixed left-4 top-3 z-[70] -translate-y-20 rounded-full bg-ice px-4 py-2 text-sm font-medium text-obsidian focus:translate-y-0"
      >
        Vai al contenuto
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ${
          solid ? "border-b border-line bg-obsidian/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Logo priority />

          <nav aria-label="Navigazione principale" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`link-line pb-1 text-[0.8rem] font-medium uppercase tracking-[0.18em] transition-colors ${
                      isActive(item.href) ? "text-ice" : "text-silver hover:text-ice"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <TrackedLink
              href={telUrl()}
              event="phone_click"
              eventParams={{ location: "header" }}
              className="hidden items-center gap-2 px-3 text-sm text-silver transition-colors hover:text-ice xl:inline-flex tabular"
            >
              <Phone size={16} /> {primaryPhone.display}
            </TrackedLink>
            <Link href="/contatti/" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Richiedi informazioni
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line-strong lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Chiudi il menu" : "Apri il menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">Menu</span>
              <span
                aria-hidden
                className={`absolute h-px w-5 bg-ice transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`}
              />
              <span
                aria-hidden
                className={`absolute h-px w-5 bg-ice transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Pannello mobile */}
      <div
        id="menu-mobile"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
        hidden={!open}
        className="fixed inset-0 z-40 bg-obsidian/95 pt-[var(--header-h)] backdrop-blur-2xl lg:hidden"
      >
        <div className="container-x flex h-full flex-col justify-between overflow-y-auto pb-8 pt-6">
          <nav aria-label="Navigazione mobile">
            <ul className="divide-y divide-line border-y border-line">
              {nav.map((item, i) => (
                <li key={item.href} className="hero-fade" style={{ ["--d" as string]: `${80 + i * 60}ms` }}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex items-center justify-between py-5 font-display text-3xl tracking-tight"
                  >
                    <span className={isActive(item.href) ? "text-ice" : "text-ice/80"}>{item.label}</span>
                    <span className="text-xs tabular text-silver">0{i + 1}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hero-fade mt-10 space-y-3" style={{ ["--d" as string]: "420ms" }}>
            <TrackedLink
              href={whatsappUrl("Buongiorno Alfano Cars, vorrei ricevere informazioni.")}
              event="whatsapp_click"
              eventParams={{ location: "menu_mobile" }}
              className="btn btn-primary w-full"
            >
              <WhatsApp size={18} /> Scrivici su WhatsApp
            </TrackedLink>
            <TrackedLink href={telUrl()} event="phone_click" eventParams={{ location: "menu_mobile" }} className="btn btn-ghost w-full">
              <Phone size={18} /> Chiama {primaryWhatsApp.display}
            </TrackedLink>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost w-full">
              <Close size={16} /> Chiudi
            </button>
            <p className="pt-4 text-center text-xs text-silver">
              {business.address.street} · {business.address.city} <ArrowUpRight size={12} className="inline" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
