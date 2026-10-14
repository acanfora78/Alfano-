"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { telUrl, whatsappUrl } from "@/config/site";
import { track } from "@/lib/analytics";
import { normalizePayload, TOPICS, validateContact, type FieldErrors } from "@/lib/contact";
import { Alert, ArrowRight, Check, Phone, WhatsApp } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({
  vehicle,
  vehicleUrl,
  defaultTopic,
  compact = false,
}: {
  vehicle?: string;
  vehicleUrl?: string;
  defaultTopic?: string;
  compact?: boolean;
}) {
  const id = useId();
  const startedAt = useRef(Date.now());
  const started = useRef(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMsg, setServerMsg] = useState("");
  const [fallbackText, setFallbackText] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    startedAt.current = Math.min(startedAt.current, Date.now());
    track("form_start", { vehicle });
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = normalizePayload({
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      topic: fd.get("topic") ?? "",
      vehicle: vehicle ?? fd.get("vehicle") ?? "",
      vehicleUrl: vehicleUrl ?? "",
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      website: fd.get("website"),
      startedAt: startedAt.current,
    });
    const errs = validateContact(payload);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0] === "contact" ? "phone" : Object.keys(errs)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setFallbackText(
      `Buongiorno, sono ${payload.name}.${payload.vehicle ? ` Vorrei informazioni su: ${payload.vehicle}.` : ""}\n${payload.message}`,
    );
    setStatus("sending");
    setServerMsg("");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        track("form_submit_success", { vehicle: payload.vehicle || undefined, topic: payload.topic || undefined });
      } else {
        if (data.errors) setErrors(data.errors);
        setServerMsg(data.message || "Invio non riuscito. Riprova o contattaci su WhatsApp.");
        setStatus("error");
      }
    } catch {
      setServerMsg("Connessione non disponibile. Controlla la rete e riprova, oppure contattaci su WhatsApp.");
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-line bg-graphite/70 p-8 text-center outline-none sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ok/40 text-ok">
          <Check size={26} />
        </span>
        <h3 className="mt-6 font-display text-2xl">Richiesta inviata</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-silver">
          Grazie. Abbiamo ricevuto il tuo messaggio e ti ricontatteremo al più presto negli orari di apertura.
        </p>
      </div>
    );
  }

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="mt-2 flex items-center gap-1.5 text-xs text-danger">
        <Alert size={14} /> {errors[k]}
      </p>
    ) : null;
  const describedBy = (...ks: (keyof FieldErrors)[]) => ks.filter((k) => errors[k]).map((k) => `${id}-${k}-err`).join(" ") || undefined;

  return (
    <form noValidate onSubmit={onSubmit} onInput={onFirstInput} className="space-y-5" aria-describedby={`${id}-note`}>
      {/* Honeypot anti-spam: invisibile agli utenti */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Lascia vuoto questo campo</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="eyebrow mb-2 block text-[0.62rem]">
          Nome e cognome *
        </label>
        <input id={`${id}-name`} name="name" autoComplete="name" required className="field" aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
        {err("name")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-phone`} className="eyebrow mb-2 block text-[0.62rem]">
            Telefono
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="field tabular"
            aria-invalid={!!(errors.phone || errors.contact)}
            aria-describedby={describedBy("phone", "contact")}
          />
          {err("phone")}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="eyebrow mb-2 block text-[0.62rem]">
            Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="field"
            aria-invalid={!!(errors.email || errors.contact)}
            aria-describedby={describedBy("email", "contact")}
          />
          {err("email")}
        </div>
      </div>
      {err("contact")}

      {vehicle ? (
        <div className="rounded-xl border border-line bg-obsidian/40 px-4 py-3 text-sm">
          <span className="eyebrow mr-2 text-[0.6rem]">Veicolo</span> {vehicle}
        </div>
      ) : (
        !compact && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-topic`} className="eyebrow mb-2 block text-[0.62rem]">
                Argomento
              </label>
              <select id={`${id}-topic`} name="topic" className="field" defaultValue={defaultTopic ?? ""}>
                <option value="">Seleziona</option>
                {TOPICS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-vehicle`} className="eyebrow mb-2 block text-[0.62rem]">
                Veicolo di interesse
              </label>
              <input id={`${id}-vehicle`} name="vehicle" className="field" placeholder="Es. SUV, Alfa Romeo Stelvio…" />
            </div>
          </div>
        )
      )}

      <div>
        <label htmlFor={`${id}-message`} className="eyebrow mb-2 block text-[0.62rem]">
          Messaggio *
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={compact ? 3 : 5}
          required
          className="field resize-y"
          defaultValue={vehicle ? `Buongiorno, vorrei ricevere informazioni su ${vehicle}.` : ""}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
        />
        {err("message")}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-silver">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-5 w-5 shrink-0 accent-[#8aafff]"
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
          />
          <span>
            Ho letto l&apos;
            <Link href="/privacy-policy/" className="text-ice underline underline-offset-4" target="_blank">
              informativa privacy
            </Link>{" "}
            e acconsento al trattamento dei dati per essere ricontattato (Reg. UE 2016/679). *
          </span>
        </label>
        {err("consent")}
      </div>

      <div ref={statusRef} tabIndex={-1} className="outline-none" aria-live="polite">
        {status === "error" && (
          <div role="alert" className="rounded-xl border border-danger/40 bg-danger/5 p-4 text-sm">
            <p className="flex items-start gap-2 text-ice">
              <Alert size={18} className="mt-0.5 shrink-0 text-danger" /> {serverMsg}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <TrackedLink href={whatsappUrl(fallbackText)} event="whatsapp_click" eventParams={{ location: "form_fallback" }} className="btn btn-primary btn-sm">
                <WhatsApp size={16} /> Invia su WhatsApp
              </TrackedLink>
              <TrackedLink href={telUrl()} event="phone_click" eventParams={{ location: "form_fallback" }} className="btn btn-ghost btn-sm">
                <Phone size={16} /> Chiama
              </TrackedLink>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${id}-note`} className="text-xs text-silver">
          * Campi obbligatori. Indica almeno telefono o email.
        </p>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? "Invio in corso…" : "Invia richiesta"} <ArrowRight size={16} className="btn-arrow" />
        </button>
      </div>
    </form>
  );
}
