/** Validazione condivisa client/server del modulo contatti. */

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  vehicleUrl: string;
  topic: string;
  message: string;
  consent: boolean;
  /** honeypot: deve restare vuoto */
  website: string;
  /** timestamp di apertura del modulo (anti-bot) */
  startedAt: number;
};

export type FieldErrors = Partial<Record<"name" | "phone" | "email" | "contact" | "message" | "consent", string>>;

export const TOPICS = ["Acquisto auto", "Noleggio auto", "Noleggio con conducente", "Auto per eventi", "Noleggio furgoni", "Moto, e-bike, quad", "Tour in barca", "Altro"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s().-]{6,20}$/;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function normalizePayload(raw: unknown): ContactPayload {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: str(r.name, 120),
    phone: str(r.phone, 30),
    email: str(r.email, 160),
    vehicle: str(r.vehicle, 160),
    vehicleUrl: str(r.vehicleUrl, 300),
    topic: str(r.topic, 60),
    message: str(r.message, 2000),
    consent: r.consent === true,
    website: str(r.website, 200),
    startedAt: typeof r.startedAt === "number" ? r.startedAt : 0,
  };
}

export function validateContact(p: ContactPayload): FieldErrors {
  const e: FieldErrors = {};
  if (p.name.length < 2) e.name = "Inserisci il tuo nome.";
  if (!p.phone && !p.email) e.contact = "Indica almeno un telefono o un'email per essere ricontattato.";
  if (p.phone && !PHONE_RE.test(p.phone)) e.phone = "Numero di telefono non valido.";
  if (p.email && !EMAIL_RE.test(p.email)) e.email = "Indirizzo email non valido.";
  if (p.message.length < 5) e.message = "Scrivi un breve messaggio.";
  if (!p.consent) e.consent = "Per inviare la richiesta è necessario accettare l'informativa privacy.";
  return e;
}
