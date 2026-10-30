import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

// Required for the static export used by GitHub Pages
export const dynamic = "force-static";

/**
 * The public pages worth indexing. Addresses end in a slash, matching the
 * site's trailingSlash setting.
 *
 * Left out on purpose:
 *   /terms-and-conditions/ : not finalised yet. Add "/terms-and-conditions/"
 *                            below once the final text is published.
 *   /credits/              : an attribution page with little search value.
 */
const PAGES = ["/", "/about/", "/services/", "/work/", "/contact/", "/privacy-policy/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...PAGES, ...projects.map((project) => `/work/${project.slug}/`)];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}