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

/** The production address. The deploy workflow also sets NEXT_PUBLIC_SITE_URL to it. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://offscript.website";

/** In the words of Offscript's own About copy. */
const DESCRIPTION =
  "Offscript is a marketing agency in Bangladesh and Sri Lanka: photography, videography, editing, graphics & design and social media management.";

/** From src/lib/assets.ts. */
const iconUrl = ASSETS.logo.icon.trim();
const shareUrl = ASSETS.share.trim();

/**
 * The current sharing image is a SQUARE 512 x 512 icon. Once a dedicated
 * landscape image (about 1200 x 630) is in ASSETS.share, set this to true so
 * the cards use the large format.
 */
const SHARE_IS_LANDSCAPE = false;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Offscript",
    template: "%s | Offscript",
  },
  description: DESCRIPTION,
  icons: iconUrl ? { icon: iconUrl, apple: iconUrl } : undefined,
  openGraph: {
    title: "Offscript",
    description: DESCRIPTION,
    url: siteUrl,
    siteName: "Offscript",
    type: "website",
    images: shareUrl
      ? [
          {
            url: shareUrl,
            width: SHARE_IS_LANDSCAPE ? 1200 : 512,
            height: SHARE_IS_LANDSCAPE ? 630 : 512,
            alt: "Offscript",
          },
        ]
      : undefined,
  },
  twitter: {
    card: SHARE_IS_LANDSCAPE ? "summary_large_image" : "summary",
    title: "Offscript",
    description: DESCRIPTION,
    images: shareUrl ? [shareUrl] : undefined,
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