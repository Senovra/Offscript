/**
 * Content for the Offscript website.
 *
 * Projects and services below carry Offscript's confirmed titles, categories,
 * years and written descriptions. The photographs are NOT written here: they
 * live in src/lib/assets.ts (paste Cloudinary URLs there). The keys used below
 * must exist in that file, or the build fails.
 *
 * The written copy was supplied by Offscript. It has only had light spelling,
 * grammar and punctuation corrections.
 */
import { ASSETS, resolveImage } from "./assets";

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */
export interface ProjectStory {
  /** e.g. "Glenrich x Offscript" */
  heading: string;
  /** Short facts shown above the description, e.g. Event, Service. */
  details: Array<{ label: string; value: string }>;
  description: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

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
  /** Written case notes shown on the project page. A project can have several. */
  stories: ProjectStory[];
  /** Extra photos shown on the project page (added in src/lib/assets.ts). */
  gallery: GalleryImage[];
}

export interface Service {
  id: string;
  number: string;
  title: string;
  /** Offscript's own description of the service. */
  description: string;
  image: string;
  imageAlt: string;
}

export interface HeroFrame {
  src: string;
  alt: string;
}

/* Frames shown inside the OFFSCRIPT letters (still temporary stock photography) */
export const heroFrames: HeroFrame[] = ASSETS.hero.frames.map((frame) => ({
  src: resolveImage(frame),
  alt: frame.alt,
}));

/* --------------------------------------------------------------------------
   Project gallery photos.
   They are read from `ASSETS.gallery` in src/lib/assets.ts, keyed by project
   slug. Entries without a URL are skipped. If assets.ts has no `gallery`
   section yet, every project simply has no extra photos.
   -------------------------------------------------------------------------- */
type GalleryAssets = Record<string, Array<{ url: string; alt: string }>>;

const galleryAssets: GalleryAssets =
  (ASSETS as typeof ASSETS & { gallery?: GalleryAssets }).gallery ?? {};

function galleryFor(slug: string): GalleryImage[] {
  return (galleryAssets[slug] ?? [])
    .filter((image) => image.url.trim() !== "")
    .map((image) => ({ src: image.url.trim(), alt: image.alt }));
}

/* --------------------------------------------------------------------------
   Work (confirmed by Offscript)
   Modeling represents all modeling projects together.
   -------------------------------------------------------------------------- */
const projectAssets = ASSETS.projects;

