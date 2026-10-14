import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "@/proxy";

const status = (path: string) => proxy(new NextRequest(new URL(path, "https://alfanocars.it"))).status;

describe("proxy anti-spam", () => {
  it.each([
    "/2026/10/09/kako-tempo-igranja-vpliva-na-odlocitve-v-spletnih-igralnicah/",
    "/2026/10/08/m-199/",
    "/jak-dzialaja-punkty-i-nagrody-w-vegazone-online-kasyno/",
    "/jackpot-raider-casino-deposits-or-withdrawals-which-rules-matter-more/",
    "/category/casino/",
    "/feed/",
    "/comments/feed/",
    "/wp-login.php",
    "/xmlrpc.php",
    "/wp-json/wp/v2/posts",
    "/?p=2995",
  ])("%s → 410", (p) => expect(status(p)).toBe(410));

  it.each([
    "/",
    "/stock-auto/",
    "/stock-auto/jeep-renegade-slot-2020/",
    "/privacy-policy/",
    "/noleggio-auto-breve-lungo-termine-pompei/",
    "/tour-barca-noleggio-imbarcazioni-pompei/",
    "/contatti/",
  ])("%s resta accessibile", (p) => expect(status(p)).toBe(200));

  it("le ricerche spam ?s= vengono reindirizzate alla home", () => expect(status("/?s=casino")).toBe(301));
});
