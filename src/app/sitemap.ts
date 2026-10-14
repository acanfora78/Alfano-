import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { getInventory } from "@/lib/vehicles/source";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { vehicles } = await getInventory();
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "weekly"],
    ["/stock-auto/", 0.9, "daily"],
    ["/servizi/", 0.8, "monthly"],
    ["/noleggio-auto-breve-lungo-termine-pompei/", 0.8, "monthly"],
    ["/tour-barca-noleggio-imbarcazioni-pompei/", 0.7, "monthly"],
    ["/chi-siamo/", 0.6, "yearly"],
    ["/contatti/", 0.7, "yearly"],
    ["/privacy-policy/", 0.2, "yearly"],
    ["/cookie-policy/", 0.2, "yearly"],
  ];
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency, priority })),
    ...vehicles.map((v) => ({
      url: `${siteUrl}/stock-auto/${v.slug}/`,
      lastModified: v.updatedAt ? new Date(v.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: v.images.slice(0, 5).map((i) => (i.src.startsWith("http") ? i.src : `${siteUrl}${i.src}`)),
    })),
  ];
}
