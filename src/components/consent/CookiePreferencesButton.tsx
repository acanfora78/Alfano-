"use client";

/** Mostrato solo se è configurato un servizio di analytics (unico uso di cookie non tecnici). */
export function CookiePreferencesButton() {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  return (
    <li>
      <button
        type="button"
        className="link-line hover:text-ice"
        onClick={() => window.dispatchEvent(new CustomEvent("ac-open-consent"))}
      >
        Preferenze cookie
      </button>
    </li>
  );
}
