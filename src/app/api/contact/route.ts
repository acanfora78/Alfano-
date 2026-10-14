import { NextResponse, type NextRequest } from "next/server";
import { business, siteUrl } from "@/config/site";
import { normalizePayload, validateContact, type ContactPayload } from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Rate limit in memoria (per istanza): CONTACT_RATE_LIMIT (default 5) richieste / 10 minuti per IP ── */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = Number(process.env.CONTACT_RATE_LIMIT || 5);
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_HITS;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function summary(p: ContactPayload) {
  return [
    ["Nome", p.name],
    ["Telefono", p.phone],
    ["Email", p.email],
    ["Argomento", p.topic],
    ["Veicolo", p.vehicle],
    ["Pagina veicolo", p.vehicleUrl],
    ["Messaggio", p.message],
  ].filter(([, v]) => v) as [string, string][];
}

async function deliverResend(p: ContactPayload) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || business.email;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) return null;
  const rows = summary(p);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: p.email || undefined,
      subject: `Nuova richiesta dal sito${p.vehicle ? ` — ${p.vehicle}` : ""} (${p.name})`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
        .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top"><b>${esc(k)}</b></td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
        .join("")}</table>`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend HTTP ${res.status}: ${await res.text().catch(() => "")}`);
  return true;
}

async function deliverWebhook(p: ContactPayload) {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return null;
  const token = process.env.CONTACT_WEBHOOK_TOKEN;
  const { website: _hp, startedAt: _t, ...data } = p;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ ...data, source: siteUrl, receivedAt: new Date().toISOString() }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Webhook HTTP ${res.status}`);
  return true;
}

export async function POST(req: NextRequest) {
  // Protezione CSRF: accetta solo richieste dallo stesso host
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited", message: "Troppe richieste. Riprova tra qualche minuto." }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const p = normalizePayload(raw);

  // Anti-spam: honeypot e tempo minimo di compilazione
  const elapsed = Date.now() - p.startedAt;
  if (p.website || elapsed < 2500 || elapsed > 24 * 3600 * 1000) {
    return NextResponse.json({ ok: false, error: "spam", message: "Richiesta non valida. Ricarica la pagina e riprova." }, { status: 400 });
  }

  const errors = validateContact(p);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, error: "validation", errors }, { status: 422 });

  // Solo URL interni per il riferimento al veicolo
  if (p.vehicleUrl && !p.vehicleUrl.startsWith(siteUrl) && !p.vehicleUrl.startsWith("/")) p.vehicleUrl = "";

  try {
    const results = await Promise.all([deliverResend(p), deliverWebhook(p)]);
    if (results.every((r) => r === null)) {
      console.error("[contatti] Nessuna destinazione configurata (RESEND_API_KEY/CONTACT_FROM_EMAIL o CONTACT_WEBHOOK_URL).");
      return NextResponse.json(
        { ok: false, error: "not_configured", message: "Il modulo online non è ancora attivo. Contattaci su WhatsApp o per telefono." },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contatti] invio fallito:", err);
    return NextResponse.json(
      { ok: false, error: "delivery_failed", message: "Invio non riuscito. Riprova o contattaci su WhatsApp." },
      { status: 502 },
    );
  }
}
