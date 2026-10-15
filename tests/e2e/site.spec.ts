import { expect, test, type Page } from "@playwright/test";

// Nei test funzionali l'intro è già "vista" (ha test dedicati in fondo)
test.beforeEach(async ({ page }, info) => {
  if (!info.title.startsWith("intro")) await page.addInitScript(() => sessionStorage.setItem("ac-intro-v2", "1"));
});

const routes = ["/", "/stock-auto/", "/servizi/", "/chi-siamo/", "/contatti/", "/privacy-policy/", "/cookie-policy/", "/noleggio-auto-breve-lungo-termine-pompei/", "/tour-barca-noleggio-imbarcazioni-pompei/", "/stock-auto/alfa-romeo-stelvio-2-2-turbo-diesel-160-cv-at8-q4-qa-2021-qa-1/"];

/** Errori JS e risposte HTTP fallite, esclusa l'immagine volutamente rotta della fixture QA. */
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && !m.text().startsWith("Failed to load resource") && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => r.status() >= 400 && !r.url().includes("does-not-exist") && errors.push(`${r.status()} ${r.url()}`));
  return errors;
}

for (const r of routes) {
  test(`${r} — si carica senza errori e senza overflow orizzontale`, async ({ page }) => {
    const errors = collectErrors(page);
    const res = await page.goto(r);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    await page.mouse.wheel(0, 4000);
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("home: hero, CTA e tutte le scene principali", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Beyond the drive" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Scopri le vetture/i }).first()).toHaveAttribute("href", "/stock-auto/");
  for (const name of [/Beyond the ordinary/i, /La tua prossima auto/i, /Lo showroom/i, /Ogni dettaglio/i, /Mobilità/i, /Qualità e professionalità/i, /La prossima scelta/i]) {
    await expect(page.getByRole("heading", { name }).first()).toBeAttached();
  }
  await expect(page.locator("#final-title")).toBeAttached();
  const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(ld!)["@type"]).toBe("AutoDealer");
});

test("home senza JavaScript: contenuti e CTA restano visibili", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/");
  await expect(page.getByRole("heading", { level: 1, name: "Beyond the drive" })).toBeVisible();
  await expect(page.getByText("Oltre la vendita")).toBeVisible();
  await expect(page.locator("#final-title")).toBeVisible();
  await ctx.close();
});

test("catalogo: ricerca, filtri, ordinamento e reset funzionano davvero", async ({ page }) => {
  await page.goto("/stock-auto/");
  const cards = page.locator("article.card");
  await expect(cards).toHaveCount(7); // la vettura "venduta" e quella non valida sono escluse

  await page.getByPlaceholder("Cerca marca o modello").fill("jeep");
  await expect(cards).toHaveCount(1);
  await expect(page).toHaveURL(/q=jeep/);

  await page.getByRole("button", { name: /Rimuovi filtro/ }).click();
  await expect(cards).toHaveCount(7);

  const toggle = page.getByRole("button", { name: /^Filtri/ });
  if (await toggle.isVisible()) await toggle.click();
  await page.getByLabel("Prezzo massimo").locator("visible=true").selectOption("15000");
  await expect(page).toHaveURL(/prezzo_max=15000/);
  await expect(cards).toHaveCount(1);

  await page.goto("/stock-auto/?ordina=prezzo-desc");
  await expect(cards.first()).toContainText("Stelvio");
  await page.goto("/stock-auto/?q=nonesiste");
  await expect(page.getByText("Nessuna vettura corrisponde ai filtri")).toBeVisible();
});

