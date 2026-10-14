import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Mantiene la struttura di URL di WordPress (es. /privacy-policy/)
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2400],
    imageSizes: [96, 160, 256, 384, 512],
    // Immagini dei veicoli da un feed remoto: aggiungere qui il dominio del gestionale
    remotePatterns: [{ protocol: "https", hostname: "alfanocars.it" }],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // Vecchie ancore/URL WordPress legittimi → nuove pagine dedicate
      { source: "/home/", destination: "/", permanent: true },
      { source: "/gallery/", destination: "/chi-siamo/", permanent: true },
      { source: "/stock/", destination: "/stock-auto/", permanent: true },
      { source: "/auto/", destination: "/stock-auto/", permanent: true },
      { source: "/contact/", destination: "/contatti/", permanent: true },
    ];
  },
};

export default nextConfig;
