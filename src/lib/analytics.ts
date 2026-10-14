"use client";

/**
 * Tracking eventi rispettoso del consenso.
 * Gli eventi vengono inviati a GA4 solo se NEXT_PUBLIC_GA_ID è configurato
 * E l'utente ha accettato i cookie analitici. In caso contrario sono ignorati.
 */

export type AnalyticsEvent =
  | "vehicle_view"
  | "contact_click"
  | "whatsapp_click"
  | "phone_click"
  | "form_start"
  | "form_submit_success"
  | "catalog_filter";

export const CONSENT_KEY = "ac-consent-v1";
export type Consent = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(c: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, c);
  } catch {
    /* storage non disponibile: il banner verrà riproposto */
  }
  window.dispatchEvent(new CustomEvent("ac-consent", { detail: c }));
}

export function track(event: AnalyticsEvent, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_GA_ID || readConsent() !== "granted") return;
  window.gtag?.("event", event, params);
}
