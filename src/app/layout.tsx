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
import { CONTACT, INSTAGRAM_ACCOUNTS } from "@/lib/contact";
import { TITLE_TEMPLATE, socialMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

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

/** The page title used when a page does not set its own (the home page). */
const HOME_TITLE = "Offscript";

const DESCRIPTION =
  "Offscript is a media and marketing company in Bangladesh and Sri Lanka: creative strategy, branding, content creation, social media and digital campaigns.";

/** From src/lib/assets.ts. */
const iconUrl = ASSETS.logo.icon.trim();

/**
 * Site-wide sharing tags (used by any page that does not set its own).
 * The sharing image and its square/landscape setting live in src/lib/seo.ts.
 */
const social = socialMetadata({ title: HOME_TITLE, description: DESCRIPTION });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: DESCRIPTION,
  // "./" is resolved against metadataBase for each page, so every page names itself as canonical
  alternates: { canonical: "./" },
  icons: iconUrl ? { icon: iconUrl, apple: iconUrl } : undefined,
  ...social,
  robots: MAINTENANCE
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Structured data (schema.org) built only from details Offscript has
 * confirmed: the name, the address of the site, the business email, the three
 * Instagram accounts, and the two locations (Dhaka, Bangladesh and Colombo,
 * Sri Lanka). No ratings, reviews, dates or other claims.
 */
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Offscript",
    url: SITE_URL,
    ...(iconUrl ? { logo: iconUrl } : {}),
    email: CONTACT.email,
    sameAs: INSTAGRAM_ACCOUNTS.map(
      (account) => `https://www.instagram.com/${account.handle}/`
    ),
    areaServed: ["Bangladesh", "Sri Lanka"],
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "BD",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Colombo",
        addressCountry: "LK",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Offscript",
    url: SITE_URL,
  },
];

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

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