export const projects: Project[] = [
  {
    slug: "gis",
    number: "01",
    title: "Glenrich International School Dhaka",
    category: "Passion, Teamwork, Triumph, Glory",
    year: "2026",
    image: resolveImage(projectAssets.gis),
    imageAlt: projectAssets.gis.alt,
    focal: "50% 10%",
    isPlaceholder: false,
    stories: [
      {
        heading: "Glenrich x Offscript",
        details: [
          { label: "Event", value: "Glenrich Interschool Basketball Tournament" },
        ],
        description:
          "Glenrich International School is a renowned international school in the heart of Dhaka. Their reputed GIBT (Glenrich Interschool Basketball Tournament) event opted for our services for its 17th year, where our team planned, produced, and handed over a complete deck of images for further publication on the school’s press.",
      },
    ],
    gallery: galleryFor("gis"),
  },
  {
    slug: "dimo",
    number: "02",
    title: "DIMO",
    category: "Luxury, Power, Elegance, Prestige",
    year: "2026",
    image: resolveImage(projectAssets.dimo),
    imageAlt: projectAssets.dimo.alt,
    focal: "50% 40%",
    isPlaceholder: false,
    stories: [
      {
        heading: "DIMO x Offscript",
        details: [
          {
            label: "Event",
            value: "Mercedes-Benz showcase at Arcade, Independence Square",
          },
        ],
        description:
          "DIMO stands as Sri Lanka’s only official agent importing Mercedes-Benz motor vehicles. As they showcased their newest, highest-technology vehicles and some of their high-demand vehicles at the Arcade, Independence Square, Offscript was present and invited to shoot for their press release.",
      },
    ],
    gallery: galleryFor("dimo"),
  },
  {
    slug: "blemura",
    number: "03",
    title: "Blemura",
    category: "Timeless, Refined, Classic, Sophisticated",
    year: "2025-2026",
    image: resolveImage(projectAssets.blemura),
    imageAlt: projectAssets.blemura.alt,
    focal: "50% 55%",
    isPlaceholder: false,
    stories: [
      {
        heading: "Blemura x Offscript",
        details: [{ label: "Service", value: "Product Marketing Management" }],
        description:
          "Blemura is a local clothing brand that required Offscript’s product management. Here, Offscript produced and managed all things related to Blemura’s first drop in their T-shirt line, such as the photographs, models, post-production and even social media management. Achieving a subtotal of about 70,000 viewers on Instagram alone, their first drop sold out within a week.",
      },
    ],
    gallery: galleryFor("blemura"),
  },
  {
    slug: "modeling",
    number: "04",
    title: "Modeling",
    category: "Rain, Radiance, Nature, Elegance",
    year: "2026",
    image: resolveImage(projectAssets.modeling),
    imageAlt: projectAssets.modeling.alt,
    focal: "50% 50%",
    isPlaceholder: false,
    stories: [
      {
        heading: "Anisa x Offscript",
        details: [{ label: "Project type", value: "Model Application" }],
        description:
          "Anisa is a commercial model who chose Offscript for her modelling application to various agencies. What did we do? We contacted the agencies, got their requirements and sculpted a beautiful, scenic shoot with Anisa, according to the requirements of the particular agencies that she had preferred to join.",
      },
    ],
    gallery: galleryFor("modeling"),
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/* --------------------------------------------------------------------------
   Services (descriptions supplied by Offscript; photos from src/lib/assets.ts)
   -------------------------------------------------------------------------- */
const serviceAssets = ASSETS.services;

export const services: Service[] = [
  {
    id: "strategy",
    number: "01",
    title: "Strategy",
    description:
      "Offscript strategizes using an original map, made by the core Offscript team founders, to personalize and optimize content produced for the specific client. To learn more about our strategy, contact us with your business details and we’ll send you a personalized mind map on how we’ll go about saving your organization’s brand image.",
    image: resolveImage(serviceAssets.strategy),
    imageAlt: serviceAssets.strategy.alt,
  },
  {
    id: "graphic-design",
    number: "02",
    title: "Graphic & Design",
    description:
      "Offscript is known for their extremely clean outputs, with graphics and design being their sole reason. Unlike other agencies, Offscript uses original and niche tactics for catching viewers’ attention and keeping them stuck on a certain post, just by the style of output.",
    image: resolveImage(serviceAssets["graphic-design"]),
    imageAlt: serviceAssets["graphic-design"].alt,
  },
  {
    id: "content-creation",
    number: "03",
    title: "Content Creation",
    description:
      "Production, management, promotions, and all of the above. Offscript does it all: from the moment an idea is recorded on a camera until it is produced and put out to the world, we stick by for the entire process.",
    image: resolveImage(serviceAssets["content-creation"]),
    imageAlt: serviceAssets["content-creation"].alt,
  },
  {
    id: "performance-marketing",
    number: "04",
    title: "Performance Marketing",
    description:
      "Paid ads on Facebook, Instagram, Google or any other digital, online or social media. Using their supported advertising tools, Offscript optimizes a brand’s identity by establishing a strong entrance into any desired social media.",
    image: resolveImage(serviceAssets["performance-marketing"]),
    imageAlt: serviceAssets["performance-marketing"].alt,
  },
  {
    id: "brand-identity-branding",
    number: "05",
    title: "Brand Identity & Branding",
    description:
      "Establishing your presence? Let Offscript make it worth your efforts. From designing your logo, brand colors and typography through to brand guidelines, we build it all.",
    image: resolveImage(serviceAssets["brand-identity-branding"]),
    imageAlt: serviceAssets["brand-identity-branding"].alt,
  },
  {
    id: "immersive-experiences",
    number: "06",
    title: "Immersive Experiences",
    description:
      "Offscript strives to build along with our clients. Our clients enter an experience where Offscript takes your brand through a rollercoaster of ideas and implements them in real time, all while creating a memorable interaction between our team members and clients.",
    image: resolveImage(serviceAssets["immersive-experiences"]),
    imageAlt: serviceAssets["immersive-experiences"].alt,
  },
];

/* About imagery */
export const aboutImages = ASSETS.about.map((image) => ({
  src: resolveImage(image),
  alt: image.alt,
}));

/* --------------------------------------------------------------------------
   About copy (supplied by Offscript; light spelling and grammar corrections).
   The three section headings are the questions, so each paragraph starts
   after the question it answers.
   -------------------------------------------------------------------------- */
export const aboutCopy = {
  who: [
    "Offscript is a marketing agency that strongly believes that good ideas fail without clarity. Where’s that clarity found? In the core image that a brand displays. Offscript helps businesses, organizations and individuals find their clarity, using a strategy founded by the core members, to display brand images in a unique and bound-to-succeed method. With a strong portfolio that ranges from photography, videography, editing and graphics & design up to social media management, Offscript is now available in Bangladesh and Sri Lanka.",
  ],
  how: [
    "Everything Offscript does is personalized, allocating time for each client and having that 1:1 contact at all times, ensuring Offscript’s brand image optimization strategy. Offscript’s standard approach to personalized enhancements looks like this:",
    "Firstly, a client reaches out to us, and we set up a meeting with one of our members to organize and truly understand the underlying problems and solutions. Furthermore, the idea is taken away from the client and is pitched to an allocated scriptwriter, who not only decides what to do moving forward, but also passes the concept on to our main implementors, whether it’s a photographer to fill the void of lack in images displayed as a brand, an editor to enhance graphics & design or video quality of already produced content, or even a manager who manages social media, runs ads and optimizes the brand to viewer image. After all internal discussions are laid out, and a strategy is decided, it is pitched back once more to the client. Only after the client’s approval is this strategy implemented.",
    "Why is Offscript special as a media agency? Offscript provides not only the highest quality services, but also the lowest rates. Having been around for a year now, Offscript has received major personal praise for being budget-friendly and for a not-so-equivalent quality of output, with clients describing Offscript’s work as ‘Completely out of our expectations.’",
  ],
  withLead: "Anyone that wants to be known.",
  withText:
    "Offscript works with businesses, organizations, companies, individuals, events and whoever wants their idea to have an impact on the current generation.",
  /** The opening of "Who We Are?", used as the short introduction on the home page. */
  teaser:
    "Offscript is a marketing agency that strongly believes that good ideas fail without clarity. Where’s that clarity found? In the core image that a brand displays.",
};

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