test("scheda vettura: galleria, contatti contestualizzati, dati strutturati", async ({ page }) => {
  await page.goto("/stock-auto/");
  await page.locator("article.card", { hasText: "Stelvio" }).getByRole("link").click();
  await expect(page).toHaveURL(/\/stock-auto\/alfa-romeo-stelvio/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Stelvio");
  await expect(page.getByText("31.900 €").first()).toBeVisible();

  const counter = page.getByText(/^1 \/ 4$/);
  await expect(counter).toBeVisible();
  await page.getByRole("button", { name: "Foto successiva" }).first().click();
  await expect(page.getByText(/^2 \/ 4$/)).toBeVisible();

  const wa = page.getByRole("link", { name: /Chiedi su WhatsApp/ });
  expect(decodeURIComponent((await wa.getAttribute("href"))!)).toContain("Alfa Romeo Stelvio");
  const lds = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(lds.some((s) => JSON.parse(s)["@type"] === "Car" && JSON.parse(s).offers.price === 31900)).toBe(true);
});

test("immagine mancante: segnaposto al posto dell'immagine rotta", async ({ page }) => {
  await page.goto("/stock-auto/?q=q3");
  await expect(page.getByText("Foto in arrivo")).toBeVisible();
});

test("modulo contatti: validazione e nessun invio simulato senza backend", async ({ page }) => {
  await page.goto("/contatti/");
  await page.getByRole("button", { name: /Invia richiesta/ }).click();
  await expect(page.getByText("Inserisci il tuo nome.")).toBeVisible();
  await expect(page.getByText(/accettare l'informativa/)).toBeVisible();

  await page.getByLabel("Nome e cognome *").fill("Test QA");
  await page.getByLabel("Telefono").fill("+39 333 0000000");
  await page.getByLabel("Messaggio *").fill("Messaggio di prova automatica");
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(2700); // soglia anti-bot
  await page.getByRole("button", { name: /Invia richiesta/ }).click();
  // In assenza di destinazione configurata il server risponde 503 e propone WhatsApp
  await expect(page.getByRole("alert").filter({ hasText: /modulo|invio/i })).toContainText(/non è ancora attivo|non riuscito/);
  await expect(page.getByRole("link", { name: /Invia su WhatsApp/ })).toBeVisible();
});

test("menu mobile accessibile", async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto("/", { waitUntil: "networkidle" }); // pulsante attivo dopo l'hydration
  await page.getByRole("button", { name: "Apri il menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Menu di navigazione" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "Apri il menu" }).click();
  await dialog.getByRole("link", { name: /Servizi/ }).click();
  await expect(page).toHaveURL(/\/servizi\/$/);
});

test("URL spam del vecchio sito rispondono 410, pagine inesistenti 404", async ({ request }) => {
  expect((await request.get("/2026/10/08/m-199/", { maxRedirects: 0 })).status()).toBe(410);
  expect((await request.get("/jak-dzialaja-punkty-i-nagrody-w-vegazone-online-kasyno/")).status()).toBe(410);
  expect((await request.get("/stock-auto/vettura-inesistente/")).status()).toBe(404);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
});

test("nessun overflow orizzontale a 320 px (schermi stretti)", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const r of routes) {
    await page.goto(r);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, r).toBeLessThanOrEqual(0);
  }
});

test("intro: si avvia alla prima visita, si può saltare e non riparte nella stessa sessione", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" }); // listener attivi dopo l'hydration
  await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
  await expect(page.locator(".intro-svg")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 2000 });
  await expect(page.locator(".intro")).toBeHidden();
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-intro", "play");
});

test("intro: termina da sola e rende l'hero utilizzabile", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 8000 });
  await page.getByRole("link", { name: /Scopri le vetture/i }).first().click();
  await expect(page).toHaveURL(/\/stock-auto\/$/);
});

test("intro: mai mostrata con prefers-reduced-motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/");
  await expect(page.locator(".intro")).toBeHidden();
  await expect(page.locator("html")).not.toHaveAttribute("data-intro", /play|skip/);
  await expect(page.getByRole("heading", { level: 1, name: "Beyond the drive" })).toBeVisible();
  await ctx.close();
});

test("nessuna immagine rotta in home e nelle pagine principali", async ({ page }) => {
  const broken: string[] = [];
  page.on("response", (r) => r.request().resourceType() === "image" && r.status() >= 400 && !r.url().includes("does-not-exist") && broken.push(r.url()));
  for (const r of ["/", "/chi-siamo/", "/servizi/", "/contatti/", "/noleggio-auto-breve-lungo-termine-pompei/", "/tour-barca-noleggio-imbarcazioni-pompei/"]) {
    await page.goto(r);
    for (let y = 0; y < 30; y++) await page.mouse.wheel(0, 900);
    await page.waitForTimeout(300);
  }
  expect(broken).toEqual([]);
});
