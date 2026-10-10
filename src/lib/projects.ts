/**
 * Content for the Offscript website.
 *
 * IMPORTANT: everything marked `isPlaceholder: true`, and every Unsplash image
 * below, is DEMO CONTENT used only to design the layouts. The photographs are
 * stock, the titles are mood words, and none of it is Offscript client work.
 * Replace with real projects by pointing `image` at files in
 * /public/images/work/ and setting isPlaceholder to false.
 */

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
export interface Project {
  slug: string;
  number: string;
  title: string;
  category: string;
  /** null until a real project has a real year */
  year: string | null;
  image: string;
  imageAlt: string;
  /** CSS object-position, keeps the subject in frame on tall mobile crops */
  focal: string;
  isPlaceholder: boolean;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  /** Draft one-line description. Offscript to replace with final copy. */
  summary: string;
  image: string;
  imageAlt: string;
}

export interface HeroFrame {
  src: string;
  alt: string;
}

/* --------------------------------------------------------------------------
   Placeholder photography helper (Unsplash, development only)
   If an image 404s, swap the photo id for another Unsplash or Pexels photo.
   -------------------------------------------------------------------------- */
const unsplash = (id: string, width = 2400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

/* Frames shown inside the OFFSCRIPT letters (placeholder photography) */
export const heroFrames: HeroFrame[] = [
  { src: unsplash("1506905925346-21bda4d32df4"), alt: "Placeholder: mountain ridge" },
  { src: unsplash("1470071459604-3b5ec3a7fe05"), alt: "Placeholder: forest in fog" },
  { src: unsplash("1518837695005-2083093ee35b"), alt: "Placeholder: ocean wave" },
];

/* --------------------------------------------------------------------------
   Work (DEMO / PLACEHOLDER)
   -------------------------------------------------------------------------- */
export const projects: Project[] = [
  {
    slug: "placeholder-altitude",
    number: "01",
    title: "Altitude",
    category: "Content Creation",
    year: null,
    image: unsplash("1506905925346-21bda4d32df4"),
    imageAlt: "Placeholder photograph: mountain ridge",
    focal: "50% 40%",
    isPlaceholder: true,
  },
  {
    slug: "placeholder-canopy",
    number: "02",
    title: "Canopy",
    category: "Social Media",
    year: null,
    image: unsplash("1470071459604-3b5ec3a7fe05"),
    imageAlt: "Placeholder photograph: forest in fog",
    focal: "50% 50%",
    isPlaceholder: true,
  },
  {
    slug: "placeholder-tide",
    number: "03",
    title: "Tide",
    category: "Immersive Experiences",
    year: null,
    image: unsplash("1518837695005-2083093ee35b"),
    imageAlt: "Placeholder photograph: ocean wave",
    focal: "50% 55%",
    isPlaceholder: true,
  },
  {
    slug: "placeholder-glass",
    number: "04",
    title: "Glass",
    category: "Design",
    year: null,
    image: unsplash("1486406146926-c627a92ad1ab"),
    imageAlt: "Placeholder photograph: glass architecture",
    focal: "50% 50%",
    isPlaceholder: true,
  },
  {
    slug: "placeholder-night-sky",
    number: "05",
    title: "Night Sky",
    category: "Performance Marketing",
    year: null,
    image: unsplash("1519681393784-d120267933ba"),
    imageAlt: "Placeholder photograph: stars above mountains",
    focal: "50% 60%",
    isPlaceholder: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/* --------------------------------------------------------------------------
   Capabilities (names are Offscript's positioning; summaries are draft copy;
   images are placeholders)
   -------------------------------------------------------------------------- */
export const services: Service[] = [
  {
    id: "strategy",
    number: "01",
    title: "Strategy",
    summary: "Direction and positioning, decided before anything is made.",
    image: unsplash("1477959858617-67f85cf4f1df", 1800),
    imageAlt: "Placeholder photograph: city at dusk",
  },
  {
    id: "design",
    number: "02",
    title: "Design",
    summary: "Identity, layout and visual systems.",
    image: unsplash("1486406146926-c627a92ad1ab", 1800),
    imageAlt: "Placeholder photograph: glass architecture",
  },
  {
    id: "content-creation",
    number: "03",
    title: "Content Creation",
    summary: "Photography, film and editorial production.",
    image: unsplash("1506905925346-21bda4d32df4", 1800),
    imageAlt: "Placeholder photograph: mountain ridge",
  },
  {
    id: "performance-marketing",
    number: "04",
    title: "Performance Marketing",
    summary: "Paid media built to be measured.",
    image: unsplash("1519681393784-d120267933ba", 1800),
    imageAlt: "Placeholder photograph: stars above mountains",
  },
  {
    id: "social-media",
    number: "05",
    title: "Social Media",
    summary: "Channels, formats and a steady rhythm of publishing.",
    image: unsplash("1470071459604-3b5ec3a7fe05", 1800),
    imageAlt: "Placeholder photograph: forest in fog",
  },
  {
    id: "immersive-experiences",
    number: "06",
    title: "Immersive Experiences",
    summary: "Interactive and spatial work beyond the screen.",
    image: unsplash("1518837695005-2083093ee35b", 1800),
    imageAlt: "Placeholder photograph: ocean wave",
  },
];

/* About imagery (placeholder photography) */
export const aboutImages = [
  {
    src: unsplash("1477959858617-67f85cf4f1df", 1600),
    alt: "Placeholder photograph: city at dusk",
  },
  {
    src: unsplash("1486406146926-c627a92ad1ab", 1400),
    alt: "Placeholder photograph: glass architecture",
  },
];

/* --------------------------------------------------------------------------
   Site links (this order is used by the menu and the footer)
   -------------------------------------------------------------------------- */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Credits", href: "/credits" },
];

/* --------------------------------------------------------------------------
   Third-party 3D model credit. Shown on /credits only.
   -------------------------------------------------------------------------- */
export const modelCredit = {
  title: "SONY CAMERA 4K",
  author: "Arham Abdullah",
  platform: "Sketchfab",
  sourceUrl: "https://skfb.ly/ptoZX",
  licence: "Creative Commons Attribution",
  licenceUrl: "http://creativecommons.org/licenses/by/4.0/",
};