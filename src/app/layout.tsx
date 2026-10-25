import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Geist_Mono } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/layout/SmoothScroll";
import Grain from "@/components/layout/Grain";
import Footer from "@/components/layout/Footer";
import Maintenance from "@/components/layout/Maintenance";
import Header from "@/components/navigation/Header";
import Preloader from "@/components/home/Preloader";
import { ASSETS } from "@/lib/assets";

/**
 * MAINTENANCE SWITCH
 * true  : every page shows the maintenance screen (and search engines are told
 *         not to index it)
 * false : the normal website
 * Change it, save, and restart/redeploy.
 */
const MAINTENANCE = false;

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/** The production address. The workflow also sets NEXT_PUBLIC_SITE_URL to it. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://offscript.website";

/** From src/lib/assets.ts. Empty until the real URLs are pasted in. */
const iconUrl = ASSETS.logo.icon.trim();
const shareUrl = ASSETS.share.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Offscript",
    template: "%s | Offscript",
  },
  description:
    "Offscript is a media company: strategy, design, content, campaigns and immersive work.",
  icons: iconUrl ? { icon: iconUrl } : undefined,
  openGraph: {
    title: "Offscript",
    description:
      "A media company: strategy, design, content, campaigns and immersive work.",
    type: "website",
    images: shareUrl ? [{ url: shareUrl, width: 1200, height: 630 }] : undefined,
  },
  robots: MAINTENANCE ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const fontClasses = `${archivo.variable} ${instrument.variable} ${geistMono.variable}`;

  if (MAINTENANCE) {
    return (
      <html lang="en" className={fontClasses}>
        <body>
          <Grain />
          <Maintenance />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={fontClasses}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>

        {/* Mounted once per full page load, so it never replays on internal navigation */}
        <Preloader />
        <SmoothScroll />
        <Grain />
        <Header />

        <main id="main">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
