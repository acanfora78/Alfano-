import { NextResponse, type NextRequest } from "next/server";

/**
 * Bonifica SEO post-compromissione WordPress.
 *
 * Il vecchio sito è stato usato per pubblicare oltre 1.100 articoli/pagine di
 * spam (casinò, scommesse) e link esterni nascosti. Questi URL rispondono ora
 * 410 Gone + noindex, così i motori di ricerca li rimuovono più rapidamente.
 * Gli URL legittimi (home, privacy, noleggio, tour in barca) restano attivi.
 */

const GONE_PATTERNS: RegExp[] = [
  /^\/\d{4}(\/\d{2}){0,2}(\/.*)?$/, // archivi e articoli WordPress /AAAA/MM/GG/slug/
  /^\/(category|tag|author|comments)(\/.*)?$/,
  /^\/(.*\/)?feed\/?$/,
  /^\/sitemap\.rss$/,
  /^\/(wp-json|wp-admin|wp-includes|wp-content)(\/.*)?$/,
  /^\/(xmlrpc|wp-login|wp-cron|wp-signup|wp-trackback)\.php$/,
  /^\/(sitemap_index|post-sitemap|page-sitemap|category-sitemap|author-sitemap|wp-sitemap)[\w-]*\.xml$/,
];

const SPAM_WORDS =
  /(casino|kasino|kasyno|casin[oò]|kas[ií]n|igralnic|bonus|bet365|\bbet\b|-bet-|betting|slot|spins?\b|jackpot|vegazone|wager|poker|roulette|blackjack|zaklad|zakład|spel|lotto|gambl)/i;

const KNOWN_SEGMENTS = new Set([
  "stock-auto",
  "servizi",
  "chi-siamo",
  "contatti",
  "privacy-policy",
  "cookie-policy",
  "noleggio-auto-breve-lungo-termine-pompei",
  "tour-barca-noleggio-imbarcazioni-pompei",
]);

function safeDecode(s: string) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function gone() {
  return new NextResponse(
    '<!doctype html><html lang="it"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Contenuto rimosso</title><body style="background:#08090b;color:#f2f3f5;font-family:system-ui;padding:3rem"><h1>410 — Contenuto rimosso</h1><p>Questa pagina non esiste più. <a style="color:#8aafff" href="/">Vai alla home di Alfano Cars</a>.</p></body></html>',
    { status: 410, headers: { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "public, max-age=3600" } },
  );
}

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Vecchi permalink WordPress (?p=123, ?page_id=…, ?cat=…) e ricerche spam (?s=…)
  if (pathname === "/" && (searchParams.has("p") || searchParams.has("page_id") || searchParams.has("cat") || searchParams.has("author"))) {
    return gone();
  }
  if (pathname === "/" && searchParams.has("s")) {
    return NextResponse.redirect(new URL("/", req.url), 301);
  }

  if (GONE_PATTERNS.some((re) => re.test(pathname))) return gone();

  // Pagine spam pubblicate alla radice (es. /jak-dzialaja-punkty-...-kasyno/)
  const firstSegment = pathname.split("/")[1] ?? "";
  if (firstSegment && !KNOWN_SEGMENTS.has(firstSegment) && SPAM_WORDS.test(safeDecode(pathname))) return gone();

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|images/|favicon|icon|apple-icon|og-image|robots\\.txt|sitemap\\.xml|manifest).*)"],
};
