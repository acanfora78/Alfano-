import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ConsentAndAnalytics } from "@/components/consent/ConsentAndAnalytics";
import { FloatingContact } from "@/components/contact/FloatingContact";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { business, siteUrl } from "@/config/site";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-space-grotesk", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Alfano Cars — Vendita e noleggio auto a Pompei | Beyond the Drive",
    template: "%s | Alfano Cars Pompei",
  },
  description:
    "Alfano Cars, Pompei: vendita e noleggio auto, noleggio con conducente, auto per matrimoni, furgoni, moto, e-bike e tour in barca. Scopri le vetture e contattaci.",
  applicationName: business.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Alfano Cars",
    url: "/",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Alfano Cars — Beyond the Drive" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`no-js ${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <div aria-hidden className="progress-bar fixed inset-x-0 top-0 z-[60] h-[2px] bg-ion/80" />
        <Header />
        <main id="contenuto" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <FloatingContact />
        <MotionRoot />
        <ConsentAndAnalytics />
      </body>
    </html>
  );
}
