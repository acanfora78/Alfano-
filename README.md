# Alfano Cars — Beyond the Drive

Sito ufficiale di **Alfano Cars** (Pompei): vendita e noleggio auto, noleggio con conducente, auto per eventi, furgoni, moto/e-bike e tour in barca.
Direzione artistica *Cinematic Luxury 2050*.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3 + ScrollTrigger (sequenze guidate dallo scroll) · Lenis (scroll fluido, solo desktop).

> Prima della pubblicazione leggere **[docs/SECURITY-AUDIT.md](docs/SECURITY-AUDIT.md)**: il sito WordPress attuale è compromesso (spam di casinò).

---

## Avvio rapido

```bash
npm install
cp .env.example .env.local      # configurare almeno una destinazione per il modulo
npm run dev                     # http://localhost:3000
```

Build di produzione:

```bash
npm run build && npm start
```

Requisiti: Node.js ≥ 20.9.

## Pagine

| URL | Contenuto |
|-----|-----------|
| `/` | Hero cinematografico, stock selezionato, sezione immersiva, servizi, chi siamo, contatti e mappa |
| `/stock-auto/` | Catalogo con ricerca, filtri (marca, prezzo, anno, km, alimentazione, cambio, categoria), ordinamento, filtri nell'URL, "carica altri" |
| `/stock-auto/[slug]/` | Scheda vettura: galleria (swipe, tastiera, schermo intero), specifiche, modulo e WhatsApp contestualizzati, vetture correlate, dati strutturati `Car` |
| `/servizi/` | I servizi realmente offerti, con ancore per ciascuno |
| `/chi-siamo/` | Storia, valori, foto della sede, dati aziendali, mappa |
| `/contatti/` | Modulo, WhatsApp, telefoni, email, orari, mappa |
| `/noleggio-auto-breve-lungo-termine-pompei/` | Landing storica (URL preservato) |
| `/tour-barca-noleggio-imbarcazioni-pompei/` | Landing storica (URL preservato) |
| `/privacy-policy/`, `/cookie-policy/` | Informative |

## Esperienza cinematografica — "The WOW experience"

La home è costruita come un film in sequenze, ognuna con una propria regia (una sola animazione dominante per scena):

| Scena | Regia | Tecnica |
|-------|-------|---------|
| **1 · Apertura** (`HeroFilm`) | Spot di ~6,5 s alla prima visita: bagliore che rivela il metallo → macro del faro → carrellata lungo la carrozzeria con riflesso → tunnel, la camera arretra e rivela l'auto → logo → "BEYOND THE DRIVE" → inviti. Saltabile; alle visite successive parte dall'ultima inquadratura. Uscendo, la camera entra nel tunnel e il letterbox si chiude | CSS (`@property` per la maschera di luce), avvio sincronizzato al caricamento dei fotogrammi; GSAP scrub in uscita |
| **2 · Beyond the ordinary** (`BeyondScene`) | Scena bloccata: una cornice si espande fino a tutto schermo tra le parole BEYOND / ORDINARY, tre battute narrative, taglio dal basso verso una seconda inquadratura | GSAP pin + timeline scrub |
| **The Collection** (`StockSection`, `DriveBy`) | Stock reale (card con inclinazione 3D) e il piazzale in coverflow prospettico che scorre in orizzontale, con inclinazione e scia proporzionali alla velocità | GSAP pin + `containerAnimation` |
| **3 · Ogni dettaglio** (`Immersive`) | Macro reali con tagli a tendina e filo di luce | CSS clip-path |
| **4 · Services in motion** (`ServicesInMotion`) | Quattro pannelli a tutto schermo che si impilano: chi esce arretra e si scurisce; layout diversi (split, full-bleed, diagonale, card flottante) | CSS sticky + GSAP scrub |
| **5 · The Alfano experience** (`ExperienceSection`) | Testo che si accende parola per parola, foto autentiche della sede che sconfinano a velocità diverse, "Dal 1985" gigante in movimento | GSAP scrub, parallasse |
| **Finale** (`FinalScene`) | L'auto si allontana e si dissolve nel buio, compaiono logo e claim, poi le CTA | GSAP pin + maschera radiale |

Movimento continuo discreto: pulviscolo nella luce (canvas 2D), luci del tunnel che "respirano", riflessi periodici, CTA che pulsa, indicatori di scroll animati, fascia tipografica cinetica. Desktop: anello-cursore con etichette sui media, luce che segue il puntatore, card 3D e pulsanti magnetici — disattivabili dal footer ("Effetti cursore").

**Prestazioni e accessibilità:** GSAP si carica alla prima interazione (le scene sono tutte guidate dallo scroll); le scene sotto la piega si inizializzano solo avvicinandosi; ogni loop si ferma fuori viewport o con la scheda nascosta; solo `transform`/`opacity`/`clip-path`. Con **prefers-reduced-motion** il film, i pin e gli effetti sono disattivati e tutto resta una pagina statica leggibile; senza JavaScript contenuti e CTA restano visibili. WebGL non è usato: ogni effetto è ottenibile con CSS/canvas a costo minore.

### Immagini d'atmosfera

Le scene usano fotografie d'atmosfera da **Unsplash** (Unsplash License, uso commerciale gratuito), ritagliate e uniformate con lo stesso color grading (`public/images/cinema`, elenco in `src/config/cinema.ts`, pagina `/crediti-immagini/`). **Non raffigurano vetture in vendita**: lo stock usa solo le foto reali indicate nell'inventario, e le foto della sede/piazzale restano quelle autentiche di Alfano Cars. Per sostituirle con riprese originali (consigliato: un breve video girato in sede) basta aggiornare `src/config/cinema.ts`.

