/**
 * ASSET MAP: every image, video and logo the site uses, in one place.
 *
 * HOW IT WORKS
 *   Each slot has a `url`. When it holds a Cloudinary delivery URL, the site
 *   uses it. When it is empty, the site falls back to `fallback`:
 *     - confirmed Offscript slots (projects, services, About) fall back to a
 *       plain dark tile, never to unrelated stock photography;
 *     - the hero photos, which Offscript has not supplied yet, still fall back
 *       to the temporary stock photographs.
 *   To change a photo, paste its verified Cloudinary delivery URL between the
 *   quotes of `url`, and keep the `alt` text accurate.
 *
 * WHAT GOES WHERE
 *   Images : the URL contains /image/upload/ (photos, logos, icons).
 *   Videos : the URL contains /video/upload/ (the hero video only, for now).
 *   Paste each file's plain delivery URL as Cloudinary shows it. The site adds
 *   the sizing and format options itself (see src/lib/cloudinary.ts).
 *
 * KEYS MUST MATCH THE CONTENT
 *   projects : the key is the project `slug` in src/lib/projects.ts
 *   services : the key is the service `id` in src/lib/projects.ts
 *   projects.ts reads these keys directly, so a missing or misspelt key is
 *   caught by the build (a TypeScript error), not discovered on the live site.
 *
 * NOT IN HERE
 *   The 3D camera model (public/models/offscript-camera.glb) stays in the
 *   repository on purpose.
 */

/** Temporary stock photography. Now used only for the hero photos. */
export const unsplash = (id: string, width = 2400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

/** A plain dark tile shown only if a confirmed photo's URL is ever left empty. */
const NEUTRAL_TILE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%2318181a'/%3E%3C/svg%3E";

export interface ImageAsset {
  /** Paste the Cloudinary delivery URL here. Leave "" to use the fallback. */
  url: string;
  /** Shown only while `url` is empty. */
  fallback: string;
  /** Description for screen readers. */
  alt: string;
}

/** The address the site should use for an image slot. */
export function resolveImage(asset: ImageAsset): string {
  return asset.url.trim() || asset.fallback;
}

export const ASSETS = {
  /* ------------------------------------------------------------------
     LOGOS AND ICON (images). Not supplied yet, so all three are empty.
     horizontalWhite : wide logo in WHITE. Used in the header and footer,
                       which sit on dark backgrounds.
     horizontalBlack : wide logo in BLACK. Not used yet; kept for light areas.
     icon            : small square icon for the browser tab (favicon). Paste
                       the plain URL of a PNG or SVG (no resizing is added).
     ------------------------------------------------------------------ */
  logo: {
    horizontalWhite: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510608/White_Logo.svg",
    horizontalBlack: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510663/Black_Logo.svg",
    icon: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510608/android-chrome-192x192.png",
  },

  /* ------------------------------------------------------------------
     SHARING IMAGE (image, 1200 x 630 px). Not supplied yet.
     Shown when the link is shared on WhatsApp, Instagram, etc.
     ------------------------------------------------------------------ */
  share: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510610/android-chrome-512x512.png",

  /* ------------------------------------------------------------------
     HOME: the OFFSCRIPT letter window. Not supplied yet.
     video  : a Cloudinary VIDEO URL (/video/upload/). While empty the site
              tries the local file public/video/hero.mp4, and falls back to
              the photos below if that is missing too.
     frames : three photos that change inside the letters as you scroll.
              They still use temporary stock photography.
     ------------------------------------------------------------------ */
  hero: {
    video: "https://res.cloudinary.com/ljh4zjr8/video/upload/v1792510978/Home_Intro_Video.mov",
    frames: [
      {
        url: "",
        fallback: unsplash("1506905925346-21bda4d32df4"),
        alt: "Placeholder: mountain ridge",
      },
      {
        url: "",
        fallback: unsplash("1470071459604-3b5ec3a7fe05"),
        alt: "Placeholder: forest in fog",
      },
      {
        url: "",
        fallback: unsplash("1518837695005-2083093ee35b"),
        alt: "Placeholder: ocean wave",
      },
    ] as ImageAsset[],
  },

  /* ------------------------------------------------------------------
     ABOUT: the two photos on the home page and the About page
     ------------------------------------------------------------------ */
  about: [
    {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510678/BTS_01.jpg",
      fallback: NEUTRAL_TILE,
      alt: "bts-01",
    },
    {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510679/BTS_02.jpg",
      fallback: NEUTRAL_TILE,
      alt: "bts-02",
    },
  ] as ImageAsset[],

  /* ------------------------------------------------------------------
     SERVICES: one photo per service. The key is the service `id`.
     ------------------------------------------------------------------ */
  services: {
    strategy: {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510901/Services_1_-_Strategy.jpg",
      fallback: NEUTRAL_TILE,
      alt: "strategy",
    },
    "graphic-design": {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510904/Services_2_-_Graphics_Design.jpg",
      fallback: NEUTRAL_TILE,
      alt: "graphic-design",
    },
    "content-creation": {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510907/Services_3_-_Content_Creation.jpg",
      fallback: NEUTRAL_TILE,
      alt: "content-creation",
    },
    "performance-marketing": {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510908/Services_4_-_Performance_Marketing.jpg",
      fallback: NEUTRAL_TILE,
      alt: "performance-marketing",
    },
    "brand-identity-branding": {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510610/Services_5_-_Branding_Brand_Identity.jpg",
      fallback: NEUTRAL_TILE,
      alt: "brand-identity-branding",
    },
    "immersive-experiences": {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510909/Services_6_-_Immersive_Experiences.jpg",
      fallback: NEUTRAL_TILE,
      alt: "immersive-experiences",
    },
  } satisfies Record<string, ImageAsset>,

  /* ------------------------------------------------------------------
     WORK: the main photo for each project. The key is the project `slug`.
     To add a project (for example Ignite Band): add an entry here, then a
     matching entry in src/lib/projects.ts with the same slug.
     ------------------------------------------------------------------ */
  projects: {
    gis: {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510883/GIS_Hero.jpg",
      fallback: NEUTRAL_TILE,
      alt: "GIS",
    },
    dimo: {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510692/DIMO_Hero.jpg",
      fallback: NEUTRAL_TILE,
      alt: "DIMO",
    },
    blemura: {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510677/Blemura_Hero.jpg",
      fallback: NEUTRAL_TILE,
      alt: "Blemura",
    },
    modeling: {
      url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510708/Home_01_-_Anisa_Hero.jpg",
      fallback: NEUTRAL_TILE,
      alt: "Modeling",
    },
  } satisfies Record<string, ImageAsset>,
};