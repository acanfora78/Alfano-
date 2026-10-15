/**
 * Immagini d'ATMOSFERA (promozionali) usate nelle scene cinematografiche.
 *
 * - Fonte: Unsplash — Unsplash License (uso commerciale gratuito, senza obbligo di attribuzione).
 * - Ritoccate (ritaglio e color grading) per uniformarle alla direzione artistica.
 * - NON raffigurano vetture in vendita presso Alfano Cars: le foto reali dello stock
 *   e della sede restano in /images/fleet, /images/showroom, /images/details.
 */
export type CinemaImage = { src: string; portrait?: string; alt: string; unsplashId: string; w: number; h: number };

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const cinema = {
  bodyMacro: { src: "/images/cinema/body-macro.jpg", portrait: "/images/cinema/body-macro-portrait.jpg", alt: "Macro di una carrozzeria scura con cerchio e faro", unsplashId: "1618418721668-0d1f72aa4bab", w: 2400, h: 1600 },
  headlight: { src: "/images/cinema/headlight.jpg", portrait: "/images/cinema/headlight-portrait.jpg", alt: "Faro LED acceso nel buio", unsplashId: "1542282088-fe8426682b8f", w: 2400, h: 1350 },
  silhouette: { src: "/images/cinema/silhouette.jpg", portrait: "/images/cinema/silhouette-portrait.jpg", alt: "Profilo di un'auto nera disegnato dalla luce radente", unsplashId: "1485291571150-772bcfc10da5", w: 2400, h: 1500 },
  tunnel: { src: "/images/cinema/tunnel.jpg", portrait: "/images/cinema/tunnel-portrait.jpg", alt: "Auto sportiva nera in un tunnel illuminato da luci lineari", unsplashId: "1567808291548-fc3ee04dbcf0", w: 2400, h: 1350 },
  mountainRoad: { src: "/images/cinema/mountain-road.jpg", portrait: "/images/cinema/mountain-road-portrait.jpg", alt: "Coupé scura in movimento su una strada di montagna", unsplashId: "1556189250-72ba954cfc2b", w: 2400, h: 1600 },
  duskRoad: { src: "/images/cinema/dusk-road.jpg", alt: "Berlina nera con i fari accesi al crepuscolo", unsplashId: "1536700503339-1e4b06520771", w: 2400, h: 1600 },
  fogMountain: { src: "/images/cinema/fog-mountain-wide.jpg", portrait: "/images/cinema/fog-mountain.jpg", alt: "Coupé scura che si allontana su una strada di montagna nella nebbia", unsplashId: "1611859266238-4b98091d9d9b", w: 2400, h: 1350 },
  sunsetDrive: { src: "/images/cinema/sunset-drive.jpg", alt: "Mani sul volante durante una guida al tramonto", unsplashId: "1449965408869-eaa3f722e40d", w: 2400, h: 1601 },
  motorcycle: { src: "/images/cinema/motorcycle.jpg", alt: "Motocicletta nera sotto un cielo nuvoloso", unsplashId: "1622185135505-2d795003994a", w: 2400, h: 1600 },
} satisfies Record<string, CinemaImage>;

export const cinemaCredits = Object.values(cinema).map((c) => ({ alt: c.alt, src: c.src, source: u(c.unsplashId) }));
