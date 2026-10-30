import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Required for the static export used by GitHub Pages
export const dynamic = "force-static";

/** Lets search engines crawl every public page, and tells them where the sitemap is. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}