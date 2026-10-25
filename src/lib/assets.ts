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
 *   gallery  : the key is the project `slug`, and EVERY project needs an entry
 *              (an empty list is fine). A misspelt, missing or extra key is a
 *              build error, so photos can never silently go missing.
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

/** One extra photo on a project page. */
export interface GalleryAsset {
  /** Paste the Cloudinary delivery URL here. */
  url: string;
  /** Short description for screen readers, e.g. "Players celebrating on court". */
  alt: string;
}

/** The address the site should use for an image slot. */
export function resolveImage(asset: ImageAsset): string {
  return asset.url.trim() || asset.fallback;
}

/**
 * The main (hero) photo of each project. The key is the project `slug`.
 * Declared here, above ASSETS, so the gallery below can be checked against it.
 */
const PROJECT_ASSETS = {
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
} satisfies Record<string, ImageAsset>;

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
     To add a project (for example Ignite Band): add an entry in
     PROJECT_ASSETS above, then a matching entry in src/lib/projects.ts with
     the same slug, then an entry (even an empty list) in `gallery` below.
     ------------------------------------------------------------------ */
  projects: PROJECT_ASSETS,

  /* ------------------------------------------------------------------
     WORK GALLERY: the extra photos shown beneath each project's main photo.
     The key is the project `slug`. Photos appear in the order listed here.
     An empty list means the project shows no gallery.

     To add a photo, copy ONE line like the example into the right project's
     list, paste the photo's Cloudinary delivery URL between the quotes after
     `url:`, and describe the photo after `alt:`. Keep the comma at the end.

       { url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v.../Photo.jpg", alt: "Short description" },

     Each project needs an entry here, even if its list is empty.
     ------------------------------------------------------------------ */
  gallery: {
    gis: [
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510697/GIS_1.jpg",
        alt: "GIS project photograph 1",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510695/GIS_2.jpg",
        alt: "GIS project photograph 2",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510699/GIS_3.jpg",
        alt: "GIS project photograph 3",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510697/GIS_4.jpg",
        alt: "GIS project photograph 4",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510698/GIS_5.jpg",
        alt: "GIS project photograph 5",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510705/GIS_6.jpg",
        alt: "GIS project photograph 6",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510702/GIS_7.jpg",
        alt: "GIS project photograph 7",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510702/GIS_8.jpg",
        alt: "GIS project photograph 8",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510708/GIS_9.jpg",
        alt: "GIS project photograph 9",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510701/GIS_10.jpg",
        alt: "GIS project photograph 10",
      },
        ],
    dimo: [
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510680/DIMO_1.jpg",
        alt: "DIMO project photograph 1",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510683/DIMO_2.jpg",
        alt: "DIMO project photograph 2",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510687/DIMO_3.jpg",
        alt: "DIMO project photograph 3",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510687/DIMO_4.jpg",
        alt: "DIMO project photograph 4",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510688/DIMO_5.jpg",
        alt: "DIMO project photograph 5",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510690/DIMO_6.jpg",
        alt: "DIMO project photograph 6",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510690/DIMO_7.jpg",
        alt: "DIMO project photograph 7",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510692/DIMO_8.jpg",
        alt: "DIMO project photograph 8",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510692/DIMO_9.jpg",
        alt: "DIMO project photograph 9",
      },
        ],
    blemura: [
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510667/Blemura_1.jpg",
        alt: "Blemura project photograph 1",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510667/Blemura_2.jpg",
        alt: "Blemura project photograph 2",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510668/Blemura_3.jpg",
        alt: "Blemura project photograph 3",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510669/Blemura_4.jpg",
        alt: "Blemura project photograph 4",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510669/Blemura_5.jpg",
        alt: "Blemura project photograph 5",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510671/Blemura_6.jpg",
        alt: "Blemura project photograph 6",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510671/Blemura_7.jpg",
        alt: "Blemura project photograph 7",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510673/Blemura_8.jpg",
        alt: "Blemura project photograph 8",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510673/Blemura_9.jpg",
        alt: "Blemura project photograph 9",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510674/Blemura_10.jpg",
        alt: "Blemura project photograph 10",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510676/Blemura_11.jpg",
        alt: "Blemura project photograph 11",
      },
        ],
    modeling: [
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510660/Anisa_2.jpg",
        alt: "Anisa project photograph 2",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510687/Anisa_3.jpg",
        alt: "Anisa project photograph 3",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510632/Anisa_4.jpg",
        alt: "Anisa project photograph 4",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510663/Anisa_8.jpg",
        alt: "Anisa project photograph 8",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510693/Anisa_9.jpg",
        alt: "Anisa project photograph 9",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510687/Anisa_13.jpg",
        alt: "Anisa project photograph 13",
      },
      {
        url: "https://res.cloudinary.com/ljh4zjr8/image/upload/v1792510696/Anisa_15.jpg",
        alt: "Anisa project photograph 15",
      },
        ],
  } satisfies Record<keyof typeof PROJECT_ASSETS, GalleryAsset[]>,
};