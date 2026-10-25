/**
 * Cloudinary and image URL helpers. Pure functions, no dependencies, safe to
 * use in the browser and at build time. Nothing here talks to Cloudinary's API
 * or needs any credentials: it only edits the delivery URLs you paste in.
 */

/**
 * true  : Cloudinary files are resized to the size each screen needs, and sent
 *         in the best format the browser supports (AVIF/WebP/MP4/WebM).
 * false : Cloudinary files are delivered exactly as uploaded. Use this if
 *         images break only after being transformed (see the guide).
 */
export const CLOUDINARY_OPTIMISE = true;

/**
 * How much Cloudinary compresses photos (videos are not affected).
 *   "auto"      : balanced (what the site has always used)
 *   "auto:good" : a little sharper
 *   "auto:best" : sharpest, with noticeably larger files
 * This cannot add detail that is missing from the uploaded original. If a
 * photo looks soft, check the size of the file that was uploaded first.
 */
export const IMAGE_QUALITY: "auto" | "auto:good" | "auto:best" = "auto";

const RASTER_EXT = /\.(jpe?g|png|webp|avif|heic)$/i;
const VIDEO_EXT = /\.(mp4|mov|webm|m4v)$/i;
const UNTOUCHED_EXT = /\.(svg|gif)$/i;

function parse(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export function isCloudinaryUrl(url: string): boolean {
  const parsed = parse(url);
  return Boolean(parsed && parsed.hostname.endsWith("cloudinary.com"));
}

function transform(url: string, kind: "image" | "video", params: string): string {
  if (!CLOUDINARY_OPTIMISE) return url;

  const parsed = parse(url);
  if (!parsed || !parsed.hostname.endsWith("cloudinary.com")) return url;

  const path = parsed.pathname;
  // SVG logos and animated GIFs are delivered as uploaded
  if (UNTOUCHED_EXT.test(path)) return url;

  const marker = `/${kind}/upload/`;
  const at = path.indexOf(marker);
  if (at === -1) return url;

  const head = path.slice(0, at + marker.length);
  const tail = path
    .slice(at + marker.length)
    .replace(kind === "image" ? RASTER_EXT : VIDEO_EXT, "");

  parsed.pathname = `${head}${params}/${tail}`;
  return parsed.toString();
}

/**
 * Returns the URL for an image at roughly the requested width.
 *   Cloudinary : adds automatic format and quality, and a width limit (never enlarges).
 *   Unsplash   : sets the width parameter (development placeholders).
 *   Anything else (a local /path or another site) : returned unchanged.
 */
export function imageUrl(url: string, width: number): string {
  const w = Math.max(16, Math.round(width));
  const parsed = parse(url);
  if (!parsed) return url;

  if (parsed.hostname.endsWith("cloudinary.com")) {
    return transform(url, "image", `f_auto,q_${IMAGE_QUALITY},c_limit,w_${w}`);
  }
  if (parsed.hostname === "images.unsplash.com") {
    parsed.searchParams.set("w", String(w));
    return parsed.toString();
  }
  return url;
}

/** Returns the URL for a Cloudinary video with automatic format and quality. */
export function videoUrl(url: string, width = 1600): string {
  return transform(url, "video", `f_auto,q_auto,c_limit,w_${Math.round(width)}`);
}