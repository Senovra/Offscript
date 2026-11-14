import type { Metadata } from "next";
import { ASSETS } from "@/lib/assets";

/**
 * SEO helpers: the page title pattern, the sharing (Open Graph and Twitter)
 * tags and the short descriptions of the work pages, in one place.
 */

/** How a page title is completed. layout.tsx uses this as its title template. */
export const TITLE_TEMPLATE = "%s - Offscript";

/**
 * The current sharing image is a SQUARE 512 x 512 icon. Once a dedicated
 * landscape image (about 1200 x 630) is in ASSETS.share, set this to true so
 * the cards use the large format.
 */
const SHARE_IS_LANDSCAPE = false;

/** From src/lib/assets.ts. */
const shareUrl = ASSETS.share.trim();

interface SocialInput {
  title: string;
  description: string;
  /** The page's own address (for example "/about/"). Leave out for site-wide defaults. */
  path?: string;
}

/**
 * Open Graph and Twitter tags for one page, using the existing sharing image.
 * A page that sets its own openGraph or twitter replaces the layout's, so each
 * page repeats the image here.
 */
export function socialMetadata({
  title,
  description,
  path,
}: SocialInput): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      siteName: "Offscript",
      type: "website",
      ...(path ? { url: path } : {}),
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
      title,
      description,
      images: shareUrl ? [shareUrl] : undefined,
    },
  };
}

interface PageInput {
  title: string;
  /** true: use the title exactly as written. false: the template adds " - Offscript". */
  absoluteTitle?: boolean;
  description: string;
  /** The page's address, ending in a slash, for example "/about/". */
  path: string;
}

/** Title, description and sharing tags for a page. The canonical address comes from layout.tsx. */
export function pageMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
}: PageInput): Metadata {
  const socialTitle = absoluteTitle ? title : TITLE_TEMPLATE.replace("%s", title);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...socialMetadata({ title: socialTitle, description, path }),
  };
}

/**
 * Short descriptions for project pages, written only from each project's own
 * content in src/lib/projects.ts. A project not listed here keeps the
 * description it already had (Modeling, until its content is final).
 */
export const PROJECT_DESCRIPTIONS: Record<string, string> = {
  gis: "Offscript planned, produced and handed over the images for Glenrich International School Dhaka's Interschool Basketball Tournament, in its 17th year.",
  dimo: "Offscript shot DIMO's Mercedes-Benz showcase at the Arcade, Independence Square, for the company's press release.",
  blemura:
    "Offscript produced and managed Blemura's first T-shirt drop: photography, models, post-production and social media management.",
};