## Inventario veicoli

Il sito **non contiene auto inventate**. L'inventario è letto da una sola fonte:

1. **`content/vehicles.json`** (predefinito) — attualmente vuoto: il catalogo mostra lo stato "Stock in aggiornamento" con CTA WhatsApp;
2. oppure un **feed JSON remoto** impostando `VEHICLES_FEED_URL` (es. export del gestionale), aggiornato ogni `VEHICLES_REVALIDATE` secondi.

Esempio di voce (solo `id`, `make`, `model` sono obbligatori; i campi assenti vengono semplicemente omessi):

```json
{
  "id": "AC-0001",
  "make": "Alfa Romeo",
  "model": "Stelvio",
  "version": "2.2 Turbo Diesel 160 CV AT8 Q4",
  "year": 2021,
  "registration": "03/2021",
  "mileageKm": 48000,
  "fuel": "Diesel",
  "transmission": "Automatico",
  "powerKw": 118,
  "powerHp": 160,
  "bodyType": "SUV",
  "color": "Bianco",
  "price": 31900,
  "status": "disponibile",
  "featured": true,
  "description": "Testo libero. Paragrafi separati da una riga vuota.",
  "features": ["Navigatore", "Fari LED"],
  "images": [{ "src": "/vehicles/ac-0001/1.jpg", "alt": "Vista anteriore" }],
  "updatedAt": "2026-10-14"
}
```

- `fuel`: Benzina, Diesel, Ibrida, Ibrida plug-in, Elettrica, GPL, Metano
- `transmission`: Manuale, Automatico
- `status`: disponibile, riservata, venduta (le vendute vengono nascoste)
- senza `price` viene mostrato "Prezzo su richiesta"; le foto vanno in `public/vehicles/<id>/`

Prima di pubblicare: `npm run validate:vehicles`.

## Modulo contatti

L'invio avviene lato server (`src/app/api/contact/route.ts`) verso una destinazione configurata:

- **Email via Resend**: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (dominio verificato), `CONTACT_TO_EMAIL`;
- **Webhook** (Make, Zapier, n8n, CRM): `CONTACT_WEBHOOK_URL` (+ `CONTACT_WEBHOOK_TOKEN` facoltativo).

Senza destinazione il server risponde **503** e l'utente vede un messaggio onesto con i pulsanti WhatsApp/Chiama precompilati: **nessun invio viene simulato**.
Protezioni: validazione client e server, honeypot, tempo minimo di compilazione, rate limit per IP, controllo dell'origine, consenso privacy obbligatorio. Nessun segreto nel codice client.

## Analytics e cookie

Opzionale: impostando `NEXT_PUBLIC_GA_ID` compaiono il banner di consenso e il link "Preferenze cookie"; GA4 viene caricato solo dopo l'accettazione.
Eventi predisposti: `vehicle_view`, `contact_click`, `whatsapp_click`, `phone_click`, `form_start`, `form_submit_success`, `catalog_filter`.
La mappa Google viene caricata solo al click ("Mostra mappa").

## Dati aziendali

Tutti in `src/config/site.ts` (telefoni, WhatsApp, indirizzo, orari, P.IVA) e `src/config/services.ts` (servizi). **Da confermare** prima del lancio (versioni discordanti sul vecchio sito):
- numero civico (133 / 151 / 155 — impostato 155);
- orario del sabato (13:30 o 15:00 — impostato 13:30);
- rivendicazione "dal 1985" (ripresa dal vecchio sito).

## Test e qualità

```bash
npm run typecheck
npm test                        # unit test (filtri, validazione, modulo, proxy anti-spam)

# end-to-end (Playwright) con l'inventario di prova
VEHICLES_FILE=$PWD/tests/fixtures/vehicles.qa.json npm run build
VEHICLES_FILE=$PWD/tests/fixtures/vehicles.qa.json CONTACT_RATE_LIMIT=1000 npm start -- -p 3100
npm run test:e2e
```

`tests/fixtures/vehicles.qa.json` contiene **dati di test** contrassegnati `[QA]`, mai usati in produzione.

## Pubblicazione

Il progetto richiede un runtime Node.js (API del modulo, proxy anti-spam, rigenerazione dello stock):

- **Vercel**: importare il repository, impostare le variabili d'ambiente, collegare il dominio `alfanocars.it`.
- **Server/VPS o hosting Node**: `npm ci && npm run build && npm start` (porta configurabile con `-p`), dietro un reverse proxy HTTPS.

Dopo il collegamento del dominio seguire la checklist di [docs/SECURITY-AUDIT.md](docs/SECURITY-AUDIT.md) (Search Console, dismissione WordPress, DNS).

## Struttura

```
src/
  app/                 pagine, API contatti, sitemap, robots, manifest
  components/
    home/              sezioni della home
    vehicles/          card, catalogo, galleria, barra contatti
    contact/           modulo e WhatsApp persistente
    layout/            header, footer, logo
    consent/           banner cookie + GA4 (opzionale)
    motion/            MotionRoot (reveal, parallasse)
    ui/                icone, intestazioni, mappa, link tracciati
  config/              dati aziendali e servizi
  lib/                 inventario, filtri, formattazione, SEO, analytics, validazione
  proxy.ts             410 per gli URL spam del vecchio WordPress
content/vehicles.json  inventario
public/images/         fotografie reali di Alfano Cars (dal sito precedente)
```
