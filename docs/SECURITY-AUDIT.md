# Audit sicurezza e SEO — alfanocars.it

**Data verifica:** 14 ottobre 2026
**Metodo:** analisi esterna del sito pubblico (HTML, REST API WordPress, robots, sitemap). Nessun accesso a hosting, pannello WordPress, DNS o Google Search Console era disponibile.

> **Esito: il sito WordPress attualmente online è compromesso** e viene usato per pubblicare spam di casinò e scommesse online. Il problema è attivo: l'ultimo articolo spam rilevato è del 9 ottobre 2026.

---

## 1. Evidenze

| # | Problema | Evidenza | Gravità |
|---|----------|----------|---------|
| 1 | **Articoli spam massivi** | `X-WP-Total: 1180` articoli su `/wp-json/wp/v2/posts`. Il primo spam risale al **1° gennaio 2025**; i più recenti al 9 ottobre 2026. Lingue: polacco, slovacco, sloveno, svedese, inglese, rumeno, bulgaro. URL tipo `/2026/10/09/kako-tempo-igranja-…/`, `/2026/10/08/m-199/` | Critica |
| 2 | **Pagine spam** | 4 pagine su 8 sono spam: ID 2928, 2897, 2819 (`…-vegazone-kasyno`), 1462 (`jackpot-raider-casino-…`) | Critica |
| 3 | **Home page manomessa** | La pagina Home (ID 36, modificata il 30/07/2026) contiene testi su bonus casinò in più lingue e link nascosti a **28 domini** di gioco d'azzardo (elenco sotto) | Critica |
| 4 | **File PHP alterato** | Ogni risposta del server inizia con il frammento `'height' => 100,` stampato prima di `<!doctype html>`: indica un file del tema/plugin modificato o un include iniettato (tipico di backdoor) | Alta |
| 5 | **Software obsoleto** | WordPress **6.1.15** (ramo 2022), All in One SEO **4.3.0**, Elementor: versioni con vulnerabilità note | Alta |
| 6 | **Enumerazione utenti** | `/wp-json/wp/v2/users` espone gli account `adm.vf` (ID 1) ed `editor` (ID 2) | Media |
| 7 | **XML-RPC attivo** | `/xmlrpc.php` raggiungibile: vettore per attacchi brute-force | Media |
| 8 | **Link mappa non funzionante** | Il link `goo.gl/maps/…` non funziona più (Google ha dismesso goo.gl nel 2025) | Bassa |
| 9 | **Dati aziendali incoerenti** | Civico 133 (footer), 155 (privacy e mappa), 151 (insegna). Sabato 09:00–13:30 (home) vs 09:00–15:00 (pagina barca) | Bassa |

**Domini spam linkati dalla home:** 22bet-espana.com, 888-casino.info.ro, bet365-bulgaria.com, bet365-casino-cz.com, boabet-norsk.com, casino-kings.de.com, casino-vegashero.gr, casinosnatch.co.com, casinosugarino.se, comeon-login.de.com, mojoslotcasino.se, mostbet-poland.net.pl, pl-slotticacasino.com, powerplay-sweden.com, qbetcasino.co.com, richmoose.co.com, richmoosecasino.se, royalvegas-nz.net, se-reblzcasino.se, slottio.co.com, slottiocasino.co.com, stake-casino-brasil.com, stardacasino.co.com, sugarino.co.com, true-luck-nederland.com, u-nibet.com, unibet-login-be.com, williamhill-uk.net.

**Contenuti legittimi individuati e preservati:** Home (testi originali), `/privacy-policy/`, `/noleggio-auto-breve-lungo-termine-pompei/`, `/tour-barca-noleggio-imbarcazioni-pompei/`, galleria fotografica (wp-content/uploads/2023/02).

---

## 2. Cosa è stato fatto in questo repository

- **Nuovo sito Next.js** che sostituisce integralmente WordPress: nessun CMS, nessun pannello di amministrazione esposto, nessun plugin di terze parti, superficie d'attacco minima.
- **Bonifica SEO automatica** (`src/proxy.ts`): tutti gli URL dello spam rispondono **410 Gone** + `X-Robots-Tag: noindex`, così Google li rimuove più rapidamente:
  - articoli `/AAAA/MM/GG/…` e archivi per data;
  - pagine spam alla radice riconosciute da parole chiave (casino, kasyno, bonus, slot, bet…);
  - `/category/`, `/tag/`, `/author/`, `/feed/`, `/wp-json/`, `/wp-admin/`, `/wp-login.php`, `/xmlrpc.php`, vecchie sitemap WordPress;
  - permalink `?p=…`, `?page_id=…`; le ricerche `?s=…` vengono reindirizzate alla home.
- **URL legittimi preservati identici** (`/privacy-policy/`, le due landing page di noleggio e barca), slash finale mantenuto come in WordPress.
- Nuova `sitemap.xml` e `robots.txt` puliti; canonical su ogni pagina.
- Header di sicurezza (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).
- Dati aziendali centralizzati in `src/config/site.ts`, con le incoerenze segnalate da confermare.

Test automatici: `tests/unit/proxy.test.ts` e `tests/e2e/site.spec.ts` verificano che gli URL spam rispondano 410 e che le pagine legittime restino raggiungibili.

---

## 3. Azioni che richiedono accessi non disponibili

Da eseguire **dal titolare o dal fornitore hosting**. Non possono essere dichiarate risolte da questo lavoro.

### Subito (contenimento)
1. **Cambiare tutte le password**: hosting/cPanel, FTP/SFTP, database, account WordPress `adm.vf` ed `editor`, email `alfanocars@gmail.com` se usata per il recupero.
2. **Backup forense** del sito attuale (file + database) prima di qualsiasi modifica, utile per capire l'origine dell'intrusione.
3. Se si mantiene WordPress anche temporaneamente: modalità manutenzione, eliminazione di utenti sconosciuti, disattivazione di XML-RPC.

### Pubblicazione del nuovo sito
4. Pubblicare questo progetto (vedi `README.md`) e puntare il dominio `alfanocars.it` al nuovo hosting.
5. **Disattivare definitivamente la vecchia installazione WordPress** (non lasciarla raggiungibile su sottodomini o percorsi alternativi). Se serve conservarla, archiviarla offline.
6. Verificare i record DNS (A, CNAME, MX, TXT): eventuali record non riconosciuti vanno rimossi. Abilitare il blocco del dominio presso il registrar.

### Google Search Console
7. Verificare la proprietà del dominio e controllare **Problemi di sicurezza** e **Azioni manuali**. Se presente una segnalazione di "spam generato da hacker", richiedere la revisione dopo la pubblicazione.
8. Inviare la nuova sitemap `https://alfanocars.it/sitemap.xml`.
9. Usare lo strumento **Rimozioni** con il prefisso `https://alfanocars.it/2025/` e `https://alfanocars.it/2026/` per accelerare la deindicizzazione (i 410 sono comunque già attivi).
10. Controllare in **Link** e **Pagine** che non rimangano URL spam indicizzati nelle settimane successive.

### Verifiche aggiuntive consigliate
11. Controllare l'account Google Business Profile (indirizzo, orari, telefono) e allinearlo ai dati confermati.
12. Se la stessa infrastruttura ospita altri siti, analizzarli: la compromissione potrebbe estendersi.
