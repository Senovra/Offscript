/**
 * The site's public address. The deploy workflow sets NEXT_PUBLIC_SITE_URL to
 * the same value. No trailing slash.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://offscript.website"
).replace(/\/+$/, "");